import { createRoot } from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Algorithm from "./pages/Algorithm";
import MathPage from "./pages/Math";
import Engine from "./pages/Engine";
import { DocsLayout, DocsIndex } from "./pages/Docs";
import { DocPage } from "./pages/Docs/DocPage";

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
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
