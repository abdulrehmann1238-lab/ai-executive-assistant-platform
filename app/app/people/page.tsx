"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/mock/store";
import { Person } from "@/lib/mock/db";
import { Avatar, Badge } from "@/components/ui/Badge";
import { Drawer } from "@/components/ui/Drawer";
import { Input } from "@/components/ui/Input";
import { Search, Mail, Shield, CheckSquare } from "lucide-react";
import clsx from "clsx";

export default function PeoplePage() {
  const { people, companies, selectedCompany, tasks } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const filteredPeople = people.filter((p) => {
    if (selectedCompany !== "all" && p.companyId !== "all" && p.companyId !== selectedCompany) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!p.name.toLowerCase().includes(q) && !p.role.toLowerCase().includes(q) && !p.email.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  const personTasks = selectedPerson
    ? tasks.filter((t) => t.ownerName === selectedPerson.name || t.ownerId === selectedPerson.id)
    : [];

  return (
    <div className="space-y-8 font-sans animate-in fade-in duration-med">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-line">
        <div>
          <h1 className="font-serif text-[2rem] font-medium text-ink leading-tight">
            People & Access Directory
          </h1>
          <p className="text-[13px] text-ink-3">
            Key personnel, executive officers, and external legal/marketing contractors across holdings.
          </p>
        </div>

        <div className="w-full sm:w-72">
          <Input
            placeholder="Search by name, role, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
      </div>

      <div className="border border-line rounded-lg bg-elevated overflow-hidden shadow-sh-1">
        <div className="p-3.5 bg-surface border-b border-line text-[12px] font-medium text-ink-3 flex items-center justify-between">
          <span>Directory ({filteredPeople.length} members)</span>
          <span className="text-[11px] font-mono">Role-Based Access Attached</span>
        </div>

        <div className="divide-y divide-line">
          {filteredPeople.map((person) => {
            const companyObj = companies.find((c) => c.id === person.companyId);

            return (
              <div
                key={person.id}
                onClick={() => setSelectedPerson(person)}
                className="p-4 flex items-center justify-between gap-4 hover:bg-sunken/40 cursor-pointer transition-colors text-[13px]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar
                    initials={person.initials}
                    bg={person.avatarBg}
                    fg={person.avatarFg}
                    size="md"
                  />
                  <div className="min-w-0">
                    <div className="font-medium text-ink truncate flex items-center gap-2">
                      <span>{person.name}</span>
                      <span className="text-[12px] text-ink-3 font-normal">({person.role})</span>
                    </div>
                    <div className="text-[12px] text-ink-3 font-mono mt-0.5">{person.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-[12px] text-ink-3 hidden sm:inline">
                    {companyObj ? companyObj.name : "All holdings"}
                  </span>

                  <Badge
                    variant={
                      person.accessRole === "Owner"
                        ? "accent"
                        : person.accessRole === "Contractor"
                        ? "warning"
                        : "neutral"
                    }
                    size="sm"
                  >
                    {person.accessRole}
                  </Badge>

                  <span className="font-mono text-[11px] text-ink-3 bg-sunken px-2 py-0.5 rounded-full">
                    {person.openTasksCount} tasks
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Person Detail Drawer */}
      <Drawer
        isOpen={Boolean(selectedPerson)}
        onClose={() => setSelectedPerson(null)}
        title={selectedPerson?.name}
        subtitle={`${selectedPerson?.role} · ${selectedPerson?.accessRole}`}
      >
        {selectedPerson && (
          <div className="space-y-6 text-[13px]">
            <div className="p-4 bg-surface border border-line rounded-md space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-ink-3 text-[11px]">Primary Email</span>
                <span className="font-mono text-ink text-[12px]">{selectedPerson.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink-3 text-[11px]">Assigned Scope</span>
                <span className="text-ink font-medium capitalize">{selectedPerson.companyId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink-3 text-[11px]">Security Tier</span>
                <Badge variant="accent" size="sm">{selectedPerson.accessRole}</Badge>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-ink text-[12px] uppercase tracking-wider text-ink-3">
                Assigned Open Tasks ({personTasks.length})
              </h4>
              <div className="space-y-2">
                {personTasks.map((t) => (
                  <div
                    key={t.id}
                    className="p-3 bg-surface border border-line rounded-sm space-y-1"
                  >
                    <div className="flex items-center justify-between text-[11px] text-ink-3">
                      <span className="font-mono">{t.id}</span>
                      <span>{t.dueLabel}</span>
                    </div>
                    <div className="font-medium text-ink">{t.title}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
