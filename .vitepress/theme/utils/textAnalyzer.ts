/** 提取纯文本 */
export function extractText(mdContent: string) {
  const text = mdContent
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

/** 统计字数 */
export function countWords(text: string) {
  const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
  const englishWords = (text.match(/[a-zA-Z]+/g) || []).length;
  return chineseChars + englishWords;
}

/** 阅读时长：200字 ≈ 1分钟 */
export function calcReadingTime(text: string) {
  const words = countWords(text);
  return Math.max(1, Math.ceil(words / 200));
}
