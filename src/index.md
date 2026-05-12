---
# https://vitepress.dev/reference/default-theme-home-page
layout: home
pageClass: indexPage
footer: false
---

<ClientOnly>
  <FirstPage />
</ClientOnly>

<div v-if="globalConfig.homePage.modules.pictures">
    <h2><Icon :icon="globalConfig.icon.photos" /> {{ globalConfig.lang.photos }}</h2>
    <ClientOnly>
        <Pictures />
    </ClientOnly>
</div>

<div v-if="globalConfig.homePage.modules.recentPosts">
    <h2><Icon :icon="globalConfig.icon.recentPosts" /> {{ globalConfig.lang.recentPosts }}</h2>
    <div v-if="globalConfig.homePage.modules.lastMoment">
        <ClientOnly>
            <LastMoment />
        </ClientOnly>
    </div>
    <ClientOnly>
        <RecentPosts />
    </ClientOnly>
</div>

<div v-if="globalConfig.homePage.modules.musics">
    <h2><Icon :icon="globalConfig.icon.musics" /> {{ globalConfig.lang.musics }}</h2>
    <ClientOnly>
        <Musics />
    </ClientOnly>
</div>

<div v-if="globalConfig.homePage.modules.projects">
    <h2><Icon :icon="globalConfig.icon.projects" /> {{ globalConfig.lang.projects }}</h2>
    <ClientOnly>
        <Projects />
    </ClientOnly>
</div>

<div v-if="globalConfig.homePage.modules.techStack">
    <h2><Icon :icon="globalConfig.icon.techStack" /> {{ globalConfig.lang.techStack }}</h2>
    <ClientOnly>
        <TechStack />
    </ClientOnly>
</div>

<div v-if="globalConfig.homePage.modules.friends">
    <h2><Icon :icon="globalConfig.icon.friends" /> {{ globalConfig.lang.friends }}</h2>
    <ClientOnly>
        <Friends />
    </ClientOnly>
</div>

<script setup lang="ts">
    import { globalConfig } from "#config";
    console.log(globalConfig.photos)
</script>

<style>
    .indexPage img.VPImage.logo {
        display: none
    }
    .indexPage h2 {
        text-transform: var(--vp-title-uppercase);
    }
</style>