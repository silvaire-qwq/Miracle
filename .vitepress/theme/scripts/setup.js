// setup.js
import fs from "fs";
import path from "path";
import chalk from "chalk";
import dayjs from "dayjs";

function log(module, message, filePath = "", type = "info") {
  const time = chalk.gray(dayjs().format("HH:mm:ss"));
  const moduleLabel = chalk.cyan.bold(`[${module}]`);
  let msgColored;

  switch (type) {
    case "success":
      msgColored = chalk.green(message);
      break;
    case "warn":
      msgColored = chalk.yellow(message);
      break;
    case "error":
      msgColored = chalk.red(message);
      break;
    default:
      msgColored = chalk.white(message);
  }

  const pathColored = chalk.gray(filePath);
  console.log(`${time} ${moduleLabel} ${msgColored} ${pathColored}`);
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    log("miracle", "Directory created", dirPath, "success");
  }
}

function emptyDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    log("miracle", "Directory created (empty)", dirPath, "success");
    return;
  }

  const items = fs.readdirSync(dirPath);
  for (const item of items) {
    const full = path.join(dirPath, item);
    fs.rmSync(full, { recursive: true, force: true });
    log("miracle", "Removed", full, "warn");
  }
}

try {
  const friendsDir = path.resolve("./data/friends");
  const momentsDir = path.resolve("./data/moments");
  const markdownDir = path.resolve("./src/posts");

  log("miracle", "Clearing directories");
  emptyDir(friendsDir);
  emptyDir(momentsDir);
  emptyDir(markdownDir);

  log("miracle", "Ensuring directories exist");
  ensureDir(friendsDir);
  ensureDir(momentsDir);
  ensureDir(markdownDir);

  log("miracle", "Writing templates");
  const friendTemplate = {
    title: "It's Miracle!!!!!",
    link: "https://github.com/silvaire-qwq/miracle",
    desc: "A lovely VitePress theme QwQ",
    img: "https://pic2.zhimg.com/50/v2-cc1a32fcb444fc9d5e23f2ee078dc6e1_720w.jpg?source=1940ef5c",
    folder: "miracle",
  };
  fs.writeFileSync(
    path.join(friendsDir, "friend-template.json"),
    JSON.stringify(friendTemplate, null, 2),
    "utf-8",
  );
  log(
    "miracle",
    "Friend template written",
    path.join(friendsDir, "friend-template.json"),
    "success",
  );

  const momentTemplate = {
    date: "2025-09-21",
    time: "18:25",
    content: "QwQ",
  };
  fs.writeFileSync(
    path.join(momentsDir, "moment-template.json"),
    JSON.stringify(momentTemplate, null, 2),
    "utf-8",
  );
  log(
    "miracle",
    "Moment template written",
    path.join(momentsDir, "moment-template.json"),
    "success",
  );

  const postTemplate = `---
title: It's Miracle!!!!!
published: 2025-09-21
description: A lovely VitePress theme QwQ
tags: [Miracle]
category: Miracle
origin: https://github.com/silvaire-qwq/miracle
---
`;
  fs.writeFileSync(
    path.join(markdownDir, "post-template.md"),
    postTemplate,
    "utf-8",
  );
  log(
    "miracle",
    "Post template written",
    path.join(markdownDir, "post-template.md"),
    "success",
  );

  log("miracle", "Setup completed", "", "success");
} catch (err) {
  log("miracle", "Error occurred", err.message, "error");
  process.exit(1);
}
