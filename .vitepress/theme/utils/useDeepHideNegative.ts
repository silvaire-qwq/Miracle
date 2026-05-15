import { ref } from "vue";
import { globalConfig } from "#config";

const showNegative = ref(false);
const pendingTimer = ref<number | null>(null);
const hasShownByShortcut = ref(false);

const initDeepHideListener = () => {
  if (typeof window === "undefined") return;

  const handleKeydown = (e: KeyboardEvent) => {
    if (!globalConfig.deepHideNegative) return;
    if (e.key.toLowerCase() !== "s") return;

    if (hasShownByShortcut.value) return;
    if (pendingTimer.value) return;

    pendingTimer.value = window.setTimeout(() => {
      showNegative.value = true;
      hasShownByShortcut.value = true;
      pendingTimer.value = null;
    }, 1000);
  };

  window.addEventListener("keydown", handleKeydown);

  return () => {
    window.removeEventListener("keydown", handleKeydown);
  };
};

export function useDeepHideNegative() {
  return {
    showNegative,
    pendingTimer,
    hasShownByShortcut,
    initDeepHideListener,
  };
}
