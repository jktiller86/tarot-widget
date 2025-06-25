// rollup.config.cjs
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs    = require('@rollup/plugin-commonjs');
const typescript = require('rollup-plugin-typescript2');
const replace    = require('@rollup/plugin-replace');
const terser     = require('@rollup/plugin-terser').default;

module.exports = {
  input: 'src/mount.tsx',
  output: {
    file: 'dist/tarot-widget.js',
    format: 'iife',
    name: 'TarotCardWidget',
    sourcemap: false
  },
  plugins: [
    // inline NODE_ENV so no runtime `process` calls
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
      preventAssignment: true
    }),

    // resolve node_modules
    nodeResolve({
      browser: true,
      extensions: ['.js','.jsx','.ts','.tsx']
    }),

    // convert CommonJS modules
    commonjs(),

    // compile TS using your build-only tsconfig
    typescript({
      tsconfig: 'tsconfig.build.json',
      tsconfigOverride: { compilerOptions: { declaration: false } }
    }),

    // minify
    terser()
  ]
};
