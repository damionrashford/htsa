import { Outlet, useLocation } from "react-router";
import { useEffect } from "react";
import { Nav } from "./Nav";
import { Footer } from "./Footer";

export default function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#080d1a", color: "#dce4f5" }}>
      <Nav />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
