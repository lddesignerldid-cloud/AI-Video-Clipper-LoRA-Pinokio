// repair.js — Fix Vision Engine (llama-cpp-python) crash
//
// Fixes: OSError WinError 0xc000001d (STATUS_ILLEGAL_INSTRUCTION)
// Cause: The default llama-cpp-python CPU-only or abetlen cu128 build silently
//        installs a binary that triggers ILLEGAL_INSTRUCTION on RTX 50-series
//        (Blackwell) hardware during llama_init_from_model.
// Fix:   Replace with JamePeng's prebuilt wheel which includes full CUDA
//        kernels and compute 12.0 (Blackwell) support.

module.exports = {
  run: [
    {
      method: "log",
      params: {
        text: "🔧 Repairing Vision Engine (llama-cpp-python)..."
      }
    },
    // Windows + NVIDIA: install the Blackwell-compatible CUDA wheel
    {
      when: "{{gpu === 'nvidia' && platform === 'win32'}}",
      method: "shell.run",
      params: {
        venv: "env",
        path: "app",
        message: [
          "uv pip install https://github.com/JamePeng/llama-cpp-python/releases/download/v0.3.40-cu128-win-20260608/llama_cpp_python-0.3.40+cu128-cp310-cp310-win_amd64.whl"
        ]
      }
    },
    // Non-Windows or non-NVIDIA: install standard CPU build
    {
      when: "{{!(gpu === 'nvidia' && platform === 'win32')}}",
      method: "shell.run",
      params: {
        venv: "env",
        path: "app",
        message: [
          "uv pip install llama-cpp-python"
        ]
      }
    },
    {
      method: "log",
      params: {
        text: "✅ Repair complete! Restart the app to apply the fix."
      }
    },
    {
      method: "notify",
      params: {
        html: "✅ Vision Engine repaired! Click <b>Start</b> to relaunch the app."
      }
    }
  ]
}
