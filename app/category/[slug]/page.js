import { getNewsData } from "@/lib/notion";
import Link from "next/link";
import { notFound } from "next/navigation";

// This function tells Next.js what the SEO title should be for each page
export async function generateMetadata({ params }) {
  const { slug } = params;
  const displayTitle = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  
  return {
    title: `${displayTitle} | Digital Cookie News Archive`,
    description: `Browse all curated ${displayTitle} updates and resources in the Digital Cookie archive.`,
  };
}

export default async function CategoryPage({ params }) {
  const { slug } = params;
  const allData = await getNewsData();

  // Map the URL slug back to your actual Notion Category names
  const categoryMap = {
    "notion-news-updates": "Notion News & Updates",
    "tips-tutorials": "Tips & Tutorials",
    "community": "Community"
  };

  const notionCategoryName = categoryMap[slug];
  
  // Filter all items for this category and sort by date (newest first)
  const items = allData
    .filter(item => item.category === notionCategoryName)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  // If someone types a category that doesn't exist, show the 404 page
  if (items.length === 0) return notFound();

  return (
    <main className="min-h-screen bg-zinc-50 p-6 md:p-12 font-sans tracking-tight">
      <div className="max-w-3xl mx-auto">
        
        <Link href="/" className="inline-flex items-center text-orange-600 text-[10px] font-bold uppercase tracking-[0.2em] mb-10 hover:translate-x-[-4px] transition-transform">
          ← Back to Dashboard
        </Link>

        <header className="mb-12 border-b border-zinc-200 pb-8">
          <h1 className="text-3xl font-bold text-zinc-900 leading-tight">
            {notionCategoryName}
          </h1>
          <p className="text-zinc-500 mt-3 text-sm max-w-xl">
            A complete historical archive of curated updates, tools, and discussions 
            regarding {notionCategoryName.toLowerCase()}.
          </p>
        </header>

        <div className="space-y-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="group block">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-zinc-800 group-hover:text-orange-600 transition-colors leading-snug">
                      {item.title}
                    </h3>
                    
                    {/* Editorial Note for SEO and Value */}
                    {item.editorialNote && (
                      <p className="mt-3 text-[13px] text-zinc-600 italic leading-relaxed border-l-2 border-orange-200 pl-4 bg-zinc-50/50 py-2 rounded-r">
                        {item.editorialNote}
                      </p>
                    )}

                    <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                      <span className="text-orange-600">{item.source}</span>
                      <span className="opacity-30">•</span>
                      <span className="font-mono text-[9px]">{item.date}</span>
                    </div>
                  </div>
                  
                  {/* Small Thumbnail for the Archive View */}
                  <div className="w-16 h-16 flex-shrink-0 bg-zinc-100 rounded-lg overflow-hidden border border-zinc-200 hidden sm:block">
                    <img src={item.image} alt="" className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition duration-500" />
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}