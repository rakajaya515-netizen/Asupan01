export const metadata = {
  title: "Asupanmu",
  description: "Streaming video terbaru"
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
