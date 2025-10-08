<script setup lang="ts">
import { computed } from "vue";
import { data as posts } from "../../data/posts.data";

const props = defineProps({
  maxItems: {
    type: Number,
    default: 6
  }
});

// 应用 maxItems 限制
const articles = computed(() =>
  (props.maxItems > 0) ? posts.slice(0, props.maxItems) : posts
);
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
</style>
