import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Data Format Converter - CSV, JSON, XML";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 80, marginBottom: 20 }}>📊</div>
        <div
          style={{
            fontSize: 60,
            fontWeight: 800,
            color: "white",
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          Data Format Converter
        </div>
        <div
          style={{
            fontSize: 32,
            color: "rgba(255, 255, 255, 0.9)",
            marginBottom: 30,
          }}
        >
          CSV ↔ JSON ↔ XML
        </div>
        <div
          style={{
            display: "flex",
            gap: 20,
          }}
        >
          <div
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              padding: "12px 24px",
              borderRadius: 8,
              color: "white",
              fontSize: 24,
            }}
          >
            Instant Conversion
          </div>
          <div
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              padding: "12px 24px",
              borderRadius: 8,
              color: "white",
              fontSize: 24,
            }}
          >
            Free Online Tool
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
