/**
 * French language implementation for number-to-word conversion
 */

// Translation maps
const DIGIT_NAMES: string[] = ['zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf'];
const TEENS: string[] = ['dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
const TENS_MULTIPLES: string[] = ['vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante-dix', 'quatre-vingt', 'quatre-vingt-dix'];
const SCALE_NAMES: string[] = ['', 'mille', 'million', 'milliard', 'billion'];

// Language-specific error messages
export const ERROR_MESSAGES = {
    NOT_A_NUMBER: 'La valeur fournie n\'est pas un nombre',
    NUMBER_TOO_LARGE: 'Nombre trop grand: maximum 999 billions est pris en charge',
};

// Language-specific text
export const LANGUAGE_TEXT = {
    NEGATIVE: 'moins',
    DECIMAL: 'virgule',
};

/**
 * Checks if a range of digits has at least one non-zero value
 */
function hasNonZeroDigit(digits: string[], start: number, length: number): boolean {
    const end = Math.min(start + length, digits.length);
    for (let i = start; i < end; i++) {
        if (parseInt(digits[i], 10) !== 0) {
            return true;
        }
    }
    return false;
}

/**
 * Converts a number from 1-99 to words in French
 * French has special rules for 70-99
 */
function convertUnderHundred(number: number): string {
    if (number === 0) return '';
    if (number === 1) return 'un';
    if (number <= 9) return DIGIT_NAMES[number];
    if (number <= 19) return TEENS[number - 10];

    const tens = Math.floor(number / 10);
    const ones = number % 10;

    // Special cases for French
    if (tens === 7) {
        // 70-79: soixante-dix, soixante-et-onze, soixante-douze, etc.
        return ones === 0 ? 'soixante-dix' :
            ones === 1 ? 'soixante-et-onze' :
                `soixante-${TEENS[ones - 10]}`;
    }
    else if (tens === 9) {
        // 90-99: quatre-vingt-dix, quatre-vingt-onze, quatre-vingt-douze, etc.
        return ones === 0 ? 'quatre-vingt-dix' : `quatre-vingt-${TEENS[ones - 10]}`;
    }
    else if (tens === 8) {
        // 80-89: quatre-vingts, quatre-vingt-un, quatre-vingt-deux, etc.
        // Note: "quatre-vingts" with an 's' only when not followed by another number
        return ones === 0 ? 'quatre-vingts' : `quatre-vingt-${DIGIT_NAMES[ones]}`;
    }
    else {
        // Regular cases: vingt, vingt-et-un, vingt-deux
        return ones === 0 ? TENS_MULTIPLES[tens - 2] :
            ones === 1 ? `${TENS_MULTIPLES[tens - 2]}-et-un` :
                `${TENS_MULTIPLES[tens - 2]}-${DIGIT_NAMES[ones]}`;
    }
}

/**
 * Converts the integer part of a number to words in French
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
        const groupStr = integerPart.substring(i, i + groupSize);
        const groupNum = parseInt(groupStr, 10);

        if (groupNum !== 0) {
            let groupText = '';

            // Handle hundreds
            if (groupStr.length === 3) {
                const hundreds = Math.floor(groupNum / 100);
                if (hundreds === 1) {
                    groupText += 'cent ';
                } else if (hundreds > 1) {
                    groupText += `${DIGIT_NAMES[hundreds]} cent `;
                }

                // Now convert the remainder (tens and ones)
                const remainder = groupNum % 100;
                if (remainder > 0) {
                    groupText += convertUnderHundred(remainder) + ' ';
                }
            }
            // Handle tens and ones (for groups of 1 or 2 digits)
            else {
                groupText += convertUnderHundred(groupNum) + ' ';
            }

            // Add the scale name
            if (groupIndex > 0) {
                // In French: 
                // 1000 = "mille" (not "un mille")
                // 1,000,000 = "un million" (needs "un")
                if (groupIndex === 1 && groupNum === 1) {
                    // Special case for 1000: just "mille" without "un"
                    groupText = 'mille ';
                } else {
                    const scaleName = SCALE_NAMES[groupIndex];

                    // Add 's' for millions, milliards etc. when greater than 1
                    if (groupIndex >= 2 && groupNum > 1) {
                        groupText += scaleName + 's ';
                    } else {
                        groupText += scaleName + ' ';
                    }
                }
            }

            result += groupText;
        }

        i += groupSize;
    }

    return result.trim();
}

/**
 * Converts the decimal part of a number to words in French
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