import { Outlet, Link } from "react-router-dom";
import ThemeSwitch from "@/components/ThemeSwitch";
import SearchBar from "@/components/SearchBar";

export default function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 border-b border-[color:var(--pl-color-border)] bg-[color:var(--pl-color-surface)]/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-3">
          <Link to="/" className="text-lg font-semibold focus-ring">
            Playlink Games
          </Link>
          <div className="flex-1" />
          <SearchBar />
          <ThemeSwitch />
        </div>
      </header>
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
