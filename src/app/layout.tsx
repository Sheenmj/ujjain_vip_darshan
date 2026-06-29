import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackgroundMusic from "@/components/BackgroundMusic";

export const metadata: Metadata = {
  title: "Ujjain VIP Darshan Booking Portal",
  description: "Secure, real-time VIP ticket reservation for historic temples of Ujjain, operated by the Government of Madhya Pradesh.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="min-h-full bg-[#0b0c10] text-[#f3f4f6] flex flex-col antialiased" suppressHydrationWarning>
        <BackgroundMusic />
        <Navbar />
        <main className="flex-grow flex flex-col w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

