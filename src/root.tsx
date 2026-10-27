import React from "react";
import { SkyBlueFilm } from "./sky-blue";
import { AiCapabilitiesFilm } from "./ai-capabilities";
import { Composition, interpolate, useCurrentFrame } from "remotion";

const Demo: React.FC = () => {
  const frame = useCurrentFrame();
  const titleOpacity = interpolate(frame, [0, 18, 30], [0, 0, 1], { extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [0, 30], [44, 0], { extrapolateRight: "clamp" });
  const ringRotation = interpolate(frame, [0, 90], [-28, 18]);
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#f7f4ed",
        background: "radial-gradient(ellipse at 70% 25%, #294a68 0%, #101c31 38%, #080b14 78%)",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 440,
          height: 440,
          border: "1px solid rgba(135, 202, 255, 0.45)",
          borderRadius: "50%",
          transform: `rotateX(65deg) rotateZ(${ringRotation}deg) scale(${interpolate(frame, [0, 90], [0.82, 1])})`,
          boxShadow: "0 0 70px rgba(75, 168, 255, 0.12)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 300,
          height: 300,
          border: "1px solid rgba(255, 255, 255, 0.12)",
          borderRadius: "50%",
          transform: `rotateX(65deg) rotateZ(${-ringRotation * 0.7}deg)`,
        }}
      />
      <div style={{ zIndex: 1, textAlign: "center", padding: 60, opacity: titleOpacity, transform: `translateY(${titleY}px)` }}>
        <div style={{ fontSize: 20, letterSpacing: 9, color: "#8bd3ff", marginBottom: 24 }}>AI MOTION GRAPHICS STUDIO</div>
        <div style={{ fontSize: 76, lineHeight: 1.02, fontWeight: 700, letterSpacing: -3 }}>
          MAKE IT<br /><span style={{ color: "#8bd3ff" }}>CINEMATIC.</span>
        </div>
        <div style={{ margin: "28px auto 0", width: 90, height: 3, background: "#8bd3ff" }} />
        <div style={{ marginTop: 22, fontSize: 17, letterSpacing: 4, color: "rgba(247, 244, 237, 0.68)" }}>DESIGN · MOTION · STORY</div>
      </div>
    </div>
  );
};

export const MotionStudioRoot: React.FC = () => (
  <>
    <Composition id="SkyBlueFilm" component={SkyBlueFilm} durationInFrames={2700} fps={30} width={1920} height={1080} />
    <Composition id="AiCapabilitiesFilm" component={AiCapabilitiesFilm} durationInFrames={1950} fps={30} width={1920} height={1080} />
    <Composition id="MotionDemo" component={Demo} durationInFrames={90} fps={30} width={1920} height={1080} />
  </>
);
