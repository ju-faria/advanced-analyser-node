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
  del({ targets: 'dist/*' }),
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
      input: 'src/index.tsx',
      
      output: {
        file: 'dist/bundle.js',
        format: "umd",
        name: 'spectrogram',
      },

      plugins: [...mainBundlePlugins,   ...(commandLineArgs.environment === 'dev' ? [serve('./')] : [])    ]
    }
  ]
}