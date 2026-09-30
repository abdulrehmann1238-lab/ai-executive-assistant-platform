import { create } from "zustand";
import {
  SEED_COMPANIES,
  SEED_PEOPLE,
  SEED_TASKS,
  SEED_APPROVALS,
  SEED_AGENTS,
  SEED_RUNS,
  SEED_MEETINGS,
  SEED_ACTIVITY,
  SEED_SCOPES,
  Company,
  Person,
  Task,
  ApprovalItem,
  Agent,
  AgentRun,
  Meeting,
  ActivityEvent,
  IntegrationScope,
  TaskStatus,
  ApprovalStatus,
  AgentRunStep,
} from "./db";
import { Role, canSeeTask, canSeeApproval, canSeeActivity, canApproveAction } from "./policy";

const SESSION_KEY = "halden.demo.v1";

export interface ToastItem {
  id: string;
  message: string;
  type?: "info" | "success" | "error" | "warning";
  hasUndo?: boolean;
  undoApprovalId?: string;
  duration?: number;
  remainingSeconds?: number;
}

export interface AppState {
  // Session
  role: Role;
  user: Person;
  selectedCompany: string; // "all", "northgate", "ashby", "kestrel"

  // Data collections
  companies: Company[];
  people: Person[];
  tasks: Task[];
  approvals: ApprovalItem[];
  agents: Agent[];
  runs: AgentRun[];
  meetings: Meeting[];
  activity: ActivityEvent[];
  scopes: IntegrationScope[];

  // Settings & Toggles
  settings: {
    simulateGmailFailure: boolean;
    simulateAgentFailure: boolean;
    slowNetwork: boolean;
    tokenExpired: boolean;
    voiceRate: number;
    briefVoice: string;
  };

  // UI Overlays
  inspector: {
    isOpen: boolean;
    activeTab: "state" | "policy" | "scopes" | "events";
    currentStateNode: string;
  };

  voice: {
    isOpen: boolean;
    mode: "brief" | "command" | "fill";
    isListening: boolean;
    transcript: string;
  };

  commandPaletteOpen: boolean;
  toasts: ToastItem[];
  undoTimers: Record<string, any>;

  // Actions
  setCompany: (companyId: string) => void;
  setRole: (role: Role) => void;
  toggleInspector: (tab?: "state" | "policy" | "scopes" | "events") => void;
  setInspectorTab: (tab: "state" | "policy" | "scopes" | "events") => void;
  setCurrentStateNode: (node: string) => void;
  openVoice: (mode?: "brief" | "command" | "fill") => void;
  closeVoice: () => void;
  setVoiceListening: (listening: boolean) => void;
  setVoiceTranscript: (text: string) => void;
  setCommandPaletteOpen: (open: boolean) => void;

  addToast: (toast: Omit<ToastItem, "id">) => string;
  dismissToast: (id: string) => void;

  // Domain Actions
  approveItem: (id: string) => Promise<{ success: boolean; error?: string }>;
  undoApprove: (id: string) => void;
  rejectItem: (id: string, reason: string) => void;
  requestChanges: (id: string, feedback: string) => Promise<void>;
  updateDraftContent: (id: string, newContent: string) => void;

  updateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  createTask: (task: Omit<Task, "id" | "ownerName" | "dueLabel" | "isOverdue">) => void;

  toggleScope: (scopeId: string) => void;
  startAgentRun: (taskId: string, agentId: string, instruction: string) => Promise<string>;

  convertActionItemToTask: (meetingId: string, actionItemId: string) => void;
  updateSettings: (newSettings: Partial<AppState["settings"]>) => void;
  resetDemo: () => void;
  dispatchAction: (
    actorName: string,
    actorType: "human" | "agent" | "system",
    action: string,
    object: string,
    companyId: "northgate" | "ashby" | "kestrel" | "all",
    result: "success" | "blocked" | "error" | "recalled",
    payload: Record<string, any>,
    diff?: { before: string; after: string }
  ) => void;
}

function loadSessionState(): Partial<AppState> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error("Failed to load session state", e);
  }
  return null;
}

function saveSessionState(state: Partial<AppState>) {
  if (typeof window === "undefined") return;
  try {
    const toSave = {
      role: state.role,
      selectedCompany: state.selectedCompany,
      tasks: state.tasks,
      approvals: state.approvals,
      runs: state.runs,
      meetings: state.meetings,
      activity: state.activity,
      scopes: state.scopes,
      settings: state.settings,
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(toSave));
  } catch (e) {
    console.error("Failed to save session state", e);
  }
}

export const useStore = create<AppState>((set, get) => {
  const initialSession = loadSessionState();

  const defaultRole: Role = (initialSession?.role as Role) || "Owner";
  const defaultUser = SEED_PEOPLE[0]; // Elena Marchetti

  return {
    role: defaultRole,
    user: defaultUser,
    selectedCompany: initialSession?.selectedCompany || "all",
    companies: SEED_COMPANIES,
    people: SEED_PEOPLE,
    tasks: initialSession?.tasks || SEED_TASKS,
    approvals: initialSession?.approvals || SEED_APPROVALS,
    agents: SEED_AGENTS,
    runs: initialSession?.runs || SEED_RUNS,
    meetings: initialSession?.meetings || SEED_MEETINGS,
    activity: initialSession?.activity || SEED_ACTIVITY,
    scopes: initialSession?.scopes || SEED_SCOPES,

    settings: initialSession?.settings || {
      simulateGmailFailure: false,
      simulateAgentFailure: false,
      slowNetwork: false,
      tokenExpired: false,
      voiceRate: 1,
      briefVoice: "default",
    },

    inspector: {
      isOpen: false,
      activeTab: "state",
      currentStateNode: "Pending",
    },

    voice: {
      isOpen: false,
      mode: "brief",
      isListening: false,
      transcript: "",
    },

    commandPaletteOpen: false,
    toasts: [],
    undoTimers: {},

    setCompany: (companyId: string) => {
      set({ selectedCompany: companyId });
      saveSessionState(get());
    },

    setRole: (role: Role) => {
      // Find matching person for avatar
      let matchedUser = SEED_PEOPLE[0];
      if (role === "Chief of Staff") matchedUser = SEED_PEOPLE[1];
      if (role === "Finance lead") matchedUser = SEED_PEOPLE[2];
      if (role === "Contractor") matchedUser = SEED_PEOPLE[6]; // Ruth Okafor

      set({ role, user: matchedUser });
      saveSessionState(get());

      // Count hidden items
      const tasks = get().tasks;
      const approvals = get().approvals;
      const hiddenTasks = tasks.filter((t) => !canSeeTask(role, t)).length;
      const hiddenApprovals = approvals.filter((a) => !canSeeApproval(role, a)).length;
      const totalHidden = hiddenTasks + hiddenApprovals;

      if (role !== "Owner" && totalHidden > 0) {
        get().addToast({
          message: `Viewing as ${role}. ${totalHidden} items are hidden from you.`,
          type: "info",
        });
      }

      get().dispatchAction(
        matchedUser.name,
        "human",
        "switched role",
        `Assumed role: ${role}`,
        "all",
        "success",
        { role, hiddenItemsCount: totalHidden }
      );
    },

    toggleInspector: (tab) => {
      set((s) => ({
        inspector: {
          ...s.inspector,
          isOpen: tab ? true : !s.inspector.isOpen,
          activeTab: tab || s.inspector.activeTab,
        },
      }));
    },

    setInspectorTab: (tab) => {
      set((s) => ({ inspector: { ...s.inspector, activeTab: tab } }));
    },

    setCurrentStateNode: (node) => {
      set((s) => ({ inspector: { ...s.inspector, currentStateNode: node } }));
    },

    openVoice: (mode = "brief") => {
      set({ voice: { isOpen: true, mode, isListening: false, transcript: "" } });
    },

    closeVoice: () => {
      set((s) => ({ voice: { ...s.voice, isOpen: false, isListening: false } }));
    },

    setVoiceListening: (listening) => {
      set((s) => ({ voice: { ...s.voice, isListening: listening } }));
    },

    setVoiceTranscript: (text) => {
      set((s) => ({ voice: { ...s.voice, transcript: text } }));
    },

    setCommandPaletteOpen: (open) => {
      set({ commandPaletteOpen: open });
    },

    addToast: (toast) => {
      const id = "toast-" + Math.random().toString(36).substring(2, 9);
      const newToast: ToastItem = {
        ...toast,
        id,
        remainingSeconds: toast.duration ? Math.ceil(toast.duration / 1000) : 10,
      };

      set((s) => ({ toasts: [newToast, ...s.toasts.slice(0, 2)] }));

      if (!toast.hasUndo) {
        setTimeout(() => {
          get().dismissToast(id);
        }, toast.duration || 4000);
      }

      return id;
    },

    dismissToast: (id) => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    },

    approveItem: async (id: string) => {
      const { role, user, approvals, scopes, settings } = get();

      // Guard 1: Role check
      if (!canApproveAction(role)) {
        get().dispatchAction(
          user.name,
          "human",
          "attempted unapproved send",
          `Blocked: draft ${id}`,
          "all",
          "blocked",
          { reason: "Role lacks approval permission" }
        );
        return { success: false, error: "Only the Owner can approve." };
      }

      // Guard 2: gmail.send scope check
      const sendScope = scopes.find((s) => s.scope.includes("gmail.send"));
      if (sendScope && !sendScope.granted) {
        get().dispatchAction(
          user.name,
          "human",
          "approval blocked",
          `Missing scope: gmail.send`,
          "all",
          "blocked",
          { reason: "Scope revoked" }
        );
        return { success: false, error: "Sending is turned off. Drafts still work." };
      }

      const item = approvals.find((a) => a.id === id);
      if (!item) return { success: false, error: "Item not found" };

      // Transition to Approved
      const nowStr = new Date().toISOString();
      set((s) => ({
        inspector: { ...s.inspector, currentStateNode: "Approved" },
        approvals: s.approvals.map((a) =>
          a.id === id
            ? {
                ...a,
                status: "Approved",
                approvedBy: user.name,
                approvedAt: nowStr,
              }
            : a
        ),
      }));

      get().dispatchAction(
        user.name,
        "human",
        "approved draft",
        `${item.id} (${item.title})`,
        item.companyId,
        "success",
        { draftId: item.id, approvedBy: user.name, state: "Approved" }
      );

      // Start 10-second Recall countdown
      const toastId = get().addToast({
        message: "Approved. Sending in 10 seconds.",
        type: "success",
        hasUndo: true,
        undoApprovalId: id,
        duration: 10000,
      });

      // Status moves to Sending
      setTimeout(() => {
        const cur = get().approvals.find((a) => a.id === id);
        if (cur && cur.status === "Approved") {
          set((s) => ({
            inspector: { ...s.inspector, currentStateNode: "Sending" },
            approvals: s.approvals.map((a) => (a.id === id ? { ...a, status: "Sending" } : a)),
          }));
        }
      }, 600);

      // Interval countdown updates
      let secondsLeft = 10;
      const interval = setInterval(() => {
        secondsLeft -= 1;
        set((s) => ({
          toasts: s.toasts.map((t) => (t.id === toastId ? { ...t, remainingSeconds: secondsLeft } : t)),
        }));

        if (secondsLeft <= 0) {
          clearInterval(interval);
          get().dismissToast(toastId);

          const finalItem = get().approvals.find((a) => a.id === id);
          if (finalItem && finalItem.status === "Sending") {
            // Check for simulated failure
            if (settings.simulateGmailFailure) {
              set((s) => ({
                inspector: { ...s.inspector, currentStateNode: "Approved" },
                approvals: s.approvals.map((a) =>
                  a.id === id ? { ...a, status: "Approved" } : a
                ),
              }));

              get().dispatchAction(
                "System",
                "system",
                "send failed",
                `${item.id} -> Gmail error`,
                item.companyId,
                "error",
                { draftId: item.id, error: "Simulated Gmail API 500 error" }
              );

              get().addToast({
                message: "Gmail returned an error. Nothing was sent. Retry available.",
                type: "error",
              });
            } else {
              // Successfully Sent
              set((s) => ({
                inspector: { ...s.inspector, currentStateNode: "Sent" },
                approvals: s.approvals.map((a) =>
                  a.id === id
                    ? {
                        ...a,
                        status: "Sent",
                        sentAt: new Date().toISOString(),
                      }
                    : a
                ),
              }));

              get().dispatchAction(
                "System",
                "system",
                "sent after approval",
                `${item.id} to ${item.to || "recipient"}`,
                item.companyId,
                "success",
                { draftId: item.id, approvedBy: user.name, provider: "gmail.send" }
              );

              // If associated with a task, mark task as Done or completed
              if (item.taskId) {
                set((s) => ({
                  tasks: s.tasks.map((t) => (t.id === item.taskId ? { ...t, status: "Done" } : t)),
                }));
              }

              saveSessionState(get());
            }
          }
        }
      }, 1000);

      set((s) => ({
        undoTimers: { ...s.undoTimers, [id]: interval },
      }));

      saveSessionState(get());
      return { success: true };
    },

    undoApprove: (id: string) => {
      const timer = get().undoTimers[id];
      if (timer) {
        clearInterval(timer);
      }

      set((s) => {
        const newTimers = { ...s.undoTimers };
        delete newTimers[id];
        return {
          undoTimers: newTimers,
          inspector: { ...s.inspector, currentStateNode: "Pending" },
          approvals: s.approvals.map((a) =>
            a.id === id ? { ...a, status: "Pending", approvedBy: undefined, approvedAt: undefined } : a
          ),
          toasts: s.toasts.filter((t) => t.undoApprovalId !== id),
        };
      });

      const item = get().approvals.find((a) => a.id === id);
      if (item) {
        get().dispatchAction(
          get().user.name,
          "human",
          "recalled approval",
          `${item.id} returned to Pending`,
          item.companyId,
          "recalled",
          { draftId: item.id }
        );
      }

      get().addToast({
        message: "Send cancelled. The draft is back in your queue.",
        type: "info",
      });

      saveSessionState(get());
    },

    rejectItem: (id: string, reason: string) => {
      const item = get().approvals.find((a) => a.id === id);
      if (!item) return;

      set((s) => ({
        inspector: { ...s.inspector, currentStateNode: "Rejected" },
        approvals: s.approvals.map((a) =>
          a.id === id
            ? {
                ...a,
                status: "Rejected",
                rejectionReason: reason,
              }
            : a
        ),
      }));

      get().dispatchAction(
        get().user.name,
        "human",
        "rejected draft",
        `${item.id}: "${reason}"`,
        item.companyId,
        "success",
        { draftId: item.id, reason }
      );

      get().addToast({
        message: `Draft rejected: ${reason}`,
        type: "info",
      });

      saveSessionState(get());
    },

    requestChanges: async (id: string, feedback: string) => {
      const item = get().approvals.find((a) => a.id === id);
      if (!item) return;

      set((s) => ({
        inspector: { ...s.inspector, currentStateNode: "ChangesRequested" },
        approvals: s.approvals.map((a) => (a.id === id ? { ...a, status: "ChangesRequested" } : a)),
      }));

      get().dispatchAction(
        get().user.name,
        "human",
        "requested changes",
        `${item.id}: "${feedback}"`,
        item.companyId,
        "success",
        { draftId: item.id, feedback }
      );

      // Simulate agent revising in 1.5 seconds
      setTimeout(() => {
        const revisedContent = `${item.content}\n\n[Addendum incorporated per executive feedback: "${feedback}"]`;
        set((s) => ({
          inspector: { ...s.inspector, currentStateNode: "Pending" },
          approvals: s.approvals.map((a) =>
            a.id === id
              ? {
                  ...a,
                  status: "Pending",
                  content: revisedContent,
                  originalContent: item.content,
                  isEdited: true,
                }
              : a
          ),
        }));

        get().dispatchAction(
          item.agentName,
          "agent",
          "revised draft",
          `${item.id} updated per feedback`,
          item.companyId,
          "success",
          { draftId: item.id, feedback }
        );

        get().addToast({
          message: `${item.agentName} revised the draft with your changes.`,
          type: "success",
        });

        saveSessionState(get());
      }, 1500);
    },

    updateDraftContent: (id: string, newContent: string) => {
      const item = get().approvals.find((a) => a.id === id);
      if (!item) return;

      const orig = item.originalContent || item.content;

      set((s) => ({
        approvals: s.approvals.map((a) =>
          a.id === id
            ? {
                ...a,
                content: newContent,
                originalContent: orig,
                isEdited: true,
              }
            : a
        ),
      }));

      get().dispatchAction(
        get().user.name,
        "human",
        "edited draft inline",
        `${item.id} updated`,
        item.companyId,
        "success",
        { draftId: item.id }
      );

      saveSessionState(get());
    },

    updateTaskStatus: (taskId: string, newStatus: TaskStatus) => {
      const task = get().tasks.find((t) => t.id === taskId);
      if (!task) return;

      const oldStatus = task.status;
      set((s) => ({
        tasks: s.tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)),
      }));

      get().dispatchAction(
        get().user.name,
        "human",
        "updated task status",
        `${task.id} (${oldStatus} -> ${newStatus})`,
        task.companyId,
        "success",
        { taskId, oldStatus, newStatus }
      );

      saveSessionState(get());
    },

    createTask: (newTaskData) => {
      const newId = `T-${Math.floor(400 + Math.random() * 500)}`;
      const task: Task = {
        ...newTaskData,
        id: newId,
        ownerName: get().user.name,
        dueLabel: "Custom",
        isOverdue: false,
      };

      set((s) => ({
        tasks: [task, ...s.tasks],
      }));

      get().dispatchAction(
        get().user.name,
        "human",
        "created task",
        `${task.id} (${task.title})`,
        task.companyId,
        "success",
        { taskId: task.id, title: task.title }
      );

      get().addToast({
        message: `Task ${newId} created.`,
        type: "success",
      });

      saveSessionState(get());
    },

    toggleScope: (scopeId: string) => {
      const sItem = get().scopes.find((s) => s.id === scopeId);
      if (!sItem) return;

      const nextVal = !sItem.granted;

      set((s) => ({
        scopes: s.scopes.map((sc) => (sc.id === scopeId ? { ...sc, granted: nextVal } : sc)),
      }));

      get().dispatchAction(
        get().user.name,
        "human",
        nextVal ? "granted scope" : "revoked scope",
        sItem.scope,
        "all",
        "success",
        { scopeId, granted: nextVal }
      );

      if (!nextVal && sItem.scope.includes("gmail.send")) {
        get().addToast({
          message: "Sending is turned off. Drafts still work.",
          type: "warning",
        });
      } else {
        get().addToast({
          message: nextVal ? `Scope ${sItem.service} enabled` : `Scope ${sItem.service} disabled`,
          type: "info",
        });
      }

      saveSessionState(get());
    },

    startAgentRun: async (taskId: string, agentId: string, instruction: string) => {
      const task = get().tasks.find((t) => t.id === taskId);
      const agent = get().agents.find((a) => a.id === agentId);
      const runId = `run-${Math.floor(950 + Math.random() * 50)}`;

      if (!task || !agent) return runId;

      const newRun: AgentRun = {
        id: runId,
        taskId,
        taskTitle: task.title,
        agentId,
        agentName: agent.name,
        startedAt: new Date().toISOString(),
        durationSeconds: 0,
        outcome: "Draft ready",
        steps: [],
      };

      set((s) => ({
        runs: [newRun, ...s.runs],
      }));

      get().dispatchAction(
        get().user.name,
        "human",
        "started agent run",
        `${agent.name} assigned to ${task.id}`,
        task.companyId,
        "success",
        { runId, taskId, agentId, instruction }
      );

      return runId;
    },

    convertActionItemToTask: (meetingId: string, actionItemId: string) => {
      const meeting = get().meetings.find((m) => m.id === meetingId);
      if (!meeting) return;

      const ai = meeting.actionItems?.find((a) => a.id === actionItemId);
      if (!ai || ai.convertedToTask) return;

      const newTaskId = `T-${Math.floor(700 + Math.random() * 200)}`;
      const newTask: Task = {
        id: newTaskId,
        title: ai.text,
        companyId: meeting.companyId === "all" ? "northgate" : meeting.companyId,
        ownerId: get().user.id,
        ownerName: get().user.name,
        dueDate: "2026-10-06",
        dueLabel: "Tue 6 Oct",
        isOverdue: false,
        status: "To do",
        description: `Generated from meeting "${meeting.title}" action items.`,
      };

      set((s) => ({
        tasks: [newTask, ...s.tasks],
        meetings: s.meetings.map((m) =>
          m.id === meetingId
            ? {
                ...m,
                actionItems: m.actionItems?.map((item) =>
                  item.id === actionItemId ? { ...item, convertedToTask: true } : item
                ),
              }
            : m
        ),
      }));

      get().dispatchAction(
        get().user.name,
        "human",
        "converted action item to task",
        `${ai.text} -> ${newTaskId}`,
        meeting.companyId === "all" ? "northgate" : meeting.companyId,
        "success",
        { meetingId, actionItemId, newTaskId }
      );

      get().addToast({
        message: `Task ${newTaskId} created from meeting item.`,
        type: "success",
      });

      saveSessionState(get());
    },

    updateSettings: (newSettings) => {
      set((s) => ({ settings: { ...s.settings, ...newSettings } }));
      get().addToast({ message: "Settings saved", type: "success" });
      saveSessionState(get());
    },

    resetDemo: () => {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem(SESSION_KEY);
      }
      set({
        role: "Owner",
        user: SEED_PEOPLE[0],
        selectedCompany: "all",
        tasks: SEED_TASKS,
        approvals: SEED_APPROVALS,
        agents: SEED_AGENTS,
        runs: SEED_RUNS,
        meetings: SEED_MEETINGS,
        activity: SEED_ACTIVITY,
        scopes: SEED_SCOPES,
        settings: {
          simulateGmailFailure: false,
          simulateAgentFailure: false,
          slowNetwork: false,
          tokenExpired: false,
          voiceRate: 1,
          briefVoice: "default",
        },
        inspector: {
          isOpen: false,
          activeTab: "state",
          currentStateNode: "Pending",
        },
        voice: {
          isOpen: false,
          mode: "brief",
          isListening: false,
          transcript: "",
        },
      });

      get().addToast({
        message: "Demo reset to initial seed state.",
        type: "info",
      });
    },

    dispatchAction: (actorName, actorType, action, object, companyId, result, payload, diff) => {
      const eventId = "act-" + Math.floor(100 + Math.random() * 900);
      const now = new Date();
      const timeStr = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

      const newEvent: ActivityEvent = {
        id: eventId,
        timeStr,
        timestamp: now.toISOString(),
        actorName,
        actorType,
        action,
        object,
        companyId,
        result,
        payload,
        diff,
      };

      set((s) => ({
        activity: [newEvent, ...s.activity],
      }));

      saveSessionState(get());
    },
  };
});
