import { readdirSync, statSync } from "fs";
import path from "path";
import { defineLoader } from "vitepress";

export interface Photo {
  fileName: string;
  category: string;
  path: string;
}

let data: Photo[];

export { data };

export default defineLoader({
  watch: "public/data/photos/**/*",

  load(files) {
    const result: Photo[] = [];

    files.forEach((file) => {
      const stats = statSync(file);
      if (!stats.isFile()) return;

      const relativePath = path.relative("public/data/photos", file);
      const [category, fileName] = relativePath.split(path.sep);

      const nameWithoutExt = fileName.replace(/\.[^/.]+$/, ""); // 去掉扩展名
      const formattedName = nameWithoutExt.replace(/[-_]/g, " ").toUpperCase(); // 替换 - 和 _ 为空格

      result.push({
        fileName, //: formattedName,
        category,
        path: `/data/photos/${category}/${fileName}`,
      });
    });

    return result;
  },
});
