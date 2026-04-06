import { NavLink, useLocation } from 'react-router-dom';
import { AppLayout } from '../../components/Layout/AppLayout';

const subNavItems = [
  { label: 'Overview', path: '/people/overview' },
  { label: 'People',   path: '/people/people' },
  { label: 'Project',  path: '/people/project' },
];

// PeopleLayout — renders the secondary "List of Sections" sidebar
// plus the AppLayout shell, then passes the page content as children.
export function PeopleLayout({ children }) {
  const location = useLocation();

  return (
    <AppLayout>
      <div className="flex flex-1 min-h-0">
        {/* Secondary sidebar */}
        <aside
          className="flex-shrink-0 border-r border-[#dee2e6] bg-white"
          style={{ width: 160 }}
        >
          <div className="flex items-center justify-between px-3 py-2.5 border-b border-[#dee2e6]">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
              List of Sections
            </span>
            <button aria-label="Collapse sections" className="text-gray-400 hover:text-gray-600">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </button>
          </div>
          <nav className="flex flex-col">
            {subNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className="block px-4 py-2.5 text-[13px] font-medium transition-colors"
                  style={
                    isActive
                      ? { color: '#e32200', backgroundColor: '#fff5f5', borderLeft: '3px solid #e32200' }
                      : { color: '#374151', borderLeft: '3px solid transparent' }
                  }
                >
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </aside>

        {/* Page content */}
        <main className="flex-1 overflow-auto min-w-0">
          {children}
        </main>
      </div>
    </AppLayout>
  );
}
