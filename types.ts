
export interface ConsoleOutput {
  type: 'stdout' | 'stderr' | 'system';
  content: string;
  timestamp: Date;
}

export interface PyodideInstance {
  runPython: (code: string) => any;
  runPythonAsync: (code: string) => Promise<any>;
  setStdout: (options: { batched: (msg: string) => void }) => void;
  setStderr: (options: { batched: (msg: string) => void }) => void;
  loadPackage: (packages: string | string[]) => Promise<void>;
  globals: any;
}

declare global {
  interface Window {
    loadPyodide: (options: { indexURL: string }) => Promise<PyodideInstance>;
  }
}
