/**
 * Simple ESM test to verify the package can be imported
 * Run with: node test-vite-compatibility.js
 */

import { convertToWord } from './dist/index.mjs';

console.log('Testing package import...');
console.log('Converting 42 to words in English:', convertToWord(42));
console.log('Converting 42 to words in Spanish:', convertToWord(42, { language: 'es' }));
console.log('Package import successful!'); 