import { Router } from "next/router";
import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface AdsBannerProps {
  "data-ad-slot": string;
  "data-ad-format": string;
  "data-full-width-responsive": string;
  "data-ad-layout"?: string;
}

export default function AdsenseBanner(props: AdsBannerProps) {
  useEffect(() => {
    const handleRouteChange = () => {
      const intervalId = setInterval(() => {
        try {
          //@ts-ignore
          if (window.adsbygoogle) {
            //@ts-ignore
            window.adsbygoogle.push({});
            clearInterval(intervalId);
          }
        } catch (err) {
          console.error("Error pushing ads: ", err);
          clearInterval(intervalId);
        }
      }, 100);
      return () => clearInterval(intervalId);
    };

    handleRouteChange();

    if (typeof window !== "undefined") {
      Router.events.on("routeChangeComplete", handleRouteChange);

      return () => {
        Router.events.off("routeChangeComplete", handleRouteChange);
      };
    }
  }, []);

  return (
    <ins
      className="adsbygoogle adbanner-customize mt-2"
      style={{
        display: "block",
        overflow: "hidden",
        border: process.env.NODE_ENV === "development" ? "1px solid red" : "none",
        background: process.env.NODE_ENV === "development" ? "rgba(255, 0, 0, 0.1)" : "none",
      }}
      data-adtest="on"
      data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID}
      {...props}
    />
  );
}
