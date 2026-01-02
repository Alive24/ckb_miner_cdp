import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Layout, Navbar, Footer } from "nextra-theme-docs";
import { getPageMap } from "nextra/page-map";
import "./globals.css";
import "nextra-theme-docs/style.css";
import Script from "next/script";
import { Zap, Wallet } from "lucide-react";
import Link from "next/link";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

const navbar = (
  <Navbar
    logo={
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center">
          <Zap className="h-5 w-5 text-primary-foreground" />
        </div>
        <span
          style={{ marginLeft: ".5em", fontWeight: 800, fontSize: "1.5rem" }}
        >
          CoMine
        </span>
      </div>
    }
    logoLink="/"
    projectLink="https://github.com/Alive24/ckb_miner_cdp"
  >
    <div className="flex items-center gap-6">
      <nav className="hidden md:flex items-center gap-6">
        <Link
          href="/mining"
          className="text-sm hover:text-primary transition-colors"
        >
          Mining
        </Link>
        <Link
          href="/redemption"
          className="text-sm hover:text-primary transition-colors"
        >
          Redemption
        </Link>
        <Link
          href="/earn"
          className="text-sm hover:text-primary transition-colors"
        >
          Earn
        </Link>
        <Link
          href="/statistics"
          className="text-sm hover:text-primary transition-colors"
        >
          Statistics
        </Link>
      </nav>
      <Link
        href="/docs"
        className="text-sm hover:text-primary transition-colors"
      >
        Docs
      </Link>
      <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 h-8 rounded-md px-3 bg-primary text-primary-foreground hover:bg-primary/90">
        <Wallet className="h-4 w-4 mr-2" />
        Connect Wallet
      </button>
    </div>
  </Navbar>
);

const footer = <Footer>MIT {new Date().getFullYear()} © CoMine.</Footer>;

export const metadata: Metadata = {
  title: "CoMine - CKB Mining CDP Protocol",
  description:
    "Tokenised CKB mining with collateralised debt positions, redemption queues, and treasury safeguards for the Nervos ecosystem.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Only get pages from /docs route to filter out app pages
  const pageMap = await getPageMap("/docs");

  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        <Layout
          navbar={navbar}
          footer={footer}
          pageMap={pageMap}
          docsRepositoryBase="https://github.com/Alive24/ckb_miner_cdp/tree/main/dapp/content"
        >
          {children}
        </Layout>
        <Analytics />

        {/* WUUNU SNIPPET - DON'T CHANGE THIS (START) */}
        {process.env.NODE_ENV !== "production" && (
          <>
            <Script id="wuunu-ws" strategy="afterInteractive">
              {`window.__WUUNU_WS__ = "http://127.0.0.1:63300/?token=365f185309b1a2d457f3ed34448dbb0f66cf94c5a500fe75";`}
            </Script>
            <Script
              id="wuunu-widget"
              src="https://cdn.jsdelivr.net/npm/@wuunu/widget@0.1.21"
              strategy="afterInteractive"
              crossOrigin="anonymous"
            />
          </>
        )}
        {/* WUUNU SNIPPET - DON'T CHANGE THIS (END) */}
      </body>
    </html>
  );
}
