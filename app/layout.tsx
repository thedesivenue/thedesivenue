import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { bodoniModa, inter } from "@/lib/fonts";
import { AuthHashHandler } from "@/components/AuthHashHandler";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.thedesivenue.com"),
  title: {
    default: "The Desi Venue · Find the Perfect Indian Event Venue in NJ",
    template: "The Desi Venue · %s",
  },
  description:
    "The Desi Venue is New Jersey's platform for finding the perfect venue for your Indian event. Filter by mandap space, fire ceremony clearance, vegetarian kitchens and baraat access, compare real pricing up front, and inquire directly. No middleman, no booking fees.",
  keywords: [
    "Indian wedding venues New Jersey",
    "South Asian event venues NJ",
    "mandap venue",
    "Indian banquet hall NJ",
  ],
  openGraph: {
    title: "The Desi Venue · Find the Perfect Indian Event Venue in NJ",
    description:
      "Mandap-ready halls, cultural filters, transparent pricing. Find the perfect venue for your Indian event in New Jersey.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Desi Venue · Find the Perfect Indian Event Venue in NJ",
    description:
      "Mandap-ready halls, cultural filters, transparent pricing. Find the perfect venue for your Indian event in New Jersey.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bodoniModa.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthHashHandler />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
