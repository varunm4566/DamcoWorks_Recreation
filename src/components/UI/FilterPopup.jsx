import { useState } from 'react';

/**
 * Column filter dropdown - white bg, bordered, Apply/Cancel buttons
 */
export function FilterPopup({ type, onApply, onCancel, columnName }) {
  const [textValue, setTextValue] = useState('');
  const [numericType, setNumericType] = useState('');
  const [numericValue, setNumericValue] = useState('');
  const [numericMin, setNumericMin] = useState('');
  const [numericMax, setNumericMax] = useState('');
  const [booleanValue, setBooleanValue] = useState('');
  const [statusValue, setStatusValue] = useState('');

  const handleApply = () => {
    if (type === 'text') {
      if (textValue.trim()) onApply(textValue.trim());
    } else if (type === 'numeric') {
      if (numericType === 'range' && numericMin && numericMax) {
        onApply({ type: 'range', min: numericMin, max: numericMax });
      } else if (numericType === 'gt' && numericValue) {
        onApply({ type: 'gt', value: numericValue });
      } else if (numericType === 'lt' && numericValue) {
        onApply({ type: 'lt', value: numericValue });
      }
    } else if (type === 'boolean') {
      if (booleanValue) onApply(booleanValue);
    } else if (type === 'status') {
      if (statusValue) onApply(statusValue);
    }
  };

  const inputClass = 'w-full border border-border rounded px-2 py-1.5 text-[13px] text-text-secondary focus:outline-none focus:border-brand-red';

  return (
    <div className="absolute top-full left-0 mt-1 bg-white border border-border rounded shadow-lg p-3 z-40 min-w-[200px]">
      {type === 'text' && (
        <input type="text" value={textValue} onChange={(e) => setTextValue(e.target.value)} placeholder="Type to filter..." className={inputClass} autoFocus />
      )}

      {type === 'numeric' && (
        <div className="space-y-2">
          <select value={numericType} onChange={(e) => setNumericType(e.target.value)} className={inputClass}>
            <option value="">--Select--</option>
            <option value="range">Range</option>
            <option value="gt">Greater Than</option>
            <option value="lt">Less Than</option>
          </select>
          {numericType === 'range' && (
            <div className="flex gap-2">
              <input type="number" value={numericMin} onChange={(e) => setNumericMin(e.target.value)} placeholder="Min" className={inputClass} />
              <input type="number" value={numericMax} onChange={(e) => setNumericMax(e.target.value)} placeholder="Max" className={inputClass} />
            </div>
          )}
          {(numericType === 'gt' || numericType === 'lt') && (
            <input type="number" value={numericValue} onChange={(e) => setNumericValue(e.target.value)} placeholder="Value" className={inputClass} />
          )}
        </div>
      )}

      {type === 'boolean' && (
        <select value={booleanValue} onChange={(e) => setBooleanValue(e.target.value)} className={inputClass}>
          <option value="">--Select--</option>
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
      )}

      {type === 'status' && (
        <select value={statusValue} onChange={(e) => setStatusValue(e.target.value)} className={inputClass}>
          <option value="">--Select--</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="prospect">Prospect</option>
        </select>
      )}

      <div className="flex gap-2 mt-3">
        <button onClick={onCancel} className="flex-1 bg-white text-text-secondary text-[13px] py-1.5 rounded border border-border hover:bg-gray-50">
          Cancel
        </button>
        <button onClick={handleApply} className="flex-1 bg-brand-red text-white text-[13px] py-1.5 rounded hover:opacity-90">
          Apply
        </button>
      </div>
    </div>
  );
}
