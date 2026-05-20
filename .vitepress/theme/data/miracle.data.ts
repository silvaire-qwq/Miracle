import { defineLoader } from "vitepress";
import { globalConfig } from "#config"; // Ensure your alias path resolves correctly in Vite

export interface Friend {
  title: string;
  link: string;
  desc?: string;
  img?: string;
}

export default defineLoader({
  // Since we are fetching from a remote API, the local `watch` property is removed.
  async load(): Promise<Friend[]> {
    const src = globalConfig.miracle.src;
    const results: Friend[] = [];

    try {
      // 1. Fetch the remote list of websites: ["https://..."]
      const response = await fetch(src);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch site list, status code: ${response.status}`,
        );
      }

      const urls: string[] = await response.json();

      // 2. Iterate through each website and fetch its /data.json
      for (const baseUrl of urls) {
        if (!baseUrl) continue;

        // Clean up trailing slashes for consistent path concatenation
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

          // 3. Construct data mapping to match the Friend interface
          results.push({
            title: siteData.title || "",
            desc: siteData.description || "",
            // Handle both absolute and relative paths for favicon
            img: siteData.favicon
              ? siteData.favicon.startsWith("http")
                ? siteData.favicon
                : `${cleanBaseUrl}${siteData.favicon}`
              : "",
            link: cleanBaseUrl,
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

    // 4. Return the structured array to VitePress pages/components
    return results;
  },
});
