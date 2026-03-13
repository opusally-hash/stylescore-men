import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
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
        url: "/og-image.png",
        width: 1200,
        height: 630,
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