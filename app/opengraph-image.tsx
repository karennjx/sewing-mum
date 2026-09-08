import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

// Required so the image can also be emitted by `output: "export"` builds.
export const dynamic = "force-static";

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
          backgroundColor: "#fdf9f7",
          color: "#3a2a2c",
        }}
      >
        <div
          style={{
            fontSize: 26,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#9a3346",
          }}
        >
          A Singapore social enterprise
        </div>
        <div style={{ display: "flex", fontSize: 104, marginTop: 24 }}>
          {site.name}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 42,
            marginTop: 12,
            color: "#7c6669",
          }}
        >
          {site.tagline}
        </div>
        <div
          style={{
            display: "flex",
            width: 160,
            height: 8,
            marginTop: 48,
            backgroundColor: "#9a3346",
          }}
        />
      </div>
    ),
    size,
  );
}
