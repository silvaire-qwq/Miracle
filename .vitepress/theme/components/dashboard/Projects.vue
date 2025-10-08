<script setup lang="ts">
import { ref, onMounted } from "vue";
import { globalConfig } from "#config";
const username = globalConfig.github
const posts = ref<any[]>([]);
const loading = ref(true);
const error = ref("");
const CACHE_KEY = "github_projects_cache";
const CACHE_TTL = 60 * 60 * 1000; // 1小时缓存

// 获取 GitHub 项目数据
async function fetchGithubData() {
  const res = await fetch(`https://api.github.com/users/${username}/repos`);
  if (!res.ok) throw new Error("GitHub API rate limited.");
  const data = await res.json();

  // 过滤掉 Public Archive
  const filteredRepos = data.filter((repo: any) => !repo.archived);

  const projects = await Promise.all(
    filteredRepos.map(async (repo: any) => {
      let lastCommit = "";
      let committer = "";
      try {
        const commitsRes = await fetch(
          `https://api.github.com/repos/${username}/${repo.name}/commits?per_page=1`
        );
        const commits = await commitsRes.json();
        lastCommit = commits[0]?.commit?.message || "";
        committer = commits[0]?.commit?.author?.name || "";
      } catch {}

      return {
        link: repo.html_url,
        title: repo.name.replace(/-/g, " "),
        description: repo.description,
        lastCommit,
        committer,
        avatarUrl: repo.owner.avatar_url,
      };
    })
  );

  return projects;
}

// 渲染缓存逻辑
async function loadProjects() {
  loading.value = true;
  let cache = localStorage.getItem(CACHE_KEY);
  let cacheTime = localStorage.getItem(CACHE_KEY + "_time");
  let projects: any[] = [];

  if (cache && cacheTime && Date.now() - Number(cacheTime) < CACHE_TTL) {
    try {
      projects = JSON.parse(cache);
      posts.value = projects;
      loading.value = false;
      return;
    } catch {}
  }

  try {
    projects = await fetchGithubData();
    localStorage.setItem(CACHE_KEY, JSON.stringify(projects));
    localStorage.setItem(CACHE_KEY + "_time", Date.now().toString());
    posts.value = projects;
  } catch (e: any) {
    if (cache) {
      try {
        posts.value = JSON.parse(cache);
      } catch {}
    } else {
      error.value = e.message;
    }
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadProjects();
});

import { useCardHover } from "../../utils/useCardHover";
const { handleMouseMove, handleMouseEnter, handleMouseLeave } = useCardHover();
</script>

<template>
  <div v-if="loading"></div>
  <div v-else-if="error">{{ error }}</div>
  <div v-else class="posts-grid">
    <div v-for="post in posts" :key="post.link" class="post-card">
      <a
        :href="post.link"
        target="_blank"
        class="diary"
        @mouseenter="handleMouseEnter"
        @mousemove="handleMouseMove"
        @mouseleave="handleMouseLeave"
      >
        <div class="textPlace">
          <h1 class="title">{{ post.title }}</h1>
          <p class="details">{{ post.description ?? "No description" }}</p>
          <div class="meta">
            {{ post.lastCommit || "No commits yet" }}
            <span v-if="post.committer" style="color: var(--vp-c-text-3); opacity: 0.4;"> by {{ post.committer }}</span>
          </div>
        </div>
      </a>
    </div>
  </div>
</template>

<style scoped>
.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--vp-gap);
}

.post-card {
  display: flex;
  perspective: 1000px;
}

.diary {
  flex: 1;
  display: flex;
  gap: var(--vp-gap);
  border-radius: var(--vp-border-radius-1);
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg);
  transition: all var(--vp-transition-time);
  will-change: transform;
  box-shadow: var(--vp-shadow);
  text-decoration: none;
  overflow: hidden;
}

.diary:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: var(--vp-shadow-brand);
}

.textPlace {
  padding: 25px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.title {
  font-weight: 600;
  font-size: 20px;
  line-height: 1.3;
  text-transform: capitalize;
  color: var(--vp-c-text-1);
  margin: 0;
  transition: all var(--vp-transition-time);
}

.diary:hover .title {
  color: var(--vp-c-brand-2);
}

.details {
  font-size: 14px;
  line-height: 20px;
  color: var(--vp-c-text-2);
  margin: 8px 0px 10px 0px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.meta {
  margin-top: auto;
  font-size: 13px;
  color: var(--vp-c-text-3);
  opacity: 0.8;
}
</style>
