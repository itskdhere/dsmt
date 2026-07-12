import { IconBrandGithub, IconBrandNpm } from "@tabler/icons-react";

export default function Footer() {
  return (
    <footer className="border-t border-hairline/60 bg-canvas py-6">
      <div className="flex flex-col items-center justify-center px-4">
        <p className="font-sans text-sm text-text-muted">
          Built with{" "}
          <a
            href="https://go.itskdhere.com/rr"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary-accent hover:underline"
          >
            🐳
          </a>{" "}
          by{" "}
          <a
            href="https://itskdhere.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary-accent hover:underline"
          >
            itskdhere
          </a>
        </p>

        <div className="mt-1 flex items-center justify-center gap-1.5 text-text-muted">
          <a
            href="https://github.com/itskdhere/dsmt"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-0.5"
          >
            <IconBrandGithub size={14} />
            <p className="font-sans text-sm underline underline-offset-1">
              itskdhere/dsmt
            </p>
          </a>
          <p>|</p>
          <a
            href="https://www.npmjs.com/package/dsmt"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1"
          >
            <IconBrandNpm size={20} className="translate-y-px" />
            <p className="font-sans text-sm underline underline-offset-1">
              dsmt
            </p>
          </a>
        </div>
      </div>
    </footer>
  );
}
