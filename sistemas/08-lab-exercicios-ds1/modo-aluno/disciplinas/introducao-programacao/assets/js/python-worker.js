let pyodidePromise = null;
let pendingInputResolve = null;

async function getPyodide() {
  if (!pyodidePromise) {
    importScripts("https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.js");
    pyodidePromise = loadPyodide();
  }
  return pyodidePromise;
}

self.requestTerminalInput = promptText => new Promise(resolve => {
  pendingInputResolve = resolve;
  self.postMessage({ type: "input-request", prompt: String(promptText || "") });
});

self.onmessage = async event => {
  const data = event.data || {};
  if (data.type === "stdin-response") {
    if (pendingInputResolve) {
      const resolve = pendingInputResolve;
      pendingInputResolve = null;
      resolve(String(data.value ?? ""));
    }
    return;
  }
  if (data.type !== "run") return;

  const { code = "", inputs = [], fileName = "main.py" } = data;
  pendingInputResolve = null;

  try {
    self.postMessage({ type: "status", text: "Carregando o interpretador Python..." });
    const pyodide = await getPyodide();
    pyodide.setStdout({ batched: text => self.postMessage({ type: "stdout", text }) });
    pyodide.setStderr({ batched: text => self.postMessage({ type: "stderr", text }) });

    let interactive = false;
    try {
      interactive = Boolean(await pyodide.runPythonAsync("from pyodide.ffi import can_run_sync\ncan_run_sync()"));
    } catch {
      interactive = false;
    }
    self.postMessage({ type: "capability", interactive });

    if (interactive) {
      await pyodide.runPythonAsync(`
from pyodide.ffi import run_sync
from js import requestTerminalInput
import builtins

def __ds_terminal_input(prompt=""):
    return str(run_sync(requestTerminalInput(str(prompt))))

builtins.input = __ds_terminal_input
`);
    } else {
      let inputIndex = 0;
      const prepared = Array.isArray(inputs) ? inputs.map(value => String(value ?? "")) : [];
      pyodide.setStdin({ stdin: () => {
        const value = String(prepared[inputIndex++] ?? "");
        self.postMessage({ type: "stdin", text: value, prepared: true });
        return value;
      }});
    }

    await pyodide.runPythonAsync(code, { filename: fileName });
    self.postMessage({ type: "done", success: true });
  } catch (error) {
    self.postMessage({ type: "done", success: false, error: String(error?.stack || error?.message || error) });
  } finally {
    pendingInputResolve = null;
  }
};
