// ./setup/applyCssVars.ts
import { globalConfig } from "../../../config";

export function applyCssVars() {
  const root = document.documentElement;
  const { styles } = globalConfig;

  const vars = {
    "--hue": styles.color.hue,
    "--vp-color-intensity-dark": styles.color.intensity.dark / 100,
    "--vp-color-intensity-light": styles.color.intensity.light / 100,
    "--vp-color-lightness-dark": styles.color.lightness.dark / 100,
    "--vp-color-lightness-light": styles.color.lightness.light / 100,
    "--vp-border-radius-1": `${styles.visual.radius}px`,
    "--vp-gap": `${styles.visual.gap}px`,
    "--vp-transition-time": `${0.1 * (styles.visual.transition / 10)}s`,
    "--vp-title-uppercase": styles.visual.uppercase
      ? "uppercase"
      : "capitalize",
    "--vp-use-mono": styles.visual.mono
      ? "var(--vp-font-family-mono)"
      : "var(--vp-font-family-base)",
  };

  Object.entries(vars).forEach(([k, v]) =>
    root.style.setProperty(k, v.toString()),
  );
}
