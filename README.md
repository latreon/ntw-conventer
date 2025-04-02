# Number to Word conventer

Convert numbers to words in multiple languages, with extensive multilingual support for 16 languages.

[![NPM Version](https://img.shields.io/npm/v/ntw-conventer.svg)](https://www.npmjs.com/package/ntw-conventer)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- ✅ Extensive multilingual support (16 languages)
- ✅ Converts numbers to words in the specified language
- ✅ Handles integers and decimal numbers
- ✅ Supports large numbers (up to 999 trillion)
- ✅ Negative number support
- ✅ Full TypeScript support
- ✅ Zero dependencies
- ✅ Pure ES Module

## Installation

```bash
npm install ntw-conventer
# or
yarn add ntw-conventer
# or
pnpm add ntw-conventer
```

## Usage

### ES Modules / TypeScript

```typescript
import { convertToWord } from 'ntw-conventer';

// Default language is English
console.log(convertToWord(42));  // => "forty-two"

// Specify language with options
console.log(convertToWord(42, { language: 'ar' }));  // => "اثنان و أربعون"
console.log(convertToWord(42, { language: 'az' }));  // => "qırx iki"
console.log(convertToWord(42, { language: 'de' }));  // => "zweiundvierzig"
console.log(convertToWord(42, { language: 'en' }));  // => "forty-two"
console.log(convertToWord(42, { language: 'es' }));  // => "cuarenta y dos"
console.log(convertToWord(42, { language: 'fi' }));  // => "neljäkymmentä kaksi"
console.log(convertToWord(42, { language: 'fr' }));  // => "quarante-deux"
console.log(convertToWord(42, { language: 'hi' }));  // => "बयालीस"
console.log(convertToWord(42, { language: 'it' }));  // => "quarantadue"
console.log(convertToWord(42, { language: 'ja' }));  // => "四十二"
console.log(convertToWord(42, { language: 'nl' }));  // => "tweeënveertig"
console.log(convertToWord(42, { language: 'pl' }));  // => "czterdzieści dwa"
console.log(convertToWord(42, { language: 'pt' }));  // => "quarenta e dois"
console.log(convertToWord(42, { language: 'ru' }));  // => "сорок два"
console.log(convertToWord(42, { language: 'sv' }));  // => "fyrtiotvå"
console.log(convertToWord(42, { language: 'tr' }));  // => "kırk iki"

// Large numbers
console.log(convertToWord(1234, { language: 'az' })); // => "bir min iki yüz otuz dörd"
console.log(convertToWord(1234, { language: 'en' })); // => "one thousand two hundred thirty-four"
console.log(convertToWord(1234, { language: 'hi' })); // => "एक हज़ार दो सौ चौंतीस"
console.log(convertToWord(1234, { language: 'ja' })); // => "千二百三十四"

// Decimal numbers
console.log(convertToWord(3.14, { language: 'ar' })); // => "ثلاثة فاصلة واحد أربعة"
console.log(convertToWord(3.14, { language: 'az' })); // => "üç tam bir dörd"
console.log(convertToWord(3.14, { language: 'en' })); // => "three point one four"
console.log(convertToWord(3.14, { language: 'fi' })); // => "kolme pilkku yksi neljä"
console.log(convertToWord(3.14, { language: 'fr' })); // => "trois virgule un quatre"
console.log(convertToWord(3.14, { language: 'hi' })); // => "तीन दशमलव एक चार"
console.log(convertToWord(3.14, { language: 'ja' })); // => "三点一四"
console.log(convertToWord(3.14, { language: 'pl' })); // => "trzy przecinek jeden cztery"
console.log(convertToWord(3.14, { language: 'sv' })); // => "tre komma ett fyra"
console.log(convertToWord(3.14, { language: 'tr' })); // => "üç virgül bir dört"

// Negative numbers
console.log(convertToWord(-10, { language: 'ar' })); // => "سالب عشرة"
console.log(convertToWord(-10, { language: 'az' })); // => "mənfi on"
console.log(convertToWord(-10, { language: 'en' })); // => "negative ten"
console.log(convertToWord(-10, { language: 'hi' })); // => "ऋण दस"
console.log(convertToWord(-10, { language: 'ja' })); // => "マイナス十"
console.log(convertToWord(-10, { language: 'pl' })); // => "minus dziesięć"
console.log(convertToWord(-10, { language: 'ru' })); // => "минус десять"
console.log(convertToWord(-10, { language: 'sv' })); // => "minus tio"
console.log(convertToWord(-10, { language: 'tr' })); // => "eksi on"
```

### Integrate into Your Code

```javascript
import { convertToWord } from 'ntw-conventer';

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

### Integrate with React + Vite

When using this package with Vite and React, you may need to add the package to the optimizeDeps in your vite.config.js file:

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['ntw-conventer']
  },
  build: {
    commonjsOptions: {
      include: [/ntw-conventer/]
    }
  }
});
```

Example React component:

```jsx
import React, { useState } from 'react';
import { convertToWord } from 'ntw-conventer';

const NumberToWordConverter = () => {
  const [number, setNumber] = useState('42');
  const [language, setLanguage] = useState('en');
  const [result, setResult] = useState(convertToWord(42, { language: 'en' }));
  
  const handleConvert = () => {
    try {
      const converted = convertToWord(number, { language });
      setResult(converted);
    } catch (error) {
      setResult(`Error: ${error.message}`);
    }
  };
  
  return (
    <div>
      <input 
        type="text" 
        value={number} 
        onChange={(e) => setNumber(e.target.value)} 
      />
      <select 
        value={language} 
        onChange={(e) => setLanguage(e.target.value)}
      >
        <option value="ar">Arabic</option>
        <option value="az">Azerbaijani</option>
        <option value="en">English</option>
        <option value="es">Spanish</option>
        <option value="fi">Finnish</option>
        <option value="hi">Hindi</option>
        <option value="ja">Japanese</option>
        <option value="pl">Polish</option>
        <option value="sv">Swedish</option>
        {/* Add more languages */}
      </select>
      <button onClick={handleConvert}>Convert</button>
      <div>Result: {result}</div>
    </div>
  );
};

export default NumberToWordConverter;
```

## API

### convertToWord(number, options?)

Converts a number to its word representation in the specified language.

#### Parameters

- `number` (number | string): The number to convert
- `options` (object, optional): Configuration options
  - `language` (string, default: 'en'): The ISO 639-1 language code ('ar', 'az', 'de', 'en', 'es', 'fi', 'fr', 'hi', 'it', 'ja', 'nl', 'pl', 'pt', 'ru', 'sv', 'tr')
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
| ar   | Arabic     | 123.45                   | مائة و ثلاثة و عشرون فاصلة أربعة خمسة |
| az   | Azerbaijani| 123.45                   | bir yüz iyirmi üç tam dörd beş     |
| de   | German     | 123.45                   | einhundertdreiundzwanzig Komma vier fünf |
| en   | English    | 123.45                   | one hundred twenty-three point four five |
| es   | Spanish    | 123.45                   | ciento veintitrés coma cuatro cinco |
| fi   | Finnish    | 123.45                   | sata kaksikymmentä kolme pilkku neljä viisi |
| fr   | French     | 123.45                   | cent vingt-trois virgule quatre cinq |
| hi   | Hindi      | 123.45                   | एक सौ तेईस दशमलव चार पांच |
| it   | Italian    | 123.45                   | cento ventitré virgola quattro cinque |
| ja   | Japanese   | 123.45                   | 百二十三点四五 |
| nl   | Dutch      | 123.45                   | honderddrieëntwintig komma vier vijf |
| pl   | Polish     | 123.45                   | sto dwadzieścia trzy przecinek cztery pięć |
| pt   | Portuguese | 123.45                   | cento e vinte e três vírgula quatro cinco |
| ru   | Russian    | 123.45                   | сто двадцать три целых четыре пять |
| sv   | Swedish    | 123.45                   | etthundratjugotre komma fyra fem |
| tr   | Turkish    | 123.45                   | yüz yirmi üç virgül dört beş       |

## Supported Range

This package supports converting numbers in the range from -999,999,999,999,999 to 999,999,999,999,999.

## Adding a New Language

If you want to add a new language support, you can contribute by implementing a new language module. Each language module should follow the structure defined in the existing modules.

## License

MIT © [Farda Karimov](https://github.com/yourusername)
