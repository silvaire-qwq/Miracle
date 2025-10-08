// https://vitepress.dev/guide/custom-theme
import { h } from "vue";
import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import { Icon } from "@iconify/vue";
import { globalConfig } from "#config";

// func: set css var
function setCssVar(name: string, value: string) {
  document.documentElement.style.setProperty(name, value);
}

// vars
setCssVar("--hue", globalConfig.styles.hue.toString());
setCssVar("--vp-border-radius-1", globalConfig.styles.radius.toString() + "px");
if (globalConfig.styles.uppercase == true) {
  setCssVar("--vp-title-uppercase", "uppercase");
} else {
  setCssVar("--vp-title-uppercase", "capitalize");
}

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
    // ...
  },
} satisfies Theme;
