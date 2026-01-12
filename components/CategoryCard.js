"use client";
import { useState } from "react";

export default function CategoryCard({ cat, items }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // 1. Sort items by date (latest first)
  const sortedItems = [...items].sort((a, b) => new Date(b.date) - new Date(a.date));
  
  // 2. Define the display sets
  const initialItems = sortedItems.slice(0, 5); // Default view (Top 5)
  const expandedItems = sortedItems.slice(0, 10); // Expanded view (Top 10)
  
  const displayedItems = isExpanded ? expandedItems : initialItems;
  
  // Only show the button if there are more than 5 items, 
  // but we cap the expanded list at 10
  const hasMoreThanFive = sortedItems.length > 5;

  return (
    <section className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden mb-8 transition-all">
      {/* Card Header - Item count removed */}
      <div className="px-6 py-4 bg-zinc-50/50 border-b border-zinc-100 flex items-center">
        <h2 className="text-zinc-400 text-[10px] font-bold uppercase tracking-[0.3em]">
          {cat}
        </h2>
      </div>
      
      {/* Items List */}
      <div className="p-6 flex flex-col gap-6">
        {displayedItems.map((item) => (
          <a 
            key={item.id} 
            href={item.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center group gap-4 pb-6 border-b border-zinc-100 last:border-0 last:pb-0"
          >
            <div className="w-14 h-14 md:w-16 md:h-16 flex-shrink-0 bg-white rounded-full border border-zinc-200 overflow-hidden shadow-sm">
              <img 
                src={item.image} 
                alt="" 
                className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
              />
            </div>

            <div className="flex-1">
              <h3 className="text-[14px] md:text-[15px] font-medium leading-[1.4] text-zinc-800 group-hover:text-orange-600 transition-colors line-clamp-2">
                {item.title}
              </h3>
              <div className="mt-1 flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                <span className="text-orange-600">{item.source}</span>
                <span className="opacity-30">•</span>
                <span className="font-mono text-[9px]">
                  {item.date ? new Date(item.date).toLocaleDateString("en-GB").replace(/\//g, '.') : "RECENT"}
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Expand Button - Capped at 10 total items */}
      {hasMoreThanFive && (
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full py-3 bg-zinc-50/30 border-t border-zinc-100 text-[11px] font-bold text-zinc-400 hover:text-orange-600 hover:bg-zinc-50 transition-colors uppercase tracking-widest"
        >
          {isExpanded ? "↑ Show Less" : "↓ Show More"}
        </button>
      )}
    </section>
  );
}