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

              {/* 🟢 Minimalist Editorial Note with Tooltip */}
              {item.editorialNote && (
                <div className="mt-1 flex items-center gap-1.5">
                  <p className="text-[12px] text-zinc-500 italic leading-relaxed line-clamp-1">
                    {item.editorialNote}
                  </p>
                  
                  {/* Small Tooltip Icon */}
                  <div className="relative group/tooltip flex-shrink-0 cursor-help">
                    <div className="w-3.5 h-3.5 rounded-full border border-zinc-300 text-zinc-400 flex items-center justify-center text-[8px] font-bold">
                      !
                    </div>
                    {/* Tooltip Content */}
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover/tooltip:block z-20">
                      <div className="bg-zinc-800 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap shadow-lg">
                        Written by Editor Thomas
                      </div>
                      {/* Tooltip Arrow */}
                      <div className="w-2 h-2 bg-zinc-800 rotate-45 mx-auto -mt-1"></div>
                    </div>
                  </div>
                </div>
              )}

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