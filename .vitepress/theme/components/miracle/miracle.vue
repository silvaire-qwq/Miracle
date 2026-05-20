<template>
  <div style="height: 30px"></div>

  <div
    class="num"
    :style="{
      color: trueNum ? 'var(--vp-c-green-1)' : 'var(--vp-c-red-1)',
    }"
  >
    <span class="anchor">#</span>{{ id }}
  </div>
  <div class="desc">
    {{ globalConfig.lang.prodesc }}
  </div>

  <!-- Miracle Grid Section -->
  <div class="allFriend" style="margin-top: 50px" v-if="trueNum">
    <ClientOnly>
      <div class="friends-grid">
        <div
          v-for="(col, colIndex) in gridColumns"
          :key="colIndex"
          class="column"
        >
          <div v-for="friend in col" :key="friend.link" class="friend-card">
            <FriendCard
              :title="'#' + friend.id"
              :link="friend.link"
              :desc="friend.title"
              :img="friend.img || defaultImg"
              :style="{
                '--title': 'var(--vp-font-family-mono)',
              }"
            />
          </div>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount } from "vue";
import { globalConfig } from "#config";
import { columnCount, updateColumns } from "#theme/utils/dynamicColumns";
// 引入解构后的数据
import { data as miracleData } from "../../data/miracle.data";
console.log(miracleData);

// 从打包的数据对象中，安全解构出列表数组和布尔值
const friendsList = computed(() => miracleData?.friends || []);
const trueNum = computed(() => miracleData?.trueNum ?? false);

const id = globalConfig.miracle.id;
const defaultImg =
  "https://pic2.zhimg.com/50/v2-cc1a32fcb444fc9d5e23f2ee078dc6e1_720w.jpg?source=1940ef5c";

// Track reactive layout resizing
onMounted(() => {
  updateColumns();
  window.addEventListener("resize", updateColumns);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateColumns);
});

// 纯响应式瀑布流分栏逻辑
const gridColumns = computed(() => {
  // 建立对应列数的空数组容器，类型推导基于完整的朋友列表项
  const cols = Array.from(
    { length: columnCount.value },
    () => [] as typeof friendsList.value,
  );

  // 修复点：使用解构后的数组 friendsList 进行循环
  friendsList.value.forEach((item: any, index: any) => {
    cols[index % columnCount.value].push(item);
  });
  return cols;
});
</script>

<style scoped>
/* 新增：提示条样式，你可以根据主题自行美化 */
.warning-banner {
  padding: 12px 16px;
  background-color: rgba(234, 179, 8, 0.15);
  border: 1px solid rgba(234, 179, 8, 0.3);
  color: #ca8a04;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
}

/* Original Title Styles */
.num {
  margin-top: 30px;
  margin-bottom: 10px;
  line-height: 110px;
  font-size: 100px;
  font-weight: bold;
  font-family: var(--vp-font-family-mono);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.anchor {
  opacity: 0.5;
}
.desc {
  opacity: 0.8;
  font-weight: 500;
}

/* Base Layout Grid Styles */
.friends-grid {
  display: flex;
  gap: var(--vp-gap);
  margin-top: 20px;
}
.column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--vp-gap);
}
</style>
