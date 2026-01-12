import { Client } from "@notionhq/client";
import { getLinkPreview } from "link-preview-js";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
  notionVersion: "2025-09-03",
});

/**
 * Helper to get reliable YouTube thumbnails without scraping.
 * This prevents being blocked by YouTube's bot detection.
 */
function getYoutubeThumbnail(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) 
    ? `https://img.youtube.com/vi/${match[2]}/hqdefault.jpg` 
    : null;
}

export async function getNewsData() {
  const dataSourceId = process.env.NOTION_DATA_SOURCE_ID;

  try {
    const response = await notion.dataSources.query({
      data_source_id: dataSourceId,
    });

    return await Promise.all(response.results.map(async (page) => {
      const props = page.properties;
      const url = props.Link?.url || "";
      const category = props.Category?.select?.name || "Uncategorized";
      
      // 1. Determine which date to use based on Category
      // Events use 'Expiry Date', News items use 'Publication Date'
      const isEvent = category === "Upcoming Events";
      const rawDate = isEvent 
        ? props["Expiry Date"]?.date?.start 
        : props["Publication Date"]?.date?.start;

      // 2. Set the default fallback image (must be in your /public folder)
      let previewImage = "/fallback.jpg"; 
      
      // 3. Image Fetching Logic
      if (url && url.startsWith('http')) {
        const ytThumb = getYoutubeThumbnail(url);
        
        if (ytThumb) {
          // Use YouTube's direct image server
          previewImage = ytThumb;
        } else {
          try {
            // Attempt to scrape VentureBeat, LinkedIn, Reddit, etc.
            const preview = await getLinkPreview(url, { 
              timeout: 2500, // Short timeout to keep the app fast
              headers: { 
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36" 
              } 
            });
            
            if (preview.images && preview.images.length > 0) {
              previewImage = preview.images[0];
            }
          } catch (e) {
            // If scraping is blocked or fails, it keeps "/fallback.jpg"
            console.log(`Using fallback for: ${url}`);
          }
        }
      }

      return {
        id: page.id,
        title: props.Name?.title?.[0]?.plain_text || "Untitled",
        url: url,
        category: category,
        date: rawDate || null,
        source: props.Source?.rich_text?.[0]?.plain_text || "Digital Cookie",
        image: previewImage,
      };
    }));
  } catch (error) {
    console.error("❌ NOTION API ERROR:", error.message);
    return [];
  }
}