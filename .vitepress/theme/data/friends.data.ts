import { readFileSync } from "fs";
import path from "path";
import { defineLoader } from "vitepress";

export interface Friend {
  fileName: string;
  title: string;
  link?: string;
  desc?: string;
  img?: string;
  folder?: string;
}

let data: Friend[];

export { data };

export default defineLoader({
  watch: "data/friends/*.json",
  load(files) {
    return files.map((file) => {
      const fileName = path.basename(file);
      const content = JSON.parse(readFileSync(file, "utf-8"));
      return { fileName, ...content };
    });
  },
});
