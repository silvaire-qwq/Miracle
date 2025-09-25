import { momentList } from "./src/generated/moment";
import { friendList } from "./src/generated/friend";
import { postList } from "./src/generated/post";

export const globalConfig = {
  title: "Silvaire's Blog", // title
  description: "Per Aspera Ad Astra", // description
  author: "Silvaire",
  favicon:
    "https://wsrv.nl/?url=avatars.githubusercontent.com/u/184231508&mask=circle", // favicon
  url: "https://qwq.blue", // main url
  githubRepo: "silvaire-qwq/Miracle",
  dateCreated: "2024-08-23",

  // homepage setting
  homePage: {
    avatar: "https://wsrv.nl/?url=avatars.githubusercontent.com/u/184231508", // your avatar
    author: "Silvaire", // your name
    city: "Tianjin", // your location
    introduce:
      "Awa middle schowol stuwudent whowo is leawarning frowont-end develowopment~!", // introduce your self

    // modules
    modules: {
      banner: "https://youke1.picui.cn/s1/2025/09/24/68d3e9867b869.png", // img url or "avatar"
      about: true, // about
      lastMoment: true, // last moment
      recentPosts: true, // recent posts
      projects: true, // projects (very sloooooow)
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

  // image bed url
  // frontmatter: test.png = [https://your.site/path/to/]test.png
  // frontmatter: https://example.com/test.png => https://example.com/test.png
  // do not use https://xxxx !!!
  // plz use https://xxxx/ !!!!!
  imgBed: false,
  github: "silvaire-qwq", // your github username

  // navigation items
  nav: [
    { text: "Dashboard", link: "/" },
    {
      text: "Articles",
      items: [
        { text: "Archive", link: "/src/pages/archive" },
        { text: "Moments", link: "/src/pages/moments" },
      ],
    },
    {
      text: "Others",
      items: [
        { text: "Friends", link: "/src/pages/friends" },
        { text: "Manager", link: "/src/pages/manager" },
        { text: "Whiteboard", link: "/src/pages/whiteboard" },
      ],
    },
  ],

  // comments
  comments: {
    enable: true,
    lang: "en",
    repo: "silvaire-qwq/Miracle",
    repoId: "R_kgDOPz1WLw",
    categoryId: "DIC_kwDOPz1WL84Cvsrq",
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
    qwq: -50,
    friends: 0, // "friends" will be displayed at the bottom
  },

  friends: friendList, // friends (edit it in config/friends)
  moments: momentList, // moments (edit it in config/moments)
  posts: postList, // post data (do not edit it!)
};
