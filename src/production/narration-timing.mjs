export function extendFinalSceneToTarget(scenes, targetFrames) {
  if (!Array.isArray(scenes) || scenes.length === 0) {
    throw new TypeError("At least one scene is required to fit the narration runtime.");
  }
  if (!Number.isInteger(targetFrames) || targetFrames < scenes.length) {
    throw new RangeError("Target frames must be an integer large enough for every scene.");
  }

  let totalFrames = 0;
  const cloned = scenes.map((scene) => {
    const frames = Number(scene?.durationInFrames);
    if (!Number.isInteger(frames) || frames < 1) {
      throw new TypeError("Every scene must have a positive integer durationInFrames.");
    }
    totalFrames += frames;
    return { ...scene };
  });

  if (totalFrames >= targetFrames) {
    return { scenes: cloned, addedFrames: 0, totalFrames };
  }

  const addedFrames = targetFrames - totalFrames;
  const finalScene = cloned[cloned.length - 1];
  finalScene.durationInFrames += addedFrames;
  finalScene.outroHoldFrames = Math.max(0, Number(finalScene.outroHoldFrames) || 0) + addedFrames;
  totalFrames += addedFrames;

  return { scenes: cloned, addedFrames, totalFrames };
}
