// Add to src/app/layout.tsx (merge with existing metadata).
import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",          // content can go under the notch; safe-area padding handles it
  // Do NOT set maximumScale or userScalable=false: pinch-zoom must stay available (accessibility).
  // Light (cream) theme only, even when the device is in dark mode.
  themeColor: "#FBF1E5",
  colorScheme: "only light",
};

export const metadata: Metadata = {
  applicationName: "OrangeTemple",
  appleWebApp: {
    capable: true,
    title: "OrangeTemple",
    statusBarStyle: "black-translucent",
  },
  formatDetection: { telephone: false },
  icons: {
    icon: [
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
};
