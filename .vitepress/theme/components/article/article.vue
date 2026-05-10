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
import { formatRelativeDate } from "../../utils/formatRelativeDate";
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

// 获取 URL 中的 category 参数
const urlParams = new URLSearchParams(window.location.search);
const selectedCategory = ref(urlParams.get("category"));

// 创建一个响应式变量来存储过滤后的文章
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

// 监听 selectedCategory 的变化，重新过滤文章
watch(selectedCategory, (newCategory) => {
  nextTick(() => {
    if (newCategory) {
      articles.value = posts.filter((post) => post.category === newCategory);
    } else {
      articles.value = posts;
    }
  });
});

onMounted(() => {
  updateColumns();
  window.addEventListener("resize", updateColumns);

  if (selectedCategory.value) {
    nextTick(() => {
      articles.value = posts.filter(
        (post) => post.category === selectedCategory.value,
      );
    });
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateColumns);
});

// 🔹 按年份分组 + 瀑布流布局
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

// 提取所有唯一的类别
const categories = computed(() => {
  const allCategories: Set<string> = new Set();
  posts.forEach((post) => {
    post.category
      .split(",")
      .forEach((category) => allCategories.add(category.trim()));
  });
  return Array.from(allCategories);
});

// 获取每个类别的文章数量
const categoryCounts = computed(() => {
  const counts: Record<string, number> = {};
  posts.forEach((post) => {
    post.category.split(",").forEach((category) => {
      category = category.trim();
      counts[category] = (counts[category] || 0) + 1;
    });
  });
  return counts;
});

// 点击某个类别时更新 URL 中的 category 参数
const handleCategoryClick = (category: string) => {
  selectedCategory.value = category;
  const url = new URL(window.location.href);
  url.searchParams.set("category", category); // 更新 URL
  window.history.pushState({}, "", url); // 更改 URL并保留浏览历史
};

// 卡片悬浮效果
const { handleMouseMove, handleMouseEnter, handleMouseLeave } = useCardHover();
</script>

<template>
  <div>
    <h1 class="year">{{ globalConfig.lang.categories }}</h1>

    <!-- Categories Section -->
    <div class="tags">
      <a
        class="tag"
        href="/tags"
        @mouseenter="handleMouseEnter"
        @mousemove="handleMouseMove"
        @mouseleave="handleMouseLeave"
      >
        <Icon
          :icon="globalConfig.icon.tag"
          style="opacity: 0.4; margin-right: 10px"
        />
        <span class="name">{{ globalConfig.lang.tags }}</span>
      </a>
      <span
        class="tag"
        @click="handleCategoryClick('')"
        @mouseenter="handleMouseEnter"
        @mousemove="handleMouseMove"
        @mouseleave="handleMouseLeave"
        :class="{ active: !selectedCategory }"
      >
        <span class="name">{{ globalConfig.lang.allPosts }}</span>
      </span>
      <span
        v-for="category in categories"
        :key="category"
        class="tag"
        @click="handleCategoryClick(category)"
        @mouseenter="handleMouseEnter"
        @mousemove="handleMouseMove"
        @mouseleave="handleMouseLeave"
        :class="{ active: selectedCategory === category }"
      >
        <span class="name"><span class="anchor">#</span>{{ category }}</span>
        <span class="count">{{ categoryCounts[category] }}</span>
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
              :originDate="post.originDate"
              :negative="post.negative"
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
