// Mock API layer for People module
// In production these would be fetch() calls to Express endpoints.
// All functions return Promises to match the real async shape.

import { overviewKpis, overviewRows } from '../data/people/overviewData';
import { peopleKpis, peopleRows, benchRows } from '../data/people/peopleData';
import { projectKpis, projectRows } from '../data/people/projectData';

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// GET /api/people/overview/summary
export async function getOverviewSummary({ myCOE = false } = {}) {
  await delay();
  // myCOE filter: in real app this would filter by logged-in user's COE
  const rows = myCOE ? overviewRows.slice(0, 2) : overviewRows;
  return { success: true, data: { kpis: overviewKpis, rows } };
}

// GET /api/people/list
export async function getPeopleList({ myPeople = false, bench = false, search = '' } = {}) {
  await delay();
  let rows = bench ? benchRows : peopleRows;
  if (myPeople) rows = rows.slice(0, Math.ceil(rows.length / 2));
  if (search) {
    const q = search.toLowerCase();
    rows = rows.filter(r => r.name.toLowerCase().includes(q));
  }
  return { success: true, data: { kpis: peopleKpis, rows, total: rows.length } };
}

// GET /api/people/project/list
export async function getProjectList({ myCOE = false, search = '' } = {}) {
  await delay();
  let rows = projectRows;
  if (myCOE) rows = rows.slice(0, 3);
  if (search) {
    const q = search.toLowerCase();
    rows = rows.filter(r => r.name.toLowerCase().includes(q) || r.client.toLowerCase().includes(q));
  }
  return { success: true, data: { kpis: projectKpis, rows, total: rows.length } };
}

// POST /api/people/:id/pip
export async function updatePIP(id, { reason, targetDate, notes }) {
  await delay(500);
  if (!reason) return { success: false, error: 'Reason is required' };
  return { success: true, data: { id, status: 'PIP', reason, targetDate, notes } };
}

// POST /api/people/:id/escalate
export async function escalatePerson(id, { reason, escalateTo, notes }) {
  await delay(500);
  if (!reason) return { success: false, error: 'Reason is required' };
  return { success: true, data: { id, escalated: true, reason, escalateTo, notes } };
}
