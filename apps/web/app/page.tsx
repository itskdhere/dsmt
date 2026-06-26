import Navbar from "@/components/navbar";
import Hero from "@/components/landing/hero";

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-canvas text-text-primary selection:bg-primary-accent/30 selection:text-text-primary">
      <Navbar />
      <main>
        <Hero />
      </main>
    </div>
  );
}
