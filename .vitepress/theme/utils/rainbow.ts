// Powered by Copilot
import { globalConfig } from "#config";
const r = globalConfig.styles.color.rainbow;
let hueTimer: number | null = null;
function getCurrentHue() {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue("--hue")
    .trim();
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 280;
}

function updateHue() {
  const hue = (getCurrentHue() + r.speed) % 360;
  document.documentElement.style.setProperty("--hue", hue.toString());
}

function startHueCycle() {
  if (hueTimer !== null) return;
  updateHue();
  hueTimer = window.setInterval(updateHue, 100);
}

function stopHueCycle() {
  if (hueTimer === null) return;
  window.clearInterval(hueTimer);
  hueTimer = null;
}

if (r.enabled == true) {
  startHueCycle();
} else {
  stopHueCycle();
}
