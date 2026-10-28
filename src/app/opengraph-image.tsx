import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import { profile } from "@/lib/site";

// The preview card shown when haoli.ai is shared on LinkedIn, Slack, iMessage, etc.
export const alt = `${profile.name} — ${profile.headline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const avatar = fs.readFileSync(path.join(process.cwd(), "public", "avatar.png")).toString("base64");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 64,
          padding: "0 96px",
          backgroundColor: "#f7f6f3",
          color: "#26251f",
        }}
      >
        <img
          src={`data:image/png;base64,${avatar}`}
          width={260}
          height={260}
          alt=""
          style={{ borderRadius: 9999, backgroundColor: "#9fd2b5", boxShadow: "0 0 0 10px #ffffff" }}
        />
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 660 }}>
          <div style={{ fontSize: 30, fontWeight: 700, color: "#55524b" }}>{profile.name}</div>
          <div style={{ fontSize: 84, fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.02, marginTop: 12 }}>
            {profile.headline}
          </div>
          <div style={{ fontSize: 32, color: "#55524b", lineHeight: 1.35, marginTop: 22 }}>{profile.subline}</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#2f7d5b", marginTop: 30 }}>haoli.ai</div>
        </div>
      </div>
    ),
    size
  );
}
