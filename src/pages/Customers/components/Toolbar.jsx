import { useCustomerStore } from '../../../stores/customerStore.js';
import { ToggleSwitch } from '../../../components/UI/ToggleSwitch.jsx';
import { SearchInput } from '../../../components/UI/SearchInput.jsx';
import { exportCustomersCsv } from '../../../utils/exportCsv.js';

/**
 * Toolbar row - flex between, matches spec button styles
 */
export function Toolbar() {
  const myCustomersOnly = useCustomerStore((s) => s.myCustomersOnly);
  const toggleMyCustomers = useCustomerStore((s) => s.toggleMyCustomers);
  const currency = useCustomerStore((s) => s.currency);
  const toggleCurrency = useCustomerStore((s) => s.toggleCurrency);
  const setSearchTerm = useCustomerStore((s) => s.setSearchTerm);
  const isFullscreen = useCustomerStore((s) => s.isFullscreen);
  const toggleFullscreen = useCustomerStore((s) => s.toggleFullscreen);
  const customers = useCustomerStore((s) => s.customers);

  const btnClass = 'p-1.5 rounded border border-border bg-white text-text-muted hover:bg-gray-50';

  return (
    <div className="flex items-center justify-between mb-2">
      {/* Left: My/All toggle */}
      <ToggleSwitch
        leftLabel="My Customers"
        rightLabel="All Customers"
        value={!myCustomersOnly}
        onChange={() => toggleMyCustomers()}
      />

      {/* Right: Controls */}
      <div className="flex items-center gap-2">
        <ToggleSwitch
          leftLabel="INR"
          rightLabel="USD"
          value={currency === 'usd'}
          onChange={() => toggleCurrency()}
        />

        <SearchInput onSearch={setSearchTerm} />

        {/* Download */}
        <button onClick={() => exportCustomersCsv(customers, currency)} className={btnClass} aria-label="Download">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </button>

        {/* Fullscreen */}
        <button
          onClick={toggleFullscreen}
          className={`${btnClass} ${isFullscreen ? 'ring-2 ring-brand-red' : ''}`}
          aria-label="Fullscreen"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </button>
      </div>
    </div>
  );
}
