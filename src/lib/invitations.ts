import type { Metadata } from "next";
import { weddingShareImage } from "@/lib/site";

export type InvitationSide = "groom" | "bride";

export const families = {
  groom: {
    label: "The groom’s family",
    parents: ["Mr. Thomas T A", "Mrs. Sophy Thomas"],
    parentNames: ["Thomas", "Sophy"],
    siblings: ["Midhun & Sibiya", "Minnu & Rince"],
  },
  bride: {
    label: "The bride’s family",
    parents: ["Mr. Surendran V. M.", "Mrs. Sandhya Surendran"],
    parentNames: ["Surendran", "Sandhya"],
    siblings: ["Archana & Akash"],
  },
};

const people = {
  groom: { firstName: "Mibin", surname: "Thomas", initial: "m" },
  bride: { firstName: "Aswathi", surname: "Surendran", initial: "a" },
};

export function getInvitation(side: InvitationSide) {
  const otherSide = side === "groom" ? "bride" : "groom";
  const first = people[side];
  const second = people[otherSide];
  const family = families[side];
  return {
    side,
    first,
    second,
    path: `/${side}`,
    label: side === "groom" ? "Groom’s invitation" : "Bride’s invitation",
    action:
      side === "groom" ? "Open Groom’s Invitation" : "Open Bride’s Invitation",
    heading: `${first.firstName} ${first.surname} Weds ${second.firstName} ${second.surname}`,
    fromFamily: `From ${family.label.toLowerCase()}`,
    hostMessage: `With love from ${family.label.toLowerCase()}`,
    signature: `${first.firstName} & ${second.firstName}`,
    familyOrder: [side, otherSide] as InvitationSide[],
    family,
    pdfPath: `/invitations/${side}-invitation.pdf`,
    pdfLabel:
      side === "groom"
        ? "Download Grooms Invitation"
        : "Download Brides Invitation",
    pdfFilename: `${first.firstName}-and-${second.firstName}-${side === "groom" ? "Grooms" : "Brides"}-Invitation.pdf`,
  };
}

export function getInvitationMetadata(side: InvitationSide): Metadata {
  const invitation = getInvitation(side);
  const title = `${invitation.heading} | ${invitation.label}`;
  const description = `With the love and blessings of ${invitation.family.label.toLowerCase()}, join us on 28 December 2026 at 5:00 PM, St. Sebastian’s Church, Koodaranji, Calicut, Kerala.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: "en_IN",
      url: invitation.path,
      images: [weddingShareImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [weddingShareImage],
    },
  };
}
