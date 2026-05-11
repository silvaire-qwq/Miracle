<script setup lang="ts">
import { onMounted, onUnmounted, computed } from "vue";
import { globalConfig } from "#config";
import { generateGrid } from "#theme/utils/generateGrid";
import { columnCount, updateColumns } from "#theme/utils/dynamicColumns";

// 1. 随机打乱原始数组（只在初始化时执行一次）
function shuffle<T>(array: T[]): T[] {
  return array
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
}

const allRandomPhotos = shuffle(globalConfig.photos || []);

// 2. 核心：根据当前列数，只取前 N 张，确保只排满“一行”
const photoGrid = computed(() => {
  const n = columnCount.value; // 当前一行能放几个

  // 动态截取：这一行要显示的图片数量 = 当前列数
  const oneRowPhotos = allRandomPhotos.slice(0, n);

  // 调用 generateGrid
  const grid = generateGrid(
    oneRowPhotos,
    n, // 限制总数等于列数
    undefined,
    n, // 列数
  );

  return grid[0]?.columns || [];
});

onMounted(() => {
  updateColumns();
  window.addEventListener("resize", updateColumns);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateColumns);
});
</script>

<template>
  <div class="allPhotos">
    <ClientOnly>
      <div class="songs-grid">
        <!-- 这里的 v-for 会根据列数渲染，由于总数等于列数，每列只会有一个 photo-card -->
        <div
          v-for="(col, colIndex) in photoGrid"
          :key="colIndex"
          class="column"
        >
          <div v-for="photo in col" :key="photo.path" class="photo-card">
            <PostCard
              :image="photo.path"
              :url="photo.path"
              :description="photo.fileName"
              meta="false"
            />
          </div>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>

<style scoped>
.songs-grid {
  display: flex;
  gap: var(--vp-gap);
  align-items: flex-start;
  width: 100%;
  /* 确保一行显示，不换行 */
  flex-wrap: nowrap;
}

.column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--vp-gap);
  min-width: 0;
}

.photo-card {
  width: 100%;
}
</style>
