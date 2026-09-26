import type { Metadata } from "next";
import "./globals.css";
import "./universe.css";
export const metadata: Metadata = {
  title: "OurVerse · A little universe for Josh",
  description:
    "Our memories, our little adventures, and all the love in between.",
  robots: { index: false, follow: false },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
