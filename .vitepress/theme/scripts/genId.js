// .vitepress/theme/scripts/generate-data.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";
import dayjs from "dayjs";
import { loadConfigFromFile } from "vite";

// 1. 获取当前脚本的绝对路径，并安全地计算出项目根目录 (Root)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// 当前在 .vitepress/theme/scripts，往上跳 3 层到达项目根目录
const projectRoot = path.resolve(__dirname, "../../../");

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

async function run() {
  try {
    log("vitepress-data", "Loading VitePress configuration...");

    // 2. 锁定 config.ts 的绝对路径
    const configAbsoluteFilePath = path.join(
      projectRoot,
      ".vitepress/config.ts",
    );

    // 使用 Vite 提供的工具去加载配置
    const result = await loadConfigFromFile(
      { command: "build", mode: "production" },
      configAbsoluteFilePath, // 传入绝对路径，防止 Vite 找错
    );

    if (!result || !result.config) {
      throw new Error(
        `Could not find or load VitePress config file at ${configAbsoluteFilePath}`,
      );
    }

    // 🔥 核心修正：如果用户在 config.ts 里用了异步或函数式的 defineConfig，将其解析为纯对象
    let vpConfig = result.config;
    if (typeof vpConfig === "function") {
      vpConfig = await vpConfig();
    }
    // 某些极端情况下，Vite 编译 ESM 后可能会把配置挂在 .default 上
    if (vpConfig.default) {
      vpConfig = vpConfig.default;
    }

    log("vitepress-data", "Extracting global configuration...");

    // 3. 提取所需的四个字段
    const dataJson = {
      title: vpConfig.title || "Default Title",
      description: vpConfig.description || "Default Description",
      favicon: vpConfig.favicon || vpConfig.homepage?.avatar || "/favicon.ico",
    };

    // 4. 定位并确保根目录下的 public 文件夹存在
    const publicDir = path.join(projectRoot, "public");
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
      log("vitepress-data", "Created public directory", publicDir, "success");
    }

    // 5. 写入文件到 /public/data.json
    const targetPath = path.join(publicDir, "data.json");
    fs.writeFileSync(targetPath, JSON.stringify(dataJson, null, 2), "utf-8");

    log(
      "vitepress-data",
      "Successfully generated data.json",
      targetPath,
      "success",
    );
  } catch (err) {
    log("vitepress-data", "Error occurred", err.message, "error");
    process.exit(1);
  }
}

run();
