import { createContentLoader } from "vitepress";
import { formatRelativeDate } from "../utils/formatRelativeDate";
import {
  extractText,
  countWords,
  calcReadingTime,
} from "../utils/textAnalyzer";
import { globalConfig } from "#/config";

interface Post {
  filePath: string;
  title: string;
  url: string;
  description: string;
  originDate: string;
  date: string;
  category: string;
  image?: string;
  tags: string[];
  wordCount?: number;
  readingTime?: number;
}

declare const data: Post[];

export { data };

export default createContentLoader("posts/**/*.md", {
  includeSrc: true,
  transform(raw): Post[] {
    return raw
      .map(({ url, frontmatter, src }) => {
        const content = src ? extractText(src) : undefined;
        return {
          filePath:
            (url.startsWith("/") ? url.slice(1) : url) +
            (url.endsWith("/") ? "index.md" : ".md"),
          title: frontmatter.title,
          url,
          description: frontmatter.description,
          originDate: frontmatter.published,
          category: frontmatter.category ?? "Uncategorized",
          tags: Array.isArray(frontmatter.tags)
            ? frontmatter.tags
            : [frontmatter.tags],

          image: frontmatter.image
            ? /^(https?:\/\/)/.test(frontmatter.image)
              ? frontmatter.image
              : `${globalConfig.imgBed}${frontmatter.image}`
            : "",

          date: formatRelativeDate(frontmatter.published),

          wordCount: content ? countWords(content) : undefined,
          readingTime: content ? calcReadingTime(content) : undefined,
        };
      })
      .sort((a, b) => Date.parse(b.originDate) - Date.parse(a.originDate));
  },
});
