import { useState, useEffect } from 'react';
import { fetchProjectTeam } from '../../../../api/projects.js';
import { DetailPagination } from './shared/DetailPagination.jsx';

function fmtDate(d) {
  if (!d) return '-';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}

function RoleCard({ label, value }) {
  return (
    <div className="border border-border rounded p-3 min-w-0">
      <div className="text-[11px] text-text-muted">{label}</div>
      <div className="text-[13px] font-semibold text-black mt-1 truncate">{value || '-'}</div>
    </div>
  );
}

export function PeopleTab({ project }) {
  const [rows, setRows] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const pageSize = 5;

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    fetchProjectTeam(project.id, { page, pageSize })
      .then((data) => { if (!cancelled) { setRows(data.rows); setTotalCount(data.totalCount); } })
      .catch(console.error)
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, [project.id, page]);

  return (
    <div className="space-y-6">

      {/* Core Team */}
      <section>
        <h3 className="text-[15px] font-semibold text-black mb-3">Core Team</h3>
        <div className="grid grid-cols-3 gap-4">
          {/* Delivery Owner */}
          <div className="border border-border rounded-lg p-4">
            <div className="text-[12px] font-semibold text-text-muted mb-3">Delivery Owner</div>
            <div className="space-y-3">
              <RoleCard label="Delivery Manager" value={project.dm_name || project.pdm_name} />
              <RoleCard label="Onsite DM" value={project.onsite_dm_name} />
            </div>
          </div>
          {/* Client Relation */}
          <div className="border border-border rounded-lg p-4">
            <div className="text-[12px] font-semibold text-text-muted mb-3">Client Relation</div>
            <div className="space-y-3">
              <RoleCard label="Program Manager" value={project.program_manager} />
              <RoleCard label="Client Partner" value={project.client_partner} />
              <RoleCard label="Sales Manager" value={project.sm_name} />
            </div>
          </div>
          {/* Leadership */}
          <div className="border border-border rounded-lg p-4">
            <div className="text-[12px] font-semibold text-text-muted mb-3">Leadership</div>
            <div className="space-y-3">
              <RoleCard label="Project Lead" value={project.project_lead} />
              <RoleCard label="Tech Lead" value={project.tech_lead} />
            </div>
          </div>
        </div>
      </section>

      {/* Engineering Team */}
      <section>
        <h3 className="text-[15px] font-semibold text-black mb-1">Engineering Team</h3>
        <div className="flex items-center gap-3 text-[13px] text-text-secondary mb-3">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
            </svg>
            Headcount: <strong>{project.headcount ?? '-'}</strong>
          </span>
          <span className="text-gray-300">|</span>
          <span>FTE by Allocation: <strong>{project.fte ? parseFloat(project.fte).toFixed(1) : '-'} FTE</strong></span>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {[1,2,3].map((i) => <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />)}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded border border-border">
              <table className="w-full text-[12px]">
                <thead className="bg-table-header">
                  <tr>
                    <th className="text-left px-3 py-2.5 text-[12px] font-semibold text-text-muted">People</th>
                    <th className="text-left px-3 py-2.5 text-[12px] font-semibold text-text-muted">Contribution</th>
                    <th className="text-left px-3 py-2.5 text-[12px] font-semibold text-text-muted">SOW Role</th>
                    <th className="text-left px-3 py-2.5 text-[12px] font-semibold text-text-muted">Allocation</th>
                    <th className="text-left px-3 py-2.5 text-[12px] font-semibold text-text-muted">Billing</th>
                    <th className="text-left px-3 py-2.5 text-[12px] font-semibold text-text-muted">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-6 text-[12px] text-text-muted">No team members found.</td>
                    </tr>
                  ) : (
                    rows.map((member, idx) => {
                      const skills = typeof member.skills === 'string' ? JSON.parse(member.skills) : (member.skills || []);
                      return (
                        <tr key={member.id} className={idx % 2 === 1 ? 'bg-row-even' : 'bg-white'}>
                          <td className="px-3 py-2.5">
                            <div className="font-semibold text-black text-[13px]">{member.name}</div>
                            {member.employee_id && <div className="text-[11px] text-text-muted">{member.employee_id} {member.role_title}</div>}
                            {skills.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {skills.map((s, i) => (
                                  <span key={i} className="inline-block border border-[#DDDDDD] rounded px-1.5 py-0.5 text-[10px] text-black">{s}</span>
                                ))}
                              </div>
                            )}
                          </td>
                          <td className="px-3 py-2.5 text-text-secondary">{member.contribution || '-'}</td>
                          <td className="px-3 py-2.5 text-text-secondary">{member.sow_role || '-'}</td>
                          <td className="px-3 py-2.5 text-text-secondary">{member.allocation_percent != null ? `${member.allocation_percent}%` : '-'}</td>
                          <td className="px-3 py-2.5 text-text-secondary">{member.billing_percent != null ? `${member.billing_percent}%` : '-'}</td>
                          <td className="px-3 py-2.5 text-text-secondary whitespace-nowrap">
                            {fmtDate(member.duration_start)} - {fmtDate(member.duration_end)}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            {totalCount > 0 && (
              <DetailPagination page={page} pageSize={pageSize} totalCount={totalCount} onPageChange={setPage} />
            )}
          </>
        )}
      </section>

    </div>
  );
}
