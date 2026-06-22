import { useEffect } from "react";
import { RouterProvider } from "react-router";
import { router } from "./routes";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  useEffect(() => {
    const applyTheme = () => {
      const theme = localStorage.getItem("theme") || "light";
      const root = document.documentElement;
      if (theme === "dark") {
        root.classList.add("dark");
      } else if (theme === "light") {
        root.classList.remove("dark");
      } else if (theme === "auto") {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (prefersDark) root.classList.add("dark");
        else root.classList.remove("dark");
      }
    };

    applyTheme();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "theme") applyTheme();
    };
    window.addEventListener("storage", handleStorageChange);
    const handleThemeChange = () => applyTheme();
    window.addEventListener("themeChange", handleThemeChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("themeChange", handleThemeChange);
    };
  }, []);

  return (
    <>
      {/* MARKER-MAKE-KIT-INVOKED */}
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}
