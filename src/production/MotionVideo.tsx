import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig
} from "remotion";
import type { CSSProperties } from "react";
import type { MotionPalette, MotionScene, MotionVideoProps } from "./types";
import { splitCaptionSegments } from "./captions.mjs";
import { getCameraMotion } from "./motion-profiles.mjs";
import { getMusicBedGain, getVoiceFadeEnvelope } from "./audio-mix.mjs";
import { resolveCaptionStyle } from "./caption-styles.mjs";

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const rgba = (hex: string, alpha: number) => {
  const value = hex.replace("#", "");
  const normalized = value.length === 3
    ? value.split("").map((ch) => ch + ch).join("")
    : value;
  const number = Number.parseInt(normalized, 16);
  const red = (number >> 16) & 255;
  const green = (number >> 8) & 255;
  const blue = number & 255;
  return "rgba(" + red + ", " + green + ", " + blue + ", " + alpha + ")";
};

const isRtlLanguage = (language: string) => /^(fa|ar|ur|he)(-|$)/i.test(language);
const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const fitMotionFontSize = (text: string, base: number, minimum: number) => {
  const length = Array.from(String(text || "")).length;
  const scale = length <= 28 ? 1 : length <= 42 ? 0.9 : length <= 58 ? 0.8 : length <= 78 ? 0.7 : 0.6;
  return Math.max(minimum, Math.round(base * scale));
};
const captionForFrame = (text: string, frame: number, spokenFrames: number) => {
  const segments = splitCaptionSegments(text);
  if (!segments.length || frame < 0 || frame >= Math.max(1, spokenFrames)) return "";
  const weights = segments.map((segment) => segment.split(/\s+/).filter(Boolean).length);
  const total = weights.reduce((sum, value) => sum + value, 0) || 1;
  const position = frame / Math.max(1, spokenFrames) * total;
  let accumulated = 0;
  for (let index = 0; index < segments.length; index += 1) {
    accumulated += weights[index];
    if (position < accumulated || index === segments.length - 1) return segments[index];
  }
  return segments[segments.length - 1];
};

const SceneBackdrop: React.FC<{ palette: MotionPalette; frame: number; index: number; styleId: string }> = ({ palette, frame, index, styleId }) => {
  const drift = interpolate(frame, [0, 150], [-2, 3], clamp);
  const spin = interpolate(frame, [0, 180], [0, index % 2 ? -16 : 19], clamp);
  const isLight = ["#F3F3EF", "#F7F1E4", "#EFE5D1", "#E9E3D4"].includes(palette.background.toUpperCase());
  const editorial = styleId === "editorial-kinetic-type" || styleId === "swiss-modernist";
  const paper = styleId === "tactile-collage";
  const character = styleId === "character-2d";
  const topographic = styleId === "maps-timeline";
  const vertical = styleId === "vertical-social";
  const data = styleId === "data-journalism";
  const ringStyles = ["premium-3d-product", "scientific-2-5d", "procedural-generative", "cinematic-documentary", "hybrid-live-action"];
  const background = paper
    ? "linear-gradient(132deg, " + palette.background + " 0%, " + rgba(palette.accent2, 0.08) + " 100%)"
    : editorial
      ? "linear-gradient(90deg, " + palette.background + " 0%, " + palette.background + " 58%, " + rgba(palette.accent, 0.055) + " 58.1%, " + palette.background + " 58.25%, " + palette.background + " 100%)"
      : character
        ? "radial-gradient(ellipse at " + (76 + drift) + "% 18%, " + rgba(palette.accent2, 0.2) + " 0%, transparent 38%), " + palette.background
        : styleId === "premium-3d-product"
          ? "radial-gradient(ellipse at " + (68 + drift) + "% 19%, " + rgba(palette.accent2, 0.23) + " 0%, transparent 38%), radial-gradient(ellipse at 54% 88%, " + rgba(palette.accent, 0.1) + " 0%, transparent 47%), " + palette.background
          : data
            ? "linear-gradient(180deg, " + palette.background + " 0%, " + rgba(palette.panel, 0.58) + " 100%)"
            : "radial-gradient(ellipse at " + (68 + drift) + "% " + (16 + index % 3 * 11) + "%, " + rgba(palette.accent, isLight ? 0.11 : 0.18) + " 0%, transparent 43%), linear-gradient(128deg, " + palette.background + " 0%, " + palette.background + " 58%, " + rgba(palette.accent2, isLight ? 0.05 : 0.08) + " 100%)";
  const texture = topographic
    ? "repeating-radial-gradient(ellipse at 72% 58%, transparent 0px, transparent 27px, " + rgba(palette.line, 0.38) + " 28px, transparent 30px)"
    : paper
      ? "repeating-linear-gradient(0deg, " + rgba(palette.foreground, 0.026) + " 0px, " + rgba(palette.foreground, 0.026) + " 1px, transparent 1px, transparent 5px), repeating-linear-gradient(90deg, " + rgba(palette.foreground, 0.016) + " 0px, " + rgba(palette.foreground, 0.016) + " 1px, transparent 1px, transparent 7px)"
      : editorial
        ? "linear-gradient(90deg, transparent 0%, transparent 11.9%, " + rgba(palette.line, 0.44) + " 12%, transparent 12.1%, transparent 87.9%, " + rgba(palette.line, 0.24) + " 88%, transparent 88.1%)"
        : vertical
          ? "linear-gradient(90deg, " + rgba(palette.accent, 0.15) + " 0%, transparent 2%, transparent 22%, " + rgba(palette.foreground, 0.055) + " 22.2%, transparent 22.5%, transparent 78%, " + rgba(palette.accent2, 0.08) + " 78.5%, transparent 79%)"
          : "linear-gradient(" + spin + "deg, transparent 49.7%, " + rgba(palette.line, 0.22) + " 49.9%, transparent 50.1%), linear-gradient(90deg, " + rgba(palette.line, data ? 0.18 : 0.11) + " 1px, transparent 1px), linear-gradient(" + rgba(palette.line, data ? 0.18 : 0.11) + " 1px, transparent 1px)";
  const textureSize = topographic ? "100% 100%" : paper ? "8px 8px, 13px 13px" : editorial || vertical ? "100% 100%" : "100% 100%, 84px 84px, 84px 84px";

  return (
    <AbsoluteFill style={{ background }}>
      <AbsoluteFill
        style={{
          backgroundImage: texture,
          backgroundSize: textureSize,
          maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.72), transparent 94%)",
          opacity: paper ? 0.82 : editorial ? 0.78 : vertical ? 0.88 : 0.62
        }}
      />
      {character ? (
        <div
          style={{
            position: "absolute",
            width: "34vw",
            height: "34vw",
            maxWidth: 700,
            maxHeight: 700,
            left: "-11%",
            top: "-21%",
            borderRadius: "43% 57% 64% 36% / 44% 41% 59% 56%",
            background: rgba(palette.accent, 0.1),
            transform: "rotate(" + spin + "deg)"
          }}
        />
      ) : null}
      {editorial ? (
        <div
          style={{
            position: "absolute",
            left: "12%",
            top: "15%",
            width: 3,
            height: "70%",
            background: rgba(palette.accent, 0.48),
            transform: "translateY(" + drift * 4 + "px)"
          }}
        />
      ) : null}
      {paper ? (
        <div
          style={{
            position: "absolute",
            right: "-2%",
            top: "10%",
            width: "27vw",
            height: "36vh",
            border: "1px solid " + rgba(palette.foreground, 0.16),
            background: rgba(palette.panel, 0.26),
            boxShadow: "12px 16px 0 " + rgba(palette.foreground, 0.035),
            transform: "rotate(" + (index % 2 ? 3 : -2) + "deg)"
          }}
        />
      ) : null}
      {vertical ? (
        <div
          style={{
            position: "absolute",
            right: "4%",
            bottom: "-28%",
            width: "9%",
            height: "76%",
            background: rgba(palette.accent, 0.13),
            transform: "rotate(9deg)"
          }}
        />
      ) : null}
      {ringStyles.includes(styleId) ? (
        <>
          <div
            style={{
              position: "absolute",
              width: "52vw",
              height: "52vw",
              maxWidth: 1100,
              maxHeight: 1100,
              right: "-17%",
              bottom: "-55%",
              borderRadius: "50%",
              border: "1px solid " + rgba(palette.accent, 0.24),
              transform: "rotateX(64deg) rotateZ(" + spin + "deg)",
              boxShadow: "0 0 90px " + rgba(palette.accent, 0.05)
            }}
          />
          <div
            style={{
              position: "absolute",
              width: "37vw",
              height: "37vw",
              maxWidth: 820,
              maxHeight: 820,
              right: "-8%",
              bottom: "-43%",
              borderRadius: "50%",
              border: "1px solid " + rgba(palette.foreground, 0.11),
              transform: "rotateX(64deg) rotateZ(" + -spin * 0.7 + "deg)"
            }}
          />
        </>
      ) : null}
    </AbsoluteFill>
  );
};

const Eyebrow: React.FC<{ text: string; palette: MotionPalette; typography: MotionVideoProps["typography"]; rtl: boolean }> = ({ text, palette, typography, rtl }) => (
  <div
    dir={rtl ? "rtl" : "ltr"}
    style={{
      fontFamily: typography.mono,
      fontSize: 18,
      letterSpacing: rtl ? 0 : 4,
      color: palette.accent,
      fontWeight: 700,
      lineHeight: 1.3,
      textTransform: rtl ? "none" : "uppercase"
    }}
  >
    {text}
  </div>
);

const SceneText: React.FC<{
  scene: MotionScene;
  palette: MotionPalette;
  typography: MotionVideoProps["typography"];
  rtl: boolean;
  vertical: boolean;
  frame: number;
  fps: number;
}> = ({ scene, palette, typography, rtl, vertical, frame, fps }) => {
  const rise = spring({ frame, fps, config: { damping: 18, stiffness: 105, mass: 0.9 } });
  const opacity = interpolate(frame, [0, 8, 20], [0, 0.35, 1], clamp);
  const titleY = interpolate(rise, [0, 1], [58, 0], clamp);
  const titleSize = fitMotionFontSize(scene.title, vertical ? 84 : 104, vertical ? 44 : 52);
  const titleAlign = vertical ? "center" : rtl ? "right" : "left";
  const titleWidth = "100%";
  const bodySize = fitMotionFontSize(scene.body, vertical ? 32 : 30, vertical ? 20 : 21);
  const titleWords = scene.title.trim().split(/\s+/).filter(Boolean);

  return (
    <div
      style={{
        width: titleWidth,
        textAlign: titleAlign as CSSProperties["textAlign"],
        direction: rtl ? "rtl" : "ltr",
        display: "flex",
        flexDirection: "column",
        alignItems: vertical ? "center" : rtl ? "flex-end" : "flex-start",
        opacity,
        transform: "translateY(" + titleY + "px)"
      }}
    >
      <Eyebrow text={scene.kicker} palette={palette} typography={typography} rtl={rtl} />
      <div
        style={{
          marginTop: 26,
          maxWidth: vertical ? "100%" : 1130,
          fontFamily: typography.display,
          fontSize: titleSize,
          lineHeight: 0.99,
          fontWeight: 850,
          letterSpacing: rtl ? 0 : -1.8,
          color: palette.foreground,
          textWrap: "balance" as CSSProperties["textWrap"],
          overflowWrap: "anywhere"
        }}
      >
        {titleWords.map((word, wordIndex) => {
          const wordFrame = Math.max(0, frame - wordIndex * 2);
          const wordOpacity = interpolate(wordFrame, [0, 8], [0, 1], clamp);
          const wordY = interpolate(wordFrame, [0, 10], [18, 0], clamp);
          const wordBlur = interpolate(wordFrame, [0, 10], [4, 0], clamp);
          const wordScale = interpolate(wordFrame, [0, 12], [0.97, 1], clamp);
          return (
            <React.Fragment key={word + "-" + wordIndex}>
              <span
                style={{
                  display: "inline-block",
                  maxWidth: "100%",
                  opacity: wordOpacity,
                  transform: "translateY(" + wordY + "px) scale(" + wordScale + ")",
                  filter: "blur(" + wordBlur + "px)",
                  overflowWrap: "anywhere"
                }}
              >
                {word}
              </span>
              {wordIndex < titleWords.length - 1 ? " " : ""}
            </React.Fragment>
          );
        })}
      </div>
      {scene.title ? (
        <div
          aria-hidden="true"
          style={{
            alignSelf: vertical ? "center" : rtl ? "flex-end" : "flex-start",
            marginTop: 18,
            width: interpolate(frame, [4, 24], [0, vertical ? 140 : 220], clamp),
            maxWidth: "42%",
            height: 4,
            background: palette.accent,
            boxShadow: "0 0 18px " + rgba(palette.accent, 0.28),
            borderRadius: 2
          }}
        />
      ) : null}
      {scene.body ? (
        <div
          dir={rtl ? "rtl" : "auto"}
          style={{
            marginTop: 26,
            maxWidth: vertical ? "96%" : 880,
            fontFamily: typography.body,
            fontSize: bodySize,
            lineHeight: 1.45,
            color: palette.muted,
            textWrap: "pretty" as CSSProperties["textWrap"],
            whiteSpace: "pre-wrap"
          }}
        >
          {scene.body}
        </div>
      ) : null}
      {scene.bullets && scene.bullets.length > 0 ? (
        <div
          style={{
            marginTop: 30,
            display: "flex",
            justifyContent: vertical ? "center" : rtl ? "flex-end" : "flex-start",
            flexWrap: "wrap",
            gap: 10
          }}
        >
          {scene.bullets.slice(0, 4).map((bullet, idx) => (
            <div
              key={bullet + idx}
              dir={rtl ? "rtl" : "auto"}
              style={{
                border: "1px solid " + rgba(palette.foreground, 0.21),
                background: rgba(palette.panel, 0.8),
                borderRadius: 999,
                padding: "10px 16px",
                fontFamily: typography.body,
                fontSize: 18,
                color: idx === 0 ? palette.accent2 : palette.foreground
              }}
            >
              {bullet}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

const DiagramGraphic: React.FC<{ scene: MotionScene; palette: MotionPalette; frame: number; vertical: boolean; typography: MotionVideoProps["typography"] }> = ({ scene, palette, frame, vertical, typography }) => {
  const labels = (scene.bullets && scene.bullets.length ? scene.bullets : ["INPUT", "PROCESS", "OUTCOME"]).slice(0, 4);
  const progress = interpolate(frame, [2, 46], [0, labels.length], clamp);
  const positions = labels.map((_, index) => ({
    x: vertical ? 500 : 115 + (index * (770 / Math.max(1, labels.length - 1))),
    y: vertical ? 95 + index * 125 : 180 + (index % 2) * 210
  }));
  return (
    <svg viewBox="0 0 1000 560" style={{ width: "100%", height: "100%", overflow: "visible" }}>
      {positions.slice(0, -1).map((p, idx) => {
        const next = positions[idx + 1];
        return (
          <line
            key={"link-" + idx}
            x1={p.x}
            y1={p.y}
            x2={next.x}
            y2={next.y}
            stroke={rgba(palette.accent, 0.8)}
            strokeWidth="2"
            strokeDasharray="9 9"
            strokeDashoffset={Math.max(0, 100 - (frame - idx * 8) * 3)}
          />
        );
      })}
      {positions.map((p, idx) => {
        const active = progress >= idx + 0.5;
        const scale = spring({ frame: Math.max(0, frame - idx * 8), fps: 30, config: { damping: 13, stiffness: 120 } });
        return (
          <g key={labels[idx]} transform={"translate(" + p.x + " " + p.y + ") scale(" + scale + ")"}>
            <circle r="66" fill={rgba(palette.accent, active ? 0.18 : 0.05)} stroke={active ? palette.accent : palette.line} strokeWidth="2" />
            <circle r="9" fill={active ? palette.accent2 : palette.muted} />
            <text
              y="102"
              textAnchor="middle"
              fill={palette.foreground}
              fontFamily={typography.mono}
              fontSize="21"
            >
              {labels[idx].length > 15 ? labels[idx].slice(0, 14) + "…" : labels[idx]}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

const TimelineGraphic: React.FC<{ scene: MotionScene; palette: MotionPalette; frame: number; vertical: boolean; typography: MotionVideoProps["typography"] }> = ({ scene, palette, frame, vertical, typography }) => {
  const labels = (scene.bullets && scene.bullets.length ? scene.bullets : ["BEGIN", "SHIFT", "NEXT"]).slice(0, 4);
  const progress = interpolate(frame, [0, 56], [0, 1], clamp);
  return (
    <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", flexDirection: vertical ? "column" : "row", alignItems: "center", justifyContent: "space-around", padding: vertical ? "20px 6%" : "8% 2%" }}>
      <div style={{ position: "absolute", left: vertical ? "49%" : "8%", right: vertical ? "auto" : "8%", top: vertical ? "8%" : "49%", bottom: vertical ? "8%" : "auto", width: vertical ? 2 : "auto", height: vertical ? "84%" : 2, background: palette.line }}>
        <div style={{ position: "absolute", inset: 0, width: vertical ? 2 : String(progress * 100) + "%", height: vertical ? String(progress * 100) + "%" : 2, background: palette.accent }} />
      </div>
      {labels.map((label, idx) => {
        const active = progress >= (idx + 0.25) / labels.length;
        return (
          <div key={label + idx} style={{ position: "relative", display: "flex", flexDirection: vertical ? "row" : "column", alignItems: "center", justifyContent: "center", gap: 14, width: vertical ? "100%" : 160, minHeight: vertical ? 95 : undefined, margin: vertical ? "0" : undefined }}>
            <div style={{ width: 18, height: 18, borderRadius: "50%", background: active ? palette.accent : palette.background, border: "2px solid " + (active ? palette.accent2 : palette.line), boxShadow: active ? "0 0 24px " + rgba(palette.accent, 0.5) : "none", zIndex: 1 }} />
            <div dir="auto" style={{ color: active ? palette.foreground : palette.muted, fontFamily: typography.body, fontSize: vertical ? 24 : 20, fontWeight: active ? 700 : 500, textAlign: vertical ? "left" : "center", minWidth: vertical ? 180 : undefined, flex: vertical ? 1 : undefined }}>{label}</div>
          </div>
        );
      })}
    </div>
  );
};

const CompareGraphic: React.FC<{ scene: MotionScene; palette: MotionPalette; frame: number; typography: MotionVideoProps["typography"] }> = ({ scene, palette, frame, typography }) => {
  const labels = (scene.bullets && scene.bullets.length ? scene.bullets : ["STRUCTURE", "BEHAVIOR", "IMPACT"]).slice(0, 3);
  return (
    <div style={{ height: "100%", width: "100%", display: "flex", alignItems: "stretch", gap: 18, padding: "7% 2%" }}>
      {labels.map((label, idx) => {
        const h = interpolate(frame, [5 + idx * 7, 48 + idx * 7], [12, 90], clamp);
        return (
          <div key={label} style={{ flex: 1, minWidth: 0, borderTop: "1px solid " + palette.line, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "22px 12px", background: "linear-gradient(180deg, " + rgba(palette.accent, 0.10 + idx * 0.03) + ", transparent 78%)", boxSizing: "border-box" }}>
            <div style={{ color: palette.muted, fontFamily: typography.mono, fontSize: 17 }}>0{idx + 1} / DIMENSION</div>
            <div style={{ height: "62%", display: "flex", alignItems: "flex-end", gap: 5 }}>
              {Array.from({ length: 5 }).map((_, bar) => (
                <div key={bar} style={{ flex: 1, height: String(Math.max(12, Math.min(96, h - bar * 7 + ((idx + bar) % 3) * 5))) + "%", background: bar === 4 ? palette.accent2 : palette.accent, opacity: 0.25 + bar * 0.15 }} />
              ))}
            </div>
            <div dir="auto" style={{ minWidth: 0, color: palette.foreground, fontFamily: typography.display, fontSize: label.length > 12 ? 18 : label.length > 9 ? 23 : 30, fontWeight: 700, lineHeight: 1.06, overflowWrap: "anywhere", textWrap: "balance" as CSSProperties["textWrap"] }}>{label}</div>
          </div>
        );
      })}
    </div>
  );
};

const ParticleGraphic: React.FC<{ scene: MotionScene; palette: MotionPalette; frame: number; typography: MotionVideoProps["typography"] }> = ({ scene, palette, frame, typography }) => {
  const points = Array.from({ length: 38 }, (_, i) => {
    const x0 = (i * 173 + 31) % 980;
    const y0 = (i * 97 + 53) % 550;
    const x = x0 + Math.sin(frame / (13 + i % 11) + i) * (14 + (i % 7) * 4);
    const y = y0 + Math.cos(frame / (19 + i % 9) + i * 1.7) * (10 + (i % 5) * 5);
    return { x, y, radius: 2 + (i % 4), alpha: 0.2 + (i % 5) * 0.14 };
  });
  return (
    <svg viewBox="0 0 1000 560" style={{ width: "100%", height: "100%" }}>
      {points.map((point, idx) => {
        const other = points[(idx + 7) % points.length];
        return idx % 2 === 0 ? <line key={"l" + idx} x1={point.x} y1={point.y} x2={other.x} y2={other.y} stroke={rgba(palette.accent, 0.15)} strokeWidth="1" /> : null;
      })}
      {points.map((point, idx) => <circle key={"p" + idx} cx={point.x} cy={point.y} r={point.radius} fill={idx % 6 === 0 ? palette.accent2 : palette.accent} opacity={point.alpha} />)}
      <circle cx="500" cy="280" r={100 + Math.sin(frame / 20) * 12} fill="none" stroke={rgba(palette.accent2, 0.6)} strokeWidth="2" />
      <circle cx="500" cy="280" r={145 + Math.cos(frame / 27) * 8} fill="none" stroke={rgba(palette.foreground, 0.18)} strokeWidth="1" strokeDasharray="4 12" />
      <text x="500" y="288" textAnchor="middle" fontSize="25" fill={palette.foreground} fontFamily={typography.mono}>SYSTEM</text>
    </svg>
  );
};

const MapGraphic: React.FC<{ scene: MotionScene; palette: MotionPalette; frame: number; typography: MotionVideoProps["typography"] }> = ({ scene, palette, frame, typography }) => {
  const labels = (scene.bullets && scene.bullets.length ? scene.bullets : ["ORIGIN", "SHIFT", "OUTCOME"]).slice(0, 3);
  const reveal = interpolate(frame, [0, 52], [0, 1], clamp);
  return (
    <svg viewBox="0 0 1000 560" style={{ width: "100%", height: "100%" }}>
      <path d="M 60 400 C 210 160, 300 450, 470 240 S 770 180, 930 320" fill="none" stroke={rgba(palette.foreground, 0.14)} strokeWidth="80" strokeLinecap="round" />
      <path d="M 60 400 C 210 160, 300 450, 470 240 S 770 180, 930 320" fill="none" stroke={palette.accent} strokeWidth="3" strokeDasharray="1400" strokeDashoffset={1400 * (1 - reveal)} />
      {[[90, 360], [340, 338], [590, 213], [910, 300]].map((point, idx) => (
        <g key={idx}>
          <circle cx={point[0]} cy={point[1]} r={12 + ((frame + idx * 9) % 20) / 4} fill={palette.accent2} opacity={0.7} />
          <circle cx={point[0]} cy={point[1]} r="29" fill="none" stroke={rgba(palette.accent2, 0.48)} strokeWidth="1" />
          <text x={point[0]} y={point[1] + 58} textAnchor="middle" fill={palette.foreground} fontSize="19" fontFamily={typography.mono}>{labels[Math.min(idx, labels.length - 1)].slice(0, 13)}</text>
        </g>
      ))}
    </svg>
  );
};

const InterfaceGraphic: React.FC<{ scene: MotionScene; palette: MotionPalette; frame: number; typography: MotionVideoProps["typography"] }> = ({ scene, palette, frame, typography }) => {
  const reveal = interpolate(frame, [4, 36], [0, 1], clamp);
  const labels = (scene.bullets && scene.bullets.length ? scene.bullets : ["OVERVIEW", "DETAIL", "NEXT STEP"]).slice(0, 3);
  return (
    <div style={{ height: "100%", width: "100%", padding: "5%", display: "grid", gridTemplateColumns: "0.8fr 1.5fr", gap: 15, transform: "translateY(" + (1 - reveal) * 35 + "px)", opacity: reveal }}>
      <div style={{ border: "1px solid " + palette.line, background: rgba(palette.panel, 0.78), padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
        {labels.map((label, idx) => <div key={label} dir="auto" style={{ borderLeft: idx === 0 ? "3px solid " + palette.accent : "3px solid transparent", background: idx === 0 ? rgba(palette.accent, 0.12) : "transparent", padding: 12, color: idx === 0 ? palette.foreground : palette.muted, fontSize: 20, fontFamily: typography.body }}>{label}</div>)}
      </div>
      <div style={{ border: "1px solid " + palette.line, background: rgba(palette.panel, 0.46), padding: 22, display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ width: "58%", height: 12, background: palette.muted, opacity: 0.5 }} />
        <div style={{ width: "82%", height: 32, background: palette.accent, opacity: 0.72 }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, flex: 1 }}>
          {[0, 1, 2].map((idx) => <div key={idx} style={{ border: "1px solid " + palette.line, background: rgba(palette.accent2, 0.09), position: "relative", overflow: "hidden" }}><div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: (22 + idx * 20 + Math.sin(frame / 13 + idx) * 6) + "%", background: rgba(palette.accent, 0.4) }} /></div>)}
        </div>
      </div>
    </div>
  );
};

const DataGraphic: React.FC<{ scene: MotionScene; palette: MotionPalette; frame: number; typography: MotionVideoProps["typography"] }> = ({ scene, palette, frame, typography }) => {
  const labels = (scene.bullets && scene.bullets.length ? scene.bullets : ["SIGNAL", "CONTEXT", "CHANGE"]).slice(0, 3);
  const heights = [0.48, 0.79, 0.61];
  const progress = interpolate(frame, [0, 44], [0, 1], clamp);
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "8% 5%" }}>
      <div style={{ height: 1, background: palette.line, marginBottom: 32 }} />
      <div style={{ flex: 1, display: "flex", alignItems: "flex-end", justifyContent: "space-around", gap: 22, borderBottom: "2px solid " + palette.foreground, padding: "0 3%" }}>
        {labels.map((label, idx) => {
          const h = Math.max(8, heights[idx] * 100 * progress);
          return (
            <div key={label} style={{ flex: 1, height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "stretch" }}>
              <div style={{ height: h + "%", background: idx === 1 ? palette.accent2 : palette.accent, transformOrigin: "bottom", minHeight: 8, opacity: 0.88 }} />
              <div dir="auto" style={{ minWidth: 0, color: palette.foreground, fontSize: Math.max(13, Math.min(19, 210 / Math.max(1, label.length))), fontFamily: typography.mono, marginTop: 16, marginBottom: 13, textAlign: "center", overflowWrap: "anywhere", lineHeight: 1.12 }}>{label}</div>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 17, fontSize: 14, color: palette.muted, fontFamily: typography.mono, letterSpacing: 2 }}>CONCEPTUAL RELATIONSHIP · NOT MEASURED DATA</div>
    </div>
  );
};

const QuoteGraphic: React.FC<{ scene: MotionScene; palette: MotionPalette; frame: number; typography: MotionVideoProps["typography"]; rtl: boolean }> = ({ scene, palette, frame, typography, rtl }) => {
  const x = interpolate(frame, [0, 28], [60, 0], clamp);
  return (
    <div style={{ position: "relative", padding: "9% 7%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", borderLeft: "3px solid " + palette.accent, transform: "translateX(" + (rtl ? -x : x) + "px)" }}>
      <div style={{ fontSize: 118, lineHeight: 0.7, color: palette.accent, fontFamily: typography.display }}>“</div>
      <div dir={rtl ? "rtl" : "auto"} style={{ color: palette.foreground, fontFamily: typography.display, fontSize: fitMotionFontSize(scene.title, 54, 30), lineHeight: 1.08, fontWeight: 700, textWrap: "balance" as CSSProperties["textWrap"] }}>{scene.title}</div>
      {scene.body ? <div dir={rtl ? "rtl" : "auto"} style={{ marginTop: 25, color: palette.muted, fontFamily: typography.body, fontSize: fitMotionFontSize(scene.body, 24, 17), lineHeight: 1.5 }}>{scene.body}</div> : null}
    </div>
  );
};

const TopicHeroGraphic: React.FC<{ family: NonNullable<MotionVideoProps["visualFamily"]>; palette: MotionPalette; frame: number }> = ({ family, palette, frame }) => {
  const reveal = interpolate(frame, [0, 34], [0, 1], clamp);
  const pulse = 0.5 + 0.5 * Math.sin(frame / 13);
  const thermalAccent = "#FF8058";
  const thermalHighlight = "#FFD166";
  const cityBuildings = [
    { x: 28, w: 104, h: 178 }, { x: 144, w: 118, h: 252 }, { x: 273, w: 94, h: 208 },
    { x: 378, w: 142, h: 318 }, { x: 531, w: 105, h: 236 }, { x: 647, w: 130, h: 278 },
    { x: 788, w: 84, h: 194 }, { x: 883, w: 91, h: 226 }
  ];
  const windows = (building: { x: number; w: number; h: number }, index: number) =>
    Array.from({ length: Math.max(4, Math.floor(building.h / 38) * 3) }, (_, i) => {
      const columns = 3;
      const rows = Math.ceil(Math.max(4, Math.floor(building.h / 38) * 3) / columns);
      const col = i % columns;
      const row = Math.floor(i / columns);
      return <rect key={index + "-" + i} x={building.x + 15 + col * ((building.w - 30) / columns)} y={620 - building.h + 22 + row * ((building.h - 38) / rows)} width="7" height="13" rx="1" fill={i % 4 === 0 ? palette.accent2 : palette.foreground} opacity={0.16 + 0.46 * (0.5 + 0.5 * Math.sin(frame / 19 + i * 1.7 + index))} />;
    });
  return (
    <svg viewBox="0 0 1000 700" role="img" aria-label="Topic-specific animated concept illustration" style={{ width: "100%", height: "100%", overflow: "visible" }}>
      <defs>
        <linearGradient id="topic-object-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={palette.accent2} stopOpacity="0.92" />
          <stop offset="100%" stopColor={palette.accent} stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="topic-building-gradient" x1="0" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor={palette.panel} />
          <stop offset="100%" stopColor={palette.background} />
        </linearGradient>
        <radialGradient id="topic-halo">
          <stop offset="0%" stopColor={palette.accent2} stopOpacity="0.26" />
          <stop offset="100%" stopColor={palette.accent2} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="topic-thermal-halo">
          <stop offset="0%" stopColor={thermalHighlight} stopOpacity="0.42" />
          <stop offset="48%" stopColor={thermalAccent} stopOpacity="0.2" />
          <stop offset="100%" stopColor={thermalAccent} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="topic-thermal-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={thermalHighlight} />
          <stop offset="100%" stopColor={thermalAccent} />
        </linearGradient>
      </defs>
      {family === "city-heat" ? (
        <>
          <circle cx="752" cy="182" r="190" fill="url(#topic-thermal-halo)" />
          <circle cx="752" cy="182" r={56 + pulse * 5} fill="none" stroke={rgba(thermalHighlight, 0.34)} strokeWidth="2" />
          <circle cx="752" cy="182" r="37" fill="url(#topic-thermal-gradient)" opacity="0.88" />
          {cityBuildings.map((b, i) => <g key={i}>
            <rect x={b.x} y={620 - b.h} width={b.w} height={b.h} rx="3" fill="url(#topic-building-gradient)" stroke={rgba(palette.line, 0.95)} strokeWidth="2" />
            <path d={`M ${b.x + 8} ${620 - b.h + 12} L ${b.x + b.w - 8} ${620 - b.h + 12}`} stroke={rgba(palette.foreground, 0.16)} strokeWidth="2" />
            {windows(b, i)}
          </g>)}
          <path d="M0 622 L1000 622" stroke={palette.foreground} strokeOpacity="0.23" strokeWidth="3" />
          {[0, 1, 2, 3].map((i) => <path key={i} d={`M ${75 + i * 215} 400 C ${25 + i * 215} 345, ${150 + i * 215} 315, ${96 + i * 215} 260 S ${160 + i * 215} 208, ${125 + i * 215} 172`} fill="none" stroke={i % 2 ? thermalAccent : thermalHighlight} strokeWidth={3 + (i % 2)} strokeLinecap="round" strokeDasharray="12 16" strokeDashoffset={-frame * (1.8 + i * 0.3)} opacity={0.5 + reveal * 0.45} />)}
          <path d="M100 655 Q300 642 500 655 T900 655" fill="none" stroke={rgba(palette.accent, 0.44)} strokeWidth="2" />
          <g opacity="0.68">
            {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M ${80 + i * 118} 644 l18 -4 l18 4`} fill="none" stroke={palette.accent2} strokeWidth="2" />)}
          </g>
        </>
            ) : family === "city" ? (
        <>
          <circle cx="752" cy="182" r="190" fill="url(#topic-halo)" />
          <circle cx="752" cy="182" r={56 + pulse * 5} fill="none" stroke={rgba(palette.accent2, 0.28)} strokeWidth="2" />
          <circle cx="752" cy="182" r="28" fill="url(#topic-object-gradient)" opacity="0.8" />
          {cityBuildings.map((b, i) => <g key={i}>
            <rect x={b.x} y={620 - b.h} width={b.w} height={b.h} rx="3" fill="url(#topic-building-gradient)" stroke={rgba(palette.line, 0.95)} strokeWidth="2" />
            {windows(b, i)}
          </g>)}
          <path d="M0 622 L1000 622" stroke={palette.foreground} strokeOpacity="0.23" strokeWidth="3" />
          <path d="M45 590 C170 554 260 605 394 576 S700 558 950 592" fill="none" stroke={palette.accent} strokeWidth="5" strokeDasharray="16 12" strokeDashoffset={-frame * 1.4} strokeLinecap="round" />
          {[0,1,2,3,4].map(i => <circle key={i} cx={95+i*200} cy={578+Math.sin(frame/22+i)*8} r="7" fill={i%2?palette.accent2:palette.accent} />)}
        </>) : family === "artificial-intelligence" ? (
        <>
          <circle cx="500" cy="350" r="270" fill="url(#topic-halo)" />
          {[0,1,2,3,4,5,6,7,8,9,10,11].map(i => {
            const a = i * Math.PI / 6;
            const x = 500 + Math.cos(a) * (285 + 9 * Math.sin(frame / 11 + i));
            const y = 340 + Math.sin(a) * (245 + 7 * Math.cos(frame / 14 + i));
            return <g key={i}><path d={`M500 340 L${x} ${y}`} stroke={rgba(palette.accent,0.5)} strokeWidth="2" strokeDasharray="7 10" strokeDashoffset={-frame * 1.5}/><circle cx={x} cy={y} r={7+(i%3)} fill={i%3===0?palette.accent2:palette.accent} /></g>;
          })}
          <rect x="350" y="208" width="300" height="264" rx="28" fill="url(#topic-building-gradient)" stroke={palette.accent} strokeWidth="4" />
          {Array.from({length:8},(_,i)=><g key={i}><path d={`M${380+i*34} 208 v-26 M${380+i*34} 472 v26`} stroke={palette.accent2} strokeWidth="5" strokeLinecap="round"/><path d={`M350 ${238+i*29} h-26 M650 ${238+i*29} h26`} stroke={palette.accent2} strokeWidth="5" strokeLinecap="round"/></g>)}
          <g transform={`translate(500 338) rotate(${Math.sin(frame/30)*4})`}><circle r="94" fill="none" stroke={rgba(palette.accent2,0.7)} strokeWidth="2" strokeDasharray="4 12"/><circle r="61" fill="url(#topic-object-gradient)" opacity="0.22"/><path d="M-37 -21 L0 -42 L38 -20 L38 21 L0 43 L-37 21 Z" fill="none" stroke={palette.accent2} strokeWidth="4"/><circle cx="0" cy="0" r="12" fill={palette.accent}/><circle cx="-37" cy="-21" r="6" fill={palette.foreground}/><circle cx="38" cy="-20" r="6" fill={palette.foreground}/><circle cx="0" cy="43" r="6" fill={palette.foreground}/></g>
        </>
      ) : family === "solar-energy" ? (
        <>
          <circle cx="222" cy="164" r={77 + pulse * 5} fill="url(#topic-object-gradient)" opacity="0.7"/>
          {Array.from({length:12},(_,i)=>{const a=i*Math.PI/6;return <path key={i} d={`M${222+Math.cos(a)*100} ${164+Math.sin(a)*100} L${222+Math.cos(a)*130} ${164+Math.sin(a)*130}`} stroke={palette.accent2} strokeWidth="5" strokeLinecap="round" opacity={reveal}/>;})}
          <path d="M60 420 L660 326 L866 555 L250 632 Z" fill="url(#topic-building-gradient)" stroke={palette.line} strokeWidth="4"/>
          {Array.from({length:5},(_,i)=><path key={"r"+i} d={`M${101+i*118} ${414-i*19} L${294+i*107} ${616-i*16}`} stroke={palette.accent} strokeOpacity="0.68" strokeWidth="3"/>)}
          {Array.from({length:4},(_,i)=><path key={"c"+i} d={`M${78+i*148} ${447-i*24} L${838-i*3} ${425+i*37}`} stroke={palette.accent2} strokeOpacity="0.58" strokeWidth="3"/>)}
          <path d="M260 330 C380 255 454 263 524 315 S686 361 787 280" fill="none" stroke={palette.accent2} strokeWidth="5" strokeDasharray="12 14" strokeDashoffset={-frame*2} strokeLinecap="round"/>
          <path d="M775 250 l26 28 -36 14" fill="none" stroke={palette.accent2} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
        </>
      ) : family === "climate" ? (
        <>
          <circle cx="500" cy="350" r="250" fill="url(#topic-halo)"/>
          <g transform={`rotate(${-12+frame*0.12} 500 350)`}><circle cx="500" cy="350" r="185" fill="url(#topic-building-gradient)" stroke={palette.accent} strokeWidth="4"/><ellipse cx="500" cy="350" rx="88" ry="185" fill="none" stroke={palette.accent2} strokeWidth="3"/><ellipse cx="500" cy="350" rx="155" ry="65" fill="none" stroke={palette.accent2} strokeWidth="3"/><ellipse cx="500" cy="350" rx="177" ry="120" fill="none" stroke={palette.line} strokeWidth="2"/><path d="M330 300 Q420 260 500 300 T670 300 M330 405 Q420 365 500 405 T670 405" fill="none" stroke={palette.accent} strokeWidth="8" strokeLinecap="round" strokeDasharray="14 16" strokeDashoffset={-frame*2}/></g>
          {[0,1,2].map(i=><path key={i} d={`M${200+i*24} ${170+i*26} C${110+i*24} ${220+i*22} ${290+i*21} ${244+i*25} ${205+i*26} ${300+i*28}`} fill="none" stroke={palette.accent2} strokeWidth="4" strokeDasharray="10 13" strokeDashoffset={frame*1.4} opacity="0.75"/> )}
        </>
      ) : family === "biology" ? (
        <>
          <circle cx="500" cy="352" r="250" fill="url(#topic-halo)"/>
          <circle cx="500" cy="352" r="212" fill="url(#topic-building-gradient)" stroke={palette.accent} strokeWidth="5"/>
          {Array.from({length:26},(_,i)=>{const a=i*2.399;const r=22+(i%7)*25;return <g key={i}><circle cx={500+Math.cos(a)*r} cy={352+Math.sin(a)*r} r={4+(i%4)} fill={i%3===0?palette.accent2:palette.accent} opacity={0.35+0.4*pulse}/></g>;})}
          <circle cx="500" cy="352" r="76" fill={palette.accent2} fillOpacity="0.18" stroke={palette.accent2} strokeWidth="3"/>
          <circle cx="500" cy="352" r="29" fill={palette.accent} fillOpacity="0.68"/>
          <path d={Array.from({length:17},(_,i)=>{const y=118+i*29;return `M${390+Math.sin(i/2)*55} ${y} Q500 ${y+12} ${610-Math.sin(i/2)*55} ${y+29}`;}).join(" ")} fill="none" stroke={palette.accent2} strokeWidth="5" strokeLinecap="round" strokeDasharray="8 12" strokeDashoffset={-frame*2}/>
          <path d={Array.from({length:17},(_,i)=>{const y=118+i*29;return `M${610-Math.sin(i/2)*55} ${y} Q500 ${y+12} ${390+Math.sin(i/2)*55} ${y+29}`;}).join(" ")} fill="none" stroke={palette.accent} strokeWidth="5" strokeLinecap="round" strokeDasharray="8 12" strokeDashoffset={frame*2}/>
        </>
      ) : family === "space" ? (
        <>
          <circle cx="500" cy="350" r="184" fill="url(#topic-halo)"/>
          <ellipse cx="500" cy="350" rx="362" ry="138" transform={`rotate(-24 500 350)`} fill="none" stroke={palette.accent2} strokeOpacity="0.6" strokeWidth="3"/>
          <ellipse cx="500" cy="350" rx="284" ry="205" transform={`rotate(32 500 350)`} fill="none" stroke={palette.line} strokeWidth="3" strokeDasharray="4 12"/>
          <circle cx="500" cy="350" r="116" fill="url(#topic-object-gradient)" opacity="0.82"/>
          <path d="M405 326 Q500 250 596 325 Q511 435 405 326Z" fill={rgba(palette.background,0.26)}/>
          <circle cx={500+338*Math.cos(frame/50)} cy={350+125*Math.sin(frame/50)} r="18" fill={palette.accent2} stroke={palette.foreground} strokeOpacity="0.5" strokeWidth="2"/>
          {Array.from({length:26},(_,i)=><circle key={i} cx={(i*197+61)%960+20} cy={(i*113+29)%630+30} r={i%4===0?3:1.6} fill={palette.foreground} opacity={0.2+0.45*(0.5+0.5*Math.sin(frame/20+i))}/>)}
        </>
      ) : family === "finance" ? (
        <>
          <path d="M76 610 H928" stroke={palette.line} strokeWidth="3"/>
          {[0,1,2,3,4,5,6].map(i=>{const h=110+i*48;const x=104+i*118;return <g key={i}><rect x={x} y={610-h*reveal} width="70" height={h*reveal} rx="4" fill={i%3===0?palette.accent2:palette.accent} fillOpacity={0.35+i*0.07}/><path d={`M${x+8} ${610-h*reveal+20} H${x+62}`} stroke={palette.foreground} strokeOpacity="0.45" strokeWidth="2"/></g>;})}
          <path d="M95 500 C210 460 255 405 360 422 S545 320 640 332 S815 204 906 159" fill="none" stroke={palette.foreground} strokeWidth="5" strokeLinecap="round" strokeDasharray="1200" strokeDashoffset={1200*(1-reveal)} />
          <path d="M865 154 l44 2 -13 40" fill="none" stroke={palette.accent2} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
          {[0,1,2,3,4,5].map(i=><circle key={i} cx={95+i*160} cy={512-i*59+Math.sin(frame/12+i)*7} r="7" fill={palette.accent2}/>)}
        </>
      ) : family === "cybersecurity" ? (
        <>
          <circle cx="500" cy="346" r="250" fill="url(#topic-halo)"/>
          <path d="M500 109 L702 192 V350 C702 468 622 544 500 607 C378 544 298 468 298 350 V192Z" fill="url(#topic-building-gradient)" stroke={palette.accent} strokeWidth="6" strokeLinejoin="round"/>
          <path d="M500 182 L630 236 V348 C630 432 575 485 500 530 C425 485 370 432 370 348 V236Z" fill={rgba(palette.accent,0.1)} stroke={palette.accent2} strokeWidth="3"/>
          <rect x="450" y="325" width="100" height="92" rx="14" fill="url(#topic-object-gradient)" />
          <path d="M466 325 V300 A34 34 0 0 1 534 300 V325" fill="none" stroke={palette.foreground} strokeWidth="10" strokeLinecap="round"/>
          <circle cx="500" cy="363" r="9" fill={palette.background}/><path d="M500 372 V393" stroke={palette.background} strokeWidth="8" strokeLinecap="round"/>
          {Array.from({length:8},(_,i)=>{const x=84+i*118;return <g key={i}><path d={`M${x} 115 v80 l${(500-x)*0.22} 40`} fill="none" stroke={palette.line} strokeWidth="2" strokeDasharray="5 9" strokeDashoffset={frame*1.5}/><circle cx={x} cy="115" r="6" fill={palette.accent2} opacity={0.42+0.5*pulse}/></g>;})}
        </>
      ) : family === "water" ? (
        <>
          <circle cx="750" cy="188" r="170" fill="url(#topic-halo)"/>
          <path d={Array.from({length:7},(_,i)=>{const x=i*165-30;return `M${x} ${370+i%2*22} C${x+38} ${315+i%3*25} ${x+82} ${420-i%3*18} ${x+130} ${360+i%2*22} S${x+205} ${332+i%3*22} ${x+242} ${378+i%2*18}`;}).join(" ")} fill="none" stroke={palette.accent} strokeWidth="6" strokeOpacity={0.45+0.4*pulse} strokeDasharray="18 14" strokeDashoffset={-frame*2}/>
          <path d="M500 110 C452 196 366 268 366 370 C366 460 425 518 500 518 C575 518 634 460 634 370 C634 268 548 196 500 110Z" fill="url(#topic-object-gradient)" fillOpacity="0.58" stroke={palette.accent2} strokeWidth="4"/>
          <path d="M416 365 Q500 330 584 365" fill="none" stroke={palette.foreground} strokeWidth="4" strokeOpacity="0.8" strokeLinecap="round"/>
          <path d="M427 405 Q500 372 573 405" fill="none" stroke={palette.foreground} strokeWidth="4" strokeOpacity="0.6" strokeLinecap="round"/>
          <circle cx="500" cy="367" r={22+8*pulse} fill={palette.accent2} fillOpacity="0.4"/>
        </>
      ) : (
        <>
          <circle cx="500" cy="350" r="245" fill="url(#topic-halo)"/>
          <g transform={`translate(500 350) rotate(${-8+frame*0.1})`}>
            <path d="M0 -238 L210 -118 L210 118 L0 238 L-210 118 L-210 -118Z" fill="url(#topic-building-gradient)" stroke={palette.accent} strokeWidth="4"/>
            <path d="M0 -174 L154 -88 L154 88 L0 174 L-154 88 L-154 -88Z" fill="none" stroke={palette.accent2} strokeWidth="3"/>
            <path d="M-100 -70 L0 -132 L102 -70 L102 48 L0 110 L-100 48Z" fill="url(#topic-object-gradient)" fillOpacity="0.36" stroke={palette.foreground} strokeOpacity="0.55" strokeWidth="3"/>
            <circle cx="0" cy="0" r={32+7*pulse} fill={palette.accent2} fillOpacity="0.7"/>
          </g>
          {Array.from({length:10},(_,i)=>{const a=i*Math.PI/5;return <circle key={i} cx={500+Math.cos(a)*300} cy={350+Math.sin(a)*250} r={5+i%3} fill={i%2?palette.accent:palette.accent2} opacity={0.3+0.5*reveal}/>;})}
        </>
      )}
    </svg>
  );
};

const TopicSceneGraphic: React.FC<{ scene: MotionScene; family: NonNullable<MotionVideoProps["visualFamily"]>; palette: MotionPalette; frame: number }> = ({ scene, family, palette, frame }) => {
  const text = (scene.kicker + " " + scene.title).toLowerCase();
  const progress = interpolate(frame, [0, 34], [0, 1], clamp);
  const pulse = 0.5 + Math.sin(frame / 12) * 0.5;
  const isCity = family === "city" || family === "city-heat";
  const main = family === "city-heat" ? "#FF8058" : palette.accent;
  const alt = family === "city-heat" ? "#FFD166" : palette.accent2;
  const stage = /shade|shadow|سایه/.test(text) ? "shade"
    : /route|path|مسیر/.test(text) ? "route"
    : /network|blocks|connect|شبکه|بلوک/.test(text) ? "network"
    : /balance|time|day|صبح|ظهر|عصر|زمان/.test(text) ? "time"
    : /airflow|rising|heat|حرارت|هوای گرم|جریان هوا/.test(text) ? "flow"
    : /sunlight|surface|street|solar|نور خورشید|سطح زمین|خیابان|پنل|نور به سلول/.test(text) ? "source"
    : /input|example|ورودی|نمونه/.test(text) ? "input"
    : /model|layer|weight|مدل|لایه|وزن/.test(text) ? "model"
    : /output|prediction|خروجی|پیش‌بینی/.test(text) ? "output"
    : /feedback|evaluation|بازخورد|ارزیابی/.test(text) ? "feedback"
    : /human|people|oversight|انسان|نظارت/.test(text) ? "human"
    : /edge|test|آزمون|حالت مرزی/.test(text) ? "edge"
    : /storage|battery|ذخیره|باتری/.test(text) ? "storage"
    : /current|inverter|جریان برق|اینورتر/.test(text) ? "current"
    : /demand|مصرف|تقاضا/.test(text) ? "demand"
    : /trade|cost|موازنه|هزینه/.test(text) ? "trade"
    : "system";
  const nodes = Array.from({ length: 7 }, (_, i) => ({
    x: 120 + i * 126,
    y: 250 + Math.sin(i * 1.3 + frame / 22) * 54,
    r: 10 + (i % 3) * 4
  }));
  const cityBuildings = Array.from({length:7},(_,i)=>({x:80+i*125,y:310+(i%3)*28,w:90,h:290-(i%3)*28}));
  return (
    <svg viewBox="0 0 1000 700" role="img" aria-label={family + " explanatory illustration"} style={{ width:"100%", height:"100%", overflow:"visible" }}>
      <defs>
        <linearGradient id="stage-surface" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={palette.panel}/><stop offset="100%" stopColor={palette.background}/>
        </linearGradient>
        <linearGradient id="stage-energy" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={alt}/><stop offset="100%" stopColor={main}/>
        </linearGradient>
      </defs>
      {isCity && stage === "source" ? (
        <>
          <circle cx="790" cy="120" r={60+pulse*7} fill={alt} fillOpacity="0.22"/>
          <circle cx="790" cy="120" r="42" fill="url(#stage-energy)"/>
          {Array.from({length:10},(_,i)=>{const a=i*Math.PI/5;return <path key={i} d={"M"+(790+Math.cos(a)*55)+" "+(120+Math.sin(a)*55)+" L"+(790+Math.cos(a)*78)+" "+(120+Math.sin(a)*78)} stroke={alt} strokeWidth="4" strokeLinecap="round"/>;})}
          {cityBuildings.map((b,i)=><g key={i}><rect x={b.x} y={b.y} width={b.w} height={b.h} rx="4" fill="url(#stage-surface)" stroke={palette.line} strokeWidth="3"/>{Array.from({length:8},(_,j)=><rect key={j} x={b.x+14+(j%3)*23} y={b.y+20+Math.floor(j/3)*32} width="8" height="13" fill={alt} fillOpacity="0.5"/>)}</g>)}
          <path d={"M790 175 C690 250 600 245 520 335 S340 420 180 560"} fill="none" stroke={main} strokeWidth="7" strokeDasharray="15 17" strokeDashoffset={-frame*2}/>
        </>
      ) : isCity && stage === "flow" ? (
        <>
          {Array.from({length:6},(_,i)=><path key={i} d={"M"+(50+i*40)+" 585 C"+(160+i*30)+" 470 "+(90+i*60)+" 390 "+(230+i*50)+" 330 S"+(320+i*40)+" 190 "+(450+i*45)+" 140"} fill="none" stroke={i%2?main:alt} strokeWidth={4+i%2} strokeLinecap="round" strokeDasharray="14 18" strokeDashoffset={-frame*(1.3+i*0.2)}/>)}
          {cityBuildings.map((b,i)=><rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} rx="4" fill="url(#stage-surface)" stroke={palette.line} strokeWidth="3"/>)}
          <circle cx="825" cy="122" r={52+pulse*7} fill="url(#stage-energy)" fillOpacity="0.9"/>
        </>
      ) : isCity && stage === "shade" ? (
        <>
          <path d="M60 535 H940 L870 625 H130Z" fill="url(#stage-surface)" stroke={palette.line} strokeWidth="3"/>
          <path d="M145 540 L245 350 L360 540 M640 540 L745 350 L860 540" fill={alt} fillOpacity="0.13"/>
          {[245,745].map((x,i)=><g key={x}><path d={"M"+x+" 520 V350"} stroke={palette.accent} strokeWidth="12" strokeLinecap="round"/><circle cx={x} cy="305" r={78+Math.sin(frame/15+i)*4} fill={i?palette.accent:alt} fillOpacity="0.78"/><circle cx={x-38} cy="330" r="42" fill={i?palette.accent:alt} fillOpacity="0.65"/><circle cx={x+40} cy="330" r="44" fill={i?palette.accent:alt} fillOpacity="0.65"/></g>)}
          <path d={"M360 555 Q500 "+(510+Math.sin(frame/17)*6)+" 640 555"} stroke={main} strokeWidth="7" strokeDasharray="14 16" strokeDashoffset={-frame*2} fill="none"/>
        </>
      ) : isCity && stage === "network" ? (
        <>
          <path d="M90 140 C290 220 180 420 410 450 S620 170 870 260 S800 500 560 565" fill="none" stroke={palette.line} strokeWidth="34" strokeLinecap="round" opacity="0.34"/>
          <path d="M90 140 C290 220 180 420 410 450 S620 170 870 260 S800 500 560 565" fill="none" stroke={main} strokeWidth="5" strokeDasharray="14 18" strokeDashoffset={-frame*2}/>
          {[{x:90,y:140},{x:260,y:280},{x:410,y:450},{x:620,y:170},{x:870,y:260},{x:560,y:565},{x:750,y:440}].map((p,i)=><g key={i}><circle cx={p.x} cy={p.y} r={22+Math.sin(frame/15+i)*3} fill={palette.panel} stroke={i%2?main:alt} strokeWidth="5"/><circle cx={p.x} cy={p.y} r="6" fill={i%2?main:alt}/></g>)}
        </>
      ) : isCity && stage === "time" ? (
        <>
          <path d="M110 500 A390 300 0 0 1 890 500" fill="none" stroke={palette.line} strokeWidth="7" strokeDasharray="8 12"/>
          {[0,1,2,3,4,5,6,7,8].map(i=>{const x=110+i*97.5;const y=500-300*Math.sin(i*Math.PI/8);return <g key={i}><circle cx={x} cy={y} r="8" fill={palette.accent}/>{i%2===0?<path d={"M"+x+" "+(y+16)+" v25"} stroke={palette.line} strokeWidth="3"/>:null}</g>;})}
          <circle cx={500+315*Math.cos(frame/70)} cy={500-240*Math.sin(frame/70)} r="42" fill="url(#stage-energy)"/>
          <path d="M100 610 H900" stroke={palette.line} strokeWidth="3"/>
        </>
      ) : isCity && stage === "route" ? (
        <>
          {cityBuildings.map((b,i)=><g key={i}><rect x={b.x} y={b.y+45} width={b.w} height={b.h-45} rx="4" fill="url(#stage-surface)" stroke={palette.line} strokeWidth="2"/><circle cx={b.x+45} cy={b.y+15} r="24" fill={palette.accent} fillOpacity="0.6"/></g>)}
          <path d={"M80 575 C160 490 240 540 320 470 S470 420 540 465 S700 350 780 390 S860 315 930 280"} fill="none" stroke={alt} strokeWidth="11" strokeLinecap="round" strokeDasharray="18 15" strokeDashoffset={-frame*2.2}/>
          <circle cx={530+Math.sin(frame/20)*10} cy="465" r="18" fill={alt} stroke={palette.background} strokeWidth="5"/>
        </>
      ) : isCity ? (
        <>
          <path d="M80 600 H920" stroke={palette.line} strokeWidth="3"/>
          {cityBuildings.map((b,i)=><g key={i}><rect x={b.x} y={b.y} width={b.w} height={b.h} rx="4" fill="url(#stage-surface)" stroke={palette.line} strokeWidth="2"/><path d={"M"+(b.x+12)+" "+(b.y+24)+" h60 M"+(b.x+12)+" "+(b.y+55)+" h60"} stroke={palette.accent2} strokeWidth="4" opacity="0.45"/></g>)}
          <path d="M120 560 C290 490 340 520 480 455 S740 440 880 350" fill="none" stroke={main} strokeWidth="7" strokeDasharray="14 18" strokeDashoffset={-frame*2}/>
        </>
      ) : family === "artificial-intelligence" && stage === "input" ? (
        <>
          {[0,1,2,3].map(i=><g key={i} transform={"translate("+(80+i*220)+" "+(190+(i%2)*90)+")"}><rect width="160" height="170" rx="18" fill="url(#stage-surface)" stroke={i%2?palette.accent:palette.accent2} strokeWidth="3"/>{Array.from({length:4},(_,j)=><path key={j} d={"M25 "+(42+j*30)+" h"+(80+(j%2)*28)} stroke={palette.line} strokeWidth="8" strokeLinecap="round"/>)}</g>)}
          {[0,1,2].map(i=><path key={i} d={"M"+(210+i*220)+" 280 h35 l-12 -12 m12 12 l-12 12"} fill="none" stroke={alt} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>)}
        </>
      ) : family === "artificial-intelligence" && stage === "human" ? (
        <>
          <circle cx="500" cy="215" r="65" fill="url(#stage-energy)"/>
          <path d="M375 525 C380 365 425 315 500 315 S620 365 625 525Z" fill="url(#stage-surface)" stroke={palette.accent} strokeWidth="5"/>
          <circle cx="500" cy="215" r="106" fill="none" stroke={palette.line} strokeWidth="3" strokeDasharray="7 13" strokeDashoffset={-frame}/>
          {nodes.slice(0,5).map((n,i)=><g key={i}><path d={"M"+n.x+" "+n.y+" L"+(360+i*56)+" 340"} stroke={palette.line} strokeWidth="3" strokeDasharray="7 10"/><circle cx={n.x} cy={n.y} r="10" fill={palette.accent2}/></g>)}
        </>
      ) : family === "artificial-intelligence" && stage === "feedback" ? (
        <>
          <circle cx="500" cy="340" r="125" fill="url(#stage-surface)" stroke={palette.accent} strokeWidth="5"/>
          <circle cx="500" cy="340" r="70" fill="none" stroke={palette.accent2} strokeWidth="4" strokeDasharray="10 12" strokeDashoffset={-frame*1.6}/>
          {nodes.map((n,i)=><g key={i}><path d={"M"+n.x+" "+n.y+" L500 340"} stroke={palette.line} strokeWidth="3"/><circle cx={n.x} cy={n.y} r={n.r} fill={i%2?palette.accent:palette.accent2}/></g>)}
          <path d="M625 390 C730 475 690 550 600 555 M620 535 L600 555 L628 565" fill="none" stroke={alt} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" strokeDashoffset={-frame}/>
        </>
      ) : family === "artificial-intelligence" && stage === "output" ? (
        <>
          <rect x="70" y="250" width="210" height="160" rx="18" fill="url(#stage-surface)" stroke={palette.line} strokeWidth="3"/>
          <path d="M280 330 H430 M415 312 L435 330 L415 348" stroke={palette.accent} strokeWidth="5" fill="none"/>
          <rect x="440" y="210" width="220" height="240" rx="24" fill="url(#stage-surface)" stroke={palette.accent2} strokeWidth="4"/>
          {[0,1,2,3].map(i=><g key={i}><rect x="475" y={255+i*42} width="150" height="12" rx="6" fill={palette.line}/><rect x="475" y={255+i*42} width={(92+i*13)*progress} height="12" rx="6" fill={palette.accent}/></g>)}
          <path d="M660 330 H775" stroke={alt} strokeWidth="5" strokeDasharray="11 14" strokeDashoffset={frame*2}/>
          <circle cx="835" cy="330" r="54" fill={alt} fillOpacity="0.22" stroke={alt} strokeWidth="4"/>
          <path d="M810 330 l18 18 l35 -41" fill="none" stroke={alt} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"/>
        </>
      ) : family === "artificial-intelligence" && stage === "edge" ? (
        <>
          {nodes.map((n,i)=><g key={i}><path d={"M500 350 L"+n.x+" "+n.y} stroke={i%2?palette.accent:palette.line} strokeWidth="3" strokeDasharray="10 12"/><circle cx={n.x} cy={n.y} r={n.r} fill={i===3?main:(i%2?palette.accent:palette.accent2)}/></g>)}
          <circle cx="500" cy="350" r="210" fill="none" stroke={palette.line} strokeWidth="3" strokeDasharray="6 14"/>
        </>
      ) : family === "artificial-intelligence" ? (
        <>
          {nodes.map((n,i)=><g key={i}>{nodes.slice(i+1).map((p,j)=><path key={j} d={"M"+n.x+" "+n.y+" L"+p.x+" "+p.y} stroke={palette.line} strokeWidth="2" opacity="0.5"/>)}<circle cx={n.x} cy={n.y} r={n.r+2*pulse} fill={i%2?palette.accent:palette.accent2}/></g>)}
          <circle cx="500" cy="350" r={185+Math.sin(frame/18)*8} fill="none" stroke={palette.accent} strokeWidth="3" strokeDasharray="8 16" strokeDashoffset={-frame*1.7}/>
        </>
      ) : family === "solar-energy" && stage === "source" ? (
        <>
          <circle cx="200" cy="180" r="80" fill="url(#stage-energy)"/>
          {Array.from({length:12},(_,i)=>{const a=i*Math.PI/6;return <path key={i} d={"M"+(200+Math.cos(a)*98)+" "+(180+Math.sin(a)*98)+" L"+(200+Math.cos(a)*128)+" "+(180+Math.sin(a)*128)} stroke={alt} strokeWidth="5" strokeLinecap="round"/>;})}
          <path d={"M270 260 L430 390 H560"} fill="none" stroke={alt} strokeWidth="8" strokeDasharray="14 16" strokeDashoffset={-frame*2} strokeLinecap="round"/>
          <path d="M450 400 L765 335 L910 540 L570 600Z" fill="url(#stage-surface)" stroke={palette.line} strokeWidth="4"/>
          {Array.from({length:4},(_,i)=><path key={i} d={"M"+(480+i*65)+" "+(393-i*13)+" L"+(605+i*71)+" "+(590-i*12)} stroke={palette.accent} strokeWidth="3"/>)}
        </>
      ) : family === "solar-energy" && stage === "storage" ? (
        <>
          <rect x="390" y="150" width="220" height="390" rx="28" fill="url(#stage-surface)" stroke={palette.accent} strokeWidth="5"/>
          <rect x="450" y="120" width="100" height="32" rx="8" fill={palette.line}/>
          {[0,1,2,3].map(i=><rect key={i} x="425" y={200+i*78} width="150" height="55" rx="10" fill={i<Math.floor(frame/18)%5?alt:palette.line} opacity={0.65+0.2*pulse}/>)}
          <path d="M260 340 H365 M635 340 H740" stroke={palette.accent2} strokeWidth="6" strokeDasharray="13 16" strokeDashoffset={-frame*2}/>
          <circle cx="220" cy="340" r="52" fill="url(#stage-energy)"/><circle cx="780" cy="340" r="52" fill={palette.accent} fillOpacity="0.22" stroke={palette.accent} strokeWidth="4"/>
        </>
      ) : family === "solar-energy" && stage === "current" ? (
        <>
          {[0,1,2,3].map(i=><g key={i} transform={"translate("+(55+i*240)+" 240)"}><rect width="185" height="225" rx="16" fill="url(#stage-surface)" stroke={i===1?alt:palette.line} strokeWidth={i===1?5:3}/><path d="M45 80 h95 M45 115 h70 M45 150 h110" stroke={palette.line} strokeWidth="8" strokeLinecap="round"/><circle cx="92" cy="42" r="12" fill={i===1?alt:main}/></g>)}
          {[0,1,2].map(i=><path key={i} d={"M"+(240+i*240)+" 350 h38 l-14 -14 m14 14 l-14 14"} fill="none" stroke={alt} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>)}
        </>
      ) : family === "solar-energy" && stage === "demand" ? (
        <>
          <path d="M100 560 H920 M100 170 V560" stroke={palette.line} strokeWidth="3"/>
          <path d="M100 475 C220 460 260 355 370 390 S520 490 620 330 S790 245 920 180" fill="none" stroke={palette.accent} strokeWidth="6" strokeDasharray="1000" strokeDashoffset={1000*(1-progress)}/>
          <path d="M100 420 C230 410 300 450 390 430 S560 345 660 400 S800 430 920 350" fill="none" stroke={alt} strokeWidth="6" strokeDasharray="1000" strokeDashoffset={1000*(1-progress)}/>
          {Array.from({length:7},(_,i)=><circle key={i} cx={100+i*136} cy={450-Math.sin(i*1.3+frame/25)*90} r="8" fill={main}/>)}
        </>
      ) : family === "solar-energy" && stage === "trade" ? (
        <>
          {[0,1,2].map(i=><g key={i}><rect x={120+i*285} y="230" width="220" height="250" rx="18" fill="url(#stage-surface)" stroke={palette.line} strokeWidth="3"/><circle cx={230+i*285} cy="305" r="35" fill={i===1?main:alt} fillOpacity="0.2" stroke={i===1?main:alt} strokeWidth="4"/><path d={"M"+(170+i*285)+" 380 h120 M"+(170+i*285)+" 420 h"+(70+i*18)} stroke={palette.line} strokeWidth="8" strokeLinecap="round"/></g>)}
        </>
      ) : family === "solar-energy" ? (
        <>
          <circle cx="160" cy="230" r="58" fill="url(#stage-energy)"/>
          <path d="M230 240 H375 M355 220 L375 240 L355 260" stroke={alt} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          <path d="M405 260 L625 210 L770 405 L545 450Z" fill="url(#stage-surface)" stroke={palette.line} strokeWidth="4"/>
          {Array.from({length:4},(_,i)=><path key={i} d={"M"+(430+i*45)+" "+(252-i*10)+" L"+(565+i*48)+" "+(443-i*11)} stroke={main} strokeWidth="3"/>)}
          <path d="M770 405 H870 V540 H770Z" fill="url(#stage-surface)" stroke={palette.accent} strokeWidth="4"/>
          <path d="M795 470 h50 M820 445 v50" stroke={alt} strokeWidth="5" strokeLinecap="round"/>
        </>
      ) : (
        <>
          {nodes.map((n,i)=><g key={i}><path d={"M"+n.x+" "+n.y+" C"+(n.x+50)+" "+(n.y-40)+" "+(n.x+80)+" "+(n.y+50)+" "+(n.x+120)+" "+n.y} stroke={palette.line} strokeWidth="3" fill="none" strokeDasharray="8 12" strokeDashoffset={-frame}/><circle cx={n.x} cy={n.y} r={n.r} fill={i%2?palette.accent:palette.accent2}/></g>)}
          <circle cx="500" cy="350" r={185+Math.sin(frame/18)*8} fill="none" stroke={palette.accent} strokeWidth="3" strokeDasharray="8 16"/>
        </>
      )}
    </svg>
  );
};

const LayoutGraphic: React.FC<{ scene: MotionScene; palette: MotionPalette; frame: number; vertical: boolean; typography: MotionVideoProps["typography"]; rtl: boolean; visualFamily: NonNullable<MotionVideoProps["visualFamily"]> }> = ({ scene, palette, frame, vertical, typography, rtl, visualFamily }) => {
  if (visualFamily !== "general" && !["hero", "editorial", "quote", "outro"].includes(scene.layout)) {
    return <TopicSceneGraphic scene={scene} family={visualFamily} palette={palette} frame={frame} />;
  }
  switch (scene.layout) {
    case "hero":
      return <TopicHeroGraphic family={visualFamily} palette={palette} frame={frame} />;
    case "diagram":
      return <DiagramGraphic scene={scene} palette={palette} frame={frame} vertical={vertical} typography={typography} />;
    case "timeline":
      return <TimelineGraphic scene={scene} palette={palette} frame={frame} vertical={vertical} typography={typography} />;
    case "compare":
      return <CompareGraphic scene={scene} palette={palette} frame={frame} typography={typography} />;
    case "data":
      return <DataGraphic scene={scene} palette={palette} frame={frame} typography={typography} />;
    case "particles":
      return <ParticleGraphic scene={scene} palette={palette} frame={frame} typography={typography} />;
    case "map":
      return <MapGraphic scene={scene} palette={palette} frame={frame} typography={typography} />;
    case "interface":
      return <InterfaceGraphic scene={scene} palette={palette} frame={frame} typography={typography} />;
    case "quote":
      return <QuoteGraphic scene={scene} palette={palette} frame={frame} typography={typography} rtl={rtl} />;
    case "outro":
      return (
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", position: "relative", padding: "5%" }}>
          <div style={{ fontFamily: typography.mono, color: palette.accent, fontSize: 19, letterSpacing: 4 }}>TAKE THE IDEA WITH YOU</div>
          <div dir={rtl ? "rtl" : "auto"} style={{ fontFamily: typography.display, color: palette.foreground, fontSize: fitMotionFontSize(scene.title, vertical ? 68 : 84, vertical ? 38 : 44), fontWeight: 800, lineHeight: 1.02, marginTop: 26, textWrap: "balance" as CSSProperties["textWrap"] }}>{scene.title}</div>
          {scene.body ? <div dir={rtl ? "rtl" : "auto"} style={{ maxWidth: 720, marginTop: 24, color: palette.muted, fontFamily: typography.body, fontSize: fitMotionFontSize(scene.body, 25, 17), lineHeight: 1.45 }}>{scene.body}</div> : null}
          <div style={{ marginTop: 34, width: 90, height: 3, background: palette.accent2, transform: "scaleX(" + interpolate(frame, [0, 24], [0, 1], clamp) + ")" }} />
        </div>
      );
    case "editorial":
    default:
      return (
        <div style={{ height: "100%", width: "100%", padding: "6%", display: "flex", flexDirection: "column", justifyContent: "center", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "9%", right: "3%", fontFamily: typography.display, fontSize: vertical ? 100 : 180, color: rgba(palette.accent, 0.12), fontWeight: 900, transform: "translateX(" + interpolate(frame, [0, 80], [50, -40], clamp) + "px)" }}>MOTION</div>
          <div dir={rtl ? "rtl" : "auto"} style={{ position: "relative", fontFamily: typography.display, fontWeight: 800, fontSize: fitMotionFontSize(scene.title, vertical ? 72 : 104, vertical ? 38 : 48), lineHeight: 0.97, color: palette.foreground, maxWidth: "94%", textWrap: "balance" as CSSProperties["textWrap"] }}>{scene.title}</div>
          <div style={{ width: "36%", minWidth: 100, height: 4, marginTop: 26, background: palette.accent, transform: "scaleX(" + interpolate(frame, [0, 22], [0, 1], clamp) + ")", transformOrigin: rtl ? "right" : "left" }} />
          {scene.body ? <div dir={rtl ? "rtl" : "auto"} style={{ fontFamily: typography.body, color: palette.muted, fontSize: fitMotionFontSize(scene.body, vertical ? 25 : 28, vertical ? 16 : 18), lineHeight: 1.45, marginTop: 24, maxWidth: 840 }}>{scene.body}</div> : null}
        </div>
      );
  }
};

const SceneView: React.FC<{
  scene: MotionScene;
  palette: MotionPalette;
  typography: MotionVideoProps["typography"];
  props: MotionVideoProps;
  index: number;
  sceneCount: number;
  offset: number;
}> = ({ scene, palette, typography, props, index, sceneCount, offset }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const vertical = height > width;
  const rtl = isRtlLanguage(props.language);
  const captionTheme = resolveCaptionStyle(props.captionStyle || "cinematic");
  const camera = getCameraMotion(props.styleId, frame, scene.durationInFrames, index);
  const entrance = interpolate(frame, [0, 18], [0, 1], clamp);
  const sceneProgress = (offset + frame) / Math.max(1, props.durationInFrames);
  const transition = scene.transition || (index % 4 === 0 ? "wipe" : index % 4 === 1 ? "scale" : index % 4 === 2 ? "split" : "fade");
  const contentOpacity = transition === "fade" ? entrance : 1;
  const wipe = interpolate(frame, [0, 18], [0, 100], clamp);
  const zoom = interpolate(frame, [0, 22], [0.95, 1], clamp);
  const clipPath = transition === "wipe" ? "inset(0 " + (100 - wipe) + "% 0 0)" : transition === "split" ? "inset(0 0 0 " + (50 * (1 - entrance)) + "%)" : "none";
  const margin = vertical ? "6%" : "7.5%";
  const typographyLed = ["editorial", "quote", "outro"].includes(scene.layout);
  const mainGraphicWidth = typographyLed ? "100%" : vertical ? "92%" : "53%";
  const textWidth = vertical ? "100%" : "43%";
  const horizontalTextAlign = rtl ? "flex-end" : "flex-start";

  return (
    <AbsoluteFill>
      <SceneBackdrop palette={palette} frame={frame} index={index} styleId={props.styleId} />
      {camera.lightSweep ? (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "-18%",
            bottom: "-18%",
            left: camera.sweepX + "%",
            width: "18%",
            transform: "skewX(-18deg)",
            background: "linear-gradient(90deg, transparent 0%, " + rgba(palette.accent2, 0.025) + " 36%, " + rgba(palette.accent, 0.07) + " 52%, transparent 100%)",
            opacity: 0.82,
            pointerEvents: "none",
            zIndex: 1
          }}
        />
      ) : null}
      <AbsoluteFill style={{ clipPath, opacity: contentOpacity, transform: transition === "scale" ? "scale(" + zoom + ")" : "none" }}>
        <div style={{ position: "absolute", top: 34, left: margin, right: margin, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 34, height: 3, background: palette.accent }} />
            <div style={{ fontFamily: typography.mono, fontSize: 15, color: palette.muted, letterSpacing: rtl ? 0 : 3 }}>MOTION STUDIO / ORIGINAL FILM</div>
          </div>
          <div style={{ fontFamily: typography.mono, fontSize: 15, color: palette.muted }}>{String(index + 1).padStart(2, "0")} / {String(sceneCount).padStart(2, "0")}</div>
        </div>

        <div
          style={{
            position: "absolute",
            top: vertical ? "13%" : "16%",
            bottom: vertical ? "12%" : "13%",
            left: margin,
            right: margin,
            display: "flex",
            flexDirection: vertical ? "column" : "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: typographyLed ? 0 : vertical ? 20 : 48
          }}
        >
          {!typographyLed ? (
            <div style={{ width: textWidth, height: vertical ? "42%" : "100%", display: "flex", alignItems: "center", justifyContent: horizontalTextAlign, zIndex: 3 }}>
              <SceneText scene={scene} palette={palette} typography={typography} rtl={rtl} vertical={vertical} frame={frame} fps={fps} />
            </div>
          ) : null}
          <div style={{ width: mainGraphicWidth, height: vertical && !typographyLed ? "47%" : "100%", minHeight: vertical ? 250 : undefined, position: "relative", zIndex: 2, overflow: "visible", transform: "translate3d(" + camera.translateX + "px, " + camera.translateY + "px, 0) scale(" + camera.scale + ")", transformOrigin: index % 2 ? "54% 48%" : "46% 52%" }}>
            <LayoutGraphic scene={scene} palette={palette} frame={frame} vertical={vertical} typography={typography} rtl={rtl} visualFamily={props.visualFamily || "general"} />
          </div>
        </div>

        {props.captionsEnabled && scene.audioSrc && scene.narration ? (
          <div
            dir={rtl ? "rtl" : "auto"}
            style={{
              position: "absolute",
              left: margin,
              right: margin,
              bottom: 76,
              display: "flex",
              justifyContent: "center",
              zIndex: 5,
              pointerEvents: "none"
            }}
          >
            <div
              style={{
                maxWidth: vertical ? "96%" : "78%",
                minWidth: vertical ? "56%" : "38%",
                minHeight: vertical ? 58 : 62,
                padding: vertical ? captionTheme.verticalPadding : captionTheme.horizontalPadding,
                background: rgba(palette.background, captionTheme.backgroundAlpha),
                border: captionTheme.borderWidth
                  ? captionTheme.borderWidth + "px solid " + rgba(palette.foreground, captionTheme.borderAlpha)
                  : "none",
                borderBottom: captionTheme.id === "broadcast"
                  ? "4px solid " + palette.accent
                  : undefined,
                borderRadius: captionTheme.borderRadius,
                color: palette.foreground,
                fontFamily: typography.body,
                fontSize: vertical ? captionTheme.verticalFontSize : captionTheme.horizontalFontSize,
                fontWeight: captionTheme.fontWeight,
                lineHeight: 1.34,
                textAlign: "center",
                whiteSpace: "pre-wrap",
                textShadow: captionTheme.textShadow,
                boxShadow: captionTheme.id === "minimal"
                  ? "none"
                  : "0 8px 30px " + rgba(palette.background, 0.22)
              }}
            >
              {captionForFrame(scene.narration, frame, scene.audioDurationInFrames || scene.durationInFrames)}
            </div>
          </div>
        ) : null}

        <div style={{ position: "absolute", left: margin, right: margin, bottom: 34, display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ height: 2, flex: 1, background: rgba(palette.foreground, 0.14), overflow: "hidden" }}>
            <div style={{ width: String(sceneProgress * 100) + "%", height: "100%", background: palette.accent }} />
          </div>
          <div style={{ fontFamily: typography.mono, fontSize: 13, color: palette.muted, letterSpacing: 2 }}>{props.styleId.replaceAll("-", " ").toUpperCase()}</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const MotionVideo: React.FC<MotionVideoProps> = (props) => {
  const { fps } = useVideoConfig();
  const totalFrames = props.scenes.reduce((sum, scene) => sum + Math.max(1, scene.durationInFrames), 0);
  let offset = 0;
  const voiceRanges: Array<{ startFrame: number; endFrame: number }> = [];
  const sceneSequences = props.scenes.map((scene, index) => {
    const startFrame = offset;
    offset += Math.max(1, scene.durationInFrames);
    if (scene.audioSrc) {
      voiceRanges.push({ startFrame, endFrame: startFrame + Math.min(scene.durationInFrames, scene.audioDurationInFrames || scene.durationInFrames) });
    }
    return (
      <Sequence key={scene.id} from={startFrame} durationInFrames={scene.durationInFrames} name={scene.title}>
        <SceneView scene={scene} palette={props.palette} typography={props.typography} props={{ ...props, durationInFrames: totalFrames }} index={index} sceneCount={props.scenes.length} offset={startFrame} />
        {scene.audioSrc ? <Audio src={staticFile(scene.audioSrc)} volume={(frame) => 0.96 * getVoiceFadeEnvelope(frame, scene.audioDurationInFrames || scene.durationInFrames, fps)} /> : null}
      </Sequence>
    );
  });
  return (
    <AbsoluteFill>
      {sceneSequences}
      {props.audioBedSrc ? (
        <Audio
          src={staticFile(props.audioBedSrc)}
          volume={(frame) => getMusicBedGain(frame, totalFrames, fps, voiceRanges)}
        />
      ) : null}
    </AbsoluteFill>
  );
};
