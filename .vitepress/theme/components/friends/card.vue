<script setup lang="ts">
import { useCardHover } from "../../utils/useCardHover";
import { globalConfig } from "#config";
const { handleMouseMove, handleMouseEnter, handleMouseLeave } = useCardHover();

interface CardProps {
  title: string;
  link?: string;
  desc?: string;
  img?: string;
  folder?: string;
  type?: string;
}

const props = withDefaults(defineProps<CardProps>(), {
  title: "",
  link: "",
  desc: "",
  img: "",
  folder: "",
  type: "",
});
</script>

<template>
  <div
    class="card"
    @mouseenter="handleMouseEnter"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <a :href="props.link" target="_blank" class="card-link" rel="nofollow">
      <div class="cardInfo" :class="props.type">
        <div class="img-container" v-if="props.img">
          <img class="img" :src="props.img" :class="props.type" />
        </div>
        <div class="textInfo">
          <div class="title">{{ props.title }}</div>
          <div class="details"><Icon :icon="globalConfig.icon.singer" v-if="props.type" style="margin-right: 4px;"/>{{ props.desc }}</div>
        </div>
      </div>
    </a>
  </div>
</template>

<style scoped>
.card {
  border-radius: var(--vp-border-radius-1);
  border: 1px solid var(--vp-c-divider);
  height: 100%;
  background-color: var(--vp-c-bg);
  will-change: transform;
  box-shadow: var(--vp-shadow);
  transition: all var(--vp-transition-time);
}

.card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: var(--vp-shadow-brand);
}

.cardInfo {
  height: 100%;
  padding: 25px;
  display: flex;
  gap: var(--vp-gap);
}

.title {
  color: var(--vp-c-text-1);
  font-size: 20px;
  line-height: 26px;
  font-weight: 600;
  margin: 0;
  transition: all var(--vp-transition-time);
}

.card:hover .title {
  color: var(--vp-c-brand-2);
}

.details {
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 20px;
}
.img-container {
  aspect-ratio: 1;
  margin-right: 5px;
  width: 48px;
  height: 48px;
  align-self: center !important;
}

.img {
  border-radius: 100%;
}
.img.square {
  border-radius: var(--vp-border-radius-3);
}

.textInfo {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 3px;
  height: 100%;
}
</style>
