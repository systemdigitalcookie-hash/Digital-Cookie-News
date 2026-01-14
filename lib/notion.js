import { Client } from "@notionhq/client";
import { getLinkPreview } from "link-preview-js";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
  notionVersion: "2022-06-28", // Standard stable version
});

/**
 * Helper to get reliable YouTube thumbnails without scraping.
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
    const response = await notion.databases.query({
      database_id: dataSourceId,
    });

    return await Promise.all(response.results.map(async (page) => {
      const props = page.properties;
      const url = props.Link?.url || "";
      const category = props.Category?.select?.name || "Uncategorized";
      
      // 1. Determine date based on Category
      // Events use 'Expiry Date', others use 'Publication Date'
      const isEvent = category === "Upcoming Events";
      const rawDate = isEvent 
        ? props["Expiry Date"]?.date?.start 
        : props["Publication Date"]?.date?.start;

      // 2. Default fallback image
      let previewImage = "/fallback.jpg"; 
      
      // 3. Image Fetching Logic
      if (url && url.startsWith('http')) {
        const ytThumb = getYoutubeThumbnail(url);
        
        if (ytThumb) {
          previewImage = ytThumb;
        } else {
          try {
            const preview = await getLinkPreview(url, { 
              timeout: 2500,
              headers: { 
                "user-agent": "googlebot" // Use googlebot to bypass some scrapers
              } 
            });
            
            if (preview.images && preview.images.length > 0) {
              previewImage = preview.images[0];
            }
          } catch (e) {
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
        // 🟢 Fetch the Editorial Note from Notion
        editorialNote: props["Editorial Note"]?.rich_text?.[0]?.plain_text || null,
      };
    }));
  } catch (error) {
    console.error("❌ NOTION API ERROR:", error.message);
    return [];
  }
}