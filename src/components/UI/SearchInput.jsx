import { useState, useRef, useEffect } from 'react';

/**
 * Search button - white bg, 1px solid #DEE2E6, radius 4px
 */
export function SearchInput({ onSearch, placeholder = 'Please type customer name here' }) {
  const [expanded, setExpanded] = useState(false);
  const [value, setValue] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (expanded && inputRef.current) inputRef.current.focus();
  }, [expanded]);

  const handleSubmit = () => onSearch(value);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit();
    else if (e.key === 'Escape') { setExpanded(false); setValue(''); onSearch(''); }
  };

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="p-1.5 rounded border border-border bg-white text-text-muted hover:bg-gray-50"
        aria-label="Search customers"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1 bg-white border border-border rounded px-2 py-1">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => { if (!value) setExpanded(false); }}
        placeholder={placeholder}
        className="w-48 text-[13px] text-text-secondary focus:outline-none"
      />
      <button onClick={handleSubmit} className="p-0.5 text-text-muted hover:text-brand-red" aria-label="Submit search">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    </div>
  );
}
