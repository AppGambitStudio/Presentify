"use client";

import type { ThemeConfig } from "@/lib/types";
import { useMemo } from "react";

interface ThemeProviderProps {
  theme: ThemeConfig;
  children: React.ReactNode;
}

function buildGoogleFontsUrl(heading: string, body: string): string {
  const fonts = [heading, body]
    .filter((f, i, a) => a.indexOf(f) === i)
    .map((f) => `family=${f.replace(/ /g, "+")}:wght@300;400;500;600;700;800`)
    .join("&");
  return `https://fonts.googleapis.com/css2?${fonts}&display=swap`;
}

export function ThemeProvider({ theme, children }: ThemeProviderProps) {
  const cssVars = useMemo(
    () =>
      ({
        "--slide-primary": theme.primaryColor,
        "--slide-accent": theme.accentColor,
        "--slide-bg": theme.backgroundColor,
        "--slide-text": theme.textColor,
        "--slide-text-muted": theme.darkMode
          ? "rgba(255,255,255,0.5)"
          : "rgba(0,0,0,0.5)",
        "--slide-card-bg": theme.darkMode
          ? "rgba(255,255,255,0.05)"
          : "rgba(0,0,0,0.05)",
        "--slide-card-border": theme.darkMode
          ? "rgba(255,255,255,0.1)"
          : "rgba(0,0,0,0.1)",
        "--slide-font-heading": `'${theme.fontHeading}', sans-serif`,
        "--slide-font-body": `'${theme.fontBody}', sans-serif`,
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
      }) as React.CSSProperties,
    [theme]
  );

  const fontsUrl = useMemo(
    () => buildGoogleFontsUrl(theme.fontHeading, theme.fontBody),
    [theme.fontHeading, theme.fontBody]
  );

  return (
    <>
      <link rel="stylesheet" href={fontsUrl} />
      <div style={cssVars} className="w-full h-full">
        {children}
      </div>
    </>
  );
}
