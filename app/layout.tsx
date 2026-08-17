import type { Metadata } from "next";
import { bodoniModa, inter } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://thedesivenue.vercel.app"),
  title: {
    default: "The Desi Venue — Indian Wedding & Event Venues in New Jersey",
    template: "%s · The Desi Venue",
  },
  description:
    "New Jersey's directory of Indian-event-ready venues. Filter by mandap space, fire ceremony clearance, vegetarian kitchens and baraat access, compare real pricing up front, and inquire directly — no middleman, no booking fees.",
  keywords: [
    "Indian wedding venues New Jersey",
    "South Asian event venues NJ",
    "mandap venue",
    "Indian banquet hall NJ",
  ],
  openGraph: {
    title: "The Desi Venue — Indian Wedding & Event Venues in New Jersey",
    description:
      "Mandap-ready halls, cultural filters, transparent pricing — find the perfect venue for your Indian event in New Jersey.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Desi Venue — Indian Wedding & Event Venues in New Jersey",
    description:
      "Mandap-ready halls, cultural filters, transparent pricing — find the perfect venue for your Indian event in New Jersey.",
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
