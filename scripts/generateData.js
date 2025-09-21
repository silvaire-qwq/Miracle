import fs from "fs";
import path from "path";

/* ---------------------- OUTPUT DIR ---------------------- */

const outputDir = path.resolve("./src/generated");
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

/* ---------------------- FRIENDS GENERATION ---------------------- */

const friendsDir = path.resolve("./src/config/friends");
const friendsOutputFile = path.join(outputDir, "friend.ts");

const friendFiles = fs.existsSync(friendsDir)
    ? fs.readdirSync(friendsDir).filter(f => f.endsWith(".json"))
    : [];

const friendList = friendFiles.map(file => {
    const data = JSON.parse(fs.readFileSync(path.join(friendsDir, file), "utf-8"));
    return {
        fileName: file,
        title: data.title,
        link: data.link,
        desc: data.desc,
        img: data.img,
    };
});

const friendsTsContent = `export const friendList: { fileName: string; title: string; link: string; desc: string; img: string; blog: string }[] = [
${friendList
        .map(
            l => `  {
    fileName: "${l.fileName}",
    title: "${l.title}",
    link: "${l.link}",
    desc: "${l.desc}",
    img: "${l.img}",
  }`
        )
        .join(",\n")}
];\n`;

fs.writeFileSync(friendsOutputFile, friendsTsContent, "utf-8");

/* ---------------------- MOMENTS GENERATION ---------------------- */

const momentsDir = path.resolve("./src/config/moments");
const momentsOutputFile = path.join(outputDir, "moment.ts");

const momentFiles = fs.existsSync(momentsDir)
    ? fs.readdirSync(momentsDir).filter(f => f.endsWith(".json"))
    : [];

// Sort by filename for chronological order
momentFiles.sort();

const momentList = momentFiles.map(file => {
    const data = JSON.parse(fs.readFileSync(path.join(momentsDir, file), "utf-8"));
    return {
        fileName: file,
        date: data.date,
        time: data.time,
        content: data.content,
        image: data.image
    };
});

const momentsTsContent = `export const momentList: { fileName: string; date: string; time: string; content: string; image?: string }[] = [
${momentList
        .map(m => {
            const imageLine = m.image ? `    image: "${m.image}",\n` : "";
            return `  {
    fileName: "${m.fileName}",
    date: "${m.date}",
    time: "${m.time}",
${imageLine}    content: "${m.content.replace(/"/g, '\\"')}",
  }`;
        })
        .join(",\n")}
];\n`;


fs.writeFileSync(momentsOutputFile, momentsTsContent, "utf-8");
