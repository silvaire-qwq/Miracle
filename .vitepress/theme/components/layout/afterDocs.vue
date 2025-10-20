<template>
  <div
    class="comment"
    v-if="globalConfig.comments.enable && globalConfig.comments.type"
  >
    <div v-if="props.title === 'false'" style="margin-top: 40px"></div>
    <h2 class="styledH2" v-if="props.title !== 'false'">
      {{ globalConfig.lang.comments }}
    </h2>
    <div v-if="globalConfig.comments.type == 'giscus'">
      <component
        v-if="isDark"
        :is="'script'"
        src="https://giscus.app/client.js"
        :data-repo="globalConfig.comments.giscus.repo"
        :data-repo-id="globalConfig.comments.giscus.repoId"
        data-category="Announcements"
        :data-category-id="globalConfig.comments.giscus.categoryId"
        data-mapping="pathname"
        data-reactions-enabled="0"
        data-emit-metadata="0"
        data-input-position="top"
        :data-theme="globalConfig.comments.giscus.themes.dark"
        :data-lang="globalConfig.lang.giscusLang"
        crossorigin="anonymous"
        data-loading="eager"
        async
      >
      </component>
      <component
        v-else
        :is="'script'"
        src="https://giscus.app/client.js"
        :data-repo="globalConfig.comments.giscus.repo"
        :data-repo-id="globalConfig.comments.giscus.repoId"
        data-category="Announcements"
        :data-category-id="globalConfig.comments.giscus.categoryId"
        data-mapping="pathname"
        data-reactions-enabled="0"
        data-emit-metadata="0"
        data-input-position="top"
        :data-theme="globalConfig.comments.giscus.themes.light"
        :data-lang="globalConfig.lang.giscusLang"
        crossorigin="anonymous"
        data-loading="eager"
        async
      >
      </component>
    </div>
    <div v-if="globalConfig.comments.type == 'twikoo'">
      <Twikoo />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useData } from "vitepress";
import { globalConfig } from "#/config";
import Twikoo from "./twikoo.vue";
// 获取当前配色方案
const { isDark } = useData();

interface CardProps {
  title: string;
}

const props = withDefaults(defineProps<CardProps>(), {
  title: "true",
});

const { page } = useData();
</script>

<style scoped>
.styledH2 {
  margin: 48px 0px 36px 0px;
  font-size: 24px;
  font-weight: 600;
  line-height: 32px;
  padding-top: 24px;
  border-top: 1px solid var(--vp-c-divider);
}
</style>
