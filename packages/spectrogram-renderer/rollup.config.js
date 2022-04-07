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


const serverOptions = {
  contentBase: '../',
  headers: {
    'Accept-Ranges': 'bytes'
  }
}

const mainBundlePlugins = (env = 'prod') => [
  del({ targets: 'dist/*' }),
  eslint({ fix: true }),
  string({
    include: "**/*.glsl",
  }),
  resolve({
    browser: true,
  }),
  replace({
    preventAssignment: true,
    'IS_PROD': JSON.stringify(env === 'prod'),
  }),
  commonjs(),
  typescript(),
  ...(env === 'dev' ? [serve(serverOptions)] : []) 
]

export default (commandLineArgs) => {
  return [
    {
      input: 'src/index.ts',
      
      output: {
        file: 'dist/bundle.js',
        format: "umd",
        name: 'spectrogramRenderer',
      },

      plugins: mainBundlePlugins(commandLineArgs.environment)
    }
  ]
}