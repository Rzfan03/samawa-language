import chokidar from 'chokidar';

/**
 * Watch .sl files for changes and recompile.
 */
export function watchFile(filePath, compileFn) {
  console.log(`Watching for changes: ${filePath}`);
  console.log('Press Ctrl+C to stop.\n');

  const watcher = chokidar.watch(filePath, {
    persistent: true,
    awaitWriteFinish: {
      stabilityThreshold: 200,
      pollInterval: 100,
    },
  });

  watcher.on('change', (path) => {
    const time = new Date().toLocaleTimeString();
    console.log(`[${time}] File changed: ${path}`);
    compileFn(path);
  });

  watcher.on('error', (error) => {
    console.error('Watcher error:', error);
  });

  return watcher;
}
