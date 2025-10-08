---
# https://vitepress.dev/reference/default-theme-home-page
layout: home
pageClass: indexPage
footer: false
---

<FirstPage />

<div v-if="globalConfig.homePage.modules.about">
    <h2><Icon icon="ph:info-duotone" /> {{ globalConfig.lang.about }}</h2>
    {{ globalConfig.homePage.introduce }}
</div>

<div v-if="globalConfig.homePage.modules.recentPosts">
    <h2><Icon icon="ph:newspaper-duotone" /> {{ globalConfig.lang.recentPosts }}</h2>
    <div v-if="globalConfig.homePage.modules.lastMoment">
        <LastMoment />
    </div>
    <RecentPosts />
</div>

<div v-if="globalConfig.homePage.modules.projects">
    <h2><Icon icon="ph:projector-screen-chart-duotone" /> {{ globalConfig.lang.projects }}</h2>
    <Projects />
</div>

<div v-if="globalConfig.homePage.modules.techStack">
    <h2><Icon icon="ph:anchor-duotone" /> {{ globalConfig.lang.techStack }}</h2>
    <TechStack />
</div>

<div v-if="globalConfig.homePage.modules.friends">
    <h2><Icon icon="ph:person-arms-spread-duotone" /> {{ globalConfig.lang.friends }}</h2>
    <Friends />
</div>

<script setup lang="ts">
    import { globalConfig } from "#config";
</script>

<style>
    /* 同时显示两个头像看起来很乱所以隐藏掉一个小的 */
    .indexPage img.VPImage.logo {
        display: none
    }
</style>
