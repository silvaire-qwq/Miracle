---
layout: home
footer: false
---

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount } from "vue";
import { generateGrid } from "#theme/utils/generateGrid";
import { columnCount, updateColumns } from "#theme/utils/dynamicColumns";
import { globalConfig } from "#config";

const friendWeights: Record<string, number> = globalConfig.friendWeights

const defaultImg = "https://pic2.zhimg.com/50/v2-cc1a32fcb444fc9d5e23f2ee078dc6e1_720w.jpg?source=1940ef5c";

const { friends } = globalConfig;

onMounted(() => {
  updateColumns();
  window.addEventListener("resize", updateColumns);
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", updateColumns);
});

const groupedFriends = computed(() => {
  const raw = generateGrid(
    friends,
    undefined,
    (friend) => friend.folder ?? "friends",
    columnCount.value
  );

  return raw.sort((a, b) => {
    const wa = friendWeights[a.key] ?? 0;
    const wb = friendWeights[b.key] ?? 0;
    if (wa === wb) return a.key.localeCompare(b.key);
    return wa - wb;
  });
});
</script>

<div class="allFriend">
  <ClientOnly>
    <div v-for="group in groupedFriends" :key="group.key" style="margin-bottom: 32px;">
      <h1 class="year">{{ group.key }}</h1>
      <div class="friends-grid">
        <div
          v-for="(col, colIndex) in group.columns"
          :key="colIndex"
          class="column"
        >
          <div v-for="friend in col" :key="friend.link" class="friend-card">
            <FriendCard
              :title="friend.title"
              :link="friend.link"
              :desc="friend.desc"
              :img="friend.folder === 'unable' ? defaultImg : (friend.img ?? defaultImg)"
              :folder="friend.folder"
            />
          </div>
        </div>
      </div>
    </div>
  </ClientOnly>
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
.year {
  margin: 12px 0;
  font-size: 1.2rem;
  font-weight: 600;
}
.year {
    margin-top: 30px;
    line-height: 110px;
    font-size: 100px;
    position: relative;
    top: 40px;
    font-weight: bold;
    color: var(--vp-c-gutter);
    opacity: 0.7;
    z-index: -1;
    mask-image: linear-gradient(var(--vp-c-gutter) 20%, transparent);
    text-transform: var(--vp-title-uppercase);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>