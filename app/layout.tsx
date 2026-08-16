import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.mydigitalskills.in"),
  title: {
    default: "MyDigitalSkills | Digital Growth by Lambodar Patra",
    template: "%s | MyDigitalSkills",
  },
  description:
    "Digital marketing, Meta Ads, websites, GMB and business growth solutions by Lambodar Patra in Noida, India.",
  keywords: [
    "Lambodar Patra",
    "digital marketing consultant Noida",
    "Meta Ads expert",
    "website development",
    "Google Business Profile expert",
    "business growth consultant",
  ],
  other: { "codex-preview": "development" },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "MyDigitalSkills",
    title: "MyDigitalSkills | Digital Growth by Lambodar Patra",
    description: "Digital marketing, websites, Meta Ads, GMB, AI learning and business growth resources.",
    url: "https://www.mydigitalskills.in",
    images: [{ url: "/images/lambodar-digital.png", width: 1024, height: 1024, alt: "Lambodar Patra - MyDigitalSkills" }],
  },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/images/favicon.png", shortcut: "/images/favicon.png", apple: "/images/favicon.png" },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "MyDigitalSkills",
  founder: { "@type": "Person", name: "Lambodar Patra" },
  areaServed: "India",
  address: { "@type": "PostalAddress", addressLocality: "Noida", addressCountry: "IN" },
  telephone: "+91-8128729003",
  email: "connect@mydigitalskills.in",
  sameAs: ["https://www.instagram.com/mydigitalskills.in/"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
      </body>
    </html>
  );
}
