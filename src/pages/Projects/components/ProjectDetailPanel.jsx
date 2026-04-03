import { useState, useEffect } from 'react';
import { useProjectStore } from '../../../stores/projectStore.js';
import { OverviewTab } from './detail/OverviewTab.jsx';
import { PeopleTab } from './detail/PeopleTab.jsx';
import { OverallHealthTab } from './detail/OverallHealthTab.jsx';
import { DeliveryHealthTab } from './detail/DeliveryHealthTab.jsx';
import { DeliveryThoughtsTab } from './detail/DeliveryThoughtsTab.jsx';
import { FinancialsTab } from './detail/FinancialsTab.jsx';
import { CsatTab } from './detail/CsatTab.jsx';
import { MilestoneHealthTab } from './detail/MilestoneHealthTab.jsx';
import { TimelineContractsTab } from './detail/TimelineContractsTab.jsx';
import { QualityTab } from './detail/QualityTab.jsx';

const TABS = [
  { key: 'overview',   label: 'Overview & Insights' },
  { key: 'people',     label: 'People & Ownership',  badge: 'team_member_count' },
  { key: 'health',     label: 'Overall Health' },
  { key: 'delivery',   label: 'Delivery Health' },
  { key: 'thoughts',   label: 'Delivery Thoughts' },
  { key: 'financials', label: 'Financials' },
  { key: 'csat',       label: 'CSAT' },
  { key: 'milestone',  label: 'Milestone Health' },
  { key: 'timeline',   label: 'Timeline & Contract' },
  { key: 'quality',    label: 'Quality' },
];

/**
 * Right-side fly-in detail panel with 10 navigation tabs.
 * Width: 65% of viewport.
 */
export function ProjectDetailPanel() {
  const isOpen = useProjectStore((s) => s.isDetailOpen);
  const project = useProjectStore((s) => s.selectedProject);
  const initialTab = useProjectStore((s) => s.initialTab);
  const closeProjectDetail = useProjectStore((s) => s.closeProjectDetail);
  const openProjectDetail = useProjectStore((s) => s.openProjectDetail);

  const [activeTab, setActiveTab] = useState('overview');

  // Jump to the requested tab whenever a project is opened (or re-opened on a different tab)
  useEffect(() => {
    if (project) setActiveTab(initialTab || 'overview');
  }, [project?.id, initialTab]);

  if (!isOpen || !project) return null;

  const tags = typeof project.tags === 'string' ? JSON.parse(project.tags) : (project.tags || []);

  function handleProjectReload() {
    if (project?.id) openProjectDetail(project.id);
  }

  function renderTabContent() {
    switch (activeTab) {
      case 'overview':   return <OverviewTab project={project} tags={tags} />;
      case 'people':     return <PeopleTab project={project} />;
      case 'health':     return <OverallHealthTab project={project} />;
      case 'delivery':   return <DeliveryHealthTab project={project} />;
      case 'thoughts':   return <DeliveryThoughtsTab project={project} onProjectReload={handleProjectReload} />;
      case 'financials': return <FinancialsTab project={project} />;
      case 'csat':       return <CsatTab project={project} />;
      case 'milestone':  return <MilestoneHealthTab project={project} />;
      case 'timeline':   return <TimelineContractsTab project={project} />;
      case 'quality':    return <QualityTab project={project} />;
      default:           return null;
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30" onClick={closeProjectDetail} />

      {/* Panel */}
      <div className="relative bg-white w-[65vw] h-full shadow-xl flex flex-col">

        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-border flex-shrink-0">
          <div className="flex-1 min-w-0 pr-4">
            <h2 className="text-[17px] font-bold text-black truncate">{project.name}</h2>
            <p className="text-[13px] text-text-muted mt-0.5">{project.client_name}</p>
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              {project.project_type && (
                <span className="inline-block border border-[#DDDDDD] rounded-[5px] px-[5px] py-[2px] text-[11.2px] text-black">
                  {project.project_type}
                </span>
              )}
              {project.engagement_model && (
                <span className="inline-block border border-[#DDDDDD] rounded-[5px] px-[5px] py-[2px] text-[11.2px] text-black">
                  {project.engagement_model}
                </span>
              )}
              {project.division && (
                <span className="inline-block border border-[#DDDDDD] rounded-[5px] px-[5px] py-[2px] text-[11.2px] text-black">
                  {project.division}
                </span>
              )}
              <span
                className="inline-block rounded-full px-2 py-[2px] text-[11.2px] font-medium"
                style={{
                  backgroundColor: project.status === 'active' ? '#DCFFE3' : '#FFE0DD',
                  color: '#000',
                }}
              >
                {project.status}
              </span>
            </div>
          </div>
          <button
            onClick={closeProjectDetail}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none mt-0.5 flex-shrink-0"
            aria-label="Close panel"
          >
            &times;
          </button>
        </div>

        {/* Tab navigation — horizontally scrollable */}
        <div className="flex-shrink-0 border-b border-border overflow-x-auto">
          <div className="flex min-w-max">
            {TABS.map((tab) => {
              const badgeVal = tab.badge ? project[tab.badge] : null;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-1.5 px-4 py-3 text-[13px] whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.key
                      ? 'border-indigo-tab text-indigo-tab font-semibold bg-indigo-tab-bg'
                      : 'border-transparent text-text-muted hover:bg-gray-50 hover:text-black'
                  }`}
                >
                  {tab.label}
                  {badgeVal != null && parseInt(badgeVal, 10) > 0 && (
                    <span
                      className={`inline-block rounded-full px-1.5 py-[1px] text-[10px] font-semibold leading-none ${
                        activeTab === tab.key ? 'bg-indigo-tab text-white' : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {badgeVal}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-5">
          {renderTabContent()}
        </div>

      </div>
    </div>
  );
}
