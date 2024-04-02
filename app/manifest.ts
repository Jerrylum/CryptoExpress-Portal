import { MetadataRoute } from "next";

const companyName = process.env.COMPANY_NAME;

const name = (companyName ? `${companyName} | ` : "") + "Crypto Express Portal";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: name,
    short_name: name,
    description: "Crypto Express Portal is a decentralized courier service portal.",
    start_url: "/",
    display: "standalone",
    background_color: "#fff",
    theme_color: "#fff",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon"
      },
      {
        src: "/static/favicon256.png",
        sizes: "256x256",
        type: "image/png",
        purpose: "any"
      }
    ]
  };
}
