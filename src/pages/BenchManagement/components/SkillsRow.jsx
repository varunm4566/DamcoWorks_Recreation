// Download icon — standard download arrow SVG
function DownloadIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
  );
}

// SkillsRow — horizontal scrollable chips filtered by skill, download button at far right.
// Clicking a chip calls onSkillChange(skill). Clicking again deselects (null).
export function SkillsRow({ skills = [], activeSkill, onSkillChange, onExport }) {
  const handleChipClick = (skill) => {
    onSkillChange(activeSkill === skill ? null : skill);
  };

  const handleExport = () => {
    // TODO: Wire up to actual export endpoint when backend is ready
    if (onExport) onExport();
    // Show blue toast — handled in BenchPage
  };

  return (
    <div
      className="flex items-center gap-2 px-3 py-1.5 bg-white border-b"
      style={{ borderColor: '#dee2e6', flexShrink: 0 }}
    >
      {/* Label */}
      <span
        className="flex-shrink-0 text-[11px] font-semibold whitespace-nowrap"
        style={{ color: '#595959' }}
      >
        Bench by Skills:
      </span>

      {/* Scrollable chip row */}
      <div className="flex-1 overflow-x-auto flex items-center gap-2 pb-1 scrollbar-thin">
        {skills.map(({ skill, count }) => {
          const isActive = activeSkill === skill;
          return (
            <button
              key={skill}
              onClick={() => handleChipClick(skill)}
              className="flex-shrink-0 text-[11px] px-2 py-0.5 cursor-pointer transition-colors whitespace-nowrap"
              style={{
                border: isActive ? '1px solid #4338ca' : '1px solid #d3d3d3',
                backgroundColor: isActive ? 'rgba(99,102,241,0.1)' : '#f5f5f5',
                color: isActive ? '#4338ca' : '#808080',
                borderRadius: 10,
                padding: '3px 6px',
              }}
            >
              {skill} ({count})
            </button>
          );
        })}
      </div>

      {/* Download / export button */}
      <button
        onClick={handleExport}
        className="flex-shrink-0 p-1.5 rounded bg-white border transition-colors hover:bg-gray-50"
        style={{ borderColor: '#dee2e6' }}
        title="Export to Excel"
      >
        <DownloadIcon />
      </button>
    </div>
  );
}
