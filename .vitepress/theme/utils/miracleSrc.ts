// ../../utils/miracleSrc.ts
import { globalConfig } from "#config";

export interface Friend {
  title: string;
  link: string;
  desc?: string;
  id: string;
  sourceId: string;
  img: string;
}

export interface LoaderResult {
  friends: Friend[];
  trueNum: boolean;
}

interface RemoteSiteItem {
  url: string;
  id: string;
}

// 导出一个纯粹的客户端异步请求函数
export async function getMiracleData(): Promise<LoaderResult> {
  const src = globalConfig.miracle.src;
  const results: Friend[] = [];
  let trueNum = false;

  try {
    // 1. 请求远程列表
    const response = await fetch(src, { cache: "no-store" }); // 💡 强制浏览器不缓存，每次都拿最新的
    if (!response.ok) {
      throw new Error(
        `Failed to fetch site list, status code: ${response.status}`,
      );
    }

    const siteItems: RemoteSiteItem[] = await response.json();

    const configUrlClean = globalConfig.url?.endsWith("/")
      ? globalConfig.url.slice(0, -1)
      : globalConfig.url;

    const matchedItem = siteItems.find((item) => {
      const itemUrlClean = item?.url?.endsWith("/")
        ? item.url.slice(0, -1)
        : item?.url;
      return itemUrlClean === configUrlClean;
    });

    if (matchedItem) {
      trueNum = String(matchedItem.id) === String(globalConfig.miracle.id);
    }

    // 2. 💡 核心优化：改用 Promise.all 浏览器并发请求，速度提升10倍，避免打开页面时卡死
    const fetchPromises = siteItems.map(async (item) => {
      const baseUrl = item?.url;
      const currentSourceId = item?.id;
      if (!baseUrl) return;

      const cleanBaseUrl = baseUrl.endsWith("/")
        ? baseUrl.slice(0, -1)
        : baseUrl;
      const dataUrl = `${cleanBaseUrl}/data.json`;

      try {
        const dataResponse = await fetch(dataUrl, { cache: "no-store" });
        if (!dataResponse.ok) return;

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
        console.error(`[Client] Error fetching ${dataUrl}:`, err.message);
      }
    });

    // 等待所有站点的 data.json 同时请求完毕
    await Promise.all(fetchPromises);
  } catch (error: any) {
    console.error("[Client] Global error caught:", error.message);
  }

  return {
    friends: results,
    trueNum: trueNum,
  };
}
