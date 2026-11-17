import {mkdir,copyFile} from 'node:fs/promises';
const target='public/ocr';await mkdir(target+'/core',{recursive:true});
await copyFile('node_modules/tesseract.js/dist/worker.min.js',target+'/worker.min.js');
for(const name of ['tesseract-core','tesseract-core-simd','tesseract-core-lstm','tesseract-core-simd-lstm']){await copyFile(`node_modules/tesseract.js-core/${name}.wasm.js`,`${target}/core/${name}.wasm.js`);await copyFile(`node_modules/tesseract.js-core/${name}.wasm`,`${target}/core/${name}.wasm`);}
await copyFile('node_modules/@tesseract.js-data/eng/4.0.0/eng.traineddata.gz',target+'/eng.traineddata.gz');
await copyFile('node_modules/tesseract.js/LICENSE.md',target+'/TESSERACT-LICENSE');
await copyFile('node_modules/tesseract.js-core/LICENSE',target+'/CORE-LICENSE');
console.log('Prepared local browser OCR assets.');
