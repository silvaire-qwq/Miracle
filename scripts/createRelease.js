import fs from "fs-extra";
import path from "path";
import { exec } from "child_process";
import archiver from "archiver";
import chalk from "chalk";
import dayjs from "dayjs";
import os from "os";
import { themeVersion } from "../src/theme.js";

const projectDir = process.cwd();
// 使用系统临时目录，避免复制到自身子目录
const tempDir = path.join(os.tmpdir(), `website_temp_${Date.now()}`);
const fileName = `${themeVersion.name}-${themeVersion.version}-${themeVersion.type}.zip`;

// 日志函数
function log(module, message, filePath = "", type = "info") {
    const time = chalk.gray(dayjs().format("HH:mm:ss"));
    const moduleLabel = chalk.magenta.bold(`[${module}]`);
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

// 1️⃣ 复制项目到临时目录
async function copyToTemp() {
    log("miracle", "Copying project directory to temporary directory");
    await fs.remove(tempDir);
    await fs.mkdir(tempDir);

    await fs.copy(projectDir, tempDir, {
        filter: (src) => {
            const relative = path.relative(projectDir, src);
            if (relative.startsWith("node_modules")) return false;
            if (relative.startsWith("src/generated")) return false;
            if (relative === fileName) return false;
            return true;
        },
    });

    log("miracle", "Temporary directory is ready", tempDir, "success");
}

// 2️⃣ 在临时目录运行 setup.js
function runSetupInTemp() {
    return new Promise((resolve, reject) => {
        log("miracle", "Running setup.js");
        exec("node ./scripts/setup.js", { cwd: tempDir }, (err, stdout, stderr) => {
            if (err) {
                log("miracle", "setup.js failed", "", "error");
                return reject(err);
            }
            if (stdout) console.log(stdout);
            if (stderr) console.error(stderr);
            log("miracle", "setup.js completed", "", "success");
            resolve();
        });
    });
}

// 3️⃣ 打包临时目录
function zipTemp() {
    return new Promise((resolve, reject) => {
        log("miracle", "Zipping temporary directory");
        const output = fs.createWriteStream(path.resolve(projectDir, fileName));
        const archive = archiver("zip", { zlib: { level: 9 } });

        output.on("close", () => {
            const sizeInMB = (archive.pointer() / 1024 / 1024).toFixed(2);
            log("miracle", `Zipping completed: ${fileName}`, `${sizeInMB} MB`, "success");
            resolve();
        });

        archive.on("error", (err) => {
            log("miracle", "Zipping failed", "", "error");
            reject(err);
        });

        archive.pipe(output);
        archive.glob("**/*", { cwd: tempDir, dot: true });
        archive.finalize();
    });
}

// 4️⃣ 清理临时目录
async function cleanupTemp() {
    try {
        await fs.remove(tempDir);
        log("miracle", "Temporary directory removed", tempDir, "success");
    } catch (err) {
        log("miracle", "Failed to remove temporary directory", "", "error");
    }
}

// 主流程
async function main() {
    try {
        await copyToTemp();
        await runSetupInTemp();
        await zipTemp();
    } catch (err) {
        log("miracle", "Error occurred", err.message, "error");
    } finally {
        await cleanupTemp();
    }
}

main();
