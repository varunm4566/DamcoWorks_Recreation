import { useState } from 'react';
import { postDeliveryThought, patchWorkStatus } from '../../../../api/projects.js';

function fmtDate(d) {
  if (!d) return '-';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}

function fmtDateTime(d) {
  if (!d) return '-';
  const dt = new Date(d);
  return dt.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) +
    ' ' + dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function getQualityBadge(quality) {
  if (!quality) return null;
  const map = {
    Healthy:   { bg: '#DCFFE3', color: '#1D6A36' },
    'At Risk': { bg: '#FFE0DD', color: '#C0392B' },
    Caution:   { bg: '#FFF6EA', color: '#9A5800' },
  };
  const style = map[quality] || { bg: '#F1F3F5', color: '#333' };
  return (
    <span
      className="inline-block rounded-full px-2 py-[2px] text-[11px] font-medium"
      style={{ backgroundColor: style.bg, color: style.color }}
    >
      {quality}
    </span>
  );
}

function InitialAvatar({ name }) {
  const initials = (name || 'U')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return (
    <div className="w-7 h-7 rounded-full bg-indigo-tab flex items-center justify-center flex-shrink-0">
      <span className="text-[10px] font-bold text-white">{initials}</span>
    </div>
  );
}

const SERVICE_QUALITY_OPTIONS = ['Healthy', 'Caution', 'At Risk'];

export function DeliveryThoughtsTab({ project, onProjectReload }) {
  const [workStatus, setWorkStatus] = useState(project.work_status || 'active');
  const [workStatusSaving, setWorkStatusSaving] = useState(false);

  const [serviceQuality, setServiceQuality] = useState('');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  const thoughts = project.delivery_thoughts || [];

  const wordCount = note.trim() ? note.trim().split(/\s+/).length : 0;

  async function handleWorkStatusChange(newStatus) {
    if (newStatus === workStatus || workStatusSaving) return;
    setWorkStatusSaving(true);
    try {
      await patchWorkStatus(project.id, newStatus);
      setWorkStatus(newStatus);
    } catch (err) {
      console.error(err);
    } finally {
      setWorkStatusSaving(false);
    }
  }

  async function handleSaveThought() {
    if (!note.trim()) return;
    setSaving(true);
    try {
      await postDeliveryThought(project.id, {
        note: note.trim(),
        author: 'You',
        service_quality: serviceQuality || null,
      });
      setNote('');
      setServiceQuality('');
      if (onProjectReload) onProjectReload();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">

      {/* Work Status toggle */}
      <div className="flex items-center gap-3">
        <span className="text-[13px] font-semibold text-black">Work Status:</span>
        <div className="flex rounded border border-border overflow-hidden text-[12px]">
          {['active', 'on-hold'].map((s) => (
            <button
              key={s}
              onClick={() => handleWorkStatusChange(s)}
              disabled={workStatusSaving}
              className={`px-4 py-1.5 font-medium transition-colors ${
                workStatus === s
                  ? s === 'active'
                    ? 'bg-[#37B24D] text-white'
                    : 'bg-[#E58715] text-white'
                  : 'bg-white text-text-muted hover:bg-gray-50'
              }`}
            >
              {s === 'active' ? 'Active' : 'On Hold'}
            </button>
          ))}
        </div>
      </div>

      {/* Post Thoughts form */}
      <section className="border border-border rounded-lg p-4">
        <h3 className="text-[14px] font-semibold text-black mb-3">Post Thoughts</h3>

        <div className="mb-3">
          <label className="text-[12px] text-text-muted block mb-1">Service Quality</label>
          <select
            value={serviceQuality}
            onChange={(e) => setServiceQuality(e.target.value)}
            className="w-full border border-border rounded px-3 py-2 text-[13px] text-black bg-white focus:outline-none focus:border-indigo-tab"
          >
            <option value="">-- Select --</option>
            {SERVICE_QUALITY_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <label className="text-[12px] text-text-muted">Thought / Note</label>
            <span className="text-[11px] text-text-muted">{wordCount} words</span>
          </div>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
            placeholder="Share your delivery update, risks, or observations..."
            className="w-full border border-border rounded px-3 py-2 text-[13px] text-black bg-white resize-none focus:outline-none focus:border-indigo-tab"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveThought}
            disabled={saving || !note.trim()}
            className="px-4 py-1.5 bg-indigo-tab text-white text-[12px] font-medium rounded hover:bg-indigo-600 disabled:opacity-50 transition-colors"
          >
            {saving ? 'Saving…' : 'Save Thought'}
          </button>
        </div>
      </section>

      {/* AI Summary */}
      {project.ai_summary && (
        <section className="border border-border rounded-lg overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 bg-white border-b border-border">
            <span className="text-brand-red text-[16px]">✦</span>
            <h3 className="text-[13px] font-semibold text-black">AI Summary</h3>
            {project.ai_attention_level && (
              <span
                className="ml-auto inline-block rounded-full px-2.5 py-[2px] text-[11px] font-medium"
                style={{
                  backgroundColor: project.ai_attention_level === 'Critical' ? '#FFE0DD' : project.ai_attention_level === 'High' ? '#FFF6EA' : '#DCFFE3',
                  color: project.ai_attention_level === 'Critical' ? '#C0392B' : project.ai_attention_level === 'High' ? '#9A5800' : '#1D6A36',
                }}
              >
                {project.ai_attention_level} Attention
              </span>
            )}
          </div>
          <div className="p-4">
            <p className="text-[13px] text-text-secondary leading-relaxed">{project.ai_summary}</p>
          </div>
        </section>
      )}

      {/* Thought Timeline */}
      <section>
        <h3 className="text-[14px] font-semibold text-black mb-3">
          Thought Timeline
          <span className="ml-2 text-[12px] font-normal text-text-muted">({thoughts.length} entries)</span>
        </h3>

        {thoughts.length === 0 ? (
          <div className="text-[13px] text-text-muted py-4">No delivery thoughts recorded yet.</div>
        ) : (
          <div className="space-y-3">
            {thoughts.map((thought) => (
              <div key={thought.id} className="flex gap-3">
                <InitialAvatar name={thought.author} />
                <div className="flex-1 border border-border rounded-lg p-3">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[13px] font-semibold text-black">{thought.author || 'System'}</span>
                      {thought.service_quality && getQualityBadge(thought.service_quality)}
                    </div>
                    <span className="text-[11px] text-text-muted whitespace-nowrap flex-shrink-0">
                      {fmtDateTime(thought.created_at)}
                    </span>
                  </div>
                  <p className="text-[13px] text-text-secondary leading-relaxed">{thought.note}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
