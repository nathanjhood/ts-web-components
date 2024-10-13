import fs = require('node:fs');
import path = require('node:path');

import getPublicUrlOrPath = require('./getPublicUrlOrPath');

const getPaths = (proc: NodeJS.Process) => {
  // Make sure any symlinks in the project folder are resolved:
  // https://github.com/facebook/create-react-project/issues/637
  const projectDirectory: string = fs.realpathSync(proc.cwd());

  //
  const resolveProjectFile: (relativePath: string) => string = (
    relativePath: string
  ) => path.format(path.parse(path.resolve(projectDirectory, relativePath)));
  //

  // We use `PUBLIC_URL` environment variable or "homepage" field to infer
  // "public path" at which the project is served.
  // webpack needs to know it to put the right <script> hrefs into HTML even in
  // single-page projects that may serve index.html for nested URLs like /todos/42.
  // We can't use a relative path in HTML because we don't want to load something
  // like /todos/42/static/js/bundle.7289d.js. We have to know the root.
  const publicUrlOrPath: string = getPublicUrlOrPath({
    isEnvDevelopment: proc.env['NODE_ENV'] === 'development',
    homepage: require(resolveProjectFile('package.json')).homepage,
    envPublicUrl: proc.env['PUBLIC_URL'],
  });

  const buildDir: string = proc.env['BUILD_DIR'] || 'dist';

  const moduleFileExtensions: string[] = ['mjs', 'mts', 'js', 'ts', 'json'];

  // Resolve file paths in the same order as webpack
  const resolveModule: (
    resolveFn: (path: string) => string,
    filePath: string
  ) => string = (resolveFn: (path: string) => string, filePath: string) => {
    const extension = moduleFileExtensions.find((extension) =>
      fs.existsSync(resolveFn(`${filePath}.${extension}`))
    );

    if (extension) {
      return resolveFn(`${filePath}.${extension}`);
    }

    return resolveFn(`${filePath}.js`);
  };

  return {
    dotenv: resolveProjectFile('.env'),
    projectPath: resolveProjectFile('.'),
    projectBuild: resolveProjectFile(buildDir),
    projectPublic: resolveProjectFile('public'),
    projectHtml: resolveProjectFile('public/index.html'),
    projectIndexJs: resolveModule(resolveProjectFile, 'src/index'),
    projectPackageJson: resolveProjectFile('package.json'),
    projectSrc: resolveProjectFile('src'),
    projectTsConfig: resolveProjectFile('tsconfig.json'),
    projectJsConfig: resolveProjectFile('jsconfig.json'),
    yarnLockFile: resolveProjectFile('yarn.lock'),
    testsSetup: resolveModule(resolveProjectFile, 'src/setupTests'),
    proxySetup: resolveModule(resolveProjectFile, 'src/setupProxy'),
    projectNodeModules: resolveProjectFile('node_modules'),
    projectWebpackCache: resolveProjectFile('node_modules/.cache'),
    projectTsBuildInfoFile: resolveProjectFile('.tsbuildinfo'),
    swSrc: resolveModule(resolveProjectFile, 'src/service-worker'),
    publicUrlOrPath,
    moduleFileExtensions,
  };
};

export = getPaths;
