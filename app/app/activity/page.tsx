"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/mock/store";
import { canSeeActivity } from "@/lib/mock/policy";
import { ActivityEvent } from "@/lib/mock/db";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  Activity,
  Lock,
  Search,
  Filter,
  Download,
  Copy,
  Check,
  Bot,
  User,
  Cpu,
  ChevronRight,
} from "lucide-react";
import clsx from "clsx";

export default function ActivityPage() {
  const { activity, role, selectedCompany, companies, addToast } = useStore();
  const [actorFilter, setActorFilter] = useState<"all" | "human" | "agent" | "system">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<ActivityEvent | null>(null);
  const [copied, setCopied] = useState(false);

  const filteredEvents = activity.filter((ev) => {
    if (!canSeeActivity(role, ev)) return false;
    if (selectedCompany !== "all" && ev.companyId !== "all" && ev.companyId !== selectedCompany) {
      return false;
    }
    if (actorFilter !== "all" && ev.actorType !== actorFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (
        !ev.action.toLowerCase().includes(q) &&
        !ev.object.toLowerCase().includes(q) &&
        !ev.actorName.toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    return true;
  });

  const handleExportCSV = () => {
    addToast({
      message: "Export prepared (simulated). Audit log integrity verified.",
      type: "info",
    });
  };

  const handleCopyJSON = () => {
    if (!selectedEvent) return;
    navigator.clipboard?.writeText(JSON.stringify(selectedEvent, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 font-sans animate-in fade-in duration-med">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-line">
        <div>
          <h1 className="font-serif text-[2rem] font-medium text-ink leading-tight">
            Activity & Audit Log
          </h1>
          <p className="text-[13px] text-ink-3 flex items-center gap-1.5 mt-0.5">
            <Lock className="w-3.5 h-3.5 text-accent" />
            <span>Append-only. Entries cannot be edited or deleted. Complete forensic traceability.</span>
          </p>
        </div>

        <Button
          onClick={handleExportCSV}
          variant="secondary"
          size="md"
          leftIcon={<Download className="w-4 h-4" />}
        >
          Export CSV (Simulated)
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Actor Type Chips */}
        <div className="flex items-center gap-1 bg-sunken p-1 rounded-sm border border-line text-[12px] font-medium">
          {(["all", "human", "agent", "system"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActorFilter(filter)}
              className={clsx(
                "px-3 py-1.5 rounded-xs capitalize transition-colors",
                actorFilter === filter
                  ? "bg-elevated text-ink font-semibold shadow-sh-1"
                  : "text-ink-3 hover:text-ink"
              )}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-72">
          <Input
            placeholder="Search action or object..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
      </div>

      {/* Audit Table */}
      <div className="border border-line rounded-lg bg-elevated overflow-hidden shadow-sh-1">
        <div className="p-3.5 bg-surface border-b border-line text-[12px] font-medium text-ink-3 flex items-center justify-between">
          <span>Audit Records ({filteredEvents.length} entries)</span>
          <span className="font-mono text-[11px]">ISO 27001 append-only compliant</span>
        </div>

        <div className="divide-y divide-line font-mono text-[12px]">
          {filteredEvents.map((ev) => {
            const companyObj = companies.find((c) => c.id === ev.companyId);

            return (
              <div
                key={ev.id}
                onClick={() => setSelectedEvent(ev)}
                className="p-3.5 flex items-center justify-between gap-4 hover:bg-sunken/40 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="text-ink-3 text-[11px] w-14 shrink-0 font-medium">
                    {ev.timeStr}
                  </span>

                  <div className="w-6 h-6 rounded-full bg-sunken flex items-center justify-center text-ink-3 shrink-0">
                    {ev.actorType === "agent" ? (
                      <Bot className="w-3.5 h-3.5 text-info" />
                    ) : ev.actorType === "system" ? (
                      <Cpu className="w-3.5 h-3.5 text-accent" />
                    ) : (
                      <User className="w-3.5 h-3.5 text-primary" />
                    )}
                  </div>

                  <span className="font-sans font-semibold text-ink shrink-0">
                    {ev.actorName}
                  </span>

                  <span className="text-ink-3 font-sans shrink-0">{ev.action}</span>

                  <span className="font-sans text-ink-2 truncate">{ev.object}</span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[11px] text-ink-3 hidden sm:inline uppercase">
                    {companyObj ? companyObj.initials : "ALL"}
                  </span>

                  <Badge
                    variant={
                      ev.result === "success"
                        ? "success"
                        : ev.result === "blocked"
                        ? "warning"
                        : "error"
                    }
                    size="sm"
                  >
                    {ev.result}
                  </Badge>

                  <ChevronRight className="w-4 h-4 text-ink-3" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Activity Event Drawer */}
      <Drawer
        isOpen={Boolean(selectedEvent)}
        onClose={() => setSelectedEvent(null)}
        title="Audit Trail Entry Detail"
        subtitle={`Event ID: ${selectedEvent?.id} · Timestamp: ${selectedEvent?.timestamp}`}
      >
        {selectedEvent && (
          <div className="space-y-6 text-[13px] font-sans">
            <div className="p-4 bg-surface border border-line rounded-md space-y-2 font-mono text-[12px]">
              <div><strong className="text-ink">Actor:</strong> {selectedEvent.actorName} ({selectedEvent.actorType})</div>
              <div><strong className="text-ink">Action:</strong> {selectedEvent.action}</div>
              <div><strong className="text-ink">Target:</strong> {selectedEvent.object}</div>
              <div><strong className="text-ink">Outcome:</strong> {selectedEvent.result}</div>
            </div>

            {selectedEvent.diff && (
              <div className="space-y-2">
                <h4 className="font-semibold text-ink text-[12px] uppercase tracking-wider text-ink-3">
                  State Mutation Diff
                </h4>
                <div className="p-3 bg-surface border border-line rounded-md font-mono text-[12px] space-y-1">
                  <div className="p-2 bg-[#F6E1DD] text-error line-through rounded-xs">
                    - {selectedEvent.diff.before}
                  </div>
                  <div className="p-2 bg-[#E2EFE7] text-success rounded-xs">
                    + {selectedEvent.diff.after}
                  </div>
                </div>
              </div>
            )}

            {/* Read-only JSON payload */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-ink text-[12px] uppercase tracking-wider text-ink-3">
                  Raw Audit Payload (JSON)
                </h4>
                <button
                  onClick={handleCopyJSON}
                  className="flex items-center gap-1 text-[11px] text-primary hover:underline font-mono"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied" : "Copy JSON"}</span>
                </button>
              </div>

              <pre className="p-4 bg-sunken border border-line rounded-md font-mono text-[11px] text-ink-2 overflow-x-auto leading-relaxed">
                {JSON.stringify(
                  {
                    event_id: selectedEvent.id,
                    timestamp: selectedEvent.timestamp,
                    actor: {
                      name: selectedEvent.actorName,
                      type: selectedEvent.actorType,
                    },
                    action: selectedEvent.action,
                    object: selectedEvent.object,
                    company_id: selectedEvent.companyId,
                    result: selectedEvent.result,
                    meta: selectedEvent.payload,
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
