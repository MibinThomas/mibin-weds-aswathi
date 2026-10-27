import WeddingInvitation from "@/components/WeddingInvitation";
import { getInvitationMetadata } from "@/lib/invitations";

export const metadata = getInvitationMetadata("bride");

export default function BrideInvitationPage() {
  return <WeddingInvitation side="bride" />;
}
