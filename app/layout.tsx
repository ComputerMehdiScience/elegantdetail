import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import "./globals.css";
import { BookingModal } from "./components/BookingModal";
import { cn } from "@/lib/utils";

const sora = Sora({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://elegantautodetailing.ca"),
  title: "Elegant Auto Detailing | Surrey, BC",
  description: "Professional mobile car detailing in Surrey, BC. Interior, exterior, and full detail packages that come to you.",
  applicationName: "Elegant Auto Detailing",
  icons: {
    icon: [{ url: "/Microyescars/logo.png", sizes: "512x512", type: "image/png" }],
    shortcut: [{ url: "/Microyescars/logo.png", sizes: "512x512", type: "image/png" }],
    apple: [{ url: "/Microyescars/logo.png", sizes: "512x512", type: "image/png" }],
  },
  openGraph: {
    title: "Elegant Auto Detailing | Surrey, BC",
    description: "Professional mobile car detailing in Surrey, BC. Interior, exterior, and full detail packages that come to you.",
    url: "https://elegantautodetailing.ca",
    siteName: "Elegant Auto Detailing",
    images: [
      {
        url: "/Microyescars/logo.png",
        width: 1200,
        height: 1200,
        alt: "Elegant Auto Detailing logo",
      },
    ],
    type: "website",
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
      className={cn("h-full", "antialiased", sora.variable, inter.variable, "font-sans")}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <BookingModal />
      </body>
    </html>
  );
}
