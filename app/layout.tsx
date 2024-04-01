import type { Metadata } from "next";
import "./globals.css";
import RootAppBar from "@/components/RootAppBar";

export const metadata: Metadata = {
  title: "Crypto Express Portal", // TODO .env
  description: "Crypto Express Portal is a decentralized courier service portal."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <RootAppBar />
        <main className="md:container md:mx-auto md:px-0 px-3 sm:py-12 py-24 flex flex-col items-center justify-between">
          <div className="max-w-3xl w-full items-center justify-between text-sm md:flex">{children}</div>
        </main>
      </body>
    </html>
  );
}
