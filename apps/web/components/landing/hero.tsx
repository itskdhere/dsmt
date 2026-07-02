import { IconDownload, IconBook } from "@tabler/icons-react";

export interface HeroProps {
  latestVersion?: string;
}

export default function HeroSection({ latestVersion }: HeroProps) {
  return (
    <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-canvas pt-32 pb-16">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute top-1/4 left-1/4 h-125 w-125 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-secondary-accent/15 blur-[120px]"
          style={{ animationDuration: "10s" }}
        />
        <div
          className="absolute top-1/3 right-1/4 h-100 w-100 translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-primary-accent/15 blur-[140px]"
          style={{ animationDuration: "15s", animationDelay: "-5s" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        {latestVersion && (
          <div className="animate-fade-in mb-8 inline-flex items-center gap-2 rounded-full border border-hairline bg-surface-1 px-3 py-1">
            {/* <span className="h-1.5 w-1.5 animate-ping rounded-full bg-glow-accent" /> */}
            <span className="font-mono text-xs font-semibold tracking-wider text-glow-accent">
              {latestVersion} Released
            </span>
            {/* <span className="text-xs font-medium text-text-muted">|</span> */}
          </div>
        )}

        <h1 className="mx-auto mb-6 max-w-4xl font-sans text-4xl leading-[1.1] font-extrabold tracking-[-0.04em] text-text-primary sm:text-6xl lg:text-7xl">
          Docker Storage Migration. <br className="hidden sm:inline" />
          <span className="bg-linear-to-r from-primary-accent to-glow-accent bg-clip-text text-transparent drop-shadow-[0_2px_15px_rgba(14,165,233,0.25)]">
            Fast. Isolated. Reliable.
          </span>
        </h1>

        <p className="mx-auto mb-10 max-w-4xl font-sans text-lg leading-relaxed font-normal text-text-muted sm:text-xl">
          Import and Export Docker Volumes and Bind Mounts on Windows, macOS,
          and Linux.
          <br />
          Running directly over the native Docker socket with zero external host
          dependencies.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#installation"
            className="group flex transform items-center justify-center gap-2 rounded-full bg-primary-accent px-8 py-3.5 font-sans text-base font-bold text-canvas shadow-[0_0_20px_rgba(14,165,233,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-accent/90 hover:shadow-[0_0_30px_rgba(14,165,233,0.45)]"
          >
            <IconDownload size={18} />
            <span>Install CLI</span>
          </a>
          <a
            href="#docs"
            className="flex transform items-center justify-center gap-2 rounded-full border border-hairline bg-surface-1 px-8 py-3.5 font-sans text-base font-bold text-text-primary transition-all duration-300 hover:-translate-y-0.5 hover:border-primary-accent/30 hover:bg-surface-2 hover:text-text-primary"
          >
            <IconBook size={18} />
            <span>View Docs</span>
          </a>
        </div>

        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-x-4 gap-y-6 border-t border-hairline/60 pt-8 md:grid-cols-3">
          <div className="text-center">
            <div className="font-mono text-2xl font-bold tracking-tight text-text-primary">
              3+ Engines
            </div>
            <div className="mt-1 font-sans text-sm text-text-muted">
              Docker, Podman, Colima etc.
            </div>
          </div>
          <div className="text-center">
            <div className="font-mono text-2xl font-bold tracking-tight text-text-primary">
              Sudo-Free
            </div>
            <div className="mt-1 font-sans text-sm text-text-muted">
              No elevated privileges required
            </div>
          </div>
          <div className="col-span-2 text-center md:col-span-1">
            <div className="font-mono text-2xl font-bold tracking-tight text-text-primary">
              Cross-Platform
            </div>
            <div className="mt-1 font-sans text-sm text-text-muted">
              Windows, macOS, Linux Parity
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
