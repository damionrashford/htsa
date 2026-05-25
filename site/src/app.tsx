import { createRoot } from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router";
import { ThemeProvider } from "@/lib/ThemeContext";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Algorithm from "./pages/Algorithm";
import MathPage from "./pages/Math";
import Engine from "./pages/Engine";
import { DocsLayout, DocsIndex } from "./pages/Docs";
import { DocPage } from "./pages/Docs/DocPage";
import Blog from "./pages/Blog";
import { BlogPost } from "./pages/Blog/BlogPost";

const router = createHashRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "algorithm", element: <Algorithm /> },
      { path: "math", element: <MathPage /> },
      { path: "engine", element: <Engine /> },
      {
        path: "docs",
        element: <DocsLayout />,
        children: [
          { index: true, element: <DocsIndex /> },
          { path: ":slug", element: <DocPage /> },
        ],
      },
      { path: "blog", element: <Blog /> },
      { path: "blog/:slug", element: <BlogPost /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <RouterProvider router={router} />
  </ThemeProvider>
);
