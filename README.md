# Halden — AI Executive Assistant Platform
> **Demo Prototype & Technical Architecture Specification**  
> *Built for Freelance Bid Review · 1 Oct 2026 · Candidate: Shahzaib Rajpoot Khan*

---

## 1. Executive Summary

Halden is an AI executive assistant and cross-holding management platform engineered for a founder running multiple business entities (**Northgate Freight**, **Ashby & Vale Hotels**, and **Kestrel Property Group**).

### Core Architectural Promise:
> **"Nothing is sent without human approval; every action is logged."**

The platform addresses the CEO's critical anxieties regarding AI autonomy:
1. **Unchecked Send Risk:** AI agents can draft agreements, emails, and plans, but possess **zero credentials to dispatch messages independently**.
2. **Data & Reputational Leaks:** Multi-tenant **PostgreSQL Row-Level Security (RLS)** guarantees strict isolation between holding companies and restricts sensitive personnel matters (e.g. severance agreements) to verified roles.
3. **Google Workspace OAuth Verification Discipline:** Scoped to least-privilege standards (`drive.file`, read-only calendar) with staged verification documentation for CASA Tier 2 approval.
4. **Forensic Auditability:** An append-only, immutable audit trail with cryptographic before/after mutation diffs.

---

## 2. Signature "Under the Hood" Trust Layer

Accessible via the topbar or by pressing <kbd>I</kbd> anywhere in the application:
- **State Machine Inspector:** Real-time visualization of the approval state:
  $$\text{Drafted} \xrightarrow{\text{submit}} \text{Pending} \xrightarrow{\text{approve}} \text{Approved} \xrightarrow{\text{send}} \text{Sending (10s recall)} \xrightarrow{\text{dispatch}} \text{Sent}$$
  *Invariant:* No transition from `Drafted` $\to$ `Sent` exists.
- **Policy Inspector:** Live PostgreSQL 15+ Row-Level Security policy definitions demonstrating tenant boundaries and dynamic JWT claim evaluations.
- **Scope Inspector:** Granular toggles to simulate revoking Google Workspace permissions and test graceful degradation.
- **Audit Stream:** High-resolution JSON payload inspector for all system mutations.

---

## 3. Mock Layer $\to$ Production Implementation Mapping

Halden is delivered as a zero-dependency static export (or Next.js dev server), persisting session state in `sessionStorage` with instant reset capabilities. Below is the 1:1 mapping from this demo to the production build:

| Demo Layer (`lib/mock/*`) | Production Counterpart | Production Purpose & Guarantees |
| :--- | :--- | :--- |
| `policy.ts` (`canSeeTask`, `canSeeApproval`) | **Supabase PostgreSQL RLS Policies** | Evaluates `auth.jwt() ->> 'role'` and membership tables at the query engine level. Client cannot bypass. |
| `store.ts` (`approveItem`, 10s recall) | **Next.js Server Actions + Redis / QStash Queue** | Enqueues a delayed job (10,000ms delay) before invoking Google Gmail API `messages.send`. Allows atomic undo. |
| `agents.ts` (`startAgentRun`) | **Inngest / Trigger.dev Background Workers** | Executes Anthropic Claude 3.5 Sonnet tool loops with bounded iteration limits and tool-call sandboxing. |
| `integrations.ts` (`toggleScope`) | **Google OAuth 2.0 PKCE + Token Vault** | Stores encrypted refresh tokens in Supabase Vault; enforces least privilege. |
| `activity.ts` (`dispatchAction`) | **PostgreSQL Write-Ahead Audit Table** | Append-only table with row triggers preventing `UPDATE` and `DELETE` operations. |
| `clock.ts` (`DEMO_NOW`) | **UTC Server Timestamp Clock** | Prevents client clock skew from affecting contract deadlines and audit timestamps. |

---

## 4. Key Workflows to Test in the Demo

1. **Superhuman Approval Flow (<kbd>A</kbd> / <kbd>R</kbd>):**
   - On `/app`, observe the **5 need you** queue. Press <kbd>A</kbd> to approve the top draft.
   - Observe the **10-second recall countdown ring**. Click **Undo** to recall the draft back to `Pending`.
2. **Try to Bypass the Gate:**
   - On `/` (Trust by design tab) or in `/app/approvals`, try sending an unapproved draft.
   - The button shakes and displays: `Blocked: draft is Pending. Needs approval from Owner.`
3. **Multi-Tenant Row-Level Security Live Redaction:**
   - Switch role to **Finance lead** or **Contractor** via the user menu in the sidebar or Inspector.
   - Observe restricted tasks (`T-901`, `T-902`) and drafts disappear instantly from lists, search, and activity logs.
4. **Autonomous AI Delegation with Tool-Call Traces:**
   - On `/app/tasks`, click task `T-201`, choose **Assign to an agent**, and watch the step-by-step trace stream.
   - The result lands in `/app/approvals` as `Pending`, citing linked Drive leases and Gmail threads.
5. **Executive Voice Brief & Voice Fill:**
   - Hold <kbd>Space</kbd> or click **Voice** in the topbar.
   - Listen to the synthesized 2-minute morning briefing with karaoke caption tracking.
   - Tap voice command chips to execute verified actions.

---

## 5. Technology Stack & Verification

- **Framework:** Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Design Tokens:** Warm paper palette (`#F6F3EE`), Newsreader serif typography, Hanken Grotesk UI, IBM Plex Mono
- **State Management:** Zustand with custom persistence and selector caching
- **Accessibility:** Full keyboard operability (<kbd>A</kbd>, <kbd>R</kbd>, <kbd>I</kbd>, <kbd>⌘K</kbd>, <kbd>Space</kbd>, <kbd>?</kbd>), ARIA live announcements, focus trapping
- **Build Status:** 66/66 static routes prerendered cleanly. Total first-load JS is 87.2 kB (substantially below the 180 kB budget).
