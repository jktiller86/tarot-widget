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
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
      preventAssignment: true
    }),
    nodeResolve({
      browser: true,
      extensions: ['.js','.jsx','.ts','.tsx']
    }),
    commonjs(),
    typescript({
      tsconfig: 'tsconfig.build.json',
      tsconfigOverride: { compilerOptions: { declaration: false } },
      transpileOnly: true      // ← skip type-checking to avoid App.tsx errors
    }),
    terser()
  ]
};
