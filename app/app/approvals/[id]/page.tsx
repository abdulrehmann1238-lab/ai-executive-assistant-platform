import ApprovalsPage from "../page";
import { SEED_APPROVALS } from "@/lib/mock/db";

export function generateStaticParams() {
  return SEED_APPROVALS.map((a) => ({ id: a.id }));
}

export default function ApprovalDetailPage() {
  return <ApprovalsPage />;
}
