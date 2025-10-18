import { readFileSync } from "fs";
import path from "path";
import { defineLoader } from "vitepress";

export interface Moment {
  fileName: string;
  date: string;
  time: string;
  content: string;
  image?: string;
}

let data: Moment[];

export { data };

export default defineLoader({
  watch: "data/moments/*.json",
  load(files) {
    return files
      .map((file) => {
        const fileName = path.basename(file);
        const content = JSON.parse(readFileSync(file, "utf-8"));
        return { fileName, ...content };
      })
      .sort(
        (a, b) =>
          Date.parse(`${b.date} ${b.time}`) - Date.parse(`${a.date} ${a.time}`),
      );
  },
});
