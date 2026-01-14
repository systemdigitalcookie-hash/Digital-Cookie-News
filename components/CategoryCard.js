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
          <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-start group gap-4 pb-6 border-b border-zinc-100 last:border-0 last:pb-0">
            <div className="w-14 h-14 flex-shrink-0 bg-white rounded-full border border-zinc-200 overflow-hidden shadow-sm mt-1">
              <img src={item.image} alt="" className="w-full h-full object-cover transition duration-700 group-hover:scale-105" />
            </div>
            <div className="flex-1">
              <h3 className="text-[14px] md:text-[15px] font-medium leading-[1.4] text-zinc-800 group-hover:text-orange-600 transition-colors">
                {item.title}
              </h3>

              {/* 🟢 Editorial Note with "Editor Icon" */}
              {item.editorialNote && (
                <div className="mt-2 flex items-start gap-2 bg-orange-50/40 p-2 rounded-lg border border-orange-100/50">
                  <svg 
                    className="w-3.5 h-3.5 text-orange-400 mt-0.5 flex-shrink-0" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor" 
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                  </svg>
                  <p className="text-[12px] text-zinc-600 italic leading-relaxed line-clamp-2">
                    {item.editorialNote}
                  </p>
                </div>
              )}

              <div className="mt-2 flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                <span className="text-orange-600">{item.source}</span>
                <span className="opacity-30">•</span>
                <span className="font-mono text-[9px]">{item.date}</span>
              </div>
            </div>
          </a>
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