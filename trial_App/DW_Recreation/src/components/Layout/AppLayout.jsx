import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

// AppLayout — wraps every page with the fixed sidebar + topbar.
// Children render in the scrollable main content area.
export function AppLayout({ children }) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f7f8fc' }}>
      <Sidebar />
      <Topbar />

      {/* Main content: offset sidebar (0 mobile / 75px md+) and topbar (50px) */}
      <main
        className="flex flex-col min-h-screen md:ml-[75px]"
        style={{ paddingTop: 50 }}
      >
        {children}
      </main>
    </div>
  );
}
