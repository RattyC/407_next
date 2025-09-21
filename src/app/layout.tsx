import type { Metadata } from "next";
import { Merriweather, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { PortfolioProvider } from "@/lib/portfolioStore";
import Navbar from "@/components/Navbar";

const serif = Merriweather({
  variable: "--font-brand-serif",
  weight: ["300", "400", "700", "900"],
  subsets: ["latin"],
  display: "swap",
});

const sans = Source_Sans_3({
  variable: "--font-brand-sans",
  weight: ["300", "400", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Admissions Portal — TCAS Portfolio",
    template: "%s | Admissions Portal",
  },
  description: "Harvard-style admissions flow with portfolio, built on Next.js",
  metadataBase: new URL("https://example.com"),
  applicationName: "Admissions Portal",
  openGraph: {
    title: "Admissions Portal — TCAS Portfolio",
    description: "Harvard-inspired admissions application with portfolio upload.",
    url: "/",
    siteName: "Admissions Portal",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Admissions Portal",
    description: "Harvard-inspired admissions application with portfolio upload.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={`${serif.variable} ${sans.variable} antialiased bg-background text-foreground`}>
        <PortfolioProvider>
          <header className="w-full bg-background text-foreground border-b border-black/10 dark:border-white/10">
            <Navbar />
          </header>
          <main className="mx-auto max-w-5xl p-4 sm:p-6">{children}</main>
        </PortfolioProvider>
      </body>
    </html>
  );
}
