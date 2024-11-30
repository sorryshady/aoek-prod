import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ClientProvider from "./providers/query-client";
import Navbar from "@/components/custom/navbar";
import { Toaster } from "sonner";
import { AuthProvider } from "./providers/auth-context";
import Footer from "@/components/custom/footer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Association of Engineers Kerala",
  description:
    "The Association of Engineers Kerala is a non-profit politically neutral organization representing working as well as retired engineers from the Public Works, Irrigation and Local Self Government Departments of the Government of Kerala",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <ClientProvider>
            <Navbar />
            {children}
            <Footer />
          </ClientProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
