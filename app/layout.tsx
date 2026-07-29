import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Lumen — Meaningful filenames for Mac",
    template: "%s — Lumen",
  },
  description:
    "Lumen proposes clean filenames for supported documents and opted-in photos, then lets you approve every change. Free, local-first and built for macOS.",
  applicationName: "Lumen",
  authors: [{ name: "Kudige Panduranga Shenoy" }],
  creator: "Kudige Panduranga Shenoy",
  category: "productivity",
  keywords: [
    "Mac file renamer",
    "document renamer",
    "photo renamer",
    "local AI",
    "batch rename",
    "macOS freeware",
  ],
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/lumen-icon.png",
  },
  openGraph: {
    type: "website",
    siteName: "Lumen",
    title: "Lumen — Meaningful filenames for Mac",
    description:
      "Turn supported documents and opted-in photos into clean, consistent filenames — locally by default, with every change under your control.",
  },
  twitter: {
    card: "summary",
    title: "Lumen — Meaningful filenames for Mac",
    description:
      "Turn supported documents and opted-in photos into clean, consistent filenames.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f7f4ee",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-AU">
      <body>{children}</body>
    </html>
  );
}
