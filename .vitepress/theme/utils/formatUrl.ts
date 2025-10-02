export function formatUrl(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname; // 只保留域名部分
  } catch {
    // 如果不是合法的 URL，就直接返回原始字符串
    return url;
  }
}
