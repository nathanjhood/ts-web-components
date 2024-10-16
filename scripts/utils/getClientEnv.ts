const getClientEnv = (proc: NodeJS.Process) => {
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

export = getClientEnv;
