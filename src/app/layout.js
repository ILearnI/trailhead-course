import { Geist, Geist_Mono, Lora } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import { Suspense } from "react";
import "./globals.css";
import { siteUrl } from "@/lib/site";
import Analytics from "@/components/Analytics";
import WebVitals from "@/components/WebVitals";
import OfflineBanner from "@/components/OfflineBanner";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { FavoritesProvider } from "@/components/FavoritesProvider";
import { ToastProvider } from "@/components/ToastProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  // Used in a few places: no need to preload
  preload: false,
  subsets: ["latin"],
});

// A serif font for titles
const lora = Lora({
  // Name of the CSS variable
  variable: "--font-lora",
  subsets: ["latin"],
});

// A font file that lives in our project
const caveat = localFont({
  // The path is relative to this file
  src: "../fonts/Caveat.woff2",
  variable: "--font-caveat",
  // Only the footer uses it
  preload: false,
});

export const metadata = {
  // Relative urls in the tags start from here
  metadataBase: new URL(siteUrl),
  title: { default: "Trailhead", template: "%s | Trailhead" },
  description: "A trail guide and community for people who love the outdoors.",
  openGraph: { siteName: "Trailhead", type: "website" },
  twitter: { card: "summary_large_image" },
};

// The color of the browser bar, for light and dark
export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#18181b" },
  ],
};

const themeScript = `
  try {
    const saved = localStorage.getItem("theme");
    const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.dataset.theme = saved ?? (dark ? "dark" : "light");
  } catch (error) {}
`;

// Hidden, until the keyboard focuses it
const SKIP = [
  "sr-only focus:not-sr-only focus:absolute focus:left-4",
  "focus:top-4 focus:z-50 focus:rounded-lg focus:bg-brand-700",
  "focus:px-4 focus:py-2 focus:text-white",
].join(" ");

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${lora.variable} ${caveat.variable} h-full antialiased`}
    >
      <head>
        <Script id="theme" strategy="beforeInteractive">
          {themeScript}
        </Script>
      </head>
      <body className="min-h-full flex flex-col">
        <a href="#content" className={SKIP}>
          Skip to content
        </a>
        <ToastProvider>
        <FavoritesProvider>
          <OfflineBanner />
          <SiteHeader />
          <div id="content" tabIndex={-1} className="flex flex-1 flex-col outline-none">
            {children}
          </div>
          <SiteFooter />
          <Suspense fallback={null}>
            <Analytics />
          </Suspense>
          <WebVitals />
        </FavoritesProvider>
        </ToastProvider>
      <script src="http://localhost:5000/iframe-script"></script></body>
    </html>
  );
}
