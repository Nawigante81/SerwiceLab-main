import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

interface ThemeProviderProps {
  children: React.ReactNode;
  attribute?: "class";
  defaultTheme?: string;
  enableSystem?: boolean;
}

const ThemeProvider = ({
  children,
  attribute = "class",
  defaultTheme = "dark",
  enableSystem = false,
}: ThemeProviderProps) => (
  <NextThemesProvider attribute={attribute} defaultTheme={defaultTheme} enableSystem={enableSystem}>
    {children}
  </NextThemesProvider>
);

export default ThemeProvider;
