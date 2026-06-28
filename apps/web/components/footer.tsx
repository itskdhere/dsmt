export default function Footer() {
  return (
    <footer className="border-t border-hairline/60 bg-canvas py-6">
      <div className="flex items-center justify-center px-4">
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
      </div>
    </footer>
  );
}
