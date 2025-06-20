// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/mount.tsx',
  output: {
    file: 'dist/tarot-widget.js',
    format: 'umd',
    name: 'TarotWidgetBundle',
    globals: {
      react: 'React',
      'react-dom': 'ReactDOM'
    }
  },
  external: ['react', 'react-dom'],
  plugins: [
    resolve({ extensions: ['.js', '.ts', '.tsx'] }),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.build.json'    // ← point here instead of tsconfig.json
    }),
    terser()
  ]
};