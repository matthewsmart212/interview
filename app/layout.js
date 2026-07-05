import "./globals.css";
import StatusBarTheme from "../components/StatusBarTheme";
import AppShellHeader from "../components/AppShellHeader";

export const metadata = {
  title: "Interview Coach AI",
  description:
    "Your AI interview coach — practise mock interviews, build your CV and get instant feedback.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Interview Coach AI",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#302651",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=optional"
          rel="stylesheet"
        />
      </head>
      <body>
        <StatusBarTheme />
        <AppShellHeader />
        <div className="app-shell">{children}</div>
      </body>
    </html>
  );
}
