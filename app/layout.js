import "./globals.css";

export const metadata = {
  title: "PsychFlo — Organisational Psychology + AI",
  description: "9 AI-powered tools built on organisational psychology research. Prevent tribunal risk, reduce burnout, improve retention.",
  manifest: "/manifest.json",
  themeColor: "#c9a84c",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "PsychFlo" },
  viewport: { width: "device-width", initialScale: 1, maximumScale: 1 },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#c9a84c" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="PsychFlo" />
        <link rel="apple-touch-icon" href="/logo.svg" />
        <script dangerouslySetInnerHTML={{ __html: `if('serviceWorker' in navigator){navigator.serviceWorker.register('/sw.js')}` }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
