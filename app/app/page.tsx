"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/mock/store";
import { canSeeApproval, canSeeTask } from "@/lib/mock/policy";
import { BRAND } from "@/config/brand";
import { Button } from "@/components/ui/Button";
import { Badge, Keycap } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  CheckCircle,
  XCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Clock,
  Lock,
  Mic,
  Calendar,
  Building,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import clsx from "clsx";

export default function HomePage() {
  const router = useRouter();
  const {
    user,
    role,
    selectedCompany,
    approvals,
    tasks,
    companies,
    meetings,
    approveItem,
    rejectItem,
    openVoice,
  } = useStore();

  const [expandedId, setExpandedId] = useState<string | null>("A-501");
  const [rejectModalItem, setRejectModalItem] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState<string>("");
  const [isApproving, setIsApproving] = useState<string | null>(null);
  const [hintDismissed, setHintDismissed] = useState(false);

  // Filter pending approvals that this role can see
  const pendingApprovals = approvals.filter((a) => {
    if (a.status !== "Pending") return false;
    if (selectedCompany !== "all" && a.companyId !== selectedCompany) return false;
    return canSeeApproval(role, a);
  });

  // Filter tasks that are overdue or due today
  const overdueOrDueTodayTasks = tasks.filter((t) => {
    if (selectedCompany !== "all" && t.companyId !== selectedCompany) return false;
    if (!canSeeTask(role, t)) return false;
    return t.isOverdue || t.status === "Needs decision";
  });

  // Keyboard navigation A, R, J, K
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const activeTag = (e.target as HTMLElement)?.tagName;
      if (["INPUT", "TEXTAREA", "SELECT"].includes(activeTag)) return;

      if (pendingApprovals.length === 0) return;

      const currentIdx = pendingApprovals.findIndex((a) => a.id === expandedId);

      if (e.key === "a" || e.key === "A") {
        e.preventDefault();
        const target = expandedId || pendingApprovals[0]?.id;
        if (target) handleApprove(target);
      } else if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        const target = expandedId || pendingApprovals[0]?.id;
        if (target) setRejectModalItem(target);
      } else if (e.key === "j" || e.key === "J" || e.key === "ArrowDown") {
        e.preventDefault();
        const nextIdx = (currentIdx + 1) % pendingApprovals.length;
        setExpandedId(pendingApprovals[nextIdx]?.id || null);
      } else if (e.key === "k" || e.key === "K" || e.key === "ArrowUp") {
        e.preventDefault();
        const prevIdx = (currentIdx - 1 + pendingApprovals.length) % pendingApprovals.length;
        setExpandedId(pendingApprovals[prevIdx]?.id || null);
      } else if (e.key === "Enter" && expandedId) {
        router.push(`/app/approvals/${expandedId}`);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [expandedId, pendingApprovals, router]);

  const handleApprove = async (id: string) => {
    setIsApproving(id);
    const res = await approveItem(id);
    setIsApproving(null);
    if (res.success) {
      // expand next pending item
      const nextPending = pendingApprovals.filter((a) => a.id !== id);
      setExpandedId(nextPending[0]?.id || null);
    }
  };

  const handleConfirmReject = () => {
    if (!rejectModalItem) return;
    rejectItem(rejectModalItem, rejectReason || "Rejected by owner");
    setRejectModalItem(null);
    setRejectReason("");
    const nextPending = pendingApprovals.filter((a) => a.id !== rejectModalItem);
    setExpandedId(nextPending[0]?.id || null);
  };

  const nextMeeting = meetings[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-med">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-line">
        <div>
          <h1 className="font-serif text-[2.25rem] font-normal text-ink leading-tight">
            Good morning, {user.name.split(" ")[0]}.
          </h1>
          <p className="text-[14px] text-ink-3 mt-1 flex items-center gap-2">
            <span>{BRAND.todayDateStr}</span>
            <span>·</span>
            <span>Managing 3 holdings</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => openVoice("brief")}
            variant="secondary"
            size="md"
            leftIcon={<Mic className="w-4 h-4 text-accent" />}
          >
            Play today's brief (2 min)
          </Button>
        </div>
      </div>

      {/* First-time interaction hint */}
      {!hintDismissed && pendingApprovals.length > 0 && (
        <div className="p-3.5 bg-accent-t/40 border border-accent/30 rounded-md flex items-center justify-between text-[13px] text-ink animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <span>
              <strong>Superhuman workflow:</strong> Press <Keycap>A</Keycap> to approve the top draft, <Keycap>R</Keycap> to reject with reason, or <Keycap>J</Keycap>/<Keycap>K</Keycap> to move.
            </span>
          </div>
          <button
            onClick={() => setHintDismissed(true)}
            className="text-[12px] text-ink-3 hover:text-ink underline ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 12-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8 Columns: Needs you Queue + Overdue/Due Today */}
        <div className="lg:col-span-8 space-y-8">
          {/* Needs you module */}
          <section aria-labelledby="needs-you-title" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 id="needs-you-title" className="font-serif text-[1.5rem] font-medium text-ink">
                  Needs you
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[12px] font-mono font-semibold bg-accent text-white shadow-sh-1">
                  {pendingApprovals.length} need you
                </span>
              </div>
              <span className="text-[12px] text-ink-3 hidden sm:inline">
                Nothing sent without your approval
              </span>
            </div>

            {pendingApprovals.length === 0 ? (
              <EmptyState
                icon={<CheckCircle className="w-8 h-8 text-success" />}
                title="You are clear."
                description="Nothing is waiting on you across 3 companies. Next review scheduled for tomorrow at 8:30."
                actionLabel="Explore Tasks"
                onAction={() => router.push("/app/tasks")}
                className="bg-surface border border-line rounded-lg py-12"
              />
            ) : (
              <div className="space-y-3">
                {pendingApprovals.map((item) => {
                  const isExpanded = expandedId === item.id;
                  const companyObj = companies.find((c) => c.id === item.companyId);

                  return (
                    <div
                      key={item.id}
                      className={clsx(
                        "border rounded-md transition-all duration-med font-sans",
                        isExpanded
                          ? "bg-elevated border-line-2 shadow-sh-2"
                          : "bg-surface hover:bg-surface/80 border-line cursor-pointer"
                      )}
                    >
                      {/* Collapsed Bar / Header */}
                      <div
                        onClick={() => setExpandedId(isExpanded ? null : item.id)}
                        className="p-4 flex items-center justify-between gap-4 select-none"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span
                            style={{ backgroundColor: companyObj?.color }}
                            className="w-5 h-5 rounded-xs text-[9px] font-mono text-white flex items-center justify-center font-bold shrink-0"
                          >
                            {companyObj?.initials}
                          </span>
                          <span className="font-mono text-[11px] text-ink-3 shrink-0">
                            {item.id}
                          </span>
                          <span className="font-medium text-[14px] text-ink truncate">
                            {item.title}
                          </span>
                          {item.isRestricted && (
                            <Badge variant="warning" size="sm" icon={<Lock className="w-3 h-3" />}>
                              Owner & Legal Only
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-2.5 shrink-0">
                          <Badge
                            variant={
                              item.risk === "High"
                                ? "error"
                                : item.risk === "Medium"
                                ? "warning"
                                : "info"
                            }
                            size="sm"
                          >
                            {item.risk} Risk
                          </Badge>
                          <span className="text-[12px] text-ink-3 hidden sm:inline">{item.age}</span>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-ink-3" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-ink-3" />
                          )}
                        </div>
                      </div>

                      {/* Expanded Card Details */}
                      {isExpanded && (
                        <div className="px-5 pb-5 pt-1 border-t border-line/60 space-y-4 animate-in fade-in duration-200">
                          <div className="text-[13px] text-ink-2 bg-sunken/40 p-3 rounded-sm border border-line">
                            <span className="font-semibold text-ink">Origin: </span>
                            <span>{item.agentName}</span>
                            <span className="mx-2">·</span>
                            <span className="font-semibold text-ink">Key facts: </span>
                            <span>{item.keyFacts}</span>
                          </div>

                          {/* Preview snippet */}
                          <div className="p-3.5 bg-surface border border-line rounded-sm text-[13px] font-serif text-ink whitespace-pre-wrap max-h-36 overflow-y-auto leading-relaxed">
                            {item.content.slice(0, 320)}...
                          </div>

                          {/* Card Action Buttons */}
                          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                            <div className="flex items-center gap-2">
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleApprove(item.id);
                                }}
                                isLoading={isApproving === item.id}
                                variant="primary"
                                size="sm"
                                leftIcon={<CheckCircle className="w-4 h-4" />}
                              >
                                Approve and Send <Keycap className="ml-1 bg-white/20 text-white border-white/30">A</Keycap>
                              </Button>

                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setRejectModalItem(item.id);
                                }}
                                variant="secondary"
                                size="sm"
                                leftIcon={<XCircle className="w-4 h-4" />}
                              >
                                Reject <Keycap className="ml-1">R</Keycap>
                              </Button>
                            </div>

                            <Link
                              href={`/app/approvals/${item.id}`}
                              className="text-[13px] text-primary hover:underline font-medium flex items-center gap-1"
                            >
                              <span>Open full draft & diff</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Overdue and Due Today List */}
          <section aria-labelledby="urgent-tasks-title" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 id="urgent-tasks-title" className="font-serif text-[1.35rem] font-medium text-ink">
                Overdue & Attention Needed
              </h2>
              <Link href="/app/tasks" className="text-[12px] text-primary hover:underline font-medium">
                View all tasks →
              </Link>
            </div>

            <div className="border border-line rounded-md bg-elevated divide-y divide-line">
              {overdueOrDueTodayTasks.slice(0, 4).map((task) => (
                <div
                  key={task.id}
                  onClick={() => router.push(`/app/tasks?drawer=${task.id}`)}
                  className="p-3.5 flex items-center justify-between gap-4 hover:bg-sunken/40 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Clock className="w-4 h-4 text-error shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[13px] font-medium text-ink truncate">{task.title}</div>
                      <div className="text-[11px] text-ink-3">
                        {task.ownerName} · {task.notes || task.dueLabel}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {task.isOverdue && (
                      <span className="text-[11px] font-mono text-error font-medium bg-[#F6E1DD] px-2 py-0.5 rounded-xs">
                        {task.overdueDays}d overdue
                      </span>
                    )}
                    <span className="text-[12px] font-medium text-ink-2 bg-sunken px-2 py-0.5 rounded-xs">
                      {task.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right 4 Columns: Daily Brief, Company Pulse, Next Meeting */}
        <div className="lg:col-span-4 space-y-6">
          {/* Daily Brief Card */}
          <div className="p-5 bg-elevated border border-line rounded-md shadow-sh-1 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-medium uppercase tracking-wider text-ink-3">
                Executive Synthesis
              </span>
              <Badge variant="accent" size="sm" icon={<Sparkles className="w-3 h-3" />}>
                Briefer Agent
              </Badge>
            </div>
            <p className="font-serif text-[15px] leading-relaxed text-ink">
              "Five things need you. The most time sensitive is the Harlow lease email; the renewal call is at eleven. The forklift lease decision closes tomorrow."
            </p>
            <Button
              onClick={() => openVoice("brief")}
              variant="secondary"
              size="sm"
              className="w-full justify-between"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              <span>Listen to 2-min briefing</span>
            </Button>
          </div>

          {/* Company Pulse */}
          <div className="p-5 bg-elevated border border-line rounded-md shadow-sh-1 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-medium uppercase tracking-wider text-ink-3">
                Company Pulse
              </span>
              <TrendingUp className="w-4 h-4 text-ink-3" />
            </div>

            <div className="space-y-3">
              {companies.map((co) => (
                <div key={co.id} className="p-2.5 rounded-sm bg-surface border border-line space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        style={{ backgroundColor: co.color }}
                        className="w-4 h-4 rounded-xs text-white text-[8px] font-mono flex items-center justify-center font-bold"
                      >
                        {co.initials}
                      </div>
                      <span className="text-[13px] font-medium text-ink">{co.name}</span>
                    </div>
                    <span className="text-[11px] font-mono text-ink-3">
                      {co.openTasks} open
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-ink-3">{co.sector}</span>
                    <span className={clsx(co.overdue > 0 ? "text-error font-medium" : "text-ink-3")}>
                      {co.overdue} overdue
                    </span>
                  </div>

                  {/* Inline 7-day sparkline SVG */}
                  <div className="h-6 w-full pt-1">
                    <svg viewBox="0 0 100 20" className="w-full h-full stroke-primary fill-none stroke-[1.5]">
                      <path d={co.id === "kestrel" ? "M0 15 L20 12 L40 16 L60 8 L80 10 L100 4" : co.id === "northgate" ? "M0 10 L20 14 L40 8 L60 11 L80 6 L100 8" : "M0 12 L20 10 L40 14 L60 9 L80 5 L100 7"} />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next Meeting Card */}
          {nextMeeting && (
            <div className="p-5 bg-elevated border border-line rounded-md shadow-sh-1 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-medium uppercase tracking-wider text-ink-3">
                  Next Meeting
                </span>
                <Calendar className="w-4 h-4 text-ink-3" />
              </div>

              <div>
                <div className="text-[11px] font-mono text-accent font-semibold">
                  {nextMeeting.dateStr} · {nextMeeting.timeStr}
                </div>
                <div className="font-serif text-[16px] font-medium text-ink mt-0.5">
                  {nextMeeting.title}
                </div>
                <p className="text-[12px] text-ink-3 mt-1">
                  Attendees: {nextMeeting.attendees.map((a) => a.name).join(", ")}
                </p>
              </div>

              <div className="pt-2 border-t border-line flex items-center justify-between">
                <Badge variant="success" size="sm">
                  {nextMeeting.prepStatus}
                </Badge>
                <Link
                  href="/app/meetings"
                  className="text-[12px] text-primary hover:underline font-medium"
                >
                  View brief →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reject Reason Sheet / Modal */}
      <Modal
        isOpen={Boolean(rejectModalItem)}
        onClose={() => setRejectModalItem(null)}
        title="Why are you rejecting this? (optional)"
      >
        <div className="space-y-4">
          <p className="text-[13px] text-ink-3">
            Your feedback will be logged in the immutable audit trail and sent to the agent's run history.
          </p>

          <div className="flex flex-wrap gap-2">
            {["Wrong tone", "Numbers are off", "Needs legal review", "Terms too aggressive"].map(
              (chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setRejectReason(chip)}
                  className={clsx(
                    "px-3 py-1.5 rounded-sm border text-[12px] transition-colors",
                    rejectReason === chip
                      ? "bg-primary text-white border-primary"
                      : "bg-surface hover:bg-sunken border-line text-ink"
                  )}
                >
                  {chip}
                </button>
              )
            )}
          </div>

          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Add detailed critique for the drafting agent..."
            rows={3}
            className="w-full p-3 bg-surface border border-line-2 rounded-sm text-[13px] outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setRejectModalItem(null)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleConfirmReject}>
              Confirm Rejection
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
