import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/Layout/AppLayout.jsx';
import { CustomerListPage } from './pages/Customers/index.js';
import { CustomerDetailPage } from './pages/CustomerDetail/index.js';
import { ProjectListPage } from './pages/Projects/index.js';
import { DeliveryPage } from './pages/Delivery/index.js';
import { BenchPage } from './pages/BenchManagement/BenchPage.jsx';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/customers" replace />} />
          <Route path="/customers" element={<CustomerListPage />} />
          <Route path="/customers/:customerId" element={<CustomerDetailPage />} />
          <Route path="/delivery" element={<DeliveryPage />} />
          <Route path="/projects" element={<ProjectListPage />} />
          <Route path="/people" element={<PlaceholderPage title="People" />} />
          <Route path="/bench" element={<BenchPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function PlaceholderPage({ title }) {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        <p className="text-gray-500 mt-2">Coming soon</p>
      </div>
    </div>
  );
}

export default App;
