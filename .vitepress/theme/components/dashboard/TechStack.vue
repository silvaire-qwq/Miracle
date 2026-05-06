<template>
  <div class="tech-grid">
    <div
      v-for="stack in stacks"
      :key="stack.name"
      class="tech-card"
      @mouseenter="handleMouseEnter"
      @mousemove="handleMouseMove"
      @mouseleave="handleMouseLeave"
    >
      <div class="tech-inner">
        <img :src="stack.icon" alt="" class="tech-icon" />
        <span class="tech-name">{{ stack.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { globalConfig } from "#config";

const stacks = ref(globalConfig.homePage.stacks);

// 动态生成完整 URL
stacks.value = stacks.value.map((stack) => ({
  ...stack,
  icon: `https://jsd-proxy.ygxz.in/gh/devicons/devicon/icons/${stack.icon}/${stack.icon}-original.svg`,
}));

// 自动按首字母排序
stacks.value.sort((a, b) => a.name.localeCompare(b.name));

import { useCardHover } from "../../utils/useCardHover";
const { handleMouseMove, handleMouseEnter, handleMouseLeave } = useCardHover();
</script>

<style scoped>
.tech-grid {
  display: flex;
  flex-wrap: wrap;
  gap: var(--vp-gap);
  align-items: flex-start;
}

.tech-card {
  perspective: 1000px;
  transition: all var(--vp-transition-time);
  border-radius: var(--vp-border-radius-1);
}

.tech-inner {
  display: flex;
  transition: all var(--vp-transition-time);
  align-items: center;
  gap: var(--vp-gap);
  padding: 16px;
  background-color: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: inherit;
  box-shadow: var(--vp-shadow);
  will-change: transform;
  white-space: nowrap; /* 防止文本换行 */
}

.tech-card:hover .tech-inner {
  border-color: var(--vp-c-brand-1);
  box-shadow: var(--vp-shadow-brand);
  transform: scale(1.03);
}

.tech-icon {
  width: 24px;
  height: 24px;
}

.tech-name {
  font-weight: 600;
}
</style>
