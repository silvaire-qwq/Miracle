---
# https://vitepress.dev/reference/default-theme-home-page
layout: home
pageClass: indexPage
---

<FirstPage />

<div v-if="globalConfig.homePage.modules.about">
    <h2><Icon icon="fluent:info-16-regular" /> About</h2>
    {{ globalConfig.homePage.introduce }}
</div>

<div v-if="globalConfig.homePage.modules.recentPosts">
    <h2><Icon icon="fluent:document-16-regular" /> Recent Posts</h2>
    <div v-if="globalConfig.homePage.modules.lastMoment">
        <LastMoment />
    </div>
    <RecentPosts />
</div>

<div v-if="globalConfig.homePage.modules.projects">
    <h2><Icon icon="fluent:shopping-bag-16-regular" /> Projects</h2>
    <Projects />
</div>

<div v-if="globalConfig.homePage.modules.techStack">
    <h2><Icon icon="fluent:network-adapter-16-regular" /> Tech Stack</h2>
    <TechStack />
</div>

<div v-if="globalConfig.homePage.modules.friends">
    <h2><Icon icon="fluent:person-16-regular" /> Friends</h2>
    <Friends />
</div>

<script setup lang="ts">
    import { globalConfig } from "./config";
</script>

<style>
    /* 同时显示两个头像看起来很乱所以隐藏掉一个小的 */
    .indexPage img.VPImage.logo {
        display: none
    }
</style>
