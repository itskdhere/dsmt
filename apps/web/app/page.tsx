import Navbar from "@/components/navbar";
import Hero from "@/components/landing/hero";
import Installation from "@/components/landing/installation";
import Footer from "@/components/footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-canvas text-text-primary selection:bg-primary-accent/30 selection:text-text-primary">
      <Navbar />
      <main>
        <Hero />
        <Installation />
      </main>
      <Footer />
    </div>
  );
}
