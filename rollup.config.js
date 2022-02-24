import typescript from 'rollup-plugin-typescript2';
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs';
import { terser } from "rollup-plugin-terser";
import del from 'rollup-plugin-delete'
import { base64 } from "rollup-plugin-base64";
import eslint from '@rollup/plugin-eslint';
import serve from 'rollup-plugin-serve'


const mainBundlePlugins = [
  eslint({ fix: true }),
  base64({ include: "dist/processor.worklet.js" }),
  typescript(),
]
export default [
  {
    input: 'src/processor/index.ts',
    output: {
      file: 'dist/processor.worklet.js',
      format: "umd" ,
      name: 'advancedAnalyserProcessor',

    },
    plugins: [
      del({ targets: 'dist/*' }),
      eslint({ fix: true }),
      resolve(),
      commonjs(),
      typescript(),
      terser(),
    ]
  },
  {
    input: 'src/node/index.ts',
    output: {
      file: 'dist/bundle.js',
      format: "umd",
      name: 'advancedAnalyserNode',
    },
    plugins: mainBundlePlugins
  },
  {
    input: 'src/node/index.ts',
    output: {
      file: 'dist/bundle.min.js',
      format: "umd",
      name: 'advancedAnalyserNode',
    },
    plugins: [
      ...mainBundlePlugins,
      terser(), 
      // serve('./')
    ]
  },
]