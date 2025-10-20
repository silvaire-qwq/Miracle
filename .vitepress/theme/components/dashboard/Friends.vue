<template>
  <div class="first-page"></div>
  <ClientOnly>
    <div class="friend-grid">
      <div
        v-for="friend in friends"
        :key="friend.title"
        class="friend-card"
        @mouseenter="handleMouseEnter"
        @mousemove="handleMouseMove"
        @mouseleave="handleMouseLeave"
      >
        <a :href="friend.link" target="_blank" class="friend-inner">
          <img :src="friend.img" alt="" class="friend-icon" />
          <div class="friend-info">
            <p class="friend-title">{{ friend.title }}</p>
          </div>
        </a>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { globalConfig } from "#/config";

function shuffle(array: any[]) {
  return array
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
}

const friends = shuffle(
  globalConfig.friends
    .filter((friend) => friend.folder !== "unable") // 排除掉 folder 为 "unable" 的好友
    .map((friend) => ({
      ...friend,
      img:
        friend.img ||
        "https://pic2.zhimg.com/50/v2-cc1a32fcb444fc9d5e23f2ee078dc6e1_720w.jpg?source=1940ef5c",
    })),
);

import { useCardHover } from "../../utils/useCardHover";
const { handleMouseMove, handleMouseEnter, handleMouseLeave } = useCardHover();
</script>

<style scoped>
.friend-grid {
  display: flex;
  flex-wrap: wrap;
  gap: var(--vp-gap);
}

.friend-card {
  perspective: 1000px;
  border-radius: var(--vp-border-radius-1);
  transition: all var(--vp-transition-time);
}

.friend-inner {
  display: flex;
  align-items: center;
  gap: var(--vp-gap);
  transition: all var(--vp-transition-time);
  padding: 16px;
  background-color: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: inherit;
  box-shadow: var(--vp-shadow);
  text-decoration: none;
  color: inherit;
  will-change: transform;
}

.friend-card:hover .friend-inner {
  border-color: var(--vp-c-brand-1);
  box-shadow: var(--vp-shadow-brand);
}

.friend-card:hover .friend-title {
  color: var(--vp-c-brand-2);
}

.friend-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

.friend-info {
  display: flex;
  flex-direction: column;
}

.friend-title {
  font-weight: 600;
  transition: all var(--vp-transition-time);
  font-size: 16px;
  margin: 0;
}
</style>
