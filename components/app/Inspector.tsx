"use client";

import React from "react";
import { useStore } from "@/lib/mock/store";
import { getSimulatedRLS } from "@/lib/mock/policy";
import { X, ShieldAlert, Cpu, Database, Key, Activity, CheckCircle, ArrowRight, Lock } from "lucide-react";
import clsx from "clsx";
import { Keycap } from "../ui/Badge";

export function Inspector() {
  const { inspector, toggleInspector, setInspectorTab, role, scopes, activity, toggleScope } = useStore();

  if (!inspector.isOpen) return null;

  const stateNodes = ["Drafted", "Pending", "Approved", "Sending", "Sent"];

  return (
    <aside
      aria-label="Under the Hood Inspector"
      className="fixed top-0 right-0 bottom-0 w-full sm:w-[380px] bg-elevated border-l border-line shadow-sh-3 z-drawer flex flex-col transition-transform duration-med animate-in slide-in-from-right duration-250 font-sans"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-line bg-surface shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-accent" />
          <span className="font-serif text-[15px] font-medium text-ink">Under the Hood</span>
          <span className="text-[11px] font-mono px-1.5 py-0.5 rounded-xs bg-sunken text-ink-3">Trust Layer</span>
        </div>
        <div className="flex items-center gap-2">
          <Keycap>I</Keycap>
          <button
            onClick={() => toggleInspector()}
            className="p-1 rounded-sm text-ink-3 hover:text-ink hover:bg-sunken transition-colors"
            aria-label="Close inspector"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Segmented Control Tabs */}
      <div className="flex items-center border-b border-line bg-sunken/60 p-1 text-[12px] shrink-0 font-medium">
        {(["state", "policy", "scopes", "events"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setInspectorTab(tab)}
            className={clsx(
              "flex-1 py-1.5 rounded-xs text-center capitalize transition-all",
              inspector.activeTab === tab
                ? "bg-elevated text-ink shadow-sh-1"
                : "text-ink-3 hover:text-ink"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 text-[13px] leading-relaxed">
        {inspector.activeTab === "state" && (
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-ink text-[12px] uppercase tracking-wider text-ink-3">
                  Approval State Machine
                </span>
                <span className="text-[11px] font-mono text-accent bg-accent-t px-2 py-0.5 rounded-xs">
                  Active: {inspector.currentStateNode}
                </span>
              </div>

              {/* State Machine Visualizer */}
              <div className="p-3 bg-surface border border-line rounded-md space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  {stateNodes.map((node, i) => {
                    const isActive = inspector.currentStateNode === node;
                    return (
                      <React.Fragment key={node}>
                        <div
                          className={clsx(
                            "px-2 py-1 rounded-xs border text-center transition-all",
                            isActive
                              ? "bg-primary text-white border-primary font-bold shadow-sh-1"
                              : "bg-elevated text-ink-3 border-line"
                          )}
                        >
                          {node}
                        </div>
                        {i < stateNodes.length - 1 && (
                          <ArrowRight className="w-3 h-3 text-ink-3/40 shrink-0" />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-surface border border-line rounded-md text-[12px] space-y-2">
              <div className="font-semibold text-ink flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-warning" />
                <span>Enforced Security Invariants:</span>
              </div>
              <ul className="list-disc pl-4 space-y-1.5 text-ink-2 text-[12px]">
                <li><strong className="text-ink font-mono text-[11px]">Drafted → Sent:</strong> Strictly impossible. No backend path skips human review.</li>
                <li><strong className="text-ink font-mono text-[11px]">send:</strong> Requires cryptographically valid <code className="font-mono text-[11px]">approvedBy</code> signature & OAuth scope <code className="font-mono text-[11px]">gmail.send</code>.</li>
                <li><strong className="text-ink font-mono text-[11px]">Recall Window:</strong> 10-second server queue delay permits cancellation before dispatch.</li>
              </ul>
            </div>
          </div>
        )}

        {inspector.activeTab === "policy" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[12px] uppercase tracking-wider text-ink-3 font-medium">
                Active Tenant RLS Policy
              </span>
              <span className="font-mono text-[11px] px-2 py-0.5 rounded-xs bg-primary-t text-primary font-semibold">
                Role: {role}
              </span>
            </div>

            <div className="bg-sunken border border-line rounded-md p-3 font-mono text-[11px] text-ink-2 overflow-x-auto leading-relaxed whitespace-pre-wrap">
              {getSimulatedRLS(role, "tasks")}
            </div>

            <div className="p-3 bg-surface border border-line rounded-md text-[12px] text-ink-2">
              <p className="font-medium text-ink mb-1 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-accent" />
                Row-Level Redaction Active
              </p>
              <p className="text-ink-3 text-[12px]">
                {role === "Owner"
                  ? "Full visibility enabled across all three holdings (Northgate, Ashby & Vale, Kestrel) including sensitive legal separations."
                  : role === "Chief of Staff"
                  ? "Restricted items without explicit Chief of Staff delegation are filtered before serialization."
                  : role === "Finance lead"
                  ? "Scoped strictly to Northgate Freight and Kestrel Property Group. Ashby & Vale records return zero rows."
                  : "Contractor visibility isolation: strictly limited to assigned matters (Ruth Okafor legal files)."}
              </p>
            </div>
          </div>
        )}

        {inspector.activeTab === "scopes" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[12px] uppercase tracking-wider text-ink-3 font-medium">
                OAuth 2.0 Least-Privilege
              </span>
              <span className="text-[11px] text-ink-3">Live Scopes</span>
            </div>

            {scopes.map((s) => (
              <div
                key={s.id}
                className={clsx(
                  "p-3 rounded-md border text-[12px] transition-all",
                  s.granted ? "bg-surface border-line" : "bg-sunken/70 border-line-2 opacity-75"
                )}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="font-mono text-[11px] font-semibold text-ink truncate">
                    {s.scope.replace("https://www.googleapis.com/auth/", "")}
                  </div>
                  <button
                    onClick={() => toggleScope(s.id)}
                    className={clsx(
                      "text-[10px] uppercase font-mono px-2 py-0.5 rounded-xs transition-colors shrink-0",
                      s.granted
                        ? "bg-success/10 text-success hover:bg-success/20"
                        : "bg-error/10 text-error hover:bg-error/20"
                    )}
                  >
                    {s.granted ? "Granted" : "Revoked"}
                  </button>
                </div>
                <p className="text-ink-3 text-[11px] mb-2">{s.allows}</p>
                <div className="flex items-center justify-between text-[10px] text-ink-3">
                  <span>Class: <strong className="text-ink-2">{s.sensitivity}</strong></span>
                  <span>Agents: {s.agents.join(", ")}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {inspector.activeTab === "events" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[12px] uppercase tracking-wider text-ink-3 font-medium">
                Append-Only Audit Stream
              </span>
              <span className="text-[11px] font-mono text-ink-3">{activity.length} logged</span>
            </div>

            <div className="space-y-2 font-mono text-[11px]">
              {activity.slice(0, 15).map((ev) => (
                <div
                  key={ev.id}
                  className="p-2.5 bg-surface border border-line rounded-sm space-y-1"
                >
                  <div className="flex items-center justify-between text-ink-3 text-[10px]">
                    <span className="text-ink font-semibold">{ev.timeStr}</span>
                    <span
                      className={clsx(
                        "px-1.5 py-0.2 rounded-xs uppercase text-[9px]",
                        ev.result === "success"
                          ? "bg-success/15 text-success"
                          : ev.result === "blocked"
                          ? "bg-warning/15 text-warning"
                          : "bg-error/15 text-error"
                      )}
                    >
                      {ev.result}
                    </span>
                  </div>
                  <div className="text-ink">
                    <span className="text-primary font-semibold">{ev.actorName}</span>: {ev.action}
                  </div>
                  <div className="text-ink-3 truncate">{ev.object}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-line bg-surface text-[11px] text-ink-3 flex items-center justify-between">
        <span>Interactive Inspector · Halden v1</span>
        <button
          onClick={() => {
            const raw = JSON.stringify({ role, scopes, state: inspector.currentStateNode }, null, 2);
            navigator.clipboard?.writeText(raw);
          }}
          className="text-primary hover:underline"
        >
          Copy State JSON
        </button>
      </div>
    </aside>
  );
}
