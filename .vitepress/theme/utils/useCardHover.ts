const maxMove = 9;
const easing = 0.1;
const tolerance = 0.01;

interface CardState {
  currentX: number;
  currentY: number;
  targetX: number;
  targetY: number;
  hovered: boolean;
}

const cardStates = new WeakMap<HTMLElement, CardState>();

function animateCard(el: HTMLElement) {
  const state = cardStates.get(el);
  if (!state) {
    cardStates.delete(el);
    return;
  }

  const { currentX, currentY, targetX, targetY, hovered } = state;
  if (!hovered && !currentX && !currentY) {
    el.style.transform = "";
    cardStates.delete(el);
    return;
  }

  const nextX = Math.abs(targetX - currentX) < tolerance
    ? targetX
    : currentX + (targetX - currentX) * easing;
  const nextY = Math.abs(targetY - currentY) < tolerance
    ? targetY
    : currentY + (targetY - currentY) * easing;

  const scale = hovered ? 1.03 : 1;
  el.style.transform = `translate(${nextX}px, ${nextY}px) scale(${scale})`;
  state.currentX = nextX;
  state.currentY = nextY;

  requestAnimationFrame(() => animateCard(el));
}

export function useCardHover() {
  const handleMouseMove = (e: MouseEvent) => {
    const el = e.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const targetX = ((x - centerX) / centerX) * maxMove;
    const targetY = ((y - centerY) / centerY) * maxMove;

    const state = cardStates.get(el);
    if (!state) return;
    state.targetX = targetX;
    state.targetY = targetY;
  };

  const handleMouseEnter = (e: MouseEvent) => {
    const el = e.currentTarget as HTMLElement;
    if (cardStates.has(el)) {
      cardStates.get(el)!.hovered = true;
    } else {
      cardStates.set(el, {
        currentX: 0,
        currentY: 0,
        targetX: 0,
        targetY: 0,
        hovered: true,
      });
      animateCard(el);
    }
  };

  const handleMouseLeave = (e: MouseEvent) => {
    const el = e.currentTarget as HTMLElement;
    const state = cardStates.get(el);
    if (!state) return;
    state.targetX = 0;
    state.targetY = 0;
    state.hovered = false;
  };

  return { handleMouseMove, handleMouseEnter, handleMouseLeave };
}
