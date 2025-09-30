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
        data-theme="https://giscus.catppuccin.com/themes/mocha.css"
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
        data-theme="https://giscus.catppuccin.com/themes/latte.css"
        :data-lang="globalConfig.lang.giscusLang"
        crossorigin="anonymous"
        data-loading="eager"
        async
      >
      </component>
    </div>
    <div v-else>
      <div id="twikoo"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useData } from "vitepress";
import { globalConfig } from "../../../config";
// 获取当前配色方案
const { isDark } = useData();

import { onMounted, watch } from "vue";
import { useRoute } from "vitepress";

const route = useRoute();

const initTwikoo = async () => {
  // 判断是否在浏览器环境中
  if (typeof window !== "undefined") {
    const twikoo = await import("twikoo");
    twikoo.init({
      envId: globalConfig.comments.twikoo.env, // 换成你自己配置的域名
      el: "#twikoo",
    });
  }
};

// 监听路由刷新评论
watch(route, () => {
  initTwikoo();
});

onMounted(() => {
  initTwikoo();
});

interface CardProps {
  title: string;
}

const props = withDefaults(defineProps<CardProps>(), {
  title: "true",
});

const { page } = useData();
const frontmatter = page.value?.frontmatter || {};
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
