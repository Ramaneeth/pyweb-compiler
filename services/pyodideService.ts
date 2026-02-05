
import { PyodideInstance } from '../types';

let pyodide: PyodideInstance | null = null;

export const initPyodide = async (
  onStdout: (msg: string) => void,
  onStderr: (msg: string) => void
): Promise<PyodideInstance> => {
  if (pyodide) return pyodide;

  pyodide = await window.loadPyodide({
    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/"
  });

  pyodide.setStdout({
    batched: (msg) => onStdout(msg)
  });
  
  pyodide.setStderr({
    batched: (msg) => onStderr(msg)
  });

  return pyodide;
};

export const runCode = async (code: string): Promise<any> => {
  if (!pyodide) throw new Error("Pyodide not initialized");
  
  try {
    // We wrap code to capture the last expression's value if possible
    // and handle potential multi-line blocks correctly.
    const result = await pyodide.runPythonAsync(code);
    return result;
  } catch (err: any) {
    throw err;
  }
};

export const installPackage = async (pkg: string): Promise<void> => {
  if (!pyodide) throw new Error("Pyodide not initialized");
  await pyodide.loadPackage(pkg);
};
