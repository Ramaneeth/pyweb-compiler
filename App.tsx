
import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import CodeEditor from './components/Editor';
import Terminal from './components/Terminal';
import { initPyodide, runCode } from './services/pyodideService';
import { explainError, suggestOptimizations } from './services/geminiService';
import { ConsoleOutput } from './types';

const App: React.FC = () => {
  const [code, setCode] = useState<string>("print('Welcome to PyWeb Compiler!')\n\n# Try writing some Python here\nfor i in range(5):\n    print(f'Iteration {i + 1}')");
  const [outputs, setOutputs] = useState<ConsoleOutput[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // Initialize Pyodide on mount
  useEffect(() => {
    const setup = async () => {
      try {
        await initPyodide(
          (msg) => setOutputs(prev => [...prev, { type: 'stdout', content: msg, timestamp: new Date() }]),
          (msg) => setOutputs(prev => [...prev, { type: 'stderr', content: msg, timestamp: new Date() }])
        );
        setOutputs([{ type: 'system', content: 'Python 3.11 Environment Loaded Successfully.', timestamp: new Date() }]);
      } catch (err) {
        console.error("Pyodide Init Error:", err);
        setOutputs([{ type: 'stderr', content: 'Failed to initialize Python engine. Please refresh.', timestamp: new Date() }]);
      } finally {
        setIsLoading(false);
      }
    };
    setup();
  }, []);

  const handleRun = async () => {
    if (isRunning || isLoading) return;
    
    setIsRunning(true);
    setAiAnalysis(null);
    setOutputs(prev => [...prev, { type: 'system', content: `--- Running Script at ${new Date().toLocaleTimeString()} ---`, timestamp: new Date() }]);

    try {
      const result = await runCode(code);
      if (result !== undefined) {
        setOutputs(prev => [...prev, { type: 'stdout', content: String(result), timestamp: new Date() }]);
      }
    } catch (err: any) {
      setOutputs(prev => [...prev, { type: 'stderr', content: err.message || String(err), timestamp: new Date() }]);
    } finally {
      setIsRunning(false);
    }
  };

  const handleExplainError = async () => {
    const lastError = [...outputs].reverse().find(o => o.type === 'stderr');
    if (!lastError) return;

    setIsAiLoading(true);
    const analysis = await explainError(code, lastError.content);
    setAiAnalysis(analysis);
    setIsAiLoading(false);
  };

  const handleOptimize = async () => {
    setIsAiLoading(true);
    const analysis = await suggestOptimizations(code);
    setAiAnalysis(analysis);
    setIsAiLoading(false);
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#0d1117] text-white">
        <div className="relative w-24 h-24 mb-6">
          <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h1 className="text-2xl font-bold mb-2">Initializing Python Engine</h1>
        <p className="text-gray-500 animate-pulse">Downloading WebAssembly modules...</p>
      </div>
    );
  }

  const hasError = outputs.some(o => o.type === 'stderr');

  return (
    <div className="flex h-screen bg-[#0d1117]">
      <Sidebar onSelectSnippet={(c) => setCode(c)} />
      
      <main className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="h-14 border-b border-gray-700 bg-[#161b22] flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={handleRun}
              disabled={isRunning}
              className={`flex items-center gap-2 px-5 py-1.5 rounded-md font-semibold transition-all ${
                isRunning 
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-900/20'
              }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              {isRunning ? 'Running...' : 'Run Code'}
            </button>
            <div className="h-6 w-px bg-gray-700"></div>
            <button
              onClick={handleOptimize}
              disabled={isAiLoading}
              className="text-xs text-gray-400 hover:text-blue-400 flex items-center gap-1.5 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Optimize with AI
            </button>
            {hasError && (
              <button
                onClick={handleExplainError}
                disabled={isAiLoading}
                className="text-xs text-gray-400 hover:text-red-400 flex items-center gap-1.5 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Explain Error
              </button>
            )}
          </div>
          
          <div className="text-xs text-gray-500 font-mono">
            Pyodide v0.26.4
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Editor and Terminal Split */}
          <div className="flex-1 flex flex-col relative min-w-0">
            <div className="flex-1 min-h-[40%]">
              <CodeEditor 
                value={code} 
                onChange={(v) => setCode(v || '')} 
                onRun={handleRun}
              />
            </div>
            <div className="h-1/3 min-h-[200px]">
              <Terminal 
                outputs={outputs} 
                onClear={() => setOutputs([])} 
              />
            </div>
          </div>

          {/* AI Panel (Collapsible) */}
          {(aiAnalysis || isAiLoading) && (
            <div className="w-80 bg-[#0d1117] border-l border-gray-700 flex flex-col shrink-0 animate-in slide-in-from-right duration-300">
              <div className="p-4 border-b border-gray-700 bg-[#161b22] flex justify-between items-center">
                <span className="text-sm font-bold text-blue-400 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM13.536 14.95a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zM16.243 17.657l-.707-.707a1 1 0 011.414-1.414l.707.707a1 1 0 01-1.414 1.414z" />
                  </svg>
                  Gemini Insight
                </span>
                <button 
                  onClick={() => setAiAnalysis(null)}
                  className="text-gray-500 hover:text-white"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 prose prose-invert prose-sm">
                {isAiLoading ? (
                  <div className="flex flex-col items-center justify-center h-40 space-y-4">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 text-xs text-center">AI is analyzing your code context...</p>
                  </div>
                ) : (
                  <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {aiAnalysis}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
