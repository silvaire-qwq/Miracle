<script setup lang="ts">
import { computed } from "vue";
import { useCardHover } from "../../utils/useCardHover";
import { globalConfig } from "#config";

interface CardProps {
  title?: string;
  url?: string;
  description?: string;
  category?: string;
  date?: string;
  image?: string;
  type?: string;
}

const props = withDefaults(defineProps<CardProps>(), {
  title: "",
  url: "",
  description: "",
  category: "",
  date: "",
  image: "",
  type: "",
});

const { handleMouseMove, handleMouseEnter, handleMouseLeave } = useCardHover();

// 计算最终跳转链接
const link = computed(() => {
  if (props.type === "project" && props.category) {
    return `https://github.com/${props.category}`;
  }
  return props.url || "";
});

// 处理换行符
const descriptionText = computed(() => {
  if (!props.description) return "";
  return props.description
    .replace(/\\\\n/g, "\n")
    .replace(/\\n/g, "\n")
    .replace(/\r\n/g, "\n");
});

// 判断是否可点击
const isClickable = computed(() => !!link.value);
</script>

<template>
  <!-- 用 a 或 div 动态渲染 -->
  <component
    :is="isClickable ? 'a' : 'div'"
    :href="isClickable ? link : undefined"
    :type="props.type"
    class="diary"
    @mouseenter="handleMouseEnter"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <div v-if="props.image" class="img-container">
      <img :src="props.image" />
    </div>

    <div class="textPlace">
      <p class="title" v-if="props.title">{{ props.title }}</p>

      <!-- 支持换行 -->
      <p class="details" v-if="props.description && props.title">
        {{ descriptionText }}
      </p>
      <p class="details notitle" v-else-if="props.description">
        {{ descriptionText }}
      </p>

      <div class="meta">
        <!-- 分类显示 -->
        <template v-if="props.category">
          <a
            v-if="props.type === 'project'"
            class="category"
            :href="link"
          >
            <Icon
              :icon="globalConfig.icon.friends"
            />
            {{ props.category }}
          </a>
          <a
            v-else
            class="category"
            :href="`/archives?category=${props.category}`"
          >
            <Icon
              :icon="globalConfig.icon.new"
            />
            {{ props.category }}
          </a>
        </template>

        <span class="date">
          <Icon
            v-if="!props.category"
            :icon="globalConfig.icon.calendar"
            style="margin-right: 3px; bottom: 0px;"
          />
          {{ props.date }}
        </span>
      </div>
    </div>
  </component>
</template>

<style scoped>
.img-container img {
  border-radius: var(--vp-border-radius-1) var(--vp-border-radius-1) 0 0;
  border-bottom: 1px solid var(--vp-c-divider);
  height: 200px;
  width: 100%;
  object-fit: cover;
}

.iconify {
  position: relative;
  bottom: 1px;
}

.diary {
  flex: 1;
  border-radius: var(--vp-border-radius-1);
  border: 1px solid var(--vp-c-divider);
  display: flex;
  flex-direction: column;
  background-color: var(--vp-c-bg);
  will-change: transform;
  box-shadow: var(--vp-shadow);
  transition: all var(--vp-transition-time);
  z-index: 1;
}

.diary[type="project"] .title {
  text-transform: var(--vp-title-uppercase);
  font-family: var(--vp-font-family-mono);
}

.diary:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: var(--vp-shadow-brand);
}

.textPlace {
  padding: 25px;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.meta {
  margin-top: auto;
  font-size: 13px;
  color: var(--vp-c-text-3);
  opacity: 0.8;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 500;
}

.title {
  margin-bottom: 8px !important;
  color: var(--vp-c-text-1);
  font-size: 20px;
  line-height: 26px;
  font-weight: 600;
  margin: 0;
  text-transform: capitalize;
  transition: all var(--vp-transition-time);
}

.diary:hover .title {
  color: var(--vp-c-brand-2);
}

/* ✅ 关键：换行 + 自动换行 */
.details {
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 20px;
  margin: 0 0 10px 0;
  white-space: pre-line;
  overflow-wrap: break-word;
  font-weight: 500;
}

.notitle {
  font-size: 15px;
}

.category {
  margin-right: 5px;
  color: var(--vp-c-text-2);
  opacity: 0.8;
  background-color: var(--vp-c-border);
  padding: 2px 9px;
  border-radius: var(--vp-border-radius-1);
  font-size: 13px;
}
.category:hover {
  color: var(--vp-c-text-1);
  opacity: 1;
}
</style>
