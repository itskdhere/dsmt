"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { IconBrandGithub, IconMenu2, IconX } from "@tabler/icons-react";
import logo from "@/assets/logo.svg";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Demo", href: "#demo" },
    { name: "Install", href: "#install" },
    { name: "Docs", href: "#docs" },
  ];

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        mobileMenuOpen
          ? "bg-canvas/95 py-3 backdrop-blur-lg"
          : scrolled
            ? "border-b border-hairline bg-canvas/85 py-3 backdrop-blur-md"
            : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-12 items-center justify-between">
          <div className="flex items-center gap-3">
            <a
              href="#"
              onClick={() => setMobileMenuOpen(false)}
              className="group flex items-center gap-2.5"
            >
              <Image src={logo} alt="DSMT" width={26} height={26} />
              <span className="font-sans text-xl font-bold tracking-tight text-text-primary">
                DSMT
              </span>
            </a>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-text-muted transition-colors duration-200 hover:text-text-primary"
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-4 md:flex">
            <a
              href="https://github.com/itskdhere/dsmt"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 items-center gap-2 rounded-md border border-hairline bg-surface-1/80 px-4 text-sm font-medium text-text-primary transition-all hover:bg-surface-2"
            >
              <IconBrandGithub size={15} />
              <span>Repo</span>
            </a>
            {/* <a
              href="#install"
              className="flex h-9 items-center gap-1.5 rounded-md bg-primary-accent px-4 text-sm font-semibold text-canvas shadow-[0_0_15px_rgba(14,165,233,0.2)] transition-all hover:bg-primary-accent/90 hover:shadow-[0_0_20px_rgba(14,165,233,0.4)]"
            >
              <IconDownload size={15} />
              <span>Install</span>
            </a> */}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-md border border-transparent p-2 text-text-muted transition-all hover:border-hairline hover:bg-surface-1 hover:text-text-primary"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <IconX size={20} /> : <IconMenu2 size={20} />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="absolute top-full right-0 left-0 z-40 animate-in border-b border-hairline bg-canvas/95 px-6 py-4 backdrop-blur-lg duration-200 fade-in slide-in-from-top-2 md:hidden">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 text-base font-medium text-text-muted transition-colors hover:text-text-primary"
              >
                {link.name}
              </a>
            ))}
            <hr className="my-2 border-hairline" />
            <div className="flex flex-col gap-3 pt-1">
              <a
                href="https://github.com/itskdhere/dsmt"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-md border border-hairline bg-surface-1 py-2.5 text-sm font-medium text-text-primary transition-all"
              >
                <IconBrandGithub size={16} />
                <span>Repository</span>
              </a>
              {/* <a
                href="#install"
                onClick={() => setMobileMenuOpen(false)}
                className="flex w-full items-center justify-center gap-1.5 rounded-md bg-primary-accent py-2.5 text-sm font-semibold text-canvas shadow-[0_0_15px_rgba(14,165,233,0.2)] transition-all"
              >
                <IconDownload size={16} />
                <span>Install</span>
              </a> */}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
