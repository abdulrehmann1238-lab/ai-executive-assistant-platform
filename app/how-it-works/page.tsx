"use client";

import React from "react";
import Link from "next/link";
import { BRAND } from "@/config/brand";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  CheckCircle,
  FileCheck,
  Calendar,
  AlertTriangle,
  GitBranch,
  Layers,
  Key,
} from "lucide-react";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-bg text-ink font-sans selection:bg-primary-t selection:text-primary">
      {/* Top Navbar */}
      <header className="h-16 border-b border-line bg-surface/80 backdrop-blur-sm sticky top-0 z-sticky px-6 sm:px-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-2.5 h-2.5 bg-accent rounded-xs transition-transform group-hover:scale-110" />
          <span className="font-serif text-[22px] font-medium text-ink tracking-tight">
            {BRAND.name}
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/" className="text-[13px] text-ink-3 hover:text-ink hidden sm:inline">
            Back to Overview
          </Link>
          <Link href="/demo">
            <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Open the live demo
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 sm:py-16 space-y-16">
        {/* Title */}
        <div className="space-y-4">
          <Badge variant="accent" size="sm">Technical Architecture & Bid Proposals</Badge>
          <h1 className="font-serif text-[2.75rem] font-normal text-ink leading-tight">
            How Halden Protects the Executive Inbox
          </h1>
          <p className="text-[16px] text-ink-2 leading-relaxed">
            Detailed answers to the four core back-end engineering pillars: the approval state machine, Google OAuth verification, row-level security boundaries, and delivery roadmap.
          </p>
        </div>

        {/* Section 1: Approval Workflow */}
        <section id="workflow" className="space-y-6 pt-6 border-t border-line">
          <div className="flex items-center gap-2.5 text-primary">
            <GitBranch className="w-5 h-5" />
            <h2 className="font-serif text-[1.75rem] font-medium text-ink">
              1. The "AI Drafts, Human Approves, Then It Sends" State Machine
            </h2>
          </div>

          <p className="text-[14px] text-ink-2 leading-relaxed">
            Many AI integrations fail in executive contexts because LLMs are granted write/send permissions directly. In Halden, agents are sandboxed: they can search Drive and read Gmail threads to produce candidate text, but they possess <strong>zero network credentials to execute an external send</strong>.
          </p>

          {/* Drawn State Machine Visualizer */}
          <div className="p-6 bg-elevated border border-line rounded-lg shadow-sh-1 space-y-4">
            <h4 className="text-[12px] font-semibold uppercase tracking-wider text-ink-3">
              Enforced State Transitions:
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-center text-[12px] font-mono">
              <div className="p-3 bg-surface border border-line rounded-sm">
                <span className="font-bold text-ink block">Drafted</span>
                <span className="text-[10px] text-ink-3">By Agent</span>
              </div>
              <div className="p-3 bg-accent-t/40 border border-accent/40 rounded-sm">
                <span className="font-bold text-accent block">Pending</span>
                <span className="text-[10px] text-ink-3">Needs Human</span>
              </div>
              <div className="p-3 bg-primary-t border border-primary/30 rounded-sm">
                <span className="font-bold text-primary block">Approved</span>
                <span className="text-[10px] text-ink-3">Owner Signed</span>
              </div>
              <div className="p-3 bg-surface border border-line rounded-sm">
                <span className="font-bold text-ink block">Sending</span>
                <span className="text-[10px] text-accent">10s Recall Ring</span>
              </div>
              <div className="p-3 bg-[#E2EFE7] border border-[#CBE2D4] rounded-sm">
                <span className="font-bold text-success block">Sent</span>
                <span className="text-[10px] text-ink-3">Gmail API</span>
              </div>
            </div>

            <div className="p-4 bg-sunken rounded-md text-[12px] text-ink-2 space-y-2">
              <div><strong>Invariant 1:</strong> No code path exists from <code className="font-mono">Drafted → Sent</code>.</div>
              <div><strong>Invariant 2:</strong> Transition to <code className="font-mono">Sending</code> requires cryptographic validation of the owner's session token and an active <code className="font-mono">gmail.send</code> grant.</div>
              <div><strong>Invariant 3:</strong> 10-second server delayed send queue enables one-click Undo recall before SMTP dispatch.</div>
            </div>
          </div>
        </section>

        {/* Section 2: Google OAuth */}
        <section id="oauth" className="space-y-6 pt-6 border-t border-line">
          <div className="flex items-center gap-2.5 text-primary">
            <Key className="w-5 h-5" />
            <h2 className="font-serif text-[1.75rem] font-medium text-ink">
              2. Google Workspace OAuth & CASA Verification Plan
            </h2>
          </div>

          <p className="text-[14px] text-ink-2 leading-relaxed">
            Google Workspace OAuth review for Gmail scopes (<code className="font-mono text-[12px]">gmail.readonly</code>, <code className="font-mono text-[12px]">gmail.send</code>) is famously rigorous. We employ least-privilege scoping to ensure rapid passing:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-elevated border border-line rounded-lg shadow-sh-1 space-y-2">
              <Badge variant="info" size="sm">Sensitive Class</Badge>
              <h4 className="font-serif text-[15px] font-medium text-ink">Drive File & Calendar Scopes</h4>
              <p className="text-[12px] text-ink-3">
                Using <code className="font-mono text-[11px]">drive.file</code> rather than full <code className="font-mono text-[11px]">drive.readonly</code> restricts agent access exclusively to files explicitly selected by the user. Fast review tier.
              </p>
            </div>

            <div className="p-5 bg-elevated border border-line rounded-lg shadow-sh-1 space-y-2">
              <Badge variant="error" size="sm">Restricted Class</Badge>
              <h4 className="font-serif text-[15px] font-medium text-ink">Gmail Send & Read Scopes</h4>
              <p className="text-[12px] text-ink-3">
                Requires CASA Tier 2 Cloud Application Security Assessment. Architecture ensures raw email bodies are never stored in external vector databases.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Security & RLS */}
        <section id="security" className="space-y-6 pt-6 border-t border-line">
          <div className="flex items-center gap-2.5 text-primary">
            <Lock className="w-5 h-5" />
            <h2 className="font-serif text-[1.75rem] font-medium text-ink">
              3. Security Posture & Multi-Tenant PostgreSQL RLS
            </h2>
          </div>

          <p className="text-[14px] text-ink-2 leading-relaxed">
            When an owner runs multiple entities (e.g. Northgate Freight, Ashby & Vale Hotels, Kestrel Property Group), tenant isolation is essential. One contractor visibility leak is a reputational catastrophe.
          </p>

          <div className="p-5 bg-elevated border border-line rounded-lg shadow-sh-1 space-y-4">
            <div className="text-[12px] font-mono text-ink-3 uppercase tracking-wider">
              Architecture Highlights:
            </div>
            <ul className="space-y-2 text-[13px] text-ink-2 list-disc pl-5">
              <li><strong>Row-Level Security (Postgres):</strong> Enforced at the database engine level, not in application middleware. Even if an API endpoint forgets a filter, the database returns 0 rows.</li>
              <li><strong>Prompt Injection Resilience:</strong> External email bodies are treated as untrusted data inputs. They are enclosed in strict semantic delimiters and cannot trigger agent actions without human review.</li>
              <li><strong>Append-Only Audit Trail:</strong> Every state change writes an immutable audit record with actor ID, policy, and cryptographic before/after diffs.</li>
            </ul>
          </div>
        </section>

        {/* Section 4: Timeline */}
        <section id="timeline" className="space-y-6 pt-6 border-t border-line">
          <div className="flex items-center gap-2.5 text-primary">
            <Calendar className="w-5 h-5" />
            <h2 className="font-serif text-[1.75rem] font-medium text-ink">
              4. Implementation Roadmap & Weekly Demo Cadence
            </h2>
          </div>

          <div className="space-y-4">
            {[
              { phase: "Phase 1: Foundation", duration: "Week 1", goal: "Supabase schema, multi-tenant RLS policies, Next.js App Router shell, and auth roles." },
              { phase: "Phase 2: Approvals & AI Drafting", duration: "Week 2", goal: "Approval queue, Claude 3.5 Sonnet tool-calling worker, state-machine send guards, and audit log." },
              { phase: "Phase 3: Google Workspace Integration", duration: "Week 3", goal: "Google OAuth 2.0 PKCE flow, Gmail/Drive/Calendar sync, least-privilege tokens, and CASA verification prep." },
              { phase: "Phase 4: Voice & Meeting Prep", duration: "Week 4", goal: "Web Speech API executive voice briefs, meeting prep briefs, action-item extraction, and Webex integration." },
            ].map((p, idx) => (
              <div key={idx} className="p-4 bg-elevated border border-line rounded-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-medium text-ink text-[15px]">{p.phase}</span>
                    <Badge variant="neutral" size="sm">{p.duration}</Badge>
                  </div>
                  <p className="text-[12px] text-ink-3 mt-1">{p.goal}</p>
                </div>
                <Badge variant="success" size="sm">Weekly Demo Checkpoint</Badge>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Banner */}
        <div className="p-8 bg-surface border border-line rounded-lg text-center space-y-4">
          <h3 className="font-serif text-[1.75rem] font-normal text-ink">
            Experience the system in action.
          </h3>
          <p className="text-[14px] text-ink-3 max-w-md mx-auto">
            Interact with the working prototype, inspect RLS policies, and test the 10-second approval recall window.
          </p>
          <Link href="/demo">
            <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Open the live demo
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
