module.exports = {
  run: [
    // Pull latest launcher scripts
    {
      method: "shell.run",
      params: {
        message: "git pull"
      }
    },
    // Pull latest app code
    {
      method: "shell.run",
      params: {
        path: "app",
        message: "git pull"
      }
    },
    // Re-apply correct llama-cpp-python wheel for Windows NVIDIA (Blackwell fix).
    // The default abetlen cu128 index silently falls back to a broken CPU-only build
    // on RTX 50-series (Blackwell) hardware, causing STATUS_ILLEGAL_INSTRUCTION (0xc000001d).
    // JamePeng wheel includes full CUDA kernels with compute 12.0 support.
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
    }
  ]
}

