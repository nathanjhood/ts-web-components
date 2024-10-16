import type Http = require('node:http');
import http = require('node:http');
import fs = require('node:fs');
import url = require('node:url');
import util = require('node:util');
import path = require('node:path');
import browsersList = require('browserslist');
import esbuild = require('esbuild');
import getClientEnv = require('./utils/getClientEnv');
import normalizePort = require('./utils/normalizePort');
import getPaths = require('./utils/getPaths');
import copyPublicFolder = require('./utils/copyPublicFolder');
import buildHtml = require('./utils/buildHtml');

if (require.main === module) {
  (async (proc: NodeJS.Process) => {
    const paths = getPaths(proc);
    const isEnvDevelopment: boolean = proc.env['NODE_ENV'] === 'development';
    const isEnvProduction: boolean = proc.env['NODE_ENV'] === 'production';
    const isEnvProductionProfile =
      isEnvProduction && proc.argv.includes('--profile');
    const supportedTargets = [
      'chrome',
      'deno',
      'edge',
      'firefox',
      'hermes',
      'ie',
      'ios',
      'node',
      'opera',
      'rhino',
      'safari',
    ];
    const shouldUseSourceMap = proc.env.GENERATE_SOURCEMAP !== 'false';
    const useTypeScript: boolean = fs.existsSync(paths.projectTsConfig);
    const wdsSocketPath = proc.env['WDS_SOCKET_PATH'] || '/esbuild';
    const wdsSocketHost =
      proc.env['WDS_SOCKET_HOST'] || 'window.location.hostname';
    copyPublicFolder({
      appBuild: paths.projectBuild,
      appHtml: paths.projectHtml,
      appPublic: paths.projectPublic,
    });

    // Start esbuild's server on a random local port
    const ctx = await esbuild
      .build({
        // ... your build options go here ...
        bundle: true,
        absWorkingDir: paths.projectPath,
        publicPath: paths.projectPublic,
        entryPoints: [paths.projectIndexJs],
        outbase: paths.projectSrc,
        outdir: paths.projectBuild,
        tsconfig: paths.projectTsConfig,
        format: 'esm',
        // platform: 'browser',
        target: browsersList(
          isEnvProduction
            ? ['>0.2%', 'not dead', 'not op_mini all']
            : [
                'last 1 chrome version',
                'last 1 firefox version',
                'last 1 safari version',
              ]
        )
          .filter((testTarget) => {
            const targetToTest = testTarget.split(' ')[0];
            if (targetToTest && supportedTargets.includes(targetToTest))
              return true;
            return false;
          })
          .map<string>((browser) => {
            return browser.replaceAll(' ', '');
          }),
        loader: {
          // 'file' loaders will be prepending by 'publicPath',
          // i.e., 'https://www.publicurl.com/icon.png'
          '.jsx': 'jsx',
          '.js': 'js',
          '.tsx': 'tsx',
          '.ts': 'ts',
          '.svg': 'base64',
          '.png': 'file',
          '.ico': 'file',
        },

        entryNames: 'static/[ext]/index',
        chunkNames: 'static/[ext]/[name].chunk',
        assetNames: 'static/media/[name]',
        splitting: isEnvDevelopment,
        // banner: {
        //   js:
        //     proc.env['FAST_REFRESH'] === 'false'
        //       ? ''
        //       : `new EventSource('${wdsSocketPath}').addEventListener('change', () => ${wdsSocketHost}.reload(),{once:true});`,
        // },
        banner: {
          js:
            proc.env['FAST_REFRESH'] === 'false'
              ? ''
              : `
const reload = () => window.location.reload();
const eventSource = new EventSource('/esbuild');
eventSource.addEventListener('change',reload,{once:true});`,
        }, // `new EventSource('/esbuild').addEventListener('change', () => window.location.reload(),{once:true});`
        treeShaking: isEnvProduction,
        minify: isEnvProduction,
        sourcemap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
        color: proc.stdout.isTTY,
        resolveExtensions: paths.moduleFileExtensions
          .map((ext) => `.${ext}`)
          .filter((ext) => useTypeScript || !ext.includes('ts')),
        define: {
          'process.env': JSON.stringify(
            getClientEnv(proc).stringified['process.env']
          ),
        },
        nodePaths: (proc.env['NODE_PATH'] || '')
          .split(path.delimiter)
          .filter((folder) => folder && !path.isAbsolute(folder))
          .map((folder) => path.resolve(paths.projectPath, folder)),
        //
        plugins: [
          (() => {
            return {
              name: 'env',
              setup(build) {
                // Intercept import paths called "env" so esbuild doesn't attempt
                // to map them to a file system location. Tag them with the "env-ns"
                // namespace to reserve them for this plugin.
                build.onResolve({ filter: /^env$/ }, (args) => ({
                  path: args.path,
                  namespace: 'env-ns',
                }));

                // Load paths tagged with the "env-ns" namespace and behave as if
                // they point to a JSON file containing the environment variables.
                build.onLoad({ filter: /.*/, namespace: 'env-ns' }, () => ({
                  contents: JSON.stringify(proc.env),
                  loader: 'json',
                }));
              },
            };
          })(),
        ],
      })
      .then(async (buildResult) => {
        await buildHtml(proc, {
          appHtml: paths.projectHtml,
          appBuild: paths.projectBuild,
        });
        return buildResult;
      })
      .catch((error) => {
        throw error;
      });
    return ctx;
  })(global.process);
}
