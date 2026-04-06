// All / Bench tab bar with counts

export function PeopleTabs({ activeTab, onTabChange, allCount, benchCount }) {
  const tabs = [
    { key: 'all', label: `All ${allCount}` },
    { key: 'bench', label: `Bench ${benchCount}` },
  ];

  return (
    <div className="flex gap-1">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          aria-selected={activeTab === tab.key}
          onClick={() => onTabChange(tab.key)}
          className="px-3 py-1 text-[12px] font-medium rounded border transition-colors"
          style={
            activeTab === tab.key
              ? { backgroundColor: '#fee2e2', borderColor: '#e32200', color: '#e32200' }
              : { backgroundColor: 'white', borderColor: '#d1d5db', color: '#374151' }
          }
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
