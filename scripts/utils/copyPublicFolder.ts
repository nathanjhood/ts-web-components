import fs = require('node:fs');

/**
 *
 * @param paths
 * @returns {void}
 */
const copyPublicFolder: (paths: {
  appPublic: string;
  appBuild: string;
  appHtml: string;
}) => void = (paths: {
  appPublic: string;
  appBuild: string;
  appHtml: string;
}): void => {
  return fs.cpSync(paths.appPublic, paths.appBuild, {
    dereference: true,
    recursive: true,
    filter: (file) => file !== paths.appHtml,
  });
};

export = copyPublicFolder;
