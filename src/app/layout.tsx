import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { rootMetadata } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = rootMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-dvh antialiased">
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-fuchsia-600/15 blur-[100px]" />
          <div className="absolute right-0 top-40 h-80 w-80 rounded-full bg-amber-500/10 blur-[110px]" />
          <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-emerald-500/10 blur-[100px]" />
        </div>
        <Nav />
        <main>{children}</main>
        <footer className="mx-auto max-w-5xl px-4 py-10 text-center text-[11px] text-white/25">
          GENZLAB · Built for Nigerian Gen Z · No auth · No payments (yet)
        </footer>
      </body>
    </html>
  );
}
