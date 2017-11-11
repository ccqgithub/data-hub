const replace = require('rollup-plugin-replace');
const babel = require('rollup-plugin-babel');
const uglify = require('rollup-plugin-uglify');

let pkg = require('./package.json');
let external = [];
let TARGET = process.env.TARGET;

// external dependencies
external = external.concat(Object.keys(pkg.dependencies || {}));
// external peer dependencies
external = external.concat(Object.keys(pkg.peerDependencies || {}));
external = external.concat(['rxjs/Rx']);

let plugins = [
  babel({
    exclude: ['node_modules/**/*'],
    plugins: ['external-helpers'],
  })
];

let config = {
  entry: 'index.js',
  plugins: plugins,
  external: external,
  dest: 'dist/rx-hub.js',
  format: 'umd',
  moduleName: 'rx-hub',
  sourceMap: true,
  globals: {
    'rxjs/Rx': 'Rx'
  }
}

if (TARGET == 'cjs') {
  config.dest = 'dist/rx-hub.common.js';
  config.format = 'cjs';
} else if (TARGET == 'umd') {
  config.dest = 'dist/rx-hub.js';
  config.format = 'umd';
  config.plugins.push(replace({
    'process.env.NODE_ENV': JSON.stringify('development')
  }));
} else if (TARGET == 'umd-prod') {
  config.dest = 'dist/rx-hub.min.js';
  config.format = 'umd';
  config.plugins.push(replace({
    'process.env.NODE_ENV': JSON.stringify('production')
  }));
  config.plugins.push( uglify() );
}

export default config;
