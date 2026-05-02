export const metadata = {
  title: "Asupanmu",
  description: "Streaming video",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body style={{ background: "#000", color: "#fff" }}>
        {children}
      </body>
    </html>
  );
}
