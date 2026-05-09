import path from "path";
import { withMermaid } from "vitepress-plugin-mermaid";
import { tabsMarkdownPlugin } from "vitepress-plugin-tabs";
import { RssPlugin } from "vitepress-plugin-rss";
import { globalConfig } from "#config";
import { getRunningTime } from "#theme/utils/getRunningTime";
import { sub } from "@mdit/plugin-sub";
import markdownItKatex from "markdown-it-katex";
import { footnote } from "@mdit/plugin-footnote";
import { mark } from "@mdit/plugin-mark";
import { sup } from "@mdit/plugin-sup";
import { container } from "@mdit/plugin-container";
import { align } from "@mdit/plugin-align";
import { tasklist } from "@mdit/plugin-tasklist";

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
export default withMermaid({
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
    image: {
      lazyLoading: true,
    },
    config(md) {
      md.use(tabsMarkdownPlugin);
      md.use(markdownItKatex);
      md.use(sub);
      md.use(footnote);
      md.use(mark);
      md.use(sup);
      md.use(tasklist);
      md.use(align);
      md.use(container, {
        name: "Align",
      });
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
