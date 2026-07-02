"use client";

import { useState } from "react";
import {
  IconCopy,
  IconCheck,
  IconHelpCircle,
  IconPackageImport,
  IconPackageExport,
} from "@tabler/icons-react";

type TabId = "export" | "import";

interface CommandArgument {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

interface CommandOption {
  flag: string;
  description: string;
}

interface CommandExample {
  label: string;
  command: string;
  comment: string;
}

interface CommandData {
  id: TabId;
  name: string;
  summary: string;
  description: string;
  syntax: string;
  arguments: CommandArgument[];
  options: CommandOption[];
  examples: CommandExample[];
}

export default function DocsSection() {
  const [activeTab, setActiveTab] = useState<TabId>("export");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const commands: Record<"export" | "import", CommandData> = {
    export: {
      id: "export",
      name: "dsmt export",
      summary: "Export a volume or bind mount to a tarball",
      description:
        "The export command extracts data from a specified Docker volume or local host directory (bind mount) and packages it into a compressed gzip tarball (.tar.gz). DSMT runs a secure, isolated container to perform the compression, ensuring no extra archival dependencies are required on your host machine.",
      syntax: "dsmt export <src> <dst> [options]",
      arguments: [
        {
          name: "src",
          type: "String",
          required: true,
          description:
            "Name of the Docker volume or absolute path of the local bind mount to export.",
        },
        {
          name: "dst",
          type: "String",
          required: true,
          description:
            "Target directory path on the host where the exported tarball will be saved.",
        },
      ],
      options: [
        {
          flag: "-v, --volume",
          description:
            "Force DSMT to treat the <src> parameter as a Docker Volume (disables auto-detection).",
        },
        {
          flag: "-b, --bind",
          description:
            "Force DSMT to treat the <src> parameter as a Host Bind Mount (disables auto-detection).",
        },
      ],
      examples: [
        {
          label: "Export standard volume",
          command: "dsmt export mongodb_data ./",
          comment:
            "Exports the volume 'mongodb_data' into 'mongodb_data.tar.gz' in the current folder.",
        },
        {
          label: "Export bind mount",
          command: "dsmt export /var/www/html ./backups",
          comment:
            "Exports the directory '/var/www/html' to './backups/html.tar.gz'.",
        },
        {
          label: "Force volume export",
          command: "dsmt export -v ambiguous_name /backups",
          comment:
            "Forces DSMT to interpret 'ambiguous_name' as a volume, skipping folder path checks.",
        },
      ],
    },
    import: {
      id: "import",
      name: "dsmt import",
      summary: "Import a tarball to a volume or bind mount",
      description:
        "The import command takes a compressed gzip tarball (.tar.gz) and extracts its content directly into a target Docker volume or local bind mount directory. If the destination Docker volume does not exist, DSMT automatically creates it before running the restoration process.",
      syntax: "dsmt import <src> <dst> [options]",
      arguments: [
        {
          name: "src",
          type: "String",
          required: true,
          description:
            "Path to the compressed tarball file (.tar.gz) on your host filesystem.",
        },
        {
          name: "dst",
          type: "String",
          required: true,
          description:
            "Target Docker volume name or absolute directory path to import the data into.",
        },
      ],
      options: [
        {
          flag: "-v, --volume",
          description:
            "Force DSMT to treat the <dst> target as a Docker Volume (disables auto-detection).",
        },
        {
          flag: "-b, --bind",
          description:
            "Force DSMT to treat the <dst> target as a Host Bind Mount (disables auto-detection).",
        },
      ],
      examples: [
        {
          label: "Import to a volume",
          command: "dsmt import ./mongodb_data.tar.gz new_mongodb_data",
          comment:
            "Creates 'new_mongodb_data' volume (if missing) and restores files from the tarball.",
        },
        {
          label: "Import to a bind mount",
          command: "dsmt import ./html.tar.gz /var/www/html",
          comment:
            "Restores files into the host bind mount directory '/var/www/html'.",
        },
        {
          label: "Force bind mount import",
          command: "dsmt import -b ./backup.tar.gz ./restored_folder",
          comment:
            "Forces DSMT to extract files to local path './restored_folder' instead of a volume.",
        },
      ],
    },
  };

  const triggerCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section
      id="docs"
      className="relative border-t border-hairline/60 bg-canvas py-20"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 right-1/4 h-120 w-120 rounded-full bg-primary-accent/5 blur-[130px]" />
        <div className="absolute bottom-0 left-10 h-80 w-80 rounded-full bg-glow-accent/5 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="mb-4 font-sans text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            CLI Docs & Reference
          </h2>
          <p className="mx-auto max-w-2xl font-sans text-base text-text-muted sm:text-lg">
            Detailed command specifications, flags, and usage patterns. Master
            the simple yet powerful interface of DSMT.
          </p>
        </div>

        <div className="mx-auto flex max-w-5xl flex-col gap-8">
          <div className="mx-auto flex w-full max-w-xs justify-center gap-1.5 rounded-full border border-hairline bg-surface-1/80 p-1">
            <button
              onClick={() => setActiveTab("export")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-full py-2.5 font-sans text-xs font-bold transition-all sm:text-sm ${
                activeTab === "export"
                  ? "bg-primary-accent text-canvas shadow-lg"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              <IconPackageExport size={16} />
              <span>Export</span>
            </button>

            <button
              onClick={() => setActiveTab("import")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-full py-2.5 font-sans text-xs font-bold transition-all sm:text-sm ${
                activeTab === "import"
                  ? "bg-primary-accent text-canvas shadow-lg"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              <IconPackageImport size={16} />
              <span>Import</span>
            </button>
          </div>

          <div className="w-full">
            <div
              key={activeTab}
              className="animate-in space-y-8 rounded-2xl border border-hairline bg-surface-1 p-6 shadow-2xl duration-300 fade-in sm:p-8"
            >
              <div>
                <div className="mb-3 flex flex-wrap items-center gap-3">
                  <span className="font-mono text-xl font-bold tracking-tight text-text-primary sm:text-2xl">
                    {commands[activeTab].name}
                  </span>
                  <span className="rounded-full bg-primary-accent/15 px-3 py-0.5 font-sans text-[11px] font-bold tracking-wider text-primary-accent uppercase">
                    Command
                  </span>
                </div>
                <p className="font-sans text-sm leading-relaxed text-text-muted sm:text-base">
                  {commands[activeTab].description}
                </p>
              </div>

              <div className="space-y-2">
                <span className="font-sans text-xs font-bold tracking-wider text-text-muted uppercase">
                  Usage Syntax
                </span>
                <div className="flex items-center justify-between overflow-x-auto rounded-xl border border-hairline bg-[#040814] p-4 font-mono text-sm">
                  <code className="text-text-primary">
                    <span className="text-glow-accent">dsmt</span>{" "}
                    {commands[activeTab].syntax.replace("dsmt ", "")}
                  </code>
                  <button
                    onClick={() =>
                      triggerCopy(
                        commands[activeTab].syntax,
                        `${activeTab}-syntax`
                      )
                    }
                    className="ml-4 shrink-0 rounded border border-hairline bg-surface-1 p-2 text-text-muted transition-all hover:border-primary-accent/30 hover:text-text-primary"
                  >
                    {copiedId === `${activeTab}-syntax` ? (
                      <IconCheck size={15} className="text-glow-accent" />
                    ) : (
                      <IconCopy size={15} />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <span className="block font-sans text-xs font-bold tracking-wider text-text-muted uppercase">
                  Arguments
                </span>
                <div className="overflow-x-auto rounded-xl border border-hairline bg-canvas">
                  <table className="min-w-full divide-y divide-hairline/60">
                    <thead>
                      <tr className="bg-surface-2/40 font-sans text-xs font-semibold text-text-muted">
                        <th className="px-4 py-3 text-left">Argument</th>
                        <th className="px-4 py-3 text-left">Type</th>
                        <th className="px-4 py-3 text-left">Required</th>
                        <th className="px-4 py-3 text-left">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-hairline/30 font-sans text-sm text-text-muted">
                      {commands[activeTab].arguments.map((arg, idx) => (
                        <tr
                          key={idx}
                          className="transition-colors hover:bg-surface-2/15"
                        >
                          <td className="px-4 py-3.5 font-mono font-bold text-text-primary">
                            &lt;{arg.name}&gt;
                          </td>
                          <td className="px-4 py-3.5 font-mono text-xs">
                            {arg.type}
                          </td>
                          <td className="px-4 py-3.5">
                            {arg.required ? (
                              <span className="font-medium text-glow-accent">
                                Yes
                              </span>
                            ) : (
                              <span>No</span>
                            )}
                          </td>
                          <td className="px-4 py-3.5 text-xs leading-normal sm:text-sm">
                            {arg.description}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="space-y-3">
                <span className="block font-sans text-xs font-bold tracking-wider text-text-muted uppercase">
                  Options
                </span>
                <div className="overflow-x-auto rounded-xl border border-hairline bg-canvas">
                  <table className="min-w-full divide-y divide-hairline/60">
                    <thead>
                      <tr className="bg-surface-2/40 font-sans text-xs font-semibold text-text-muted">
                        <th className="w-1/3 px-4 py-3 text-left">Flag</th>
                        <th className="px-4 py-3 text-left">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-hairline/30 font-sans text-sm text-text-muted">
                      {commands[activeTab].options.map((opt, idx) => (
                        <tr
                          key={idx}
                          className="transition-colors hover:bg-surface-2/15"
                        >
                          <td className="px-4 py-3.5 font-mono font-semibold text-primary-accent">
                            {opt.flag}
                          </td>
                          <td className="px-4 py-3.5 text-xs leading-normal sm:text-sm">
                            {opt.description}
                          </td>
                        </tr>
                      ))}
                      <tr className="transition-colors hover:bg-surface-2/15">
                        <td className="px-4 py-3.5 font-mono font-semibold text-primary-accent">
                          -h, --help
                        </td>
                        <td className="px-4 py-3.5 text-xs leading-normal sm:text-sm">
                          Display help and usage details for this command.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="space-y-4">
                <span className="block font-sans text-xs font-bold tracking-wider text-text-muted uppercase">
                  Examples
                </span>
                <div className="grid grid-cols-1 gap-4">
                  {commands[activeTab].examples.map((ex, idx) => (
                    <div
                      key={idx}
                      className="space-y-2.5 rounded-xl border border-hairline bg-canvas p-4 transition-all hover:border-primary-accent/15"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-sans text-xs font-bold text-text-primary">
                          {ex.label}
                        </span>
                        <span className="font-sans text-[11px] font-medium text-text-muted">
                          {ex.comment}
                        </span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg border border-hairline/60 bg-[#040814] px-3.5 py-2.5 font-mono text-xs sm:text-sm">
                        <code className="font-medium text-text-primary">
                          {ex.command}
                        </code>
                        <button
                          onClick={() =>
                            triggerCopy(ex.command, `${activeTab}-ex-${idx}`)
                          }
                          className="ml-4 text-text-muted transition-colors hover:text-text-primary"
                        >
                          {copiedId === `${activeTab}-ex-${idx}` ? (
                            <IconCheck size={14} className="text-glow-accent" />
                          ) : (
                            <IconCopy size={14} />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 space-y-3 border-t border-hairline/30 pt-6">
                <div className="flex items-center gap-2 font-sans text-sm font-bold text-glow-accent">
                  <IconHelpCircle size={18} />
                  <span>Smart Target Auto-Detection</span>
                </div>
                <p className="font-sans text-xs leading-relaxed text-text-muted sm:text-sm">
                  DSMT automatically detects if the{" "}
                  {activeTab === "export"
                    ? "source <src>"
                    : "destination <dst>"}{" "}
                  parameter is a Docker Volume or a local Host Bind Mount:
                </p>
                <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-1 rounded-lg border border-hairline bg-canvas p-4">
                    <span className="block font-sans text-xs font-bold tracking-wider text-text-primary uppercase">
                      Host Bind Mounts
                    </span>
                    <p className="font-sans text-[11px] text-text-muted sm:text-xs">
                      Any target containing folder separators (e.g.{" "}
                      <code className="font-mono text-[10px] text-text-primary">
                        /
                      </code>
                      ,{" "}
                      <code className="font-mono text-[10px] text-text-primary">
                        ./
                      </code>
                      , or windows paths like{" "}
                      <code className="font-mono text-[10px] text-text-primary">
                        C:\
                      </code>
                      ) is resolved as a host path.
                    </p>
                  </div>
                  <div className="space-y-1 rounded-lg border border-hairline bg-canvas p-4">
                    <span className="block font-sans text-xs font-bold tracking-wider text-text-primary uppercase">
                      Docker Volumes
                    </span>
                    <p className="font-sans text-[11px] text-text-muted sm:text-xs">
                      Single word or alphanumeric names are matched directly
                      against active Docker Volumes on the daemon.
                    </p>
                  </div>
                </div>
                <p className="mt-2 font-sans text-[11px] leading-relaxed text-text-muted sm:text-xs">
                  To override auto-detection and resolve naming ambiguity, use
                  explicit flags:{" "}
                  <code className="font-mono text-[10px] text-primary-accent">
                    -v, --volume
                  </code>{" "}
                  or{" "}
                  <code className="font-mono text-[10px] text-primary-accent">
                    -b, --bind
                  </code>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
