export type CameraMotion = { translateX: number; translateY: number; scale: number; sweepX: number; lightSweep: boolean };
export function getCameraMotion(styleId: string, frame: number, durationInFrames: number, sceneIndex?: number): CameraMotion;
