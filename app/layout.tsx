import type { Metadata } from "next";
import "@/styles/globals.css";
import { BRAND } from "@/config/brand";

export const metadata: Metadata = {
  title: "Halden — AI Executive Assistant Platform",
  description: BRAND.description,
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='%23B5854B'/><text x='50%' y='65%' dominant-baseline='middle' text-anchor='middle' font-size='60' fill='%23FFFFFF' font-family='serif'>H</text></svg>",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-bg antialiased">
      <body className="min-h-full bg-bg text-ink selection:bg-primary-t selection:text-primary">
        {children}
      </body>
    </html>
  );
}
