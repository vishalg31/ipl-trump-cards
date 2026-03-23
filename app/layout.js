import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  title: "IPL Trump Cards",
  description: "An IPL trump card game built locally in Vishal Lab using a real 2024-2025 batting deck."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
