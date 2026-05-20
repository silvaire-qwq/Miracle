// DO NOT EDIT THESE LINES!!!!! ---------------------------------------------------
import { data as momentList } from "#theme/data/moments.data";
import { data as friendList } from "#theme/data/friends.data";
import { data as iconList } from "#theme/configs/iconList";
import { data as photoList } from "#theme/data/photos.data";

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
  // Miracle ID Proj.
  miracle: {
    // up to 6 digits. use it before looking https://github.com/Miralous/uid-bucket
    id: "114514",
    // file source
    src: "https://gh.llkk.cc/https://raw.githubusercontent.com/Miralous/uid-bucket/refs/heads/main/data.json",
  },

  title: "Silvaire's Blog", // title
  description: "Per Aspera Ad Astra", // description
  author: "Silvaire", // your name
  favicon:
    "https://wsrv.nl/?url=avatars.githubusercontent.com/u/184231508?s=400&u=0a370792ba6bbb95a04d309171b562bcd7283a0f&v=4&mask=circle", // favicon (suggest: circle mask)
  url: "https://qwq.blue", // main url (https://xxxx.xxx)
  blogBase: {
    type: "github", // github / gitea
    giteaUrl: "https://gitea.com", // if the type is gitea, fill in the gitea url like: https://gitea.com
    repo: "Miralous/Miracle", // the repo of ur blog
  },
  dateCreated: "2024-08-23", // date created (YYYY-MM-DD)
  deepHideNegative: true, // enable press "s" 1s to show negative button

  // theme setting
  styles: {
    color: {
      // [1] Use your own color scheme by adjusting the hue, intensity, and lightness values.
      hue: 280,
      intensity: {
        light: 17, // suggestion: 20
        dark: 15, // suggestion: 15 ~ 20
      },
      lightness: {
        light: 54, // suggestion: 50
        dark: 47, // suggestion: 55 (it looks like catppuccin + mauve when hue is 300)
      },
      rainbow: {
        enabled: false, // hue will be cycled
        speed: 3, // hue is (getCurrentHue() + x) % 360......(updateHue, 100);
      }, // copied from 2nd easter egg updated in 2026. (just for fun).
      // [2] If you are a catppuccin lover, you can enable catppuccin color scheme (hue will be ignored when enabled).
      // [WARN] You cannot use it with hue settings.
      catppuccin: {
        enabled: true, // use catppuccin color scheme (hue will be ignored when enabled)
        flavor: "macchiato", // catppuccin flavor when using dark mode (frappe / macchiato / mocha)
        color: "lavender", // catppuccin color (rosewater / flamingo / pink / mauve / red / maroon / peach / yellow / green / teal / sapphire / blue / lavender)
      },
    },
    visual: {
      transition: 10, // x[s(second(s))] / 100 | e.g. 10 -> 0.1s (default)
      gap: 12, // x[px]
      radius: 26, // x[px]
      enableCardTitle: true, // show title in custom card (warning, danger...)
      transparent: false, // transparent? (for year & artist)
      uppercase: false, // CATEGORIES / Categories
      mono: false, // use monospace font for title
      cardHover: {
        scale: 1.03,
        maxMove: 8,
        maxRotate: 3, // 3d effect |  set 0 to disable 3D
        easing: 0.5,
        shadowStrength: 2, // shadow strength when hovered (default: 2)
      },
    },
  },

  // homepage setting (when globalConfig.modules.banner is a url)
  homePage: {
    avatar:
      "https://wsrv.nl/?url=avatars.githubusercontent.com/u/184231508?s=400&u=0a370792ba6bbb95a04d309171b562bcd7283a0f&v=3", // your avatar
    city: "Fangxing Avenue, Wuling", // your location
    // introduce: (you cannot use it now)
    // "Awa middle schowol stuwudent whowo is leawarning frowont-end develowopment~!", // introduce your self

    // modules
    modules: {
      banner: {
        type: "avatar", // "image" or "avatar"
        imgurl: "", // only work when type is image, e.g. "https://cdn.jsdelivr.net/gh/Miralous/Miracle@main/src/assets/banner.png"
        image: "65vh", // only work when type is "image", e.g. "65vh"
        avatar: "50vh", // only work when type is "avatar", e.g. "100vh"
      },
      pictures: true, // show pictures
      lastMoment: true, // last moment
      recentPosts: true, // recent posts
      projects: true, // projects (may be very sloooooow)
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

  github: "Miralous", // your github username

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
        { text: languageFile.photos, link: "/photos" },
        { text: languageFile.manager, link: "/manager" },
        // enable / disable comments
        { text: languageFile.whiteboard, link: "/whiteboard" },
        // enable / disable Miracle ID
        { text: languageFile.miracle, link: "/miracle" },
      ],
    },
  ],

  // comments
  comments: {
    enable: true,
    type: "giscus",
    giscus: {
      repo: "Miralous/Miracle",
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
    "=ᗜωᗜ=": -99,
    UwU: -98,
    friends: -1,
    unable: 0, // "unable" will be displayed at the bottom
  },

  // netease music list
  musicList: "17942010185",
  musicSlice: 20, // how many singer to display in music list (default: 20, set 0 to display all)

  // DO NOT EDIT THESE VALUES!!!!!
  friends: friendList,
  moments: momentList,
  photos: photoList,
  lang: languageFile,
  icon: iconList,
};
