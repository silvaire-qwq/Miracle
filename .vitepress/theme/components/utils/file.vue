<script setup lang="ts">
interface CardProps {
  url: string;
  name?: string;
  icon: string;
}

const props = withDefaults(defineProps<CardProps>(), {
  url: "",
  name: "",
  icon: "",
});

function getFileName(url: string) {
  const parts = url.split("/");
  return parts[parts.length - 1];
}
</script>

<template>
  <a :href="url" target="_blank" class="nocss">
    <Icon :icon="props.icon"></Icon>
    <span>{{ name ? name : getFileName(url) }}</span>
  </a>
</template>

<style lang="css" scoped>
a {
  background-color: var(--vp-c-bg-alt) !important;
  padding: 5px 13px !important;
  margin: 0px 7px;
  border-radius: var(--vp-border-radius-3);
  border: 1px solid var(--vp-c-divider);
  transition: all var(--vp-transition-time) !important;
  box-shadow: var(--vp-shadow);
  span,
  .iconify {
    color: var(--vp-c-text-1) !important;
  }
  .iconify {
    margin-right: 5px;
  }
  &:hover {
    box-shadow: var(--vp-shadow-brand);
    border-color: var(--vp-c-brand-1);
    span,
    .iconify {
      color: var(--vp-c-brand-1) !important;
    }
  }
}
</style>
