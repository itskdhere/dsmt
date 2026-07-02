"use client";

import { useState } from "react";
import {
  IconCopy,
  IconCheck,
  IconDownload,
  IconFileCode,
  IconPackage,
  IconTerminal,
  IconBrandNpm,
  IconBrandYarn,
  IconBrandPnpm,
  IconFlame,
} from "@tabler/icons-react";

type InstallTab = "script" | "package" | "binary";

type PackageManager = "npm" | "yarn" | "pnpm" | "bun";

export interface BinaryRelease {
  platform: string;
  arch: string;
  filename: string;
  size: string;
  sha256: string;
  downloadUrl: string;
}

export interface InstallProps {
  binaryReleases?: BinaryRelease[];
}

export default function InstallSection({ binaryReleases = [] }: InstallProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<InstallTab>("package");
  const [activePkg, setActivePkg] = useState<PackageManager>("npm");

  const pkgLabels = {
    npm: "NPM",
    yarn: "Yarn",
    pnpm: "PNPM",
    bun: "Bun",
  };

  const pkgIcons = {
    npm: <IconBrandNpm size={14} />,
    yarn: <IconBrandYarn size={14} />,
    pnpm: <IconBrandPnpm size={14} />,
    bun: <IconFlame size={14} />,
  };

  const pkgConfig = {
    npm: {
      install: {
        raw: "npm install -g dsmt",
        html: (
          <>
            <span className="text-glow-accent">npm</span> install -g{" "}
            <span className="text-primary-accent">dsmt</span>
          </>
        ),
      },
      exec: {
        raw: "npx dsmt",
        html: (
          <>
            <span className="text-glow-accent">npx</span>{" "}
            <span className="text-primary-accent">dsmt</span>
          </>
        ),
      },
    },
    yarn: {
      install: {
        raw: "yarn global add dsmt",
        html: (
          <>
            <span className="text-glow-accent">yarn</span> global add{" "}
            <span className="text-primary-accent">dsmt</span>
          </>
        ),
      },
      exec: {
        raw: "yarn dlx dsmt",
        html: (
          <>
            <span className="text-glow-accent">yarn</span> dlx{" "}
            <span className="text-primary-accent">dsmt</span>
          </>
        ),
      },
    },
    pnpm: {
      install: {
        raw: "pnpm add -g dsmt",
        html: (
          <>
            <span className="text-glow-accent">pnpm</span> add -g{" "}
            <span className="text-primary-accent">dsmt</span>
          </>
        ),
      },
      exec: {
        raw: "pnpm dlx dsmt",
        html: (
          <>
            <span className="text-glow-accent">pnpm</span> dlx{" "}
            <span className="text-primary-accent">dsmt</span>
          </>
        ),
      },
    },
    bun: {
      install: {
        raw: "bun add -g dsmt",
        html: (
          <>
            <span className="text-glow-accent">bun</span> add -g{" "}
            <span className="text-primary-accent">dsmt</span>
          </>
        ),
      },
      exec: {
        raw: "bunx dsmt",
        html: (
          <>
            <span className="text-glow-accent">bunx</span>{" "}
            <span className="text-primary-accent">dsmt</span>
          </>
        ),
      },
    },
  };

  const triggerCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section
      id="install"
      className="relative border-t border-hairline/60 bg-canvas py-20"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute bottom-10 left-1/4 h-100 w-100 rounded-full bg-secondary-accent/5 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="mb-4 font-sans text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Install DSMT
          </h2>
          <p className="mx-auto max-w-2xl font-sans text-base text-text-muted sm:text-lg">
            Get up and running in seconds. Install via package manager, run a
            quick install script, or download the precompiled binary directly.
          </p>
        </div>

        <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-hairline bg-surface-1 p-4 shadow-2xl sm:p-8">
          <div className="mx-auto mb-8 flex max-w-xl justify-center gap-1 rounded-full border border-hairline bg-canvas/80 p-1 sm:gap-1.5">
            <button
              onClick={() => setActiveTab("script")}
              className={`flex flex-1 items-center justify-center gap-1 rounded-full py-2 font-sans text-xs font-bold transition-all sm:gap-2 sm:text-sm ${
                activeTab === "script"
                  ? "bg-primary-accent text-canvas shadow-lg"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              <IconTerminal size={14} className="shrink-0 sm:h-4 sm:w-4" />
              <span>
                <span className="sm:hidden">Quick</span>
                <span className="hidden sm:inline">Quick Install</span>
              </span>
            </button>
            <button
              onClick={() => setActiveTab("package")}
              className={`flex flex-1 items-center justify-center gap-1 rounded-full py-2 font-sans text-xs font-bold transition-all sm:gap-2 sm:text-sm ${
                activeTab === "package"
                  ? "bg-primary-accent text-canvas shadow-lg"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              <IconPackage size={14} className="shrink-0 sm:h-4 sm:w-4" />
              <span>
                <span className="sm:hidden">Packages</span>
                <span className="hidden sm:inline">Package Managers</span>
              </span>
            </button>
            <button
              onClick={() => setActiveTab("binary")}
              className={`flex flex-1 items-center justify-center gap-1 rounded-full py-2 font-sans text-xs font-bold transition-all sm:gap-2 sm:text-sm ${
                activeTab === "binary"
                  ? "bg-primary-accent text-canvas shadow-lg"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              <IconDownload size={14} className="shrink-0 sm:h-4 sm:w-4" />
              <span>
                <span className="sm:hidden">Binaries</span>
                <span className="hidden sm:inline">Direct Binaries</span>
              </span>
            </button>
          </div>

          {activeTab === "script" && (
            <div className="animate-in space-y-6 duration-200 fade-in">
              <div className="space-y-4">
                <div>
                  <div className="mb-2 flex items-center justify-between px-1 font-mono text-xs text-text-muted">
                    <span>Mac / Linux (cURL & Bash)</span>
                  </div>
                  <div className="relative flex items-center justify-between rounded-xl border border-hairline bg-[#040814] p-3.5 font-mono text-sm sm:p-4.5">
                    <div className="scrollbar-none flex-1 overflow-x-auto pr-4 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                      <code className="whitespace-nowrap text-text-primary">
                        curl -fsSL{" "}
                        <span className="text-primary-accent">
                          https://dsmt.itskdhere.com/install.sh
                        </span>{" "}
                        | sh
                      </code>
                    </div>
                    <button
                      onClick={() =>
                        triggerCopy(
                          "curl -fsSL https://dsmt.itskdhere.com/install.sh | sh",
                          "bash"
                        )
                      }
                      className="shrink-0 rounded border border-hairline bg-surface-1 p-2 text-text-muted transition-all hover:border-primary-accent/30 hover:text-text-primary"
                    >
                      {copiedId === "bash" ? (
                        <IconCheck
                          size={14}
                          className="text-glow-accent sm:h-4 sm:w-4"
                        />
                      ) : (
                        <IconCopy size={14} className="sm:h-4 sm:w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between px-1 font-mono text-xs text-text-muted">
                    <span>Windows (PowerShell)</span>
                  </div>
                  <div className="relative flex items-center justify-between rounded-xl border border-hairline bg-[#040814] p-3.5 font-mono text-sm sm:p-4.5">
                    <div className="scrollbar-none flex-1 overflow-x-auto pr-4 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                      <code className="whitespace-nowrap text-text-primary">
                        irm{" "}
                        <span className="text-primary-accent">
                          https://dsmt.itskdhere.com/install.ps1
                        </span>{" "}
                        | iex
                      </code>
                    </div>
                    <button
                      onClick={() =>
                        triggerCopy(
                          "irm https://dsmt.itskdhere.com/install.ps1 | iex",
                          "powershell"
                        )
                      }
                      className="shrink-0 rounded border border-hairline bg-surface-1 p-2 text-text-muted transition-all hover:border-primary-accent/30 hover:text-text-primary"
                    >
                      {copiedId === "powershell" ? (
                        <IconCheck
                          size={14}
                          className="text-glow-accent sm:h-4 sm:w-4"
                        />
                      ) : (
                        <IconCopy size={14} className="sm:h-4 sm:w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <p className="mt-2 text-center font-sans text-xs leading-relaxed text-text-muted">
                These one-liners download, verify, and place the pre-compiled
                binary directly in your system PATH.
              </p>
            </div>
          )}

          {activeTab === "package" && (
            <div className="animate-in space-y-6 duration-200 fade-in">
              <div className="mx-auto flex max-w-sm justify-center gap-1 rounded-full border border-hairline/60 bg-[#040814]/40 p-1">
                {(["npm", "yarn", "pnpm", "bun"] as const).map((pkg) => (
                  <button
                    key={pkg}
                    onClick={() => setActivePkg(pkg)}
                    className={`flex flex-1 items-center justify-center gap-1 rounded-full py-1.5 font-mono text-xs font-bold transition-all sm:gap-1.5 ${
                      activePkg === pkg
                        ? "bg-primary-accent text-canvas shadow-md"
                        : "text-text-muted hover:text-text-primary"
                    }`}
                  >
                    <span className="hidden shrink-0 sm:inline-flex">
                      {pkgIcons[pkg]}
                    </span>
                    <span>{pkgLabels[pkg]}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <div>
                  <div className="mb-2 flex items-center justify-between px-1 font-mono text-xs text-text-muted">
                    <span>Global Install ({activePkg})</span>
                  </div>
                  <div className="relative flex items-center justify-between rounded-xl border border-hairline bg-[#040814] p-3.5 font-mono text-sm sm:p-4.5">
                    <div className="scrollbar-none flex-1 overflow-x-auto pr-4 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                      <code className="whitespace-nowrap text-text-primary">
                        {pkgConfig[activePkg].install.html}
                      </code>
                    </div>
                    <button
                      onClick={() =>
                        triggerCopy(
                          pkgConfig[activePkg].install.raw,
                          `${activePkg}-install`
                        )
                      }
                      className="shrink-0 rounded border border-hairline bg-surface-1 p-2 text-text-muted transition-all hover:border-primary-accent/30 hover:text-text-primary"
                    >
                      {copiedId === `${activePkg}-install` ? (
                        <IconCheck
                          size={14}
                          className="text-glow-accent sm:h-4 sm:w-4"
                        />
                      ) : (
                        <IconCopy size={14} className="sm:h-4 sm:w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between px-1 font-mono text-xs text-text-muted">
                    <span>Exec ({activePkg})</span>
                  </div>
                  <div className="relative flex items-center justify-between rounded-xl border border-hairline bg-[#040814] p-3.5 font-mono text-sm sm:p-4.5">
                    <div className="scrollbar-none flex-1 overflow-x-auto pr-4 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                      <code className="whitespace-nowrap text-text-primary">
                        {pkgConfig[activePkg].exec.html}
                      </code>
                    </div>
                    <button
                      onClick={() =>
                        triggerCopy(
                          pkgConfig[activePkg].exec.raw,
                          `${activePkg}-exec`
                        )
                      }
                      className="shrink-0 rounded border border-hairline bg-surface-1 p-2 text-text-muted transition-all hover:border-primary-accent/30 hover:text-text-primary"
                    >
                      {copiedId === `${activePkg}-exec` ? (
                        <IconCheck
                          size={14}
                          className="text-glow-accent sm:h-4 sm:w-4"
                        />
                      ) : (
                        <IconCopy size={14} className="sm:h-4 sm:w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <p className="mt-2 text-center font-sans text-xs leading-relaxed text-text-muted">
                Requires Node.js (with npm / yarn / pnpm) or Bun runtime
                environment installed on your system.
              </p>
            </div>
          )}

          {activeTab === "binary" && (
            <div className="animate-in space-y-6 duration-200 fade-in">
              {binaryReleases.length === 0 ? (
                <div className="flex h-40 items-center justify-center font-sans text-sm text-text-muted">
                  <span className="animate-pulse">Loading from GitHub...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {binaryReleases.map((rel, index) => (
                    <div
                      key={index}
                      className="flex flex-col justify-between rounded-xl border border-hairline bg-canvas p-4 transition-all hover:border-primary-accent/20"
                    >
                      <div>
                        <div className="mb-3 flex items-center justify-between font-mono text-sm text-text-muted">
                          <span className="font-bold text-text-primary">
                            {rel.platform}
                          </span>
                          <span className="rounded border border-hairline bg-surface-1 px-1.5 py-0.5 text-[11px]">
                            {rel.arch}
                          </span>
                        </div>

                        <div className="mb-4 flex items-stretch gap-2.5">
                          <div className="flex aspect-square items-center justify-center rounded border border-hairline bg-surface-1 p-1.5 text-primary-accent">
                            <IconFileCode size={18} className="shrink-0" />
                          </div>
                          <div className="flex flex-col justify-center gap-0.5 overflow-hidden">
                            <span className="block truncate font-mono text-sm font-medium text-text-primary">
                              {rel.filename}
                            </span>
                            <span className="block text-[12px] text-text-muted">
                              Size: {rel.size}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2.5 border-t border-hairline/50 pt-3">
                        <a
                          href={rel.downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-8 w-full cursor-pointer items-center justify-center gap-1.5 rounded border border-hairline bg-surface-1 font-sans text-xs font-bold text-text-primary transition-all hover:border-primary-accent/30 hover:bg-surface-2"
                        >
                          <IconDownload size={14} />
                          <span>Download Binary</span>
                        </a>

                        <div className="flex items-center justify-between gap-2 rounded border border-hairline bg-[#040814] px-2 py-1 font-mono text-[10px] text-text-muted">
                          <span className="truncate">SHA: {rel.sha256}</span>
                          <button
                            onClick={() =>
                              triggerCopy(rel.sha256, `sha-${index}`)
                            }
                            className="shrink-0 text-text-muted transition-colors hover:text-text-primary"
                            title="Copy SHA256"
                          >
                            {copiedId === `sha-${index}` ? (
                              <IconCheck
                                size={12}
                                className="text-glow-accent"
                              />
                            ) : (
                              <IconCopy size={12} />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
