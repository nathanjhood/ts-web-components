import type ESBuild = require('esbuild');

const getLogLevel: (logLevel: ESBuild.LogLevel) => number = (
  logLevel: ESBuild.LogLevel
): number => {
  switch (logLevel) {
    case 'silent': {
      return 0;
    }
    case 'error': {
      return 1;
    }
    case 'warning': {
      return 2;
    }
    case 'info': {
      return 3;
    }
    case 'debug': {
      return 4;
    }
    case 'verbose': {
      return 5;
    }
    default: {
      throw new Error('No matching case in switch statement');
    }
  }
};

export = getLogLevel;
