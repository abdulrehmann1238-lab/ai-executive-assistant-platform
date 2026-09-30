import MeetingsPage from "../page";
import { SEED_MEETINGS } from "@/lib/mock/db";

export function generateStaticParams() {
  return SEED_MEETINGS.map((m) => ({ id: m.id }));
}

export default function MeetingDetailPage() {
  return <MeetingsPage />;
}
