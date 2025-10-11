// https://vitepress.dev/guide/custom-theme
import { h } from "vue";
import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import { Icon } from "@iconify/vue";
import { handleEasterEgg } from "./utils/easterEgg";
import { globalConfig } from "#config";

// theme
import "./styles/style.css";
import "./styles/gencolor.css";
// enable it if you like it ;)
// import "vitepress-theme-flexoki/index.css";
// import "@catppuccin/vitepress/theme/mocha/lavender.css";

// Dashboard
import RecentPosts from "./components/dashboard/RecentPosts.vue";
import Projects from "./components/dashboard/Projects.vue";
import Friends from "./components/dashboard/Friends.vue";
import TechStack from "./components/dashboard/TechStack.vue";
import LastMoment from "./components/dashboard/LastMoment.vue";
import FirstPage from "./components/dashboard/FirstPage.vue";

// Components
import PostCard from "./components/article/postCard.vue";
import FriendCard from "./components/friends/card.vue";

// Pages
import Articles from "./components/article/article.vue";
import tags from "./components/article/tags.vue";
import Moments from "./components/moments/moments.vue";
import Manager from "./components/manager/manager.vue";

// Layout
import beforeDocs from "./components/layout/beforeDocs.vue";
import afterDocs from "./components/layout/afterDocs.vue";

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
      "doc-before": () => h(beforeDocs),
      "doc-after": () => h(afterDocs),
    });
  },
  enhanceApp({ app, router, siteData }) {
    app.component("Icon", Icon);
    app.component("FirstPage", FirstPage);
    app.component("RecentPosts", RecentPosts);
    app.component("Projects", Projects);
    app.component("TechStack", TechStack);
    app.component("Friends", Friends);
    app.component("LastMoment", LastMoment);
    app.component("Articles", Articles);
    app.component("FriendCard", FriendCard);
    app.component("PostCard", PostCard);
    app.component("Moments", Moments);
    app.component("Tags", tags);
    app.component("Manager", Manager);
    app.component("Comments", afterDocs);

    // ✅ 浏览器端才运行
    if (typeof window !== "undefined") {
      const applyCssVars = () => {
        const root = document.documentElement;
        const { styles } = globalConfig;

        root.style.setProperty("--hue", styles.color.hue.toString());
        root.style.setProperty(
          "--vp-color-intensity-dark",
          styles.color.intensity.dark.toString()
        );
        root.style.setProperty(
          "--vp-color-intensity-light",
          styles.color.intensity.light.toString()
        );
        root.style.setProperty(
          "--vp-border-radius-1",
          `${styles.visual.radius}px`
        );
        root.style.setProperty(
          "--vp-transition-time",
          `${0.1 * (styles.visual.transition / 10)}s`
        );
        root.style.setProperty(
          "--vp-title-uppercase",
          styles.visual.uppercase ? "uppercase" : "capitalize"
        );
        root.style.setProperty(
          "--vp-use-mono",
          styles.visual.mono
            ? "var(--vp-font-family-mono)"
            : "var(--vp-font-family-base)"
        );
      };

      // 首次加载时执行
      if (document.readyState === "complete") {
        applyCssVars();
      } else {
        window.addEventListener("DOMContentLoaded", applyCssVars, {
          once: true,
        });
      }

      // 切换页面时重设（SPA 模式下）
      router.onAfterRouteChanged = () => {
        applyCssVars();
      };

      document.addEventListener("keydown", ({ code }) => handleEasterEgg(code));
    }
  },
} satisfies Theme;
