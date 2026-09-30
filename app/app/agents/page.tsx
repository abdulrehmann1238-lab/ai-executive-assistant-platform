"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/mock/store";
import { AgentRun } from "@/lib/mock/db";
import { Button } from "@/components/ui/Button";
import { Badge, Keycap } from "@/components/ui/Badge";
import { Drawer } from "@/components/ui/Drawer";
import { Modal } from "@/components/ui/Modal";
import {
  Bot,
  Play,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Search,
  Mail,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import clsx from "clsx";

export default function AgentsPage() {
  const router = useRouter();
  const { agents, runs, tasks, startAgentRun } = useStore();

  const [selectedRun, setSelectedRun] = useState<AgentRun | null>(null);
  const [newRunModalOpen, setNewRunModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(tasks[0]?.id || "T-201");
  const [selectedAgentId, setSelectedAgentId] = useState("drafter");
  const [runInstruction, setRunInstruction] = useState("Synthesize history and draft renewal terms");
  const [isExecuting, setIsExecuting] = useState(false);

  const handleStartRun = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsExecuting(true);
    const runId = await startAgentRun(selectedTaskId, selectedAgentId, runInstruction);
    setIsExecuting(false);
    setNewRunModalOpen(false);

    const created = runs.find((r) => r.id === runId);
    if (created) setSelectedRun(created);
  };

  return (
    <div className="space-y-8 font-sans animate-in fade-in duration-med">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-line">
        <div>
          <h1 className="font-serif text-[2rem] font-medium text-ink leading-tight">AI Agents</h1>
          <p className="text-[13px] text-ink-3">
            Autonomous assistants with tool access. Strictly gated: cannot send without human approval.
          </p>
        </div>

        <Button
          onClick={() => setNewRunModalOpen(true)}
          variant="primary"
          size="md"
          leftIcon={<Play className="w-4 h-4" />}
        >
          Start new run
        </Button>
      </div>

      {/* Agents Roster */}
      <section aria-labelledby="roster-heading" className="space-y-4">
        <h2 id="roster-heading" className="font-serif text-[1.35rem] font-medium text-ink">
          Constrained Agent Roster
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="p-5 bg-elevated border border-line rounded-lg shadow-sh-1 flex flex-col justify-between space-y-4 hover:border-line-2 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-full bg-primary-t flex items-center justify-center text-primary">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-mono">
                    <span className="w-2 h-2 rounded-full bg-success" />
                    <span className="text-ink-3">{agent.status}</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-serif text-[1.15rem] font-medium text-ink">{agent.name}</h3>
                  <p className="text-[12px] text-ink-3 mt-1 leading-snug">{agent.role}</p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {agent.tools.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-xs bg-sunken text-[11px] font-mono text-ink-2"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Signature Guarantee */}
              <div className="pt-3 border-t border-line">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-accent uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Cannot send. Drafts only.
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Runs Table */}
      <section aria-labelledby="runs-heading" className="space-y-4">
        <h2 id="runs-heading" className="font-serif text-[1.35rem] font-medium text-ink">
          Recent Agent Executions & Tool Traces
        </h2>

        <div className="border border-line rounded-lg bg-elevated overflow-hidden shadow-sh-1">
          <div className="p-3 bg-surface border-b border-line text-[12px] font-medium text-ink-3 flex items-center justify-between">
            <span>Execution History ({runs.length} runs)</span>
            <span className="text-[11px] font-mono">Real-time trace inspectable</span>
          </div>

          <div className="divide-y divide-line">
            {runs.map((run) => (
              <div
                key={run.id}
                onClick={() => setSelectedRun(run)}
                className="p-4 flex items-center justify-between gap-4 hover:bg-sunken/40 cursor-pointer transition-colors text-[13px]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-sunken flex items-center justify-center text-ink-3 shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-ink truncate flex items-center gap-2">
                      <span>{run.taskTitle}</span>
                      <span className="font-mono text-[11px] text-ink-3">({run.id})</span>
                    </div>
                    <div className="text-[12px] text-ink-3 mt-0.5">
                      Agent: <strong className="text-ink-2">{run.agentName}</strong> · Task {run.taskId}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-[12px] font-mono text-ink-3">
                    {run.durationSeconds}s duration
                  </span>

                  <Badge
                    variant={
                      run.outcome === "Draft ready"
                        ? "success"
                        : run.outcome === "Needs info"
                        ? "warning"
                        : "error"
                    }
                    size="sm"
                  >
                    {run.outcome}
                  </Badge>

                  <ChevronRight className="w-4 h-4 text-ink-3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Run Detail Drawer with Step Trace */}
      <Drawer
        isOpen={Boolean(selectedRun)}
        onClose={() => setSelectedRun(null)}
        title={selectedRun?.taskTitle}
        subtitle={`${selectedRun?.agentName} · Run ${selectedRun?.id}`}
      >
        {selectedRun && (
          <div className="space-y-6 text-[13px]">
            <div className="p-3 bg-surface border border-line rounded-md flex items-center justify-between">
              <div>
                <span className="text-ink-3 text-[11px] block">Agent</span>
                <span className="font-semibold text-ink">{selectedRun.agentName}</span>
              </div>
              <div>
                <span className="text-ink-3 text-[11px] block">Outcome</span>
                <span className="font-medium text-ink">{selectedRun.outcome}</span>
              </div>
              <div>
                <span className="text-ink-3 text-[11px] block">Total Duration</span>
                <span className="font-mono text-ink">{selectedRun.durationSeconds}s</span>
              </div>
            </div>

            {/* Vertical Step Trace */}
            <div className="space-y-3">
              <h4 className="font-semibold text-ink text-[12px] uppercase tracking-wider text-ink-3">
                Execution Steps & Tool Calls
              </h4>

              <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-line">
                {selectedRun.steps.map((st) => (
                  <div key={st.id} className="relative space-y-1">
                    <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-success ring-4 ring-elevated" />
                    <div className="flex items-center justify-between text-[11px] font-mono text-ink-3">
                      <span className="font-semibold text-primary">{st.tool}</span>
                      <span>{st.timestamp} ({st.durationMs}ms)</span>
                    </div>
                    <div className="font-medium text-ink text-[13px]">{st.action}</div>
                    <div className="p-2.5 bg-surface border border-line rounded-sm text-[12px] text-ink-2 leading-relaxed">
                      {st.summary}
                    </div>
                  </div>
                ))}

                {/* Final Enforced Gate */}
                <div className="relative pt-2">
                  <div className="absolute -left-6 top-3 w-2.5 h-2.5 rounded-full bg-accent ring-4 ring-elevated" />
                  <div className="p-3 bg-accent-t/40 border border-accent/30 rounded-md text-[12px] text-ink font-medium flex items-center justify-between">
                    <span>Final Step: Submitted to Approval Queue</span>
                    <span className="font-mono text-[11px] text-accent font-semibold">Waiting for human approval</span>
                  </div>
                </div>
              </div>
            </div>

            {selectedRun.approvalId && (
              <div className="pt-4 border-t border-line">
                <Button
                  onClick={() => router.push(`/app/approvals/${selectedRun.approvalId}`)}
                  variant="primary"
                  size="md"
                  className="w-full"
                  rightIcon={<ExternalLink className="w-4 h-4" />}
                >
                  Review Resulting Draft ({selectedRun.approvalId})
                </Button>
              </div>
            )}
          </div>
        )}
      </Drawer>

      {/* Start New Run Modal */}
      <Modal
        isOpen={newRunModalOpen}
        onClose={() => setNewRunModalOpen(false)}
        title="Trigger Autonomous Agent Pipeline"
      >
        <form onSubmit={handleStartRun} className="space-y-4 text-[13px]">
          <div>
            <label className="block text-[12px] font-medium text-ink-3 mb-1">Target Task</label>
            <select
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
              className="w-full h-10 px-3 bg-elevated border border-line-2 rounded-sm text-[13px] outline-none"
            >
              {tasks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.id}: {t.title} ({t.companyId})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[12px] font-medium text-ink-3 mb-1">Select Agent</label>
            <div className="grid grid-cols-2 gap-2">
              {agents.map((ag) => (
                <button
                  key={ag.id}
                  type="button"
                  onClick={() => setSelectedAgentId(ag.id)}
                  className={clsx(
                    "p-2.5 rounded-sm border text-left transition-colors",
                    selectedAgentId === ag.id
                      ? "bg-primary-t/50 border-primary"
                      : "bg-surface border-line"
                  )}
                >
                  <div className="font-medium text-ink">{ag.name}</div>
                  <div className="text-[10px] text-ink-3 truncate">{ag.tools.join(", ")}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-medium text-ink-3 mb-1">Instruction</label>
            <textarea
              rows={3}
              value={runInstruction}
              onChange={(e) => setRunInstruction(e.target.value)}
              className="w-full p-3 bg-surface border border-line-2 rounded-sm text-[13px] outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" size="sm" type="button" onClick={() => setNewRunModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={isExecuting}>
              Execute Run
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
