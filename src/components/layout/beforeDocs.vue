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
          <div v-if="frontmatter.origin" class="watch">
            <Icon class="miniIcon" icon="fluent:link-square-12-regular" />
            <a class="busuanzi" :href="frontmatter.origin" style="font-weight: 400">{{ formatUrl(frontmatter.origin) }}</a>
          </div>
          <div v-else class="watch">
            <Icon class="miniIcon" icon="fluent:eye-12-regular" />
            <span class="busuanzi"
              ><span id="busuanzi_page_pv">0</span> Readings</span
            >
          </div>

        <div class="person">
          <Icon class="miniIcon" icon="fluent:person-12-regular" />
          <span class="busuanzi"
            ><span id="busuanzi_page_uv">0</span> Readers</span
          >
        </div>
      </div>
      <h1 class="title">
        {{ frontmatter.title }}
      </h1>
      <p class="desc">{{ frontmatter.description }}</p>

      <div class="anchorContainer">
        <Icon
          class="anchor"
          icon="material-symbols:calendar-today-outline-rounded"
        />
      </div>
      <span class="categoryIcon">{{
        formatRelativeDate(frontmatter.published)
      }}</span>

      <div class="anchorContainer">
        <Icon class="anchor" icon="material-symbols:book-2-outline-rounded" />
      </div>
      <a
        class="categoryIcon"
        :href="`/src/pages/archive?category=${frontmatter.category}`"
        >{{ frontmatter.category }}</a
      >
      <div v-if="frontmatter.tags" style="display: inline-block">
        <div class="anchorContainer">
          <Icon class="anchor" icon="material-symbols:tag-rounded" />
        </div>
        <div class="tags" v-for="(tag, index) in frontmatter.tags" :key="tag">
          <a class="tag" :href="`/src/pages/tags?tag=${tag}`">
            <span class="content">{{ tag }}</span>
          </a>
          <span class="and" v-if="index !== frontmatter.tags.length - 1"
            >/</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useData } from "vitepress";
import { formatRelativeDate } from "../../utils/formatRelativeDate";
import { globalConfig } from "../../../config";
import { formatUrl } from "../../utils/formatUrl";

(() => {
  const u = new URL("https://api.busuanzi.cc/api.php");
  fetch(u.protocol + "//" + u.host + "/api.php", {
    method: "POST",
    body: JSON.stringify({ url: location.href, referrer: document.referrer }),
  })
    .then((r) => r.json())
    .then((r) => {
      for (const k in r)
        document.querySelectorAll("#" + k).forEach((e) => (e.innerText = r[k]));
    })
    .catch((e) => console.error(e));
})();

const { page } = useData();
const frontmatter = page.value.frontmatter;

const image = frontmatter.image
  ? /^(https?:\/\/)/.test(frontmatter.image)
    ? frontmatter.image
    : `${globalConfig.imgBed}${frontmatter.image}`
  : "";

import { useCardHover } from "../../utils/useCardHover";
const { handleMouseMove, handleMouseEnter, handleMouseLeave } = useCardHover();
</script>
<style scoped>
div.vp-doc.layout.beforeDocs {
  /* 提高文字区域的空间 */
  .textArea {
    margin-top: 50px;
    margin-bottom: 100px;
  }

  @media screen and (max-width: 400px) {
    .miniBar {
      flex-direction: column;
    }
  }

  .miniBar {
    margin-bottom: 16px;
    display: flex;
    gap: 0.5rem 1rem;

    .watch,
    .person {
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
      background-color: var(--vp-c-border);
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
