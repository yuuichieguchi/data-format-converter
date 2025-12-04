import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Data Format Converter - CSV, JSON, XML",
  description:
    "Convert between CSV, JSON, and XML formats instantly and effortlessly",
  keywords: ["converter", "csv", "json", "xml", "data format"],
  metadataBase: new URL("https://converter.example.com"),
  openGraph: {
    title: "Data Format Converter",
    description: "Instantly convert data between CSV, JSON, and XML formats",
    type: "website",
    url: "https://converter.example.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Data Format Converter",
    description: "Convert CSV, JSON, XML easily",
  },
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">📋</text></svg>',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function() {
              const theme = localStorage.getItem('theme');
              if (theme === 'dark') {
                document.documentElement.style.backgroundColor = '#1a202c';
                document.documentElement.style.color = '#ffffff';
              } else {
                document.documentElement.style.backgroundColor = '#ffffff';
                document.documentElement.style.color = '#000000';
              }
            })();
          `,
          }}
        />
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: "#ffffff",
          color: "#000000",
          transition: "background-color 0.3s ease, color 0.3s ease",
        }}
      >
        {children}
      </body>
    </html>
  );
}
