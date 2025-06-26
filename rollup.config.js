// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
-import typescript from 'rollup-plugin-typescript2';
+import typescript from 'rollup-plugin-typescript2';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/mount.tsx',
  output: {
    file: 'dist/tarot-widget.js',
    format: 'iife',
    name: 'TarotCardWidget',
    sourcemap: false,
  },
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
      preventAssignment: true,
    }),
    resolve({
      browser: true,
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    }),
    commonjs(),
-   typescript({
-    tsconfigOverride: { compilerOptions: { declaration: false } },
-   }),
+   typescript({
+     // point Rollup at your build‐only tsconfig so App.tsx is excluded
+     tsconfig: 'tsconfig.build.json',
+     tsconfigOverride: { compilerOptions: { declaration: false } },
+   }),
    terser(),
  ],
};
