import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Real-time chat",
  description: "Real-time chat application with features like user authentication, chat rooms, private messaging, and notifications.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme='business'>
      <body className={inter.className}>{children}</body>
    </html>
  );
}

