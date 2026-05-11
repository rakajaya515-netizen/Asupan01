import "./globals.css"

export const metadata = {
  title: "Asupanmu",
  description: "Streaming Video",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
