import type Http = require('node:http');
import http = require('node:http');
import fs = require('node:fs');
import url = require('node:url');
import util = require('node:util');
import path = require('node:path');
import browsersList = require('browserslist');
import esbuild = require('esbuild');
import normalizePort = require('./utils/normalizePort');
import getPaths = require('./utils/getPaths');
import copyPublicFolder = require('./utils/copyPublicFolder');
import buildHtml = require('./utils/buildHtml');

const serve = async (
  proc: NodeJS.Process,
  proxy: { host: string; port: string }
) => {
  // SHUTDOWN

  /**
   * Shut down server
   */
  const shutdown = (): void => {
    server.close(handleServerClosedEvent);
  };
  /**
   * Quit properly on docker stop
   */
  const handleSigterm: NodeJS.SignalsListener = (signal: NodeJS.Signals) => {
    fs.writeSync(
      proc.stderr.fd,
      util.format('\n' + 'Got', signal, '- Gracefully shutting down...', '\n'),
      null,
      'utf-8'
    );
    shutdown();
  };
  /**
   * Quit on ctrl-c when running docker in terminal
   */
  const handleSigint: NodeJS.SignalsListener = (signal: NodeJS.Signals) => {
    fs.writeSync(
      proc.stderr.fd,
      util.format('\n' + 'Got', signal, '- Gracefully shutting down...', '\n'),
      null,
      'utf-8'
    );
    shutdown();
  };

  const handleBeforeExit: NodeJS.BeforeExitListener = (code: number) => {
    fs.writeSync(
      proc.stdout.fd,
      util.format('Process exiting with code', code, '\n'),
      null,
      'utf-8'
    );
    shutdown();
  };

  const handleExit: NodeJS.ExitListener = (code: number) => {
    fs.writeSync(
      proc.stdout.fd,
      util.format('Process exited with code', code, '\n'),
      null,
      'utf-8'
    );
    // shutdown();
  };

  proc.on('beforeExit', handleBeforeExit);
  proc.on('exit', handleExit);
  proc.on('SIGTERM', handleSigterm);
  proc.on('SIGINT', handleSigint);

  const warnings: Error[] = [];
  const errors: Error[] = [];

  if (proc.env['NODE_ENV'] === undefined) {
    const e = new Error(
      "'NODE_ENV' should be set to one of: 'developent', 'production', or 'test'; but, it was 'undefined'"
    );
    // warnings.push(e);
    throw e;
  }

  // CONSOLE

  const console = global.console;

  // PATHS

  const paths = getPaths(proc);

  // ENV

  const isNotLocalTestEnv =
    proc.env['NODE_ENV'] !== 'test' && `${paths.dotenv}.local`;

  // https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use
  const dotenvFiles: string[] = [];

  dotenvFiles.push(`${paths.dotenv}.${proc.env['NODE_ENV']}.local`);
  dotenvFiles.push(`${paths.dotenv}.${proc.env['NODE_ENV']}`);
  if (isNotLocalTestEnv) dotenvFiles.push(`${paths.dotenv}.local`);
  dotenvFiles.push(paths.dotenv);
  dotenvFiles.forEach((dotenvFile) => {
    if (fs.existsSync(dotenvFile.toString())) {
      proc.loadEnvFile(dotenvFile); // throws internally, or changes 'proc.env'
      //
    } else {
      const error = new Error("no '.env' file found");
      errors.push(error);
    }
  });

  // SERVER

  const hostname = proc.env['HOST'] || '127.0.0.1';
  const port = normalizePort(proc.env['PORT'] || '3000').toString();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleServerClosedEvent = (...args: any[]) => {
    if (args) {
      if (typeof args === typeof Error) {
        args.forEach((err) => console.error(err));
      }
      // proc.exit(1);
      process.exitCode = 1;
    }
    // proc.exit(0);
    process.exitCode = 0;
  };

  /**
   * Event listener for HTTP server "error" event.
   */
  const handleServerErrorEvent = (error: any) => {
    if (error.syscall !== 'listen') {
      throw error;
    }

    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES': {
        console.error(bind + ' requires elevated privileges');
        break;
      }
      case 'EADDRINUSE': {
        console.error(bind + ' is already in use');
        break;
      }
      default: {
        throw error;
      }
    }
    proc.exit(1);
  };

  const handleServerRequestEvent: Http.RequestListener<
    typeof Http.IncomingMessage,
    typeof Http.ServerResponse
  > = (request, response) => {
    const date = new Date();
    console.log(date.toISOString(), request.method, request.url);

    const options = {
      hostname: proxy.host,
      port: proxy.port,
      path: request.url,
      method: request.method,
      headers: request.headers,
    };
    // Forward each incoming request to esbuild
    const proxyRequest = http.request(options, (proxyResponse) => {
      // If esbuild returns "not found", send a custom 404 page
      if (proxyResponse.statusCode === 404) {
        response.writeHead(404, { 'Content-Type': 'text/html' });
        response.end('<h1>A custom 404 page</h1>');
        return;
      }

      // Otherwise, forward the response from esbuild to the client
      response.writeHead(
        proxyResponse.statusCode || 500,
        proxyResponse.headers
      );
      proxyResponse.pipe(response, { end: true });
    });

    // Forward the body of the request to esbuild
    request.pipe(proxyRequest, { end: true });
  };

  const handleServerListenEvent = (): void => {
    const address = new url.URL(`http://${hostname}:${port}`);
    console.log();
    console.log(
      util.styleText('white', 'Server running at'),
      util.styleText('yellow', address.href)
    );
    console.log(
      util.styleText('white', 'To exit:'),
      util.styleText('yellow', 'Ctrl + c')
    );
    console.log();
  };

  const server: Http.Server<
    typeof Http.IncomingMessage,
    typeof Http.ServerResponse
  > = http.createServer();

  server.on('listening', handleServerListenEvent);
  server.on('error', handleServerErrorEvent);
  server.on('request', handleServerRequestEvent);
  server.on('close', handleServerClosedEvent);

  server.listen(parseInt(port, 10), hostname);
};

if (require.main === module) {
  (async (proc: NodeJS.Process) => {
    const paths = getPaths(proc);

    const getClientEnvironment = (proc: NodeJS.Process) => {
      const NODE: RegExp = /^NODE_/i;
      const envDefaults: {
        NODE_ENV: 'development' | 'test' | 'production';
        PUBLIC_URL: string;
        WDS_SOCKET_HOST: string | undefined;
        WDS_SOCKET_PATH: string | undefined;
        WDS_SOCKET_PORT: string | undefined;
        FAST_REFRESH: 'true' | 'false';
      } = {
        NODE_ENV: proc.env.NODE_ENV || 'development',
        PUBLIC_URL: proc.env.PUBLIC_URL || '/', // 'publicUrl',
        WDS_SOCKET_HOST: proc.env.WDS_SOCKET_HOST || undefined, // window.location.hostname,
        WDS_SOCKET_PATH: proc.env.WDS_SOCKET_PATH || undefined, // '/esbuild',
        WDS_SOCKET_PORT: proc.env.WDS_SOCKET_PORT || undefined, // window.location.port,
        FAST_REFRESH: proc.env.FAST_REFRESH || 'false', // !== 'false',
        // HTTPS: HTTPS !== "false",
        // HOST: HOST ? HOST : "0.0.0.0",
        // PORT: PORT ? parseInt(PORT) : 3000
      };
      const raw: NodeJS.ProcessEnv = Object.keys(proc.env)
        .filter((key) => NODE.test(key))
        .reduce<NodeJS.ProcessEnv>((env, key) => {
          env[key] = proc.env[key];
          return env;
        }, envDefaults);
      const stringified: {
        'process.env': NodeJS.ProcessEnv;
      } = {
        'process.env': Object.keys(raw)
          .filter((key) => NODE.test(key))
          .reduce<NodeJS.ProcessEnv>((env, key) => {
            env[key] = JSON.stringify(raw[key]);
            return env;
          }, raw),
      };

      return {
        raw,
        stringified,
      };
    };
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
    const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
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
    const ctx = await esbuild.context({
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
        '.svg': 'file',
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
          getClientEnvironment(proc).stringified['process.env']
        ),
      },
      nodePaths: (proc.env['NODE_PATH'] || '')
        .split(path.delimiter)
        .filter((folder) => folder && !path.isAbsolute(folder))
        .map((folder) => path.resolve(paths.projectPath, folder)),
      //
    });
    // enable watch mode
    await ctx.watch();
    // The return value tells us where esbuild's local server is
    await ctx
      .serve({
        servedir: paths.projectBuild,
      })
      .then(async (proxyResult) => {
        await serve(proc, {
          port: proxyResult.port.toString(),
          host: proxyResult.host,
        }).then(async (serverResult) => {
          await buildHtml(proc, {
            appHtml: paths.projectHtml,
            appBuild: paths.projectBuild,
          });
          return serverResult;
        });
        return proxyResult;
      });
  })(global.process);
}
