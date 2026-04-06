import { useEffect } from 'react';
import { useCustomerDetailStore } from '../../../stores/customerDetailStore.js';
import { ProjectsAccordion } from './ProjectsAccordion.jsx';
import { CurrentFYRevenueAccordion } from './CurrentFYRevenueAccordion.jsx';
import { ProfitMarginAccordion } from './ProfitMarginAccordion.jsx';
import { LifetimeRevenueAccordion } from './LifetimeRevenueAccordion.jsx';
import { BillingMilestonesAccordion } from './BillingMilestonesAccordion.jsx';
import { BookingsAccordion } from './BookingsAccordion.jsx';

/**
 * Delivery section — contains all 6 accordions for the customer delivery view.
 */
export function DeliverySection({ customerId }) {
  const loadProjects    = useCustomerDetailStore((s) => s.loadProjects);
  const loadFyRevenue   = useCustomerDetailStore((s) => s.loadFyRevenue);

  useEffect(() => {
    loadProjects(customerId);
    loadFyRevenue(customerId);
  }, [customerId]);

  return (
    <div>
      <ProjectsAccordion customerId={customerId} />
      <CurrentFYRevenueAccordion customerId={customerId} />
      <ProfitMarginAccordion customerId={customerId} />
      <LifetimeRevenueAccordion customerId={customerId} />
      <BillingMilestonesAccordion customerId={customerId} />
      <BookingsAccordion customerId={customerId} />
    </div>
  );
}
