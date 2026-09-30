"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useStore } from "@/lib/mock/store";
import { canSeeApproval, canApproveAction } from "@/lib/mock/policy";
import { ApprovalItem, ApprovalStatus } from "@/lib/mock/db";
import { Button } from "@/components/ui/Button";
import { Badge, Keycap } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  CheckCircle,
  XCircle,
  FileEdit,
  Mail,
  FileText,
  CheckSquare,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Calendar,
  Lock,
  ExternalLink,
  ChevronRight,
  Eye,
  History,
} from "lucide-react";
import clsx from "clsx";

export default function ApprovalsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-ink-3">Loading approvals...</div>}>
      <ApprovalsContent />
    </Suspense>
  );
}

function ApprovalsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const {
    role,
    user,
    approvals,
    companies,
    selectedCompany,
    approveItem,
    rejectItem,
    requestChanges,
    updateDraftContent,
    setCurrentStateNode,
  } = useStore();

  const [activeTab, setActiveTab] = useState<ApprovalStatus>("Pending");
  const [selectedId, setSelectedId] = useState<string | null>(searchParams.get("id") || "A-501");
  const [isEditing, setIsEditing] = useState(false);
  const [editedBody, setEditedBody] = useState("");
  const [showDiff, setShowDiff] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  // Modals
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [requestChangesModalOpen, setRequestChangesModalOpen] = useState(false);
  const [changeInstruction, setChangeInstruction] = useState("");
  const [highRiskConfirmOpen, setHighRiskConfirmOpen] = useState(false);
  const [shakeSendBtn, setShakeSendBtn] = useState(false);

  // Filter items by tab, company, and RLS
  const visibleApprovals = approvals.filter((a) => {
    if (selectedCompany !== "all" && a.companyId !== selectedCompany) return false;
    return canSeeApproval(role, a);
  });

  const tabItems = visibleApprovals.filter((a) => {
    if (activeTab === "Pending") return a.status === "Pending" || a.status === "Drafted";
    return a.status === activeTab;
  });

  const selectedItem = visibleApprovals.find((a) => a.id === selectedId) || tabItems[0] || null;

  useEffect(() => {
    if (selectedItem) {
      setEditedBody(selectedItem.content);
      setCurrentStateNode(selectedItem.status);
    }
  }, [selectedItem, setCurrentStateNode]);

  const handleApproveClick = () => {
    if (!selectedItem) return;

    if (!canApproveAction(role)) {
      setShakeSendBtn(true);
      setTimeout(() => setShakeSendBtn(false), 500);
      alert("Blocked: draft is Pending. Needs approval from Owner.");
      return;
    }

    if (selectedItem.risk === "High") {
      setHighRiskConfirmOpen(true);
    } else {
      executeApprove();
    }
  };

  const executeApprove = async () => {
    if (!selectedItem) return;
    setIsApproving(true);
    await approveItem(selectedItem.id);
    setIsApproving(false);
    setHighRiskConfirmOpen(false);
  };

  const handleSaveInlineEdit = () => {
    if (!selectedItem) return;
    updateDraftContent(selectedItem.id, editedBody);
    setIsEditing(false);
  };

  const handleRequestChangesSubmit = async () => {
    if (!selectedItem || !changeInstruction.trim()) return;
    await requestChanges(selectedItem.id, changeInstruction);
    setRequestChangesModalOpen(false);
    setChangeInstruction("");
  };

  const statusBreadcrumbs = ["Drafted", "Pending", "Approved", "Sending", "Sent"];

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col font-sans animate-in fade-in duration-med">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-line shrink-0">
        <div>
          <h1 className="font-serif text-[1.85rem] font-medium text-ink leading-tight">
            Approval Queue
          </h1>
          <p className="text-[13px] text-ink-3">
            Review agent outputs before anything leaves the company. Full guard enforcement.
          </p>
        </div>

        {/* Tab pills */}
        <div className="flex items-center gap-1 bg-sunken p-1 rounded-sm border border-line text-[12px] font-medium">
          {(["Pending", "Approved", "Sent", "Rejected"] as ApprovalStatus[]).map((tab) => {
            const count = visibleApprovals.filter((a) =>
              tab === "Pending" ? a.status === "Pending" || a.status === "Drafted" : a.status === tab
            ).length;

            return (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  const firstOfTab = visibleApprovals.find((a) =>
                    tab === "Pending" ? a.status === "Pending" : a.status === tab
                  );
                  if (firstOfTab) setSelectedId(firstOfTab.id);
                }}
                className={clsx(
                  "px-3 py-1.5 rounded-xs transition-colors flex items-center gap-1.5",
                  activeTab === tab
                    ? "bg-elevated text-ink font-semibold shadow-sh-1"
                    : "text-ink-3 hover:text-ink"
                )}
              >
                <span>{tab}</span>
                {count > 0 && (
                  <span
                    className={clsx(
                      "font-mono text-[10px] px-1.5 py-0.2 rounded-full",
                      tab === "Pending" ? "bg-accent text-white" : "bg-sunken text-ink-2"
                    )}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Split View Content */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 border border-line rounded-lg mt-4 bg-elevated overflow-hidden shadow-sh-1">
        {/* Left List Pane (360px) */}
        <div className="w-full md:w-[360px] border-r border-line flex flex-col bg-surface/50 shrink-0">
          <div className="p-3 border-b border-line bg-surface text-[12px] font-medium text-ink-3 flex items-center justify-between">
            <span>{tabItems.length} {activeTab.toLowerCase()} items</span>
            <span className="text-[11px] font-mono">Sorted by urgency</span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-line">
            {tabItems.length === 0 ? (
              <div className="p-8 text-center text-ink-3 text-[13px]">
                No drafts waiting in {activeTab}. Agents are idle.
              </div>
            ) : (
              tabItems.map((item) => {
                const isSelected = selectedItem?.id === item.id;
                const companyObj = companies.find((c) => c.id === item.companyId);

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedId(item.id);
                      setIsEditing(false);
                      setShowDiff(false);
                    }}
                    className={clsx(
                      "p-3.5 cursor-pointer transition-colors relative flex flex-col gap-2",
                      isSelected ? "bg-primary-t/40" : "hover:bg-sunken/40"
                    )}
                  >
                    {isSelected && (
                      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary" />
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {item.type === "Email" ? (
                          <Mail className="w-3.5 h-3.5 text-info" />
                        ) : item.type === "Agreement" ? (
                          <FileText className="w-3.5 h-3.5 text-accent" />
                        ) : (
                          <CheckSquare className="w-3.5 h-3.5 text-primary" />
                        )}
                        <span className="font-mono text-[11px] text-ink-3">{item.id}</span>
                        <span
                          style={{ backgroundColor: companyObj?.color }}
                          className="w-4 h-4 rounded-xs text-[8px] font-mono text-white flex items-center justify-center font-bold"
                        >
                          {companyObj?.initials}
                        </span>
                      </div>
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
                    </div>

                    <div className="font-medium text-[13px] text-ink truncate leading-snug">
                      {item.title}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-ink-3">
                      <span>{item.agentName}</span>
                      <span>{item.age}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Detail Pane */}
        {selectedItem ? (
          <div className="flex-1 flex flex-col min-w-0 bg-elevated overflow-hidden">
            {/* Detail Header & State Machine Breadcrumb */}
            <div className="p-4 border-b border-line bg-surface/70 space-y-3 shrink-0">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <h2 className="font-serif text-[1.35rem] font-medium text-ink">
                    {selectedItem.title}
                  </h2>
                  <Badge variant="neutral" size="sm">
                    {selectedItem.status}
                  </Badge>
                  {selectedItem.isEdited && (
                    <Badge variant="accent" size="sm">
                      Edited by you
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {selectedItem.originalContent && (
                    <button
                      onClick={() => setShowDiff(!showDiff)}
                      className="px-2.5 py-1 text-[12px] font-medium border border-line rounded-xs bg-surface hover:bg-sunken text-ink flex items-center gap-1.5 transition-colors"
                    >
                      <History className="w-3.5 h-3.5 text-ink-3" />
                      <span>{showDiff ? "Hide diff" : "Show diff"}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* State Machine Step Tracker */}
              <div className="flex items-center gap-1 text-[11px] font-mono text-ink-3">
                {statusBreadcrumbs.map((step, idx) => {
                  const isCurrent = selectedItem.status === step;
                  const isPassed =
                    statusBreadcrumbs.indexOf(selectedItem.status) > idx ||
                    selectedItem.status === "Sent";

                  return (
                    <React.Fragment key={step}>
                      <span
                        className={clsx(
                          "px-2 py-0.5 rounded-xs border transition-colors",
                          isCurrent
                            ? "bg-primary text-white border-primary font-bold shadow-sh-1"
                            : isPassed
                            ? "bg-primary-t/70 text-primary border-primary/20"
                            : "bg-surface border-line text-ink-3"
                        )}
                      >
                        {step}
                      </span>
                      {idx < statusBreadcrumbs.length - 1 && (
                        <ChevronRight className="w-3 h-3 text-ink-3/40" />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* Document Body & Context Rail */}
            <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-y-auto">
              {/* Document Editor Area */}
              <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                {/* Email metadata header if email */}
                {selectedItem.type === "Email" && (
                  <div className="p-3 bg-surface border border-line rounded-sm space-y-2 text-[13px] font-mono">
                    <div className="flex items-center gap-2">
                      <span className="text-ink-3 w-16">To:</span>
                      <span className="text-ink font-sans">{selectedItem.to}</span>
                    </div>
                    {selectedItem.cc && (
                      <div className="flex items-center gap-2">
                        <span className="text-ink-3 w-16">Cc:</span>
                        <span className="text-ink font-sans">{selectedItem.cc}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="text-ink-3 w-16">Subject:</span>
                      <span className="text-ink font-sans font-medium">{selectedItem.subject}</span>
                    </div>
                  </div>
                )}

                {/* Diff View if enabled */}
                {showDiff && selectedItem.originalContent ? (
                  <div className="p-4 bg-surface border border-line rounded-md text-[13px] font-mono leading-relaxed space-y-2">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-3 mb-2">
                      Changes vs Original Agent Draft:
                    </div>
                    <div className="p-2 bg-[#F6E1DD] text-error line-through rounded-xs">
                      {selectedItem.originalContent}
                    </div>
                    <div className="p-2 bg-[#E2EFE7] text-success rounded-xs">
                      {selectedItem.content}
                    </div>
                  </div>
                ) : isEditing ? (
                  <div className="space-y-3">
                    <textarea
                      value={editedBody}
                      onChange={(e) => setEditedBody(e.target.value)}
                      rows={12}
                      className="w-full p-4 bg-surface border border-line-2 rounded-md font-serif text-[15px] leading-relaxed text-ink outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                    <div className="flex items-center gap-2 justify-end">
                      <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button variant="primary" size="sm" onClick={handleSaveInlineEdit}>
                        Save inline changes
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      if (selectedItem.status === "Pending") setIsEditing(true);
                    }}
                    className={clsx(
                      "p-6 bg-surface/50 border border-line rounded-md leading-relaxed whitespace-pre-wrap transition-colors",
                      selectedItem.type === "Agreement" ? "font-serif text-[15px]" : "font-sans text-[14px]",
                      selectedItem.status === "Pending" && "hover:border-line-2 cursor-text"
                    )}
                  >
                    {selectedItem.content}
                  </div>
                )}

                {selectedItem.status === "Pending" && !isEditing && (
                  <p className="text-[12px] text-ink-3 italic">
                    Click anywhere inside the text block to edit inline before approving.
                  </p>
                )}
              </div>

              {/* Right Context Rail (280px) */}
              <div className="w-full lg:w-72 border-t lg:border-t-0 lg:border-l border-line p-5 bg-surface/40 space-y-4 shrink-0">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-3">
                  Context Used By Agent
                </div>

                {selectedItem.contextSources.length === 0 ? (
                  <p className="text-[12px] text-ink-3">No external documents cited.</p>
                ) : (
                  <div className="space-y-3">
                    {selectedItem.contextSources.map((ctx) => (
                      <div
                        key={ctx.id}
                        className="p-3 bg-elevated border border-line rounded-sm space-y-1 hover:border-line-2 transition-colors cursor-pointer"
                        onClick={() => alert(`Context preview: ${ctx.label}\n\n${ctx.detail}`)}
                      >
                        <div className="flex items-center gap-1.5 text-[12px] font-medium text-ink">
                          {ctx.type === "gmail" ? (
                            <Mail className="w-3.5 h-3.5 text-info" />
                          ) : ctx.type === "drive" ? (
                            <FileText className="w-3.5 h-3.5 text-accent" />
                          ) : (
                            <Calendar className="w-3.5 h-3.5 text-primary" />
                          )}
                          <span className="truncate">{ctx.label}</span>
                        </div>
                        <p className="text-[11px] text-ink-3 leading-snug">{ctx.detail}</p>
                      </div>
                    ))}
                  </div>
                )}

                {selectedItem.riskReasons && selectedItem.riskReasons.length > 0 && (
                  <div className="pt-3 border-t border-line space-y-2">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-3 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-warning" />
                      Risk Factors
                    </div>
                    <ul className="text-[11px] text-ink-2 space-y-1 list-disc pl-4">
                      {selectedItem.riskReasons.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Sticky Action Footer */}
            <div className="p-4 border-t border-line bg-surface flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="text-[12px] text-ink-3 flex items-center gap-2">
                <span>Guard:</span>
                <span className="font-mono text-[11px] bg-sunken px-1.5 py-0.5 rounded-xs text-ink-2">
                  Requires Owner signature & gmail.send scope
                </span>
              </div>

              {selectedItem.status === "Pending" ? (
                <div className="flex items-center gap-2.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setRejectModalOpen(true)}
                  >
                    Reject
                  </Button>

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setRequestChangesModalOpen(true)}
                  >
                    Request Changes
                  </Button>

                  <Button
                    variant="primary"
                    size="md"
                    isLoading={isApproving}
                    onClick={handleApproveClick}
                    className={clsx(shakeSendBtn && "animate-shake")}
                    leftIcon={<CheckCircle className="w-4 h-4" />}
                  >
                    Approve and send
                  </Button>
                </div>
              ) : selectedItem.status === "Approved" ? (
                <Badge variant="success" size="md">
                  Approved · Queued for sending
                </Badge>
              ) : selectedItem.status === "Sent" ? (
                <Badge variant="success" size="md">
                  Sent to recipient at {selectedItem.sentAt?.slice(11, 16) || "10:42"}
                </Badge>
              ) : (
                <Badge variant="error" size="md">
                  Rejected: {selectedItem.rejectionReason}
                </Badge>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8 text-center text-ink-3">
            Select a draft from the left queue to review.
          </div>
        )}
      </div>

      {/* Reject Modal */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Why are you rejecting this?"
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
            placeholder="Feedback for agent..."
            rows={3}
            className="w-full p-3 bg-surface border border-line-2 rounded-sm text-[13px] outline-none"
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setRejectModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                if (selectedItem) rejectItem(selectedItem.id, rejectReason || "Rejected by owner");
                setRejectModalOpen(false);
                setRejectReason("");
              }}
            >
              Confirm Rejection
            </Button>
          </div>
        </div>
      </Modal>

      {/* Request Changes Modal */}
      <Modal
        isOpen={requestChangesModalOpen}
        onClose={() => setRequestChangesModalOpen(false)}
        title="Request Changes from Agent"
      >
        <div className="space-y-4">
          <p className="text-[13px] text-ink-3">
            Describe what needs revision. The agent will re-run its generation pipeline in ~1.5s with a visible diff.
          </p>
          <textarea
            value={changeInstruction}
            onChange={(e) => setChangeInstruction(e.target.value)}
            placeholder="e.g. Tighten the auto-renewal cancellation to 30 days, or soften the opening paragraph..."
            rows={4}
            className="w-full p-3 bg-surface border border-line-2 rounded-sm text-[13px] outline-none"
          />
          <div className="flex justify-end gap-3">
            <Button variant="ghost" size="sm" onClick={() => setRequestChangesModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleRequestChangesSubmit}>
              Regenerate Draft
            </Button>
          </div>
        </div>
      </Modal>

      {/* High-Risk External Recipient Confirmation */}
      <Modal
        isOpen={highRiskConfirmOpen}
        onClose={() => setHighRiskConfirmOpen(false)}
        title="High-Risk Approval Confirmation"
      >
        <div className="space-y-4">
          <div className="p-3 bg-[#F6E1DD] border border-[#ECC6C0] rounded-md text-[13px] text-error flex items-start gap-2.5">
            <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <strong>High Financial / Legal Impact Action:</strong>
              <p className="mt-1">
                This item touches external counterparties or substantial capital commitments ({selectedItem?.keyFacts}).
              </p>
            </div>
          </div>

          <div className="text-[13px] text-ink-2 space-y-1.5 bg-sunken/40 p-3 rounded-md border border-line">
            <div><strong className="text-ink">Recipient:</strong> {selectedItem?.to || "Legal Counterparty"}</div>
            <div><strong className="text-ink">Subject:</strong> {selectedItem?.subject || selectedItem?.title}</div>
            <div><strong className="text-ink">Signer:</strong> {user.name} ({role})</div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setHighRiskConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={executeApprove}>
              Confirm Approval & Enqueue Send
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
