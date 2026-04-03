import { useProjectStore } from '../../../stores/projectStore.js';

/**
 * Horizontal division filter tab bar.
 * All tabs share equal width (flex-1), content on a single centered line.
 * Vertical border-r separators between each tab.
 * Active tab: indigo bottom-border + light indigo bg.
 */
export function DivisionTabBar() {
  const divisionCounts = useProjectStore((s) => s.divisionCounts);
  const activeDivision = useProjectStore((s) => s.activeDivision);
  const setDivision = useProjectStore((s) => s.setDivision);

  if (!divisionCounts.length) return null;

  const named = divisionCounts.filter((d) => d.division !== 'All');
  const all = divisionCounts.find((d) => d.division === 'All');
  const ordered = [...named, all].filter(Boolean);

  return (
    <div className="flex-shrink-0 bg-white border border-border rounded mb-3 overflow-x-auto">
      <div className="flex min-w-0">
        {ordered.map((div, idx) => {
          const isActive = activeDivision === div.division;
          const isLast = idx === ordered.length - 1;
          return (
            <button
              key={div.division}
              onClick={() => setDivision(div.division)}
              aria-label={`Filter by ${div.division}`}
              className={`flex-1 flex flex-row items-center justify-center gap-2 px-3 py-2.5 text-[13px] border-b-2 transition-colors min-w-[80px] ${
                isLast ? '' : 'border-r border-border'
              } ${
                isActive
                  ? 'border-b-indigo-tab bg-indigo-tab-bg font-semibold text-indigo-tab'
                  : 'border-b-transparent text-text-muted hover:bg-gray-50 hover:text-text-primary'
              }`}
            >
              <span className="whitespace-nowrap">{div.division}</span>
              <span className="inline-flex items-center gap-1 bg-gray-100 rounded px-1.5 py-0.5 text-[11px] flex-shrink-0">
                <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
                {div.projectCount}
              </span>
              <span className="inline-flex items-center gap-1 bg-gray-100 rounded px-1.5 py-0.5 text-[11px] flex-shrink-0">
                <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
                </svg>
                {div.dmCount}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
