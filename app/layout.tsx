import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CustomSessionProvider from "./session-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FamilyMart-Vi-familymart",
  description: "FamilyMart-Vi-familymart training platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
      <CustomSessionProvider>

        {children}
        </CustomSessionProvider>

        </body>
    </html>
  );
}
