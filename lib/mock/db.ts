export type CompanyId = "all" | "northgate" | "ashby" | "kestrel";

export interface Company {
  id: string;
  name: string;
  sector: string;
  openTasks: number;
  overdue: number;
  initials: string;
  color: string;
}

export interface Person {
  id: string;
  name: string;
  role: string;
  companyId: string; // "all", "northgate", "ashby", "kestrel"
  accessRole: "Owner" | "Chief of Staff" | "Finance lead" | "Internal" | "Contractor";
  email: string;
  initials: string;
  avatarBg: string;
  avatarFg: string;
  openTasksCount: number;
}

export type TaskStatus = "To do" | "In progress" | "Waiting" | "Needs decision" | "Done";

export interface Task {
  id: string;
  title: string;
  companyId: "northgate" | "ashby" | "kestrel";
  ownerId: string;
  ownerName: string;
  dueDate: string; // ISO date
  dueLabel: string;
  isOverdue: boolean;
  overdueDays?: number;
  status: TaskStatus;
  notes?: string;
  assignedAgent?: string;
  linkedGmailThread?: string;
  linkedDriveDoc?: string;
  isRestricted?: boolean;
  visibleToRoleIds?: string[]; // e.g. ["Owner", "Contractor:ruth"] or ["Owner", "Chief of Staff"]
  description?: string;
  subtasks?: { id: string; title: string; completed: boolean }[];
}

export type ApprovalType = "Email" | "Agreement" | "Decision" | "Plan";
export type ApprovalStatus = "Drafted" | "Pending" | "Approved" | "Sending" | "Sent" | "ChangesRequested" | "Rejected";
export type RiskLevel = "Low" | "Medium" | "High";

export interface ApprovalItem {
  id: string;
  type: ApprovalType;
  title: string;
  companyId: "northgate" | "ashby" | "kestrel";
  agentName: string;
  risk: RiskLevel;
  riskReasons?: string[];
  keyFacts: string;
  status: ApprovalStatus;
  createdAt: string;
  age: string;
  taskId?: string;
  isRestricted?: boolean;
  visibleToRoleIds?: string[];
  // Document / Email Content
  to?: string;
  cc?: string;
  subject?: string;
  content: string;
  originalContent?: string;
  isEdited?: boolean;
  rejectionReason?: string;
  approvedBy?: string;
  approvedAt?: string;
  sentAt?: string;
  contextSources: {
    id: string;
    type: "gmail" | "drive" | "calendar";
    label: string;
    detail: string;
  }[];
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  status: "Idle" | "Working";
  tools: string[];
  description: string;
  runsCount: number;
}

export interface AgentRunStep {
  id: string;
  tool: string;
  action: string;
  summary: string;
  status: "complete" | "running" | "failed";
  timestamp: string;
  durationMs: number;
}

export interface AgentRun {
  id: string;
  taskId: string;
  taskTitle: string;
  agentId: string;
  agentName: string;
  startedAt: string;
  durationSeconds: number;
  outcome: "Draft ready" | "Needs info" | "Failed";
  steps: AgentRunStep[];
  approvalId?: string;
}

export interface Meeting {
  id: string;
  dateStr: string;
  timeStr: string;
  title: string;
  companyId: "northgate" | "ashby" | "kestrel" | "all";
  attendees: { name: string; email: string; initials: string }[];
  prepStatus: "Not prepared" | "Prep ready" | "Follow-up drafted";
  prepBrief?: {
    objective: string;
    attendeeContext: string;
    openItems: string[];
    relevantDocs: string[];
    suggestedQuestions: string[];
  };
  actionItems?: { id: string; text: string; convertedToTask: boolean }[];
  followUpEmailDraft?: string;
}

export interface ActivityEvent {
  id: string;
  timeStr: string;
  timestamp: string;
  actorType: "human" | "agent" | "system";
  actorName: string;
  actorRole?: string;
  action: string;
  object: string;
  companyId: "northgate" | "ashby" | "kestrel" | "all";
  result: "success" | "blocked" | "error" | "recalled";
  payload: Record<string, any>;
  diff?: {
    before: string;
    after: string;
  };
}

export interface IntegrationScope {
  id: string;
  service: "gmail" | "drive" | "calendar";
  scope: string;
  allows: string;
  whyNeeded: string;
  agents: string[];
  sensitivity: "Sensitive" | "Restricted";
  granted: boolean;
}

export const SEED_COMPANIES: Company[] = [
  {
    id: "northgate",
    name: "Northgate Freight",
    sector: "Regional logistics",
    openTasks: 14,
    overdue: 2,
    initials: "NF",
    color: "#25443A",
  },
  {
    id: "ashby",
    name: "Ashby & Vale Hotels",
    sector: "Boutique hospitality",
    openTasks: 13,
    overdue: 3,
    initials: "AV",
    color: "#B5854B",
  },
  {
    id: "kestrel",
    name: "Kestrel Property Group",
    sector: "Commercial real estate",
    openTasks: 11,
    overdue: 1,
    initials: "KP",
    color: "#3E6A8A",
  },
];

export const SEED_PEOPLE: Person[] = [
  {
    id: "elena",
    name: "Elena Marchetti",
    role: "Founder and Owner",
    companyId: "all",
    accessRole: "Owner",
    email: "elena@marchettiholdings.com",
    initials: "EM",
    avatarBg: "#E3ECE7",
    avatarFg: "#25443A",
    openTasksCount: 4,
  },
  {
    id: "tomas",
    name: "Tomas Brandt",
    role: "Chief of Staff",
    companyId: "all",
    accessRole: "Chief of Staff",
    email: "tomas@marchettiholdings.com",
    initials: "TB",
    avatarBg: "#ECE7DD",
    avatarFg: "#1F2421",
    openTasksCount: 6,
  },
  {
    id: "priya",
    name: "Priya Nair",
    role: "Finance Lead",
    companyId: "northgate",
    accessRole: "Finance lead",
    email: "priya@northgatefreight.com",
    initials: "PN",
    avatarBg: "#F6EBD3",
    avatarFg: "#A8701A",
    openTasksCount: 7,
  },
  {
    id: "sana",
    name: "Sana Qureshi",
    role: "Operations Director",
    companyId: "northgate",
    accessRole: "Internal",
    email: "sana@northgatefreight.com",
    initials: "SQ",
    avatarBg: "#E3ECE7",
    avatarFg: "#25443A",
    openTasksCount: 5,
  },
  {
    id: "jonah",
    name: "Jonah Whitfield",
    role: "General Manager",
    companyId: "ashby",
    accessRole: "Internal",
    email: "jonah@ashbyandvale.com",
    initials: "JW",
    avatarBg: "#F3E8D6",
    avatarFg: "#B5854B",
    openTasksCount: 6,
  },
  {
    id: "marcus",
    name: "Marcus Doyle",
    role: "Property Manager",
    companyId: "kestrel",
    accessRole: "Internal",
    email: "marcus@kestrelproperty.com",
    initials: "MD",
    avatarBg: "#E1EAF1",
    avatarFg: "#3E6A8A",
    openTasksCount: 5,
  },
  {
    id: "ruth",
    name: "Ruth Okafor",
    role: "External legal counsel",
    companyId: "all",
    accessRole: "Contractor",
    email: "ruth.okafor@okaforlaw.co.uk",
    initials: "RO",
    avatarBg: "#EEE9DF",
    avatarFg: "#4A514C",
    openTasksCount: 3,
  },
  {
    id: "iris",
    name: "Iris Delacroix",
    role: "Marketing contractor",
    companyId: "ashby",
    accessRole: "Contractor",
    email: "iris@delacroixcreative.studio",
    initials: "ID",
    avatarBg: "#EEE9DF",
    avatarFg: "#4A514C",
    openTasksCount: 2,
  },
];

export const SEED_TASKS: Task[] = [
  // Kestrel (11 tasks: 1 overdue)
  {
    id: "T-201",
    title: "Renew Harlow & Sons lease, Unit 4B (12 months)",
    companyId: "kestrel",
    ownerId: "marcus",
    ownerName: "Marcus Doyle",
    dueDate: "2026-10-03",
    dueLabel: "Sat 3 Oct",
    isOverdue: false,
    status: "In progress",
    notes: "Agent: Drafter; linked Gmail thread and Drive lease",
    assignedAgent: "Drafter",
    linkedGmailThread: "Harlow renewal negotiation, 14 Sep",
    linkedDriveDoc: "Lease_Harlow_2023.pdf",
    description: "Prepare 12-month commercial extension for Unit 4B with 3.5% indexed escalation clause.",
    subtasks: [
      { id: "st-1", title: "Review past lease obligations", completed: true },
      { id: "st-2", title: "Agent drafted renewal terms", completed: true },
      { id: "st-3", title: "Owner approval", completed: false },
    ],
  },
  {
    id: "T-202",
    title: "Approve roof repair quote, Bellmore Plaza ($18,900)",
    companyId: "kestrel",
    ownerId: "priya",
    ownerName: "Priya Nair",
    dueDate: "2026-09-28",
    dueLabel: "Mon 28 Sep",
    isOverdue: true,
    overdueDays: 3,
    status: "Waiting",
    notes: "Waiting on second quote from Apex Contractors",
    description: "Storm damage roof inspection completed. Apex estimate pending before Elena sign-off.",
  },
  {
    id: "T-902",
    title: "Inbound inquiry: Calder Self-Storage portfolio (restricted)",
    companyId: "kestrel",
    ownerId: "tomas",
    ownerName: "Tomas Brandt",
    dueDate: "2026-10-16",
    dueLabel: "Fri 16 Oct",
    isOverdue: false,
    status: "To do",
    notes: "Visible to Owner and Chief of Staff",
    isRestricted: true,
    visibleToRoleIds: ["Owner", "Chief of Staff"],
    description: "Confidential acquisition feeler for 3 prime commercial sites in Leeds.",
  },
  {
    id: "T-204",
    title: "Quarterly HVAC inspection sign-off, Westgate Tower",
    companyId: "kestrel",
    ownerId: "marcus",
    ownerName: "Marcus Doyle",
    dueDate: "2026-10-07",
    dueLabel: "Wed 7 Oct",
    isOverdue: false,
    status: "In progress",
  },
  {
    id: "T-205",
    title: "Review tenant service charge reconciliation 2025/26",
    companyId: "kestrel",
    ownerId: "priya",
    ownerName: "Priya Nair",
    dueDate: "2026-10-10",
    dueLabel: "Sat 10 Oct",
    isOverdue: false,
    status: "To do",
  },
  {
    id: "T-206",
    title: "Approve security gate contractor deposit ($4,200)",
    companyId: "kestrel",
    ownerId: "elena",
    ownerName: "Elena Marchetti",
    dueDate: "2026-10-04",
    dueLabel: "Sun 4 Oct",
    isOverdue: false,
    status: "Needs decision",
  },
  {
    id: "T-207",
    title: "Finalise lease termination paperwork, Unit 12A",
    companyId: "kestrel",
    ownerId: "marcus",
    ownerName: "Marcus Doyle",
    dueDate: "2026-10-12",
    dueLabel: "Mon 12 Oct",
    isOverdue: false,
    status: "In progress",
  },
  {
    id: "T-208",
    title: "Verify fire warden certifications across commercial units",
    companyId: "kestrel",
    ownerId: "marcus",
    ownerName: "Marcus Doyle",
    dueDate: "2026-10-15",
    dueLabel: "Thu 15 Oct",
    isOverdue: false,
    status: "To do",
  },
  {
    id: "T-209",
    title: "Evaluate solar panel installation grants",
    companyId: "kestrel",
    ownerId: "tomas",
    ownerName: "Tomas Brandt",
    dueDate: "2026-10-19",
    dueLabel: "Mon 19 Oct",
    isOverdue: false,
    status: "Waiting",
  },
  {
    id: "T-210",
    title: "Update building hazard register per Oct 2026 statutory guidelines",
    companyId: "kestrel",
    ownerId: "marcus",
    ownerName: "Marcus Doyle",
    dueDate: "2026-10-22",
    dueLabel: "Thu 22 Oct",
    isOverdue: false,
    status: "To do",
  },
  {
    id: "T-211",
    title: "Review Kestrel annual insurance binder terms",
    companyId: "kestrel",
    ownerId: "priya",
    ownerName: "Priya Nair",
    dueDate: "2026-10-25",
    dueLabel: "Sun 25 Oct",
    isOverdue: false,
    status: "To do",
  },

  // Northgate (14 tasks: 2 overdue)
  {
    id: "T-101",
    title: "Decide on Crown FC5 forklift lease ($42,500, 36 months)",
    companyId: "northgate",
    ownerId: "elena",
    ownerName: "Elena Marchetti",
    dueDate: "2026-10-02",
    dueLabel: "Fri 2 Oct",
    isOverdue: false,
    status: "Needs decision",
    notes: "Appears in Needs you queue; buyout $6,200",
    description: "Fleet replacement for Depot 2. Priya reviewed cash impact; Elena approval required before order.",
  },
  {
    id: "T-102",
    title: "Reconcile September carrier invoices",
    companyId: "northgate",
    ownerId: "priya",
    ownerName: "Priya Nair",
    dueDate: "2026-09-30",
    dueLabel: "Wed 30 Sep",
    isOverdue: true,
    overdueDays: 1,
    status: "In progress",
  },
  {
    id: "T-103",
    title: "Q4 driver retention plan",
    companyId: "northgate",
    ownerId: "sana",
    ownerName: "Sana Qureshi",
    dueDate: "2026-10-09",
    dueLabel: "Fri 9 Oct",
    isOverdue: false,
    status: "To do",
    assignedAgent: "Planner",
  },
  {
    id: "T-104",
    title: "Audit Depot 4 fuel card expense anomalies ($3,150)",
    companyId: "northgate",
    ownerId: "priya",
    ownerName: "Priya Nair",
    dueDate: "2026-09-27",
    dueLabel: "Sun 27 Sep",
    isOverdue: true,
    overdueDays: 4,
    status: "In progress",
  },
  {
    id: "T-105",
    title: "Renew regional transit safety accreditation",
    companyId: "northgate",
    ownerId: "sana",
    ownerName: "Sana Qureshi",
    dueDate: "2026-10-06",
    dueLabel: "Tue 6 Oct",
    isOverdue: false,
    status: "In progress",
  },
  {
    id: "T-106",
    title: "Negotiate bulk AdBlue supplier contract",
    companyId: "northgate",
    ownerId: "sana",
    ownerName: "Sana Qureshi",
    dueDate: "2026-10-08",
    dueLabel: "Thu 8 Oct",
    isOverdue: false,
    status: "Waiting",
  },
  {
    id: "T-107",
    title: "Sign off telemetry software upgrade on 40 prime movers",
    companyId: "northgate",
    ownerId: "elena",
    ownerName: "Elena Marchetti",
    dueDate: "2026-10-11",
    dueLabel: "Sun 11 Oct",
    isOverdue: false,
    status: "To do",
  },
  {
    id: "T-108",
    title: "Approve route optimisation trial in Midlands corridor",
    companyId: "northgate",
    ownerId: "tomas",
    ownerName: "Tomas Brandt",
    dueDate: "2026-10-13",
    dueLabel: "Tue 13 Oct",
    isOverdue: false,
    status: "In progress",
  },
  {
    id: "T-109",
    title: "Review tachograph compliance filings with DVSA",
    companyId: "northgate",
    ownerId: "sana",
    ownerName: "Sana Qureshi",
    dueDate: "2026-10-14",
    dueLabel: "Wed 14 Oct",
    isOverdue: false,
    status: "To do",
  },
  {
    id: "T-110",
    title: "Driver bonus scheme restructuring for peak logistics",
    companyId: "northgate",
    ownerId: "priya",
    ownerName: "Priya Nair",
    dueDate: "2026-10-17",
    dueLabel: "Sat 17 Oct",
    isOverdue: false,
    status: "To do",
  },
  {
    id: "T-111",
    title: "Resolve cross-dock freight claim with EuroCargo Ltd",
    companyId: "northgate",
    ownerId: "sana",
    ownerName: "Sana Qureshi",
    dueDate: "2026-10-18",
    dueLabel: "Sun 18 Oct",
    isOverdue: false,
    status: "Waiting",
  },
  {
    id: "T-112",
    title: "Finalise tyre retreading framework agreement",
    companyId: "northgate",
    ownerId: "sana",
    ownerName: "Sana Qureshi",
    dueDate: "2026-10-20",
    dueLabel: "Tue 20 Oct",
    isOverdue: false,
    status: "To do",
  },
  {
    id: "T-113",
    title: "Depot 1 perimeter fence repair sign-off",
    companyId: "northgate",
    ownerId: "tomas",
    ownerName: "Tomas Brandt",
    dueDate: "2026-10-21",
    dueLabel: "Wed 21 Oct",
    isOverdue: false,
    status: "To do",
  },
  {
    id: "T-114",
    title: "Review Northgate Q3 fleet utilization dashboard",
    companyId: "northgate",
    ownerId: "elena",
    ownerName: "Elena Marchetti",
    dueDate: "2026-10-24",
    dueLabel: "Sat 24 Oct",
    isOverdue: false,
    status: "To do",
  },

  // Ashby & Vale (13 tasks: 3 overdue)
  {
    id: "T-301",
    title: "BlueRidge Linens supply agreement ($184,000 per year, 2 years)",
    companyId: "ashby",
    ownerId: "ruth",
    ownerName: "Ruth Okafor",
    dueDate: "2026-10-05",
    dueLabel: "Mon 5 Oct",
    isOverdue: false,
    status: "Waiting",
    notes: "Agent: Contract Agent",
    assignedAgent: "Contract Agent",
    description: "High-value commercial laundry and linen supply contract. Auto-renew flagged.",
  },
  {
    id: "T-302",
    title: "Q4 staffing plan, all three properties",
    companyId: "ashby",
    ownerId: "jonah",
    ownerName: "Jonah Whitfield",
    dueDate: "2026-10-04",
    dueLabel: "Sun 4 Oct",
    isOverdue: false,
    status: "In progress",
    notes: "Agent: Planner",
    assignedAgent: "Planner",
    description: "Seasonal kitchen and housekeeping rotas covering autumn through New Year.",
  },
  {
    id: "T-303",
    title: "Sign off holiday menu pricing",
    companyId: "ashby",
    ownerId: "jonah",
    ownerName: "Jonah Whitfield",
    dueDate: "2026-09-26",
    dueLabel: "Sat 26 Sep",
    isOverdue: true,
    overdueDays: 5,
    status: "To do",
    notes: "Overdue 5 days; banquet pricing margin review",
  },
  {
    id: "T-901",
    title: "Separation terms for regional manager (restricted)",
    companyId: "ashby",
    ownerId: "ruth",
    ownerName: "Ruth Okafor",
    dueDate: "2026-10-06",
    dueLabel: "Tue 6 Oct",
    isOverdue: false,
    status: "In progress",
    notes: "Visible to Owner and Ruth Okafor only",
    isRestricted: true,
    visibleToRoleIds: ["Owner", "Contractor:ruth"],
    description: "Strictly confidential settlement and non-disclosure terms for departing senior manager.",
  },
  {
    id: "T-305",
    title: "Repair wine cellar refrigeration unit, The Vale Manor",
    companyId: "ashby",
    ownerId: "jonah",
    ownerName: "Jonah Whitfield",
    dueDate: "2026-09-29",
    dueLabel: "Tue 29 Sep",
    isOverdue: true,
    overdueDays: 2,
    status: "In progress",
  },
  {
    id: "T-306",
    title: "Autumn banquet collateral printing approval",
    companyId: "ashby",
    ownerId: "iris",
    ownerName: "Iris Delacroix",
    dueDate: "2026-09-28",
    dueLabel: "Mon 28 Sep",
    isOverdue: true,
    overdueDays: 3,
    status: "Waiting",
  },
  {
    id: "T-307",
    title: "Renew boutique hotel liquor licence with district council",
    companyId: "ashby",
    ownerId: "jonah",
    ownerName: "Jonah Whitfield",
    dueDate: "2026-10-07",
    dueLabel: "Wed 7 Oct",
    isOverdue: false,
    status: "In progress",
  },
  {
    id: "T-308",
    title: "Select organic amenities vendor for guest rooms",
    companyId: "ashby",
    ownerId: "jonah",
    ownerName: "Jonah Whitfield",
    dueDate: "2026-10-09",
    dueLabel: "Fri 9 Oct",
    isOverdue: false,
    status: "To do",
  },
  {
    id: "T-309",
    title: "Review winter wedding advance deposit policies",
    companyId: "ashby",
    ownerId: "priya",
    ownerName: "Priya Nair",
    dueDate: "2026-10-11",
    dueLabel: "Sun 11 Oct",
    isOverdue: false,
    status: "To do",
  },
  {
    id: "T-310",
    title: "Spa therapist scheduling for festive season rush",
    companyId: "ashby",
    ownerId: "jonah",
    ownerName: "Jonah Whitfield",
    dueDate: "2026-10-15",
    dueLabel: "Thu 15 Oct",
    isOverdue: false,
    status: "To do",
  },
  {
    id: "T-311",
    title: "Review local tourism PR agency monthly pitch",
    companyId: "ashby",
    ownerId: "iris",
    ownerName: "Iris Delacroix",
    dueDate: "2026-10-16",
    dueLabel: "Fri 16 Oct",
    isOverdue: false,
    status: "In progress",
  },
  {
    id: "T-312",
    title: "Health & hygiene pre-audit for main kitchen",
    companyId: "ashby",
    ownerId: "jonah",
    ownerName: "Jonah Whitfield",
    dueDate: "2026-10-20",
    dueLabel: "Tue 20 Oct",
    isOverdue: false,
    status: "To do",
  },
  {
    id: "T-313",
    title: "Review property energy audit and solar heating feasibility",
    companyId: "ashby",
    ownerId: "tomas",
    ownerName: "Tomas Brandt",
    dueDate: "2026-10-23",
    dueLabel: "Fri 23 Oct",
    isOverdue: false,
    status: "To do",
  },
];

export const SEED_APPROVALS: ApprovalItem[] = [
  {
    id: "A-501",
    type: "Email",
    title: "Reply to Harlow & Sons: lease renewal terms",
    companyId: "kestrel",
    agentName: "Drafter",
    risk: "Medium",
    riskReasons: ["External counterparty (Harriet Harlow)", "Commercial rent indexed adjustment (+3.5%)"],
    keyFacts: "To Harriet Harlow (external); rent +3.5%, 12 months; 218 words",
    status: "Pending",
    createdAt: "2026-10-01T09:12:00Z",
    age: "18 min ago",
    taskId: "T-201",
    to: "harriet.harlow@harlowandsons.co.uk",
    cc: "marcus@kestrelproperty.com, elena@marchettiholdings.com",
    subject: "Re: Unit 4B Lease Renewal Terms — Kestrel Property Group",
    content: `Dear Harriet,

Following our discussion on 14 September and Marcus's walkthrough last week, we are pleased to offer a 12-month lease renewal for Unit 4B at St. Jude's Wharf, commencing 1 November 2026.

As discussed, base rent will adjust by 3.5% in line with prevailing commercial indexing, bringing the monthly commitment to £4,850 payable in advance on the 1st of each calendar month. The maintenance covenants and existing service charges will continue under the standard schedule established in your 2023 agreement.

If these renewal terms align with your operational roadmap, Marcus will issue the countersigned renewal counterpart for formal execution.

Warm regards,
Elena Marchetti
Founder & Principal, Kestrel Property Group`,
    contextSources: [
      {
        id: "ctx-1",
        type: "gmail",
        label: "Gmail thread: Harlow renewal negotiation",
        detail: "3 messages exchanged between Harriet Harlow & Marcus Doyle, 14-22 Sep",
      },
      {
        id: "ctx-2",
        type: "drive",
        label: "Drive: Lease_Harlow_2023.pdf",
        detail: "Current 36-month lease covenant, index adjustment clauses §4.2",
      },
      {
        id: "ctx-3",
        type: "calendar",
        label: "Calendar: Call with Marcus",
        detail: "28 Sep prep call notes confirming 3.5% threshold",
      },
    ],
  },
  {
    id: "A-502",
    type: "Agreement",
    title: "BlueRidge Linens supply agreement",
    companyId: "ashby",
    agentName: "Contract Agent",
    risk: "High",
    riskReasons: ["High annual liability ($184,000/yr)", "Automatic 24-month renewal penalty clause flagged"],
    keyFacts: "$184,000 per year; 2 years; auto-renew clause flagged; 9 pages",
    status: "Pending",
    createdAt: "2026-10-01T08:45:00Z",
    age: "45 min ago",
    taskId: "T-301",
    to: "legal@blueridgelinens.com",
    cc: "ruth.okafor@okaforlaw.co.uk, jonah@ashbyandvale.com",
    subject: "Supply & Commercial Laundry Agreement — Ashby & Vale Hotels",
    content: `MASTER SERVICES AGREEMENT: COMMERCIAL LAUNDRY & LINEN SUPPLY

This Agreement is made on 1 October 2026 between BlueRidge Linens Ltd and Ashby & Vale Hotels Ltd.

1. Scope of Service: Contractor shall provide daily linen turnaround, dry cleaning, and Egyptian cotton bed sets across three property locations.
2. Financial Consideration: Annual fee of £184,000 payable in equal monthly arrears against verified delivery receipts.
3. Term and Renewal: Fixed term of 24 months. [FLAGGED BY AGENT: Clause 8.3 automatically renews for an additional 24 months unless 90-day written cancellation is tendered. Contract Agent recommends reducing auto-renew to 12 months with 30-day notice.]
4. Performance Guarantees: 99.2% on-time delivery threshold. Late deliveries exceeding 3 hours incur a 5% daily credit deduction.`,
    contextSources: [
      {
        id: "ctx-4",
        type: "drive",
        label: "Drive: BlueRidge_Draft_Contract_v2.pdf",
        detail: "Full 9-page supplier terms uploaded 29 Sep",
      },
      {
        id: "ctx-5",
        type: "drive",
        label: "Drive: Ashby_Vendor_Guidelines_2026.docx",
        detail: "Standard legal indemnity requirements specified by Ruth Okafor",
      },
    ],
  },
  {
    id: "A-503",
    type: "Decision",
    title: "Crown FC5 forklift lease",
    companyId: "northgate",
    agentName: "Priya Nair (human request)",
    risk: "Medium",
    riskReasons: ["Capital commitment ($42,500 over 36 months)", "Buyout residual clause"],
    keyFacts: "$42,500; 36 months; buyout $6,200; deadline Fri 2 Oct",
    status: "Pending",
    createdAt: "2026-10-01T08:15:00Z",
    age: "1 hr ago",
    taskId: "T-101",
    to: "finance@northgatefreight.com",
    subject: "Executive Approval Request: Crown FC5 Electric Forklift Replacement",
    content: `EXECUTIVE DECISION MEMORANDUM

From: Priya Nair, Finance Lead
To: Elena Marchetti, Owner
Subject: Crown FC5 Forklift Lease Agreement — Depot 2

Summary:
Depot 2's primary counterbalance forklift has reached end-of-life maintenance status. Crown Equipment Finance offers an operating lease package:
• Capital Value: £42,500
• Term: 36 monthly payments of £1,180
• Guaranteed residual buyout: £6,200 at month 36
• Service package included: full battery warranty and quarterly preventative servicing

Priya's note: Cash flow analysis shows this reduces monthly depot maintenance expenses by £340 compared to retaining current aging machinery. Approval is required before Friday 2 Oct to lock in Q4 promo financing rates.`,
    contextSources: [
      {
        id: "ctx-6",
        type: "drive",
        label: "Drive: Crown_FC5_Quote_Depot2.pdf",
        detail: "Official quotation and lease schedule from Crown Equipment Ltd",
      },
    ],
  },
  {
    id: "A-504",
    type: "Plan",
    title: "Q4 staffing plan",
    companyId: "ashby",
    agentName: "Planner",
    risk: "Low",
    riskReasons: ["Internal workforce allocation", "Budget pre-approved within FY26 thresholds"],
    keyFacts: "Internal; +6 seasonal hires; 2-page plan",
    status: "Pending",
    createdAt: "2026-10-01T07:30:00Z",
    age: "2 hrs ago",
    taskId: "T-302",
    to: "jonah@ashbyandvale.com",
    subject: "Q4 Operational Staffing & Seasonal Coverage Plan",
    content: `Q4 SEASONAL WORKFORCE PLAN: ASHBY & VALE HOTELS

Prepared by: Planner Agent
Supervising Manager: Jonah Whitfield

Headcount Additions:
• Vale Manor: +3 Seasonal Front of House, +1 Sous Chef (Contract: 15 Oct 2026 – 5 Jan 2027)
• High Mill Lodge: +2 Housekeeping Associates (Contract: 1 Nov 2026 – 2 Jan 2027)

Budgetary Impact:
Total allocated payroll increase: £28,400 across the 10-week peak window. This represents a 4.2% reduction versus 2025 agency spending by utilizing direct seasonal contracts.

Next Step:
Upon Elena's sign-off, Jonah Whitfield will post regional hospitality notices and initiate onboarding pack distributions.`,
    contextSources: [
      {
        id: "ctx-7",
        type: "drive",
        label: "Drive: FY25_Holiday_Staffing_Review.xlsx",
        detail: "Historical agency expense breakdown and overtime data",
      },
    ],
  },
  {
    id: "A-505",
    type: "Agreement",
    title: "Separation terms draft (restricted)",
    companyId: "ashby",
    agentName: "Contract Agent",
    risk: "High",
    riskReasons: ["Strictly confidential personnel matter", "Severance liability and non-disparagement covenants"],
    keyFacts: "Visible to Owner and Ruth Okafor only",
    status: "Pending",
    createdAt: "2026-09-30T17:40:00Z",
    age: "Yesterday",
    taskId: "T-901",
    isRestricted: true,
    visibleToRoleIds: ["Owner", "Contractor:ruth"],
    to: "ruth.okafor@okaforlaw.co.uk",
    subject: "Privileged & Confidential: Separation Agreement Terms",
    content: `CONFIDENTIAL SETTLEMENT AND SEPARATION AGREEMENT

Prepared by: Contract Agent under instruction from Ruth Okafor, Legal Counsel
Parties: Ashby & Vale Hotels Ltd and [Restricted Personnel Record]

Key Terms:
1. Severance Consideration: 3 months statutory base pay plus accrued leave settlement.
2. Non-Disclosure & Mutual Non-Disparagement: Strict 24-month restriction covering commercial supplier relations, guest privacy, and operational data.
3. Restrictive Covenant: 6-month non-solicitation of hotel supervisory staff within a 25-mile radius.`,
    contextSources: [
      {
        id: "ctx-8",
        type: "drive",
        label: "Drive: Ashby_Executive_Contract_Template.docx",
        detail: "Standard counsel template with clause §12 restrictive covenants",
      },
    ],
  },
  // Historical items:
  {
    id: "A-498",
    type: "Email",
    title: "Thanks reply to Calder inquiry",
    companyId: "kestrel",
    agentName: "Drafter",
    risk: "Low",
    keyFacts: "Preliminary acknowledgment of commercial portfolio inquiry",
    status: "Sent",
    createdAt: "2026-09-29T14:20:00Z",
    age: "Tue 29 Sep",
    approvedBy: "Elena Marchetti",
    approvedAt: "2026-09-29T14:22:00Z",
    sentAt: "2026-09-29T14:23:00Z",
    to: "acquisitions@calderholdings.co.uk",
    subject: "Re: Calder Portfolio Preliminary Exploration",
    content: "Dear Arthur, Thank you for your note. Elena Marchetti and Tomas Brandt have received the memorandum and will review during leadership sync.",
    contextSources: [],
  },
  {
    id: "A-499",
    type: "Email",
    title: "Vendor insurance certificate request",
    companyId: "kestrel",
    agentName: "Drafter",
    risk: "Low",
    keyFacts: "Annual public liability certificate request for Bellmore Plaza vendors",
    status: "Approved",
    createdAt: "2026-09-30T18:35:00Z",
    age: "Wed 30 Sep",
    approvedBy: "Elena Marchetti",
    approvedAt: "2026-09-30T18:40:00Z",
    to: "compliance@bellmoremaintenance.co.uk",
    subject: "Annual Certificate of Insurance Renewal Notice",
    content: "Please provide updated Public Liability and Employers' Liability insurance certificates valid for the 2026/27 operating year.",
    contextSources: [],
  },
  {
    id: "A-500",
    type: "Email",
    title: "Ashby autumn newsletter draft",
    companyId: "ashby",
    agentName: "Drafter",
    risk: "Low",
    keyFacts: "Marketing mailer to loyalty guests",
    status: "Rejected",
    rejectionReason: "Wrong tone",
    createdAt: "2026-09-28T17:15:00Z",
    age: "Mon 28 Sep",
    to: "marketing@ashbyandvale.com",
    subject: "Discover Autumn Tranquillity at Vale Manor",
    content: "Hey luxury lovers! Autumn has arrived with super cozy vibes and hot deals...",
    contextSources: [],
  },
];

export const SEED_AGENTS: Agent[] = [
  {
    id: "drafter",
    name: "Drafter",
    role: "Drafts client correspondence, lease terms, and vendor emails into the approval queue.",
    status: "Idle",
    tools: ["Gmail read", "Drive search", "Calendar read"],
    description: "Specialized in professional executive correspondence, commercial tone calibration, and thread synthesis.",
    runsCount: 142,
  },
  {
    id: "contract-agent",
    name: "Contract Agent",
    role: "Analyzes supplier agreements, flags non-standard liabilities, and drafts amendments.",
    status: "Idle",
    tools: ["Drive search", "Doc analysis"],
    description: "Detects hidden auto-renewals, non-standard indemnity clauses, and verifies financial terms against approved quotes.",
    runsCount: 88,
  },
  {
    id: "planner",
    name: "Planner",
    role: "Synthesizes headcount, operational budgets, and driver scheduling into reviewable plans.",
    status: "Idle",
    tools: ["Drive search", "Spreadsheet model"],
    description: "Constructs multi-scenario operational plans, staffing requirements, and financial impact summaries.",
    runsCount: 64,
  },
  {
    id: "briefer",
    name: "Briefer",
    role: "Compiles daily voice briefs, executive briefings, and meeting preparation summaries.",
    status: "Idle",
    tools: ["Gmail read", "Calendar read", "Task analysis"],
    description: "Processes overnight activity, urgent deadlines, and meeting contexts into concise 2-minute executive summaries.",
    runsCount: 219,
  },
];

export const SEED_RUNS: AgentRun[] = [
  {
    id: "run-901",
    taskId: "T-201",
    taskTitle: "Renew Harlow & Sons lease, Unit 4B",
    agentId: "drafter",
    agentName: "Drafter",
    startedAt: "2026-10-01T09:08:00Z",
    durationSeconds: 24,
    outcome: "Draft ready",
    steps: [
      {
        id: "s1",
        tool: "Drive search",
        action: "Searched Drive for 'Harlow lease'",
        summary: "Located Lease_Harlow_2023.pdf; extracted 3.5% index covenant §4.2",
        status: "complete",
        timestamp: "09:08:06",
        durationMs: 720,
      },
      {
        id: "s2",
        tool: "Gmail read",
        action: "Read Gmail thread (3 messages)",
        summary: "Analyzed Harriet Harlow requirements and Marcus Doyle walk-through notes",
        status: "complete",
        timestamp: "09:08:14",
        durationMs: 840,
      },
      {
        id: "s3",
        tool: "Drafting",
        action: "Drafted email (218 words)",
        summary: "Drafted renewal proposal with explicit commercial terms and rent calculation",
        status: "complete",
        timestamp: "09:08:21",
        durationMs: 1120,
      },
      {
        id: "s4",
        tool: "Approval Queue",
        action: "Submitted to approval queue",
        summary: "Waiting for human approval (A-501 created)",
        status: "complete",
        timestamp: "09:08:24",
        durationMs: 310,
      },
    ],
    approvalId: "A-501",
  },
  {
    id: "run-902",
    taskId: "T-301",
    taskTitle: "BlueRidge Linens supply agreement",
    agentId: "contract-agent",
    agentName: "Contract Agent",
    startedAt: "2026-10-01T08:41:00Z",
    durationSeconds: 42,
    outcome: "Draft ready",
    steps: [
      {
        id: "s21",
        tool: "Drive search",
        action: "Indexed BlueRidge_Draft_Contract_v2.pdf (9 pages)",
        summary: "Extracted fee schedule (£184k/yr) and delivery SLAs",
        status: "complete",
        timestamp: "08:41:12",
        durationMs: 920,
      },
      {
        id: "s22",
        tool: "Doc analysis",
        action: "Risk analysis on contract terms",
        summary: "FLAGGED: 24-month automatic renewal penalty detected in §8.3",
        status: "complete",
        timestamp: "08:41:26",
        durationMs: 1400,
      },
      {
        id: "s23",
        tool: "Approval Queue",
        action: "Submitted to approval queue",
        summary: "Submitted draft with highlighted auto-renewal warning (A-502)",
        status: "complete",
        timestamp: "08:41:42",
        durationMs: 400,
      },
    ],
    approvalId: "A-502",
  },
  {
    id: "run-903",
    taskId: "T-302",
    taskTitle: "Q4 staffing plan, all three properties",
    agentId: "planner",
    agentName: "Planner",
    startedAt: "2026-10-01T07:22:00Z",
    durationSeconds: 38,
    outcome: "Draft ready",
    steps: [
      {
        id: "s31",
        tool: "Drive search",
        action: "Parsed FY25 historical holiday agency spend",
        summary: "Identified £36,200 peak agency spend from prior year",
        status: "complete",
        timestamp: "07:22:15",
        durationMs: 890,
      },
      {
        id: "s32",
        tool: "Spreadsheet model",
        action: "Constructed direct hire vs agency cost model",
        summary: "Calculated £7,800 projected cost savings with 6 direct seasonal staff",
        status: "complete",
        timestamp: "07:22:31",
        durationMs: 1100,
      },
      {
        id: "s33",
        tool: "Approval Queue",
        action: "Generated executive review memo",
        summary: "Submitted Q4 Staffing Plan into approval queue (A-504)",
        status: "complete",
        timestamp: "07:22:38",
        durationMs: 380,
      },
    ],
    approvalId: "A-504",
  },
  {
    id: "run-904",
    taskId: "T-103",
    taskTitle: "Q4 driver retention plan",
    agentId: "planner",
    agentName: "Planner",
    startedAt: "2026-09-30T16:10:00Z",
    durationSeconds: 52,
    outcome: "Needs info",
    steps: [
      {
        id: "s41",
        tool: "Drive search",
        action: "Reviewed current Northgate driver turnover metrics",
        summary: "Found 14% annual turnover in Depot 1 & 3",
        status: "complete",
        timestamp: "16:10:15",
        durationMs: 910,
      },
      {
        id: "s42",
        tool: "HR Data",
        action: "Cross-referenced competitor pay benchmarking",
        summary: "Missing updated Midlands regional mileage bonus rates from Sana Qureshi",
        status: "complete",
        timestamp: "16:10:38",
        durationMs: 1200,
      },
      {
        id: "s43",
        tool: "Notification",
        action: "Prompted task owner for additional inputs",
        summary: "Requested bonus tariff clarification before final plan compilation",
        status: "complete",
        timestamp: "16:10:52",
        durationMs: 450,
      },
    ],
  },
  {
    id: "run-905",
    taskId: "T-204",
    taskTitle: "Quarterly HVAC inspection sign-off",
    agentId: "drafter",
    agentName: "Drafter",
    startedAt: "2026-09-30T11:20:00Z",
    durationSeconds: 19,
    outcome: "Draft ready",
    steps: [
      {
        id: "s51",
        tool: "Drive search",
        action: "Found certified engineer inspection log",
        summary: "Confirmed Westgate Tower chiller units passed statutory safety pressure test",
        status: "complete",
        timestamp: "11:20:10",
        durationMs: 780,
      },
      {
        id: "s52",
        tool: "Approval Queue",
        action: "Generated landlord sign-off draft",
        summary: "Submitted confirmation certificate to Approvals",
        status: "complete",
        timestamp: "11:20:19",
        durationMs: 400,
      },
    ],
  },
  {
    id: "run-906",
    taskId: "T-901",
    taskTitle: "Separation terms for regional manager",
    agentId: "contract-agent",
    agentName: "Contract Agent",
    startedAt: "2026-09-30T17:34:00Z",
    durationSeconds: 46,
    outcome: "Draft ready",
    steps: [
      {
        id: "s61",
        tool: "Drive search",
        action: "Loaded executive settlement precedent",
        summary: "Extracted non-solicitation covenants (§12) and statutory redundancy matrix",
        status: "complete",
        timestamp: "17:34:18",
        durationMs: 1040,
      },
      {
        id: "s62",
        tool: "Approval Queue",
        action: "Restricted draft created",
        summary: "Submitted A-505 with strict Owner and Legal visibility tags",
        status: "complete",
        timestamp: "17:34:46",
        durationMs: 380,
      },
    ],
    approvalId: "A-505",
  },
];

export const SEED_MEETINGS: Meeting[] = [
  {
    id: "M-1",
    dateStr: "Thu 1 Oct",
    timeStr: "11:00",
    title: "Harlow & Sons renewal call",
    companyId: "kestrel",
    attendees: [
      { name: "Elena Marchetti", email: "elena@marchettiholdings.com", initials: "EM" },
      { name: "Marcus Doyle", email: "marcus@kestrelproperty.com", initials: "MD" },
      { name: "Harriet Harlow", email: "harriet.harlow@harlowandsons.co.uk", initials: "HH" },
    ],
    prepStatus: "Prep ready",
    prepBrief: {
      objective: "Confirm terms for 12-month commercial lease renewal of Unit 4B at St. Jude's Wharf.",
      attendeeContext: "Harriet Harlow has managed operations for 8 years. On-time rent payment record is 100%. Concerned about energy cost surcharges.",
      openItems: [
        "A-501 lease email is pending Elena's approval in the queue",
        "Roof inspection at adjacent Bellmore unit scheduled for next week",
      ],
      relevantDocs: [
        "Lease_Harlow_2023.pdf",
        "Harlow_Payment_History_2026.csv",
      ],
      suggestedQuestions: [
        "Are Harlow & Sons satisfied with the 3.5% index adjustment cap?",
        "Do they require any facility modification permissions for their Q1 logistics expansion?",
      ],
    },
    actionItems: [
      { id: "ai-1", text: "Execute countersigned lease agreement counterpart", convertedToTask: false },
      { id: "ai-2", text: "Verify energy meter calibration at Unit 4B with Marcus", convertedToTask: false },
    ],
    followUpEmailDraft: "Hi Harriet, Great speaking earlier today. As agreed, we're locking in the 12-month extension at 3.5% indexing...",
  },
  {
    id: "M-2",
    dateStr: "Thu 1 Oct",
    timeStr: "14:30",
    title: "Weekly operations review",
    companyId: "northgate",
    attendees: [
      { name: "Elena Marchetti", email: "elena@marchettiholdings.com", initials: "EM" },
      { name: "Sana Qureshi", email: "sana@northgatefreight.com", initials: "SQ" },
      { name: "Priya Nair", email: "priya@northgatefreight.com", initials: "PN" },
    ],
    prepStatus: "Not prepared",
    prepBrief: {
      objective: "Review Q4 logistics readiness, Depot 2 forklift replacement, and carrier invoice reconciliation.",
      attendeeContext: "Sana has achieved 97.4% on-time transit this week. Priya is tracking the $42,500 forklift lease approval deadline.",
      openItems: [
        "T-101 forklift lease decision waiting on Elena ($42,500)",
        "T-102 September carrier invoices overdue by 1 day",
      ],
      relevantDocs: [
        "Northgate_Q3_Transit_Performance.pdf",
        "Crown_FC5_Quote_Depot2.pdf",
      ],
      suggestedQuestions: [
        "Has Priya locked in the Crown finance promo before Friday's cut-off?",
        "What is the impact of the fuel card expense anomaly at Depot 4?",
      ],
    },
  },
  {
    id: "M-3",
    dateStr: "Fri 2 Oct",
    timeStr: "10:00",
    title: "BlueRidge Linens negotiation",
    companyId: "ashby",
    attendees: [
      { name: "Elena Marchetti", email: "elena@marchettiholdings.com", initials: "EM" },
      { name: "Jonah Whitfield", email: "jonah@ashbyandvale.com", initials: "JW" },
      { name: "Ruth Okafor", email: "ruth.okafor@okaforlaw.co.uk", initials: "RO" },
      { name: "Colin BlueRidge", email: "colin@blueridgelinens.com", initials: "CB" },
    ],
    prepStatus: "Not prepared",
  },
  {
    id: "M-4",
    dateStr: "Mon 5 Oct",
    timeStr: "09:00",
    title: "Leadership sync",
    companyId: "all",
    attendees: [
      { name: "Elena Marchetti", email: "elena@marchettiholdings.com", initials: "EM" },
      { name: "Tomas Brandt", email: "tomas@marchettiholdings.com", initials: "TB" },
      { name: "Priya Nair", email: "priya@northgatefreight.com", initials: "PN" },
      { name: "Jonah Whitfield", email: "jonah@ashbyandvale.com", initials: "JW" },
    ],
    prepStatus: "Follow-up drafted",
    followUpEmailDraft: "Leadership Team, Here is the weekly action summary across Northgate, Ashby, and Kestrel...",
  },
];

export const SEED_ACTIVITY: ActivityEvent[] = [
  {
    id: "act-1",
    timeStr: "09:12",
    timestamp: "2026-10-01T09:12:00Z",
    actorType: "agent",
    actorName: "Drafter",
    action: "submitted for approval",
    object: "A-501 (Reply to Harlow & Sons)",
    companyId: "kestrel",
    result: "success",
    payload: {
      agent: "Drafter",
      draftId: "A-501",
      taskId: "T-201",
      risk: "Medium",
      policy: "allow_agent_draft_creation",
    },
  },
  {
    id: "act-2",
    timeStr: "09:10",
    timestamp: "2026-10-01T09:10:00Z",
    actorType: "agent",
    actorName: "Drafter",
    action: "searched Drive",
    object: "'Harlow lease' (Lease_Harlow_2023.pdf)",
    companyId: "kestrel",
    result: "success",
    payload: {
      query: "Harlow lease",
      scope: "drive.file",
      filesFound: 1,
      policy: "least_privilege_drive_read",
    },
  },
  {
    id: "act-3",
    timeStr: "08:58",
    timestamp: "2026-10-01T08:58:00Z",
    actorType: "human",
    actorName: "Tomas Brandt",
    actorRole: "Chief of Staff",
    action: "assigned task to agent",
    object: "T-201 -> Drafter",
    companyId: "kestrel",
    result: "success",
    payload: {
      taskId: "T-201",
      assignedTo: "Drafter",
      instruction: "Draft a renewal email based on the last Harlow thread",
    },
  },
  {
    id: "act-4",
    timeStr: "Wed 18:40",
    timestamp: "2026-09-30T18:40:00Z",
    actorType: "human",
    actorName: "Elena Marchetti",
    actorRole: "Owner",
    action: "approved",
    object: "A-499 (Vendor insurance request)",
    companyId: "kestrel",
    result: "success",
    payload: {
      draftId: "A-499",
      approvedBy: "elena",
      method: "web_ui",
      policy: "owner_approval_gate",
    },
  },
  {
    id: "act-5",
    timeStr: "Wed 18:41",
    timestamp: "2026-09-30T18:41:00Z",
    actorType: "system",
    actorName: "System",
    action: "sent email via Gmail",
    object: "A-499 (compliance@bellmoremaintenance.co.uk)",
    companyId: "kestrel",
    result: "success",
    payload: {
      provider: "gmail.send",
      messageId: "msg_90823487",
      approvedBy: "Elena Marchetti",
      verificationState: "verified",
    },
  },
  {
    id: "act-6",
    timeStr: "Wed 16:05",
    timestamp: "2026-09-30T16:05:00Z",
    actorType: "human",
    actorName: "Priya Nair",
    actorRole: "Finance Lead",
    action: "changed status",
    object: "T-102 -> In progress",
    companyId: "northgate",
    result: "success",
    payload: {
      taskId: "T-102",
      oldStatus: "To do",
      newStatus: "In progress",
    },
  },
  {
    id: "act-7",
    timeStr: "Tue 14:22",
    timestamp: "2026-09-29T14:22:00Z",
    actorType: "human",
    actorName: "Elena Marchetti",
    actorRole: "Owner",
    action: "approved",
    object: "A-498 (Calder reply)",
    companyId: "kestrel",
    result: "success",
    payload: {
      draftId: "A-498",
      approvedBy: "elena",
    },
  },
  {
    id: "act-8",
    timeStr: "Tue 14:23",
    timestamp: "2026-09-29T14:23:00Z",
    actorType: "system",
    actorName: "System",
    action: "sent email via Gmail",
    object: "A-498 (acquisitions@calderholdings.co.uk)",
    companyId: "kestrel",
    result: "success",
    payload: {
      provider: "gmail.send",
      messageId: "msg_78129034",
    },
  },
  {
    id: "act-9",
    timeStr: "Tue 10:07",
    timestamp: "2026-09-29T10:07:00Z",
    actorType: "agent",
    actorName: "Briefer",
    action: "generated daily brief",
    object: "Executive briefing (3 companies)",
    companyId: "all",
    result: "success",
    payload: {
      briefDuration: "2 min 14 sec",
      openTasksAnalyzed: 38,
      decisionsPending: 5,
    },
  },
  {
    id: "act-10",
    timeStr: "Mon 17:31",
    timestamp: "2026-09-28T17:31:00Z",
    actorType: "human",
    actorName: "Elena Marchetti",
    actorRole: "Owner",
    action: "rejected draft",
    object: "A-500 (Ashby newsletter): 'Wrong tone'",
    companyId: "ashby",
    result: "success",
    payload: {
      draftId: "A-500",
      reason: "Wrong tone",
      feedback: "Too informal for luxury hospitality",
    },
  },
  {
    id: "act-11",
    timeStr: "Mon 15:02",
    timestamp: "2026-09-28T15:02:00Z",
    actorType: "human",
    actorName: "Ruth Okafor",
    actorRole: "Contractor",
    action: "viewed restricted task",
    object: "T-901 (Separation terms)",
    companyId: "ashby",
    result: "success",
    payload: {
      taskId: "T-901",
      role: "Contractor",
      policy: "restricted_legal_counsel_grant",
    },
  },
  {
    id: "act-12",
    timeStr: "Mon 09:00",
    timestamp: "2026-09-28T09:00:00Z",
    actorType: "system",
    actorName: "System",
    action: "synced Calendar",
    object: "Google Calendar (42 events)",
    companyId: "all",
    result: "success",
    payload: {
      scope: "calendar.events.readonly",
      syncedEvents: 42,
    },
  },
];

export const SEED_SCOPES: IntegrationScope[] = [
  {
    id: "scope-1",
    service: "gmail",
    scope: "https://www.googleapis.com/auth/gmail.readonly",
    allows: "Read email threads, sender metadata and message attachments for context.",
    whyNeeded: "Provides historical conversation history so agents know past terms and counterparties.",
    agents: ["Drafter", "Briefer"],
    sensitivity: "Restricted",
    granted: true,
  },
  {
    id: "scope-2",
    service: "gmail",
    scope: "https://www.googleapis.com/auth/gmail.send",
    allows: "Send approved emails directly from the executive mailbox.",
    whyNeeded: "Only triggered after explicit Owner approval. Blocked by state-machine guard if unapproved.",
    agents: ["System (post-approval only)"],
    sensitivity: "Restricted",
    granted: true,
  },
  {
    id: "scope-3",
    service: "drive",
    scope: "https://www.googleapis.com/auth/drive.file",
    allows: "Access files specifically selected or opened by the platform.",
    whyNeeded: "Allows agents to extract terms from leases, agreements, and supplier quotes.",
    agents: ["Drafter", "Contract Agent", "Planner"],
    sensitivity: "Sensitive",
    granted: true,
  },
  {
    id: "scope-4",
    service: "calendar",
    scope: "https://www.googleapis.com/auth/calendar.events.readonly",
    allows: "View upcoming meeting agendas, attendee profiles, and schedules.",
    whyNeeded: "Generates tailored meeting prep briefs and context for negotiations.",
    agents: ["Briefer", "Drafter"],
    sensitivity: "Sensitive",
    granted: true,
  },
];
