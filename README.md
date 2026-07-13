# SamaLang

A simple and high-performance programming language based on Lua with Samawa/Sumbawa cultural keywords.

📖 Docs: https://samalang.netlify.app/

## Install

### Linux / macOS (curl)

```bash
curl -fsSL https://raw.githubusercontent.com/Samawa-Language/samawa-language/main/install.sh | bash
```

### Windows (PowerShell)

```powershell
irm https://raw.githubusercontent.com/Samawa-Language/samawa-language/main/install.ps1 | iex
```

### npm

```bash
npm install -g samalang
```

### Build from source

```bash
git clone https://github.com/Samawa-Language/samawa-language.git
cd samawa-language
npm install
node build.js
```

## Usage

```bash
sl run main.sl          # Run a .sl file
sl transpile main.sl    # Transpile to Lua
sl watch main.sl        # Watch mode (re-run on changes)
sl --help               # Show help
```

## Example

```lua
-- hello.sl
ada name = "Samawa"
tulis("Halo, " .. name .. "!")
```

```bash
sl run hello.sl
```

## License

MIT
