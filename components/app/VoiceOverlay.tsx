"use client";

import React, { useState, useEffect, useRef } from "react";
import { useStore } from "@/lib/mock/store";
import {
  Mic,
  MicOff,
  Volume2,
  X,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  CheckCircle,
  FileEdit,
  ArrowRight,
} from "lucide-react";
import clsx from "clsx";
import { Button } from "../ui/Button";

export function VoiceOverlay() {
  const { voice, closeVoice, setVoiceListening, approveItem, setCompany, dispatchAction } = useStore();

  const [activeTab, setActiveTab] = useState<"brief" | "command" | "fill">(voice.mode || "brief");
  const [isPlayingBrief, setIsPlayingBrief] = useState(false);
  const [briefSentenceIdx, setBriefSentenceIdx] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [commandFeedback, setCommandFeedback] = useState<string | null>(null);

  // Voice fill state
  const [fillState, setFillState] = useState({
    counterparty: "BlueRidge Linens Ltd",
    term: "24 months",
    liabilityCap: "£184,000",
    isFilled: false,
  });

  const sentences = [
    "Good morning, Elena.",
    "Five things need you across your companies.",
    "The most time-sensitive is the Harlow lease renewal email; the renewal call is at eleven.",
    "The forklift lease decision for Northgate closes tomorrow.",
    "Six tasks are currently overdue, three of them at Ashby and Vale.",
    "Nothing has been sent without your explicit approval since Tuesday.",
  ];

  // Brief timer simulation
  useEffect(() => {
    let timer: any;
    if (isPlayingBrief) {
      timer = setInterval(() => {
        setBriefSentenceIdx((prev) => {
          if (prev >= sentences.length - 1) {
            setIsPlayingBrief(false);
            return 0;
          }
          return prev + 1;
        });
      }, 3000 / playbackSpeed);
    }
    return () => clearInterval(timer);
  }, [isPlayingBrief, playbackSpeed, sentences.length]);

  // Speech synthesis if available
  const toggleSpeechBrief = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      if (isPlayingBrief) {
        window.speechSynthesis.cancel();
        setIsPlayingBrief(false);
      } else {
        const fullText = sentences.join(" ");
        const utterance = new SpeechSynthesisUtterance(fullText);
        utterance.rate = playbackSpeed;
        utterance.onend = () => setIsPlayingBrief(false);
        window.speechSynthesis.speak(utterance);
        setIsPlayingBrief(true);
      }
    } else {
      setIsPlayingBrief(!isPlayingBrief);
    }
  };

  const handleCommandChip = async (chipText: string) => {
    setVoiceListening(true);
    setCommandFeedback(`Executing voice command: "${chipText}"...`);

    setTimeout(async () => {
      setVoiceListening(false);
      if (chipText.includes("Harlow lease email")) {
        await approveItem("A-501");
        dispatchAction(
          "Elena Marchetti (voice)",
          "human",
          "voice command executed",
          "Approved A-501 via Voice",
          "kestrel",
          "success",
          { input: chipText, channel: "voice" }
        );
        setCommandFeedback("Approved Harlow lease email! 10-second recall timer started.");
      } else if (chipText.includes("Northgate")) {
        setCompany("northgate");
        dispatchAction(
          "Elena Marchetti (voice)",
          "human",
          "voice command filtered",
          "Company set to Northgate Freight",
          "northgate",
          "success",
          { input: chipText }
        );
        setCommandFeedback("Filtered tasks to Northgate Freight.");
      } else if (chipText.includes("staffing plan")) {
        dispatchAction(
          "Elena Marchetti (voice)",
          "human",
          "voice assigned agent",
          "Planner assigned to Ashby Q4 Staffing",
          "ashby",
          "success",
          { input: chipText }
        );
        setCommandFeedback("Assigned Ashby staffing plan to Planner agent.");
      }
    }, 900);
  };

  if (!voice.isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-modal flex items-end sm:items-center justify-center p-0 sm:p-4"
    >
      <div onClick={closeVoice} className="fixed inset-0 bg-[#1F2421]/45 transition-opacity" />

      <div className="relative w-full max-w-xl bg-elevated border border-line sm:rounded-lg shadow-sh-3 z-modal flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 font-sans">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-line bg-surface">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-accent-t flex items-center justify-center text-accent">
              <Volume2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-[17px] font-medium text-ink">Voice Command & Brief</h2>
              <p className="text-[12px] text-ink-3">Calm audio executive assistant</p>
            </div>
          </div>
          <button
            onClick={closeVoice}
            className="p-1 rounded-sm text-ink-3 hover:text-ink hover:bg-sunken"
            aria-label="Close voice modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Tabs */}
        <div className="flex border-b border-line bg-sunken/40 px-6 pt-2 gap-4 text-[13px] font-medium">
          <button
            onClick={() => setActiveTab("brief")}
            className={clsx(
              "pb-2.5 border-b-2 transition-colors",
              activeTab === "brief"
                ? "border-primary text-primary font-semibold"
                : "border-transparent text-ink-3 hover:text-ink"
            )}
          >
            Today's Brief
          </button>
          <button
            onClick={() => setActiveTab("command")}
            className={clsx(
              "pb-2.5 border-b-2 transition-colors",
              activeTab === "command"
                ? "border-primary text-primary font-semibold"
                : "border-transparent text-ink-3 hover:text-ink"
            )}
          >
            Voice Commands
          </button>
          <button
            onClick={() => setActiveTab("fill")}
            className={clsx(
              "pb-2.5 border-b-2 transition-colors",
              activeTab === "fill"
                ? "border-primary text-primary font-semibold"
                : "border-transparent text-ink-3 hover:text-ink"
            )}
          >
            Voice Fill
          </button>
        </div>

        {/* Content Tabs */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === "brief" && (
            <div className="space-y-6">
              {/* Karaoke Script View */}
              <div className="p-5 bg-surface border border-line rounded-md text-[16px] font-serif leading-relaxed text-ink space-y-2">
                {sentences.map((sentence, idx) => (
                  <span
                    key={idx}
                    className={clsx(
                      "transition-colors duration-300 mr-1.5 inline-block",
                      idx === briefSentenceIdx && isPlayingBrief
                        ? "bg-accent-t text-ink font-semibold px-1 rounded-xs"
                        : idx < briefSentenceIdx && isPlayingBrief
                        ? "text-ink-3"
                        : "text-ink"
                    )}
                  >
                    {sentence}
                  </span>
                ))}
              </div>

              {/* Audio Controls */}
              <div className="flex items-center justify-between bg-sunken/60 p-3 rounded-md border border-line">
                <div className="flex items-center gap-3">
                  <Button
                    onClick={toggleSpeechBrief}
                    size="sm"
                    variant="primary"
                    leftIcon={isPlayingBrief ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  >
                    {isPlayingBrief ? "Pause" : "Play Brief (2 min)"}
                  </Button>
                  <Button
                    onClick={() => {
                      if (typeof window !== "undefined" && "speechSynthesis" in window) {
                        window.speechSynthesis.cancel();
                      }
                      setBriefSentenceIdx(0);
                      setIsPlayingBrief(false);
                    }}
                    size="sm"
                    variant="secondary"
                    leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                  >
                    Restart
                  </Button>
                </div>

                <div className="flex items-center gap-1.5 text-[12px] font-mono text-ink-2">
                  <span>Speed:</span>
                  {[0.75, 1, 1.25].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => setPlaybackSpeed(rate)}
                      className={clsx(
                        "px-2 py-0.5 rounded-xs border text-[11px]",
                        playbackSpeed === rate ? "bg-primary text-white border-primary" : "bg-elevated border-line"
                      )}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "command" && (
            <div className="space-y-6 text-center">
              {/* Animated Waveform & Mic Button */}
              <div className="flex flex-col items-center justify-center py-4">
                <div
                  className={clsx(
                    "w-20 h-20 rounded-full flex items-center justify-center border transition-all duration-300",
                    voice.isListening
                      ? "bg-primary text-white border-primary shadow-lg scale-105"
                      : "bg-surface text-ink-2 border-line hover:border-ink-3"
                  )}
                >
                  <Mic className="w-8 h-8" />
                </div>

                {/* 5-Bar Waveform */}
                <div className="flex items-center gap-1.5 h-6 mt-4">
                  {[24, 40, 60, 36, 18].map((h, i) => (
                    <div
                      key={i}
                      style={{
                        height: voice.isListening ? `${h}px` : "6px",
                      }}
                      className={clsx(
                        "w-1 rounded-full transition-all duration-150",
                        voice.isListening ? "bg-accent animate-pulse" : "bg-line-2"
                      )}
                    />
                  ))}
                </div>

                <p className="text-[13px] text-ink-3 mt-3">
                  {voice.isListening ? "Listening... Speak now" : "Tap a command chip below or hold Space to talk"}
                </p>
              </div>

              {commandFeedback && (
                <div className="p-3 bg-primary-t/60 text-primary border border-primary/20 rounded-md text-[13px] font-medium flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span>{commandFeedback}</span>
                </div>
              )}

              {/* Suggestion Chips */}
              <div className="space-y-2 text-left">
                <div className="text-[11px] font-medium uppercase tracking-wider text-ink-3">
                  Tap to Execute Verified Command:
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Approve the Harlow lease email",
                    "What's overdue at Northgate?",
                    "Assign the staffing plan to Planner",
                  ].map((chip) => (
                    <button
                      key={chip}
                      onClick={() => handleCommandChip(chip)}
                      className="px-3 py-1.5 rounded-sm bg-surface hover:bg-secondary/70 border border-line text-[13px] text-ink flex items-center gap-1.5 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-accent" />
                      <span>{chip}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "fill" && (
            <div className="space-y-4">
              <div className="text-[13px] text-ink-3">
                Voice Fill populates document variables without direct sending. Stays in draft state.
              </div>

              {/* Mock NDA preview */}
              <div className="p-5 bg-surface border border-line rounded-md font-serif text-[14px] leading-relaxed space-y-3">
                <h4 className="font-sans text-[12px] font-semibold text-ink uppercase tracking-wider">
                  Commercial Confidentiality & Services Agreement
                </h4>
                <p>
                  This Non-Disclosure Agreement is entered between <strong className="text-primary font-sans font-semibold px-1 bg-accent-t rounded-xs">{fillState.counterparty}</strong> and Ashby & Vale Hotels Ltd for a duration of <strong className="text-primary font-sans font-semibold px-1 bg-accent-t rounded-xs">{fillState.term}</strong>.
                </p>
                <p>
                  Mutual liability cap is established at <strong className="text-primary font-sans font-semibold px-1 bg-accent-t rounded-xs">{fillState.liabilityCap}</strong> with standard exclusion of gross negligence.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  onClick={() => {
                    setFillState({
                      counterparty: "BlueRidge Linens Ltd",
                      term: "24 months (amended)",
                      liabilityCap: "£184,000 fixed",
                      isFilled: true,
                    });
                    dispatchAction(
                      "Elena Marchetti (voice)",
                      "human",
                      "voice filled template",
                      "BlueRidge NDA fields populated",
                      "ashby",
                      "success",
                      { counterparty: "BlueRidge Linens" }
                    );
                  }}
                  variant="secondary"
                  size="sm"
                  leftIcon={<FileEdit className="w-4 h-4" />}
                >
                  Simulate Voice Fill: "BlueRidge Linens, 24 months"
                </Button>

                {fillState.isFilled && (
                  <span className="text-[12px] text-success font-medium flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" /> Filled into draft queue
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="px-6 py-3 border-t border-line bg-surface text-[11px] text-ink-3 flex items-center justify-between">
          <span>Web Speech API fallback enabled</span>
          <span>High-risk actions require confirmation tap</span>
        </div>
      </div>
    </div>
  );
}
