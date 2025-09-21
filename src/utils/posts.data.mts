import { createContentLoader } from "vitepress";
import { formatRelativeDate } from "./formatRelativeDate";
import { globalConfig } from "../../config";

interface Post {
  title: string;
  url: string;
  description: string;
  originDate: string;
  date: string;
  category: string;
  image?: string;
  tags: string[];
}

declare const data: Post[];

export { data };

export default createContentLoader("/src/markdown/*.md", {
  transform(raw): Post[] {
    return raw
      .map(({ url, frontmatter }) => ({
        title: frontmatter.title,
        url,
        description: frontmatter.description,
        originDate: frontmatter.published,
        category: frontmatter.category || "Uncategorized",
        tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],

        image: frontmatter.image
          ? /^(https?:\/\/)/.test(frontmatter.image)
            ? frontmatter.image
            : `${globalConfig.imgBed}${frontmatter.image}`
          : "",

        date: formatRelativeDate(frontmatter.published),
      }))
      .sort(
        (a, b) =>
          new Date(b.originDate).getTime() - new Date(a.originDate).getTime()
      );
  },
});
