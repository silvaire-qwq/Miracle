const maxMove = 9;
const easing = 0.1;

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
  if (!state) return;

  const { currentX, currentY, targetX, targetY, hovered } = state;
  const nextX = currentX + (targetX - currentX) * easing;
  const nextY = currentY + (targetY - currentY) * easing;

  state.currentX = nextX;
  state.currentY = nextY;

  const scale = hovered ? 1.03 : 1;
  el.style.transform = `translate(${nextX}px, ${nextY}px) scale(${scale})`;

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

    if (!cardStates.has(el)) {
      cardStates.set(el, {
        currentX: 0,
        currentY: 0,
        targetX,
        targetY,
        hovered: false,
      });
      animateCard(el);
    } else {
      const state = cardStates.get(el)!;
      state.targetX = targetX;
      state.targetY = targetY;
    }
  };

  const handleMouseEnter = (e: MouseEvent) => {
    const el = e.currentTarget as HTMLElement;
    if (!cardStates.has(el)) {
      cardStates.set(el, {
        currentX: 0,
        currentY: 0,
        targetX: 0,
        targetY: 0,
        hovered: true,
      });
      animateCard(el);
    } else {
      cardStates.get(el)!.hovered = true;
    }
  };

  const handleMouseLeave = (e: MouseEvent) => {
    const el = e.currentTarget as HTMLElement;
    const state = cardStates.get(el);
    if (!state) return;
    state.hovered = false;
    state.targetX = 0;
    state.targetY = 0;
  };

  return { handleMouseMove, handleMouseEnter, handleMouseLeave };
}
