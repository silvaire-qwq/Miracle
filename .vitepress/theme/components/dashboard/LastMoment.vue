<template>
  <a
    class="last-moment"
    href="/moments"
    @mouseenter="handleMouseEnter"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <div class="content">
      <span class="text">
        {{ lastMoment && lastMoment.content ? lastMoment.content : "" }}
      </span>
      <span class="datetime">
        {{
          lastMoment && lastMoment.date
            ? formatRelativeDate(lastMoment.date)
            : ""
        }}
      </span>
    </div>
  </a>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useCardHover } from "../../utils/useCardHover";
import { formatRelativeDate } from "../../utils/formatRelativeDate";
import { globalConfig } from "#/config";

interface Moment {
  date: string;
  time: string;
  content: string;
}

const { handleMouseMove, handleMouseEnter, handleMouseLeave } = useCardHover();
const { moments } = globalConfig;

const lastMoment = ref<Moment | null>(null);

function loadLastMoment() {
  lastMoment.value = moments[0] || null;
}

onMounted(() => {
  loadLastMoment();
});
</script>

<style scoped>
.last-moment {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center;
  padding: 15px 25px;
  margin-bottom: var(--vp-gap);
  border-radius: var(--vp-border-radius-1);
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg);
  text-decoration: none;
  overflow: hidden;
  white-space: nowrap; /* 一行显示 */
  box-shadow: var(--vp-shadow);
  transition: all var(--vp-transition-time);
  will-change: transform;
}

.last-moment:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: var(--vp-shadow-brand);
}

.content {
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: 100%; /* 避免超出容器 */
  overflow: hidden; /* 超出隐藏 */
  justify-content: center; /* 内部内容居中 */
}

.text {
  font-weight: 600;
  color: var(--vp-c-text-1);
  text-overflow: ellipsis; /* 超出显示省略号 */
  overflow: hidden;
  white-space: nowrap;
  transition: color var(--vp-transition-time);
}

.last-moment:hover .text {
  color: var(--vp-c-brand-2);
}

.datetime {
  flex-shrink: 0; /* 日期不收缩 */
  color: var(--vp-c-text-3);
  opacity: 0.8;
}
</style>
