<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { globalConfig } from "../../../config";
import { formatRelativeDate } from "../../utils/formatRelativeDate";
import { generateGrid } from "../../utils/generateGrid";
import { columnCount, updateColumns } from "../../utils/dynamicColumns";
import { useCardHover } from "../../utils/useCardHover";

const props = defineProps<{ maxItems?: number }>();

onMounted(() => {
  updateColumns();
  window.addEventListener("resize", updateColumns);
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", updateColumns);
});

// 🔹 瀑布流数据，按年份分组，动态列数
const groupedMoments = computed(() =>
  generateGrid(
    globalConfig.moments,
    props.maxItems,
    (item: any) =>
      item.date ? new Date(item.date).getFullYear().toString() : "all",
    columnCount.value
  )
);
</script>

<template>
  <div v-for="group in groupedMoments" :key="group.key">
    <h1 class="year">{{ group.key }}</h1>
    <div class="posts-grid">
      <div
        v-for="(col, colIndex) in group.columns"
        :key="colIndex"
        class="column"
      >
        <div v-for="moment in col">
          <PostCard
            :key="moment.fileName"
            :description="moment.content"
            :date="formatRelativeDate(moment.date)"
            :image="moment.image"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.posts-grid {
  display: flex;
  gap: var(--vp-gap);
  margin-bottom: 24px;
}
.column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--vp-gap);
}
.momentImage {
  border-radius: var(--vp-border-radius-1) var(--vp-border-radius-1) 0 0;
  border-bottom: 1px solid var(--vp-c-divider);
  height: 200px;
  width: 100%;
  object-fit: cover;
}
.post-card {
  display: flex;
  flex: 1;
  border-radius: var(--vp-border-radius-1);
  border: 1px solid var(--vp-c-divider);
  flex-direction: column;
  background-color: var(--vp-c-bg);
  will-change: transform;
  box-shadow: var(--vp-shadow);
  transition: all var(--vp-transition-time);
}
.post-card:hover {
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
  font-weight: 500;
  color: var(--vp-c-text-3);
  opacity: 0.8;
}
.content {
  color: var(--vp-c-text-1);
  font-weight: 500;
  font-size: 16px;
  line-height: 22px;
  margin-bottom: 6px;
  transition: all var(--vp-transition-time);
}
.diary:hover .content {
  color: var(--vp-c-brand-1);
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
span.at {
  opacity: 0.5;
}
</style>
