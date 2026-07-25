import type { Metadata } from "next";
import { playfair, inter } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "The Desi Venue — Indian Event Venues in New Jersey",
    template: "%s · The Desi Venue",
  },
  description:
    "Find Indian-event-ready venues across New Jersey. Filter by mandap space, fire ceremonies, vegetarian kitchens, baraat access and more — with transparent pricing and direct inquiries.",
  keywords: [
    "Indian wedding venues New Jersey",
    "South Asian event venues NJ",
    "mandap venue",
    "Indian banquet hall NJ",
  ],
  openGraph: {
    title: "The Desi Venue — Indian Event Venues in New Jersey",
    description:
      "Find the perfect venue for your Indian event in New Jersey — mandap-ready halls, cultural filters, transparent pricing.",
    type: "website",
    locale: "en_US",
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
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
