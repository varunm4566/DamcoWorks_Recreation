import { useState, useMemo } from 'react';

// ─── Derived "Parked" statuses (NOT a dropdown value) ────────────────────────
export const PARKED_DECISIONS = [
  'Project Identified/Yet to be started',
  'Extension Expected',
  'Internal Redeployment/Additional Support',
];

// ─── Actionable helper (shared logic) ────────────────────────────────────────
// Actionable = Employee type only, not parked/long leave/resigned/maternity
export function isActionable(r) {
  if (r.employeeType === 'Cons(T&M)') return false;
  if (r.hrDecision === 'Bench Resource') return false;
  if (r.hrDecision === 'Long Leave/Sabbatical') return false;
  if (r.hrDecision === 'Resigned') return false;
  if (r.remarks?.toLowerCase().includes('maternity')) return false;
  return true;
}

// ─── Shared card shell ────────────────────────────────────────────────────────
const CARD_BG = 'linear-gradient(135deg, #ffffff 60%, #f3f4f8 100%)';

function Card({ title, children, style = {} }) {
  return (
    <div style={{
      background: CARD_BG,
      border: '1px solid #e5e7eb',
      borderRadius: 8,
      padding: '16px',
      minHeight: 120,
      width: '100%',
      boxSizing: 'border-box',
      minWidth: 0,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      ...style,
    }}>
      <p style={{ fontSize: 12, fontWeight: 600, color: '#555', margin: 0, flexShrink: 0 }}>{title}</p>
      {children}
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const ACTIVE_PILL   = { border: '1.5px solid #1a56db', backgroundColor: 'rgba(26,86,219,0.07)', color: '#1a56db', borderRadius: 4, fontWeight: 600 };
const INACTIVE_PILL = { border: '1px solid #d0d0d0',   backgroundColor: '#f9fafb',               color: '#555',    borderRadius: 4, fontWeight: 400 };

function isActive(filterObj, cardFilter) {
  if (filterObj === null) return cardFilter === null;
  if (cardFilter === null) return false;
  return cardFilter.type === filterObj.type && cardFilter.value === filterObj.value;
}

function InfoTooltip({ text }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-block ml-0.5 align-middle">
      <button
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 12, height: 12, borderRadius: '50%', border: '1px solid #888', color: '#888', fontSize: 8, fontWeight: 700, background: 'none', cursor: 'default', lineHeight: 1 }}
      >i</button>
      {show && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 whitespace-nowrap z-50 pointer-events-none"
          style={{ backgroundColor: '#272b30', color: '#fff', fontSize: 10, borderRadius: 4 }}>
          {text}
        </span>
      )}
    </span>
  );
}

function Pill({ label, value, filterObj, cardFilter, onCardFilter, large }) {
  const active = isActive(filterObj, cardFilter);
  return (
    <button
      onClick={() => onCardFilter(active && filterObj !== null ? null : filterObj)}
      style={{
        ...(active ? ACTIVE_PILL : INACTIVE_PILL),
        padding: large ? '1px 8px' : '0px 6px',
        fontSize: large ? 11 : 10,
        display: 'inline-flex', alignItems: 'center', gap: 3,
        flexShrink: 0, whiteSpace: 'nowrap', transition: 'all 0.12s', cursor: 'pointer',
      }}
    >
      {label} <span style={{ fontWeight: 700 }}>{value}</span>
    </button>
  );
}

// ─── Card 1: Bench Composition ────────────────────────────────────────────────
function BenchCompositionCard({ data, cardFilter, onCardFilter }) {
  const counts = useMemo(() => {
    const total      = data.length;
    const employee   = data.filter(r => r.employeeType === 'Employee').length;
    const retainer   = data.filter(r => r.employeeType === 'Cons(Retainer)').length;
    const tnm        = data.filter(r => r.employeeType === 'Cons(T&M)').length;
    const maternity  = data.filter(r => r.remarks?.toLowerCase().includes('maternity')).length;
    const notice     = data.filter(r => r.hrDecision === 'Resigned').length;
    const parked     = data.filter(r => PARKED_DECISIONS.includes(r.hrDecision)).length;
    const longLeave  = data.filter(r => r.hrDecision === 'Long Leave/Sabbatical').length;
    return { total, employee, retainer, tnm, maternity, notice, parked, longLeave };
  }, [data]);

  const benchPills = [
    { label: 'Total Bench',     value: counts.total,    filterObj: null },
    { label: 'Employees',       value: counts.employee, filterObj: { type: 'employeeType', value: 'Employee',       label: 'Bench Composition: Employees' } },
    { label: 'Cons (Retainer)', value: counts.retainer, filterObj: { type: 'employeeType', value: 'Cons(Retainer)', label: 'Bench Composition: Cons (Retainer)' } },
    { label: 'Cons (T&M)',      value: counts.tnm,      filterObj: { type: 'employeeType', value: 'Cons(T&M)',      label: 'Bench Composition: Cons (T&M)' } },
  ];
  const naPills = [
    { label: 'Maternity',  value: counts.maternity, filterObj: { type: 'remarks',    value: 'Maternity',            label: 'Bench Composition: Maternity' } },
    { label: 'Notice',     value: counts.notice,    filterObj: { type: 'hrDecision', value: 'Resigned',             label: 'Bench Composition: Notice' } },
    { label: 'Parked',     value: counts.parked,    filterObj: { type: 'parked',     value: true,                   label: 'Bench Composition: Parked' } },
    { label: 'Long Leave', value: counts.longLeave, filterObj: { type: 'hrDecision', value: 'Long Leave/Sabbatical',label: 'Bench Composition: Long Leave' } },
  ];

  return (
    <Card title="Bench Composition">
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'nowrap' }}>
        {benchPills.map((p) => (
          <Pill key={p.label} label={p.label} value={p.value}
            filterObj={p.filterObj} cardFilter={cardFilter} onCardFilter={onCardFilter} large />
        ))}
      </div>
      <div style={{ marginTop: 'auto' }}>
        <p style={{ fontSize: 9, color: '#999', fontStyle: 'italic', marginBottom: 3 }}>Non-Actionable (Included Above)</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
          {naPills.map((p) => (
            <Pill key={p.label} label={p.label} value={p.value}
              filterObj={p.filterObj} cardFilter={cardFilter} onCardFilter={onCardFilter} large />
          ))}
        </div>
      </div>
    </Card>
  );
}

// ─── Card 2: Financial Impact ─────────────────────────────────────────────────
const ACTIONABLE_FILTER = { type: 'actionable', value: true, label: 'Financial Impact: Actionable Bench' };

function MetricBox({ color, label, value, tooltip, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'stretch',
        gap: 0,
        padding: 0,
        borderRadius: 6,
        border: active ? `1.5px solid ${color}` : '1px solid transparent',
        backgroundColor: active ? `${color}11` : 'transparent',
        cursor: 'pointer',
        transition: 'all 0.12s',
        textAlign: 'left',
        overflow: 'hidden',
      }}
    >
      <div style={{ width: 3, flexShrink: 0, backgroundColor: color, borderRadius: '25px 0 0 25px' }} />
      <div style={{ padding: '4px 8px' }}>
        <p style={{ fontSize: 10, color: '#555', lineHeight: 1.3 }}>
          {label}
          {tooltip && <InfoTooltip text={tooltip} />}
        </p>
        <p style={{ fontSize: 18, fontWeight: 700, color, lineHeight: 1.1, marginTop: 2 }}>{value}</p>
      </div>
    </button>
  );
}

function FinancialImpactCard({ data, cardFilter, onCardFilter }) {
  const { actionableCount, projectedCost } = useMemo(() => {
    // Actionable = Employee (not consultant), not parked/long leave/resigned/maternity
    const actionable = data.filter(r => r.employeeType === 'Employee' && isActionable(r));
    const cost = actionable.reduce((sum, r) => sum + (Number(r.monthlyCTC) || 0), 0);
    return { actionableCount: actionable.length, projectedCost: cost };
  }, [data]);

  const costLabel = projectedCost >= 100000
    ? `₹${(projectedCost / 100000).toFixed(1)}L`
    : `₹${(projectedCost / 1000).toFixed(1)}K`;

  const actionableActive = isActive(ACTIONABLE_FILTER, cardFilter);
  return (
    <Card title="Financial Impact">
      <div style={{ display: 'flex', gap: 6, flex: 1 }}>
        <MetricBox
          color="#1a79cb"
          label="Actionable Bench"
          value={String(actionableCount)}
          tooltip="Employees only — excl. Parked, Cons(T&M), Maternity, Notice, Long Leave"
          active={actionableActive}
          onClick={() => onCardFilter(actionableActive ? null : ACTIONABLE_FILTER)}
        />
        <MetricBox
          color="#7f1d1d"
          label="Projected Monthly Bench Cost"
          value={costLabel}
          tooltip="Actionable employees only"
          active={false}
          onClick={() => {}}
        />
      </div>
    </Card>
  );
}

// ─── Card 3: Current Bench Aging ──────────────────────────────────────────────
const AGING_COLORS = { '0-30': '#059669', '31-60': '#d97706', '61-90': '#dc2626', '>90': '#7f1d1d' };

function BenchAgingCard({ data, cardFilter, onCardFilter }) {
  const brackets = useMemo(() => {
    // Aging only for actionable bench
    const actionable = data.filter(isActionable);
    return [
      { label: '0-30 Days',  fv: '0-30',  count: actionable.filter(r => r.benchDays <= 30).length },
      { label: '31-60 Days', fv: '31-60', count: actionable.filter(r => r.benchDays >= 31 && r.benchDays <= 60).length },
      { label: '61-90 Days', fv: '61-90', count: actionable.filter(r => r.benchDays >= 61 && r.benchDays <= 90).length },
      { label: '>90 Days',   fv: '>90',   count: actionable.filter(r => r.benchDays > 90).length },
    ];
  }, [data]);

  return (
    <Card title="Current Bench Aging">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px 8px', flex: 1 }}>
        {brackets.map((b) => {
          const filterObj = { type: 'aging', value: b.fv, label: `Bench Aging: ${b.label}` };
          const active    = isActive(filterObj, cardFilter);
          return (
            <button
              key={b.label}
              onClick={() => onCardFilter(active ? null : filterObj)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, textAlign: 'left',
                padding: '3px 6px', borderRadius: 5,
                border: active ? '1.5px solid #1a56db' : '1px solid #e5e7eb',
                backgroundColor: active ? 'rgba(26,86,219,0.06)' : '#fafafa',
                cursor: 'pointer', transition: 'all 0.12s',
              }}
            >
              <span style={{ fontSize: 16, fontWeight: 700, color: AGING_COLORS[b.fv], lineHeight: 1, minWidth: 24 }}>
                {b.count}
              </span>
              <span style={{ fontSize: 10, color: '#555', lineHeight: 1.2 }}>{b.label}</span>
            </button>
          );
        })}
      </div>
    </Card>
  );
}

// ─── Card 4: Forecast ─────────────────────────────────────────────────────────
function ForecastCard({ futureBenchCount, onOpenFutureBench }) {
  return (
    <Card title="Forecast">
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: 10, color: '#555', margin: 0 }}>Future Bench</p>
          <button
            onClick={onOpenFutureBench}
            style={{ fontSize: 22, fontWeight: 700, color: '#4d5156', display: 'block', marginTop: 4, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            className="hover:underline"
          >{futureBenchCount}</button>
        </div>
        <button
          onClick={onOpenFutureBench}
          style={{ fontSize: 10, color: '#1a79cb', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left' }}
          className="hover:underline"
        >Next 30 Days →</button>
      </div>
    </Card>
  );
}

// ─── SummaryCards ─────────────────────────────────────────────────────────────
export function SummaryCards({ data = [], futureBenchCount = 0, cardFilter, onCardFilter, onOpenFutureBench }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 16,
      padding: '8px',
      width: '100%',
      boxSizing: 'border-box',
      backgroundColor: '#f7f8fc',
      flexShrink: 0,
    }}>
      <BenchCompositionCard data={data} cardFilter={cardFilter} onCardFilter={onCardFilter} />
      <FinancialImpactCard  data={data} cardFilter={cardFilter} onCardFilter={onCardFilter} />
      <BenchAgingCard       data={data} cardFilter={cardFilter} onCardFilter={onCardFilter} />
      <ForecastCard futureBenchCount={futureBenchCount} onOpenFutureBench={onOpenFutureBench} />
    </div>
  );
}
