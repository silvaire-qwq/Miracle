// ./setup/registerComponents.ts
import type { App } from "vue";
import { defineAsyncComponent } from "vue";
import { Icon } from "@iconify/vue";
import Twikoo from "../components/layout/twikoo.vue";

export function registerComponents(app: App) {
  const components = {
    Icon,
    // Dashboard
    FirstPage: defineAsyncComponent(
      () => import("../components/dashboard/FirstPage.vue"),
    ),
    RecentPosts: defineAsyncComponent(
      () => import("../components/dashboard/RecentPosts.vue"),
    ),
    Projects: defineAsyncComponent(
      () => import("../components/dashboard/Projects.vue"),
    ),
    TechStack: defineAsyncComponent(
      () => import("../components/dashboard/TechStack.vue"),
    ),
    Friends: defineAsyncComponent(
      () => import("../components/dashboard/Friends.vue"),
    ),
    LastMoment: defineAsyncComponent(
      () => import("../components/dashboard/LastMoment.vue"),
    ),
    // Components
    PostCard: defineAsyncComponent(
      () => import("../components/article/postCard.vue"),
    ),
    FriendCard: defineAsyncComponent(
      () => import("../components/friends/card.vue"),
    ),
    // Pages
    Articles: defineAsyncComponent(
      () => import("../components/article/article.vue"),
    ),
    Tags: defineAsyncComponent(() => import("../components/article/tags.vue")),
    Moments: defineAsyncComponent(
      () => import("../components/moments/moments.vue"),
    ),
    Manager: defineAsyncComponent(
      () => import("../components/manager/manager.vue"),
    ),
    // Layout
    Comments: defineAsyncComponent(
      () => import("../components/layout/afterDocs.vue"),
    ),
    Twikoo: defineAsyncComponent(
      () => import("../components/layout/twikoo.vue"),
    ),
    Musics: defineAsyncComponent(() => import("../components/dashboard/Musics.vue")),
    File: defineAsyncComponent(() => import("../components/utils/file.vue")),
  };

  for (const [name, component] of Object.entries(components)) {
    app.component(name, component);
  }
}
