<template>
  <a
    class="last-moment"
    href="/moments"
    @mouseenter="handleMouseEnter"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <div class="content">
      <span class="content">{{
        lastMoment && lastMoment.content
          ? lastMoment.content.slice(0, 30) +
            (lastMoment.content.length > 30 ? "..." : "")
          : ""
      }}</span>
      <span class="datetime">{{
        lastMoment && lastMoment.date ? formatRelativeDate(lastMoment.date) : ""
      }}</span>
    </div>
  </a>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useCardHover } from "../../utils/useCardHover";
import { formatRelativeDate } from "../../utils/formatRelativeDate";
import { globalConfig } from "#config";

interface Moment {
  date: string;
  time: string;
  content: string;
}

const { handleMouseMove, handleMouseEnter, handleMouseLeave } = useCardHover();
const { moments } = globalConfig;

const lastMoment = ref<Moment | null>(null);
const loading = ref(true);
const error = ref("");

// 使用本地数据替代远程请求
function loadLastMoment() {
  loading.value = true;
  lastMoment.value = moments[0];
  loading.value = false;
}

onMounted(() => {
  loadLastMoment();
});
</script>

<style scoped>
.last-moment {
  margin-bottom: var(--vp-gap);
  font-size: 1rem;
  display: flex;
  gap: var(--vp-gap);
  border-radius: var(--vp-border-radius-1);
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg);
  transition: all var(--vp-transition-time);
  will-change: transform;
  padding: 15px 20px;
  box-shadow: var(--vp-shadow);
  text-decoration: none;
  overflow: hidden;
  justify-content: center;
  &:hover {
    border-color: var(--vp-c-brand-1);
    box-shadow: var(--vp-shadow-brand);
    span.content {
      color: var(--vp-c-brand-2);
    }
  }
}

.datetime {
  color: var(--vp-c-text-3);
  margin-left: 10px;
  opacity: 0.8;
}

span.content {
  font-weight: 600;
  color: var(--vp-c-text-1);
  transition: all var(--vp-transition-time);
}
</style>
