<template>
  <div style="height: 30px"></div>

  <!-- 1. 加载状态提示（只要数据没跑完，就保持 Loading） -->
  <div v-if="isLoading" class="loading-box">
    <div class="spinner"></div>
    <span>{{ globalConfig.lang.gettingData }}</span>
  </div>

  <!-- 2. 数据获取完毕后的真实渲染 -->
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
      <!-- 💡 用 ClientOnly 确保瀑布流分栏计算完全在浏览器端运行 -->
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

    <!-- 校验失败的提示 -->
    <div class="allFriend" style="margin-top: 50px" v-else></div>
  </template>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { globalConfig } from "#config";
import { columnCount, updateColumns } from "#theme/utils/dynamicColumns";

// 💡 重点：这里**千万不要**直接静态 import { getMiracleData } !!
// 静态导入会被 Vite 编译死，我们改成在下方动态 import。
interface Friend {
  title: string;
  link: string;
  desc?: string;
  id: string;
  sourceId: string;
  img: string;
}

const friendsList = ref<Friend[]>([]);
const trueNum = ref<boolean>(false);
const isLoading = ref<boolean>(true);

const id = globalConfig.miracle.id;
const defaultImg =
  "https://pic2.zhimg.com/50/v2-cc1a32fcb444fc9d5e23f2ee078dc6e1_720w.jpg?source=1940ef5c";

onMounted(async () => {
  // 初始化响应式列数
  updateColumns();
  window.addEventListener("resize", updateColumns);

  try {
    // 💡【终极绝招】使用 import() 动态导入！
    // 迫使 Vite 将其作为纯客户端运行时代码打包，绝不会在打包编译阶段锁死数据
    const { getMiracleData } = await import("../../utils/miracleSrc");

    // 执行实时 fetch 请求
    const res = await getMiracleData();

    // 注入数据
    friendsList.value = res.friends || [];
    trueNum.value = res.trueNum ?? false;
  } catch (error) {
    console.error("[Component Runtime Error] 客户端实时加载失败:", error);
  } finally {
    // 数据拿到或报错后，均关闭 loading 状态
    isLoading.value = false;
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateColumns);
});

// 瀑布流分栏逻辑
const gridColumns = computed(() => {
  const cols = Array.from({ length: columnCount.value }, () => [] as Friend[]);
  friendsList.value.forEach((item: Friend, index: number) => {
    cols[index % columnCount.value].push(item);
  });
  return cols;
});
</script>

<style scoped>
/* 加载动画样式 */
.loading-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  gap: 16px;
  color: var(--vp-c-text-2);
  font-size: 14px;
}
.spinner {
  width: 28px;
  height: 28px;
  border: 3px solid var(--vp-c-brand-1);
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
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: var(--vp-c-red-1);
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
  text-align: center;
}

/* 原始样式保持不变 */
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
