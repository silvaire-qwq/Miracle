<script setup lang="ts">
import { computed } from "vue";
import { data as posts } from "../../data/posts.data";
import PostCard from "../article/postCard.vue";

const props = defineProps({
  maxItems: {
    type: Number,
    default: 6,
  },
});

// 先过滤掉 negative: true 的文章，再应用 maxItems 限制
const articles = computed(() => {
  const filteredPosts = posts.filter((post) => post.negative !== true);

  return props.maxItems > 0
    ? filteredPosts.slice(0, props.maxItems)
    : filteredPosts;
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
        :originDate="post.originDate"
        :negative="post.negative"
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
