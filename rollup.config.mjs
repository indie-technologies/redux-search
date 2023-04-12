import terser from '@rollup/plugin-terser';
import pkg from './package.json'  assert { type: "json" };
import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'src/index.ts',
  plugins: [
    nodeResolve(),
    commonjs(),
    typescript(),
    terser(),
  ],
  output: [
    {
      file: pkg.main,
      format: 'cjs',
    },
  ],
};