import "./globals.css";

export const metadata = {
  title: "Yellow World",
  description: "A basic Next.js website that says yellow world.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
