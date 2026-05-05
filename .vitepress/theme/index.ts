import { h } from "vue";
import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";

import { handleEasterEgg } from "./utils/easterEgg";
import { enhanceAppWithTabs } from "vitepress-plugin-tabs/client";

import "./styles/style.css";
import "./styles/gencolor.css";
import "./utils/rainbow";

import beforeDocs from "./components/layout/beforeDocs.vue";
import Comments from "./components/layout/afterDocs.vue";

import { registerComponents } from "./configs/registerComponents";
import { applyCssVars } from "./configs/applyCssVars";
import { globalConfig } from "#config";

let catppuccinLoaded = false;

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

    const loadCatppuccin = async () => {
      const c = globalConfig?.styles?.color?.catppuccin;

      if (!c?.enabled) return;
      if (catppuccinLoaded) return;

      const flavor = c.flavor ?? "mocha";
      const color = c.color ?? "mauve";

      await import(
        /* @vite-ignore */
        `./styles/catppuccin/${flavor}/${color}.css`
      );

      catppuccinLoaded = true;
    };

    const init = async () => {
      await loadCatppuccin();
      applyCssVars();
    };

    const runInit = () => init();

    if (document.readyState === "complete") {
      runInit();
    } else {
      window.addEventListener("DOMContentLoaded", runInit, { once: true });
    }

    router.onAfterRouteChanged = runInit;

    document.addEventListener("keydown", ({ code }) => handleEasterEgg(code));
  },
} satisfies Theme;
