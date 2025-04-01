// ESM import example
import { convertToWord, isSupportedLanguage, getSupportedLanguageCodes } from 'number-to-word-az';

// CommonJS require example (uncomment to use)
// const { convertToWord, isSupportedLanguage, getSupportedLanguageCodes } = require('number-to-word-az');

// Basic usage
console.log('===== Basic Usage =====');
console.log('12 in English:', convertToWord(12, { language: 'en' }));
console.log('12 in Azerbaijani:', convertToWord(12, { language: 'az' }));
console.log('12 in Turkish:', convertToWord(12, { language: 'tr' }));

// Different number types
console.log('\n===== Different Numbers =====');
console.log('Decimal:', convertToWord(123.45, { language: 'en' }));
console.log('Negative:', convertToWord(-42, { language: 'en' }));
console.log('Large Number:', convertToWord(1000000, { language: 'en' }));

// Options
console.log('\n===== Options =====');
console.log('Default:', convertToWord(123, { language: 'en' }));
console.log('Capitalized:', convertToWord(123, { language: 'en', capitalize: true }));
console.log('Without decimal text:', convertToWord(123.45, { language: 'en', includeDecimalText: false }));

// Language utilities
console.log('\n===== Language Utilities =====');
console.log('Supported Languages:', getSupportedLanguageCodes());
console.log('Is "fr" supported?', isSupportedLanguage('fr'));
console.log('Is "EN" supported (case insensitive)?', isSupportedLanguage('EN'));

// Process command line arguments if provided
if (process.argv.length > 2) {
    const number = process.argv[2];
    const language = process.argv[3] || 'en';

    console.log(`\n===== Command Line Argument =====`);
    console.log(`${number} in ${language}:`, convertToWord(number, { language }));
}

console.log('\nTo use from command line: node node-usage.js 42 az'); 