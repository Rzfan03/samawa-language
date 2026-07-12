import { syntax, sortedKeywords } from './syntax.js';

/**
 * Build a regex pattern for a keyword using word-boundary anchors.
 */
function buildPattern(keyword) {
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`\\b${escaped}\\b`, 'g');
}

// Pre-compile patterns for all keywords (excluding #)
const keywordEntries = sortedKeywords
  .filter((kw) => kw !== '#')
  .map((kw) => ({
    keyword: kw,
    lua: syntax[kw],
    regex: buildPattern(kw),
  }));

// Match double-quoted and single-quoted strings
const STRING_LITERAL = /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g;

/**
 * Check if a position falls inside any string literal range.
 */
function isInString(pos, stringRanges) {
  for (const [start, end] of stringRanges) {
    if (pos >= start && pos < end) return true;
  }
  return false;
}

/**
 * Transpile SamaLang source code to Lua.
 * Returns { code, lineMap } where lineMap maps Lua line numbers to original .sl lines.
 */
export function compile(source, filename = '<input>') {
  const lines = source.split('\n');
  const output = [];
  const lineMap = [];

  for (let i = 0; i < lines.length; i++) {
    const originalLine = lines[i];

    // Find string literal ranges to protect from replacement
    const stringRanges = [];
    let match;
    STRING_LITERAL.lastIndex = 0;
    while ((match = STRING_LITERAL.exec(originalLine)) !== null) {
      stringRanges.push([match.index, match.index + match[0].length]);
    }

    // Apply keyword replacements one at a time on the full line
    let luaLine = originalLine;
    for (const { keyword, lua, regex } of keywordEntries) {
      regex.lastIndex = 0;
      let newLine = '';
      let lastIdx = 0;

      for (const m of luaLine.matchAll(regex)) {
        if (isInString(m.index, stringRanges)) continue;
        newLine += luaLine.slice(lastIdx, m.index) + lua;
        lastIdx = m.index + m[0].length;
      }

      if (newLine !== '') {
        luaLine = newLine + luaLine.slice(lastIdx);
      }
    }

    // Handle # -> -- (only at start of meaningful content)
    if (luaLine.includes('#')) {
      const trimmed = luaLine.trimStart();
      if (trimmed.startsWith('#')) {
        const indent = luaLine.slice(0, luaLine.length - trimmed.length);
        luaLine = indent + '--' + trimmed.slice(1);
      }
    }

    output.push(luaLine);
    lineMap.push({ source: filename, originalLine: i + 1 });
  }

  return {
    code: output.join('\n'),
    lineMap,
  };
}
