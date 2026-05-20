<template>
  <div style="height: 30px"></div>
  <div class="num"><span class="anchor">#</span>{{ id }}</div>
  <div class="desc">
    {{ globalConfig.lang.prodesc }}
  </div>

  <!-- Miracle Grid Section -->
  <div class="allFriend">
    <ClientOnly>
      <div class="friends-grid">
        <div
          v-for="(col, colIndex) in gridColumns"
          :key="colIndex"
          class="column"
        >
          <div v-for="friend in col" :key="friend.link" class="friend-card">
            <FriendCard
              :title="friend.title"
              :link="friend.link"
              :desc="friend.desc"
              :img="friend.img || defaultImg"
              :folder="friend.folder"
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
// Import the data fetched by your new loader
import { data as miracleData } from "../../data/miracle.data";
console.log(miracleData);

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

// A pure responsive distribution logic into active grid columns without categories
const gridColumns = computed(() => {
  const cols = Array.from(
    { length: columnCount.value },
    () => [] as typeof miracleData,
  );
  miracleData.forEach((item, index) => {
    cols[index % columnCount.value].push(item);
  });
  return cols;
});
</script>

<style scoped>
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
