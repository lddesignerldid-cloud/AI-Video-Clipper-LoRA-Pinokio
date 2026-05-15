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
    {
      when: "{{gpu === 'nvidia' && platform === 'win32'}}",
      method: "shell.run",
      params: {
        venv: "env",
        path: "app",
        message: [
          "uv pip install https://github.com/cyberbol/AI-Video-Clipper-LoRA/releases/download/v5.0-deps/llama_cpp_python-0.3.26+cu128-cp310-cp310-win_amd64.whl"
        ]
      }
    },
    // llama-cpp-python for others
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
