import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import { terser } from "rollup-plugin-terser";
import del from 'rollup-plugin-delete'
import { base64 } from "rollup-plugin-base64";
import eslint from '@rollup/plugin-eslint';
import serve from 'rollup-plugin-serve'
import { string } from "rollup-plugin-string";


const mainBundlePlugins = [
  eslint({ fix: true }),
  string({
    include: "**/*.glsl",
  }),
  resolve({
    browser: true,
  }),
  commonjs(),
  replace({
    'process.env.NODE_ENV': JSON.stringify( 'production' )
  }),
  typescript(),
]

export default (commandLineArgs) => {
  return [
    {
      input: 'src/index.ts',
      
      output: {
        file: 'dist/bundle.js',
        format: "umd",
        name: 'spectrogram',
      },

      plugins: [
        del({ targets: 'dist/*' }),
        ...mainBundlePlugins,   
        ...(commandLineArgs.environment === 'dev' ? [serve('../')] : [])    
      ]
    },
    ...['demo1', 'demo2', 'demo3/index'].map((filename) => ({
      input: `src/demo/${filename}.tsx`,
      output: {
        file: `dist/demo/${filename}.js`,
        format: "umd",
        name: 'demo',
      },
      plugins: mainBundlePlugins

    }))
  ]
}