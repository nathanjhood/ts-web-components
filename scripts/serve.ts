import type ESBuild = require('esbuild');
import esbuild = require('esbuild');

const serve = (proc: NodeJS.Process): void => {};

((proc: NodeJS.Process) => {
  serve(proc);
})(global.process);
