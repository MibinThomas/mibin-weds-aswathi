import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Heart } from "lucide-react";
import { copy as t } from "@/lib/copy";
import CulturalBlessing from "@/components/CulturalBlessing";
import { getInvitation, type InvitationSide } from "@/lib/invitations";

export default function InvitationWelcome() {
  return (
    <>
      <a className="skip-link" href="#choose-invitation">
        {t.skipChoices}
      </a>
      <header className="welcome-header">
        <Link href="/" className="brand" aria-label={t.home}>
          <span className="brand-monogram">
            m<span>{t.and}</span>a
          </span>
          <span className="brand-caption">
            {t.wedding}
            <br />
            28 . 12 . 2026
          </span>
        </Link>
        <p>{t.twoFamilies}</p>
      </header>
      <main className="invitation-welcome" id="choose-invitation">
        <Image
          className="welcome-garland floral"
          src="/images/floral-garland.png"
          alt=""
          width={1844}
          height={625}
          sizes="(max-width: 600px) 85vw, 420px"
          priority
        />
        <div className="welcome-intro">
          <p className="eyebrow">{t.blessings}</p>
          <h1>
            {t.welcomeTitle}
            <br />
            <em>{t.welcomeEmphasis}</em>
          </h1>
          <CulturalBlessing />
          <p>
            {t.welcomeMessage}
            <br />
            {t.welcomeChoose}
          </p>
        </div>
        <div className="invitation-choices" aria-label={t.chooseFamily}>
          {(["groom", "bride"] as InvitationSide[]).map((side) => {
            const invitation = getInvitation(side);
            return (
              <Link
                href={invitation.path}
                key={side}
                className="invitation-choice"
                aria-label={invitation.action}
              >
                <span className="choice-initial" aria-hidden="true">
                  {invitation.first.initial}
                </span>
                <p className="eyebrow">{invitation.fromFamily}</p>
                <h2>
                  {invitation.first.firstName}
                  <span>{t.weds}</span>
                  {invitation.second.firstName}
                </h2>
                <p className="choice-parents">
                  {invitation.family.parents.map((parent) => (
                    <span key={parent}>{parent}</span>
                  ))}
                </p>
                <span className="choice-action">
                  {invitation.action}
                  <ArrowUpRight size={17} />
                </span>
              </Link>
            );
          })}
        </div>
        <p className="welcome-date">
          {t.date}
          <span>·</span>
          {t.shortTimeZone}
          <br />
          <span className="welcome-venue">{t.venue}</span>
        </p>
      </main>
      <footer className="welcome-footer">
        <Heart size={12} strokeWidth={1.2} />
        <p>{t.welcomeFooter}</p>
      </footer>
    </>
  );
}
