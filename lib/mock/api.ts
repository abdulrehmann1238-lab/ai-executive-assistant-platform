/**
 * Halden Mock API Service
 * 
 * Note on Architecture & Honesty:
 * This layer simulates backend endpoints with controlled network latency.
 * Each mock function directly maps to production services planned for the full build:
 * - fetchTasks()        -> Supabase Postgres `tasks` table with RLS policy
 * - approveDraft()       -> Next.js Server Action / Edge function enforcing JWT claims + Google OAuth gmail.send
 * - executeAgentRun()   -> Background worker (Inngest / Trigger.dev) executing Claude 3.5 Sonnet tool loops
 * - syncGoogleWorkspace() -> OAuth 2.0 refresh flow with Google Workspace API
 */

import { Task, ApprovalItem, AgentRun, ActivityEvent } from "./db";
import { Role } from "./policy";

export const delay = (ms: number, isSlow = false) =>
  new Promise((resolve) => setTimeout(resolve, isSlow ? ms * 4 : ms));

export async function mockFetchTasks(role: Role, isSlow = false): Promise<Task[]> {
  await delay(280, isSlow);
  // Production mapping: `supabase.from('tasks').select('*')`
  return [];
}

export async function mockApproveDraft(
  draftId: string,
  approvedBy: string,
  isSlow = false
): Promise<{ success: boolean; eventId: string }> {
  await delay(450, isSlow);
  // Production mapping: `/api/approvals/[id]/approve` -> verify JWT -> enqueue send job with 10s delay
  return {
    success: true,
    eventId: "act-" + Math.floor(Math.random() * 1000),
  };
}

export async function mockSimulateAgentToolCall(
  toolName: string,
  input: string,
  isSlow = false
): Promise<{ output: string; durationMs: number }> {
  const duration = isSlow ? 2400 : 800;
  await delay(duration, false);
  return {
    output: `Executed ${toolName} with parameters: "${input}"`,
    durationMs: duration,
  };
}
