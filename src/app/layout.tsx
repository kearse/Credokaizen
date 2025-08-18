import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CredoKaizen - Strategic Portfolio",
  description: "A strategic portfolio of innovative companies and products.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}