import { easterEggActive } from "./easterEgg";
import { globalConfig } from "#config";

const maxFrame = 250;
const maxMove = globalConfig.styles.visual.cardHover.maxMove;
const easing = globalConfig.styles.visual.cardHover.easing;
const tolerance = 0.01;

// 新增：3D 倾斜强度（角度）
const maxRotate = globalConfig.styles.visual.cardHover.maxRotate;

interface CardState {
  currentX: number;
  currentY: number;
  targetX: number;
  targetY: number;

  // 新增：旋转状态
  currentRotateX: number;
  currentRotateY: number;
  targetRotateX: number;
  targetRotateY: number;

  hovered: boolean;
}

const cardStates = new WeakMap<HTMLElement, CardState>();

function animateCard(el: HTMLElement) {
  const state = cardStates.get(el);
  if (!state) {
    cardStates.delete(el);
    return;
  }

  const {
    currentX,
    currentY,
    targetX,
    targetY,

    currentRotateX,
    currentRotateY,
    targetRotateX,
    targetRotateY,

    hovered,
  } = state;

  if (
    !hovered &&
    !currentX &&
    !currentY &&
    !currentRotateX &&
    !currentRotateY
  ) {
    el.style.transform = "";
    cardStates.delete(el);
    return;
  }

  const nextX =
    Math.abs(targetX - currentX) < tolerance
      ? targetX
      : currentX + (targetX - currentX) * easing;

  const nextY =
    Math.abs(targetY - currentY) < tolerance
      ? targetY
      : currentY + (targetY - currentY) * easing;

  const nextRotateX =
    Math.abs(targetRotateX - currentRotateX) < tolerance
      ? targetRotateX
      : currentRotateX + (targetRotateX - currentRotateX) * easing;

  const nextRotateY =
    Math.abs(targetRotateY - currentRotateY) < tolerance
      ? targetRotateY
      : currentRotateY + (targetRotateY - currentRotateY) * easing;

  const scale = hovered ? globalConfig.styles.visual.cardHover.scale : 1;
  const shadowStrength = hovered
    ? globalConfig.styles.visual.cardHover.shadowStrength
    : 1;

  el.style.transform = `
    perspective(1000px)
    translate(${nextX}px, ${nextY}px)
    rotateX(${nextRotateX}deg)
    rotateY(${nextRotateY}deg)
    scale(${scale})
    translateZ(0)
  `;

  el.style.transformStyle = "preserve-3d";
  el.style.willChange = "transform, box-shadow";
  el.style.boxShadow = hovered
    ? `
    var(--vp-c-brand-soft) 0px ${12 * shadowStrength}px ${25 * shadowStrength}px -5px,
    var(--vp-c-brand-soft) 0px ${7 * shadowStrength}px ${15 * shadowStrength}px -7px
  `
    : `
    var(--vp-c-bg-alt) 0px 12px 25px -5px,
    var(--vp-c-bg-alt) 0px 7px 15px -7px
  `;

  state.currentX = nextX;
  state.currentY = nextY;
  state.currentRotateX = nextRotateX;
  state.currentRotateY = nextRotateY;

  requestAnimationFrame(() => animateCard(el));
}

export function useCardHover() {
  let lastTime = 0;

  const handleMouseMove = (e: MouseEvent) => {
    const time = performance.now();
    if (time - lastTime < 1000 / maxFrame) return;
    lastTime = time;

    const el = e.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // 平移
    const targetX = ((x - centerX) / centerX) * maxMove;

    const targetY = ((y - centerY) / centerY) * maxMove;

    // 3D 倾斜（重点）
    // 鼠标在哪边，那边“向下压”
    const targetRotateY = ((x - centerX) / centerX) * maxRotate;

    const targetRotateX = -((y - centerY) / centerY) * maxRotate;

    const state = cardStates.get(el);
    if (!state) return;

    if (easterEggActive) {
      state.targetX += targetX;
      state.targetY += targetY;

      state.targetRotateX += targetRotateX;
      state.targetRotateY += targetRotateY;
    } else {
      state.targetX = targetX;
      state.targetY = targetY;

      state.targetRotateX = targetRotateX;
      state.targetRotateY = targetRotateY;
    }
  };

  const handleMouseEnter = (e: MouseEvent) => {
    const el = e.currentTarget as HTMLElement;

    // 保证 z-index 生效
    const computedStyle = window.getComputedStyle(el);
    if (computedStyle.position === "static") {
      el.style.position = "relative";
    }

    el.style.zIndex = "9";

    if (cardStates.has(el)) {
      cardStates.get(el)!.hovered = true;
    } else {
      cardStates.set(el, {
        currentX: 0,
        currentY: 0,
        targetX: 0,
        targetY: 0,

        currentRotateX: 0,
        currentRotateY: 0,
        targetRotateX: 0,
        targetRotateY: 0,

        hovered: true,
      });

      animateCard(el);
    }
  };

  const handleMouseLeave = (e: MouseEvent) => {
    const el = e.currentTarget as HTMLElement;
    const state = cardStates.get(el);
    if (!state) return;

    el.style.zIndex = "";

    if (!easterEggActive) {
      state.targetX = 0;
      state.targetY = 0;

      state.targetRotateX = 0;
      state.targetRotateY = 0;
    }

    state.hovered = false;
  };

  return {
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave,
  };
}
