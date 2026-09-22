"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function Search() {

    //use states are used to find when the user inputs data into the search field
    const [query, setquery ] = useState("");

    //route based on what the user typed
    const router = useRouter();

    //runs when the search form is submitted with trim to stop any extra spaces and blanks
    //then pushes the route based on user input
    const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search/${encodeURIComponent(query.trim())}`);
    }
  };

    return (
        <header className="blog-header">
            <Link href="/">FullStack Blog</Link>

             <form className="blog-search-wrap" onSubmit={handleSearchSubmit}>
        <svg className="blog-search-icon" aria-hidden="true" viewBox="0 0 24 24">
          <g>
            <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z" />
          </g>
        </svg>
        <input
          placeholder="Search"
          type="search"
          className="blog-search-input"
          value={query}
          onChange={(e) => setquery(e.target.value)}
        />
      </form>

      <ThemeToggle />
    </header>
  );
}

export function ThemeToggle() {
  // Read localStorage ONCE, during first render, on the client.
  // Returns false on the server (typeof window === "undefined").
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      return localStorage.getItem("theme") === "dark";
    } catch {
      return false;
    }
  });

  // Track whether we're mounted so we don't render a stale label before hydration.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Apply the class whenever isDark changes (including the very first client render).
  useEffect(() => {
    document.body.classList.toggle("dark-mode", isDark);
  }, [isDark]);

  // Persist ONLY when the user actually toggles — not on mount.
  function toggle() {
    setIsDark((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("theme", next ? "dark" : "light");
      } catch {
        // do nothing
      }
      return next;
    });
  }

  return (
    <button
      type="button"
      className="theme-button"
      aria-label="Toggle theme"
      onClick={toggle}
    >
      {mounted ? (isDark ? "Light Mode" : "Dark Mode") : "Dark Mode"}
    </button>
  );
}