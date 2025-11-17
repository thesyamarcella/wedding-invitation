import "./globals.css";
import { Playfair_Display, Tenor_Sans, Parisienne } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-header",
});

const tenor = Tenor_Sans({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-body",
});

const parisienne = Parisienne({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-script",
});

export const metadata = {
  title: "Lana 𖹭 Thesya Wedding",
  description: "Wedding Invitation — 30 November 2025",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${tenor.variable} ${parisienne.variable} bg-[var(--bg)] text-[var(--text)]`}
      >
        {children}
      </body>
    </html>
  );
}
