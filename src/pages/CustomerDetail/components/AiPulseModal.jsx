import { useState } from 'react';
import { useCustomerDetailStore } from '../../../stores/customerDetailStore.js';

/** Sentiment tag pill */
function SentimentTag({ sentiment }) {
  const colorMap = {
    'holding steady for now': 'bg-amber-50 text-amber-700 border border-amber-200',
    'progress on the right track': 'bg-green-50 text-green-700 border border-green-200',
    'things are looking good': 'bg-green-50 text-green-700 border border-green-200',
  };
  const cls = colorMap[(sentiment || '').toLowerCase()] || 'bg-gray-100 text-text-secondary border border-gray-200';
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-[12px] font-medium ${cls}`}>
      {sentiment}
    </span>
  );
}

/**
 * Project Pulse by AI modal — two tabs: AI Pulse | Delivery Thoughts.
 */
export function AiPulseModal({ customerId }) {
  const project  = useCustomerDetailStore((s) => s.aiPulseModal);
  const thoughts = useCustomerDetailStore((s) => s.aiPulseThoughts);
  const loading  = useCustomerDetailStore((s) => s.aiPulseThoughtsLoading);
  const close    = useCustomerDetailStore((s) => s.closeAiPulseModal);

  const [activeTab, setActiveTab] = useState('pulse');

  if (!project) return null;

  const actions = Array.isArray(project.ai_pulse_actions) ? project.ai_pulse_actions : [];

  const formatDate = (ts) => {
    if (!ts) return '';
    const d = new Date(ts);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (ts) => {
    if (!ts) return '';
    return new Date(ts).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={close}>
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
          <div>
            <div className="font-semibold text-[14px] text-text-primary">{project.name}</div>
            <div className="text-[11px] text-text-muted mt-0.5">
              {project.client_name || ''} | {project.engagement_model || 'T&M'}
            </div>
          </div>
          <button onClick={close} className="text-text-muted hover:text-text-primary" aria-label="Close">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border flex-shrink-0">
          {[
            { key: 'pulse', label: 'Project Pulse by AI' },
            { key: 'thoughts', label: 'Delivery Thoughts' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2.5 text-[12px] font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-brand-red text-brand-red'
                  : 'border-transparent text-text-muted hover:text-text-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'pulse' && (
            <div className="p-5 space-y-4">
              {/* AI Highlights card */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[13px] font-semibold text-purple-800">AI Highlights</span>
                  <button className="text-[11px] text-brand-red border border-brand-red px-2.5 py-1 rounded hover:bg-red-50 transition-colors">
                    Re-evaluate
                  </button>
                </div>

                {/* Sentiment tag */}
                {project.ai_pulse_sentiment && (
                  <div className="mb-3">
                    <SentimentTag sentiment={project.ai_pulse_sentiment} />
                  </div>
                )}

                {/* Summary */}
                <p className="text-[12px] text-purple-900 leading-relaxed">
                  {project.ai_pulse_summary || project.ai_highlights || 'No AI summary available.'}
                </p>
              </div>

              {/* Immediate actions */}
              {actions.length > 0 && (
                <div>
                  <div className="text-[12px] font-semibold text-text-primary mb-2">
                    Some Immediate actions suggested by AI:
                  </div>
                  <ul className="space-y-1.5">
                    {actions.map((action, idx) => (
                      <li key={idx} className="flex gap-2 text-[12px] text-text-secondary">
                        <span className="text-brand-red font-bold mt-0.5 flex-shrink-0">•</span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === 'thoughts' && (
            <div className="p-5">
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse space-y-1.5">
                      <div className="h-3 bg-gray-200 rounded w-1/4" />
                      <div className="h-3 bg-gray-200 rounded w-full" />
                      <div className="h-3 bg-gray-200 rounded w-3/4" />
                    </div>
                  ))}
                </div>
              ) : thoughts.length === 0 ? (
                <div className="text-center py-8 text-text-muted text-[13px]">
                  No delivery thoughts recorded yet.
                </div>
              ) : (
                <div className="space-y-5">
                  {thoughts.map((thought) => (
                    <div key={thought.id}>
                      <div className="text-[11px] font-semibold text-text-muted mb-1">
                        {formatDate(thought.created_at)}
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[12px] font-medium text-text-primary">
                            {thought.author}
                            <span className="text-text-muted font-normal"> (PM Thoughts)</span>
                          </span>
                          <span className="text-[11px] text-text-muted">{formatTime(thought.created_at)}</span>
                        </div>
                        <p className="text-[12px] text-text-secondary leading-relaxed">{thought.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
