<template>
  <div class="comment" v-if="globalConfig.comments.enable">
    <div v-if="props.title === 'false'" style="margin-top: 40px;"></div>
    <h2 class="styledH2" v-if="props.title !== 'false'">Comments</h2>
    <component
      v-if="isDark"
      :is="'script'"
      src="https://giscus.app/client.js"
      :data-repo="globalConfig.comments.repo"
      :data-repo-id="globalConfig.comments.repoId"
      data-category="Announcements"
      :data-category-id="globalConfig.comments.categoryId"
      data-mapping="pathname"
      data-reactions-enabled="0"
      data-emit-metadata="0"
      data-input-position="top"
      data-theme="https://giscus.catppuccin.com/themes/mocha.css"
      :data-lang="globalConfig.comments.lang"
      crossorigin="anonymous"
      data-loading="eager"
      async
    >
    </component>
    <component
      v-else
      :is="'script'"
      src="https://giscus.app/client.js"
      :data-repo="globalConfig.comments.repo"
      :data-repo-id="globalConfig.comments.repoId"
      data-category="Announcements"
      :data-category-id="globalConfig.comments.categoryId"
      data-mapping="pathname"
      data-reactions-enabled="0"
      data-emit-metadata="0"
      data-input-position="top"
      data-theme="https://giscus.catppuccin.com/themes/latte.css"
      :data-lang="globalConfig.comments.lang"
      crossorigin="anonymous"
      data-loading="eager"
      async
    >
    </component>
  </div>
</template>
<script setup lang="ts">
import { useData } from "vitepress";
import { globalConfig } from "../../../config";
// 获取当前配色方案
const { isDark } = useData();

interface CardProps {
  title: string
}

const props = withDefaults(defineProps<CardProps>(), {
  title: "true"
});
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
