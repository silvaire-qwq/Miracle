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
        rss: data.rss || undefined
    };
});

const friendsTsContent = `export const friendList = [
${friendList
        .map(f => `  {
    fileName: "${f.fileName}",
    title: \`${escapeTemplateString(f.title)}\`,
    link: "${f.link}",
    desc: \`${escapeTemplateString(f.desc)}\`,
    img: "${f.img}"${f.rss ? `,\n    rss: "${f.rss}"` : ""}
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