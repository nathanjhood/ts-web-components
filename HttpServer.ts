import type Http = require('node:http');
import http = require('node:http');
import fs = require('node:fs');
import url = require('node:url');
import util = require('node:util');
import esbuild = require('esbuild');
import normalizePort = require('./scripts/utils/normalizePort');
import getPaths = require('./scripts/utils/getPaths');
import copyPublicFolder = require('./scripts/utils/copyPublicFolder');
import buildHtml = require('./scripts/utils/buildHtml');

const serve = (proc: NodeJS.Process, proxy: { host: string; port: string }) => {
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
    shutdown();
  };

  proc.on('beforeExit', handleBeforeExit);
  proc.on('exit', handleExit);
  proc.on('SIGTERM', handleSigterm);
  proc.on('SIGINT', handleSigint);

  const warnings: Error[] = [];
  const errors: Error[] = [];

  if (proc.env['NODE_ENV'] === undefined) {
    warnings.push(
      new Error(
        "'NODE_ENV' should be set to one of: 'developent', 'production', or 'test'; but, it was 'undefined'"
      )
    );
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

(async (proc: NodeJS.Process) => {
  const paths = getPaths(proc);
  copyPublicFolder({
    appBuild: paths.projectBuild,
    appHtml: paths.projectHtml,
    appPublic: paths.projectPublic,
  });

  // Start esbuild's server on a random local port
  const ctx = await esbuild.context({
    // ... your build options go here ...
    absWorkingDir: paths.projectPath,
    publicPath: paths.projectPublic,
    entryPoints: [paths.projectIndexJs],
    outdir: paths.projectBuild,
  });
  // The return value tells us where esbuild's local server is
  await ctx
    .serve({
      servedir: paths.projectBuild,
    })
    .then((result) => {
      serve(proc, { port: result.port.toString(), host: result.host });
      buildHtml(proc, {
        appHtml: paths.projectHtml,
        appBuild: paths.projectBuild,
      });
      return result;
    });
})(global.process);
