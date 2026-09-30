"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useStore } from "@/lib/mock/store";
import { canSeeTask } from "@/lib/mock/policy";
import { Task, TaskStatus } from "@/lib/mock/db";
import { Button } from "@/components/ui/Button";
import { Badge, Avatar } from "@/components/ui/Badge";
import { Drawer } from "@/components/ui/Drawer";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  CheckSquare,
  Clock,
  Search,
  Plus,
  Filter,
  Bot,
  FileText,
  Mail,
  ChevronDown,
  ChevronRight,
  Lock,
  Kanban,
  List,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import clsx from "clsx";

export default function TasksPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-ink-3">Loading tasks...</div>}>
      <TasksContent />
    </Suspense>
  );
}

function TasksContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const {
    tasks,
    companies,
    selectedCompany,
    role,
    user,
    updateTaskStatus,
    createTask,
    startAgentRun,
    agents,
  } = useStore();

  const [activeTab, setActiveTab] = useState<"All" | "Mine" | "Waiting" | "Overdue">("All");
  const [viewMode, setViewMode] = useState<"list" | "board">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTaskDrawer, setSelectedTaskDrawer] = useState<Task | null>(() => {
    const drawerId = searchParams.get("drawer");
    return drawerId ? tasks.find((t) => t.id === drawerId) || null : null;
  });

  // Modals
  const [newTaskModalOpen, setNewTaskModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskCompany, setNewTaskCompany] = useState<"northgate" | "ashby" | "kestrel">("northgate");
  const [newTaskDue, setNewTaskDue] = useState("2026-10-10");

  // Agent Assignment Modal in Drawer
  const [assignAgentModalOpen, setAssignAgentModalOpen] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState("drafter");
  const [agentInstruction, setAgentInstruction] = useState("Draft executive correspondence based on historical context");
  const [isAgentRunning, setIsAgentRunning] = useState(false);
  const [runSteps, setRunSteps] = useState<string[]>([]);

  // Filter tasks based on RLS, company, tab, and search
  const visibleTasks = tasks.filter((t) => {
    if (!canSeeTask(role, t)) return false;
    if (selectedCompany !== "all" && t.companyId !== selectedCompany) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!t.title.toLowerCase().includes(q) && !t.id.toLowerCase().includes(q)) return false;
    }

    if (activeTab === "Mine") {
      return t.ownerName === user.name;
    }
    if (activeTab === "Waiting") {
      return t.status === "Waiting" || t.status === "Needs decision";
    }
    if (activeTab === "Overdue") {
      return t.isOverdue;
    }
    return true;
  });

  const totalOpen = tasks.filter((t) => canSeeTask(role, t) && t.status !== "Done").length;
  const totalOverdue = tasks.filter((t) => canSeeTask(role, t) && t.isOverdue).length;

  const handleCreateTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    createTask({
      title: newTaskTitle,
      companyId: newTaskCompany,
      ownerId: user.id,
      dueDate: newTaskDue,
      status: "To do",
      description: "Custom task created via Tasks dashboard.",
    });

    setNewTaskTitle("");
    setNewTaskModalOpen(false);
  };

  const handleStartAgentAssignment = async () => {
    if (!selectedTaskDrawer) return;
    setIsAgentRunning(true);
    setRunSteps([
      "Initializing agent environment...",
      "Searching Drive for related contracts...",
      "Reading Gmail thread history for context...",
      "Drafting renewal terms into approval queue...",
    ]);

    setTimeout(() => {
      startAgentRun(selectedTaskDrawer.id, selectedAgentId, agentInstruction);
      setIsAgentRunning(false);
      setAssignAgentModalOpen(false);
      alert("Agent run complete! A draft has been submitted to the Approvals Queue.");
      router.push("/app/approvals");
    }, 2400);
  };

  const boardColumns: TaskStatus[] = ["To do", "In progress", "Waiting", "Done"];

  return (
    <div className="space-y-6 font-sans animate-in fade-in duration-med">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-line">
        <div>
          <h1 className="font-serif text-[2rem] font-medium text-ink leading-tight">Tasks</h1>
          <p className="text-[13px] text-ink-3">
            {totalOpen} open across 3 companies. {totalOverdue} overdue. Live tenant scoping.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-sunken p-1 rounded-sm border border-line text-[12px]">
            <button
              onClick={() => setViewMode("list")}
              className={clsx(
                "p-1.5 rounded-xs transition-colors",
                viewMode === "list" ? "bg-elevated text-ink shadow-sh-1" : "text-ink-3 hover:text-ink"
              )}
              title="List view"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("board")}
              className={clsx(
                "p-1.5 rounded-xs transition-colors",
                viewMode === "board" ? "bg-elevated text-ink shadow-sh-1" : "text-ink-3 hover:text-ink"
              )}
              title="Board view"
            >
              <Kanban className="w-4 h-4" />
            </button>
          </div>

          <Button
            onClick={() => setNewTaskModalOpen(true)}
            variant="primary"
            size="md"
            leftIcon={<Plus className="w-4 h-4" />}
          >
            New task
          </Button>
        </div>
      </div>

      {/* Toolbar: Segmented Tab + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-sunken p-1 rounded-sm border border-line text-[12px] font-medium">
          {(["All", "Mine", "Waiting", "Overdue"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={clsx(
                "px-3 py-1.5 rounded-xs transition-colors",
                activeTab === tab
                  ? "bg-elevated text-ink font-semibold shadow-sh-1"
                  : "text-ink-3 hover:text-ink"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-72">
          <Input
            placeholder="Filter tasks by name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
      </div>

      {/* List or Board View */}
      {viewMode === "list" ? (
        <div className="space-y-6">
          {companies
            .filter((c) => selectedCompany === "all" || c.id === selectedCompany)
            .map((company) => {
              const companyTasks = visibleTasks.filter((t) => t.companyId === company.id);
              if (companyTasks.length === 0) return null;

              return (
                <div key={company.id} className="border border-line rounded-lg bg-elevated overflow-hidden shadow-sh-1">
                  {/* Group Header */}
                  <div className="p-3.5 bg-surface border-b border-line flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span
                        style={{ backgroundColor: company.color }}
                        className="w-5 h-5 rounded-xs text-[10px] font-mono text-white flex items-center justify-center font-bold"
                      >
                        {company.initials}
                      </span>
                      <span className="font-serif text-[15px] font-medium text-ink">
                        {company.name}
                      </span>
                      <span className="text-[11px] font-mono text-ink-3 bg-sunken px-2 py-0.5 rounded-full">
                        {companyTasks.length} tasks
                      </span>
                    </div>
                  </div>

                  {/* Task Rows */}
                  <div className="divide-y divide-line">
                    {companyTasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => setSelectedTaskDrawer(task)}
                        className="h-12 px-4 flex items-center justify-between gap-4 hover:bg-sunken/40 cursor-pointer transition-colors text-[13px]"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <input
                            type="checkbox"
                            checked={task.status === "Done"}
                            onChange={(e) => {
                              e.stopPropagation();
                              updateTaskStatus(task.id, task.status === "Done" ? "To do" : "Done");
                            }}
                            className="rounded-xs border-line-2 text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                          />
                          <span className="font-mono text-[11px] text-ink-3 shrink-0">
                            {task.id}
                          </span>
                          <span
                            className={clsx(
                              "truncate font-medium",
                              task.status === "Done" ? "line-through text-ink-3" : "text-ink"
                            )}
                          >
                            {task.title}
                          </span>

                          {task.isRestricted && (
                            <Badge variant="warning" size="sm" icon={<Lock className="w-3 h-3" />}>
                              Restricted
                            </Badge>
                          )}

                          {task.assignedAgent && (
                            <Badge variant="info" size="sm" icon={<Bot className="w-3 h-3" />}>
                              {task.assignedAgent}
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-4 shrink-0">
                          <span className="text-[12px] text-ink-3 hidden sm:inline">
                            {task.ownerName}
                          </span>

                          <div className="flex items-center gap-1.5 w-28">
                            {task.isOverdue ? (
                              <span className="text-[11px] font-mono text-error font-semibold flex items-center gap-1 bg-[#F6E1DD] px-1.5 py-0.5 rounded-xs">
                                <Clock className="w-3 h-3" /> {task.overdueDays}d overdue
                              </span>
                            ) : (
                              <span className="text-[12px] text-ink-3">{task.dueLabel}</span>
                            )}
                          </div>

                          {/* Status Chip with dropdown affordance */}
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="relative"
                          >
                            <select
                              value={task.status}
                              onChange={(e) => updateTaskStatus(task.id, e.target.value as TaskStatus)}
                              className="text-[12px] font-medium bg-sunken border border-line rounded-xs px-2 py-1 text-ink-2 outline-none cursor-pointer hover:border-line-2"
                            >
                              <option value="To do">To do</option>
                              <option value="In progress">In progress</option>
                              <option value="Waiting">Waiting</option>
                              <option value="Needs decision">Needs decision</option>
                              <option value="Done">Done</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
        </div>
      ) : (
        /* Board View */
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 overflow-x-auto pb-4">
          {boardColumns.map((col) => {
            const colTasks = visibleTasks.filter((t) => t.status === col);

            return (
              <div key={col} className="bg-sunken/50 border border-line rounded-lg p-3 space-y-3 min-w-[240px]">
                <div className="flex items-center justify-between px-1">
                  <span className="font-serif text-[14px] font-medium text-ink">{col}</span>
                  <span className="font-mono text-[11px] text-ink-3 bg-elevated px-2 py-0.5 rounded-full border border-line">
                    {colTasks.length}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {colTasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => setSelectedTaskDrawer(task)}
                      className="p-3 bg-elevated border border-line hover:border-line-2 rounded-md shadow-sh-1 cursor-pointer transition-all space-y-2 select-none"
                    >
                      <div className="flex items-center justify-between text-[11px] text-ink-3">
                        <span className="font-mono">{task.id}</span>
                        {task.isOverdue && (
                          <span className="text-error font-semibold flex items-center gap-0.5">
                            <Clock className="w-3 h-3" /> Overdue
                          </span>
                        )}
                      </div>

                      <div className="text-[13px] font-medium text-ink leading-snug">
                        {task.title}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-ink-3 pt-1 border-t border-line/60">
                        <span>{task.ownerName}</span>
                        <span>{task.dueLabel}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Task Detail Drawer */}
      <Drawer
        isOpen={Boolean(selectedTaskDrawer)}
        onClose={() => setSelectedTaskDrawer(null)}
        title={selectedTaskDrawer?.title}
        subtitle={`${selectedTaskDrawer?.id} · Due ${selectedTaskDrawer?.dueLabel}`}
      >
        {selectedTaskDrawer && (
          <div className="space-y-6 text-[13px]">
            {/* Status & Company tags */}
            <div className="flex items-center justify-between p-3 bg-surface border border-line rounded-md">
              <div>
                <span className="text-ink-3 text-[11px] block">Company</span>
                <span className="font-medium text-ink capitalize">{selectedTaskDrawer.companyId}</span>
              </div>
              <div>
                <span className="text-ink-3 text-[11px] block">Owner</span>
                <span className="font-medium text-ink">{selectedTaskDrawer.ownerName}</span>
              </div>
              <div>
                <span className="text-ink-3 text-[11px] block">Status</span>
                <span className="font-medium text-ink">{selectedTaskDrawer.status}</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <h4 className="font-semibold text-ink text-[12px] uppercase tracking-wider text-ink-3">
                Description
              </h4>
              <p className="text-ink-2 leading-relaxed bg-surface p-3.5 rounded-md border border-line">
                {selectedTaskDrawer.description || "No description provided."}
              </p>
            </div>

            {/* Linked Documents & Context */}
            {(selectedTaskDrawer.linkedGmailThread || selectedTaskDrawer.linkedDriveDoc) && (
              <div className="space-y-2">
                <h4 className="font-semibold text-ink text-[12px] uppercase tracking-wider text-ink-3">
                  Linked External Artifacts
                </h4>
                <div className="space-y-1.5">
                  {selectedTaskDrawer.linkedGmailThread && (
                    <div className="p-2.5 bg-surface border border-line rounded-sm flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-info" />
                        <span>{selectedTaskDrawer.linkedGmailThread}</span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-ink-3" />
                    </div>
                  )}
                  {selectedTaskDrawer.linkedDriveDoc && (
                    <div className="p-2.5 bg-surface border border-line rounded-sm flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-accent" />
                        <span>{selectedTaskDrawer.linkedDriveDoc}</span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-ink-3" />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Subtasks */}
            {selectedTaskDrawer.subtasks && (
              <div className="space-y-2">
                <h4 className="font-semibold text-ink text-[12px] uppercase tracking-wider text-ink-3">
                  Subtasks Checklist
                </h4>
                <div className="space-y-1 border border-line rounded-md p-2 bg-surface">
                  {selectedTaskDrawer.subtasks.map((st) => (
                    <div key={st.id} className="flex items-center gap-2 p-1.5 text-[13px]">
                      <input
                        type="checkbox"
                        checked={st.completed}
                        readOnly
                        className="rounded-xs text-primary"
                      />
                      <span className={clsx(st.completed && "line-through text-ink-3")}>
                        {st.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Signature Feature: Assign to Agent */}
            <div className="p-4 bg-primary-t/30 border border-primary/20 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-accent" />
                  <span className="font-medium text-ink font-serif text-[15px]">
                    Autonomous AI Delegation
                  </span>
                </div>
                <Badge variant="info" size="sm">Claude Tool Use</Badge>
              </div>
              <p className="text-[12px] text-ink-2 leading-relaxed">
                Assign an agent to synthesize threads, search Drive contracts, and draft a response directly into the Approval queue.
              </p>
              <Button
                onClick={() => setAssignAgentModalOpen(true)}
                variant="primary"
                size="sm"
                leftIcon={<Bot className="w-4 h-4" />}
              >
                Assign to an Agent
              </Button>
            </div>
          </div>
        )}
      </Drawer>

      {/* New Task Modal */}
      <Modal
        isOpen={newTaskModalOpen}
        onClose={() => setNewTaskModalOpen(false)}
        title="Create New Task"
      >
        <form onSubmit={handleCreateTaskSubmit} className="space-y-4">
          <div>
            <label className="block text-[12px] font-medium text-ink-3 mb-1">Task Title *</label>
            <Input
              required
              placeholder="e.g. Approve Q4 pallet distribution agreement"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-medium text-ink-3 mb-1">Company</label>
              <select
                value={newTaskCompany}
                onChange={(e) => setNewTaskCompany(e.target.value as any)}
                className="w-full h-10 px-3 bg-elevated border border-line-2 rounded-sm text-[13px] outline-none"
              >
                <option value="northgate">Northgate Freight</option>
                <option value="ashby">Ashby & Vale Hotels</option>
                <option value="kestrel">Kestrel Property Group</option>
              </select>
            </div>

            <div>
              <label className="block text-[12px] font-medium text-ink-3 mb-1">Due Date</label>
              <Input
                type="date"
                value={newTaskDue}
                onChange={(e) => setNewTaskDue(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <Button variant="ghost" size="sm" type="button" onClick={() => setNewTaskModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Create Task
            </Button>
          </div>
        </form>
      </Modal>

      {/* Assign Agent Run Modal */}
      <Modal
        isOpen={assignAgentModalOpen}
        onClose={() => setAssignAgentModalOpen(false)}
        title="Assign Task to Autonomous Agent"
      >
        <div className="space-y-4 text-[13px]">
          <p className="text-ink-3">
            The selected agent will inspect linked files, query Gmail and Drive, and output a draft for approval. It cannot send unapproved.
          </p>

          <div>
            <label className="block text-[12px] font-medium text-ink-3 mb-1.5">Select Agent</label>
            <div className="grid grid-cols-2 gap-2">
              {agents.map((ag) => (
                <button
                  key={ag.id}
                  type="button"
                  onClick={() => setSelectedAgentId(ag.id)}
                  className={clsx(
                    "p-3 rounded-md border text-left transition-colors flex flex-col gap-1",
                    selectedAgentId === ag.id
                      ? "bg-primary-t/50 border-primary"
                      : "bg-surface border-line hover:border-line-2"
                  )}
                >
                  <span className="font-semibold text-ink">{ag.name}</span>
                  <span className="text-[11px] text-ink-3 leading-snug">{ag.tools.join(", ")}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-medium text-ink-3 mb-1">Agent Instruction</label>
            <textarea
              rows={3}
              value={agentInstruction}
              onChange={(e) => setAgentInstruction(e.target.value)}
              className="w-full p-3 bg-surface border border-line-2 rounded-sm text-[13px] outline-none"
            />
          </div>

          {isAgentRunning && (
            <div className="p-3 bg-sunken rounded-md space-y-1.5 font-mono text-[11px]">
              {runSteps.map((step, i) => (
                <div key={i} className="flex items-center gap-2 text-ink-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  <span>{step}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setAssignAgentModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              isLoading={isAgentRunning}
              onClick={handleStartAgentAssignment}
            >
              Start Agent Run
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
