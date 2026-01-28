"use client";
import { useState } from "react";
import Link from "next/link"; 

export default function CategoryCard({ cat, items }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const sortedItems = [...items].sort((a, b) => new Date(b.date) - new Date(a.date));
  const initialItems = sortedItems.slice(0, 5);
  const expandedItems = sortedItems.slice(0, 10);
  
  const displayedItems = isExpanded ? expandedItems : initialItems;
  const hasMoreThanFive = sortedItems.length > 5;

  const slug = cat.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-');

  return (
    <section className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden mb-8 transition-all">
      <div className="px-6 py-4 bg-zinc-50/50 border-b border-zinc-100 flex justify-between items-center">
        <h2 className="text-zinc-400 text-[10px] font-bold uppercase tracking-[0.3em]">{cat}</h2>
        <Link href={`/category/${slug}`} className="text-[10px] text-orange-600 font-bold hover:underline uppercase tracking-tighter">
          Full Archive →
        </Link>
      </div>
      
      <div className="p-6 flex flex-col gap-6">
        {displayedItems.map((item) => (
          <div key={item.id} className="flex items-start gap-4 pb-6 border-b border-zinc-100 last:border-0 last:pb-0">
            <div className="w-14 h-14 flex-shrink-0 bg-white rounded-full border border-zinc-200 overflow-hidden shadow-sm mt-1">
              <img src={item.image} alt="" className="w-full h-full object-cover transition duration-700" />
            </div>
            <div className="flex-1">
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="group">
                <h3 className="text-[14px] md:text-[15px] font-medium leading-[1.4] text-zinc-800 group-hover:text-orange-600 transition-colors">
                  {item.title}
                </h3>
              </a>

              <div className="mt-2 flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                <span className="text-orange-600">{item.source}</span>
                <span className="opacity-30">•</span>
                <span className="font-mono text-[9px]">{item.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {hasMoreThanFive && (
        <button onClick={() => setIsExpanded(!isExpanded)} className="w-full py-3 bg-zinc-50/30 border-t border-zinc-100 text-[11px] font-bold text-zinc-400 hover:text-orange-600 hover:bg-zinc-50 transition-colors uppercase tracking-widest">
          {isExpanded ? "↑ Show Less" : "↓ Show More"}
        </button>
      )}
    </section>
  );
}