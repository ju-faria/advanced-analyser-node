import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import replace from  '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from "rollup-plugin-terser";
import del from 'rollup-plugin-delete'
import { base64 } from "rollup-plugin-base64";
import eslint from '@rollup/plugin-eslint';
import serve from 'rollup-plugin-serve'


const mainBundlePlugins = (browser) => [
  resolve({
    browser,
  }),
  replace({
    preventAssignment: true,
    IS_SERVER: JSON.stringify(!browser),
  }),
  commonjs(),
  eslint({ fix: true }),
  base64({ include: "dist/processor.worklet.js" }),
  typescript(),
]

export default (commandLineArgs) => {

  return [
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
        resolve({
          browser: true,
        }),
        commonjs(),
        typescript(),
        terser(),
      ]
    },
    {
      input: 'src/node/index.ts',
      output: {
        file: 'dist/bundle.browser.js',
        format: "umd",
        name: 'advancedAnalyserNode',
        inlineDynamicImports: true,
      },
      plugins: mainBundlePlugins(true)
    },
    {
      input: 'src/node/index.ts',
      output: {
        file: 'dist/bundle.server.js',
        format: "umd",
        name: 'advancedAnalyserNode',
        inlineDynamicImports: true,
      },
      plugins: mainBundlePlugins(false)
    },
    {
      input: 'src/node/index.ts',
      output: {
        file: 'dist/bundle.min.js',
        format: "umd",
        name: 'advancedAnalyserNode',
        inlineDynamicImports: true,
      },
      plugins: [
        ...mainBundlePlugins(true),
        terser(), 
        ...(commandLineArgs.environment === 'dev' ? [serve('./')] : [])
      ]
    },
  ]
}