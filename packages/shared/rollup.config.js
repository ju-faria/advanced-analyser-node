import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs';
import del from 'rollup-plugin-delete'
import eslint from '@rollup/plugin-eslint';

const mainBundlePlugins = () => [
  eslint({ fix: true }),
  resolve({
    browser: true,
  }),
  commonjs(),
  typescript(),
]

export default (commandLineArgs) => {
  return [
    {
      input: `index.ts`,
      output: {
        file: 'dist/bundle.js',
        format: "umd",
        name: 'shared',
      },
      plugins: [del({ targets: 'dist/*' }), ...mainBundlePlugins(commandLineArgs.environment)]
    },
    ...['utils','constants'].map((moduleName) => ({
      input: `${moduleName}/index.ts`,
      output: {
        file: `dist/${moduleName}.js`,
        format: "umd",
        name: moduleName,
      },
      plugins: mainBundlePlugins(commandLineArgs.environment)
    }))
  ]
}