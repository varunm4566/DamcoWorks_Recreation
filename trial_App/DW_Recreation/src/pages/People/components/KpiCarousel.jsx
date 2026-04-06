import { useState } from 'react';

// Wraps any set of KPI cards in a horizontally scrollable carousel with prev/next arrows.
export function KpiCarousel({ children }) {
  const [scrollLeft, setScrollLeft] = useState(0);
  let containerRef = null;

  const SCROLL_AMOUNT = 300;

  const scroll = (dir) => {
    if (!containerRef) return;
    const next = containerRef.scrollLeft + dir * SCROLL_AMOUNT;
    containerRef.scrollTo({ left: next, behavior: 'smooth' });
    setScrollLeft(next);
  };

  return (
    <div className="relative flex items-center">
      {/* Prev arrow */}
      <button
        aria-label="Scroll left"
        onClick={() => scroll(-1)}
        className="absolute left-0 z-10 flex items-center justify-center w-6 h-6 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 -translate-x-3"
      >
        <svg className="w-3 h-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Cards container */}
      <div
        ref={(el) => { containerRef = el; }}
        className="flex gap-3 overflow-x-auto scroll-smooth mx-4 pb-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {children}
      </div>

      {/* Next arrow */}
      <button
        aria-label="Scroll right"
        onClick={() => scroll(1)}
        className="absolute right-0 z-10 flex items-center justify-center w-6 h-6 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 translate-x-3"
      >
        <svg className="w-3 h-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
