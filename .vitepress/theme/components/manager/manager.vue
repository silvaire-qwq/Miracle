<script setup lang="ts">
import { ref, computed } from "vue";
import { Icon } from "@iconify/vue";
import { data as posts } from "../../data/posts.data";
import { globalConfig } from "#config";
import { useCardHover } from "../../utils/useCardHover";
import { getDate, getTimeString } from "../../utils/getDate";

const activeTab = ref("posts"); // 默认 POSTS
const selectedCategory = ref("");

// 分类
const categories = computed(() => {
  const set = new Set<string>();
  posts.forEach((p) => p.category.split(",").forEach((c) => set.add(c.trim())));
  return Array.from(set);
});

const categoryCounts = computed(() => {
  const counts: Record<string, number> = {};
  posts.forEach((p) =>
    p.category.split(",").forEach((c) => {
      c = c.trim();
      counts[c] = (counts[c] || 0) + 1;
    }),
  );
  return counts;
});

// 按日期排序 POSTS
const groupedPosts = computed(() => {
  let filtered = posts;
  if (selectedCategory.value) {
    filtered = posts.filter((p) => p.category === selectedCategory.value);
  }
  return filtered.sort(
    (a, b) =>
      new Date(b.originDate).getTime() - new Date(a.originDate).getTime(),
  );
});

// 点击分类
const handleCategoryClick = (cat: string) => {
  selectedCategory.value = cat;
  const url = new URL(window.location.href);
  url.searchParams.set("category", cat);
  window.history.pushState({}, "", url);
};

// 卡片鼠标交互
const { handleMouseMove, handleMouseEnter, handleMouseLeave } = useCardHover();

// ✅ 通用 getRepoUrl（自动去掉重复 type 前缀）
function getRepoUrl(
  action: "new" | "edit" | "delete",
  type: "posts" | "moments" | "friends",
  fileName: string,
  fileContent?: string,
) {
  const { blogBase } = globalConfig;
  const basePath = type === "posts" ? `src/posts` : `data/${type}`;

  // 去掉 fileName 开头多余的 type/
  const cleanFileName = fileName.replace(new RegExp(`^${type}/`), "");

  const url = {
    github: {
      new: `https://github.com/${blogBase.repo}/new/main/${basePath}?filename=${cleanFileName}&value=${fileContent || ""}`,
      edit: `https://github.com/${blogBase.repo}/edit/main/${basePath}/${cleanFileName}`,
      delete: `https://github.com/${blogBase.repo}/delete/main/${basePath}/${cleanFileName}`,
    },
    gitea: {
      new: `${blogBase.giteaUrl}/${blogBase.repo}/_new/main/${basePath}?filename=${cleanFileName}&value=${fileContent || ""}`,
      edit: `${blogBase.giteaUrl}/${blogBase.repo}/_edit/main/${basePath}/${cleanFileName}`,
      delete: `${blogBase.giteaUrl}/${blogBase.repo}/_delete/main/${basePath}/${cleanFileName}`,
    },
  };

  return url[blogBase.type][action];
}

// 新建模板
const postFileTemplate = `---
title:
published: ${getDate()}
description: 
tags: []
category: 
origin: ""
image: ""
---`;

const friendFileTemplate = `{
  "title": "",
  "link": "",
  "desc": "",
  "img": "",
  "folder": ""
}`;

const beijingNow = new Date(
  new Date().toLocaleString("en-US", { timeZone: "Asia/Shanghai" }),
);

const momentFileTemplate = `{
  "date": "${getDate()}",
  "time": "${String(beijingNow.getHours()).padStart(2, "0")}:${String(beijingNow.getMinutes()).padStart(2, "0")}",
  "content": "",
  "image": ""
}`;
</script>

<template>
  <div>
    <!-- 顶部标题 -->
    <h1 class="year">{{ globalConfig.lang[activeTab] }}</h1>

    <!-- Tab 切换 -->
    <div class="tags">
      <span
        class="tag"
        :class="{ active: activeTab === 'posts' }"
        @click="activeTab = 'posts'"
        @mouseenter="handleMouseEnter"
        @mousemove="handleMouseMove"
        @mouseleave="handleMouseLeave"
      >
        <Icon :icon="globalConfig.icon.recentPosts" />
        <span class="name">{{ globalConfig.lang.posts }}</span>
      </span>

      <span
        class="tag"
        :class="{ active: activeTab === 'moments' }"
        @click="activeTab = 'moments'"
        @mouseenter="handleMouseEnter"
        @mousemove="handleMouseMove"
        @mouseleave="handleMouseLeave"
      >
        <Icon :icon="globalConfig.icon.moment" />
        <span class="name">{{ globalConfig.lang.moments }}</span>
      </span>

      <span
        class="tag"
        :class="{ active: activeTab === 'friends' }"
        @click="activeTab = 'friends'"
        @mouseenter="handleMouseEnter"
        @mousemove="handleMouseMove"
        @mouseleave="handleMouseLeave"
      >
        <Icon :icon="globalConfig.icon.friends" />
        <span class="name">{{ globalConfig.lang.friends }}</span>
      </span>
    </div>

    <h1 class="year">{{ globalConfig.lang.contents }}</h1>

    <div class="posts-grid">
      <!-- POSTS -->
      <div
        v-if="activeTab === 'posts'"
        class="post-card diary"
        @mouseenter="handleMouseEnter"
        @mousemove="handleMouseMove"
        @mouseleave="handleMouseLeave"
      >
        <div class="textPlace">
          <div class="title">{{ globalConfig.lang.createANewPost }}</div>
          <div class="actions">
            <a
              :href="
                getRepoUrl(
                  'new',
                  'posts',
                  getTimeString() + '.md',
                  encodeURIComponent(postFileTemplate),
                )
              "
              target="_blank"
            >
              <Icon
                :icon="globalConfig.icon.new"
                style="color: var(--vp-c-brand-1)"
              />
            </a>
          </div>
        </div>
      </div>

      <div
        v-if="activeTab === 'posts'"
        v-for="post in groupedPosts"
        :key="post.url"
        class="post-card diary"
        @mouseenter="handleMouseEnter"
        @mousemove="handleMouseMove"
        @mouseleave="handleMouseLeave"
      >
        <div class="textPlace">
          <div class="title">{{ post.title }}</div>
          <div class="actions">
            <a :href="`${globalConfig.url}${post.url}`" target="_blank">
              <Icon :icon="globalConfig.icon.open" />
            </a>
            <a
              :href="getRepoUrl('edit', 'posts', post.filePath)"
              target="_blank"
            >
              <Icon :icon="globalConfig.icon.edit" />
            </a>
            <a
              :href="getRepoUrl('delete', 'posts', post.filePath)"
              target="_blank"
            >
              <Icon :icon="globalConfig.icon.delete" class="delete" />
            </a>
          </div>
        </div>
      </div>

      <!-- MOMENTS -->
      <div
        v-if="activeTab === 'moments'"
        class="post-card diary"
        @mouseenter="handleMouseEnter"
        @mousemove="handleMouseMove"
        @mouseleave="handleMouseLeave"
      >
        <div class="textPlace">
          <div class="title">{{ globalConfig.lang.createANewMoment }}</div>
          <div class="actions">
            <a
              :href="
                getRepoUrl(
                  'new',
                  'moments',
                  getTimeString() + '.json',
                  encodeURIComponent(momentFileTemplate),
                )
              "
              target="_blank"
            >
              <Icon
                :icon="globalConfig.icon.new"
                style="color: var(--vp-c-brand-1)"
              />
            </a>
          </div>
        </div>
      </div>

      <div
        v-if="activeTab === 'moments'"
        v-for="m in globalConfig.moments"
        :key="m.date + m.time"
        class="post-card diary"
        @mouseenter="handleMouseEnter"
        @mousemove="handleMouseMove"
        @mouseleave="handleMouseLeave"
      >
        <div class="textPlace">
          <div class="title">{{ m.content }}</div>
          <div class="actions">
            <a
              :href="getRepoUrl('edit', 'moments', m.fileName)"
              target="_blank"
            >
              <Icon :icon="globalConfig.icon.edit" />
            </a>
            <a
              :href="getRepoUrl('delete', 'moments', m.fileName)"
              target="_blank"
            >
              <Icon :icon="globalConfig.icon.delete" class="delete" />
            </a>
          </div>
        </div>
      </div>

      <!-- FRIENDS -->
      <div
        v-if="activeTab === 'friends'"
        class="post-card diary"
        @mouseenter="handleMouseEnter"
        @mousemove="handleMouseMove"
        @mouseleave="handleMouseLeave"
      >
        <div class="textPlace">
          <div class="title">{{ globalConfig.lang.addANewLink }}</div>
          <div class="actions">
            <a
              :href="
                getRepoUrl(
                  'new',
                  'friends',
                  getTimeString() + '.json',
                  encodeURIComponent(friendFileTemplate),
                )
              "
              target="_blank"
            >
              <Icon
                :icon="globalConfig.icon.new"
                style="color: var(--vp-c-brand-1)"
              />
            </a>
          </div>
        </div>
      </div>

      <div
        v-if="activeTab === 'friends'"
        v-for="f in globalConfig.friends"
        :key="f.link"
        class="post-card diary"
        @mouseenter="handleMouseEnter"
        @mousemove="handleMouseMove"
        @mouseleave="handleMouseLeave"
      >
        <div class="textPlace">
          <div class="title">{{ f.title }}</div>
          <p class="details">{{ f.desc }}</p>
          <div class="actions">
            <a :href="f.link" target="_blank">
              <Icon :icon="globalConfig.icon.open" />
            </a>
            <a
              :href="getRepoUrl('edit', 'friends', f.fileName)"
              target="_blank"
            >
              <Icon :icon="globalConfig.icon.edit" />
            </a>
            <a
              :href="getRepoUrl('delete', 'friends', f.fileName)"
              target="_blank"
            >
              <Icon :icon="globalConfig.icon.delete" class="delete" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.actions {
  margin-left: auto;
  z-index: 50;
  display: flex;
}

/* 原样保留你的所有样式 */
.post-card {
  display: flex;
  margin-bottom: var(--vp-gap);
}
.diary {
  flex: 1;
  border-radius: var(--vp-border-radius-2);
  border: 1px solid var(--vp-c-divider);
  display: flex;
  flex-direction: column;
  background-color: var(--vp-c-bg);
  will-change: transform;
  box-shadow: var(--vp-shadow);
  transition: all var(--vp-transition-time);
}
.diary:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: var(--vp-shadow-brand);
}
.textPlace {
  height: 55px !important;
  padding: 15px 25px;
  display: flex;
  height: 100%;
}
.meta {
  font-size: 13px;
  color: var(--vp-c-text-3);
  opacity: 0.8;
}
.title {
  display: block;
  align-self: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--vp-c-text-1);
  font-size: 16px;
  line-height: 18px;
  font-weight: 600;
  margin: 0;
  margin-right: 10px;
  transition: all var(--vp-transition-time);
}
.diary:hover .title {
  color: var(--vp-c-brand-2);
}
.details {
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 20px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.year {
  margin-top: 30px;
  line-height: 110px;
  font-size: 100px;
  position: relative;
  top: 30px;
  font-weight: bold;
  color: var(--vp-c-gutter);
  opacity: 0.7;
  z-index: -1;
  mask-image: linear-gradient(var(--vp-c-gutter) 20%, transparent);
  text-transform: uppercase;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.category {
  margin-right: 8px;
  color: var(--vp-c-text-1);
  background-color: var(--vp-c-border);
  padding: 2px 8px;
  border-radius: var(--vp-border-radius-1);
  font-size: 13px;
}
.tags {
  perspective: 1000px;
  border-radius: var(--vp-border-radius-1);
  transition: all var(--vp-transition-time);
  display: flex;
  flex-wrap: wrap;
  gap: var(--vp-gap);
}
.tag {
  font-family: var(--vp-font-family-mono);
  text-transform: uppercase;
  transition: all var(--vp-transition-time);
  padding: 12px 24px;
  color: var(--vp-c-text-1);
  background-color: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: inherit;
  box-shadow: var(--vp-shadow);
  text-decoration: none;
  font-size: 16px;
  margin: 0;
  will-change: transform;
}
span.name {
  font-weight: 600;
}
span.name,
span.count,
span.anchor {
  transition: all var(--vp-transition-time);
}
.tag:hover:not(.active) {
  border-color: var(--vp-c-brand-1);
  cursor: pointer;
  span.name,
  span.count,
  span.anchor {
    color: var(--vp-c-brand-2);
  }
}
.active {
  cursor: pointer;
  border-color: var(--vp-c-brand-1);
  box-shadow: var(--vp-shadow-brand);
  span.name,
  span.count,
  span.anchor {
    color: var(--vp-c-brand-2);
  }
}
.active .iconify {
  color: var(--vp-c-brand-2);
}
.tag:hover .iconify {
  color: var(--vp-c-brand-2);
}
.iconify {
  margin-left: 0px !important;
  margin-right: 10px;
}
.count {
  margin-left: 12px;
  border-radius: 100%;
  opacity: 0.7;
}
span.anchor {
  opacity: 0.4;
  margin-right: 4px;
}
div.tags,
.posts-grid {
  margin-bottom: 30px;
}
.iconify {
  margin-left: 8px;
  color: var(--vp-c-text-3);
  opacity: 0.6;
  transition: all var(--vp-transition-time);
}

.delete {
  color: var(--vp-c-danger-1);
}
</style>
