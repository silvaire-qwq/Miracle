// DO NOT EDIT THESE LINES!!!!! ---------------------------------------------------
import { data as momentList } from "#theme/data/moments.data";
import { data as friendList } from "#theme/data/friends.data";
import { data as iconList } from "#theme/configs/iconList";

// experimental: i18n
import { languageFile as zh } from "#theme/lang/zh_CN";
import { languageFile as en } from "#theme/lang/en_US";

const languageMap: Record<string, any> = { zh, en };

// LANGUAGES ----------------------------------------------------------------------
// hey !!! you !!!
// change it to "zh" if you want to use Chinese
// website language (zh / en)
const defaultLanguage = "en";
const languageFile = languageMap[defaultLanguage] || en; // do not edit it

// CONFIGS ----------------------------------------------------------------------
export const globalConfig = {
  title: "Silvaire's Blog", // title
  description: "Per Aspera Ad Astra", // description
  author: "Silvaire", // your name
  favicon:
    "https://wsrv.nl/?url=avatars.githubusercontent.com/u/184231508?s=256&u=0a370792ba6bbb95a04d309171b562bcd7283a0f&v=4&mask=circle", // favicon (suggest: circle mask)
  url: "https://qwq.blue", // main url (https://xxxx.xxx)
  blogBase: {
    type: "github", // github / gitea
    giteaUrl: "https://gitea.com", // if the type is gitea, fill in the gitea url like: https://gitea.com
    repo: "silvaire-qwq/Miracle", // the repo of ur blog
  },
  dateCreated: "2024-08-23", // date created (YYYY-MM-DD)

  // theme setting
  styles: {
    color: {
      hue: 275,
      intensity: {
        light: 20, // suggestion: 20
        dark: 15, // suggestion: 15 ~ 20
      },
      lightness: {
        light: 50, // suggestion: 50
        dark: 55, // suggestion: 55 (it looks like catppuccin + mauve when hue is 300)
      },
    },
    visual: {
      transition: 10, // x[s(second(s))] / 100 | e.g. 10 -> 0.1s (default)
      gap: 12, // x[px]
      radius: 26, // x[px]
      transparent: false, // transparent? (for year & artist)
      uppercase: false, // CATEGORIES / Categories
      mono: true, // use monospace font for title
      cardHover: {
        scale: 1.03,
        maxMove: 8,
        easing: 0.3,
      }
    },
  },

  // homepage setting (when globalConfig.modules.banner is a url)
  homePage: {
    avatar:
      "https://wsrv.nl/?url=avatars.githubusercontent.com/u/184231508?s=256&u=0a370792ba6bbb95a04d309171b562bcd7283a0f&v=4", // your avatar
    city: "Hedong, Tianjin", // your location
    introduce:
      "Awa middle schowol stuwudent whowo is leawarning frowont-end develowopment~!", // introduce your self

    // modules
    modules: {
      banner: "avatar", // img url or "avatar"
      about: true, // about
      lastMoment: true, // last moment
      recentPosts: true, // recent posts
      projects: true, // projects (very sloooooow)
      musics: true, // music list
      techStack: true, // tech stack
      friends: true, // friends
    },

    // stacks (https://cdn.jsdelivr.us/gh/devicons/devicon/icons/${stack.icon}/${stack.icon}-original.svg)
    stacks: [
      { name: "Arch Linux", icon: "archlinux" },
      { name: "CSS", icon: "css3" },
      { name: "HTML", icon: "html5" },
      { name: "Linux", icon: "linux" },
      { name: "Vue", icon: "vuejs" },
      { name: "JSON", icon: "json" },
      { name: "JavaScript", icon: "javascript" },
      { name: "PNPM", icon: "pnpm" },
      { name: "Visual Studio Code", icon: "vscode" },
      { name: "VSCodium", icon: "vscodium" },
      { name: "TypeScript", icon: "typescript" },
      { name: "Node.js", icon: "nodejs" },
      { name: "Vite", icon: "vitejs" },
      { name: "Vim", icon: "vim" },
      { name: "Neovim", icon: "neovim" },
      { name: "Windows", icon: "windows11" },
      { name: "Git", icon: "git" },
      { name: "NPM", icon: "npm" },
      { name: "Yarn", icon: "yarn" },
      { name: "Tailwind CSS", icon: "tailwindcss" },
      { name: "Docker", icon: "docker" },
    ],
  },

  github: "silvaire-qwq", // your github username

  // navigation items
  nav: [
    { text: languageFile.dashboard, link: "/" },
    {
      text: languageFile.articles,
      items: [
        { text: languageFile.archives, link: "/archives" },
        { text: languageFile.moments, link: "/moments" },
      ],
    },
    {
      text: languageFile.others,
      items: [
        { text: languageFile.friends, link: "/friends" },
        // enable / disable music list
        { text: languageFile.musics, link: "/musics" },
        { text: languageFile.manager, link: "/manager" },
        // enable / disable comments
        { text: languageFile.whiteboard, link: "/whiteboard" },
      ],
    },
  ],

  // comments
  comments: {
    enable: true,
    type: "twikoo",
    giscus: {
      repo: "silvaire-qwq/Miracle",
      repoId: "R_kgDOPz1WLw",
      categoryId: "DIC_kwDOPz1WL84Cvsrq",
      themes: {
        light: "https://giscus.catppuccin.com/themes/latte.css",
        dark: "https://giscus.catppuccin.com/themes/mocha.css",
      },
    },
    twikoo: {
      env: "https://twikoo.qwq.blue",
    },
  },

  // waterfall
  waterfall: {
    oneColumnMax: 700,
    twoColumnMax: 1050,
  },

  // friend weight (default: 0)
  // the higher the weight, the lower the friend will be displayed
  friendWeights: {
    // example: -99, // "example" will be displayed at the top
    qwq: -99,
    friends: -1,
    unable: 0, // "unable" will be displayed at the bottom
  },

  // netease music list
  musicList: "7761179667",

  // DO NOT EDIT THESE VALUES!!!!!
  friends: friendList,
  moments: momentList,
  lang: languageFile,
  icon: iconList,
};
