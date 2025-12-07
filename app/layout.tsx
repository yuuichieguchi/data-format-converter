import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Data Format Converter - CSV, JSON, XML",
  description:
    "Convert between CSV, JSON, and XML formats instantly and effortlessly",
  keywords: [
    "data format converter",
    "csv to json",
    "json to csv",
    "xml to json",
    "json to xml",
    "csv to xml",
    "xml to csv",
    "online converter",
    "free converter",
    "data transformation",
    "file format conversion",
    "CSV変換",
    "JSON変換",
    "XML変換",
    "データ変換",
    "フォーマット変換",
    "オンラインツール",
  ],
  metadataBase: new URL("https://data-format-converter-inky.vercel.app/"),
  alternates: {
    canonical: "https://data-format-converter-inky.vercel.app/",
  },
  openGraph: {
    title: "Data Format Converter",
    description: "Instantly convert data between CSV, JSON, and XML formats",
    type: "website",
    url: "https://data-format-converter-inky.vercel.app/",
    siteName: "Data Format Converter",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "Data Format Converter",
    description: "Convert CSV, JSON, XML easily",
  },
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">📋</text></svg>',
  },
  verification: {
    google: "qDjNwUaLfOwddmNI75rPqLANJJNBCRsKXySsNayn_ZI",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Data Format Converter",
  description:
    "Convert between CSV, JSON, and XML formats instantly and effortlessly",
  url: "https://data-format-converter-inky.vercel.app/",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "JPY",
  },
  featureList: [
    "CSV to JSON conversion",
    "JSON to CSV conversion",
    "XML to JSON conversion",
    "JSON to XML conversion",
    "CSV to XML conversion",
    "XML to CSV conversion",
  ],
  inLanguage: "ja",
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
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8445672656091773"
          crossOrigin="anonymous"
        ></script>
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
