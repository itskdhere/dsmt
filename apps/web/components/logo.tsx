export default function Logo() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-primary-accent drop-shadow-[0_0_8px_rgba(14,165,233,0.5)] transition-transform group-hover:scale-105"
    >
      <path d="M18 6L6 18" />
      <circle cx="18" cy="6" r="3" fill="#0EA5E9" className="animate-pulse" />
      <circle cx="6" cy="18" r="3" fill="#14B8A6" />
      <circle cx="12" cy="12" r="2" fill="#F8FAFC" />
    </svg>
  );
}
