import terser from '@rollup/plugin-terser';
import pkg from './package.json'  assert { type: "json" };
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
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