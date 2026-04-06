import { useState, useEffect, useRef } from 'react';

// Debounced search bar. Calls onSearch after `delay` ms of inactivity.
export function SearchBar({ placeholder = 'Search…', onSearch, delay = 300 }) {
  const [value, setValue] = useState('');
  const timer = useRef(null);

  useEffect(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => onSearch(value), delay);
    return () => clearTimeout(timer.current);
  }, [value, delay, onSearch]);

  return (
    <div className="relative">
      <svg
        className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none"
        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="pl-8 pr-3 py-1.5 text-[12px] border border-gray-300 rounded focus:outline-none focus:border-[#e32200] bg-white w-48"
      />
    </div>
  );
}
