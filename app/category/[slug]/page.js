import { getNewsData } from "@/lib/notion";
import CategoryCard from "@/components/CategoryCard";

// 🟢 Reduced revalidate to 10 seconds for faster Notion updates
export const revalidate = 10;

export const metadata = {
  title: 'Digital Cookie News',
  icons: {
    icon: '/logo.png',
  },
};

export default async function Home() {
  const newsItems = await getNewsData();
  const now = new Date();

  const categoryOrder = [
    "Notion News & Updates",
    "Tips & Tutorials",
    "Community"
  ];

  const existingCategories = [...new Set(newsItems.map(i => i.category))];
  const sortedCategories = categoryOrder.filter(cat => existingCategories.includes(cat));

  const eventItems = newsItems
    .filter(i => {
      if (i.category !== "Upcoming Events" || !i.date) return false;
      const expiry = new Date(i.date);
      expiry.setHours(23, 59, 59, 999);
      return expiry >= now;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900 p-4 md:p-12 font-sans tracking-tight">
      <div className="max-w-3xl mx-auto">
        <header className="mb-6 flex items-center gap-3 px-2">
          <div className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-xl font-bold tracking-[0.1em] text-orange-600 uppercase">
            Digital Cookie News
          </h1>
        </header>

        <div className="mb-8 px-4 py-3 bg-zinc-100/50 rounded-lg border border-zinc-200/50 text-[11px] text-zinc-500">
          Digital Cookie delivers a curated digest of the latest Notion news and tutorials. We aggregate and summarize top-tier content from across the community to ensure you never miss a critical update. All original rights belong to the respective third-party creators.
        </div>

        <div className="space-y-4">
          {sortedCategories.map((cat) => (
            <CategoryCard 
              key={cat} 
              cat={cat} 
              items={newsItems.filter(item => item.category === cat)} 
            />
          ))}
        </div>

        {eventItems.length > 0 && (
          <footer className="mt-16 pt-8 border-t border-zinc-200 px-2">
            <h2 className="text-zinc-400 text-[10px] font-bold uppercase tracking-[0.3em] mb-8">Upcoming Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {eventItems.map((event) => {
                const d = new Date(event.date);
                return (
                  <a key={event.id} href={event.url} target="_blank" className="flex items-center bg-white border border-zinc-200 rounded-xl p-3 shadow-sm hover:shadow-md transition group">
                    <div className="flex flex-col items-center justify-center bg-zinc-100 text-zinc-500 group-hover:bg-orange-600 group-hover:text-white rounded w-11 h-11 mr-4 transition-colors">
                      <span className="text-[8px] uppercase font-bold leading-none">{d.toLocaleDateString("en-US", {month: 'short'})}</span>
                      <span className="text-base font-bold">{d.getDate()}</span>
                    </div>
                    <div>
                      <h4 className="text-[13px] font-bold text-zinc-700 group-hover:text-zinc-900 leading-tight">{event.title}</h4>
                      <p className="text-[9px] text-zinc-400 uppercase mt-0.5 tracking-tighter">{event.source}</p>
                    </div>
                  </a>
                );
              })}
            </div>
          </footer>
        )}
      </div>
    </main>
  );
}