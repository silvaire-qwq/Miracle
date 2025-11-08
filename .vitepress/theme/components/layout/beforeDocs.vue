<template>
  <div class="vp-doc layout beforeDocs" v-if="frontmatter.title">
    <div v-if="frontmatter.image">
      <img
        :src="image"
        @mouseenter="handleMouseEnter"
        @mousemove="handleMouseMove"
        @mouseleave="handleMouseLeave"
      />
    </div>
    <div v-else style="height: 50px"></div>
    <div class="textArea">
      <div class="miniBar">
        <!-- 📖 新增：字数 -->
        <div v-if="postInfo.wordCount" class="words">
          <Icon class="miniIcon" :icon="globalConfig.icon.words" />
          <span class="busuanzi"
            >{{ postInfo.wordCount }} {{ globalConfig.lang.words }}</span
          >
        </div>

        <!-- ⏱️ 新增：阅读时间 -->
        <div v-if="postInfo.readingTime" class="reading">
          <Icon class="miniIcon" :icon="globalConfig.icon.time" />
          <span class="busuanzi"
            >{{ postInfo.readingTime }} {{ globalConfig.lang.minutes }}</span
          >
        </div>

        <div v-if="frontmatter.origin" class="watch">
          <Icon class="miniIcon" :icon="globalConfig.icon.link" />
          <a
            class="busuanzi"
            :href="frontmatter.origin"
            style="font-weight: 400"
            >{{ formatUrl(frontmatter.origin) }}</a
          >
        </div>
      </div>

      <h1 class="title">
        {{ frontmatter.title }}
      </h1>
      <p class="desc">{{ frontmatter.description }}</p>

      <div class="anchorContainer">
        <Icon class="anchor" :icon="globalConfig.icon.calendar" />
      </div>
      <span class="categoryIcon">{{
        formatRelativeDate(frontmatter.published)
      }}</span>

      <div class="anchorContainer">
        <Icon class="anchor" :icon="globalConfig.icon.category" />
      </div>
      <a
        class="categoryIcon"
        :href="`/archives?category=${frontmatter.category}`"
        >{{ frontmatter.category }}</a
      >
      <div v-if="frontmatter.tags" style="display: inline-block">
        <div class="anchorContainer">
          <Icon class="anchor" :icon="globalConfig.icon.tag" />
        </div>
        <div class="tags" v-for="(tag, index) in tags" :key="tag">
          <a class="tag" :href="`/tags?tag=${tag}`">
            <span class="content">{{ tag }}</span>
          </a>
          <span class="and" v-if="index !== tags.length - 1">/</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useData } from "vitepress";
import { formatRelativeDate } from "../../utils/formatRelativeDate";
import { globalConfig } from "#config";
import { formatUrl } from "../../utils/formatUrl";
import { useCardHover } from "../../utils/useCardHover";
import { data as posts } from "../../data/posts.data";

const { page } = useData();
const frontmatter = page.value?.frontmatter || {};
const postInfo = posts.find((p) => p.filePath === page.value?.filePath);

const image = frontmatter.image
  ? /^(https?:\/\/)/.test(frontmatter.image)
    ? frontmatter.image
    : `${globalConfig.imgBed}${frontmatter.image}`
  : "";

const tags = Array.isArray(frontmatter.tags)
  ? frontmatter.tags
  : [frontmatter.tags];

const { handleMouseMove, handleMouseEnter, handleMouseLeave } = useCardHover();
</script>
<style scoped>
div.vp-doc.layout.beforeDocs {
  display: block;
  z-index: 9999;

  /* 提高文字区域的空间 */
  @media screen and (min-width: 600px) {
    .textArea {
      margin-top: 30px;
      margin-bottom: 70px;
    }
  }

  @media screen and (max-width: 600px) {
    .miniBar {
      flex-wrap: wrap;
      gap: 0.5rem 0.5rem;
    }
    .textArea {
      margin-top: 30px;
      margin-bottom: 48px;
    }
  }

  .miniBar {
    margin-bottom: 16px;
    display: flex;
    gap: 0.5rem 1rem;

    .watch,
    .person,
    .words,
    .reading {
      display: flex;
      align-items: center !important;
    }
    .miniIcon {
      padding: 2px 4px;
      height: 24px;
      width: 24px;
      margin-right: 7px;
      aspect-ratio: 1;
      border-radius: var(--vp-border-radius-4);
      background-color: var(--vp-mini-bg);
    }
    .busuanzi {
      color: var(--vp-c-text-3);
      opacity: 0.8;
    }
  }

  img {
    border-radius: var(--vp-border-radius-1);
    transition: all var(--vp-transition-time);
    box-shadow: var(--vp-shadow);
  }

  /* Tag */
  .tags {
    margin-top: 10px;
    display: inline-block;
    .and {
      opacity: 0.4;
      margin: 0px 5px;
    }
  }

  .tag,
  .categoryIcon {
    color: var(--vp-c-text-3);
    opacity: 0.8;
    transition: all var(--vp-transition-time);
    font-size: 14px;
    &:hover {
      opacity: 1;
    }
  }

  .categoryIcon {
    margin-right: 18px;
    font-weight: 500;
  }

  .anchorContainer {
    margin-right: 8px;
    display: inline-block;
    padding: 3px 6px;
    aspect-ratio: 1;
    background-color: var(--vp-c-brand-soft);
    color: var(--vp-c-brand-2);
    border-radius: var(--vp-border-radius-4);
  }

  /* Descriptions */
  p.desc {
    margin: 7px 0 14px 0;
    color: var(--vp-c-text-3);
    font-weight: 500;
    line-height: 24px;
  }

  .title {
    display: flex;
    align-items: center; /* 垂直居中 */
    margin: 10px 0px;
  }

  .title:before {
    content: "‎";
    display: block;
    height: 28px;
    border-radius: 100px;
    border: 3px solid var(--vp-c-brand);
    margin-right: 14px;
  }
}
</style>
