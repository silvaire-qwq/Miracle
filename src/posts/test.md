---
title: Markdown Test File
published: 2026-05-02
description: A lovely VitePress theme QwQ
tags: [Miracle, Demo, Markdown]
category: Miracle
origin: https://github.com/silviare-qwq/Miracle
negative: true
---

# H1

## H2

### H3

#### H4

##### H5

###### H6

> Blockquote

> [!DANGER]
> DANGER

> [!WARNING]
> WARNING

> [!TIP]
> TIP

> [!NOTE]
> NOTE

> [!IMPORTANT]
> IMPORTANT

[Normal Link](https://github.com/silvaire-qwq/Miracle/archive/refs/heads/main.zip). Or you can try to download <File text="This File" url="https://github.com/silvaire-qwq/Miracle/archive/refs/heads/main.zip" icon="ph:file-archive-duotone"/>.

**Bold** _Italic_ **_Both_** ~~Delete~~

```typescript
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
```
