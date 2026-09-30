"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/mock/store";
import { canSeeApproval } from "@/lib/mock/policy";
import { BRAND } from "@/config/brand";
import { CompanySwitcher } from "./CompanySwitcher";
import { UserMenu } from "./UserMenu";
import {
  Home,
  CheckSquare,
  CheckCircle,
  Bot,
  Calendar,
  Users,
  Activity,
  Boxes,
  Shield,
  Settings,
  Sparkles,
} from "lucide-react";
import clsx from "clsx";

export function Sidebar() {
  const pathname = usePathname();
  const { approvals, role } = useStore();

  const pendingApprovalsCount = approvals.filter(
    (a) => a.status === "Pending" && canSeeApproval(role, a)
  ).length;

  const mainNav = [
    { label: "Home", href: "/app", icon: Home },
    { label: "Tasks", href: "/app/tasks", icon: CheckSquare },
    {
      label: "Approvals",
      href: "/app/approvals",
      icon: CheckCircle,
      badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined,
    },
    { label: "Agents", href: "/app/agents", icon: Bot },
    { label: "Meetings", href: "/app/meetings", icon: Calendar },
    { label: "People", href: "/app/people", icon: Users },
    { label: "Activity", href: "/app/activity", icon: Activity },
  ];

  const adminNav = [
    { label: "Integrations", href: "/app/integrations", icon: Boxes },
    { label: "Access & RLS", href: "/app/access", icon: Shield },
    { label: "Settings", href: "/app/settings", icon: Settings },
  ];

  return (
    <aside
      aria-label="Application Navigation"
      className="hidden md:flex flex-col w-64 lg:w-[248px] bg-surface border-r border-line h-screen sticky top-0 shrink-0 font-sans"
    >
      {/* Brand Header */}
      <div className="p-4 border-b border-line flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-2.5 h-2.5 bg-accent rounded-xs transition-transform group-hover:scale-110" />
          <span className="font-serif text-[22px] font-medium text-ink tracking-tight">
            {BRAND.name}
          </span>
        </Link>
        <span className="font-mono text-[10px] text-ink-3 uppercase px-1.5 py-0.5 rounded-xs bg-sunken">
          Demo
        </span>
      </div>

      {/* Company Switcher */}
      <div className="p-3 border-b border-line">
        <CompanySwitcher />
      </div>

      {/* Main Nav Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        {mainNav.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/app" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "relative flex items-center justify-between h-10 px-3 rounded-sm text-[13px] font-medium transition-colors",
                isActive
                  ? "bg-primary-t text-primary font-semibold"
                  : "text-ink-2 hover:bg-secondary hover:text-ink"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-primary rounded-r-xs" />
              )}
              <div className="flex items-center gap-3">
                <Icon className={clsx("w-4 h-4 shrink-0", isActive ? "text-primary" : "text-ink-3")} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-mono font-semibold rounded-full bg-accent text-white shadow-sh-1">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        <div className="my-3 border-t border-line" />

        <div className="px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-ink-3">
          Governance & Trust
        </div>

        {adminNav.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "relative flex items-center gap-3 h-9 px-3 rounded-sm text-[13px] font-medium transition-colors",
                isActive
                  ? "bg-primary-t text-primary font-semibold"
                  : "text-ink-2 hover:bg-secondary hover:text-ink"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-primary rounded-r-xs" />
              )}
              <Icon className={clsx("w-4 h-4 shrink-0", isActive ? "text-primary" : "text-ink-3")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="p-3 border-t border-line bg-surface">
        <UserMenu />
      </div>
    </aside>
  );
}
