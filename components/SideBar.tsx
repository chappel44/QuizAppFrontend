"use client";

import React, { useEffect, useState } from "react";
import { List, X } from "lucide-react";

interface SidebarProps {
  open: boolean; // desktop sidebar
  children: React.ReactNode;
}

export function Sidebar({ open, children }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close the drawer with Escape
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMobileOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  return (
    <>
      <aside
        id="topic-sidebar"
        aria-hidden={!open}
        className={`hidden md:block shrink-0 self-start sticky top-4
          transition-all duration-300 ease-in-out
          ${open ? "w-64 mr-4 opacity-100" : "w-0 mr-0 opacity-0"}`}
      >
        <div
          className={`w-64 max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain
            rounded-lg border border-gray-100 bg-white p-4 shadow
            ${open ? "" : "invisible"}`}
        >
          {children}
        </div>
      </aside>

      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        aria-label="Open question navigation"
        aria-expanded={mobileOpen}
        aria-controls="topic-sidebar-mobile"
        className="md:hidden fixed bottom-15 right-4 z-40 flex h-12 w-12 items-center justify-center
          rounded-full bg-blue-600 text-white shadow-lg transition-transform active:scale-95
          focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
      >
        <List className="h-6 w-6" />
      </button>

      <div
        className={`md:hidden fixed inset-0 z-50 transition-opacity duration-300
          ${mobileOpen ? "opacity-100" : "pointer-events-none invisible opacity-0"}`}
        aria-hidden={!mobileOpen}
      >
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => setMobileOpen(false)}
        />

        <div
          id="topic-sidebar-mobile"
          role="dialog"
          aria-modal="true"
          aria-label="Question navigation"
          className={`absolute inset-x-0 bottom-0 max-h-[70dvh] overflow-y-auto overscroll-contain
            rounded-t-2xl bg-white p-4 shadow-xl transition-transform duration-300 ease-out
            ${mobileOpen ? "translate-y-0" : "translate-y-full"}`}
        >
          <div className="mb-3 flex items-center justify-end">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close question navigation"
              className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div
            onClick={(e) => {
              if ((e.target as HTMLElement).closest("button, a")) setMobileOpen(false);
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </>
  );
}