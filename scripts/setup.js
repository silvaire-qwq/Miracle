// setup.js
import fs from "fs";
import path from "path";

function ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

function emptyDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        return;
    }

    const items = fs.readdirSync(dirPath);
    for (const item of items) {
        const full = path.join(dirPath, item);
        fs.rmSync(full, { recursive: true, force: true });
    }
}

try {
    const friendsDir = path.resolve("./src/config/friends");
    const momentsDir = path.resolve("./src/config/moments");
    const generatedDir = path.resolve("./src/generated");
    const markdownDir = path.resolve("./src/markdown");

    // === 清空目录 ===
    emptyDir(friendsDir);
    emptyDir(momentsDir);
    emptyDir(markdownDir);

    if (fs.existsSync(generatedDir)) {
        fs.rmSync(generatedDir, { recursive: true, force: true });
    }

    // === 确保目录存在 ===
    ensureDir(friendsDir);
    ensureDir(momentsDir);
    ensureDir(markdownDir);

    // === 写入模板 ===
    const friendTemplate = {
        title: "It's Miracle!!!!!",
        link: "https://github.com/silvaire-qwq/miracle",
        desc: "A lovely VitePress theme QwQ",
        img: "https://pic2.zhimg.com/50/v2-cc1a32fcb444fc9d5e23f2ee078dc6e1_720w.jpg?source=1940ef5c"
    };
    fs.writeFileSync(
        path.join(friendsDir, "friend-template.json"),
        JSON.stringify(friendTemplate, null, 2),
        "utf-8"
    );

    const momentTemplate = {
        date: "2025-09-21",
        time: "18:25",
        content: "QwQ"
    };
    fs.writeFileSync(
        path.join(momentsDir, "moment-template.json"),
        JSON.stringify(momentTemplate, null, 2),
        "utf-8"
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
    fs.writeFileSync(path.join(markdownDir, "post-template.md"), postTemplate, "utf-8");
} catch (err) {
    process.exit(1);
}