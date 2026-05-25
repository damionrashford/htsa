import { Outlet } from "react-router";
import { Sidebar } from "./Sidebar";
import { DocsWelcome } from "./DocsWelcome";
import { border } from "@/lib/tokens";

export function DocsLayout() {
  return (
    <div className="flex min-h-[calc(100vh-56px)]">
      {/* Sidebar */}
      <aside
        className="hidden md:block w-60 shrink-0 border-r overflow-y-auto sticky top-14 max-h-[calc(100vh-56px)]"
        style={{ borderColor: border, backgroundColor: "var(--color-paper)" }}
      >
        <Sidebar />
      </aside>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <Outlet />
      </div>
    </div>
  );
}

export function DocsIndex() {
  return <DocsWelcome />;
}
