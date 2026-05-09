import { h } from "vue";
import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import { inBrowser } from "vitepress";
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
/* =========================
 * Catppuccin Runtime Engine
 * ========================= */

const catppuccinMap = import.meta.glob("./styles/catppuccin/**/*.css", {
  as: "raw",
});

let styleEl: HTMLStyleElement | null = null;
let currentKey = "";

function getThemeKey() {
  const c = globalConfig?.styles?.color?.catppuccin;

  if (!c?.enabled) return "";

  const flavor = c.flavor ?? "mocha";
  const color = c.color ?? "mauve";

  return `${flavor}/${color}`;
}

async function loadCSS(key: string) {
  const path = `./styles/catppuccin/${key}.css`;
  const loader = catppuccinMap[path];

  if (!loader) {
    console.warn("[catppuccin] theme not found:", path);
    return "";
  }

  return await loader();
}

function injectStyle(css: string) {
  if (!inBrowser) return;

  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.setAttribute("data-catppuccin", "true");
    document.head.appendChild(styleEl);
  }

  styleEl.textContent = css;
}

async function applyCatppuccin() {
  const key = getThemeKey();

  if (!key || key === currentKey) return;

  const css = await loadCSS(key);
  if (!css) return;

  currentKey = key;

  // 等一帧，确保 VitePress 默认主题先加载
  requestAnimationFrame(() => {
    injectStyle(css);
  });
}

/* =========================
 * Theme Export
 * ========================= */

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
    if (!inBrowser) return;

    const init = async () => {
      await applyCatppuccin();
      applyCssVars();
    };

    // 首次加载
    init();

    // 路由切换
    router.onAfterRouteChange = init;

    // 彩蛋监听
    document.addEventListener("keydown", ({ code }) => handleEasterEgg(code));
  },
} satisfies Theme;
