import { apiClient } from './client.js';

/**
 * Fetch paginated, filtered, sorted customer list
 * @param {{ page?: number, pageSize?: number, sortBy?: string, sortDir?: string, filters?: object, search?: string }} params
 */
export async function fetchCustomers(params = {}) {
  const {
    page = 1,
    pageSize = 25,
    sortBy = 'revenue_usd',
    sortDir = 'desc',
    filters = {},
    search = '',
    myCustomers = false,
  } = params;

  return apiClient.get('/customers', {
    params: {
      page,
      pageSize,
      sortBy,
      sortDir,
      filters: JSON.stringify(filters),
      search,
      myCustomers: myCustomers ? 'true' : 'false',
    },
  });
}

/**
 * Fetch aggregated KPI summary
 */
export async function fetchKpiSummary() {
  return apiClient.get('/customers/kpi-summary');
}

/**
 * Update a boolean field on a customer
 * @param {number} customerId
 * @param {string} field - cp_ownership, incentive_eligibility, or referenceable
 * @param {boolean} value
 */
export async function updateCustomerField(customerId, field, value) {
  return apiClient.patch(`/customers/${customerId}`, { field, value });
}

/**
 * Fetch CSAT survey responses for a customer
 * @param {number} customerId
 */
export async function fetchCsatSurveys(customerId) {
  return apiClient.get(`/customers/${customerId}/csat`);
}
