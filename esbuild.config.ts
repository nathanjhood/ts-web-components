import type ESBuild = require('esbuild');
import tsconfigRaw = require('./tsconfig.json');

const getESBuildCommonOptions = (): ESBuild.CommonOptions => {
  return {} satisfies ESBuild.CommonOptions;
}

const getESBuildBuildOptions = (): ESBuild.BuildOptions => {
  return {} satisfies ESBuild.BuildOptions;
}

const getESBuildServeOptions = (): ESBuild.ServeOptions => {
  return {} satisfies ESBuild.ServeOptions;
}
