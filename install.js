module.exports = {
  run: [
    {
      method: "shell.run",
      params: {
        message: [
          "git clone https://github.com/cyberbol/AI-Video-Clipper-LoRA.git app",
        ]
      },
      when: "{{!exists('app')}}"
    },
    {
      method: "shell.run",
      params: {
        venv: "env",
        path: "app",
        message: [
          "uv pip install \"git+https://github.com/m-bain/whisperX.git@6ec4a020489d904c4f2cd1ed097674232d2692d4\" --no-deps",
          "uv pip install \"ctranslate2<4.7.0\"",
          "uv pip install librosa devicetorch",
          "uv pip install -r pyproject.toml --extra-index-url https://download.pytorch.org/whl/cu128"
        ]
      }
    },
    {
      method: "script.start",
      params: {
        uri: "torch.js",
        params: {
          venv: "env",
          path: "app"
        }
      }
    },
    // llama-cpp-python for windows nvidia
    // Uses JamePeng prebuilt wheel with full CUDA kernels.
    // The default abetlen/llama-cpp-python cu128 index silently falls back to a broken CPU-only build
    // on RTX 50-series (Blackwell) hardware, causing a STATUS_ILLEGAL_INSTRUCTION crash on llama_init_from_model.
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
    // llama-cpp-python for others
    {
      comment: "Install basic CPU version if NOT a Windows NVIDIA system",
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
      method: "fs.write",
      params: {
        path: "app/.streamlit/config.toml",
        content: "[browser]\ngatherUsageStats = false\n\n[server]\nheadless = true\nmaxUploadSize = 4096"
      }
    },
    {
      method: "fs.write",
      params: {
        path: "app/.streamlit/credentials.toml",
        content: "[general]\nemail = \"\""
      }
    }
  ]
}
