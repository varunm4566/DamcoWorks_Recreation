import { useState } from 'react';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmt(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function engagementLabel(code) {
  if (code === 'FP')  return 'Fixed Price';
  if (code === 'T&M') return 'Time & Material';
  if (code === 'BYT') return 'Buy Your Time';
  return code || '—';
}

// ─── Tab definitions ──────────────────────────────────────────────────────────
const TABS = [
  { key: 'overview',    label: 'Overview' },
  { key: 'projects',    label: 'Current Projects', countKey: 'projectCount' },
  { key: 'skills',      label: 'Skills' },
  { key: 'appraisals',  label: 'Appraisals' },
  { key: 'allocations', label: 'Previous 5 Allocations' },
  { key: 'timeline',    label: 'Timeline' },
  { key: 'pip',         label: 'PIP' },
  { key: 'escalations', label: 'Escalations' },
];

// ─── InfoCard (used in Overview) ──────────────────────────────────────────────
function InfoCard({ title, rows }) {
  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: '16px 20px', flex: 1, minWidth: 0 }}>
      <p style={{ fontSize: 13, fontWeight: 600, color: '#111', marginBottom: 12 }}>{title}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {rows.map(({ label, value }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontSize: 12, color: '#777', width: 180, flexShrink: 0 }}>{label}:</span>
            <span style={{ fontSize: 12, color: '#111' }}>{value || '—'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Overview tab ─────────────────────────────────────────────────────────────
function OverviewTab({ row }) {
  const basicRows = [
    { label: 'Date of Joining', value: fmt(row.dateOfJoining) },
    { label: 'Location',        value: row.location    || '—' },
    { label: 'Division',        value: row.division    || '—' },
    { label: 'Department',      value: row.department  || '—' },
  ];
  const expRows = [
    { label: 'Total Experience',      value: row.totalExperience != null ? `${row.totalExperience} years` : '—' },
    { label: 'Experience with Damco', value: row.damcoExperience != null ? `${row.damcoExperience} years` : '—' },
    { label: 'Email',                 value: row.email  || '—' },
    { label: 'Phone',                 value: row.phone  || '—' },
  ];
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <InfoCard title="Basic Information"    rows={basicRows} />
      <InfoCard title="Experience & Contact" rows={expRows} />
    </div>
  );
}

// ─── Project card ─────────────────────────────────────────────────────────────
function ProjectCard({ row }) {
  const projectTypeBadge = row.projectType === 'Damco IP'
    ? { bg: '#e6f4ea', color: '#1e7e34' }
    : { bg: '#e8edf8', color: '#3b4da8' };

  const durationStr = (row.projectStart || row.projectEnd)
    ? `${fmt(row.projectStart)} - ${fmt(row.projectEnd)}`
    : '—';

  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden', backgroundColor: '#fff' }}>
      {/* ── Header row ── */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        padding: '14px 20px',
        borderBottom: '1px solid #e5e7eb',
      }}>
        {/* Left: project name + type badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#111', margin: 0 }}>
            {row.lastProject || '—'}
          </p>
          {row.projectType && (
            <span style={{
              fontSize: 11, fontWeight: 500,
              color: projectTypeBadge.color,
              backgroundColor: projectTypeBadge.bg,
              borderRadius: 4,
              padding: '2px 10px',
              whiteSpace: 'nowrap',
            }}>
              {row.projectType}
            </span>
          )}
        </div>
        {/* Right: Allocation | Billing */}
        <div style={{ flexShrink: 0, textAlign: 'right' }}>
          <p style={{ fontSize: 11, color: '#888', margin: 0, marginBottom: 2 }}>
            Allocation | Billing
          </p>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#111', margin: 0 }}>
            {row.allocation != null ? `${row.allocation}%` : '—'}
            {' | '}
            {row.billingPct != null ? `${row.billingPct}%` : '—'}
          </p>
        </div>
      </div>

      {/* ── Body: 4 columns ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', padding: '14px 0' }}>
        {/* Role + engagement badge */}
        <div style={{ padding: '0 20px' }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#111', marginBottom: 6 }}>Role</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, color: '#333' }}>{row.role || '—'}</span>
            {row.engagementType && (
              <span style={{
                fontSize: 11,
                color: '#444',
                backgroundColor: '#fff',
                border: '1px solid #bbb',
                borderRadius: 3,
                padding: '0 6px',
                lineHeight: '18px',
              }}>
                {row.engagementType}
              </span>
            )}
          </div>
        </div>

        {/* Delivery Manager */}
        <div style={{ padding: '0 20px' }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#111', marginBottom: 6 }}>Delivery Manager</p>
          <p style={{ fontSize: 13, color: '#333', margin: 0 }}>{row.dm || '—'}</p>
        </div>

        {/* Program Manager */}
        <div style={{ padding: '0 20px' }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#111', marginBottom: 6 }}>Program Manager</p>
          <p style={{ fontSize: 13, color: '#333', margin: 0 }}>{row.programManager || '—'}</p>
        </div>

        {/* Duration */}
        <div style={{ padding: '0 20px' }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#111', marginBottom: 6 }}>Duration</p>
          <p style={{ fontSize: 13, color: '#333', margin: 0 }}>{durationStr}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Current Projects tab ─────────────────────────────────────────────────────
function CurrentProjectsTab() {
  return (
    <div style={{ padding: '48px 0', textAlign: 'center', color: '#bbb', fontSize: 13 }}>
      No active project assignments
    </div>
  );
}

// ─── Skills tab ───────────────────────────────────────────────────────────────
function SkillsTab({ row }) {
  return (
    <div>
      {/* Primary Skills */}
      <div style={{ paddingBottom: 16 }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: '#111', marginBottom: 12 }}>Primary Skills</p>
        {row.primarySkill ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <span style={{
              fontSize: 13, color: '#111',
              border: '1px solid #d1d5db',
              borderRadius: 4,
              padding: '3px 12px',
              backgroundColor: '#fff',
            }}>
              {row.primarySkill}
            </span>
          </div>
        ) : (
          <p style={{ fontSize: 13, color: '#aaa' }}>No Skills to show</p>
        )}
      </div>
      <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '4px 0 16px' }} />

      {/* Secondary Skills */}
      <div>
        <p style={{ fontSize: 14, fontWeight: 600, color: '#111', marginBottom: 12 }}>Secondary Skills</p>
        <p style={{ fontSize: 13, color: '#aaa' }}>No Skills to show</p>
      </div>
      <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '16px 0 0' }} />
    </div>
  );
}

// ─── Coming soon stub ─────────────────────────────────────────────────────────
// ─── Appraisals tab ───────────────────────────────────────────────────────────
const RATING_COLORS = {
  'A+': { bg: '#dcfce7', color: '#166534' },
  'A':  { bg: '#dcfce7', color: '#166534' },
  'B+': { bg: '#dbeafe', color: '#1e40af' },
  'B':  { bg: '#dbeafe', color: '#1e40af' },
  'C+': { bg: '#fef9c3', color: '#854d0e' },
  'C':  { bg: '#fef9c3', color: '#854d0e' },
  'D':  { bg: '#fee2e2', color: '#991b1b' },
};

const DUMMY_APPRAISALS = [
  {
    year: 2025,
    rating: 'B+',
    reviewer: 'Sanjay Mehta',
    feedback: `Demonstrated strong technical skills and a proactive learning attitude throughout the year. Actively contributed to POCs on cloud migration and microservices. Shows great ownership of assigned modules and delivers with minimal supervision.\n\nAreas of improvement: Needs to improve stakeholder communication and documentation practices. Should take more initiative in cross-team collaboration.\n\nRecommendation: Ready for a senior developer role. Enroll in communication and leadership workshops.`,
  },
  {
    year: 2024,
    rating: 'C+',
    reviewer: 'Neha Kapoor',
    feedback: `Good understanding of the tech stack and consistently meets sprint commitments. Showed improvement in code quality after mid-year review. Participated well in knowledge-sharing sessions.\n\nAreas of improvement: Debugging complex production issues needs work. Should invest time in understanding system architecture beyond assigned tasks.\n\nRecommendation: Continue current growth trajectory. Assign to a slightly more complex module in the next engagement.`,
  },
];

function AppraisalsTab({ row }) {
  // Use dummy data — replace with real API data when available
  const appraisals = DUMMY_APPRAISALS;

  if (!appraisals.length) {
    return (
      <div style={{ padding: '48px 0', textAlign: 'center', color: '#bbb', fontSize: 13 }}>
        No appraisal records found
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {appraisals.map((a) => {
        const ratingStyle = RATING_COLORS[a.rating] || { bg: '#f3f4f6', color: '#555' };
        return (
          <div key={a.year} style={{ border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden' }}>
            {/* Card header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 20px', borderBottom: '1px solid #e5e7eb', backgroundColor: '#fafafa',
            }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#111', margin: 0 }}>{a.year}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 12, color: '#666' }}>Reviewed by <strong style={{ color: '#111' }}>{a.reviewer}</strong></span>
                <span style={{
                  fontSize: 13, fontWeight: 700,
                  backgroundColor: ratingStyle.bg, color: ratingStyle.color,
                  borderRadius: 6, padding: '2px 12px', border: `1px solid ${ratingStyle.color}33`,
                }}>
                  {a.rating}
                </span>
              </div>
            </div>
            {/* Feedback body */}
            <div style={{ padding: '16px 20px' }}>
              {a.feedback.split('\n\n').map((para, i) => (
                <p key={i} style={{ fontSize: 13, color: '#374151', lineHeight: 1.7, margin: i > 0 ? '10px 0 0' : 0 }}>
                  {para}
                </p>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Previous 5 Allocations tab ──────────────────────────────────────────────
const DUMMY_ALLOCATIONS = [
  {
    project: 'Antrix - Digital Marketing Activities for Koda Cars',
    projectType: 'Client Project',
    allocation: 100,
    role: null,
    engagementType: 'T&M',
    dm: 'Harsh Shah',
    pm: 'Proneeta Das Tsering',
    start: 'Dec 30, 2024',
    end: 'Mar 18, 2026',
    rollOff: 'Mar 18, 2026',
    feedback: { Communication: 'Outstanding', Confidence: 'Outstanding', Attitude: 'Outstanding', 'Tech Skills': 'Outstanding', 'Interview cracking skills': 'Outstanding' },
    remark: 'No remark available',
    reviewer: 'Harsh Shah',
  },
  {
    project: 'DamcoWorks Product Development',
    projectType: 'Damco Application',
    allocation: 100,
    role: null,
    engagementType: null,
    dm: 'Vinit Batra',
    pm: null,
    start: 'Feb 17, 2025',
    end: 'Feb 04, 2026',
    rollOff: 'Feb 04, 2026',
    feedback: { Communication: 'Good', Confidence: 'Good', Attitude: 'Good', 'Tech Skills': 'Good', 'Interview cracking skills': 'Good' },
    remark: 'He is being released because of a lack of work as per his capabilities.\nHis performance is actually good and there are no complaints.',
    reviewer: 'Vinit Batra',
  },
  {
    project: 'Cameron - EQ AI Website Development',
    projectType: 'Client Project',
    allocation: 50,
    role: 'Team Member - Developer',
    engagementType: 'FP',
    dm: 'Harsh Shah',
    pm: 'Proneeta Das Tsering',
    start: 'May 19, 2025',
    end: 'Oct 30, 2025',
    rollOff: 'Oct 30, 2025',
    feedback: null,
    remark: 'No remark available',
    reviewer: null,
  },
];

const FEEDBACK_RATING_STYLE = {
  'Outstanding': { color: '#1d4ed8', fontStyle: 'italic', fontWeight: 700 },
  'Good':        { color: '#15803d', fontStyle: 'italic', fontWeight: 700 },
  'Average':     { color: '#b45309', fontStyle: 'italic', fontWeight: 700 },
  'Poor':        { color: '#dc2626', fontStyle: 'italic', fontWeight: 700 },
};

const PROJECT_TYPE_BADGE = {
  'Client Project':    { bg: '#e8edf8', color: '#3b4da8' },
  'Damco Application': { bg: '#f0f0f0', color: '#444' },
  'Damco IP':          { bg: '#e6f4ea', color: '#1e7e34' },
};

function AllocationCard({ a }) {
  const typeBadge = PROJECT_TYPE_BADGE[a.projectType] || { bg: '#f0f0f0', color: '#444' };
  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden', backgroundColor: '#fff' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#111' }}>{a.project}</span>
          <span style={{ fontSize: 11, padding: '2px 10px', borderRadius: 4, backgroundColor: typeBadge.bg, color: typeBadge.color }}>
            {a.projectType}
          </span>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 12 }}>
          <p style={{ fontSize: 11, color: '#888', margin: 0 }}>Allocation</p>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#111', margin: 0 }}>{a.allocation}%</p>
        </div>
      </div>

      {/* Body: 5-column grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', padding: '12px 20px', borderBottom: '1px solid #f0f0f0', gap: 4 }}>
        <div>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#111', marginBottom: 4 }}>Role</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            {a.role && <span style={{ fontSize: 12, color: '#333' }}>{a.role}</span>}
            {a.engagementType && (
              <span style={{ fontSize: 11, color: '#444', border: '1px solid #bbb', borderRadius: 3, padding: '0 6px', lineHeight: '18px' }}>
                {a.engagementType}
              </span>
            )}
          </div>
        </div>
        <div>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#111', marginBottom: 4 }}>Delivery Manager</p>
          <p style={{ fontSize: 12, color: '#333', margin: 0 }}>{a.dm || '—'}</p>
        </div>
        <div>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#111', marginBottom: 4 }}>Program Manager</p>
          <p style={{ fontSize: 12, color: '#333', margin: 0 }}>{a.pm || '—'}</p>
        </div>
        <div>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#111', marginBottom: 4 }}>Duration</p>
          <p style={{ fontSize: 12, color: '#333', margin: 0 }}>{a.start} - {a.end}</p>
        </div>
        <div>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#111', marginBottom: 4 }}>Roll Off Date</p>
          <p style={{ fontSize: 12, color: '#333', margin: 0 }}>{a.rollOff}</p>
        </div>
      </div>

      {/* De-allocation feedback */}
      <div style={{ padding: '10px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#555' }}>De-allocation Feedback</span>
          {a.reviewer && <span style={{ fontSize: 11, color: '#888' }}>By {a.reviewer}</span>}
        </div>

        {a.feedback && (
          <p style={{ fontSize: 12, color: '#333', marginBottom: 6, lineHeight: 1.7 }}>
            {Object.entries(a.feedback).map(([attr, rating], i, arr) => {
              const s = FEEDBACK_RATING_STYLE[rating] || {};
              return (
                <span key={attr}>
                  {attr}: <span style={s}>{rating}</span>
                  {i < arr.length - 1 ? ' | ' : '.'}
                </span>
              );
            })}
          </p>
        )}

        {a.remark && (
          <p style={{ fontSize: 12, color: '#333', margin: 0, lineHeight: 1.6 }}>
            <strong>Remark:</strong>{' '}
            {a.remark.split('\n').map((line, i) => (
              <span key={i}>{line}{i < a.remark.split('\n').length - 1 && <br />}</span>
            ))}
          </p>
        )}
      </div>
    </div>
  );
}

function PreviousAllocationsTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {DUMMY_ALLOCATIONS.map((a, i) => <AllocationCard key={i} a={a} />)}
    </div>
  );
}

// ─── Timeline tab ─────────────────────────────────────────────────────────────

// Dummy allocation periods — in production this comes from timesheet/allocation API
// ── Single source of truth for all timeline dummy data ────────────────────────
// These must stay in sync with DUMMY_APPRAISALS and DUMMY_ALLOCATIONS constants above.
const DUMMY_DOJ   = '2023-12-12';
const DUMMY_DESIG = 'Software Engineer';
const DUMMY_COE   = 'Low Code Tools';
const BENCH_THRESHOLD = 7; // days — gaps < 7 days are ignored

// ALL allocations (matches Previous 5 Allocations tab exactly)
const DUMMY_ALLOCATIONS_RAW = [
  { project: 'DamcoGroup Website Updates',                     role: 'Team Member - UI Developer',   start: '2024-07-31', end: '2024-08-18' },
  { project: 'Cameron - EQ AI Website Development',            role: 'Team Member - Developer',       start: '2024-09-01', end: '2025-01-19' },
  { project: 'Antrix - Digital Marketing Activities for Koda Cars', role: null,                       start: '2024-12-30', end: '2026-03-18' },
  { project: 'DamcoWorks Product Development',                 role: 'Developer',                     start: '2025-02-03', end: '2026-02-04' },
];

// ALL appraisals (matches Appraisals tab — both 2024 and 2025)
const DUMMY_APPRAISAL_EVENTS = [
  { date: '2024-12-12', cycle: 'Oct-2024', rating: 'C+' },
  { date: '2025-12-12', cycle: 'Oct-2025', rating: 'B+' },
];

function buildTimeline(doj, allocations, appraisals) {
  const events = [];
  const toDate = (s) => new Date(s);
  const diffDays = (a, b) => Math.round((b - a) / 86400000);
  const fmtD = (d) => new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  // 1. Joining event
  events.push({
    type: 'joining',
    title: 'Joining',
    date: doj,
    detail: { designation: DUMMY_DESIG, coe: DUMMY_COE },
  });

  // 2. ALL project assignments (no limit, first gets special label)
  allocations.forEach((a, idx) => {
    events.push({
      type: 'project',
      title: idx === 0 ? 'First Project Assigned' : 'Project Assigned',
      date: a.start,
      detail: { project: a.project, role: a.role },
    });
  });

  // 3. ALL bench gaps — calculated from gaps between allocations (≥ BENCH_THRESHOLD days)
  // Sort allocations by start date to ensure correct gap calculation
  const sorted = [...allocations].sort((a, b) => new Date(a.start) - new Date(b.start));

  // Gap from DOJ to first allocation
  if (sorted.length > 0) {
    const gap = diffDays(toDate(doj), toDate(sorted[0].start));
    if (gap >= BENCH_THRESHOLD) {
      events.push({ type: 'bench', title: 'Moved to Bench', date: doj,
        detail: { from: fmtD(doj), to: fmtD(sorted[0].start), duration: `${gap} days` } });
    }
  }
  // Gaps between consecutive allocations
  for (let i = 0; i < sorted.length - 1; i++) {
    const gapStart = sorted[i].end;
    const gapEnd   = sorted[i + 1].start;
    const gap      = diffDays(toDate(gapStart), toDate(gapEnd));
    if (gap >= BENCH_THRESHOLD) {
      events.push({ type: 'bench', title: 'Moved to Bench', date: gapStart,
        detail: { from: fmtD(gapStart), to: fmtD(gapEnd), duration: `${gap} days` } });
    }
  }
  // Gap from last allocation end to today
  if (sorted.length > 0) {
    const lastEnd = sorted[sorted.length - 1].end;
    const today   = new Date().toISOString().slice(0, 10);
    const gap     = diffDays(toDate(lastEnd), toDate(today));
    if (gap >= BENCH_THRESHOLD) {
      events.push({ type: 'bench', title: 'Moved to Bench', date: lastEnd,
        detail: { from: fmtD(lastEnd), to: fmtD(today), duration: `${gap} days` } });
    }
  }

  // 5. Appraisals
  appraisals.forEach(a => {
    events.push({
      type: 'appraisal',
      title: 'Annual Appraisal',
      date: a.date,
      detail: { cycle: a.cycle, rating: a.rating },
    });
  });

  // Sort descending by date
  events.sort((a, b) => new Date(b.date) - new Date(a.date));
  return events;
}

const TL_ICONS = {
  joining:   (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={{ width: 18, height: 18 }}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
    </svg>
  ),
  bench:     (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={{ width: 18, height: 18 }}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  ),
  project:   (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={{ width: 18, height: 18 }}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  appraisal: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={{ width: 18, height: 18 }}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  ),
};

const FILTER_TABS = [
  { key: 'all',     label: 'All' },
  { key: 'pip',     label: 'PIP' },
  { key: 'project', label: 'Project Assignment' },
  { key: 'appraisal', label: 'Appraisals' },
];

function TimelineEvent({ ev }) {
  const icon  = TL_ICONS[ev.type] || TL_ICONS.bench;
  const fmtD  = (d) => new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const d     = ev.detail;

  return (
    <div style={{ display: 'flex', gap: 14, padding: '14px 0', borderBottom: '1px solid #f0f0f0', alignItems: 'flex-start' }}>
      {/* Icon */}
      <div style={{ width: 34, height: 34, borderRadius: 8, backgroundColor: '#f3f4f6', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#555' }}>
        {icon}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: '#111', margin: '0 0 4px' }}>{ev.title}</p>

        {ev.type === 'joining' && (
          <p style={{ fontSize: 12, color: '#555', margin: 0 }}>
            <strong>Designation:</strong> {d.designation} &nbsp;|&nbsp; <strong>COE:</strong> {d.coe}
          </p>
        )}
        {ev.type === 'bench' && (
          <p style={{ fontSize: 12, color: '#555', margin: 0 }}>
            <strong>From:</strong> {d.from} &nbsp;|&nbsp; <strong>To:</strong> {d.to} &nbsp;|&nbsp; <strong>Duration:</strong> {d.duration}
          </p>
        )}
        {ev.type === 'project' && (
          <p style={{ fontSize: 12, color: '#555', margin: 0 }}>
            <strong>Project:</strong> {d.project} &nbsp;|&nbsp; <strong>Role:</strong> {d.role}
          </p>
        )}
        {ev.type === 'appraisal' && (
          <p style={{ fontSize: 12, color: '#555', margin: 0 }}>
            <strong>Appraisal Cycle:</strong> {d.cycle} &nbsp;|&nbsp; <strong>Rating:</strong> {d.rating}
          </p>
        )}
      </div>

      {/* Date */}
      <p style={{ fontSize: 12, color: '#555', flexShrink: 0, whiteSpace: 'nowrap' }}>{fmtD(ev.date)}</p>
    </div>
  );
}

function TimelineTab() {
  const [activeFilter, setActiveFilter] = useState('all');

  const allEvents = buildTimeline(DUMMY_DOJ, DUMMY_ALLOCATIONS_RAW, DUMMY_APPRAISAL_EVENTS);

  const visible = allEvents.filter(ev => {
    if (activeFilter === 'all')       return true;
    if (activeFilter === 'project')   return ev.type === 'project';
    if (activeFilter === 'appraisal') return ev.type === 'appraisal';
    if (activeFilter === 'pip')       return ev.type === 'pip';
    return true;
  });

  return (
    <div>
      {/* Filter buttons */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {FILTER_TABS.map(f => {
          const active = activeFilter === f.key;
          return (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              style={{
                fontSize: 12, padding: '4px 14px', borderRadius: 20, cursor: 'pointer',
                border: active ? '1.5px solid #e32200' : '1px solid #d1d5db',
                backgroundColor: active ? '#fff' : '#fff',
                color: active ? '#e32200' : '#555',
                fontWeight: active ? 600 : 400,
              }}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Events */}
      <div>
        {visible.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#bbb', fontSize: 13, padding: '40px 0' }}>No events found</p>
        ) : (
          visible.map((ev, i) => <TimelineEvent key={i} ev={ev} />)
        )}
      </div>
    </div>
  );
}

// ─── Coming soon stub ─────────────────────────────────────────────────────────
// ─── PIP Tab ─────────────────────────────────────────────────────────────────
// Keyed by empCode — only these employees have PIP records
const DUMMY_PIPS = {
  EMP003: [
    {
      id: 1,
      startDate: '2026-04-03',
      endDate: '2026-05-03',
      reviewer: 'Kaushki Singh',
      status: 'Active',
      reason: 'Performance issue — consistently missing sprint deliverables and quality benchmarks over the past two quarters.',
      improvementGoal: '1. Complete all assigned tickets within sprint deadlines.\n2. Reduce defect rate to below 5%.\n3. Attend weekly 1:1 check-ins with the team lead.\n4. Submit progress report every Friday.',
      notes: '',
    },
  ],
  EMP007: [
    {
      id: 1,
      startDate: '2025-10-01',
      endDate: '2025-11-30',
      reviewer: 'Kaushki Singh',
      status: 'Completed',
      reason: 'Repeated delays in code reviews and failure to meet release deadlines.',
      improvementGoal: '1. Participate actively in all code reviews.\n2. No release deadline misses for two consecutive sprints.\n3. Pair programming sessions twice a week.',
      notes: 'Employee demonstrated improvement across all areas. Goals met satisfactorily. PIP concluded successfully.',
    },
  ],
};

function PIPCard({ pip: initialPip }) {
  const [pip, setPip] = useState(initialPip);
  const [notes, setNotes] = useState(initialPip.notes || '');
  const [concluding, setConcluding] = useState(false);

  const isActive = pip.status === 'Active';

  function handleConclude() {
    if (!notes.trim()) return;
    setConcluding(true);
    setTimeout(() => {
      setPip(p => ({ ...p, status: 'Completed', notes }));
      setConcluding(false);
    }, 600);
  }

  const statusBadge = pip.status === 'Active'
    ? { bg: '#dcfce7', color: '#166534', label: 'Active' }
    : { bg: '#f3f4f6', color: '#374151', label: 'Completed' };

  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: '16px 20px', marginBottom: 16, background: '#fff' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#111' }}>
            {fmt(pip.startDate)} – {fmt(pip.endDate)}
          </span>
          <span style={{ fontSize: 12, color: '#6b7280' }}>|</span>
          <span style={{ fontSize: 12, color: '#374151' }}>{pip.reviewer}</span>
        </div>
        <span style={{
          fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 12,
          background: statusBadge.bg, color: statusBadge.color,
        }}>
          {statusBadge.label}
        </span>
      </div>

      {/* Reason + Goal */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Reason</p>
          <p style={{ fontSize: 13, color: '#111', lineHeight: 1.5 }}>{pip.reason}</p>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Improvement Goal</p>
          <p style={{ fontSize: 13, color: '#111', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{pip.improvementGoal}</p>
        </div>
      </div>

      {/* Notes */}
      <div style={{ marginBottom: 12 }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Notes to conclude PIP
        </p>
        {pip.status === 'Completed' ? (
          <p style={{ fontSize: 13, color: '#374151', background: '#f9fafb', borderRadius: 6, padding: '10px 12px', border: '1px solid #e5e7eb', minHeight: 64 }}>
            {pip.notes || '—'}
          </p>
        ) : (
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Type Here"
            rows={3}
            style={{
              width: '100%', fontSize: 13, color: '#111', border: '1px solid #d1d5db',
              borderRadius: 6, padding: '10px 12px', resize: 'vertical', outline: 'none',
              fontFamily: 'inherit', boxSizing: 'border-box',
            }}
          />
        )}
      </div>

      {/* Conclude button */}
      {isActive && (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={handleConclude}
            disabled={!notes.trim() || concluding}
            style={{
              padding: '8px 20px', fontSize: 13, fontWeight: 600, borderRadius: 6,
              border: 'none', cursor: notes.trim() ? 'pointer' : 'not-allowed',
              background: notes.trim() ? '#dc2626' : '#fca5a5', color: '#fff',
              opacity: concluding ? 0.7 : 1, transition: 'opacity 0.2s',
            }}
          >
            {concluding ? 'Concluding…' : 'Conclude PIP'}
          </button>
        </div>
      )}
    </div>
  );
}

function PIPTab({ row }) {
  const pips = DUMMY_PIPS[row.empCode] || [];
  return (
    <div>
      {pips.length === 0 ? (
        <div style={{ padding: '48px 0', textAlign: 'center', color: '#bbb', fontSize: 13 }}>
          No PIP records found.
        </div>
      ) : (
        pips.map(pip => <PIPCard key={pip.id} pip={pip} />)
      )}
    </div>
  );
}

function ComingSoon({ label }) {
  return (
    <div style={{ padding: '48px 0', textAlign: 'center', color: '#bbb', fontSize: 13 }}>
      {label} — available in Phase 2
    </div>
  );
}

// ─── ProfileDrawer (modal) ────────────────────────────────────────────────────
export function ProfileDrawer({ isOpen, onClose, row }) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!isOpen || !row) return null;

  const initials = row.name.split(' ').map((n) => n[0]).slice(0, 2).join('');

  function tabCount(tab) {
    if (tab.countKey === 'projectCount') return 0;
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        backgroundColor: '#fff',
        borderRadius: 10,
        width: '90vw',
        maxWidth: 860,
        maxHeight: '85vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
        overflow: 'hidden',
      }}>
        {/* ── Modal header ── */}
        <div style={{ padding: '18px 24px 0', borderBottom: '1px solid #e5e7eb', flexShrink: 0 }}>
          {/* Name + close */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 42, height: 42, borderRadius: '50%',
                backgroundColor: '#373f50',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: 14, fontWeight: 600, flexShrink: 0,
              }}>
                {initials}
              </div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 600, color: '#111', lineHeight: 1.3 }}>{row.name}</p>
                <p style={{ fontSize: 12, color: '#595959', marginTop: 2 }}>
                  {row.employeeType} · {row.empCode}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{ fontSize: 22, lineHeight: 1, color: '#999', background: 'none', border: 'none', cursor: 'pointer', padding: '0 4px' }}
            >
              ×
            </button>
          </div>

          {/* Tab bar */}
          <div style={{ display: 'flex', overflowX: 'auto', gap: 0 }}>
            {TABS.map((tab) => {
              const active = activeTab === tab.key;
              const count  = tabCount(tab);
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    padding: '8px 16px',
                    fontSize: 13,
                    fontWeight: active ? 600 : 400,
                    color: active ? '#e32200' : '#555',
                    borderBottom: active ? '2px solid #e32200' : '2px solid transparent',
                    background: 'none',
                    border: 'none',
                    borderBottom: active ? '2px solid #e32200' : '2px solid transparent',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    transition: 'color 0.12s',
                  }}
                >
                  {tab.label}
                  {count != null && (
                    <span style={{ marginLeft: 5, fontSize: 11, color: active ? '#e32200' : '#bbb' }}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Tab content ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {activeTab === 'overview'    && <OverviewTab row={row} />}
          {activeTab === 'projects'    && <CurrentProjectsTab />}
          {activeTab === 'skills'      && <SkillsTab row={row} />}
          {activeTab === 'appraisals'  && <AppraisalsTab row={row} />}
          {activeTab === 'allocations' && <PreviousAllocationsTab />}
          {activeTab === 'timeline'    && <TimelineTab />}
          {activeTab === 'pip'         && <PIPTab row={row} />}
          {activeTab === 'escalations' && <ComingSoon label="Escalations" />}
        </div>
      </div>
    </div>
  );
}
