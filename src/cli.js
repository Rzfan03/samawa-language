import { readFileSync, writeFileSync, existsSync, unlinkSync } from 'node:fs';
import { resolve, extname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { execSync } from 'node:child_process';
import { compile } from './compiler.js';
import { formatError } from './sourcemap.js';

const VERSION = '2.0.0';

const HELP = `
SamaLang Compiler v${VERSION}

Usage:
  sl <file.sl>                  Transpile and execute
  sl <file.sl> --output <file>  Transpile to Lua file
  sl <file.sl> --only-transpile Print transpiled Lua to stdout
  sl <file.sl> --watch          Watch file and recompile on changes
  sl --help                     Show this help
  sl --version                  Show version

Examples:
  sl program.sl                 Run program.sl
  sl program.sl --output out.lua  Save transpiled Lua to out.lua
  sl program.sl --watch         Auto-recompile on file changes
`;

export function parseArgs(argv) {
  const args = argv.slice(2);
  const flags = {
    file: null,
    output: null,
    onlyTranspile: false,
    watch: false,
    help: false,
    version: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--help' || arg === '-h') {
      flags.help = true;
    } else if (arg === '--version' || arg === '-v') {
      flags.version = true;
    } else if (arg === '--output' || arg === '-o') {
      flags.output = args[++i] || null;
    } else if (arg === '--only-transpile' || arg === '-t') {
      flags.onlyTranspile = true;
    } else if (arg === '--watch' || arg === '-w') {
      flags.watch = true;
    } else if (!arg.startsWith('-')) {
      flags.file = arg;
    }
  }

  return flags;
}

function executeTranspiled(code, lineMap) {
  try {
    execSync('lua -v', { stdio: 'pipe' });
  } catch {
    console.error('Error: Lua is not installed or not in PATH.');
    console.error('Install Lua: https://www.lua.org/download.html');
    process.exit(1);
  }

  const tmpFile = join(tmpdir(), `sl_${Date.now()}.lua`);
  try {
    writeFileSync(tmpFile, code, 'utf-8');
    execSync(`lua "${tmpFile}"`, { stdio: 'inherit' });
  } catch (err) {
    const luaErr = err.stderr?.toString() || err.message;
    console.error(formatError(luaErr, lineMap));
    process.exit(1);
  } finally {
    try { unlinkSync(tmpFile); } catch {}
  }
}

function compileAndRun(file, flags) {
  const source = readFileSync(file, 'utf-8');
  const { code, lineMap } = compile(source, file);

  if (flags.onlyTranspile) {
    process.stdout.write(code + '\n');
    return;
  }

  if (flags.output) {
    const outputPath = resolve(flags.output);
    writeFileSync(outputPath, code, 'utf-8');
    console.log(`Transpiled to ${outputPath}`);
    return;
  }

  executeTranspiled(code, lineMap);
}

export async function run(argv) {
  const flags = parseArgs(argv);

  if (flags.help) {
    console.log(HELP);
    process.exit(0);
  }

  if (flags.version) {
    console.log(`SamaLang Compiler v${VERSION}`);
    process.exit(0);
  }

  if (!flags.file) {
    console.error('Error: No input file specified.');
    console.error('Run "sl --help" for usage information.');
    process.exit(1);
  }

  const filePath = resolve(flags.file);

  if (!existsSync(filePath)) {
    console.error(`Error: File '${flags.file}' not found!`);
    process.exit(1);
  }

  if (extname(filePath) !== '.sl') {
    console.error(`Warning: File does not have .sl extension: ${flags.file}`);
  }

  if (flags.watch) {
    const { watchFile } = await import('./watcher.js');
    compileAndRun(filePath, flags);
    watchFile(filePath, (changedPath) => compileAndRun(changedPath, flags));
  } else {
    compileAndRun(filePath, flags);
  }
}
