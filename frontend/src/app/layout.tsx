import "./globals.css";
import "./layout.css";

import AdsenseScript from "@/components/client/adsense-script";
import Footer from "../components/server/footer";
import Header from "../components/server/header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Paste2Share",
  description: "Share everywhere",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <AdsenseScript />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
