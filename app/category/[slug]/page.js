import { getNewsData } from "@/lib/notion";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  // 🟢 SAFETY FIX: Ensure params and slug exist
  const slug = (await params)?.slug;
  if (!slug) return { title: "Category Archive" };

  const displayTitle = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  return {
    title: `${displayTitle} | Digital Cookie News`,
  };
}

export default async function CategoryPage({ params }) {
  // 🟢 SAFETY FIX: Await params in Next.js 15+
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  
  if (!slug) return notFound();

  const allData = await getNewsData();

  const categoryMap = {
    "notion-news-updates": "Notion News & Updates",
    "tips-tutorials": "Tips & Tutorials",
    "community": "Community"
  };

  const notionCategoryName = categoryMap[slug];
  if (!notionCategoryName) return notFound();
  
  const items = allData
    .filter(item => item.category === notionCategoryName)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <main className="min-h-screen bg-zinc-50 p-6 md:p-12 font-sans">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center text-orange-600 text-[10px] font-bold uppercase tracking-[0.2em] mb-10">
          ← Back to Dashboard
        </Link>

        <header className="mb-12 border-b border-zinc-200 pb-8">
          <h1 className="text-3xl font-bold text-zinc-900">{notionCategoryName}</h1>
        </header>

        <div className="space-y-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="group block">
                <h3 className="text-lg font-semibold text-zinc-800 group-hover:text-orange-600 transition-colors">
                  {item.title}
                </h3>
                {/* 🟢 Editorial Note displayed here */}
                {item.editorialNote && (
                  <p className="mt-3 text-[13px] text-zinc-600 italic border-l-2 border-orange-200 pl-4 bg-zinc-50/50 py-2">
                    {item.editorialNote}
                  </p>
                )}
                <div className="mt-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  <span className="text-orange-600">{item.source}</span> • {item.date}
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}