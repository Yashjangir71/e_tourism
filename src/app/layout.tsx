"use client";
// app/layout.tsx
import "./globals.css";
import { SessionProvider } from "next-auth/react";



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
