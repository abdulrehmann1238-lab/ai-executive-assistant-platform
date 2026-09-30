import TasksPage from "../page";
import { SEED_TASKS } from "@/lib/mock/db";

export function generateStaticParams() {
  return SEED_TASKS.map((t) => ({ id: t.id }));
}

export default function TaskDetailPage() {
  return <TasksPage />;
}
