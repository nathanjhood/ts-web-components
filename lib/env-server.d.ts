/// <reference types="node" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_PATH?: string | undefined;
    readonly NODE_ENV?: 'development' | 'test' | 'production';
    readonly HOST?: '127.0.0.1' | 'localhost' | string | undefined;
    readonly PORT?: string | undefined;
    readonly HTTPS?: 'true' | 'false' | undefined;
    readonly SSL_CRT_FILE?: string | undefined;
    readonly SSL_KEY_FILE?: string | undefined;
    /**
     * An alias for `NODE_DISABLE_COLORS`. The value of the environment variable
     * is arbitrary.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readonly NO_COLOR?: any | string | undefined;
    /**
     * The FORCE_COLOR environment variable is used to enable ANSI colorized
     * output. The value may be:
     * - `1`, `true`, or the empty string `''` indicate 16-color support,
     * - `2` to indicate 256-color support, or
     * - `3` to indicate 16 million-color support.
     * When `FORCE_COLOR` is used and set to a supported value,
     * both the `NO_COLOR`, and `NODE_DISABLE_COLORS` environment variables are
     * ignored.
     * Any other value will result in colorized output being disabled.
     */
    readonly FORCE_COLOR?: 'true' | '' | '1' | '2' | '3' | string | undefined;
    /**
     * When set, colors will not be used in the REPL.
     */
    readonly NODE_DISABLE_COLORS?: '1' | undefined;
    /**
     * Assumes your application is hosted at the serving web server's root or a
     * subpath as specified in `package.json#homepage`. Normally ignores the
     * hostname. You may use this variable to force assets to be referenced
     * verbatim to the url you provide (hostname included). This may be
     * particularly useful when using a CDN to host your application.
     */
    readonly PUBLIC_URL?: '/' | string | undefined;
    readonly BUILD_DIR?: 'dist' | string | undefined;
    /**
     * When set, will run the development server with a custom websocket
     * hostname for hot module reloading. Defaults to `window.location.hostname`
     * for the SockJS hostname. You may use this variable to start local
     * development on more than one project at a time.
     */
    readonly WDS_SOCKET_HOST?: string | undefined;
    /**
     * When set, will run the development server with a custom websocket path
     * for hot module reloading. Defaults to `/ws` for the SockJS pathname. You
     * may use this variable to start local development on more than one project
     * at a time
     */
    readonly WDS_SOCKET_PATH?: '/ws' | string | undefined;
    /**
     * When set, will run the development server with a custom websocket port
     * for hot module reloading. Defaults to `window.location.port` for the
     * SockJS port. You may use this variable to start local development on more
     * than one project at a time.
     */
    readonly WDS_SOCKET_PORT?: string | undefined;
    /**
     * When set to `true`, treat warnings as failures in the build. It also
     * makes the test runner non-watching. Most CIs set this flag by default.
     */
    readonly CI?: 'true' | 'false' | undefined;
    /**
     * When set to `false`, source maps are not generated for a production
     * build. This solves out of memory (OOM) issues on some smaller machines.
     */
    readonly GENERATE_SOURCEMAP?: 'true' | 'false' | undefined;
    /**
     * When set to `false`, disables experimental support for Fast Refresh to
     * allow you to tweak your components in real time without reloading the
     * page.
     */
    readonly FAST_REFRESH?: 'true' | 'false' | undefined;
    readonly VERBOSE?: 'true' | 'false' | undefined;
    readonly DEBUG?: 'true' | 'false' | undefined;
  }
}
