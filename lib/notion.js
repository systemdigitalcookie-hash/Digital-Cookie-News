import { Client } from "@notionhq/client";
import { getLinkPreview } from "link-preview-js";

// Initialize with the 2025-09-03 API version
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
  notionVersion: "2025-09-03",
});

function getYoutubeThumbnail(url) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? `https://img.youtube.com/vi/${match[2]}/hqdefault.jpg` : null;
}

export async function getNewsData() {
  const dbId = process.env.NOTION_DATA_SOURCE_ID;

  if (!process.env.NOTION_TOKEN || !dbId) {
    console.error("❌ ERROR: Missing NOTION_TOKEN or NOTION_DATA_SOURCE_ID.");
    return [];
  }

  try {
    let finalSourceId = dbId;

    try {
      const dbContainer = await notion.databases.retrieve({ database_id: dbId });
      if (dbContainer.data_sources && dbContainer.data_sources.length > 0) {
        finalSourceId = dbContainer.data_sources[0].id;
      }
    } catch (e) {
      // If retrieval fails, assume the ID provided is already a Data Source ID
    }

    // 🟢 Priority 1: Filter for Status "Published"
    const response = await notion.dataSources.query({
      data_source_id: finalSourceId,
      filter: {
        property: "Status",
        select: {
          equals: "Published"
        }
      },
      sorts: [{ property: 'Publication Date', direction: 'descending' }],
    });

    return await Promise.all(response.results.map(async (page) => {
      const props = page.properties;
      const url = props.Link?.url || "";
      const category = props.Category?.select?.name || "Uncategorized";
      
      const isEvent = category === "Upcoming Events";
      const rawDate = isEvent ? props["Expiry Date"]?.date?.start : props["Publication Date"]?.date?.start;

      let previewImage = "/fallback.jpg"; 
      if (url && url.startsWith('http')) {
        const ytThumb = getYoutubeThumbnail(url);
        if (ytThumb) { previewImage = ytThumb; }
        else {
          try {
            const preview = await getLinkPreview(url, { timeout: 3000, headers: { "user-agent": "googlebot" } });
            if (preview.images?.length > 0) previewImage = preview.images[0];
          } catch (e) {}
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
        // 🔴 Editorial Note logic removed
      };
    }));

  } catch (error) {
    console.error("❌ NOTION API ERROR:", error.code, error.message);
    return [];
  }
}