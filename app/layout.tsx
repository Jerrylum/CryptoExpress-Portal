import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import RootAppBar from "@/components/RootAppBar";

const roboto = Roboto({ subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: "Crypto Express Portal", // TODO .env
  description:
    "Crypto Express Portal is a decentralized courier service portal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <RootAppBar />
        <main className="md:container md:mx-auto md:px-0 px-3 md:py-12 py-6 flex flex-col items-center justify-between">
          <div className="max-w-3xl w-full items-center justify-between font-mono text-sm md:flex">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
