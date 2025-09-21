<script setup lang="ts">
import { ref, computed } from "vue";
import { data as posts } from "../../utils/posts.data.mts";

const props = defineProps({
  maxItems: {
    type: Number,
    default: 6,
  },
});

// 按日期倒序排序（最新的在前）
const sortedPosts = computed(() =>
  [...posts].sort(
    (a, b) => new Date(b.originDate).getTime() - new Date(a.originDate).getTime()
  )
);

// 应用 maxItems 限制
const articles = computed(() => {
  return props.maxItems > 0
    ? sortedPosts.value.slice(0, props.maxItems)
    : sortedPosts.value;
});
</script>


<template>
  <div class="posts-grid">
    <div v-for="post in articles" :key="post.url" class="post-card">
      <PostCard
        :url="post.url"
        :title="post.title"
        :description="post.description"
        :category="post.category"
        :date="post.date"
      />
    </div>
  </div>
</template>

<style scoped>
.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--vp-gap);
}

.post-card {
  display: flex;
}

.diary {
  flex: 1;
  border-radius: var(--vp-border-radius-1);
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
  padding: 25px;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.meta {
  margin-top: auto;
  font-size: 13px;
  color: var(--vp-c-text-3);
  opacity: 0.8;
}

.title {
  color: var(--vp-c-text-1);
  font-size: 20px;
  line-height: 26px;
  font-weight: 600;
  margin: 0;
  transition: all var(--vp-transition-time);
}

.diary:hover .title {
  color: var(--vp-c-brand-1);
}

.details {
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 20px;
  margin: 8px 0 10px 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.category {
  margin-right: 8px;
  color: var(--vp-c-text-1);
  background-color: var(--vp-c-border);
  padding: 2px 8px;
  border-radius: var(--vp-border-radius-1);
  font-size: 13px;
}
</style>
