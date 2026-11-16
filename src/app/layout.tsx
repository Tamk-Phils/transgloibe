import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import BackToTop from "@/components/BackToTop";
import NavigationLoader from "@/components/NavigationLoader";
import WhatsAppWidget from "@/components/WhatsAppWidget";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: {
    default: "Transglobe Logistics | Global Freight & Package Tracking",
    template: "%s | Transglobe Logistics"
  },
  description: "Global logistics, express air transit, ocean freight, and real-time package tracking. Fast, secure delivery with Transglobe Logistics.",
  keywords: ["package tracking", "transglobelogistics shipping", "transglobelogistics", "shipping company", "express delivery", "global freight", "cargo tracking"],
  authors: [{ name: "Transglobe Logistics Team" }],
  creator: "Transglobe Logistics",
  publisher: "Transglobe Logistics",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://transglobelogistics.org"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Transglobe Logistics | Global Freight & Package Tracking",
    description: "Global logistics, express air transit, ocean freight, and real-time package tracking. Fast, secure delivery with Transglobe Logistics.",
    url: "https://transglobelogistics.org",
    siteName: "Transglobe Logistics",
    images: [
      {
        url: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=1200",
        width: 1200,
        height: 630,
        alt: "Transglobe Logistics",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Transglobe Logistics | Global Freight & Package Tracking",
    description: "Global logistics, express air transit, ocean freight, and real-time package tracking with Transglobe Logistics.",
    images: ["https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=1200"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LogisticsService",
  "name": "Transglobe Logistics",
  "url": "https://transglobelogistics.org",
  "logo": "https://transglobelogistics.org/favicon.ico",
  "description": "Global freight forwarding, air transit, and real-time package tracking portal.",
  "email": "info@transglobelogistics.org",
  "sameAs": [
    "https://transglobelogistics.org"
  ],
  "areaServed": "Worldwide"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans bg-background text-foreground shrink-0">
        <div className="min-h-screen flex flex-col relative overflow-x-hidden">
          <NavigationLoader />
          <Header />
          <main className="flex-1 relative z-10">
            {children}
          </main>
          <Footer />
          <ChatWidget />
          <WhatsAppWidget />
          <BackToTop />
        </div>
      </body>
    </html>
  );
}
