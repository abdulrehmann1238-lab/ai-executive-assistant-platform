"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BRAND } from "@/config/brand";
import { Preloader } from "@/components/site/Preloader";
import { HeroFrame } from "@/components/site/HeroFrame";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Lock,
  GitBranch,
  Calendar,
  Mail,
  FolderOpen,
  Eye,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import clsx from "clsx";

export default function LandingPage() {
  const [preloaderDone, setPreloaderDone] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Trust by design interactive mini-demo state
  const [trustTab, setTrustTab] = useState<"gate" | "roles" | "audit">("gate");
  const [gateBlockedMessage, setGateBlockedMessage] = useState(false);
  const [gateShake, setGateShake] = useState(false);
  const [previewRole, setPreviewRole] = useState<"Owner" | "Finance lead" | "Contractor">("Owner");
  const [miniAuditLogs, setMiniAuditLogs] = useState<string[]>([
    "09:12 Drafter submitted A-501 for approval",
    "09:10 Drafter searched Drive 'Lease_Harlow_2023.pdf'",
  ]);

  // Phase timeline state
  const [expandedPhase, setExpandedPhase] = useState<number | null>(0);

  // Contact form state
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactNotes, setContactNotes] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleTrySendWithoutApproval = () => {
    setGateShake(true);
    setGateBlockedMessage(true);
    setTimeout(() => setGateShake(false), 500);
  };

  const handleMiniApproveAudit = () => {
    const now = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
    setMiniAuditLogs((prev) => [
      `${now} Elena Marchetti approved draft A-501 (Status: Approved)`,
      ...prev,
    ]);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setFormSubmitted(true);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-bg text-ink font-sans selection:bg-primary-t selection:text-primary">
      {/* 6.1 Preloader Entry Sequence */}
      <Preloader onComplete={() => setPreloaderDone(true)} />

      {/* Top Bar (Sticky) */}
      <header
        className={clsx(
          "fixed top-0 left-0 right-0 h-16 z-nav px-6 sm:px-12 flex items-center justify-between transition-all duration-med",
          scrolled
            ? "bg-surface/90 backdrop-blur-sm border-b border-line shadow-sh-1"
            : "bg-transparent"
        )}
      >
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-2.5 h-2.5 bg-accent rounded-xs transition-transform group-hover:scale-110" />
          <span className="font-serif text-[22px] font-medium text-ink tracking-tight">
            {BRAND.name}
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-[13px] text-ink-2 font-medium">
          <a href="#problem" className="hover:text-ink transition-colors">Problem</a>
          <a href="#story" className="hover:text-ink transition-colors">How it works</a>
          <a href="#trust" className="hover:text-ink transition-colors">Trust Architecture</a>
          <a href="#phases" className="hover:text-ink transition-colors">Phases</a>
          <Link href="/how-it-works" className="hover:text-ink transition-colors">
            Bid Proposal Answers
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/demo">
            <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              Open the live demo
            </Button>
          </Link>
        </div>
      </header>

      {/* 1. Hero Section (100svh, min 640px) */}
      <section className="relative min-h-[100svh] pt-24 pb-16 px-6 sm:px-12 max-w-7xl mx-auto flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left 6-7 cols copy */}
          <div className="lg:col-span-6 space-y-6 animate-in fade-in duration-med">
            <Badge variant="accent" size="sm">
              AI Executive Assistant Platform · Freelance Bid Demo
            </Badge>

            <h1 className="font-serif text-[clamp(2.5rem,5.2vw,4.5rem)] font-normal text-ink leading-[1.04] tracking-[-0.02em]">
              Every decision that needs you. <br />
              <span className="italic">Nothing sent without you.</span>
            </h1>

            <p className="text-[17px] sm:text-[18px] text-ink-2 max-w-[52ch] leading-relaxed">
              An executive assistant for people who run several companies. Autonomous AI agents draft the emails, agreements, and plans into an approval queue. You approve them. Every action is logged.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link href="/demo">
                <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Open the live demo
                </Button>
              </Link>
              <a href="#story">
                <Button variant="secondary" size="lg">
                  See the approval flow
                </Button>
              </a>
            </div>

            <div className="flex items-center gap-6 pt-4 text-[12px] text-ink-3">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-primary" /> Hard approval gate
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-accent" /> Row-level security
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-info" /> 10s recall window
              </span>
            </div>
          </div>

          {/* Right 5-6 cols: Live HeroFrame Loop */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <HeroFrame />
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-1 text-[11px] font-mono text-ink-3">
          <span>Scroll to explore</span>
          <div className="w-[1px] h-8 bg-line relative overflow-hidden">
            <div className="w-full h-2 bg-accent animate-bounce" />
          </div>
        </div>
      </section>

      {/* 2. The Problem (Quiet Strip) */}
      <section id="problem" className="border-y border-line bg-surface/60 py-16 px-6 sm:px-12">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="space-y-1">
              <div className="font-serif text-[3rem] font-normal text-ink leading-none">3</div>
              <div className="font-serif text-[1.25rem] text-ink-2">Holdings & Companies</div>
              <p className="text-[13px] text-ink-3">Northgate Freight, Ashby & Vale, Kestrel Property</p>
            </div>
            <div className="space-y-1">
              <div className="font-serif text-[3rem] font-normal text-ink leading-none">47</div>
              <div className="font-serif text-[1.25rem] text-ink-2">Active Open Loops</div>
              <p className="text-[13px] text-ink-3">Scattered across vendor invoices, leases, and contracts</p>
            </div>
            <div className="space-y-1">
              <div className="font-serif text-[3rem] font-normal text-accent leading-none">9</div>
              <div className="font-serif text-[1.25rem] text-ink-2">Decisions Waiting on You</div>
              <p className="text-[13px] text-ink-3">Bottlenecks where nobody else has authority to sign</p>
            </div>
          </div>

          <div className="pt-6 border-t border-line text-center">
            <p className="font-serif text-[1.5rem] italic text-ink-2">
              "Most of it is not hard. It is waiting."
            </p>
          </div>
        </div>
      </section>

      {/* 3. One Decision, End to End (Walkthrough) */}
      <section id="story" className="py-24 px-6 sm:px-12 max-w-6xl mx-auto space-y-16">
        <div className="space-y-3 text-center max-w-xl mx-auto">
          <Badge variant="accent" size="sm">Execution Spine</Badge>
          <h2 className="font-serif text-[2.5rem] font-normal text-ink leading-tight">
            One decision, end to end.
          </h2>
          <p className="text-[14px] text-ink-3">
            How Halden takes an urgent commercial lease renewal and shepherds it safely into the outbox.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-6 bg-elevated border border-line rounded-lg shadow-sh-1 space-y-3">
            <div className="w-8 h-8 rounded-full bg-sunken flex items-center justify-center font-mono text-[13px] font-bold text-ink">
              1
            </div>
            <h3 className="font-serif text-[1.25rem] font-medium text-ink">Task Ingested</h3>
            <p className="text-[13px] text-ink-3 leading-relaxed">
              T-201 arrives: Harlow & Sons 12-month extension at Unit 4B. Assigned to Drafter agent.
            </p>
          </div>

          <div className="p-6 bg-elevated border border-line rounded-lg shadow-sh-1 space-y-3">
            <div className="w-8 h-8 rounded-full bg-info/10 text-info flex items-center justify-center font-mono text-[13px] font-bold">
              2
            </div>
            <h3 className="font-serif text-[1.25rem] font-medium text-ink">AI Agent Drafts</h3>
            <p className="text-[13px] text-ink-3 leading-relaxed">
              Drafter searches Drive for past 2023 lease, inspects Gmail negotiation threads, and compiles the response.
            </p>
          </div>

          <div className="p-6 bg-elevated border-2 border-accent rounded-lg shadow-sh-2 space-y-3 relative">
            <span className="absolute -top-3 right-4 px-2 py-0.5 rounded-xs bg-accent text-white font-mono text-[10px] font-bold uppercase">
              Human Gate
            </span>
            <div className="w-8 h-8 rounded-full bg-accent-t text-accent flex items-center justify-center font-mono text-[13px] font-bold">
              3
            </div>
            <h3 className="font-serif text-[1.25rem] font-medium text-ink">Owner Approves</h3>
            <p className="text-[13px] text-ink-2 leading-relaxed">
              Elena reviews terms, edits +3.5% indexing inline if desired, and clicks Approve. 10s recall window begins.
            </p>
          </div>

          <div className="p-6 bg-elevated border border-line rounded-lg shadow-sh-1 space-y-3">
            <div className="w-8 h-8 rounded-full bg-[#E2EFE7] text-success flex items-center justify-center font-mono text-[13px] font-bold">
              4
            </div>
            <h3 className="font-serif text-[1.25rem] font-medium text-ink">Sent & Logged</h3>
            <p className="text-[13px] text-ink-3 leading-relaxed">
              Dispatched via Gmail API. Complete audit record appended to the immutable security log.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Trust by Design (Interactive Live Tabs) */}
      <section id="trust" className="py-20 px-6 sm:px-12 bg-surface/70 border-y border-line">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="space-y-3 text-center max-w-xl mx-auto">
            <Badge variant="accent" size="sm">Verification Layer</Badge>
            <h2 className="font-serif text-[2.5rem] font-normal text-ink leading-tight">
              Trust by design.
            </h2>
            <p className="text-[14px] text-ink-3">
              Don't take security on faith. Test our approval gates, role boundaries, and audit trail below.
            </p>
          </div>

          {/* Interactive Tab Switcher */}
          <div className="flex justify-center border-b border-line gap-4 text-[13px] font-medium">
            <button
              onClick={() => setTrustTab("gate")}
              className={clsx(
                "pb-3 border-b-2 transition-colors",
                trustTab === "gate"
                  ? "border-primary text-primary font-semibold"
                  : "border-transparent text-ink-3 hover:text-ink"
              )}
            >
              1. Approval Gate Test
            </button>
            <button
              onClick={() => setTrustTab("roles")}
              className={clsx(
                "pb-3 border-b-2 transition-colors",
                trustTab === "roles"
                  ? "border-primary text-primary font-semibold"
                  : "border-transparent text-ink-3 hover:text-ink"
              )}
            >
              2. Who Sees What (RLS)
            </button>
            <button
              onClick={() => setTrustTab("audit")}
              className={clsx(
                "pb-3 border-b-2 transition-colors",
                trustTab === "audit"
                  ? "border-primary text-primary font-semibold"
                  : "border-transparent text-ink-3 hover:text-ink"
              )}
            >
              3. Immutable Audit Stream
            </button>
          </div>

          {/* Tab 1: Approval Gate Test */}
          {trustTab === "gate" && (
            <div className="p-8 bg-elevated border border-line rounded-lg shadow-sh-2 max-w-2xl mx-auto space-y-5 animate-in fade-in">
              <h3 className="font-serif text-[1.35rem] font-medium text-ink">
                Simulated Guard: Try to bypass human sign-off
              </h3>
              <p className="text-[13px] text-ink-3 leading-relaxed">
                Click below to simulate an agent attempting an autonomous direct send without human review.
              </p>

              <div className="p-4 bg-surface border border-line rounded-md flex items-center justify-between">
                <div>
                  <span className="font-medium text-ink block text-[13px]">Draft A-501 (Harlow renewal)</span>
                  <span className="text-[11px] font-mono text-accent">State: Pending Approval</span>
                </div>

                <Button
                  onClick={handleTrySendWithoutApproval}
                  variant="primary"
                  size="sm"
                  className={clsx(gateShake && "animate-shake")}
                >
                  Try Send Without Approval
                </Button>
              </div>

              {gateBlockedMessage && (
                <div className="p-3.5 bg-[#F6E1DD] border border-[#ECC6C0] text-error rounded-md text-[13px] font-medium animate-in fade-in flex items-center gap-2">
                  <Lock className="w-4 h-4 shrink-0" />
                  <span>Blocked: draft is Pending. State machine invariant prohibits unapproved send.</span>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Who Sees What */}
          {trustTab === "roles" && (
            <div className="p-8 bg-elevated border border-line rounded-lg shadow-sh-2 max-w-2xl mx-auto space-y-5 animate-in fade-in">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-[1.35rem] font-medium text-ink">
                  Row-Level Security Live Redaction
                </h3>
                <div className="flex items-center gap-1 bg-sunken p-1 rounded-sm text-[11px]">
                  {(["Owner", "Finance lead", "Contractor"] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setPreviewRole(r)}
                      className={clsx(
                        "px-2.5 py-1 rounded-xs transition-colors",
                        previewRole === r ? "bg-primary text-white font-medium" : "text-ink-3 hover:text-ink"
                      )}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="divide-y divide-line border border-line rounded-md bg-surface text-[13px]">
                <div className="p-3 flex items-center justify-between">
                  <span>T-201 Renew Harlow lease (Kestrel)</span>
                  <Badge variant="success" size="sm">Visible</Badge>
                </div>
                <div className="p-3 flex items-center justify-between">
                  <span>T-101 Crown forklift lease (Northgate)</span>
                  <Badge variant="success" size="sm">Visible</Badge>
                </div>
                <div className="p-3 flex items-center justify-between">
                  <span className={clsx(previewRole === "Contractor" && "text-ink-3 line-through")}>
                    T-302 Q4 staffing plan (Ashby & Vale)
                  </span>
                  {previewRole === "Contractor" ? (
                    <Badge variant="error" size="sm" icon={<Lock className="w-3 h-3" />}>Redacted</Badge>
                  ) : (
                    <Badge variant="success" size="sm">Visible</Badge>
                  )}
                </div>
                <div className="p-3 flex items-center justify-between">
                  <span className={clsx(previewRole === "Finance lead" && "text-ink-3 line-through")}>
                    T-901 Confidential Separation terms (Ashby & Vale)
                  </span>
                  {previewRole === "Finance lead" ? (
                    <Badge variant="error" size="sm" icon={<Lock className="w-3 h-3" />}>Redacted</Badge>
                  ) : (
                    <Badge variant="warning" size="sm">Legal Counsel Only</Badge>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Immutable Audit Stream */}
          {trustTab === "audit" && (
            <div className="p-8 bg-elevated border border-line rounded-lg shadow-sh-2 max-w-2xl mx-auto space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-[1.35rem] font-medium text-ink">
                  Real-time Append-Only Audit
                </h3>
                <Button onClick={handleMiniApproveAudit} variant="secondary" size="sm">
                  Simulate Approve Action
                </Button>
              </div>

              <div className="p-4 bg-sunken rounded-md border border-line font-mono text-[12px] space-y-2 max-h-48 overflow-y-auto">
                {miniAuditLogs.map((log, i) => (
                  <div key={i} className="text-ink-2">
                    → {log}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 5. Connected, with Least Privilege */}
      <section className="py-20 px-6 sm:px-12 max-w-6xl mx-auto space-y-12">
        <div className="space-y-3 text-center max-w-xl mx-auto">
          <Badge variant="accent" size="sm">Least-Privilege Scopes</Badge>
          <h2 className="font-serif text-[2.5rem] font-normal text-ink leading-tight">
            Connected, with least privilege.
          </h2>
          <p className="text-[14px] text-ink-3">
            We request only the minimum Google permissions necessary, and clearly delineate Sensitive vs Restricted scopes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-elevated border border-line rounded-lg space-y-3">
            <Mail className="w-6 h-6 text-info" />
            <h4 className="font-serif text-[1.25rem] font-medium text-ink">Gmail</h4>
            <div className="font-mono text-[11px] text-ink-3 bg-sunken p-2 rounded-xs">
              gmail.readonly, gmail.send
            </div>
            <p className="text-[13px] text-ink-3">
              Read past correspondence for context. Send permissions are strictly held in human queue.
            </p>
          </div>

          <div className="p-6 bg-elevated border border-line rounded-lg space-y-3">
            <FolderOpen className="w-6 h-6 text-accent" />
            <h4 className="font-serif text-[1.25rem] font-medium text-ink">Google Drive</h4>
            <div className="font-mono text-[11px] text-ink-3 bg-sunken p-2 rounded-xs">
              drive.file
            </div>
            <p className="text-[13px] text-ink-3">
              Restricted exclusively to files explicitly selected or opened by the platform.
            </p>
          </div>

          <div className="p-6 bg-elevated border border-line rounded-lg space-y-3">
            <Calendar className="w-6 h-6 text-primary" />
            <h4 className="font-serif text-[1.25rem] font-medium text-ink">Google Calendar</h4>
            <div className="font-mono text-[11px] text-ink-3 bg-sunken p-2 rounded-xs">
              calendar.events.readonly
            </div>
            <p className="text-[13px] text-ink-3">
              Synthesize daily meeting briefs and contextual agendas across the executive schedule.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Phases & Weekly Demos */}
      <section id="phases" className="py-20 px-6 sm:px-12 bg-surface/60 border-t border-line">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="space-y-3 text-center max-w-xl mx-auto">
            <Badge variant="accent" size="sm">Disciplined Delivery Cadence</Badge>
            <h2 className="font-serif text-[2.5rem] font-normal text-ink leading-tight">
              Phases and weekly demos.
            </h2>
            <p className="text-[14px] text-ink-3">
              Never wait 8 weeks for a big reveal. Each milestone concludes with a working demonstration.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                stage: "Phase 1: Foundation & Trust Schema",
                timeline: "Week 1",
                deliverables: "Multi-tenant Supabase Postgres schema, strict Row-Level Security policies, Next.js App Router shell, and role matrix.",
                checkpoint: "Weekly Demo 1: Working auth switcher demonstrating live row redaction across roles.",
              },
              {
                stage: "Phase 2: Approvals Queue & AI Drafting",
                timeline: "Week 2",
                deliverables: "Approval queue state machine, Claude 3.5 Sonnet background tool workers, 10s recall window, and immutable audit logs.",
                checkpoint: "Weekly Demo 2: Agent drafts lease email, hits human gate, proves unapproved sends fail.",
              },
              {
                stage: "Phase 3: Google Workspace Integration & CASA Prep",
                timeline: "Week 3",
                deliverables: "OAuth 2.0 PKCE flow, Gmail/Drive/Calendar sync, least-privilege tokens, and CASA verification security documentation.",
                checkpoint: "Weekly Demo 3: Live consent flow with graceful degradation upon scope revocation.",
              },
              {
                stage: "Phase 4: Executive Voice & Meeting Briefs",
                timeline: "Week 4",
                deliverables: "Web Speech API spoken daily briefs, meeting prep briefs, action-item task creation, and Webex integration card.",
                checkpoint: "Weekly Demo 4: 2-minute spoken briefing and meeting preparation synthesis.",
              },
            ].map((p, idx) => {
              const isExpanded = expandedPhase === idx;

              return (
                <div
                  key={idx}
                  onClick={() => setExpandedPhase(isExpanded ? null : idx)}
                  className="p-5 bg-elevated border border-line rounded-lg shadow-sh-1 cursor-pointer transition-all space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-sunken flex items-center justify-center font-mono text-[11px] font-bold text-ink">
                        {idx + 1}
                      </span>
                      <span className="font-serif text-[17px] font-medium text-ink">
                        {p.stage}
                      </span>
                      <Badge variant="neutral" size="sm">{p.timeline}</Badge>
                    </div>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-ink-3" /> : <ChevronDown className="w-4 h-4 text-ink-3" />}
                  </div>

                  {isExpanded && (
                    <div className="pt-2 text-[13px] text-ink-2 space-y-2 pl-9 animate-in fade-in">
                      <p>{p.deliverables}</p>
                      <div className="p-2.5 bg-primary-t/50 border border-primary/20 rounded-sm text-primary font-medium text-[12px] flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                        <span>{p.checkpoint}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. Closing Section & Footer (Section 11.4) */}
      <footer id="contact" className="bg-[#25443A] text-[#F6F3EE] py-20 px-6 sm:px-12 font-sans">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column */}
            <div className="lg:col-span-6 space-y-4">
              <h2 className="font-serif text-[2.75rem] font-normal leading-tight text-[#F6F3EE]">
                Let's build the real thing.
              </h2>
              <p className="text-[16px] text-[#E3ECE7] leading-relaxed max-w-[48ch]">
                This demo is a prototype. The production version adds Supabase, row-level security, real Google OAuth and server-side Claude calls, phase by phase, with a working demo every week.
              </p>
              <div className="pt-4 flex items-center gap-4">
                <Link href="/demo">
                  <Button variant="secondary" size="md">
                    Launch Interactive Prototype
                  </Button>
                </Link>
                <Link href="/how-it-works">
                  <Button variant="ghost" size="md" className="text-[#F6F3EE] hover:bg-[#1D382F]">
                    Read Bid Answers
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-6 bg-[#1D382F] p-8 rounded-lg border border-[#2D5247] shadow-sh-3">
              {formSubmitted ? (
                <div className="p-6 text-center space-y-3">
                  <CheckCircle className="w-10 h-10 text-success mx-auto" />
                  <h3 className="font-serif text-[1.5rem] font-medium">Thank you.</h3>
                  <p className="text-[14px] text-[#E3ECE7]">
                    I'll reply within one working day with the complete architecture outline.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4 text-[13px]">
                  <div>
                    <label className="block text-[#E3ECE7] mb-1 font-medium">Your Name *</label>
                    <input
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. Elena Marchetti"
                      className="w-full h-10 px-3 bg-[#162C25] border border-[#2D5247] rounded-sm text-white placeholder:text-[#6B716B] outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-[#E3ECE7] mb-1 font-medium">Your Email *</label>
                    <input
                      required
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="e.g. elena@company.com"
                      className="w-full h-10 px-3 bg-[#162C25] border border-[#2D5247] rounded-sm text-white placeholder:text-[#6B716B] outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-[#E3ECE7] mb-1 font-medium">
                      What should I know about the project?
                    </label>
                    <textarea
                      rows={3}
                      value={contactNotes}
                      onChange={(e) => setContactNotes(e.target.value)}
                      placeholder="Scope, specific Google Workspace needs, or target launch date..."
                      className="w-full p-3 bg-[#162C25] border border-[#2D5247] rounded-sm text-white placeholder:text-[#6B716B] outline-none focus:border-accent"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="secondary"
                    size="md"
                    isLoading={isSubmitting}
                    className="w-full bg-[#F6F3EE] text-[#1F2421] hover:bg-[#ECE7DD]"
                  >
                    Send Message
                  </Button>
                </form>
              )}
            </div>
          </div>

          {/* Four-Column Footer */}
          <div className="pt-12 border-t border-[#2D5247] grid grid-cols-2 md:grid-cols-4 gap-8 text-[13px]">
            <div className="space-y-2">
              <h4 className="font-semibold text-white uppercase text-[11px] tracking-wider">Product</h4>
              <ul className="space-y-1.5 text-[#E3ECE7]">
                <li><Link href="/how-it-works" className="hover:underline">How it works</Link></li>
                <li><a href="#trust" className="hover:underline">Trust Architecture</a></li>
                <li><a href="#phases" className="hover:underline">Phase Milestones</a></li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-white uppercase text-[11px] tracking-wider">Demo</h4>
              <ul className="space-y-1.5 text-[#E3ECE7]">
                <li><Link href="/demo" className="hover:underline">Open Live Demo</Link></li>
                <li><Link href="/demo" className="hover:underline">Role Matrix Switcher</Link></li>
                <li><Link href="/app/settings" className="hover:underline">Failure Mode Injections</Link></li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-white uppercase text-[11px] tracking-wider">Contact</h4>
              <ul className="space-y-1.5 text-[#E3ECE7]">
                <li><a href={`mailto:${BRAND.freelancerEmail}`} className="hover:underline">{BRAND.freelancerEmail}</a></li>
                <li><a href={BRAND.freelancerCalendar} target="_blank" rel="noreferrer" className="hover:underline">Schedule Discovery Call</a></li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-white uppercase text-[11px] tracking-wider">Security & Legal</h4>
              <ul className="space-y-1.5 text-[#E3ECE7]">
                <li><span className="text-[#6B716B]">CASA Tier 2 Planned</span></li>
                <li><span className="text-[#6B716B]">Zero Payload Retention</span></li>
                <li><span className="text-[#6B716B]">PostgreSQL RLS Boundaries</span></li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-[#2D5247] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[12px] text-[#6B716B]">
            <span>
              © 2026 {BRAND.freelancerName}. Interactive prototype. Data is simulated.
            </span>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-[#E3ECE7] hover:underline"
            >
              Back to top ↑
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
