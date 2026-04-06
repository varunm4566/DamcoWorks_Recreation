import { useDeliveryStore } from '../../../stores/deliveryStore.js';

const TABS = [
  { label: 'Technology Services', key: 'Technology Services' },
  { label: 'Insurance',           key: 'Insurance' },
  { label: 'Both',                key: 'both' },
];

/**
 * Division filter tab bar for the Delivery page.
 * 3 equal-width tabs; active tab uses indigo border + background per design system.
 */
export function DeliveryDivisionTabBar() {
  const activeDivision  = useDeliveryStore((s) => s.activeDivision);
  const setActiveDivision = useDeliveryStore((s) => s.setActiveDivision);

  return (
    <div className="bg-white border border-border rounded mb-3 flex">
      {TABS.map((tab) => {
        const isActive = activeDivision === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => setActiveDivision(tab.key)}
            className={`
              flex-1 px-4 py-3 text-[14px] text-center transition-colors
              ${isActive
                ? 'bg-[rgba(99,102,241,0.1)] border-b-2 border-[#4338CA] text-black font-semibold'
                : 'border-b-2 border-transparent text-text-muted hover:bg-gray-50 font-normal'
              }
            `}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
