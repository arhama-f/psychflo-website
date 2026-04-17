import "./globals.css";

export const metadata = {
  title: "PsychFlo — Organisational Psychology + AI",
  description: "9 AI-powered tools built on organisational psychology research. Prevent tribunal risk, reduce burnout, improve retention.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
