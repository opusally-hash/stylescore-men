import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  verification: { google: "H0SH3hnxkTAqXoR5__j3y9Rc4xpRsFgZzuADypzwHuw" ,
  other:{
    "p:domain_verify" :"a5cc47c8747a86255bef6fed44d0a073",
  },
},
  title: "StyleScore for Men – Find Your Style Score Online",
  description:
    "Take the 2-minute StyleScore test to discover your fashion strengths, weak spots, and the exact upgrades that will improve your look fastest.",
  metadataBase: new URL("https://stylescore.live"),
  openGraph: {
    title: "StyleScore for Men – Find Your Style Score Online",
    description:
      "Take the 2-minute StyleScore test to discover your fashion strengths, weak spots, and the exact upgrades that will improve your look fastest.",
    url: "https://stylescore.live",
    siteName: "StyleScore",
    images: [
      {
        url: "/og-image-share.png",
        width: 1368,
        height: 768,
        alt: "StyleScore for Men social preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "StyleScore for Men – Find Your Style Score Online",
    description:
      "Take the 2-minute StyleScore test to discover your fashion strengths, weak spots, and the exact upgrades that will improve your look fastest.",
    images: ["/og-image-share.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-K6WM7Q9F5M"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-K6WM7Q9F5M');
          `}
        </Script>
      </body>
    </html>
  );
}
