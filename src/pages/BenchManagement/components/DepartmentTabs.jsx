function PeopleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      style={{ width: 12, height: 12, flexShrink: 0 }}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
      />
    </svg>
  );
}

export function DepartmentTabs({ activeTab, onTabChange, tabs = [] }) {
  return (
    <div
      className="flex w-full bg-white"
      style={{ borderBottom: '1px solid #d0d0d0', flexShrink: 0 }}
    >
      {tabs.map((tab, index) => {
        const isActive = activeTab === tab.label;
        const isLast   = index === tabs.length - 1;

        return (
          <button
            key={tab.label}
            onClick={() => onTabChange(tab.label)}
            className="flex-1 flex items-center justify-center cursor-pointer"
            style={{
              gap: 6,
              padding: '7px 8px',
              backgroundColor: isActive ? '#ffffff' : 'transparent',
              border: 'none',
              borderBottom: isActive ? '2px solid #1a56db' : '2px solid transparent',
              borderRight: isLast ? 'none' : '1px solid #d0d0d0',
              outline: 'none',
              boxShadow: 'none',
              borderRadius: 0,
              marginBottom: isActive ? -1 : 0,
            }}
          >
            {/* Name */}
            <span style={{
              fontSize: 12,
              color: isActive ? '#1a56db' : '#555555',
              fontWeight: isActive ? 600 : 400,
              lineHeight: 1.3,
              whiteSpace: 'nowrap',
            }}>
              {tab.label}
            </span>

            {/* Icon + count */}
            <span style={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              fontSize: 11,
              color: isActive ? '#1a56db' : '#777777',
              flexShrink: 0,
            }}>
              <PeopleIcon />
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
