import "./globals.css";
import "./layout.css";

import AdsenseScript from "@/components/client/adsense-script";
import Footer from "../components/server/footer";
import Header from "../components/server/header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Paste2Share",
  description: "Share everywhere",
  icons: {
    icon: [
      //! Android Icons
      { rel: "icon", type: "image/png", sizes: "36x36", url: "/favicon/android-icon-36x36.png" },
      { rel: "icon", type: "image/png", sizes: "48x48", url: "/favicon/android-icon-48x48.png" },
      { rel: "icon", type: "image/png", sizes: "72x72", url: "/favicon/android-icon-72x72.png" },
      { rel: "icon", type: "image/png", sizes: "96x96", url: "/favicon/android-icon-96x96.png" },
      { rel: "icon", type: "image/png", sizes: "144x144", url: "/favicon/android-icon-144x144.png" },
      { rel: "icon", type: "image/png", sizes: "192x192", url: "/favicon/android-icon-192x192.png" },
      { rel: "icon", type: "image/png", sizes: "512x512", url: "/favicon/android-icon-512x512.png" },

      //! Apple Icons
      { rel: "apple-touch-icon", type: "image/ico", url: "/favicon/apple-icon.png" },
      { rel: "apple-touch-icon", sizes: "57x57", url: "/favicon/apple-icon-57x57.png" },
      { rel: "apple-touch-icon", sizes: "60x60", url: "/favicon/apple-icon-60x60.png" },
      { rel: "apple-touch-icon", sizes: "72x72", url: "/favicon/apple-icon-72x72.png" },
      { rel: "apple-touch-icon", sizes: "76x76", url: "/favicon/apple-icon-76x76.png" },
      { rel: "apple-touch-icon", sizes: "114x114", url: "/favicon/apple-icon-114x114.png" },
      { rel: "apple-touch-icon", sizes: "120x120", url: "/favicon/apple-icon-120x120.png" },
      { rel: "apple-touch-icon", sizes: "144x144", url: "/favicon/apple-icon-144x144.png" },
      { rel: "apple-touch-icon", sizes: "152x152", url: "/favicon/apple-icon-152x152.png" },
      { rel: "apple-touch-icon", sizes: "180x180", url: "/favicon/apple-icon-180x180.png" },

      //! Favion Icons
      { rel: "icon", type: "image/ico", url: "/favicon/favicon.ico" },
      { rel: "icon", type: "image/png", sizes: "16x16", url: "/favicon/favicon-16x16.png" },
      { rel: "icon", type: "image/png", sizes: "32x32", url: "/favicon/favicon-32x32.png" },
      { rel: "icon", type: "image/png", sizes: "96x96", url: "/favicon/favicon-96x96.png" },
    ],

    //! Other Icons
    other: [{ rel: "apple-touch-icon-precomposed", url: "/favicon/apple-icon-precomposed.png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href="/public/images/logo.png" />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
