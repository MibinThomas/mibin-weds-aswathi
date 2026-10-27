"""Create family-specific PDFs using the original card's artwork and embedded fonts.

Run from the repository root with Python and PyMuPDF installed:
    python scripts/generate-invitations.py
Names and relatives come from the same TypeScript data used by the website.
"""

import json
import pathlib
import re
import subprocess

import pymupdf

ROOT = pathlib.Path(__file__).resolve().parents[1]
SOURCE = next((ROOT / "public").glob("*.pdf"))
OUTPUT = ROOT / "public" / "invitations"


def invitation_data():
    script = """
const fs = require('fs'), ts = require('typescript'), vm = require('vm');
const target = {};
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/lib/invitations.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
}).outputText, { exports: target });
process.stdout.write(JSON.stringify(['groom','bride'].map(side => ({
  ...target.getInvitation(side), families: target.families
}))));
"""
    result = subprocess.run(["node", "-e", script], cwd=ROOT, check=True, capture_output=True)
    return json.loads(result.stdout)


def number_array(value):
    tokens = iter(re.findall(r"\[|\]|-?\d+(?:\.\d+)?", value))

    def read():
        result = []
        for token in tokens:
            if token == "[":
                result.append(read())
            elif token == "]":
                return result
            else:
                result.append(float(token))
        return result

    return read()[0]


class CardFont:
    """Reuse the original CID font, including its exact script glyphs and widths."""

    def __init__(self, doc, xref, alias):
        self.xref, self.alias = xref, alias
        cmap_xref = int(doc.xref_get_key(xref, "ToUnicode")[1].split()[0])
        cmap = doc.xref_stream(cmap_xref).decode("ascii")
        self.characters = {}
        for section in re.findall(r"beginbfrange(.*?)endbfrange", cmap, re.S):
            for start, end, destination in re.findall(r"<([\da-f]+)>\s*<([\da-f]+)>\s*<([\da-f]+)>", section, re.I):
                for cid in range(int(start, 16), int(end, 16) + 1):
                    self.characters[chr(int(destination, 16) + cid - int(start, 16))] = cid
        for section in re.findall(r"beginbfchar(.*?)endbfchar", cmap, re.S):
            for cid, character in re.findall(r"<([\da-f]+)>\s*<([\da-f]+)>", section, re.I):
                self.characters[bytes.fromhex(character).decode("utf-16-be")] = int(cid, 16)
        descendant = int(re.search(r"\d+", doc.xref_get_key(xref, "DescendantFonts")[1])[0])
        self.default_width = float(doc.xref_get_key(descendant, "DW")[1])
        widths = number_array(doc.xref_get_key(descendant, "W")[1])
        self.widths = {}
        i = 0
        while i < len(widths):
            first, following = int(widths[i]), widths[i + 1]
            if isinstance(following, list):
                self.widths.update({first + offset: width for offset, width in enumerate(following)})
                i += 2
            else:
                self.widths.update({cid: widths[i + 2] for cid in range(first, int(following) + 1)})
                i += 3

    def width(self, text, size):
        return sum(self.widths.get(self.characters[c], self.default_width) for c in text) * size / 1000

    def draw(self, text, x, y, size, color, page_height, centered=True):
        missing = set(text) - self.characters.keys()
        if missing:
            raise ValueError(f"Original font {self.alias} lacks characters: {missing!r}")
        if centered:
            x -= self.width(text, size) / 2
        encoded = "".join(f"{self.characters[c]:04x}" for c in text)
        r, g, b = pymupdf.sRGB_to_pdf(color)
        return f"q BT /{self.alias} {size:.6f} Tf {r:.6f} {g:.6f} {b:.6f} rg 1 0 0 1 {x:.6f} {page_height-y:.6f} Tm <{encoded}> Tj ET Q\n"


def generate(data):
    doc = pymupdf.open(SOURCE)
    page = doc[0]
    original_spans = [span for block in page.get_text("dict")["blocks"] for line in block.get("lines", []) for span in line["spans"]]
    definitions = {row[3].split("+")[-1]: row[0] for row in page.get_fonts()}
    fonts = {
        "script": CardFont(doc, definitions["ShelleyScriptLTCYR"], "InviteScript"),
        "regular": CardFont(doc, definitions["GlacialIndifference-Regular"], "InviteRegular"),
        "bold": CardFont(doc, definitions["GlacialIndifference-Bold"], "InviteBold"),
        "heading": CardFont(doc, definitions["BalooChettan-Regular"], "InviteHeading"),
    }
    # Transparent, text-only redaction preserves all original vector and image artwork.
    for rect in [(25, 60, 180, 132), (244, 67, 392, 108), (245, 122, 389, 180)]:
        page.add_redact_annot(pymupdf.Rect(rect), fill=False)
    page.apply_redactions(images=0, graphics=0)
    # Redaction moves the surviving artwork into a form XObject. Add the
    # original fonts to the page's new resources for the replacement text.
    doc.xref_set_key(page.xref, "Resources/Font", "<<" + " ".join(f"/{font.alias} {font.xref} 0 R" for font in fonts.values()) + ">>")
    height, color = page.rect.height, 4089225
    commands = []

    def draw(font, text, x, y, size, centered=True):
        commands.append(fonts[font].draw(text, x, y, size, color, height, centered))

    first, second = data["first"], data["second"]
    draw("bold", data["family"]["label"].upper(), 101.433, 68.492, 5.37662)
    draw("script", f"{first['firstName']} {first['surname']}", 101.433, 89.421, 19.1902)
    draw("script", "&", 101.433, 108.402, 19.1902)
    draw("script", f"{second['firstName']} {second['surname']}", 101.433, 125.185, 19.1902)

    draw("heading", "WITH THE LOVE AND BLESSINGS OF", 318.11, 75.753, 5.72632)
    draw("heading", "THE GROOM AND HIS LOVED ONES" if data["side"] == "groom" else "THE BRIDE AND HER LOVED ONES", 318.11, 83.485, 5.72632)
    for span in original_spans:
        if 89 < span["bbox"][1] < 106 and span["bbox"][0] > 240:
            draw("regular", span["text"], *span["origin"], span["size"], centered=False)

    for family_side, center in zip(data["familyOrder"], [279.62, 356.59]):
        family = data["families"][family_side]
        draw("bold", family["label"].upper(), center, 130.282, 5.37662)
        for text, baseline in zip(family["parents"] + family["siblings"], [142.702, 153.92, 165.138, 176.356]):
            draw("regular", text, center, baseline, 4.8077)

    page.wrap_contents()
    stream = doc.get_new_xref()
    doc.update_object(stream, "<<>>")
    doc.update_stream(stream, "".join(commands).encode("ascii"))
    contents = page.get_contents()
    doc.xref_set_key(page.xref, "Contents", "[" + " ".join(f"{xref} 0 R" for xref in contents + [stream]) + "]")

    # The supplied card omitted the year; keep the date unambiguous in both copies.
    year_size = 3.6
    year_width = pymupdf.get_text_length("2026", fontname="tiro", fontsize=year_size)
    page.insert_text((101.433-year_width/2, 183.0), "2026", fontsize=year_size, fontname="tiro", color=pymupdf.sRGB_to_pdf(color))
    doc.set_metadata({"title": f"{data['heading']} | {data['label']}", "author": data["family"]["label"], "subject": "Wedding invitation - 28 December 2026, 5:00 PM - St. Sebastian's Church, Koodaranji", "creator": "Mibin & Aswathi Wedding", "keywords": f"wedding, {data['side']}, invitation, blue floral"})
    OUTPUT.mkdir(exist_ok=True)
    output = OUTPUT / f"{data['side']}-invitation.pdf"
    doc.save(output, garbage=4, deflate=True)
    doc.close()
    print(output.relative_to(ROOT))


if __name__ == "__main__":
    for invitation in invitation_data():
        generate(invitation)
