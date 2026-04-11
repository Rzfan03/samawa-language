<img src="./icon-extension.png" height=48 width=48>

# SamawaLang
 a simple and high-performance programming language based on lua

## Features

* **Lua Powered:** Inherits the speed and lightweight nature of the Lua VM.
* **Localized Syntax:** Native Samawa keywords for a personalized coding experience.
* **VS Code Support:** Official extension available with syntax highlighting and snippets.
* **Fast Execution:** Optimized for performance and simplicity.

## Syntax Mapping

| Samawa Keyword | Lua Equivalent | Description |
| :--- | :--- | :--- |
| `ada` | `local` | Variable declaration |
| `lamen` | `if` | Conditional statement |
| `tres` | `then` | Logic trigger |
| `jure_mo` | `end` | Block terminator |
| `fungsi` | `function` | Function definition |
| `tulis` | `print` | Console output |
| `selama` | `while` | Loop statement |
| `semalik` | `return` | Function return |
| `nda_isi` | `nil` | Null value |

## Code Example

```samawa
ada pesan = "Halo Dunia"

fungsi cek_status(n)
    lamen (n > 5) tres
        tulis(pesan)
    lamen_no
        tulis("Angka rendah")
    jure_mo
jure_mo

cek_status(10)