<template>
  <div style="height: 30px"></div>

  <!-- 加载状态提示（提升用户体验） -->
  <div v-if="isLoading" class="loading-box"></div>

  <template v-else>
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

    <!-- 错误或不匹配时的友情提示（可选） -->
    <div class="allFriend" style="margin-top: 50px" v-else>
      <div class="warning-banner">
        ⚠️ 站点配置校验未通过或数据未匹配，无法显示列表。
      </div>
    </div>
  </template>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { globalConfig } from "#config";
import { columnCount, updateColumns } from "#theme/utils/dynamicColumns";

// 💡 关键修改点 1：引入你的异步加载函数（注意检查你的方法名和路径是否一致）
import { clientSideLoad, type Friend } from "../../utils/miracleSrc";

// 💡 关键修改点 2：把原本只读的 computed 改为响应式的 ref 变量
const friendsList = ref<Friend[]>([]);
const trueNum = ref<boolean>(false);
const isLoading = ref<boolean>(true); // 默认处于加载中

const id = globalConfig.miracle.id;
const defaultImg =
  "https://pic2.zhimg.com/50/v2-cc1a32fcb444fc9d5e23f2ee078dc6e1_720w.jpg?source=1940ef5c";

// Track reactive layout resizing
onMounted(async () => {
  // 1. 窗口监听和列数初始化
  updateColumns();
  window.addEventListener("resize", updateColumns);

  // 💡 关键修改点 3：页面“打开时”，立刻在客户端实时跑一遍 fetch 逻辑
  try {
    const res = await clientSideLoad();
    friendsList.value = res.friends || [];
    trueNum.value = res.trueNum ?? false;
  } catch (error) {
    console.error("[Component] 实时数据加载失败:", error);
  } finally {
    // 关闭加载状态，渲染真实 DOM
    isLoading.value = false;
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateColumns);
});

// 纯响应式瀑布流分栏逻辑
const gridColumns = computed(() => {
  // 建立对应列数的空数组容器
  const cols = Array.from({ length: columnCount.value }, () => [] as Friend[]);

  friendsList.value.forEach((item: Friend, index: number) => {
    cols[index % columnCount.value].push(item);
  });
  return cols;
});
</script>

<style scoped>
/* 新增：加载中的动画和文字样式 */
.loading-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  gap: 12px;
  color: var(--vp-c-text-2);
  font-size: 14px;
}
.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid var(--vp-c-brand-2);
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 提示条样式 */
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
