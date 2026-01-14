"use client"

import localFont from "next/font/local";
import "./globals.css";
import NavBar from "@/components/NavbarResponsive";
import "@/amplify-config";
import AuthGate from "@/components/AuthGate";

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

const metadata = {
  title: "Tiger Wellness Hub",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthGate>
            {children}
        </AuthGate>
      </body>
    </html>
  );
}
