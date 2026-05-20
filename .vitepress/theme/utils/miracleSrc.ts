// friendsLoader.ts
import { globalConfig } from "#config"; // 确保这里的路径在前端能相对引到，或者直接换成你的配置对象

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

// 导出这个核心的业务逻辑函数
export async function clientSideLoad(): Promise<LoaderResult> {
  const src = globalConfig.miracle.src;
  const results: Friend[] = [];
  let trueNum = false;

  try {
    // 1. Fetch the remote list of websites
    const response = await fetch(src);
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

    // 2. Iterate through each website item
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
            `[Client Loader] Could not fetch ${dataUrl}, status: ${dataResponse.status}`,
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
          `[Client Loader] Error fetching ${dataUrl}:`,
          err.message,
        );
      }
    }
  } catch (error: any) {
    console.error("[Client Loader] Global error caught:", error.message);
  }

  return {
    friends: results,
    trueNum: trueNum,
  };
}
