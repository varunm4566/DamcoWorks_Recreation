import { Outlet } from 'react-router-dom';
import { Header } from './Header.jsx';
import { Sidebar } from './Sidebar.jsx';
import { Footer } from './Footer.jsx';

/**
 * Main application layout: header(58px) + sidebar(75px) + content + footer(22px)
 */
export function AppLayout() {
  return (
    <div className="h-screen flex flex-col bg-page">
      {/* Header - 58px */}
      <Header />

      {/* Main area: sidebar + content */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />

        {/* Content area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 flex flex-col overflow-hidden p-[14px]">
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}
