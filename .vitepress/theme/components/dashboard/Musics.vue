---
layout: home
footer: false
---

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { globalConfig } from "#config";

const playlist = ref<any[]>([]);

// 默认封面
const defaultImg =
  "https://pic2.zhimg.com/50/v2-cc1a32fcb444fc9d5e23f2ee078dc6e1_720w.jpg?source=1940ef5c";

// 获取歌单数据
onMounted(async () => {
  try {
    const response = await fetch(
      `https://meting.qjqq.cn/?type=playlist&id=${globalConfig.musicList}`,
    );
    const data = await response.json();
    playlist.value = data;
    console.log("🎵 已加载歌单数据:", playlist.value);
  } catch (error) {
    console.error("❌ 获取歌单失败:", error);
  }
});

// 随机打乱数组
function shuffle(array: any[]) {
  return array
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
}

// 取前 6 首随机歌曲
const limitedSongs = computed(() => {
  if (!playlist.value.length) return [];
  return shuffle(playlist.value).slice(0, 6);
});
</script>

<template>
  <div class="songs-grid">
    <ClientOnly>
      <div v-for="song in limitedSongs" :key="song.url" class="song-card">
        <FriendCard
          :title="song.name"
          :link="song.url"
          :desc="song.artist"
          :img="song.pic || defaultImg"
          type="square"
        />
      </div>
    </ClientOnly>
  </div>
</template>

<style scoped>
.songs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--vp-gap);
}
</style>
