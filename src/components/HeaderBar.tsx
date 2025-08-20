import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import ThemeSwitch from "@/components/ThemeSwitch";
import s from "./HeaderBar.module.scss";
import { useRef, useState } from "react";
import MobileFilterDrawer from "@/components/MobileFilterDrawer";

export default function HeaderBar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  return (
    <div className={s.rail}>
      <div className={`${s.container} ${s.left}`}>
        <Link to="/" className="focus-ring" aria-label="Playlink home">
          <Logo className="h-6 w-auto text-[color:var(--pl-color-text)]" />
        </Link>
        <nav className={s.nav} aria-label="Primary">
          <a
            href="https://playlink.com"
            target="_blank"
            rel="noreferrer"
            className={`${s.link} link-underlined focus-ring`}
          >
            Home
          </a>
          <Link to="/games" className={`${s.link} link-underlined focus-ring`}>
            Games
          </Link>
        </nav>
      </div>
      <div className={`${s.container} ${s.right}`}>
        <ThemeSwitch />
      </div>

      {/* Mobile floating button to open filter drawer */}
      <button
        type="button"
        className={`${s.fab} md:hidden focus-ring`}
        aria-label="Open filters"
        onClick={() => setDrawerOpen(true)}
        ref={triggerRef}
      >
        Filters
      </button>

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
