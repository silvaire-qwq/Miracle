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

// URL category
const urlParams = new URLSearchParams(window.location.search);
const selectedCategory = ref(urlParams.get("category"));

// negative 状态
import { useDeepHideNegative } from "../../utils/useDeepHideNegative";

const { showNegative, pendingTimer, hasShownByShortcut, initDeepHideListener } =
  useDeepHideNegative();

// 文章列表
const articles = ref(
  posts.filter((post) => showNegative.value || !post.negative),
);

// 更新文章
const updateArticles = () => {
  let filtered = posts.filter((post) => showNegative.value || !post.negative);

  if (selectedCategory.value) {
    filtered = filtered.filter(
      (post) => post.category === selectedCategory.value,
    );
  }

  if (props.maxItems > 0) {
    filtered = filtered.slice(0, props.maxItems);
  }

  articles.value = filtered;
};

// watch maxItems
watch(
  () => props.maxItems,
  () => updateArticles(),
);

// watch category
watch(selectedCategory, () => {
  nextTick(() => updateArticles());
});

// watch negative
watch(showNegative, () => {
  nextTick(() => updateArticles());
});

// mount
onMounted(() => {
  const cleanup = initDeepHideListener();

  updateColumns();
  window.addEventListener("resize", updateColumns);

  updateArticles();

  onBeforeUnmount(() => {
    cleanup?.();
    window.removeEventListener("resize", updateColumns);
  });
});
// unmount
onBeforeUnmount(() => {
  window.removeEventListener("resize", updateColumns);
  window.removeEventListener("keydown", handleKeydown);
});

// grid
const groupedArticles = computed(() => {
  const grid = generateGrid(
    articles.value,
    undefined,
    (post) => new Date(post.originDate).getFullYear().toString(),
    columnCount.value,
  );

  return grid.sort((a, b) => Number(b.key) - Number(a.key));
});

// categories
const categories = computed(() => {
  const set = new Set<string>();

  posts.forEach((post) => {
    // ❗关键：当不显示 negative 时，跳过 negative 文章
    if (!showNegative.value && post.negative) return;

    post.category.split(",").forEach((c) => set.add(c.trim()));
  });

  return Array.from(set);
});

// 是否存在 negative
const hasNegativePosts = computed(() => {
  return posts.some((post) => post.negative);
});

// category count
const categoryCounts = computed(() => {
  const counts: Record<string, number> = {};

  posts.forEach((post) => {
    if (!showNegative.value && post.negative) return;

    post.category.split(",").forEach((c) => {
      c = c.trim();
      counts[c] = (counts[c] || 0) + 1;
    });
  });

  return counts;
});

// category click
const handleCategoryClick = (category: string) => {
  const url = new URL(window.location.href);

  if (selectedCategory.value === category) {
    selectedCategory.value = null;
    url.searchParams.delete("category");
  } else {
    selectedCategory.value = category;
    url.searchParams.set("category", category);
  }

  window.history.pushState({}, "", url);
};

// 🔥 deep hide toggle（核心）
const toggleNegative = () => {
  showNegative.value = !showNegative.value;
};

// 🔥 键盘监听：S 延迟 1s 解锁
const handleKeydown = (e: KeyboardEvent) => {
  if (!globalConfig.deepHideNegative) return;

  if (e.key.toLowerCase() !== "s") return;

  if (hasShownByShortcut.value) return;
  if (pendingTimer.value) return;

  pendingTimer.value = window.setTimeout(() => {
    showNegative.value = true;
    hasShownByShortcut.value = true;
    pendingTimer.value = null;
  }, 1000);
};

// hover
const { handleMouseMove, handleMouseEnter, handleMouseLeave } = useCardHover();

/**
 * ✅ NEW: 控制 Negative 按钮是否显示
 */
const showNegativeButton = computed(() => {
  if (globalConfig.deepHideNegative) {
    return hasNegativePosts.value && hasShownByShortcut.value;
  }
  return hasNegativePosts.value;
});

// 可选：同步状态（更稳）
watch(showNegative, (val) => {
  if (globalConfig.deepHideNegative && val) {
    hasShownByShortcut.value = true;
  }
});
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

      <!-- Negative Button -->
      <span
        v-if="showNegativeButton"
        class="tag negative"
        @click="toggleNegative"
        @mouseenter="handleMouseEnter"
        @mousemove="handleMouseMove"
        @mouseleave="handleMouseLeave"
        :class="{ active: showNegative }"
      >
        <Icon
          :icon="globalConfig.icon.negative"
          style="opacity: 0.4; margin-right: 10px"
        />
        <span class="name">{{ globalConfig.lang.negative }}</span>
      </span>

      <!-- Categories -->
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
        <span class="name"><span class="anchor">※</span>{{ category }}</span>
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
