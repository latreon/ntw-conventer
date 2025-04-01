# number-to-word-az

Convert numbers to words in multiple languages, with special support for Azerbaijani, English, and Turkish.

[![NPM Version](https://img.shields.io/npm/v/number-to-word-az.svg)](https://www.npmjs.com/package/number-to-word-az)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- ✅ Multilingual support (Azerbaijani, English, Turkish)
- ✅ Converts numbers to words in the specified language
- ✅ Handles integers and decimal numbers
- ✅ Supports large numbers (up to 999 trillion)
- ✅ Negative number support
- ✅ Full TypeScript support
- ✅ Zero dependencies
- ✅ Pure ES Module

## Installation

```bash
npm install number-to-word-az
# or
yarn add number-to-word-az
# or
pnpm add number-to-word-az
```

## Usage

### ES Modules / TypeScript

```typescript
import { convertToWord } from 'number-to-word-az';

// Default language is English
console.log(convertToWord(42));  // => "forty-two"

// Specify language with options
console.log(convertToWord(42, { language: 'az' }));  // => "qırx iki"
console.log(convertToWord(42, { language: 'en' }));  // => "forty-two"
console.log(convertToWord(42, { language: 'tr' }));  // => "kırk iki"

// Large numbers
console.log(convertToWord(1234, { language: 'az' })); // => "bir min iki yüz otuz dörd"
console.log(convertToWord(1234, { language: 'en' })); // => "one thousand two hundred thirty-four"

// Decimal numbers
console.log(convertToWord(3.14, { language: 'az' })); // => "üç tam bir dörd"
console.log(convertToWord(3.14, { language: 'en' })); // => "three point one four"
console.log(convertToWord(3.14, { language: 'tr' })); // => "üç virgül bir dört"

// Negative numbers
console.log(convertToWord(-10, { language: 'az' })); // => "mənfi on"
console.log(convertToWord(-10, { language: 'en' })); // => "negative ten"
console.log(convertToWord(-10, { language: 'tr' })); // => "eksi on"
```

### Integrate into Your Code

```javascript
import { convertToWord } from 'number-to-word-az';

// Create a formatter function
function formatAmount(amount, language = 'en') {
  return convertToWord(amount, { 
    language,
    capitalize: true
  });
}

// Use in your application
const price = 1250.99;
console.log(`Amount: ${price}`);
console.log(`In words: ${formatAmount(price)}`);
// => "One thousand two hundred fifty point nine nine"
```

## API

### convertToWord(number, options?)

Converts a number to its word representation in the specified language.

#### Parameters

- `number` (number | string): The number to convert
- `options` (object, optional): Configuration options
  - `language` (string, default: 'en'): The ISO 639-1 language code ('az', 'en', 'tr')
  - `includeDecimalText` (boolean, default: true): Whether to include decimal text (point, tam, virgül, etc.)
  - `capitalize` (boolean, default: false): Whether to capitalize the first letter of the result

#### Returns

- (string): The word representation of the number in the specified language

### isSupportedLanguage(code)

Checks if a language is supported.

#### Parameters

- `code` (string): The ISO 639-1 language code to check

#### Returns

- (boolean): True if the language is supported

### getSupportedLanguageCodes()

Gets a list of all supported language codes.

#### Returns

- (string[]): Array of supported language codes

## Supported Languages

| Code | Language   | Number Example           | Word Example                       |
|------|------------|--------------------------|------------------------------------|
| az   | Azerbaijani| 123.45                   | bir yüz iyirmi üç tam dörd beş     |
| de   | German     | 123.45                   | einhundertdreiundzwanzig Komma vier fünf |
| en   | English    | 123.45                   | one hundred twenty-three point four five |
| fr   | French     | 123.45                   | cent vingt-trois virgule quatre cinq |
| tr   | Turkish    | 123.45                   | yüz yirmi üç virgül dört beş       |

## Supported Range

This package supports converting numbers in the range from -999,999,999,999,999 to 999,999,999,999,999.

## Adding a New Language

If you want to add a new language support, you can contribute by implementing a new language module. Each language module should follow the structure defined in the existing modules.

## License

MIT © [Farda Karimov](https://github.com/yourusername)
