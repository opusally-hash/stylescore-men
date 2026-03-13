import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StyleScore – Find Your Style Score",
  description:
    "Take the 2-minute StyleScore test and discover your fashion strengths, weak spots, and what to improve first.",
  metadataBase: new URL("https://stylescore.live"),
  openGraph: {
    title: "Find Your StyleScore",
    description:
      "Take the 2-minute StyleScore test and get your style score, archetype, and top upgrades.",
    url: "https://stylescore.live",
    siteName: "StyleScore",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "StyleScore preview image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Find Your StyleScore",
    description:
      "Take the 2-minute StyleScore test and get your style score, archetype, and top upgrades.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
