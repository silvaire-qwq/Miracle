---
layout: home
footer: false
---

<script setup lang="ts">
import { ref, onMounted, computed, onBeforeUnmount, nextTick } from 'vue';
import { generateGrid } from "#theme/utils/generateGrid";
import { columnCount, updateColumns } from "#theme/utils/dynamicColumns";
import { useCardHover } from "#theme/utils/useCardHover";
import { globalConfig } from "#config";
const { handleMouseMove, handleMouseEnter, handleMouseLeave } = useCardHover();

const playlist = ref<any[]>([]);
const selectedSinger = ref<string | null>(null);

// 默认图片
const defaultImg = "https://pic2.zhimg.com/50/v2-cc1a32fcb444fc9d5e23f2ee078dc6e1_720w.jpg?source=1940ef5c";

onMounted(async () => {
  // 初始化选中标签（刷新页面时保持状态）
  const urlParams = new URLSearchParams(window.location.search);
  const singerFromUrl = urlParams.get("singer")?.trim();
  if (singerFromUrl) selectedSinger.value = singerFromUrl;

  // 获取歌单数据
  try {
    const response = await fetch(`https://api.injahow.cn/meting/?type=playlist&id=${globalConfig.musicList}`);
    const data = await response.json();
    playlist.value = data;
    console.log('歌单数据:', playlist.value);
  } catch (error) {
    console.error('获取歌单失败:', error);
  }

  updateColumns();
  window.addEventListener("resize", updateColumns);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateColumns);
});

// 打乱数组
function shuffle(array: any[]) {
  return array
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
}

// 🔹 歌手标签列表（随机显示 20 个）
const singers = computed(() => {
  const set = new Set<string>();
  playlist.value.forEach(song => {
    if (song.artist && song.artist.includes('/')) {
      song.artist.split('/').forEach(a => set.add(a.trim()));
    } else {
      set.add(song.artist || "Unknown Artist");
    }
  });

  const allSingers = Array.from(set);
  const shuffled = allSingers
    .map(a => ({ a, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ a }) => a);

  return shuffled.slice(0, 20); // ✅ 随机选 20 个
});

// 🔹 处理歌手分组（仅显示这 20 个随机歌手的歌曲）
const groupedByArtist = computed(() => {
  const filterSinger = selectedSinger.value?.trim().toLowerCase();
  const visibleSingers = singers.value.map(s => s.toLowerCase()); // ✅ 当前可见歌手名单
  const processedItems: Array<{ artist: string; song: any }> = [];

  playlist.value.forEach(song => {
    if (!song.artist) return;

    const artists = song.artist.split('/').map(a => a.trim());
    artists.forEach(artist => {
      const artistLower = artist.toLowerCase();

      // ✅ 只收录“当前随机20位歌手”中的歌曲
      if (visibleSingers.includes(artistLower)) {
        // ✅ 如果选中了特定歌手，则再过滤
        if (!filterSinger || artistLower === filterSinger) {
          processedItems.push({ artist, song });
        }
      }
    });
  });

  return shuffle(generateGrid(
    processedItems,
    undefined,
    (item) => item.artist,
    columnCount.value
  ));
});



// 🔹 点击标签
const handleSingerClick = (singer: string) => {
  selectedSinger.value = singer || null;

  const url = new URL(window.location.href);
  if (singer) url.searchParams.set("singer", singer);
  else url.searchParams.delete("singer");
  window.history.pushState({}, "", url);
};
</script>

<h1 class="artist">{{ globalConfig.lang.artists }}</h1>
<div class="tags">
  <span
    class="tag"
    @click="handleSingerClick('')"
    :class="{ active: !selectedSinger }"
    @mouseenter="handleMouseEnter"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
>
    <span class="name">{{ globalConfig.lang.allArtists }}</span>
  </span>
  <span
    v-for="singer in singers"
    :key="singer"
    class="tag"
    @click="handleSingerClick(singer)"
    :class="{ active: selectedSinger === singer }"
    @mouseenter="handleMouseEnter"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <span class="name">{{ singer }}</span>
  </span>
</div>

<div class="allSongs">
  <ClientOnly>
    <div v-for="group in groupedByArtist" :key="group.key" style="margin-bottom: 32px;">
      <h1 class="artist">{{ group.key }}</h1>
      <div class="songs-grid">
        <div
          v-for="(col, colIndex) in group.columns"
          :key="colIndex"
          class="column"
        >
          <div v-for="item in col" :key="item.song.url" class="song-card">
            <FriendCard
              :title="item.song.name"
              :link="item.song.url"
              type="square"
              :desc="item.song.artist"
              :img="item.song.pic || defaultImg"
            />
          </div>
        </div>
      </div>
    </div>
  </ClientOnly>
</div>

<style scoped>
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--vp-gap);
  margin-bottom: 30px;
}
.tag {
  font-family: var(--vp-font-family-mono);
  text-transform: var(--vp-title-uppercase);
  font-weight: 600;
  padding: 12px 24px;
  color: var(--vp-c-text-1);
  background-color: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--vp-border-radius-1);
  box-shadow: var(--vp-shadow);
  cursor: pointer;
  transition: all var(--vp-transition-time);
}
.tag:hover:not(.active) {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-2);
}
.active {
  border-color: var(--vp-c-brand-1);
  box-shadow: var(--vp-shadow-brand);
  color: var(--vp-c-brand-2);
}

.songs-grid {
  display: flex;
  gap: var(--vp-gap);
}
.column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--vp-gap);
}
.artist {
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
  text-transform: var(--vp-title-uppercase);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
