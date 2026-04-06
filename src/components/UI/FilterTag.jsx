/**
 * Filter chip - transparent bg, #595959 text, x close icon
 * @param {{ label: string, value: string, onRemove: () => void }} props
 */
export function FilterTag({ label, value, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 text-[13px] text-text-muted pb-1">
      <span>{label} : {value}</span>
      <button
        onClick={onRemove}
        className="text-text-muted hover:text-text-primary focus:outline-none ml-0.5"
        aria-label={`Remove ${label} filter`}
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </span>
  );
}
