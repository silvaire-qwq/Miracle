<script setup lang="ts">
import {
  ref,
  computed,
  watch,
  nextTick,
  onMounted,
  onBeforeUnmount,
} from "vue";
import { Icon } from "@iconify/vue";
import PostCard from "./postCard.vue";
import { generateGrid } from "../../utils/generateGrid";
import { useCardHover } from "../../utils/useCardHover";
import { columnCount, updateColumns } from "../../utils/dynamicColumns";
import { data as posts } from "../../data/posts.data";
import { globalConfig } from "#config";

const props = defineProps({
  maxItems: {
    type: Number,
    default: 0,
  },
});

// 获取 URL 中的 tag 参数
const urlParams = new URLSearchParams(window.location.search);
const selectedTag = ref(urlParams.get("tag"));

// 创建响应式文章列表
const articles = ref(posts);

// 限制文章数量
watch(
  () => props.maxItems,
  () => {
    if (props.maxItems > 0) {
      articles.value = posts.slice(0, props.maxItems);
    } else {
      articles.value = posts;
    }
  },
);

// 监听 selectedTag 变化
watch(selectedTag, (newTag) => {
  nextTick(() => {
    if (newTag) {
      articles.value = posts.filter((post) => post.tags?.includes(newTag));
    } else {
      articles.value = posts;
    }
  });
});

onMounted(() => {
  updateColumns();
  window.addEventListener("resize", updateColumns);

  if (selectedTag.value) {
    nextTick(() => {
      articles.value = posts.filter((post) =>
        post.tags?.includes(selectedTag.value!),
      );
    });
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateColumns);
});

// 按年份分组 + 瀑布流
const groupedArticles = computed(() => {
  const grid = generateGrid(
    articles.value,
    undefined,
    (post) => new Date(post.originDate).getFullYear().toString(),
    columnCount.value,
  );
  // 按年份倒序
  return grid.sort((a, b) => Number(b.key) - Number(a.key));
});

// 提取所有唯一标签
const tags = computed(() => {
  const allTags: Set<string> = new Set();
  posts.forEach((post) => {
    (post.tags || []).forEach((tag) => allTags.add(tag.trim()));
  });
  return Array.from(allTags);
});

// 获取每个标签的文章数量
const tagCounts = computed(() => {
  const counts: Record<string, number> = {};
  posts.forEach((post) => {
    (post.tags || []).forEach((tag) => {
      tag = tag.trim();
      counts[tag] = (counts[tag] || 0) + 1;
    });
  });
  return counts;
});

// 点击标签更新 URL
const handleTagClick = (tag: string) => {
  selectedTag.value = tag;
  const url = new URL(window.location.href);
  url.searchParams.set("tag", tag);
  window.history.pushState({}, "", url);
};

const { handleMouseMove, handleMouseEnter, handleMouseLeave } = useCardHover();
</script>

<template>
  <div>
    <h1 class="year">{{ globalConfig.lang.tags }}</h1>

    <!-- Tags Section -->
    <div class="tags">
      <a
        class="tag"
        href="/archives"
        @mouseenter="handleMouseEnter"
        @mousemove="handleMouseMove"
        @mouseleave="handleMouseLeave"
      >
        <Icon :icon="globalConfig.icon.category" style="opacity: 0.4" />
        <span class="name">{{ " " + globalConfig.lang.categories }}</span>
      </a>
      <span
        class="tag"
        @click="handleTagClick('')"
        @mouseenter="handleMouseEnter"
        @mousemove="handleMouseMove"
        @mouseleave="handleMouseLeave"
        :class="{ active: !selectedTag }"
      >
        <span class="name">{{ globalConfig.lang.allPosts }}</span>
      </span>
      <span
        v-for="tag in tags"
        :key="tag"
        class="tag"
        @click="handleTagClick(tag)"
        @mouseenter="handleMouseEnter"
        @mousemove="handleMouseMove"
        @mouseleave="handleMouseLeave"
        :class="{ active: selectedTag === tag }"
      >
        <span class="name"><span class="anchor">#</span>{{ tag }}</span>
        <span class="count">{{ tagCounts[tag] }}</span>
      </span>
    </div>

    <!-- Articles Grouped by Year -->
    <div v-for="group in groupedArticles" :key="group.key">
      <h1 class="year">{{ group.key }}</h1>
      <div class="posts-grid">
        <div
          v-for="(col, colIndex) in group.columns"
          :key="colIndex"
          class="column"
        >
          <div v-for="post in col" :key="post.url" class="post-card">
            <PostCard
              :image="post.image"
              :url="post.url"
              :title="post.title"
              :description="post.description"
              :category="post.category"
              :date="post.date"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("./style.css");
</style>
