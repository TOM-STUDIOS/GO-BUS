import { createContext, useContext } from "react";

export type TransportMode = "bus" | "metro" | "routes";

export interface TransportTheme {
  mode: TransportMode;
  setMode: (mode: TransportMode) => void;
  primary: string;
  gradient: string;
  gradientFrom: string;
  gradientTo: string;
  light: string;
  darkLight: string;
}

export const themeMap: Record<TransportMode, Omit<TransportTheme, "mode" | "setMode">> = {
  bus: {
    primary: "#1a56db",
    gradient: "bg-[#1a56db]",
    gradientFrom: "#1a56db",
    gradientTo: "#1a56db",
    light: "bg-red-50",
    darkLight: "dark:bg-red-900/30",
  },
  metro: {
    primary: "#1a56db",
    gradient: "from-[#1a56db] to-[#1E88E5]",
    gradientFrom: "#1a56db",
    gradientTo: "#1E88E5",
    light: "bg-blue-50",
    darkLight: "dark:bg-blue-900/30",
  },
  routes: {
    primary: "#6D28D9",
    gradient: "from-[#6D28D9] to-[#7C3AED]",
    gradientFrom: "#6D28D9",
    gradientTo: "#7C3AED",
    light: "bg-purple-50",
    darkLight: "dark:bg-purple-900/30",
  },
};

export const TransportThemeContext = createContext<TransportTheme>({
  mode: "bus",
  setMode: () => {},
  ...themeMap.bus,
});

export const useTransportTheme = () => useContext(TransportThemeContext);
