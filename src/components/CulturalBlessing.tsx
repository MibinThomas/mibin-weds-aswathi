import { copy as t } from "@/lib/copy";

export default function CulturalBlessing() {
  return (
    <div className="cultural-blessing" role="img" aria-label={t.motif}>
      <span className="blessing-line" aria-hidden="true" />
      <svg
        className="blessing-cross"
        width="19"
        height="27"
        viewBox="0 0 24 32"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path d="M12 3v26M4 11h16" />
      </svg>
      <span className="blessing-dot" aria-hidden="true" />
      <svg
        className="blessing-lotus"
        width="31"
        height="27"
        viewBox="0 0 36 32"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M18 25C9 19 12 10 18 5c6 5 9 14 0 20Z" />
        <path d="M18 25C9 25 5 19 5 12c6 0 10 4 13 9M18 25c9 0 13-6 13-13-6 0-10 4-13 9" />
        <path d="M18 25C9 29 3 24 2 18l5 1M18 25c9 4 15-1 16-7l-5 1M12 29h12" />
      </svg>
      <span className="blessing-line" aria-hidden="true" />
    </div>
  );
}
