const konamiCode = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "KeyB",
  "KeyA",
];
let currentStep = 0;

export let easterEggActive = false;

export function handleEasterEgg(code: string) {
  if (code !== konamiCode[currentStep]) {
    currentStep = code === konamiCode[0] ? 1 : 0;
    return;
  }

  currentStep++;

  if (currentStep === konamiCode.length) {
    easterEggActive = !easterEggActive;
    currentStep = 0;
  }
}
