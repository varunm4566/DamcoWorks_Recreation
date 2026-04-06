// Binary toggle switch with left/right labels.
// Props: leftLabel, rightLabel, checked (bool), onChange (fn)

export function Toggle({ leftLabel, rightLabel, checked, onChange }) {
  return (
    <div className="flex items-center gap-2 text-[12px]">
      {leftLabel && (
        <span className={checked ? 'text-gray-400 font-medium' : 'text-gray-700 font-semibold'}>
          {leftLabel}
        </span>
      )}
      <button
        role="switch"
        aria-checked={checked}
        aria-label={`Toggle ${leftLabel} / ${rightLabel}`}
        onClick={() => onChange(!checked)}
        className="relative inline-flex items-center w-9 h-5 rounded-full transition-colors focus:outline-none"
        style={{ backgroundColor: checked ? '#1a1a2e' : '#d1d5db' }}
      >
        <span
          className="inline-block w-3.5 h-3.5 bg-white rounded-full shadow transform transition-transform"
          style={{ transform: checked ? 'translateX(18px)' : 'translateX(2px)' }}
        />
      </button>
      {rightLabel && (
        <span className={checked ? 'text-gray-700 font-semibold' : 'text-gray-400 font-medium'}>
          {rightLabel}
        </span>
      )}
    </div>
  );
}
