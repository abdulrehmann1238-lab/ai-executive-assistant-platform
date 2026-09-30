"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/mock/store";
import { Meeting } from "@/lib/mock/db";
import { Button } from "@/components/ui/Button";
import { Badge, Avatar } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import {
  Calendar,
  Clock,
  Users,
  FileText,
  CheckSquare,
  Lock,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Video,
} from "lucide-react";
import clsx from "clsx";

export default function MeetingsPage() {
  const { meetings, companies, selectedCompany, convertActionItemToTask } = useStore();
  const [selectedMeetingId, setSelectedMeetingId] = useState<string>("M-1");
  const [detailTab, setDetailTab] = useState<"prep" | "followups">("prep");
  const [generatingPrep, setGeneratingPrep] = useState(false);

  const visibleMeetings = meetings.filter((m) => {
    if (selectedCompany !== "all" && m.companyId !== "all" && m.companyId !== selectedCompany) {
      return false;
    }
    return true;
  });

  const selectedMeeting = meetings.find((m) => m.id === selectedMeetingId) || meetings[0];

  const handleSimulatePrepGeneration = () => {
    setGeneratingPrep(true);
    setTimeout(() => {
      setGeneratingPrep(false);
      alert("Executive meeting brief synthesized from linked Drive contracts and Gmail history.");
    }, 1200);
  };

  return (
    <div className="space-y-8 font-sans animate-in fade-in duration-med">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-line">
        <div>
          <h1 className="font-serif text-[2rem] font-medium text-ink leading-tight">Meetings & Prep</h1>
          <p className="text-[13px] text-ink-3">
            Context briefs, attendee analysis, and post-meeting follow-ups across your holdings.
          </p>
        </div>

        {/* Webex Locked Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-sunken border border-line rounded-sm text-[12px] text-ink-3">
          <Lock className="w-3.5 h-3.5 text-ink-3" />
          <span>Webex Transcript Sync: Phase 4</span>
        </div>
      </div>

      {/* Split layout: Meetings list on left, detail on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 4 Cols: Meeting List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-[12px] font-medium uppercase tracking-wider text-ink-3">
            Upcoming Schedule ({visibleMeetings.length})
          </div>

          <div className="space-y-2.5">
            {visibleMeetings.map((m) => {
              const isSelected = selectedMeeting?.id === m.id;
              const companyObj = companies.find((c) => c.id === m.companyId);

              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedMeetingId(m.id)}
                  className={clsx(
                    "p-4 border rounded-md cursor-pointer transition-all space-y-2.5",
                    isSelected
                      ? "bg-elevated border-line-2 shadow-sh-2"
                      : "bg-surface hover:bg-surface/80 border-line"
                  )}
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-accent font-semibold">{m.dateStr}</span>
                      <span>·</span>
                      <span className="font-mono text-ink-2">{m.timeStr}</span>
                    </div>

                    <Badge
                      variant={
                        m.prepStatus === "Prep ready"
                          ? "success"
                          : m.prepStatus === "Follow-up drafted"
                          ? "info"
                          : "neutral"
                      }
                      size="sm"
                    >
                      {m.prepStatus}
                    </Badge>
                  </div>

                  <div className="font-serif text-[16px] font-medium text-ink leading-snug">
                    {m.title}
                  </div>

                  <div className="flex items-center justify-between text-[12px] text-ink-3 pt-1 border-t border-line/60">
                    <span className="capitalize">
                      {companyObj ? companyObj.name : "All holdings"}
                    </span>
                    <span>{m.attendees.length} attendees</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Webex disabled card */}
          <div className="p-4 bg-sunken/60 border border-line rounded-md text-[12px] text-ink-3 space-y-2 opacity-80">
            <div className="flex items-center justify-between font-medium text-ink">
              <span className="flex items-center gap-1.5">
                <Video className="w-4 h-4 text-ink-3" /> Webex Integration
              </span>
              <Badge variant="neutral" size="sm">Phase 4</Badge>
            </div>
            <p className="leading-snug">
              Automated cloud recording parsing and speaker-attributed action item extraction will arrive in Phase 4 per the roadmap.
            </p>
            <button
              disabled
              className="text-[11px] font-medium px-3 py-1.5 bg-surface border border-line-2 rounded-xs text-ink-3 cursor-not-allowed"
            >
              Connect Webex (Disabled)
            </button>
          </div>
        </div>

        {/* Right 7 Cols: Brief Detail */}
        {selectedMeeting && (
          <div className="lg:col-span-7 bg-elevated border border-line rounded-lg p-6 shadow-sh-1 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-line pb-4">
              <div>
                <span className="text-[12px] font-mono text-accent font-semibold">
                  {selectedMeeting.dateStr} at {selectedMeeting.timeStr}
                </span>
                <h2 className="font-serif text-[1.65rem] font-medium text-ink mt-0.5">
                  {selectedMeeting.title}
                </h2>
                <div className="flex items-center gap-2 mt-2 text-[12px] text-ink-3">
                  <span>Attendees:</span>
                  <div className="flex items-center gap-1">
                    {selectedMeeting.attendees.map((a) => (
                      <span
                        key={a.email}
                        className="px-2 py-0.5 rounded-xs bg-sunken text-ink text-[11px]"
                      >
                        {a.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {selectedMeeting.prepBrief ? (
                <Badge variant="success" size="md">
                  Brief Ready
                </Badge>
              ) : (
                <Button
                  onClick={handleSimulatePrepGeneration}
                  isLoading={generatingPrep}
                  variant="primary"
                  size="sm"
                  leftIcon={<Sparkles className="w-4 h-4" />}
                >
                  Generate Brief
                </Button>
              )}
            </div>

            {/* Sub-tabs: Prep vs Follow-ups */}
            <div className="flex border-b border-line gap-4 text-[13px] font-medium">
              <button
                onClick={() => setDetailTab("prep")}
                className={clsx(
                  "pb-2 border-b-2 transition-colors",
                  detailTab === "prep"
                    ? "border-primary text-primary font-semibold"
                    : "border-transparent text-ink-3 hover:text-ink"
                )}
              >
                Executive Preparation Brief
              </button>
              <button
                onClick={() => setDetailTab("followups")}
                className={clsx(
                  "pb-2 border-b-2 transition-colors",
                  detailTab === "followups"
                    ? "border-primary text-primary font-semibold"
                    : "border-transparent text-ink-3 hover:text-ink"
                )}
              >
                Action Items & Follow-up Drafts
              </button>
            </div>

            {/* Tab: Prep */}
            {detailTab === "prep" && (
              <div className="space-y-5 text-[14px]">
                {selectedMeeting.prepBrief ? (
                  <>
                    <div className="space-y-1.5">
                      <h4 className="text-[12px] font-semibold uppercase tracking-wider text-ink-3">
                        Strategic Objective
                      </h4>
                      <p className="font-serif text-[15px] text-ink leading-relaxed bg-surface p-3.5 rounded-md border border-line">
                        {selectedMeeting.prepBrief.objective}
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="text-[12px] font-semibold uppercase tracking-wider text-ink-3">
                        Attendee Background & Context
                      </h4>
                      <p className="text-ink-2 leading-relaxed bg-surface p-3.5 rounded-md border border-line">
                        {selectedMeeting.prepBrief.attendeeContext}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-[12px] font-semibold uppercase tracking-wider text-ink-3">
                        Relevant Open Tasks in Holding
                      </h4>
                      <div className="space-y-1.5">
                        {selectedMeeting.prepBrief.openItems.map((item, i) => (
                          <div
                            key={i}
                            className="p-2.5 bg-surface border border-line rounded-sm text-[13px] text-ink flex items-center gap-2"
                          >
                            <Clock className="w-3.5 h-3.5 text-accent shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-[12px] font-semibold uppercase tracking-wider text-ink-3">
                        Suggested Inquiries to Pose
                      </h4>
                      <ul className="space-y-1.5 list-disc pl-5 text-ink-2 text-[13px]">
                        {selectedMeeting.prepBrief.suggestedQuestions.map((q, i) => (
                          <li key={i}>{q}</li>
                        ))}
                      </ul>
                    </div>
                  </>
                ) : (
                  <div className="p-8 text-center text-ink-3 space-y-3">
                    <p>No brief compiled yet for this meeting.</p>
                    <Button
                      onClick={handleSimulatePrepGeneration}
                      variant="primary"
                      size="sm"
                      isLoading={generatingPrep}
                    >
                      Compile Executive Brief with Briefer Agent
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Follow-ups */}
            {detailTab === "followups" && (
              <div className="space-y-5 text-[13px]">
                {selectedMeeting.actionItems && selectedMeeting.actionItems.length > 0 ? (
                  <div className="space-y-3">
                    <h4 className="text-[12px] font-semibold uppercase tracking-wider text-ink-3">
                      Extracted Action Items
                    </h4>
                    <div className="space-y-2">
                      {selectedMeeting.actionItems.map((ai) => (
                        <div
                          key={ai.id}
                          className="p-3 bg-surface border border-line rounded-sm flex items-center justify-between gap-3"
                        >
                          <span className={clsx(ai.convertedToTask ? "text-ink-3 line-through" : "text-ink")}>
                            {ai.text}
                          </span>
                          {ai.convertedToTask ? (
                            <Badge variant="success" size="sm">Converted to Task</Badge>
                          ) : (
                            <Button
                              onClick={() => convertActionItemToTask(selectedMeeting.id, ai.id)}
                              variant="secondary"
                              size="sm"
                              leftIcon={<CheckSquare className="w-3.5 h-3.5" />}
                            >
                              Create Task
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-ink-3 text-[13px]">No action items logged yet.</p>
                )}

                {selectedMeeting.followUpEmailDraft && (
                  <div className="space-y-2 pt-2 border-t border-line">
                    <h4 className="text-[12px] font-semibold uppercase tracking-wider text-ink-3">
                      Drafted Follow-up Correspondence
                    </h4>
                    <div className="p-3.5 bg-surface border border-line rounded-md font-serif text-[14px] leading-relaxed text-ink whitespace-pre-wrap">
                      {selectedMeeting.followUpEmailDraft}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
