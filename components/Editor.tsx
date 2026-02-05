
import React from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  onRun: () => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ value, onChange, onRun }) => {
  return (
    <div className="h-full relative group">
      <Editor
        height="100%"
        defaultLanguage="python"
        theme="vs-dark"
        value={value}
        onChange={onChange}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          padding: { top: 16 },
          fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
          fontLigatures: true,
          cursorSmoothCaretAnimation: "on",
          smoothScrolling: true,
          roundedSelection: true,
        }}
      />
      <div className="absolute bottom-4 right-8 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 px-3 py-1 rounded-full text-[10px] text-gray-400 pointer-events-none uppercase tracking-wider">
          Python 3.11 (Pyodide)
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
