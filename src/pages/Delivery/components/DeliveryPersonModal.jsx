import { useEffect } from 'react';
import { useDeliveryStore } from '../../../stores/deliveryStore.js';

// ─── Tab Bar ─────────────────────────────────────────────────────────────────

function TabBar() {
  const modalTab      = useDeliveryStore((s) => s.modalTab);
  const setModalTab   = useDeliveryStore((s) => s.setModalTab);
  const modalPerson   = useDeliveryStore((s) => s.modalPerson);
  const modalCustomers = useDeliveryStore((s) => s.modalCustomers);
  const modalProjects  = useDeliveryStore((s) => s.modalProjects);
  const modalEngTeam   = useDeliveryStore((s) => s.modalEngTeam);

  const engCount = modalEngTeam.reduce((sum, proj) => sum + proj.members.length, 0);

  const tabs = [
    { key: 'customers',   label: 'Customers',        count: modalPerson?.customerCount ?? modalCustomers.length },
    { key: 'projects',    label: 'Projects',          count: modalPerson?.projectCount  ?? modalProjects.length  },
    { key: 'engineering', label: 'Engineering Team',  count: modalPerson?.headCount     ?? engCount              },
  ];

  return (
    <div className="flex border-b border-border px-5">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setModalTab(tab.key)}
          className={`flex items-center gap-2 px-4 py-[10px] text-[13px] transition-colors
            ${modalTab === tab.key
              ? 'border-b-2 border-[#E32200] text-[#E32200] font-semibold -mb-px'
              : 'text-text-muted hover:text-black'
            }`}
        >
          {tab.label}
          <span
            className="text-[12px] rounded-full px-2 py-0.5 font-medium"
            style={{ background: '#F59E0B', color: '#fff' }}
          >
            {tab.count}
          </span>
        </button>
      ))}
    </div>
  );
}

// ─── Customers Tab ────────────────────────────────────────────────────────────

function CustomersTab() {
  const customers = useDeliveryStore((s) => s.modalCustomers);

  if (!customers.length) {
    return <div className="py-12 text-center text-text-muted text-[13px]">No customers found.</div>;
  }

  return (
    <div className="overflow-auto custom-scrollbar">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="bg-[#F5F5F5]">
            {['Customer', 'Type', 'Project Count', 'Projects'].map((h) => (
              <th key={h} className="border border-border px-3 py-2 text-[14px] font-semibold text-black">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {customers.map((row) => (
            <tr key={row.id} className="border-b border-border">
              <td className="px-3 py-2 text-[13px] text-text-secondary">{row.customer}</td>
              <td className="px-3 py-2 text-[13px] text-text-secondary">{row.type}</td>
              <td className="px-3 py-2 text-[13px] text-text-secondary text-center">{row.projectCount}</td>
              <td className="px-3 py-2 text-[13px] text-text-secondary">
                {row.projects.length > 0 ? row.projects.join(', ') : '--'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Projects Tab ─────────────────────────────────────────────────────────────

function CoreTeamCell({ coreTeam }) {
  const roles = [
    { label: 'Technical Lead',          value: coreTeam.tl       },
    { label: 'Delivery Manager',        value: coreTeam.dm       },
    { label: 'Onsite Delivery Manager', value: coreTeam.onsiteDm },
    { label: 'Program Manager',         value: coreTeam.pgm      },
  ];
  return (
    <div className="flex flex-col gap-0.5">
      {roles.map((r) => (
        <div key={r.label} className="text-[12px]">
          <span className="text-text-muted">{r.label}: </span>
          <span className="text-black">{r.value || '--'}</span>
        </div>
      ))}
    </div>
  );
}

function ProjectsTab() {
  const projects     = useDeliveryStore((s) => s.modalProjects);
  const toBeStarted  = useDeliveryStore((s) => s.toBeStarted);
  const toggleToBeStarted = useDeliveryStore((s) => s.toggleToBeStarted);

  if (!projects.length) {
    return <div className="py-12 text-center text-text-muted text-[13px]">No projects found.</div>;
  }

  return (
    <div className="flex flex-col gap-0 h-full">
      {/* Toolbar */}
      <div className="flex justify-end px-3 py-2 border-b border-border">
        <label className="flex items-center gap-2 cursor-pointer text-[13px] text-text-secondary">
          <span>To be Started</span>
          <div
            onClick={toggleToBeStarted}
            className={`relative w-10 h-5 rounded-full transition-colors ${toBeStarted ? 'bg-brand-red' : 'bg-gray-300'}`}
          >
            <span
              className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                toBeStarted ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </div>
        </label>
      </div>

      <div className="overflow-auto custom-scrollbar flex-1">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-[#F5F5F5]">
              {['Project Name', 'Customer', 'Model', 'Start Date', 'End Date', 'Core Team'].map((h) => (
                <th key={h} className="border border-border px-3 py-2 text-[14px] font-semibold text-black whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {projects.map((row) => (
              <tr key={row.id} className="border-b border-border align-top">
                <td className="px-3 py-[10px] text-[13px] text-text-secondary">{row.projectName}</td>
                <td className="px-3 py-[10px] text-[13px] text-text-secondary whitespace-nowrap">{row.customer}</td>
                <td className="px-3 py-[10px] text-[13px] text-text-secondary text-center">{row.model}</td>
                <td className="px-3 py-[10px] text-[13px] text-text-secondary whitespace-nowrap">{row.startDate || '--'}</td>
                <td className="px-3 py-[10px] text-[13px] text-text-secondary whitespace-nowrap">{row.endDate || '--'}</td>
                <td className="px-3 py-[10px]"><CoreTeamCell coreTeam={row.coreTeam} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Engineering Team Tab ─────────────────────────────────────────────────────

function EngineeringTeamTab() {
  const engTeam = useDeliveryStore((s) => s.modalEngTeam);

  if (!engTeam.length) {
    return <div className="py-12 text-center text-text-muted text-[13px]">No engineering team data.</div>;
  }

  return (
    <div className="overflow-auto custom-scrollbar">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="bg-[#F5F5F5]">
            {['Project', 'Core Team', 'Name', 'Title', 'Role', 'Allocation %', 'Billing %'].map((h) => (
              <th key={h} className="border border-border px-3 py-2 text-[14px] font-semibold text-black whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {engTeam.map((proj) => {
            if (!proj.members.length) return null;
            return proj.members.map((member, idx) => (
              <tr key={member.id} className="border-b border-border align-top">
                {/* Project — rowspan */}
                {idx === 0 && (
                  <td
                    rowSpan={proj.members.length}
                    className="border border-border px-3 py-2 text-[13px] text-text-secondary align-top"
                    style={{ verticalAlign: 'top' }}
                  >
                    <div className="font-semibold text-black">{proj.projectName}</div>
                    <div className="text-[12px] text-text-muted">{proj.customer}</div>
                  </td>
                )}
                {/* Core Team — rowspan */}
                {idx === 0 && (
                  <td
                    rowSpan={proj.members.length}
                    className="border border-border px-3 py-2 align-top"
                    style={{ verticalAlign: 'top' }}
                  >
                    <CoreTeamCell coreTeam={proj.coreTeam} />
                  </td>
                )}
                <td className="border border-border px-3 py-2 text-[13px] text-text-secondary">{member.name}</td>
                <td className="border border-border px-3 py-2 text-[13px] text-text-secondary">{member.title}</td>
                <td className="border border-border px-3 py-2 text-[13px] text-text-secondary">{member.role}</td>
                <td className="border border-border px-3 py-2 text-right align-top">
                  <div className="text-[13px] text-black">{member.allocationPercent} %</div>
                  {member.durationStart && (
                    <div className="text-[11px] text-text-muted whitespace-nowrap">
                      {member.durationStart} – {member.durationEnd}
                    </div>
                  )}
                </td>
                <td className="border border-border px-3 py-2 text-[13px] text-text-secondary text-center">
                  {member.billingPercent} %
                </td>
              </tr>
            ));
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── Modal Root ───────────────────────────────────────────────────────────────

/**
 * DeliveryPersonModal — triggered by clicking any numeric cell in the delivery table.
 */
export function DeliveryPersonModal() {
  const modalOpen    = useDeliveryStore((s) => s.modalOpen);
  const modalPerson  = useDeliveryStore((s) => s.modalPerson);
  const modalTab     = useDeliveryStore((s) => s.modalTab);
  const modalLoading = useDeliveryStore((s) => s.modalLoading);
  const closeModal   = useDeliveryStore((s) => s.closeModal);

  // Close on Escape key
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') closeModal(); }
    if (modalOpen) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [modalOpen, closeModal]);

  if (!modalOpen) return null;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.45)' }}
      onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
    >
      {/* Modal container */}
      <div
        className="bg-white rounded-lg flex flex-col"
        style={{
          width: '90vw', maxWidth: 1200,
          height: '80vh',
          boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-border flex-shrink-0">
          <div>
            {modalPerson ? (
              <>
                <div className="text-[16px] font-bold text-black">{modalPerson.name}</div>
                <div className="text-[13px] text-text-muted italic mt-0.5">
                  ( {modalPerson.role} )
                </div>
              </>
            ) : (
              <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
            )}
          </div>
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-700 text-[22px] leading-none ml-4 mt-0.5"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        {/* Tab Bar */}
        <div className="flex-shrink-0">
          <TabBar />
        </div>

        {/* Tab Content */}
        <div className="flex-1 min-h-0 p-4 overflow-hidden flex flex-col">
          {modalLoading ? (
            <div className="flex flex-col gap-2 flex-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              {modalTab === 'customers'   && <CustomersTab />}
              {modalTab === 'projects'    && <ProjectsTab />}
              {modalTab === 'engineering' && <EngineeringTeamTab />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
