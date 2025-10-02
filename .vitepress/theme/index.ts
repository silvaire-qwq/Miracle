// https://vitepress.dev/guide/custom-theme
import { h } from "vue";
import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import { Icon } from "@iconify/vue";
import "./styles/style.css";
import "@catppuccin/vitepress/theme/mocha/lavender.css";
// enable it if you like it ;)
// import "vitepress-theme-flexoki/index.css";

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
