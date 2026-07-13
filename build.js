#!/usr/bin/env node

/**
 * Build standalone binaries for SamaLang using Node.js SEA.
 *
 * Prerequisites:
 *   npm install -g esbuild
 *
 * Usage:
 *   node build.js                          Build for current platform
 *   node build.js --target sl-linux-x64    Build with specific target name
 */

import { execSync } from 'node:child_process';
import { writeFileSync, mkdirSync, copyFileSync, chmodSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, 'dist');
const BUNDLE = join(DIST, 'bundled.cjs');
const SEA_CONFIG = join(DIST, 'sea-config.json');
const BLOB = join(DIST, 'sl.blob');

function step(msg) {
  console.log(`\x1b[36m▸\x1b[0m ${msg}`);
}

function success(msg) {
  console.log(`\x1b[32m✓\x1b[0m ${msg}`);
}

function error(msg) {
  console.error(`\x1b[31m✗\x1b[0m ${msg}`);
  process.exit(1);
}

function buildBundle() {
  step('Bundling with esbuild...');
  mkdirSync(DIST, { recursive: true });
  execSync(
    `npx esbuild src/cli.js --bundle --platform=node --outfile="${BUNDLE}" --format=cjs`,
    { stdio: 'pipe' }
  );
  success('Bundle created');
}

function buildSEA() {
  const platform = process.platform;
  const arch = process.arch;
  const ext = platform === 'win32' ? '.exe' : '';
  const targetIdx = process.argv.indexOf('--target');
  const binaryName = targetIdx !== -1
    ? process.argv[targetIdx + 1]
    : `sl-${platform}-${arch}${ext}`;
  const binaryPath = join(DIST, binaryName);

  // Step 1: Generate SEA blob
  step('Generating SEA blob...');
  const seaConfig = {
    main: BUNDLE,
    output: BLOB,
  };
  writeFileSync(SEA_CONFIG, JSON.stringify(seaConfig, null, 2));
  execSync(`node --experimental-sea-config "${SEA_CONFIG}"`, { stdio: 'pipe' });
  success('SEA blob created');

  // Step 2: Copy Node.js binary
  step('Copying Node.js binary...');
  copyFileSync(process.execPath, binaryPath);
  chmodSync(binaryPath, 0o755);

  // Step 3: Remove code signature (macOS)
  if (platform === 'darwin') {
    try {
      execSync(`codesign --remove-signature "${binaryPath}"`, { stdio: 'pipe' });
      success('Removed macOS code signature');
    } catch {
      // Ignore if codesign is not available
    }
  }

  // Step 4: Inject SEA blob into binary
  step('Injecting SEA blob...');
  try {
    // Try postject first (official tool)
    execSync(
      `npx postject "${binaryPath}" NODE_SEA_BLOB "${BLOB}" --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2`,
      { stdio: 'pipe' }
    );
  } catch {
    // Fallback: use npx @yao-pkg/pkg in SEA mode
    try {
      execSync(`npx pkg --sea "${binaryPath}"`, { stdio: 'pipe' });
    } catch {
      error('Failed to inject SEA blob. Install postject: npm install -g postject');
    }
  }

  // Step 5: Re-sign (macOS)
  if (platform === 'darwin') {
    try {
      execSync(`codesign --sign - "${binaryPath}"`, { stdio: 'pipe' });
      success('Re-signed binary');
    } catch {
      // Ignore
    }
  }

  const size = (execSync(`wc -c < "${binaryPath}"`).toString().trim() / 1024 / 1024).toFixed(1);
  success(`${binaryName} (${size} MB)`);
  success(`Binary: ${binaryPath}`);
}

// Main
console.log('\x1b[1mSamaLang Compiler — Build Standalone Binary\x1b[0m\n');

buildBundle();
buildSEA();

success('\nDone!');
