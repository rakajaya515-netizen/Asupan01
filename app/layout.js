import "./globals.css";

export const metadata = {
  title: "Asupanmu",
};

export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
