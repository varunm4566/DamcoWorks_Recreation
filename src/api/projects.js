import { apiClient } from './client.js';

/**
 * Fetch paginated projects list
 * @param {Object} params - page, pageSize, sortBy, sortDir, division, filters, search
 */
export async function fetchProjects(params = {}) {
  const query = new URLSearchParams();
  if (params.page) query.set('page', params.page);
  if (params.pageSize) query.set('pageSize', params.pageSize);
  if (params.sortBy) query.set('sortBy', params.sortBy);
  if (params.sortDir) query.set('sortDir', params.sortDir);
  if (params.division) query.set('division', params.division);
  if (params.search) query.set('search', params.search);
  if (params.filters && Object.keys(params.filters).length > 0) {
    query.set('filters', JSON.stringify(params.filters));
  }
  return apiClient.get(`/projects?${query.toString()}`);
}

/**
 * Fetch KPI summary, optionally filtered by division
 * @param {string} division
 */
export async function fetchProjectKpiSummary(division = 'All') {
  return apiClient.get(`/projects/kpi-summary?division=${encodeURIComponent(division)}`);
}

/**
 * Fetch division tab counts
 */
export async function fetchDivisionCounts() {
  return apiClient.get('/projects/division-counts');
}

/**
 * Fetch single project detail
 * @param {number} projectId
 */
export async function fetchProjectById(projectId) {
  return apiClient.get(`/projects/${projectId}`);
}

/**
 * Fetch distinct DM/PDM names for dropdown
 */
export async function fetchDmPdmList() {
  return apiClient.get('/projects/dm-pdm-list');
}

export async function fetchProjectTeam(projectId, { page = 1, pageSize = 5 } = {}) {
  return apiClient.get(`/projects/${projectId}/team?page=${page}&pageSize=${pageSize}`);
}

export async function fetchProjectInvoices(projectId, { page = 1, pageSize = 5 } = {}) {
  return apiClient.get(`/projects/${projectId}/invoices?page=${page}&pageSize=${pageSize}`);
}

export async function fetchProjectCsatSurveys(projectId, { page = 1, pageSize = 5 } = {}) {
  return apiClient.get(`/projects/${projectId}/csat?page=${page}&pageSize=${pageSize}`);
}

export async function fetchProjectContracts(projectId, { page = 1, pageSize = 5 } = {}) {
  return apiClient.get(`/projects/${projectId}/contracts?page=${page}&pageSize=${pageSize}`);
}

export async function postDeliveryThought(projectId, body) {
  return apiClient.post(`/projects/${projectId}/thoughts`, body);
}

export async function patchWorkStatus(projectId, work_status) {
  return apiClient.patch(`/projects/${projectId}/work-status`, { work_status });
}
