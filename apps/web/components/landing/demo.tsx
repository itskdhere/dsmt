"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  IconTerminal,
  IconSettings,
  IconCpu,
  IconSettingsSearch,
  IconTrash,
} from "@tabler/icons-react";

type Tab = "export" | "import";

interface LogLine {
  text: React.ReactNode;
  type: "info" | "success" | "command" | "progress" | "spinner";
  delay: number;
  valueHighlight?: string;
}

export default function DemoSection() {
  const [activeTab, setActiveTab] = useState<Tab>("export");
  const [volumeName, setVolumeName] = useState("production-db");
  const [typedCommand, setTypedCommand] = useState("");
  const [logs, setLogs] = useState<React.ReactNode[]>([]);
  const [currentCommand, setCurrentCommand] = useState("");
  const [activeSpinnerLine, setActiveSpinnerLine] = useState<{
    text: React.ReactNode;
    valueHighlight?: string;
  } | null>(null);
  const [spinnerChar, setSpinnerChar] = useState("⠋");
  const [activeHighlight, setActiveHighlight] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const [hasIntersected, setHasIntersected] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const animationRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (activeSpinnerLine) {
      const chars = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
      let i = 0;
      interval = setInterval(() => {
        setSpinnerChar(chars[i] ?? "⠋");
        i = (i + 1) % chars.length;
      }, 80);
    } else {
      setSpinnerChar("⠋");
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeSpinnerLine]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setHasIntersected(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const getBasename = (filePath: string): string => {
    const parts = filePath.split(/[/\\]/);
    return parts[parts.length - 1] || filePath;
  };

  const getLogsSequence = (tab: Tab, vol: string): LogLine[] => {
    const isBindMount = vol.includes("/") || vol.includes("\\");
    const baseName = getBasename(vol);

    if (tab === "export") {
      if (isBindMount) {
        return [
          {
            text: (
              <span className="text-primary-accent">
                Auto-detected bind mount path: {vol}
              </span>
            ),
            type: "info",
            delay: 500,
            valueHighlight: "auto-detect",
          },
          {
            text: "Preparing to export Docker bind mount...",
            type: "spinner",
            delay: 600,
            valueHighlight: "socket",
          },
          {
            text: (
              <span>
                Exporting bind mount from{" "}
                <span className="text-primary-accent">{vol}</span> to{" "}
                <span className="text-glow-accent">
                  /Users/demo/dsmt/backups
                </span>
              </span>
            ),
            type: "spinner",
            delay: 800,
            valueHighlight: "zero-dep",
          },
          {
            text: (
              <span>
                Exporting bind mount from{" "}
                <span className="text-primary-accent">{vol}</span> to{" "}
                <span className="text-glow-accent">
                  /Users/demo/dsmt/backups
                </span>
              </span>
            ),
            type: "spinner",
            delay: 1000,
            valueHighlight: "streaming",
          },
          {
            text: (
              <span>
                <span className="text-glow-accent">✔</span> Successfully
                exported bind mount to{" "}
                <span className="text-glow-accent">
                  /Users/demo/dsmt/backups
                </span>
              </span>
            ),
            type: "success",
            delay: 500,
            valueHighlight: "cleanup",
          },
        ];
      } else {
        return [
          {
            text: (
              <span className="text-primary-accent">
                Auto-detected volume name: {vol}
              </span>
            ),
            type: "info",
            delay: 500,
            valueHighlight: "auto-detect",
          },
          {
            text: "Preparing to export Docker volume...",
            type: "spinner",
            delay: 600,
            valueHighlight: "socket",
          },
          {
            text: (
              <span>
                Exporting volume{" "}
                <span className="text-primary-accent">{vol}</span> to{" "}
                <span className="text-glow-accent">
                  /Users/demo/dsmt/backups
                </span>
              </span>
            ),
            type: "spinner",
            delay: 800,
            valueHighlight: "zero-dep",
          },
          {
            text: (
              <span>
                Exporting volume{" "}
                <span className="text-primary-accent">{vol}</span> to{" "}
                <span className="text-glow-accent">
                  /Users/demo/dsmt/backups
                </span>
              </span>
            ),
            type: "spinner",
            delay: 1000,
            valueHighlight: "streaming",
          },
          {
            text: (
              <span>
                <span className="text-glow-accent">✔</span> Successfully
                exported volume to{" "}
                <span className="text-glow-accent">
                  /Users/demo/dsmt/backups
                </span>
              </span>
            ),
            type: "success",
            delay: 500,
            valueHighlight: "cleanup",
          },
        ];
      }
    } else {
      if (isBindMount) {
        return [
          {
            text: (
              <span className="text-primary-accent">
                Auto-detected bind mount path: {vol}
              </span>
            ),
            type: "info",
            delay: 500,
            valueHighlight: "auto-detect",
          },
          {
            text: "Preparing to import to Docker bind mount...",
            type: "spinner",
            delay: 600,
            valueHighlight: "socket",
          },
          {
            text: (
              <span>
                Importing from{" "}
                <span className="text-primary-accent">
                  /Users/demo/dsmt/backups/{baseName}.tar.gz
                </span>{" "}
                to bind mount <span className="text-glow-accent">{vol}</span>
              </span>
            ),
            type: "spinner",
            delay: 800,
            valueHighlight: "zero-dep",
          },
          {
            text: (
              <span>
                Importing from{" "}
                <span className="text-primary-accent">
                  /Users/demo/dsmt/backups/{baseName}.tar.gz
                </span>{" "}
                to bind mount <span className="text-glow-accent">{vol}</span>
              </span>
            ),
            type: "spinner",
            delay: 1000,
            valueHighlight: "streaming",
          },
          {
            text: (
              <span>
                <span className="text-glow-accent">✔</span> Successfully
                imported to bind mount at{" "}
                <span className="text-glow-accent">{vol}</span>
              </span>
            ),
            type: "success",
            delay: 500,
            valueHighlight: "cleanup",
          },
        ];
      } else {
        return [
          {
            text: (
              <span className="text-primary-accent">
                Auto-detected volume name: {vol}
              </span>
            ),
            type: "info",
            delay: 500,
            valueHighlight: "auto-detect",
          },
          {
            text: "Preparing to import to Docker volume...",
            type: "spinner",
            delay: 600,
            valueHighlight: "socket",
          },
          {
            text: (
              <span>
                Importing from{" "}
                <span className="text-primary-accent">
                  /Users/demo/dsmt/backups/{vol}.tar.gz
                </span>{" "}
                to volume <span className="text-glow-accent">{vol}</span>
              </span>
            ),
            type: "spinner",
            delay: 800,
            valueHighlight: "zero-dep",
          },
          {
            text: (
              <span>
                Importing from{" "}
                <span className="text-primary-accent">
                  /Users/demo/dsmt/backups/{vol}.tar.gz
                </span>{" "}
                to volume <span className="text-glow-accent">{vol}</span>
              </span>
            ),
            type: "spinner",
            delay: 1000,
            valueHighlight: "streaming",
          },
          {
            text: (
              <span>
                <span className="text-glow-accent">✔</span> Successfully
                imported to volume{" "}
                <span className="text-glow-accent">{vol}</span>
              </span>
            ),
            type: "success",
            delay: 500,
            valueHighlight: "cleanup",
          },
        ];
      }
    }
  };

  const startSimulation = (tab: Tab, vol: string) => {
    if (animationRef.current) clearTimeout(animationRef.current);

    setIsAnimating(true);
    setTypedCommand("");
    setLogs([]);
    setActiveSpinnerLine(null);
    setActiveHighlight(null);

    const commandText =
      tab === "export"
        ? `dsmt export ${vol} ./backups`
        : `dsmt import ./backups/${getBasename(vol)}.tar.gz ${vol}`;
    setCurrentCommand(commandText);

    let charIndex = 0;
    const typeCommand = () => {
      if (charIndex <= commandText.length) {
        setTypedCommand(commandText.substring(0, charIndex));
        charIndex++;
        animationRef.current = setTimeout(typeCommand, 35);
      } else {
        animationRef.current = setTimeout(() => runLogs(0), 400);
      }
    };

    const sequence = getLogsSequence(tab, vol);
    const runLogs = (index: number) => {
      if (index >= sequence.length) {
        setIsAnimating(false);
        setActiveHighlight(null);
        setActiveSpinnerLine(null);
        return;
      }

      const step = sequence[index];
      if (!step) return;

      if (step.valueHighlight) {
        setActiveHighlight(step.valueHighlight);
      }

      if (step.type === "spinner") {
        setActiveSpinnerLine({
          text: step.text,
          valueHighlight: step.valueHighlight,
        });
        animationRef.current = setTimeout(() => {
          runLogs(index + 1);
        }, step.delay);
      } else {
        setActiveSpinnerLine(null);
        setLogs((prev) => [...prev, step.text]);
        animationRef.current = setTimeout(() => {
          runLogs(index + 1);
        }, step.delay);
      }
    };

    typeCommand();
  };

  useEffect(() => {
    if (hasIntersected) {
      startSimulation(activeTab, volumeName);
    }
    return () => {
      if (animationRef.current) clearTimeout(animationRef.current);
    };
  }, [activeTab, hasIntersected]);

  const handleRun = () => {
    startSimulation(activeTab, volumeName);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^a-zA-Z0-9-_\/\\.:]/g, "");
    setVolumeName(val || "production-db");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleRun();
      inputRef.current?.blur();
    }
  };

  const companionCards = [
    {
      id: "auto-detect",
      title: "Auto-Detection Intelligence",
      description:
        "Automatically detects whether the target is a Docker volume or a local host bind-mount path.",
      icon: <IconSettingsSearch size={18} className="text-glow-accent" />,
    },
    {
      id: "socket",
      title: "Native Socket Connection",
      description:
        "Automatically detects and connects to the local Docker engine via Unix sockets or Windows Named Pipes.",
      icon: <IconSettings size={18} className="text-primary-accent" />,
    },
    {
      id: "zero-dep",
      title: "Zero Host Dependencies",
      description:
        "Spawns isolated, lightweight containers (busybox) to process archives. No host tools required.",
      icon: <IconCpu size={18} className="text-primary-accent" />,
    },
    {
      id: "streaming",
      title: "Direct Tarball Archiving",
      description:
        "Mounts the Docker storage alongside the target host path to archive and compress in a single pass.",
      icon: <IconTerminal size={18} className="text-glow-accent" />,
    },
    {
      id: "cleanup",
      title: "Guaranteed Self-Cleaning",
      description:
        "Ensures container cleanup, automatically removing temporary run containers when done or if interrupted.",
      icon: <IconTrash size={18} className="text-primary-accent" />,
    },
  ];

  return (
    <section
      id="demo"
      ref={sectionRef}
      className="relative border-t border-hairline/60 bg-canvas py-20"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-1/2 h-75 w-150 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-accent/5 blur-[130px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 font-sans text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            See DSMT in Action
          </h2>
          <p className="mx-auto max-w-3xl font-sans text-base text-text-muted sm:text-lg">
            Witness how DSMT performs migrations using zero local requirements.
            Fully containerized, lightning-fast, and completely clean.
          </p>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
          <div className="flex h-full w-full flex-col lg:col-span-7">
            <div className="mb-4 flex flex-wrap items-center gap-3 rounded-lg border border-hairline bg-surface-1/50 px-4 py-3 text-sm">
              <span className="font-sans font-medium text-text-muted">
                Try a Volume name or Bind Mount path:
              </span>
              <div className="relative max-w-xs grow">
                <input
                  ref={inputRef}
                  type="text"
                  value={volumeName}
                  onChange={handleVolumeChange}
                  onKeyDown={handleKeyDown}
                  placeholder="production-db or /var/lib/mysql"
                  className="w-full rounded border border-hairline bg-canvas px-2.5 py-1 font-mono text-xs text-text-primary transition-all outline-none focus:border-primary-accent"
                />
              </div>
              <button
                onClick={handleRun}
                disabled={isAnimating}
                className="rounded border border-hairline bg-surface-2 px-3 py-1 text-xs font-semibold text-text-primary transition-all hover:border-primary-accent/30 hover:text-primary-accent disabled:opacity-50"
              >
                Run Command
              </button>
            </div>

            <div className="relative flex grow flex-col overflow-hidden rounded-xl border border-hairline bg-[#080d1a] shadow-2xl">
              <div className="flex items-center justify-between border-b border-hairline bg-[#0B1329] px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-[#EF4444]/80" />
                  <span className="h-3 w-3 rounded-full bg-[#F59E0B]/80" />
                  <span className="h-3 w-3 rounded-full bg-[#10B981]/80" />
                  <span className="ml-2 font-mono text-xs text-text-muted">
                    Terminal
                  </span>
                </div>

                <div className="flex gap-1">
                  <button
                    onClick={() => !isAnimating && setActiveTab("export")}
                    disabled={isAnimating}
                    className={`rounded px-3 py-1 font-mono text-xs transition-all ${
                      activeTab === "export"
                        ? "border border-hairline bg-[#111D3A] text-primary-accent"
                        : "border border-transparent text-text-muted hover:text-text-primary"
                    }`}
                  >
                    Export
                  </button>
                  <button
                    onClick={() => !isAnimating && setActiveTab("import")}
                    disabled={isAnimating}
                    className={`rounded px-3 py-1 font-mono text-xs transition-all ${
                      activeTab === "import"
                        ? "border border-hairline bg-[#111D3A] text-primary-accent"
                        : "border border-transparent text-text-muted hover:text-text-primary"
                    }`}
                  >
                    Import
                  </button>
                </div>
              </div>

              <div className="min-h-40 grow overflow-y-auto bg-[#040814] p-5 font-mono text-xs leading-relaxed text-text-primary">
                <div className="mb-4 flex items-center gap-1">
                  <span className="text-glow-accent">$</span>
                  <span>{typedCommand}</span>
                  {isAnimating &&
                    typedCommand.length < currentCommand.length && (
                      <span className="inline-block h-4 w-1.5 animate-pulse bg-primary-accent align-middle" />
                    )}
                </div>

                <div className="space-y-2">
                  {logs.map((log, index) => (
                    <div
                      key={index}
                      className="animate-fade-in text-text-primary/90 duration-300"
                    >
                      {log}
                    </div>
                  ))}

                  {activeSpinnerLine && (
                    <div className="flex items-center gap-2 text-text-primary/90">
                      <span className="font-semibold text-[#06b6d4]">
                        {spinnerChar}
                      </span>
                      <div>{activeSpinnerLine.text}</div>
                    </div>
                  )}

                  {!isAnimating && logs.length > 0 && (
                    <div className="animate-fade-in flex items-center gap-1 pt-1.5 duration-300">
                      <span className="text-glow-accent">$</span>
                      <span className="inline-block h-4 w-1.5 animate-pulse bg-primary-accent align-middle" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3.5 lg:col-span-5">
            <h3 className="mb-2 hidden font-sans text-lg font-semibold text-text-primary lg:block">
              Under The Hood
            </h3>
            {companionCards.map((card) => {
              const isSelected = activeHighlight === card.id;
              return (
                <div
                  key={card.id}
                  className={`rounded-xl border p-4 transition-all duration-300 ${
                    isSelected
                      ? "scale-[1.02] border-primary-accent/40 bg-surface-2 shadow-[0_0_15px_rgba(14,165,233,0.1)]"
                      : "border-hairline bg-surface-1/60 opacity-60"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`rounded-lg border border-hairline bg-canvas p-2 transition-colors ${
                        isSelected ? "border-primary-accent/40" : ""
                      }`}
                    >
                      {card.icon}
                    </div>
                    <div>
                      <h4
                        className={`font-sans text-sm font-bold transition-colors ${
                          isSelected
                            ? "text-primary-accent"
                            : "text-text-primary"
                        }`}
                      >
                        {card.title}
                      </h4>
                      <p className="mt-1 font-sans text-xs leading-relaxed text-text-muted">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
