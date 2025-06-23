// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/mount.tsx',
  output: {
    file: 'dist/tarot-widget.js',
    format: 'iife',
    name: 'TarotCardWidget',
  },
  plugins: [
    replace({
      // inline NODE_ENV so React's prod build code is used
      'process.env.NODE_ENV': JSON.stringify('production'),
      preventAssignment: true,
    }),
    resolve({ browser: true }),
    commonjs(),
    typescript({ tsconfig: 'tsconfig.build.json' }),
    terser(),
  ],
};
