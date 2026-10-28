export type MotionLayout =
  | "hero" | "editorial" | "diagram" | "timeline" | "compare"
  | "data" | "particles" | "map" | "interface" | "quote" | "outro";

export type MotionPalette = {
  background: string; foreground: string; muted: string; accent: string;
  accent2: string; panel: string; line: string;
};
export type MotionTypography = { display: string; body: string; mono: string };

export type MotionScene = {
  id: string;
  kicker: string;
  title: string;
  body: string;
  narration: string;
  layout: MotionLayout;
  durationInFrames: number;
  bullets?: string[];
  sourceRefs?: string[];
  audioSrc?: string;
  audioDurationInFrames?: number;
  transition?: "wipe" | "fade" | "scale" | "split";
};

export type MotionVisualFamily = "city-heat" | "artificial-intelligence" | "solar-energy" | "climate" | "biology" | "space" | "finance" | "cybersecurity" | "water" | "general";

export type MotionVideoProps = {
  topic: string;
  title: string;
  subtitle: string;
  language: string;
  styleId: string;
  visualFamily?: MotionVisualFamily;
  fps: number;
  width: number;
  height: number;
  durationInFrames: number;
  palette: MotionPalette;
  typography: MotionTypography;
  scenes: MotionScene[];
  audioBedSrc?: string;
  captionsEnabled?: boolean;
};

export const DEFAULT_MOTION_VIDEO_PROPS: MotionVideoProps = {
  topic: "A system in motion",
  title: "A SYSTEM IN MOTION",
  subtitle: "From question to understanding",
  language: "en",
  styleId: "editorial-kinetic-type",
  visualFamily: "general",
  fps: 30,
  width: 1920,
  height: 1080,
  durationInFrames: 240,
  palette: {
    background: "#111114", foreground: "#F2EFE8", muted: "#A8A6A0",
    accent: "#F04D35", accent2: "#D9C35B", panel: "#25252B", line: "#55535B"
  },
  typography: {
    display: "Barlow Condensed, Liberation Sans, sans-serif",
    body: "Source Sans 3, Liberation Sans, sans-serif",
    mono: "IBM Plex Mono, Liberation Mono, monospace"
  },
  captionsEnabled: false,
  scenes: [
    { id: "smoke-01", kicker: "THE QUESTION", title: "Start with a better question.", body: "A strong visual story gives each movement a purpose.", narration: "", layout: "hero", durationInFrames: 60, bullets: ["Focus", "Contrast", "Meaning"], transition: "wipe" },
    { id: "smoke-02", kicker: "SEE THE SYSTEM", title: "Make the invisible visible.", body: "A diagram can reveal relationships that a paragraph leaves hidden.", narration: "", layout: "diagram", durationInFrames: 60, bullets: ["Input", "Process", "Outcome"], transition: "scale" },
    { id: "smoke-03", kicker: "BUILD MOMENTUM", title: "Change the frame, not just the zoom.", body: "Typography, space and rhythm can introduce a new idea.", narration: "", layout: "editorial", durationInFrames: 60, bullets: ["Reveal", "Transform", "Hold"], transition: "split" },
    { id: "smoke-04", kicker: "THE TAKEAWAY", title: "Motion should mean something.", body: "Resolve the promise, then give the viewer time to absorb it.", narration: "", layout: "outro", durationInFrames: 60, bullets: ["Clarity", "Craft", "Purpose"], transition: "fade" }
  ]
};
