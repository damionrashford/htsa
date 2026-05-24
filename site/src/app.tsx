import { createRoot } from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Algorithm from "./pages/Algorithm";
import MathPage from "./pages/Math";
import Engine from "./pages/Engine";
import Compare from "./pages/Compare";

const router = createHashRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "algorithm", element: <Algorithm /> },
      { path: "math", element: <MathPage /> },
      { path: "engine", element: <Engine /> },
      { path: "compare", element: <Compare /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
