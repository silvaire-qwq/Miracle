// ./setup/registerComponents.ts
import Articles from '../components/article/article.vue';
import PostCard from '../components/article/postCard.vue';
import Tags from '../components/article/tags.vue';
import FirstPage from '../components/dashboard/FirstPage.vue';
import Friends from '../components/dashboard/Friends.vue';
import LastMoment from '../components/dashboard/LastMoment.vue';
import Projects from '../components/dashboard/Projects.vue';
import RecentPosts from '../components/dashboard/RecentPosts.vue';
import TechStack from '../components/dashboard/TechStack.vue';
import FriendCard from '../components/friends/card.vue';
import Comments from '../components/layout/afterDocs.vue';
import Twikoo from '../components/layout/twikoo.vue';
import Manager from '../components/manager/manager.vue';
import Moments from '../components/moments/moments.vue';
import File from '../components/utils/file.vue';
import { Icon } from "@iconify/vue";
import type { App } from "vue";

const components = {
  Icon,
  // Dashboard
  FirstPage,
  RecentPosts,
  Projects,
  TechStack,
  Friends,
  LastMoment,
  // Components
  PostCard,
  FriendCard,
  // Pages
  Articles,
  Tags,
  Moments,
  Manager,
  // Layout
  Comments,
  Twikoo,
  File
}

type GlobalComponentTypes = typeof components

declare module 'vue' {
  interface GlobalComponents extends GlobalComponentTypes {
  }

  interface GlobalDirectives {
  }

  interface ComponentCustomProperties {
    $frontmatter: Record<string, any>
    $param: Record<string, any>
  }
}

declare global {
  interface Window {
    twikoo?: {
      init: (options: {
        envId: string
        el: string
        region?: string
        path?: string
        lang?: string
      }) => void
      version: string
    }
  }
}

export function registerComponents(app: App) {

  for (const [name, component] of Object.entries(components)) {
    app.component(name, component);
  }
}
