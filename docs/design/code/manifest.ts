// src/app/manifest.ts — Next.js generates /manifest.webmanifest from this file.
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "OrangeTemple — Sacred Temples of Bharat",
    short_name: "OrangeTemple",
    description:
      "Discover India's sacred temples, Jyotirlingas, Char Dham, stories and yatra guides.",
    start_url: "/?source=pwa",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#FBF1E5",
    theme_color: "#D96B22",
    lang: "en-IN",
    dir: "ltr",
    categories: ["travel", "lifestyle", "education"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "12 Jyotirlingas", url: "/#jyotirlingas", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "Char Dham", url: "/#char-dham", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "Search temples", url: "/?search=1", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
    ],
  };
}
