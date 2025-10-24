---
layout: home
footer: false
---

<script setup lang="ts">
import { ref, onMounted, computed, onBeforeUnmount } from 'vue';
import { generateGrid } from "#theme/utils/generateGrid";
import { columnCount, updateColumns } from "#theme/utils/dynamicColumns";
import { globalConfig } from "#config";

const playlist = ref<any[]>([]);

// 默认图片
const defaultImg = "https://pic2.zhimg.com/50/v2-cc1a32fcb444fc9d5e23f2ee078dc6e1_720w.jpg?source=1940ef5c";

onMounted(async () => {
  try {
    const response = await fetch(`https://meting.qjqq.cn/?type=playlist&id=${globalConfig.musicList}`);
    const data = await response.json();
    playlist.value = data;
    console.log('歌单数据:', playlist.value);
  } catch (error) {
    console.error('获取歌单失败:', error);
  }
  
  // 初始化列数并监听窗口变化
  updateColumns();
  window.addEventListener("resize", updateColumns);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateColumns);
});

function shuffle(array: any[]) {
  return array
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
}

// 按歌手分组并使用 generateGrid 进行布局
const groupedByArtist = computed(() => {
  // 创建一个处理后的数据数组，每个条目包含歌手名和对应的歌曲
  const processedItems: Array<{artist: string, song: any}> = [];
  
  playlist.value.forEach(song => {
    if (song.artist && song.artist.includes('/')) {
      // 拆分斜杠分隔的歌手名
      const artists = song.artist.split('/').map(artist => artist.trim());
      artists.forEach(artist => {
        processedItems.push({ artist, song });
      });
    } else {
      // 处理单个歌手的情况
      const artist = song.artist || "未知歌手";
      processedItems.push({ artist, song });
    }
  });

  // 使用 generateGrid 按歌手名分组
  return shuffle(generateGrid(
    processedItems, 
    undefined, 
    (item) => item.artist, 
    columnCount.value
  ));
});
</script>
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