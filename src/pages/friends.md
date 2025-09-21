---
layout: home
footer: false
---

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount } from "vue";
import { globalConfig } from "../../config.ts";
import { generateGrid } from "../utils/generateGrid";
import { columnCount, updateColumns } from "../utils/dynamicColumns";

// 打乱数组的简单函数
function shuffle(array: any[]) {
  return array
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
}

// 带默认头像的好友列表
const friends = shuffle(
  globalConfig.friends.map((friend) => ({
    ...friend,
    img:
      friend.img ||
      "https://pic2.zhimg.com/50/v2-cc1a32fcb444fc9d5e23f2ee078dc6e1_720w.jpg?source=1940ef5c",
  }))
);

// 监听窗口变化，更新列数
onMounted(() => {
  updateColumns();
  window.addEventListener("resize", updateColumns);
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", updateColumns);
});

// 🔹 瀑布流数据（这里不分组，所有朋友放在一起）
const friendGrid = computed(() =>
  generateGrid(friends, undefined, undefined, columnCount.value)
);
</script>

<div style="height: 40px;"></div>
<div class="allFriend">
  <div class="friends-grid">
    <div
      v-for="(col, colIndex) in friendGrid[0].columns"
      :key="colIndex"
      class="column"
    >
      <div v-for="friend in col" :key="friend.link" class="friend-card">
        <FriendCard
          :title="friend.title"
          :link="friend.link"
          :desc="friend.desc"
          :img="friend.img"
          :blog="friend.blog"
        />
      </div>
    </div>
  </div>
</div>

<style scoped>
.friends-grid {
  display: flex;
  gap: var(--vp-gap);
}
.column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--vp-gap);
}
</style>
