"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/mock/store";
import { canSeeApproval } from "@/lib/mock/policy";
import { Home, CheckSquare, CheckCircle, Bot, Menu, X, Calendar, Users, Activity, Boxes, Shield, Settings } from "lucide-react";
import clsx from "clsx";
import { UserMenu } from "./UserMenu";
import { CompanySwitcher } from "./CompanySwitcher";

export function BottomTabs() {
  const pathname = usePathname();
  const { approvals, role } = useStore();
  const [moreOpen, setMoreOpen] = useState(false);

  const pendingApprovalsCount = approvals.filter(
    (a) => a.status === "Pending" && canSeeApproval(role, a)
  ).length;

  const tabs = [
    { label: "Home", href: "/app", icon: Home },
    { label: "Tasks", href: "/app/tasks", icon: CheckSquare },
    {
      label: "Approvals",
      href: "/app/approvals",
      icon: CheckCircle,
      badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined,
    },
    { label: "Agents", href: "/app/agents", icon: Bot },
  ];

  return (
    <>
      {/* Bottom Floating/Docked Nav for Mobile */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-surface border-t border-line flex items-center justify-around px-2 z-sticky pb-[env(safe-area-inset-bottom)] shadow-sh-2"
      >
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || (tab.href !== "/app" && pathname.startsWith(tab.href));
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={clsx(
                "relative flex flex-col items-center justify-center flex-1 h-full py-1 text-[10px] font-medium transition-colors",
                isActive ? "text-primary font-semibold" : "text-ink-3 hover:text-ink"
              )}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {tab.badge !== undefined && (
                  <span className="absolute -top-1 -right-2 flex items-center justify-center w-4 h-4 text-[9px] font-mono font-bold rounded-full bg-accent text-white">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="mt-0.5">{tab.label}</span>
            </Link>
          );
        })}

        {/* More Button */}
        <button
          onClick={() => setMoreOpen(true)}
          className={clsx(
            "flex flex-col items-center justify-center flex-1 h-full py-1 text-[10px] font-medium transition-colors",
            moreOpen ? "text-primary font-semibold" : "text-ink-3 hover:text-ink"
          )}
        >
          <Menu className="w-5 h-5" />
          <span className="mt-0.5">More</span>
        </button>
      </nav>

      {/* More Bottom Sheet */}
      {moreOpen && (
        <div className="md:hidden fixed inset-0 z-modal flex flex-col justify-end">
          <div onClick={() => setMoreOpen(false)} className="fixed inset-0 bg-[#1F2421]/40" />
          <div className="relative bg-elevated border-t border-line rounded-t-lg p-4 shadow-sh-3 z-modal space-y-4 max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between border-b border-line pb-2">
              <span className="font-serif text-[16px] font-medium text-ink">More Navigation</span>
              <button
                onClick={() => setMoreOpen(false)}
                className="p-1 rounded-sm text-ink-3 hover:text-ink"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              <CompanySwitcher />
            </div>

            <div className="grid grid-cols-2 gap-2 text-[13px]">
              <Link
                href="/app/meetings"
                onClick={() => setMoreOpen(false)}
                className="p-3 bg-surface border border-line rounded-sm flex items-center gap-2 text-ink font-medium"
              >
                <Calendar className="w-4 h-4 text-ink-3" />
                <span>Meetings</span>
              </Link>
              <Link
                href="/app/people"
                onClick={() => setMoreOpen(false)}
                className="p-3 bg-surface border border-line rounded-sm flex items-center gap-2 text-ink font-medium"
              >
                <Users className="w-4 h-4 text-ink-3" />
                <span>People</span>
              </Link>
              <Link
                href="/app/activity"
                onClick={() => setMoreOpen(false)}
                className="p-3 bg-surface border border-line rounded-sm flex items-center gap-2 text-ink font-medium"
              >
                <Activity className="w-4 h-4 text-ink-3" />
                <span>Activity Log</span>
              </Link>
              <Link
                href="/app/integrations"
                onClick={() => setMoreOpen(false)}
                className="p-3 bg-surface border border-line rounded-sm flex items-center gap-2 text-ink font-medium"
              >
                <Boxes className="w-4 h-4 text-ink-3" />
                <span>Integrations</span>
              </Link>
              <Link
                href="/app/access"
                onClick={() => setMoreOpen(false)}
                className="p-3 bg-surface border border-line rounded-sm flex items-center gap-2 text-ink font-medium"
              >
                <Shield className="w-4 h-4 text-ink-3" />
                <span>Access & RLS</span>
              </Link>
              <Link
                href="/app/settings"
                onClick={() => setMoreOpen(false)}
                className="p-3 bg-surface border border-line rounded-sm flex items-center gap-2 text-ink font-medium"
              >
                <Settings className="w-4 h-4 text-ink-3" />
                <span>Settings</span>
              </Link>
            </div>

            <div className="pt-2 border-t border-line">
              <UserMenu />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
