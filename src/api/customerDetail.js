import { apiClient } from './client.js';

// ── Customer Header ───────────────────────────────────────────────

/**
 * Fetch customer header data (name, industry, owner, partner, KPIs)
 * @param {number} customerId
 */
export async function fetchCustomerDetail(customerId) {
  return apiClient.get(`/customer-detail/${customerId}`);
}

// ── Projects ──────────────────────────────────────────────────────

/**
 * @param {number} customerId
 * @param {{ page, pageSize, sort, order, status, search }} params
 */
export async function fetchCustomerProjects(customerId, params = {}) {
  const query = new URLSearchParams();
  if (params.page)     query.set('page',     params.page);
  if (params.pageSize) query.set('pageSize', params.pageSize);
  if (params.sort)     query.set('sort',     params.sort);
  if (params.order)    query.set('order',    params.order);
  if (params.status)   query.set('status',   params.status);
  if (params.search)   query.set('search',   params.search);
  return apiClient.get(`/customer-detail/${customerId}/projects?${query.toString()}`);
}

/**
 * @param {number} customerId
 * @param {number} projectId
 */
export async function fetchProjectDetail(customerId, projectId) {
  return apiClient.get(`/customer-detail/${customerId}/projects/${projectId}`);
}

/**
 * @param {number} customerId
 * @param {number} projectId
 */
export async function fetchProjectThoughts(customerId, projectId) {
  return apiClient.get(`/customer-detail/${customerId}/projects/${projectId}/thoughts`);
}

// ── Revenue ───────────────────────────────────────────────────────

/**
 * @param {number} customerId
 * @param {{ page, pageSize }} params
 */
export async function fetchMonthlyRevenue(customerId, params = {}) {
  const query = new URLSearchParams();
  if (params.page)     query.set('page',     params.page);
  if (params.pageSize) query.set('pageSize', params.pageSize);
  return apiClient.get(`/customer-detail/${customerId}/revenue/monthly?${query.toString()}`);
}

/**
 * @param {number} customerId
 * @param {string} monthYear  'YYYY-MM'
 */
export async function fetchMonthlyBreakdown(customerId, monthYear) {
  return apiClient.get(`/customer-detail/${customerId}/revenue/monthly/${monthYear}/breakdown`);
}

/**
 * @param {number} customerId
 * @param {{ page, pageSize }} params
 */
export async function fetchYearlyRevenue(customerId, params = {}) {
  const query = new URLSearchParams();
  if (params.page)     query.set('page',     params.page);
  if (params.pageSize) query.set('pageSize', params.pageSize);
  return apiClient.get(`/customer-detail/${customerId}/revenue/yearly?${query.toString()}`);
}

/**
 * @param {number} customerId
 * @param {string} fyYear
 */
export async function fetchYearlyBreakdown(customerId, fyYear) {
  return apiClient.get(`/customer-detail/${customerId}/revenue/yearly/${fyYear}/breakdown`);
}

// ── Stakeholders ──────────────────────────────────────────────────

/**
 * @param {number} customerId
 */
export async function fetchStakeholders(customerId) {
  return apiClient.get(`/customer-detail/${customerId}/stakeholders`);
}

/**
 * @param {number} customerId
 * @param {Object} data
 */
export async function createStakeholder(customerId, data) {
  return apiClient.post(`/customer-detail/${customerId}/stakeholders`, data);
}

/**
 * @param {number} customerId
 * @param {number} stakeholderId
 * @param {Object} data
 */
export async function updateStakeholder(customerId, stakeholderId, data) {
  return apiClient.put(`/customer-detail/${customerId}/stakeholders/${stakeholderId}`, data);
}

// ── Partner Logs ──────────────────────────────────────────────────

/**
 * @param {number} customerId
 * @param {'client_partner'|'client_co_partner'} type
 */
export async function fetchPartnerLogs(customerId, type = 'client_partner') {
  return apiClient.get(`/customer-detail/${customerId}/partner-logs?type=${type}`);
}

/**
 * @param {number} customerId
 * @param {string} partnerName
 * @param {string} updatedBy
 */
export async function updateClientPartner(customerId, partnerName, updatedBy = 'System') {
  return apiClient.put(`/customer-detail/${customerId}/client-partner`, { partnerName, updatedBy });
}

/**
 * @param {number} customerId
 * @param {string} partnerName
 * @param {string} updatedBy
 */
export async function updateClientCoPartner(customerId, partnerName, updatedBy = 'System') {
  return apiClient.put(`/customer-detail/${customerId}/client-co-partner`, { partnerName, updatedBy });
}

/**
 * Fetch eligible people for client partner selection
 */
export async function fetchEligiblePartners() {
  return apiClient.get('/customer-detail/meta/eligible-partners');
}

// ── Bookings ──────────────────────────────────────────────────────

/**
 * @param {number} customerId
 * @param {{ page, pageSize }} params
 */
export async function fetchBookings(customerId, params = {}) {
  const query = new URLSearchParams();
  if (params.page)     query.set('page',     params.page);
  if (params.pageSize) query.set('pageSize', params.pageSize);
  return apiClient.get(`/customer-detail/${customerId}/bookings?${query.toString()}`);
}

/**
 * @param {number} customerId
 * @param {number} bookingId
 */
export async function fetchBookingMonths(customerId, bookingId) {
  return apiClient.get(`/customer-detail/${customerId}/bookings/${bookingId}/months`);
}
