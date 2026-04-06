/**
 * Pill toggle switch - ~54-58px x 22px
 * @param {{ leftLabel: string, rightLabel: string, value: boolean, onChange: (val: boolean) => void }} props
 */
export function ToggleSwitch({ leftLabel, rightLabel, value, onChange }) {
  return (
    <div className="flex items-center gap-2 text-[13px]">
      <span className={`${!value ? 'text-text-primary font-semibold' : 'text-text-muted'}`}>
        {leftLabel}
      </span>
      <button
        onClick={() => onChange(!value)}
        className="relative w-[54px] h-[22px] rounded-full transition-colors focus:outline-none"
        style={{ backgroundColor: value ? '#0C8B14' : '#ccc' }}
        role="switch"
        aria-checked={value}
        aria-label={`Toggle between ${leftLabel} and ${rightLabel}`}
      >
        <span
          className="absolute top-[2px] w-[18px] h-[18px] bg-white rounded-full transition-transform shadow-sm"
          style={{ left: value ? '32px' : '2px' }}
        />
      </button>
      <span className={`${value ? 'text-text-primary font-semibold' : 'text-text-muted'}`}>
        {rightLabel}
      </span>
    </div>
  );
}
