// Powered by Android(Not Android!)
import { globalConfig } from "#config";
const r = globalConfig.styles.color.rainbow;
const konamiCode = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "KeyA",
  "KeyB",
  "KeyA",
  "KeyB",
];
let currentStep = 0;
let hueTimer: number | null = null;
export let easterEggActive = false;

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

export function handleEasterEgg(code: string) {
  if (code !== konamiCode[currentStep]) {
    currentStep = code === konamiCode[0] ? 1 : 0;
    return;
  }

  currentStep++;

  if (currentStep === konamiCode.length) {
    easterEggActive = !easterEggActive;
    currentStep = 0;
    if (easterEggActive && r.enabled !== true) {
      startHueCycle();
    } else {
      stopHueCycle();
    }
  }
}
