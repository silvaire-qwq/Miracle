import fs from "fs";
import path from "path";
import chalk from "chalk";
import dayjs from "dayjs";

/* ---------------------- LOG ---------------------- */
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

/* ---------------------- UTILS ---------------------- */
function ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        log("miracle", "Directory created", dirPath, "success");
    }
}

function writeTsFile(filePath, content) {
    fs.writeFileSync(filePath, content, "utf-8");
    log("miracle", "File written", filePath, "success");
}

function escapeTemplateString(str) {
    return str.replace(/`/g, "\\`");
}

/* ---------------------- OUTPUT DIR ---------------------- */
const OUTPUT_DIR = path.resolve("./src/generated");
ensureDir(OUTPUT_DIR);

/* ---------------------- FRIENDS ---------------------- */
const FRIENDS_DIR = path.resolve("./src/config/friends");
ensureDir(FRIENDS_DIR);

const FRIENDS_OUTPUT = path.join(OUTPUT_DIR, "friend.ts");

const friendFiles = fs.existsSync(FRIENDS_DIR)
    ? fs.readdirSync(FRIENDS_DIR).filter(f => f.endsWith(".json"))
    : [];

const friendList = friendFiles.map(file => {
    const data = JSON.parse(fs.readFileSync(path.join(FRIENDS_DIR, file), "utf-8"));
    return {
        fileName: file,
        title: data.title,
        link: data.link,
        desc: data.desc,
        img: data.img,
        folder: data.folder || "friends"
    };
});

const friendsTsContent = `export const friendList = [
${friendList
        .map(f => `  {
    fileName: "${f.fileName}",
    title: \`${escapeTemplateString(f.title)}\`,
    link: "${f.link}",
    desc: \`${escapeTemplateString(f.desc)}\`,
    img: "${f.img}",
    folder: "${f.folder}"
  }`)
        .join(",\n")}
];\n`;

writeTsFile(FRIENDS_OUTPUT, friendsTsContent);

/* ---------------------- MOMENTS ---------------------- */
const MOMENTS_DIR = path.resolve("./src/config/moments");
ensureDir(MOMENTS_DIR);

const MOMENTS_OUTPUT = path.join(OUTPUT_DIR, "moment.ts");

const momentFiles = fs.existsSync(MOMENTS_DIR)
    ? fs.readdirSync(MOMENTS_DIR).filter(f => f.endsWith(".json"))
    : [];
momentFiles.sort();

const momentList = momentFiles.map(file => {
    const data = JSON.parse(fs.readFileSync(path.join(MOMENTS_DIR, file), "utf-8"));
    return {
        fileName: file,
        date: data.date,
        time: data.time,
        content: data.content,
        image: data.image
    };
});

const momentsTsContent = `export const momentList = [
${momentList
        .map(m => `  {
    fileName: "${m.fileName}",
    date: "${m.date}",
    time: "${m.time}",
    content: \`${escapeTemplateString(m.content)}\`${m.image ? `,\n    image: "${m.image}"` : ""}
  }`)
        .join(",\n")}
];\n`;

writeTsFile(MOMENTS_OUTPUT, momentsTsContent);


/* ---------------------- POSTS ---------------------- */
const MARKDOWN_DIR = path.resolve("./src/markdown");
const POSTS_OUTPUT = path.resolve("./src/generated/post.ts");

const mdFiles = fs.existsSync(MARKDOWN_DIR)
    ? fs.readdirSync(MARKDOWN_DIR).filter(f => f.endsWith(".md"))
    : [];

/* 提取 frontmatter */
function extractFrontmatter(mdContent) {
    const fmMatch = mdContent.match(/^---\n([\s\S]*?)\n---/);
    if (!fmMatch) return {};
    const fmLines = fmMatch[1].split("\n");
    const fm = {};
    for (const line of fmLines) {
        const [key, ...rest] = line.split(":");
        if (key && rest.length) {
            fm[key.trim()] = rest.join(":").trim().replace(/^"|"$/g, "");
        }
    }
    return fm;
}

/* 提取纯文本 */
function extractText(mdContent) {
    let text = mdContent
        .replace(/^---[\s\S]*?---/, "") // 去掉 frontmatter
        .replace(/```[\s\S]*?```/g, "") // 删除代码块
        .replace(/`[^`]*`/g, "") // 删除行内代码
        .replace(/!\[.*?\]\(.*?\)/g, "") // 删除图片
        .replace(/\[.*?\]\(.*?\)/g, "") // 删除链接
        .replace(/[#>*_\-\[\]\(\)`]/g, " ") // 删除 Markdown 符号
        .replace(/[0-9]/g, " ") // 删除数字
        .replace(/[^\u4e00-\u9fa5a-zA-Z\s]/g, " "); // 只保留中英文和空格

    return text.replace(/\s+/g, " ").trim();
}

/* 统计字数 */
function countWords(text) {
    const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
    const englishWords = (text.match(/[a-zA-Z]+/g) || []).length;
    return chineseChars + englishWords;
}

/* 阅读时长：200字 ≈ 1分钟 */
function calcReadingTime(text) {
    const words = countWords(text);
    return Math.max(1, Math.ceil(words / 200));
}

const postList = mdFiles.map(file => {
    const raw = fs.readFileSync(path.join(MARKDOWN_DIR, file), "utf-8");
    const frontmatter = extractFrontmatter(raw);
    const content = extractText(raw);
    const wordCount = countWords(content);
    return {
        title: frontmatter.title || path.basename(file, ".md"),
        wordCount,
        readingTime: calcReadingTime(content)
    };
});

const postsTsContent = `export const postList = [
${postList
        .map(p => `  {
    title: \`${escapeTemplateString(p.title)}\`,
    wordCount: ${p.wordCount},
    readingTime: ${p.readingTime}
  }`)
        .join(",\n")}
];\n`;

writeTsFile(POSTS_OUTPUT, postsTsContent);
