import { useState } from 'react';

/**
 * Hover tooltip bubble that wraps children
 * @param {{ text: string, children: React.ReactNode }} props
 */
export function Tooltip({ text, children }) {
  const [show, setShow] = useState(false);

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none">
          <div className="bg-gray-800 text-white text-xs rounded-lg px-3 py-2 max-w-xs whitespace-normal shadow-lg">
            {text}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800" />
          </div>
        </div>
      )}
    </div>
  );
}
