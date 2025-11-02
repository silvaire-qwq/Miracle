<script setup lang="ts">
import { ref, onMounted } from "vue";
import { globalConfig } from "#config";
const username = globalConfig.github;
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
          `https://api.github.com/repos/${username}/${repo.name}/commits?per_page=1`,
        );
        const commits = await commitsRes.json();
        lastCommit = commits[0]?.commit?.message || "";
        // ✅ 使用 GitHub 登录名而非 commit 作者名字
        committer = commits[0]?.author?.login || username;
      } catch {}

      return {
        link: repo.html_url,
        title: repo.name.replace(/-/g, " "),
        description: repo.description,
        lastCommit,
        committer,
        avatarUrl: repo.owner.avatar_url,
      };
    }),
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
</script>

<template>
  <div v-if="loading"></div>
  <div v-else-if="error">{{ error }}</div>
  <div v-else class="posts-grid">
    <div v-for="post in posts" :key="post.link" class="post-card">
      <PostCard
        :url="post.link"
        :title="post.title"
        :description="post.description"
        :category="post.committer || 'Unknown'"
        :date="post.lastCommit || 'No commits yet'"
        :type="'project'"
      />
    </div>
  </div>
</template>

<style scoped>
.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--vp-gap);
}

.diary {
  height: 100% !important;
}
</style>
