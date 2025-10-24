import { h } from "vue";
import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import { handleEasterEgg } from "./utils/easterEgg";
import { enhanceAppWithTabs } from "vitepress-plugin-tabs/client";
import { applyPangu, observePangu } from "./utils/pangu";
import "./styles/style.css";
import "./styles/gencolor.css";

import beforeDocs from "./components/layout/beforeDocs.vue";
import { registerComponents } from "./configs/registerComponents";
import { applyCssVars } from "./configs/applyCssVars";
import Comments from "./components/layout/afterDocs.vue";

export default {
  extends: DefaultTheme,

  Layout: () =>
    h(DefaultTheme.Layout, null, {
      "doc-before": () => h(beforeDocs),
      "doc-after": () => h(Comments),
    }),
  enhanceApp({ app, router }) {
    enhanceAppWithTabs(app);
    registerComponents(app);

    if (typeof window === "undefined") return;

    const init = () => {
      applyCssVars();
      // applyPangu(); // 初始内容
      // observePangu(); // 监听动态内容
    };
    if (document.readyState === "complete") init();
    else window.addEventListener("DOMContentLoaded", init, { once: true });

    router.onAfterRouteChanged = () => applyPangu();

    if (document.readyState === "complete") init();
    else window.addEventListener("DOMContentLoaded", init, { once: true });

    router.onAfterRouteChanged = init;
    document.addEventListener("keydown", ({ code }) => handleEasterEgg(code));
  },
} satisfies Theme;
