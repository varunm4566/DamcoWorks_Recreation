import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SECTIONS = [
  { key: 'delivery',       label: 'Delivery' },
  { key: 'stakeholders',   label: 'Stakeholders' },
  { key: 'client-connects', label: 'Client Connects' },
  { key: 'logs',           label: 'Logs' },
];

/**
 * Page-level left sidebar for Customer Detail.
 * Shows "List of Sections" with Delivery, Stakeholders, Client Connects, Logs.
 * Collapsible to icon-only mode.
 */
export function LeftSidebar({ customerId, activeSection }) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleNav = (key) => {
    navigate(`/customers/${customerId}?section=${key}`);
  };

  if (collapsed) {
    return (
      <aside className="flex flex-col bg-white border-r border-border flex-shrink-0 w-9">
        <div className="p-1.5 border-b border-border">
          <button
            onClick={() => setCollapsed(false)}
            className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded"
            aria-label="Expand sidebar"
          >
            <svg className="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        <div className="flex flex-col gap-1 p-1">
          {SECTIONS.map((s) => (
            <button
              key={s.key}
              onClick={() => handleNav(s.key)}
              title={s.label}
              className={`w-6 h-6 mx-auto rounded text-[10px] font-semibold flex items-center justify-center transition-colors ${
                activeSection === s.key
                  ? 'bg-brand-red text-white'
                  : 'text-text-muted hover:bg-gray-100'
              }`}
              aria-label={s.label}
            >
              {s.label.charAt(0)}
            </button>
          ))}
        </div>
      </aside>
    );
  }

  return (
    <aside className="flex flex-col bg-white border-r border-border flex-shrink-0 w-[160px]">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-border">
        <span className="text-[12px] font-semibold text-text-primary">List of Sections</span>
        <button
          onClick={() => setCollapsed(true)}
          className="w-5 h-5 flex items-center justify-center hover:bg-gray-100 rounded"
          aria-label="Collapse sidebar"
        >
          <svg className="w-3.5 h-3.5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Section links */}
      <nav className="flex flex-col py-1">
        {SECTIONS.map((s) => {
          const isActive = activeSection === s.key;
          return (
            <button
              key={s.key}
              onClick={() => handleNav(s.key)}
              className={`text-left px-3 py-2 text-[13px] transition-colors relative ${
                isActive
                  ? 'text-brand-red font-semibold bg-red-50 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[3px] before:bg-brand-red before:rounded-r'
                  : 'text-text-secondary hover:bg-gray-50 hover:text-text-primary'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              {s.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
