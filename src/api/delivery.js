import { apiClient } from './client.js';

/**
 * Fetch active divisions for the tab bar
 */
export async function fetchDeliveryDivisions() {
  return apiClient.get('/delivery/divisions');
}

/**
 * Fetch KPI summary for the delivery page
 * @param {string} division - 'Technology Services' | 'Insurance' | 'both'
 */
export async function fetchDeliveryKpi(division = 'both') {
  return apiClient.get(`/delivery/kpi?division=${encodeURIComponent(division)}`);
}

/**
 * Fetch delivery table data with optional filters and sorting
 * @param {Object} params
 * @param {string} params.division
 * @param {string} params.sort     - sort column key
 * @param {string} params.order    - 'asc' | 'desc'
 * @param {string} params.role     - role type filter
 */
export async function fetchDeliveryTable(params = {}) {
  const query = new URLSearchParams();
  if (params.division) query.set('division', params.division);
  if (params.sort)     query.set('sort',     params.sort);
  if (params.order)    query.set('order',    params.order);
  if (params.role)     query.set('role',     params.role);
  if (params.name)     query.set('name',     params.name);
  return apiClient.get(`/delivery/table?${query.toString()}`);
}

// ─── Person Detail Modal ─────────────────────────────────────────────────────

/**
 * Fetch person identity + tab badge counts
 * @param {number} personId
 */
export async function fetchPersonById(personId) {
  return apiClient.get(`/delivery/person/${personId}`);
}

/**
 * Fetch Customers tab data for the modal
 * @param {number} personId
 */
export async function fetchPersonCustomers(personId) {
  return apiClient.get(`/delivery/person/${personId}/customers`);
}

/**
 * Fetch Projects tab data for the modal
 * @param {number} personId
 * @param {boolean} toBeStarted
 */
export async function fetchPersonProjects(personId, toBeStarted = false) {
  return apiClient.get(`/delivery/person/${personId}/projects?toBeStarted=${toBeStarted}`);
}

/**
 * Fetch Engineering Team tab data for the modal
 * @param {number} personId
 */
export async function fetchPersonEngTeam(personId) {
  return apiClient.get(`/delivery/person/${personId}/engineering-team`);
}

/**
 * Download delivery data as CSV
 * @param {string} division
 * @param {string} role
 */
export function getDeliveryExportUrl(division = 'both', role = '') {
  const query = new URLSearchParams({ division, format: 'csv' });
  if (role) query.set('role', role);
  return `/api/delivery/export?${query.toString()}`;
}
