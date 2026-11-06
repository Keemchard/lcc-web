import type { Metadata, Viewport } from "next";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import { Poppins } from "next/font/google";
import "./globals.scss";
import "leaflet/dist/leaflet.css";
import Navigation from "@/components/Nav/Navigation";

config.autoAddCss = false;

export const siteUrl = "https://lcc-web.vercel.app";

const bodyFont = Poppins({
  subsets: ["latin"],
  variable: "--font-body",
  weight: "100",
});

const headingFont = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
});

export const viewport: Viewport = {
  themeColor: "#0b1f33",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Livingwater Community Church — Tanza, Cavite",
    template: "%s | Livingwater Community Church",
  },
  description:
    "Welcome to Livingwater Community Church in Tanza, Cavite. Join us for Sunday Service at 8:00 AM and weekly Prayer Meeting every Wednesday at 7:30 PM. Love God. Love people. Make disciples.",
  keywords: [
    "Livingwater Community Church",
    "LCC Church Tanza",
    "church in Tanza Cavite",
    "Christian church Cavite",
    "Sunday worship service Tanza",
    "prayer meeting Cavite",
    "evangelical church Philippines",
    "church near me Cavite",
    "Rev Raffy Salvador",
    "Rev Robert De Guzman",
    "Bukal Road Tanza",
  ],
  authors: [{ name: "Livingwater Community Church", url: siteUrl }],
  creator: "Livingwater Community Church",
  publisher: "Livingwater Community Church",
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_PH",
    url: "/",
    siteName: "Livingwater Community Church",
    title: "Livingwater Community Church — Tanza, Cavite",
    description:
      "A Christ-centered church in Tanza, Cavite. Sunday Service at 8:00 AM · Prayer Meeting every Wednesday 7:30 PM. Love God. Love people. Make disciples.",
    images: [
      {
        url: "/images/hero-bg.jpg",
        width: 1200,
        height: 630,
        alt: "Livingwater Community Church — worship service",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Livingwater Community Church — Tanza, Cavite",
    description:
      "A Christ-centered church in Tanza, Cavite. Sunday Service at 8:00 AM · Prayer Meeting every Wednesday 7:30 PM.",
    images: ["/images/hero-bg.jpg"],
    creator: "@LivingwaterChurch",
    site: "@LivingwaterChurch",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bodyFont.variable} ${headingFont.variable}`}>
      <body>
        <Navigation />
        {children}
      </body>
    </html>
  );
}
