import { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIAssistant from "@/components/AIAssistant";
import { ThemeProvider } from "@/components/ThemeProvider";
import BackgroundMusic from "@/components/BackgroundMusic";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "Ujjain Darshan | VIP Temple Bookings & Guide",
    template: "%s | Ujjain Darshan"
  },
  description: "Official portal for Ujjain Mahakaleshwar Darshan, VIP bookings, Bhasma Aarti, and spiritual guidance. Plan your holy visit with ease.",
  keywords: ["Ujjain", "Mahakaleshwar", "Bhasma Aarti", "VIP Darshan", "Temple Booking", "MP Tourism"],
  authors: [{ name: "Ujjain Temple Trust" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://ujjain-darshan.com",
    title: "Ujjain Darshan | VIP Temple Bookings",
    description: "Official portal for Ujjain Mahakaleshwar Darshan and VIP bookings.",
    siteName: "Ujjain Darshan Portal",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ujjain Darshan | VIP Temple Bookings",
    description: "Official portal for Ujjain Mahakaleshwar Darshan.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 selection:bg-orange-200 dark:selection:bg-orange-900`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <BackgroundMusic />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <AIAssistant />
        </ThemeProvider>
      </body>
    </html>
  );
}
