import { ImageResponse } from "next/og";

export const alt = "Rasool Bux | Full-Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0b1020 0%, #312e81 60%, #a21caf 100%)",
          color: "white",
        }}
      >
        <div style={{ display: "flex", fontSize: 130, fontWeight: 800 }}>
          RB<span style={{ color: "#818cf8" }}>.dev</span>
        </div>
        <div style={{ display: "flex", fontSize: 54, marginTop: 20 }}>Rasool Bux</div>
        <div style={{ display: "flex", fontSize: 34, marginTop: 14, color: "#c7d2fe" }}>
          Full-Stack Developer · Next.js · Node.js
        </div>
      </div>
    ),
    size
  );
}