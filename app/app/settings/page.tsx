"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/mock/store";
import { Button } from "@/components/ui/Button";
import { Switch, Input } from "@/components/ui/Input";
import { Avatar } from "@/components/ui/Badge";
import {
  Settings,
  Bell,
  Volume2,
  AlertTriangle,
  RotateCcw,
  Check,
  ShieldAlert,
} from "lucide-react";

export default function SettingsPage() {
  const { user, settings, updateSettings, resetDemo } = useStore();
  const [profileName, setProfileName] = useState(user.name);
  const [profileEmail, setProfileEmail] = useState(user.email);
  const [savedTick, setSavedTick] = useState(false);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedTick(true);
    setTimeout(() => setSavedTick(false), 2000);
  };

  return (
    <div className="max-w-3xl space-y-8 font-sans animate-in fade-in duration-med pb-12">
      {/* Header */}
      <div className="pb-4 border-b border-line">
        <h1 className="font-serif text-[2rem] font-medium text-ink leading-tight">Settings & Controls</h1>
        <p className="text-[13px] text-ink-3">
          Configure executive preferences, voice synthesis parameters, and demo failure scenarios.
        </p>
      </div>

      {/* Profile Section */}
      <section className="p-6 bg-elevated border border-line rounded-lg shadow-sh-1 space-y-5">
        <div className="flex items-center gap-3 pb-3 border-b border-line">
          <Avatar initials={user.initials} bg={user.avatarBg} fg={user.avatarFg} size="lg" />
          <div>
            <h3 className="font-serif text-[1.25rem] font-medium text-ink">{user.name}</h3>
            <p className="text-[12px] text-ink-3">{user.role} · {user.accessRole}</p>
          </div>
        </div>

        <form onSubmit={handleProfileSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-medium text-ink-3 mb-1">Display Name</label>
              <Input value={profileName} onChange={(e) => setProfileName(e.target.value)} />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-ink-3 mb-1">Primary Email</label>
              <Input value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)} />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[12px] text-ink-3">
              {savedTick && (
                <span className="text-success font-medium flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Saved
                </span>
              )}
            </span>
            <Button type="submit" variant="primary" size="sm">
              Save Profile
            </Button>
          </div>
        </form>
      </section>

      {/* Demo Error Injection Toggles (Crucial proof of resilience) */}
      <section className="p-6 bg-elevated border border-line rounded-lg shadow-sh-1 space-y-4">
        <div className="flex items-center gap-2 text-warning">
          <AlertTriangle className="w-5 h-5" />
          <h3 className="font-serif text-[1.25rem] font-medium text-ink">
            Simulation & Failure Mode Injections
          </h3>
        </div>
        <p className="text-[13px] text-ink-3 leading-relaxed">
          Test how the platform handles unexpected backend failures gracefully without losing user data or corrupting state.
        </p>

        <div className="space-y-4 pt-2">
          <div className="p-3.5 bg-surface border border-line rounded-md flex items-center justify-between">
            <div>
              <span className="text-[13px] font-medium text-ink block">Simulate Gmail API Failure</span>
              <span className="text-[12px] text-ink-3">
                Sending an approved email fails at 10s. Item returns to Approved with Retry button.
              </span>
            </div>
            <Switch
              checked={settings.simulateGmailFailure}
              onChange={(val) => updateSettings({ simulateGmailFailure: val })}
            />
          </div>

          <div className="p-3.5 bg-surface border border-line rounded-md flex items-center justify-between">
            <div>
              <span className="text-[13px] font-medium text-ink block">Simulate Slow Network (4x Latency)</span>
              <span className="text-[12px] text-ink-3">
                Throttles API responses to verify skeleton states and optimistic UI rollbacks.
              </span>
            </div>
            <Switch
              checked={settings.slowNetwork}
              onChange={(val) => updateSettings({ slowNetwork: val })}
            />
          </div>

          <div className="p-3.5 bg-surface border border-line rounded-md flex items-center justify-between">
            <div>
              <span className="text-[13px] font-medium text-ink block">Simulate Agent Permission Failure</span>
              <span className="text-[12px] text-ink-3">
                Causes agent run step 3 to fail with Drive permission error.
              </span>
            </div>
            <Switch
              checked={settings.simulateAgentFailure}
              onChange={(val) => updateSettings({ simulateAgentFailure: val })}
            />
          </div>
        </div>
      </section>

      {/* Voice Preferences */}
      <section className="p-6 bg-elevated border border-line rounded-lg shadow-sh-1 space-y-4">
        <div className="flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-accent" />
          <h3 className="font-serif text-[1.25rem] font-medium text-ink">Voice Brief Parameters</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[12px] font-medium text-ink-3 mb-1">
              Playback Speed Multiplier ({settings.voiceRate}x)
            </label>
            <input
              type="range"
              min="0.75"
              max="1.5"
              step="0.25"
              value={settings.voiceRate}
              onChange={(e) => updateSettings({ voiceRate: parseFloat(e.target.value) })}
              className="w-full accent-primary"
            />
          </div>
        </div>
      </section>

      {/* Reset Demo State */}
      <section className="p-6 bg-[#F6E1DD]/40 border border-[#ECC6C0] rounded-lg space-y-3">
        <h3 className="font-serif text-[1.25rem] font-medium text-error">Reset Demo Data</h3>
        <p className="text-[13px] text-ink-2">
          Clear all session approvals, tasks, and state mutations, restoring original Oct 1 2026 seed state.
        </p>
        <Button
          onClick={() => {
            if (confirm("Reset demo? All changes will be cleared.")) {
              resetDemo();
            }
          }}
          variant="danger"
          size="sm"
          leftIcon={<RotateCcw className="w-4 h-4" />}
        >
          Reset Demo State
        </Button>
      </section>
    </div>
  );
}
