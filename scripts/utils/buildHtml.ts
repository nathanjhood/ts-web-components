import fs = require('node:fs');
import path = require('node:path');

const buildHtml = (
  proc: NodeJS.Process,
  options: { appHtml: string; appBuild: string }
): void => {
  let html = fs.readFileSync(options.appHtml, { encoding: 'utf8' });

  Object.keys(proc.env).forEach((key) => {
    const escapeStringRegexp = (str: string) => {
      return str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d');
    };
    const value = proc.env[key];
    const htmlsrc = new RegExp('%' + escapeStringRegexp(key) + '%', 'g');

    if (value) {
      html = html.replaceAll(htmlsrc, value);
    }
  });

  return fs.writeFileSync(path.resolve(options.appBuild, 'index.html'), html);
};

export = buildHtml;
