import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { BenchPage } from './pages/BenchManagement/BenchPage';
import { PeopleLayout } from './pages/People/PeopleLayout';
import { OverviewPage } from './pages/People/Overview/OverviewPage';
import { PeopleListPage } from './pages/People/PeopleList/PeopleListPage';
import { ProjectPage } from './pages/People/Project/ProjectPage';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default: redirect to /bench */}
        <Route path="/" element={<Navigate to="/bench" replace />} />
        <Route path="/bench" element={<BenchPage />} />

        {/* People module — three sub-sections */}
        <Route path="/people" element={<Navigate to="/people/overview" replace />} />
        <Route
          path="/people/overview"
          element={
            <PeopleLayout>
              <OverviewPage />
            </PeopleLayout>
          }
        />
        <Route
          path="/people/people"
          element={
            <PeopleLayout>
              <PeopleListPage />
            </PeopleLayout>
          }
        />
        <Route
          path="/people/project"
          element={
            <PeopleLayout>
              <ProjectPage />
            </PeopleLayout>
          }
        />

        {/* Placeholder routes for other sidebar items — to be built in Phase 2 */}
        <Route path="/customers" element={<ComingSoon title="Customers" />} />
        <Route path="/delivery"  element={<ComingSoon title="Delivery" />} />
        <Route path="/projects"  element={<ComingSoon title="Projects" />} />
      </Routes>
    </BrowserRouter>
  );
}

// Temporary placeholder for unbuilt modules
function ComingSoon({ title }) {
  return (
    <div className="flex items-center justify-center h-screen" style={{ backgroundColor: '#f7f8fc', marginLeft: 75 }}>
      <p className="text-xl font-semibold text-gray-400">{title} — coming soon</p>
    </div>
  );
}

export default App;
