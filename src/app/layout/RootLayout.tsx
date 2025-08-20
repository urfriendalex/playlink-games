import { Outlet, Link } from "react-router-dom";
import ThemeSwitch from "@/components/ThemeSwitch";
import SearchBar from "@/components/SearchBar";
import { useState, useRef } from "react";
import MobileFilterDrawer from "@/components/MobileFilterDrawer";

export default function RootLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 border-b border-[color:var(--pl-color-border)] bg-[color:var(--pl-color-surface)]/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-3">
          <Link to="/" className="text-lg font-semibold focus-ring">
            Playlink Games
          </Link>
          <div className="flex-1" />
          <button
            type="button"
            className="btn focus-ring md:hidden"
            onClick={() => setDrawerOpen(true)}
            ref={triggerRef}
            aria-haspopup="dialog"
            aria-expanded={drawerOpen}
          >
            Filters
          </button>
          <SearchBar />
          <ThemeSwitch />
        </div>
      </header>
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-6">
        <Outlet />
      </main>
      <MobileFilterDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          triggerRef.current?.focus();
        }}
        labelledById="mobile-filters-title"
      />
    </div>
  );
}
