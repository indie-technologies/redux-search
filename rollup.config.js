import terser from '@rollup/plugin-terser';
import pkg from './package.json';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.js',
  plugins: [
    typescript(),
    terser(),
  ],
  output: [
    {
      file: pkg.module,
      format: 'es' 
    },
  ],
};