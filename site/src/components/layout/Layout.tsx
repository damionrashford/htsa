import { Outlet, useLocation } from "react-router";
import { useEffect } from "react";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { useTheme } from "@/lib/ThemeContext";

export default function Layout() {
  const { pathname } = useLocation();
  useTheme(); // ensures ThemeProvider is mounted and data-theme is applied

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "var(--color-paper)", color: "var(--color-fg)" }}
    >
      <Nav />
      <main id="main-content" className="flex-1" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
