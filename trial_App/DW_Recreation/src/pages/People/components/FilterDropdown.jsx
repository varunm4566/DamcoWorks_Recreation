import { useState, useRef, useEffect } from 'react';

// Per-column filter dropdown.
// Props:
//   options   — string[]
//   value     — currently applied value
//   onApply   — fn(value)
//   onClear   — fn()

export function FilterDropdown({ options = [], value, onApply, onClear }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value || '');
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Sync draft when external value changes
  useEffect(() => { setDraft(value || ''); }, [value]);

  const handleApply = () => { onApply(draft); setOpen(false); };
  const handleClear = () => { setDraft(''); onClear(); setOpen(false); };

  const isActive = Boolean(value);

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        aria-label="Filter column"
        onClick={() => setOpen(o => !o)}
        className="ml-1 p-0.5 rounded hover:bg-gray-100 transition-colors"
        style={{ color: isActive ? '#e32200' : '#9ca3af' }}
      >
        <svg className="w-3 h-3" fill={isActive ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 12h10M11 20h2" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-44 bg-white border border-gray-200 rounded shadow-lg z-50 p-2">
          <select
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            aria-label="Filter value"
            className="w-full text-[11px] border border-gray-200 rounded px-2 py-1 mb-2 focus:outline-none focus:border-[#e32200]"
          >
            <option value="">— All —</option>
            {options.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <div className="flex gap-1">
            <button
              onClick={handleApply}
              className="flex-1 text-[11px] px-2 py-1 rounded text-white font-medium"
              style={{ backgroundColor: '#e32200' }}
            >
              Apply
            </button>
            <button
              onClick={handleClear}
              className="flex-1 text-[11px] px-2 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-50"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
