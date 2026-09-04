import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${site.name} — ${site.tagline}`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#fdf8f3",
          color: "#3b2f2a",
        }}
      >
        <div
          style={{
            fontSize: 26,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#9c4a63",
          }}
        >
          Handmade in small batches
        </div>
        <div style={{ display: "flex", fontSize: 104, marginTop: 24 }}>
          {site.name}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 42,
            marginTop: 12,
            color: "#7a6a60",
          }}
        >
          Bags, soft toys and bookish bundles
        </div>
        <div
          style={{
            display: "flex",
            width: 160,
            height: 8,
            marginTop: 48,
            backgroundColor: "#9c4a63",
          }}
        />
      </div>
    ),
    size,
  );
}
