import { defineConfig } from "vitepress";
import { globalConfig } from "../config";
import { getRunningTime } from "../src/utils/getRunningTime";
import { RssPlugin } from "vitepress-plugin-rss";
import type { RSSOptions } from "vitepress-plugin-rss";

// RSS feed configuration
const RSS: RSSOptions = {
  title: globalConfig.title,
  baseUrl: globalConfig.url,
  copyright: "Released under the CC BY-SA 4.0 license.",
  description: globalConfig.description,
  filename: "feed.rss",
  log: true,
  ignoreHome: true,
  ignorePublish: false,
  renderExpect: (fileContent) => {
    const excerpt = fileContent;
    return excerpt;
  },
};

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: globalConfig.title,
  description: globalConfig.description,
  cleanUrls: true,
  vite: {
    plugins: [RssPlugin(RSS)],
  },
  markdown: {
    theme: {
      light: "catppuccin-latte",
      dark: "catppuccin-mocha",
    },
  },
  head: [["link", { rel: "icon", href: globalConfig.favicon }]],

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: globalConfig.nav,
    // it seems bad TwT
    logo: globalConfig.favicon,

    footer: {
      message: `© ${new Date().getFullYear()} ${
        globalConfig.author
      }. All Rights Reserved.<br>
        Powered by <a href="https://vitepress.dev/">VitePress</a> & <a href="https://github.com/silvaire-qwq/Miracle">Miracle</a><br>
        "${globalConfig.title}" has existed for ${getRunningTime(
        globalConfig.dateCreated
      )} days

        `,
    },

    socialLinks: [
      { icon: "github", link: `https://github.com/${globalConfig.github}` },
    ],

    search: {
      provider: "local",
    },
  },
});
