/**
 * Custom checkbox ~18x18px
 * Checked: green bg/checkmark #0C8B14
 * Unchecked: gray empty border
 * If onClick is provided, it becomes editable
 */
export function ReadOnlyCheckbox({ checked, onClick }) {
  const isEditable = typeof onClick === 'function';
  const cursorClass = isEditable ? 'cursor-pointer' : '';

  if (checked) {
    return (
      <span
        className={`inline-flex items-center justify-center w-[18px] h-[18px] rounded-sm ${cursorClass}`}
        style={{ backgroundColor: '#0C8B14' }}
        onClick={isEditable ? onClick : undefined}
        role={isEditable ? 'checkbox' : undefined}
        aria-checked={isEditable ? true : undefined}
      >
        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center justify-center w-[18px] h-[18px] rounded-sm border border-gray-300 ${cursorClass}`}
      onClick={isEditable ? onClick : undefined}
      role={isEditable ? 'checkbox' : undefined}
      aria-checked={isEditable ? false : undefined}
    />
  );
}
