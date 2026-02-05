
import React, { useEffect, useRef } from 'react';
import { ConsoleOutput } from '../types';

interface TerminalProps {
  outputs: ConsoleOutput[];
  onClear: () => void;
}

const Terminal: React.FC<TerminalProps> = ({ outputs, onClear }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [outputs]);

  return (
    <div className="flex flex-col h-full bg-[#0d1117] text-gray-300 font-mono text-sm border-t border-gray-700">
      <div className="flex justify-between items-center px-4 py-2 bg-[#161b22] border-b border-gray-800">
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Console Output
        </span>
        <button 
          onClick={onClear}
          className="text-xs hover:text-white transition-colors bg-gray-800 px-2 py-1 rounded"
        >
          Clear
        </button>
      </div>
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-1"
      >
        {outputs.length === 0 ? (
          <div className="text-gray-600 italic">Program output will appear here...</div>
        ) : (
          outputs.map((out, i) => (
            <div key={i} className={`whitespace-pre-wrap ${
              out.type === 'stderr' ? 'text-red-400' : 
              out.type === 'system' ? 'text-blue-400 font-bold' : 
              'text-gray-200'
            }`}>
              {out.content}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Terminal;
