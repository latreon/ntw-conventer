/**
 * German language implementation for number-to-word conversion
 */

// Translation maps
const DIGIT_NAMES: string[] = ['null', 'eins', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun'];
const TEENS: string[] = ['zehn', 'elf', 'zwölf', 'dreizehn', 'vierzehn', 'fünfzehn', 'sechzehn', 'siebzehn', 'achtzehn', 'neunzehn'];
const TENS_MULTIPLES: string[] = ['zwanzig', 'dreißig', 'vierzig', 'fünfzig', 'sechzig', 'siebzig', 'achtzig', 'neunzig'];
const SCALE_NAMES: string[] = ['', 'tausend', 'Million', 'Milliarde', 'Billion'];
// Note: German scales alternate between masculine (Million, Billion) and feminine (Milliarde, Billiarde)
// They also may need inflection with numbers, but we'll simplify for this implementation

// Language-specific error messages
export const ERROR_MESSAGES = {
    NOT_A_NUMBER: 'Der angegebene Wert ist keine Zahl',
    NUMBER_TOO_LARGE: 'Zahl zu groß: Maximal 999 Billionen werden unterstützt',
};

// Language-specific text
export const LANGUAGE_TEXT = {
    NEGATIVE: 'minus',
    DECIMAL: 'Komma',
};

/**
 * Converts a number from 1-99 to words in German
 * In German, for numbers 21-99, the ones digit comes before the tens
 * e.g., 21 is "einundzwanzig" (one-and-twenty)
 */
function convertUnderHundred(number: number): string {
    if (number === 0) return '';
    if (number === 1) return 'ein'; // "eins" becomes "ein" when part of larger numbers
    if (number <= 9) return DIGIT_NAMES[number];
    if (number <= 19) return TEENS[number - 10];

    const tens = Math.floor(number / 10);
    const ones = number % 10;

    if (ones === 0) {
        return TENS_MULTIPLES[tens - 2];
    } else {
        // German orders ones before tens with "und" in between
        // Special case: "eins" becomes "ein" when compounding
        const onesWord = ones === 1 ? 'ein' : DIGIT_NAMES[ones];
        return `${onesWord}und${TENS_MULTIPLES[tens - 2]}`;
    }
}

/**
 * Converts the integer part of a number to words in German
 */
export function convertIntegerPart(integerPart: string): string {
    if (integerPart === '0') return DIGIT_NAMES[0];

    // Remove leading zeros
    integerPart = integerPart.replace(/^0+/, '');
    if (integerPart === '') return DIGIT_NAMES[0];

    const digits = integerPart.split('');
    const length = digits.length;
    const number = parseInt(integerPart, 10);

    // Handle special cases for small numbers
    if (number <= 99) {
        return convertUnderHundred(number);
    }

    let result = '';
    let i = 0;

    // Process the number in groups of three digits
    while (i < length) {
        const remainingDigits = length - i;
        const groupIndex = Math.floor((remainingDigits - 1) / 3); // Scale index
        const groupSize = Math.min(3, remainingDigits);

        // Get the current group of up to three digits
        const groupStr = integerPart.substring(length - (i + groupSize), length - i);
        const groupNum = parseInt(groupStr, 10);

        if (groupNum !== 0) {
            let groupText = '';

            // Handle hundreds
            if (groupStr.length === 3) {
                const hundreds = Math.floor(groupNum / 100);
                if (hundreds > 0) {
                    // In German, it's "einhundert", "zweihundert", etc.
                    groupText += DIGIT_NAMES[hundreds].replace('eins', 'ein') + 'hundert';
                }

                // Now convert the remainder (tens and ones)
                const remainder = groupNum % 100;
                if (remainder > 0) {
                    groupText += convertUnderHundred(remainder);
                }
            }
            // Handle tens and ones (for groups of 1 or 2 digits)
            else {
                groupText += convertUnderHundred(groupNum);
            }

            // Add the scale name
            if (groupIndex > 0) {
                const scaleName = SCALE_NAMES[groupIndex];

                // In German, "Million", "Milliarde", etc. have different endings for plural forms
                if (groupIndex >= 2) {
                    if (groupNum === 1) {
                        groupText += ' ' + scaleName + ' ';
                    } else {
                        // Use "Millionen", "Milliarden" for plurals
                        groupText += ' ' + scaleName + (scaleName.endsWith('e') ? 'n' : 'en') + ' ';
                    }
                } else {
                    // For "tausend", no special handling needed
                    groupText += scaleName + ' ';
                }
            }

            result = groupText + result;
        }

        i += groupSize;
    }

    return result.trim();
}

/**
 * Converts the decimal part of a number to words in German
 */
export function convertDecimalPart(decimalPart: string): string {
    if (!decimalPart || decimalPart === '0') return '';

    // Remove trailing zeros
    decimalPart = decimalPart.replace(/0+$/, '');
    if (decimalPart === '') return '';

    const digits = decimalPart.split('');
    let result = '';

    for (let i = 0; i < digits.length; i++) {
        const digit = parseInt(digits[i], 10);
        result += `${DIGIT_NAMES[digit]} `;
    }

    return result.trim();
} 