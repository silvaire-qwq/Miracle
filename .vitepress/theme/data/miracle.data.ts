import { defineLoader } from "vitepress";
import { globalConfig } from "#config"; // Ensure your alias path resolves correctly in Vite

export interface Friend {
  title: string;
  link: string;
  desc?: string;
  id: string; // 来自 data.json 的 id
  sourceId: string; // 来自最外层列表的 id
  img: string;
}

// 调整 Loader 的最终返回结构，把布尔值带出去
export interface LoaderResult {
  friends: Friend[];
  trueNum: boolean; // 检查配置与列表是否匹配的布尔值
}

interface RemoteSiteItem {
  url: string;
  id: string;
}

export default defineLoader({
  // 返回类型调整为 LoaderResult
  async load(): Promise<LoaderResult> {
    const src = globalConfig.miracle.src;
    const results: Friend[] = [];
    let trueNum = false; // 默认为 false

    try {
      // 1. Fetch the remote list of websites: [{ "url": "...", "id": "..." }]
      const response = await fetch(src);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch site list, status code: ${response.status}`,
        );
      }

      const siteItems: RemoteSiteItem[] = await response.json();

      // 【新增功能】寻找列表中是否存在一项，其 url 与 globalConfig.url 一致
      // 同时清理可能存在的末尾斜杠，保证比对准确
      const configUrlClean = globalConfig.url?.endsWith("/")
        ? globalConfig.url.slice(0, -1)
        : globalConfig.url;

      const matchedItem = siteItems.find((item) => {
        const itemUrlClean = item?.url?.endsWith("/")
          ? item.url.slice(0, -1)
          : item?.url;
        return itemUrlClean === configUrlClean;
      });

      // 如果找到了对应的 url，则比对它的 id 是否与 globalConfig.miracle.id 相同
      if (matchedItem) {
        trueNum = String(matchedItem.id) === String(globalConfig.miracle.id);
      }

      // 2. Iterate through each website item and fetch its /data.json
      for (const item of siteItems) {
        const baseUrl = item?.url;
        const currentSourceId = item?.id;

        if (!baseUrl) continue;

        const cleanBaseUrl = baseUrl.endsWith("/")
          ? baseUrl.slice(0, -1)
          : baseUrl;
        const dataUrl = `${cleanBaseUrl}/data.json`;

        try {
          const dataResponse = await fetch(dataUrl);
          if (!dataResponse.ok) {
            console.warn(
              `[VitePress Loader] Could not fetch ${dataUrl}, status: ${dataResponse.status}`,
            );
            continue;
          }

          const siteData = await dataResponse.json();

          results.push({
            title: siteData.title || "",
            desc: siteData.description || "",
            link: cleanBaseUrl,
            img: siteData.favicon,
            id: siteData.id,
            sourceId: currentSourceId || "",
          });
        } catch (err: any) {
          console.error(
            `[VitePress Loader] Error fetching ${dataUrl}:`,
            err.message,
          );
        }
      }
    } catch (error: any) {
      console.error("[VitePress Loader] Global error caught:", error.message);
    }

    // 4. 返回包装后的对象
    return {
      friends: results,
      trueNum: trueNum,
    };
  },
});
