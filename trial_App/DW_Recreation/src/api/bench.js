const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Request failed');
  return json.data;
}

/** GET /api/bench — all resources with computed bench_days + attention_status */
export const fetchBenchResources = () => request('/api/bench');

/** GET /api/bench/skills */
export const fetchSkills = () => request('/api/bench/skills');

/** GET /api/bench/departments */
export const fetchDepartments = () => request('/api/bench/departments');

/** GET /api/bench/future */
export const fetchFutureBench = () => request('/api/bench/future');

/** PATCH /api/bench/:id/action-plan */
export const saveActionPlan = (id, updates) =>
  request(`/api/bench/${id}/action-plan`, {
    method: 'PATCH',
    body:   JSON.stringify(updates),
  });
