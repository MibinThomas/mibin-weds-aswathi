import WeddingInvitation from "@/components/WeddingInvitation";
import { getInvitationMetadata } from "@/lib/invitations";

export const metadata = getInvitationMetadata("groom");

export default function GroomInvitationPage() {
  return <WeddingInvitation side="groom" />;
}
