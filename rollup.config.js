import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import alias from '@rollup/plugin-alias';
import path from 'path';
import { fileURLToPath } from 'url';
import terser from '@rollup/plugin-terser';
import copy from 'rollup-plugin-copy';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRootDir = path.resolve(__dirname);
const PRODUCTION = process.env.NODE_ENV === 'production';

const plugins = [
  alias({
    entries: [
      {
        find: '@',
        replacement: path.resolve(projectRootDir, 'src'),
      },
      {
        find: '@components',
        replacement: path.resolve(projectRootDir, 'src/components'),
      },
      {
        find: '@modules',
        replacement: path.resolve(projectRootDir, 'src/modules'),
      },
    ],
  }),
];

if (PRODUCTION) {
  plugins.push(
    terser({
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    }),
  );
  plugins.push(
    copy({
      targets: [
        { src: 'dist/preloader-core.js', dest: 'demo' },
      ]
    }),
  );
} else {
  plugins.push(
    serve({
      contentBase: ['demo', 'dist'],
    }),
  );
  plugins.push(
    livereload({
      watch: ['dist', 'demo'],
    }),
  );
}

export default {
  input: './src/main.js',
  output: {
    file: PRODUCTION ? 'dist/preloader-core.js' : 'demo/preloader-core.js',
    format: 'iife',
  },
  plugins,
};
