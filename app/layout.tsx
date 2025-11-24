import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
<<<<<<< HEAD
import { SelectionProvider } from "@/components/selection-context"
=======
>>>>>>> ebf457fafb632865860880df5803bb25a592549c

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  // <CHANGE> Updated metadata for TechExplorer app
  title: "TechExplorer - Exploración Inteligente de Dispositivos",
  description:
    "Explora dispositivos y accesorios tecnológicos con visualizaciones inteligentes y recomendaciones personalizadas",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
<<<<<<< HEAD
      <body>
        <SelectionProvider>
          {children}
        </SelectionProvider>
=======
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
>>>>>>> ebf457fafb632865860880df5803bb25a592549c
      </body>
    </html>
  )
}
