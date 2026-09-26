import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { getSessionUser } from "@/lib/api";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "800"],
  variable: "--font-open-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "PG Life — Happiness per Square Foot",
    template: "%s | PG Life",
  },
  description:
    "Find Paying Guest (PG) accommodations across Delhi, Mumbai, Bengaluru, Hyderabad and Chennai. Browse listings, amenities, ratings and resident testimonials.",
  icons: { icon: "/favicon.ico" },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser().catch(() => null);

  return (
    <html lang="en" className={openSans.variable}>
      <body className="flex min-h-screen flex-col">
        <Header user={user} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
