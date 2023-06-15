import { rollup } from 'rollup';
import terser from '@rollup/plugin-terser';
import minifyLiterals from 'rollup-plugin-minify-html-literals-v3';
import fs from 'fs';
import path from 'path';

const inputFolder = 'demo/preloader';
const outputFolder = 'demo/preloader/min';

const files = fs.readdirSync(inputFolder).filter((file) => {
  const filePath = path.join(inputFolder, file);
  const fileStats = fs.statSync(filePath);
  return fileStats.isFile();
});

const inputConfig = files.reduce((input, file) => {
  const filePath = path.join(inputFolder, file);
  const outputFile = path.basename(file, path.extname(file));
  input[outputFile] = filePath;
  return input;
}, {});

async function build() {
  const inputOptions = {
    input: inputConfig,
    plugins: [
      minifyLiterals({
        options: {
          shouldMinify: (template) => {
            return template.parts.some(() => true);
          },
        },
      }),
      terser(),
    ],
  };

  const outputOptions = {
    dir: outputFolder,
    entryFileNames: '[name].min.js',
  };

  const bundle = await rollup(inputOptions);
  await bundle.write(outputOptions);
}

await build();
