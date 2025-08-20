import { Outlet } from "react-router-dom";
import HeaderBar from "@/components/HeaderBar";

export default function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 ">
        <div className="mx-auto max-w-6xl px-4 py-3">
          <HeaderBar />
        </div>
      </header>
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
