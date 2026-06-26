import Navbar from "@/components/navbar";

export default function Page() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-canvas text-text-primary selection:bg-primary-accent/30 selection:text-text-primary">
      <Navbar />
    </div>
  );
}
