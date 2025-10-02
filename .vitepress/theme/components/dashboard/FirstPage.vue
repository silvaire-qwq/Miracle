<script setup lang="ts">
import { globalConfig } from "#config";
import { useCardHover } from "../../utils/useCardHover";
const { handleMouseMove, handleMouseEnter, handleMouseLeave } = useCardHover();
</script>

<template>
  <div
    class="first-page"
    v-if="globalConfig.homePage.modules.banner === 'avatar'"
  >
    <img :src="globalConfig.homePage.avatar" class="avatar" />
    <div class="self">
      <h1 class="author">{{ globalConfig.homePage.author }}</h1>
      <div class="btns">
        <div class="location btn">
          <Icon icon="fluent:location-16-regular" />
          {{ globalConfig.homePage.city }}
        </div>
        <a
          :href="`https://github.com/${globalConfig.github}`"
          class="github btn"
          ><Icon icon="lucide:github" /> GitHub</a
        >
      </div>
    </div>
  </div>
  <div
    class="image-page"
    v-else
    @mouseenter="handleMouseEnter"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <img :src="globalConfig.homePage.modules.banner" />
  </div>
</template>

<style scoped>
.first-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 18px;
  margin: 125px 0px;
}
.avatar {
  height: 112px;
  width: 112px;
  aspect-ratio: 1;
  border-radius: 100%;
  border: 1px solid var(--vp-c-divider);
  padding: 4px;
}

div.self {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
}

div.btns {
  display: flex;
  gap: 28px;
}

.iconify {
  margin-right: 3px;
}

.btn {
  color: var(--vp-c-text-1);
  font-weight: 500;
}

.image-page {
  width: 100% !important;
  margin: 20px 0px;
  height: calc(65vh - var(--vp-nav-height));
  transition: all var(--vp-transition-time);
  border-radius: var(--vp-border-radius-1);
  box-shadow: var(--vp-shadow);
  border: 1px solid var(--vp-c-divider);
  background-repeat: no-repeat;
  padding: 12px;
  &:hover {
    box-shadow: var(--vp-shadow-brand);
    border-color: var(--vp-c-brand);
  }
}

.image-page img {
  height: 100%;
  width: 100%;
  border-radius: var(--vp-border-radius-2);
  object-fit: cover;
  transition: all var(--vp-transition-time);
  /* position! bro! here! */
  object-position: center;
}
</style>
