"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/mock/store";
import { Role, getSimulatedRLS } from "@/lib/mock/policy";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import {
  Shield,
  Lock,
  Check,
  X,
  Eye,
  FileEdit,
  CheckCircle,
  Copy,
  Info,
} from "lucide-react";
import clsx from "clsx";

export default function AccessPage() {
  const { role, setRole, tasks, approvals } = useStore();
  const [selectedRoleMatrix, setSelectedRoleMatrix] = useState<Role>(role);
  const [activeTab, setActiveTab] = useState<"matrix" | "restricted" | "sql">("matrix");

  const matrixRows = [
    { module: "Executive Home & Needs You Queue", owner: "Approve", cos: "Review", fin: "Review", con: "None" },
    { module: "Approvals (Send Gate)", owner: "Approve & Send", cos: "Draft only", fin: "Draft only", con: "None" },
    { module: "Tasks (Multi-Company)", owner: "All Holdings", cos: "All Holdings", fin: "Northgate & Kestrel", con: "Assigned only" },
    { module: "Restricted Items (Separations / M&A)", owner: "Full Access", cos: "Delegated only", fin: "Redacted", con: "Assigned legal" },
    { module: "Agent Roster & Runs", owner: "Manage & Run", cos: "Run agents", fin: "Run agents", con: "View assigned" },
    { module: "Google OAuth Scopes", owner: "Full Admin", cos: "View status", fin: "View status", con: "None" },
    { module: "Audit Log (Immutable)", owner: "Full Access", cos: "Full Access", fin: "Tenant scoped", con: "Assigned rows" },
  ];

  const restrictedItems = [
    {
      id: "T-901",
      type: "Task",
      title: "Separation terms for regional manager (restricted)",
      company: "Ashby & Vale",
      visibleTo: ["Owner", "Contractor (Ruth Okafor)"],
      description: "Strictly confidential severance and non-disclosure terms for departing senior manager.",
    },
    {
      id: "T-902",
      type: "Task",
      title: "Inbound inquiry: Calder Self-Storage portfolio (restricted)",
      company: "Kestrel Property Group",
      visibleTo: ["Owner", "Chief of Staff"],
      description: "Confidential acquisition feeler for prime commercial assets in Leeds.",
    },
    {
      id: "A-505",
      type: "Approval",
      title: "Separation terms draft (restricted)",
      company: "Ashby & Vale",
      visibleTo: ["Owner", "Contractor (Ruth Okafor)"],
      description: "Drafted agreement with restrictive covenants and statutory settlement.",
    },
  ];

  return (
    <div className="space-y-8 font-sans animate-in fade-in duration-med">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-line">
        <div>
          <h1 className="font-serif text-[2rem] font-medium text-ink leading-tight">
            Roles & Row-Level Security
          </h1>
          <p className="text-[13px] text-ink-3">
            Multi-tenant PostgreSQL RLS boundaries, permission matrix, and confidential item isolation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[12px] text-ink-3">Current Active View:</span>
          <Badge variant="accent" size="md">
            {role}
          </Badge>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-line gap-4 text-[13px] font-medium">
        <button
          onClick={() => setActiveTab("matrix")}
          className={clsx(
            "pb-2 border-b-2 transition-colors",
            activeTab === "matrix"
              ? "border-primary text-primary font-semibold"
              : "border-transparent text-ink-3 hover:text-ink"
          )}
        >
          Permission & Capability Matrix
        </button>
        <button
          onClick={() => setActiveTab("restricted")}
          className={clsx(
            "pb-2 border-b-2 transition-colors",
            activeTab === "restricted"
              ? "border-primary text-primary font-semibold"
              : "border-transparent text-ink-3 hover:text-ink"
          )}
        >
          Confidential / Restricted Items ({restrictedItems.length})
        </button>
        <button
          onClick={() => setActiveTab("sql")}
          className={clsx(
            "pb-2 border-b-2 transition-colors",
            activeTab === "sql"
              ? "border-primary text-primary font-semibold"
              : "border-transparent text-ink-3 hover:text-ink"
          )}
        >
          Postgres RLS Policy SQL
        </button>
      </div>

      {/* Matrix Tab */}
      {activeTab === "matrix" && (
        <div className="space-y-4">
          <div className="border border-line rounded-lg bg-elevated overflow-hidden shadow-sh-1 overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-surface border-b border-line text-[11px] uppercase tracking-wider text-ink-3 font-semibold">
                <tr>
                  <th className="p-4">Platform Module</th>
                  <th className="p-4">Owner (Elena)</th>
                  <th className="p-4">Chief of Staff (Tomas)</th>
                  <th className="p-4">Finance Lead (Priya)</th>
                  <th className="p-4">Contractor (Ruth / Iris)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {matrixRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-sunken/40 transition-colors">
                    <td className="p-4 font-medium text-ink">{row.module}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-xs bg-[#E2EFE7] text-success font-medium text-[12px]">
                        {row.owner}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-xs bg-sunken text-ink-2 font-medium text-[12px]">
                        {row.cos}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-xs bg-sunken text-ink-2 font-medium text-[12px]">
                        {row.fin}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-xs bg-[#F6E1DD] text-error font-medium text-[12px]">
                        {row.con}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-[12px] text-ink-3">
            * Switch role at any time via the User Menu in the sidebar or "Under the Hood" inspector to see rows redact live.
          </p>
        </div>
      )}

      {/* Restricted Items Tab */}
      {activeTab === "restricted" && (
        <div className="space-y-4">
          <div className="space-y-3">
            {restrictedItems.map((item) => (
              <div
                key={item.id}
                className="p-5 bg-elevated border border-line rounded-lg shadow-sh-1 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Lock className="w-4 h-4 text-accent" />
                    <span className="font-mono text-[11px] text-ink-3">{item.id}</span>
                    <Badge variant="warning" size="sm">{item.type}</Badge>
                    <span className="font-medium text-ink text-[14px]">{item.title}</span>
                  </div>
                  <span className="text-[12px] text-ink-3 capitalize">{item.company}</span>
                </div>

                <p className="text-[13px] text-ink-2 leading-relaxed bg-surface p-3 rounded-md border border-line">
                  {item.description}
                </p>

                <div className="flex items-center justify-between text-[12px] pt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-ink-3">Visible Only To:</span>
                    {item.visibleTo.map((v, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-xs bg-accent-t text-accent font-medium text-[11px]"
                      >
                        {v}
                      </span>
                    ))}
                  </div>

                  <span className="text-ink-3 text-[11px] font-mono">
                    Owner override locked (cannot be removed)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SQL Tab */}
      {activeTab === "sql" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium uppercase tracking-wider text-ink-3">
              Production Row-Level Security Definition (PostgreSQL 15+)
            </span>
            <span className="text-[11px] font-mono text-primary font-semibold">Active: {role}</span>
          </div>

          <pre className="p-5 bg-elevated border border-line rounded-lg font-mono text-[12px] text-ink leading-relaxed overflow-x-auto shadow-sh-1">
            {getSimulatedRLS(role, "tasks")}
          </pre>

          <div className="p-4 bg-surface border border-line rounded-md text-[13px] text-ink-2 space-y-1.5">
            <div className="font-semibold text-ink flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              Tenant Boundary Guarantee
            </div>
            <p className="text-ink-3 text-[12px] leading-relaxed">
              Every database query uses Supabase RLS policies parameterized with the user's validated JWT claims. A compromised frontend query can never leak rows across tenants.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
