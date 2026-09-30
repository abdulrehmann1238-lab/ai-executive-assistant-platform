"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/mock/store";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Switch } from "@/components/ui/Input";
import {
  Mail,
  FolderOpen,
  Calendar,
  Video,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Lock,
  ExternalLink,
  ChevronDown,
  Info,
} from "lucide-react";
import clsx from "clsx";

export default function IntegrationsPage() {
  const { scopes, toggleScope, user, dispatchAction } = useStore();
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [googleConnected, setGoogleConnected] = useState(true);

  // Planned verification checklist state
  const [verificationItems, setVerificationItems] = useState([
    { id: "v1", title: "Branded OAuth Consent Screen Configured", checked: true, note: "App logo, support email, homepage URI mapped" },
    { id: "v2", title: "Production Privacy Policy & Terms Hosted", checked: true, note: "Explains non-retention of user email payloads" },
    { id: "v3", title: "Granular Scope Justification Document Prepared", checked: true, note: "Detailed breakdown of why gmail.send requires human gate" },
    { id: "v4", title: "End-to-End Loom Demo Video for CASA Review", checked: false, note: "Walkthrough of approval state machine and revocation" },
    { id: "v5", title: "Third-Party Tier 2 CASA Security Assessment", checked: false, note: "Required for Restricted scopes (gmail.readonly & gmail.send)" },
  ]);

  const handleSimulateOAuthConnect = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setGoogleConnected(true);
      setConnectModalOpen(false);
      dispatchAction(
        user.name,
        "human",
        "authorized Google OAuth",
        "Google Workspace connected (4 scopes)",
        "all",
        "success",
        { provider: "google_oauth_v2" }
      );
    }, 1200);
  };

  return (
    <div className="space-y-8 font-sans animate-in fade-in duration-med">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-line">
        <div>
          <h1 className="font-serif text-[2rem] font-medium text-ink leading-tight">
            Integrations & Least-Privilege Scopes
          </h1>
          <p className="text-[13px] text-ink-3">
            Google Workspace OAuth 2.0 connection, granular permission controls, and CASA verification plan.
          </p>
        </div>

        <Button
          onClick={() => setConnectModalOpen(true)}
          variant="secondary"
          size="md"
          leftIcon={<ShieldCheck className="w-4 h-4 text-primary" />}
        >
          {googleConnected ? "Manage Google Connection" : "Connect Google Workspace"}
        </Button>
      </div>

      {/* Integration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Gmail */}
        <div className="p-5 bg-elevated border border-line rounded-lg shadow-sh-1 flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-full bg-info/10 text-info flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <Badge variant="success" size="sm">Connected</Badge>
            </div>
            <h3 className="font-serif text-[1.15rem] font-medium text-ink">Gmail</h3>
            <p className="text-[12px] text-ink-3">
              Context retrieval and pre-approved executive drafting. Restricted scope.
            </p>
          </div>
          <div className="text-[11px] font-mono text-ink-3 pt-2 border-t border-line">
            Sync: 2 min ago
          </div>
        </div>

        {/* Google Drive */}
        <div className="p-5 bg-elevated border border-line rounded-lg shadow-sh-1 flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-full bg-accent-t text-accent flex items-center justify-center">
                <FolderOpen className="w-5 h-5" />
              </div>
              <Badge variant="success" size="sm">Connected</Badge>
            </div>
            <h3 className="font-serif text-[1.15rem] font-medium text-ink">Google Drive</h3>
            <p className="text-[12px] text-ink-3">
              Access limited strictly to files explicitly chosen by user (<code className="font-mono text-[10px]">drive.file</code>).
            </p>
          </div>
          <div className="text-[11px] font-mono text-ink-3 pt-2 border-t border-line">
            Sync: 5 min ago
          </div>
        </div>

        {/* Google Calendar */}
        <div className="p-5 bg-elevated border border-line rounded-lg shadow-sh-1 flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-full bg-primary-t text-primary flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <Badge variant="success" size="sm">Connected</Badge>
            </div>
            <h3 className="font-serif text-[1.15rem] font-medium text-ink">Google Calendar</h3>
            <p className="text-[12px] text-ink-3">
              Read upcoming agendas and attendee context for executive briefings.
            </p>
          </div>
          <div className="text-[11px] font-mono text-ink-3 pt-2 border-t border-line">
            Sync: 12 min ago
          </div>
        </div>

        {/* Webex (Phase 4) */}
        <div className="p-5 bg-sunken/60 border border-line rounded-lg shadow-sh-1 flex flex-col justify-between space-y-3 opacity-75">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-full bg-sunken text-ink-3 flex items-center justify-center">
                <Video className="w-5 h-5" />
              </div>
              <Badge variant="neutral" size="sm">Phase 4</Badge>
            </div>
            <h3 className="font-serif text-[1.15rem] font-medium text-ink">Cisco Webex</h3>
            <p className="text-[12px] text-ink-3">
              Cloud recording transcript ingest planned for Phase 4 of project rollout.
            </p>
          </div>
          <div className="text-[11px] font-mono text-ink-3 pt-2 border-t border-line flex items-center gap-1">
            <Lock className="w-3 h-3" /> Scheduled for Phase 4
          </div>
        </div>
      </div>

      {/* Scope Table */}
      <section aria-labelledby="scopes-heading" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 id="scopes-heading" className="font-serif text-[1.35rem] font-medium text-ink">
              Configured OAuth Scopes & Sensitivity
            </h2>
            <p className="text-[12px] text-ink-3">
              Revoking a scope degrades agents gracefully without crashing the application.
            </p>
          </div>
        </div>

        <div className="border border-line rounded-lg bg-elevated overflow-hidden shadow-sh-1">
          <div className="divide-y divide-line">
            {scopes.map((scope) => (
              <div
                key={scope.id}
                className={clsx(
                  "p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors",
                  scope.granted ? "hover:bg-sunken/30" : "bg-sunken/40 opacity-70"
                )}
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[12px] font-semibold text-ink">
                      {scope.scope}
                    </span>
                    <Badge
                      variant={scope.sensitivity === "Restricted" ? "error" : "info"}
                      size="sm"
                    >
                      {scope.sensitivity}
                    </Badge>
                  </div>
                  <p className="text-[13px] text-ink-2">{scope.allows}</p>
                  <p className="text-[11px] text-ink-3">
                    <strong>Why needed:</strong> {scope.whyNeeded}
                  </p>
                </div>

                <div className="flex items-center gap-6 shrink-0">
                  <div className="text-right text-[11px] text-ink-3 hidden md:block">
                    <span className="block">Agents:</span>
                    <span className="font-medium text-ink-2">{scope.agents.join(", ")}</span>
                  </div>

                  <Switch
                    checked={scope.granted}
                    onChange={() => toggleScope(scope.id)}
                    label={scope.granted ? "Granted" : "Revoked"}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Google OAuth Verification Planned Checklist (Recommended Enhancement) */}
      <section aria-labelledby="verification-heading" className="space-y-4">
        <div>
          <h2 id="verification-heading" className="font-serif text-[1.35rem] font-medium text-ink">
            Google OAuth Verification: Planned Checklist
          </h2>
          <p className="text-[12px] text-ink-3">
            Clear implementation roadmap for passing Google Cloud Trust & Safety review without delays.
          </p>
        </div>

        <div className="p-5 bg-elevated border border-line rounded-lg shadow-sh-1 space-y-3">
          {verificationItems.map((item) => (
            <label
              key={item.id}
              className="flex items-start gap-3 p-3 bg-surface hover:bg-sunken/40 border border-line rounded-md cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => {
                  setVerificationItems((prev) =>
                    prev.map((i) => (i.id === item.id ? { ...i, checked: !i.checked } : i))
                  );
                }}
                className="mt-0.5 rounded-xs text-primary focus:ring-primary w-4 h-4 cursor-pointer"
              />
              <div className="text-[13px]">
                <div className="font-medium text-ink flex items-center gap-2">
                  <span>{item.title}</span>
                  {item.checked && (
                    <span className="text-[10px] font-mono text-success font-semibold uppercase">
                      Ready
                    </span>
                  )}
                </div>
                <div className="text-[12px] text-ink-3 mt-0.5">{item.note}</div>
              </div>
            </label>
          ))}
        </div>
      </section>

      {/* Faux Google Consent Screen Modal */}
      <Modal
        isOpen={connectModalOpen}
        onClose={() => setConnectModalOpen(false)}
        title="Google Cloud Platform OAuth 2.0"
        maxWidth="lg"
      >
        <div className="space-y-5 text-[13px] font-sans">
          <div className="flex items-center gap-3 p-3 bg-surface border border-line rounded-md">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-serif font-bold">
              H
            </div>
            <div>
              <div className="font-medium text-ink">Halden Executive Assistant</div>
              <div className="text-[11px] text-ink-3">halden-production.app wants to access your Google Account</div>
            </div>
          </div>

          <div className="space-y-3 border-y border-line py-3">
            <div className="text-[12px] font-semibold uppercase tracking-wider text-ink-3">
              Requested Permissions:
            </div>
            <div className="space-y-2 text-[13px] text-ink-2">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
                <span>Read your email messages and metadata for thread synthesis</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
                <span>Send emails on your behalf <strong>(Strictly approval gated)</strong></span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
                <span>See and create Google Drive documents explicitly opened by the app</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
                <span>View upcoming Google Calendar appointments for daily briefs</span>
              </div>
            </div>
          </div>

          <p className="text-[12px] text-ink-3 leading-relaxed">
            By clicking Allow, you authorize Halden to interact with your data in accordance with the security policy.
          </p>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setConnectModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              isLoading={isConnecting}
              onClick={handleSimulateOAuthConnect}
            >
              Allow & Authorize Scopes
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
