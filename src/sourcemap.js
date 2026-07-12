/**
 * Format a Lua error message with original .sl file location.
 */
export function formatError(error, lineMap) {
  if (!error) return 'Unknown error';

  // Lua errors typically look like: "[string \"...\"]:N: message" or "file:N: message"
  const luaMatch = error.match(/^(.*?):(\d+):\s*(.*)/);
  if (luaMatch) {
    const [, , lineStr, message] = luaMatch;
    const luaLine = parseInt(lineStr, 10);

    if (lineMap && lineMap[luaLine - 1]) {
      const { source, originalLine } = lineMap[luaLine - 1];
      return `${source}:${originalLine}: ${message}`;
    }
  }

  return error;
}
