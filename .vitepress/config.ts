import path from "path";
import { defineConfig } from "vitepress";
import { tabsMarkdownPlugin } from "vitepress-plugin-tabs";
import { RssPlugin } from "vitepress-plugin-rss";
import { globalConfig } from "#config";
import { getRunningTime } from "#theme/utils/getRunningTime";
import type { RSSOptions } from "vitepress-plugin-rss";

// RSS feed configuration
const RSS: RSSOptions = {
  title: globalConfig.title,
  baseUrl: globalConfig.url,
  copyright: "Released under the CC BY-SA 4.0 license.",
  description: globalConfig.description,
  filename: "feed.xml",
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
  // plz use vercel!!!!!!!
  cleanUrls: true,
  srcDir: "./src",
  vite: {
    resolve: {
      alias: {
        "#": path.resolve(import.meta.dirname, ".."),
        "#theme": path.resolve(import.meta.dirname, "theme"),
      },
    },
    publicDir: "../public",
    plugins: [RssPlugin(RSS)],
  },
  sitemap: {
    hostname: globalConfig.url,
  },
  markdown: {
    theme: {
      light: "catppuccin-latte",
      dark: "catppuccin-mocha",
    },
    config(md) {
      md.use(tabsMarkdownPlugin);
    },
  },
  head: [["link", { rel: "icon", href: globalConfig.favicon }]],

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: globalConfig.nav,

    // it seems bad TwT
    logo: globalConfig.favicon,

    langMenuLabel: globalConfig.lang.langMenuLabel,
    darkModeSwitchLabel: globalConfig.lang.darkModeSwitchLabel,
    lightModeSwitchTitle: globalConfig.lang.lightModeSwitchTitle,
    darkModeSwitchTitle: globalConfig.lang.darkModeSwitchTitle,
    sidebarMenuLabel: globalConfig.lang.sidebarMenuLabel,
    outline: { level: [2, 3], label: globalConfig.lang.outline },
    returnToTopLabel: globalConfig.lang.returnToTopLabel,
    lastUpdated: { text: globalConfig.lang.lastUpdated },

    footer: {
      message: `© ${new Date().getFullYear()} ${globalConfig.author}${
        globalConfig.lang.allRightsReserved
      }<br>
        ${
          globalConfig.lang.poweredBy
        } <a href="https://vitepress.dev/">VitePress</a> & <a href="https://github.com/silvaire-qwq/Miracle">Miracle</a><br>
        ${globalConfig.title} ${
          globalConfig.lang.hasExistedFor
        } ${getRunningTime(globalConfig.dateCreated)} ${globalConfig.lang.days}

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
