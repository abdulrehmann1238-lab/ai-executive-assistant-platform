"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/mock/store";
import { Role } from "@/lib/mock/policy";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { BRAND } from "@/config/brand";
import {
  Shield,
  ArrowRight,
  CheckCircle,
  Lock,
  Building,
  UserCheck,
  FileCheck,
} from "lucide-react";
import clsx from "clsx";

export default function DemoRolePickerPage() {
  const router = useRouter();
  const { role, setRole } = useStore();
  const [selectedRole, setSelectedRole] = useState<Role>("Owner");

  const rolesConfig: {
    id: Role;
    name: string;
    personName: string;
    description: string;
    visibility: string;
    sendPower: string;
  }[] = [
    {
      id: "Owner",
      name: "Owner / Founder",
      personName: "Elena Marchetti",
      description: "Founder running 3 distinct holdings. The ultimate decision-maker.",
      visibility: "Full row-level visibility across Northgate, Ashby & Vale, and Kestrel including restricted legal files.",
      sendPower: "Full approval authority. All external communications require Owner signature.",
    },
    {
      id: "Chief of Staff",
      name: "Chief of Staff",
      personName: "Tomas Brandt",
      description: "Executive operator orchestrating cross-holding initiatives.",
      visibility: "Broad view across all 3 companies. Sensitive M&A and HR items redacted unless explicitly delegated.",
      sendPower: "Can review and request changes on drafts. Blocked from final send execution.",
    },
    {
      id: "Finance lead",
      name: "Finance Lead",
      personName: "Priya Nair",
      description: "Manages capital expenditures and fleet leasing.",
      visibility: "Scoped strictly to Northgate Freight and Kestrel Property Group. Ashby & Vale records return zero rows.",
      sendPower: "Can submit capital requests. Blocked from final dispatch.",
    },
    {
      id: "Contractor",
      name: "Legal Counsel / Contractor",
      personName: "Ruth Okafor",
      description: "External legal counsel managing high-risk covenants.",
      visibility: "Strict tenant isolation: limited only to explicitly assigned contracts (e.g. separation agreement T-901).",
      sendPower: "Draft review only.",
    },
  ];

  const handleEnterDemo = () => {
    setRole(selectedRole);
    router.push("/app");
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col justify-between p-6 sm:p-12 font-sans">
      <div className="max-w-4xl mx-auto w-full my-auto space-y-8 animate-in fade-in duration-med">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-accent rounded-xs" />
            <span className="font-serif text-[26px] font-medium text-ink tracking-tight">
              {BRAND.name}
            </span>
          </div>
          <h1 className="font-serif text-[2.5rem] font-normal text-ink leading-tight">
            Choose who you are today
          </h1>
          <p className="text-[15px] text-ink-3 max-w-lg mx-auto leading-relaxed">
            Select a simulated role to experience how Row-Level Security, tenant boundaries, and approval gates dynamically adapt in real-time.
          </p>
        </div>

        {/* Role Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rolesConfig.map((r) => {
            const isSelected = selectedRole === r.id;

            return (
              <div
                key={r.id}
                onClick={() => setSelectedRole(r.id)}
                className={clsx(
                  "p-6 rounded-lg border cursor-pointer transition-all duration-med flex flex-col justify-between space-y-4",
                  isSelected
                    ? "bg-elevated border-primary shadow-sh-2 ring-1 ring-primary"
                    : "bg-surface hover:bg-surface/80 border-line"
                )}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-serif text-[1.25rem] font-medium text-ink">{r.name}</h3>
                      <span className="text-[12px] font-mono text-ink-3">{r.personName}</span>
                    </div>
                    {isSelected ? (
                      <span className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-[10px]">
                        ✓
                      </span>
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-line-2" />
                    )}
                  </div>

                  <p className="text-[13px] text-ink-2 leading-relaxed">{r.description}</p>

                  <div className="pt-2 border-t border-line space-y-1.5 text-[12px]">
                    <div>
                      <strong className="text-ink">Visibility:</strong>{" "}
                      <span className="text-ink-3">{r.visibility}</span>
                    </div>
                    <div>
                      <strong className="text-ink">Send Power:</strong>{" "}
                      <span className="text-ink-3">{r.sendPower}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="flex flex-col items-center gap-3 pt-4">
          <Button
            onClick={handleEnterDemo}
            variant="primary"
            size="lg"
            className="w-full sm:w-72"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Enter Live Demo as {selectedRole}
          </Button>

          <p className="text-[11px] text-ink-3">
            Interactive prototype. Data is simulated. No actual emails or network calls will occur.
          </p>
        </div>
      </div>

      <footer className="text-center text-[11px] text-ink-3 pt-8">
        Built for client proposal · Halden Trust Architecture
      </footer>
    </div>
  );
}
