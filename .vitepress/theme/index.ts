// https://vitepress.dev/guide/custom-theme
import { h } from "vue";
import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import { Icon } from "@iconify/vue";
import "../../src/styles/style.css";
import "@catppuccin/vitepress/theme/mocha/lavender.css";
// enable it if you like it ;)
// import "vitepress-theme-flexoki/index.css";

// Dashboard
import RecentPosts from "../../src/components/dashboard/RecentPosts.vue";
import Projects from "../../src/components/dashboard/Projects.vue";
import Friends from "../../src/components/dashboard/Friends.vue";
import TechStack from "../../src/components/dashboard/TechStack.vue";
import LastMoment from "../../src/components/dashboard/LastMoment.vue";
import FirstPage from "../../src/components/dashboard/FirstPage.vue";

// Components
import PostCard from "../../src/components/article/postCard.vue";
import FriendCard from "../../src/components/friends/card.vue";

// Pages
import Articles from "../../src/components/article/article.vue";
import tags from "../../src/components/article/tags.vue";
import Moments from "../../src/components/moments/moments.vue";
import Manager from "../../src/components/manager/manager.vue";

// Layout
import beforeDocs from "../../src/components/layout/beforeDocs.vue";

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
      "doc-before": () => h(beforeDocs),
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
    // ...
  },
} satisfies Theme;
