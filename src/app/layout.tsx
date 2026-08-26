import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sistema Piedra Roseta — Lingüística matemática interactiva",
  description: "Aprende conjuntos grandes de lenguas tratándolas como vectores en un espacio de rasgos. Encuentra las lenguas-base y genera linealmente todas las demás — igual que en álgebra lineal. Por Leonardo Jiménez Martínez · BIOMAT.",
  keywords: ["piedra roseta", "lingüística matemática", "álgebra lineal", "PCA", "lenguas romances", "Swadesh", "WALS", "BIOMAT", "Leonardo Jiménez"],
  authors: [{ name: "Leonardo Jiménez Martínez · BIOMAT", url: "https://github.com/metamatematico/Piedra_Roseta" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Sistema Piedra Roseta",
    description: "Álgebra lineal aplicada al aprendizaje de familias lingüísticas. Por Leonardo Jiménez Martínez · BIOMAT.",
    url: "https://github.com/metamatematico/Piedra_Roseta",
    siteName: "Sistema Piedra Roseta",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sistema Piedra Roseta",
    description: "Álgebra lineal aplicada al aprendizaje de familias lingüísticas. Por Leonardo Jiménez Martínez · BIOMAT.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
