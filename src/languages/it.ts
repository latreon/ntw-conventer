/**
 * Italian language implementation for number-to-word conversion
 */

// Translation maps
const DIGIT_NAMES: string[] = ['zero', 'uno', 'due', 'tre', 'quattro', 'cinque', 'sei', 'sette', 'otto', 'nove'];
const TEENS: string[] = ['dieci', 'undici', 'dodici', 'tredici', 'quattordici', 'quindici', 'sedici', 'diciassette', 'diciotto', 'diciannove'];
const TENS_MULTIPLES: string[] = ['venti', 'trenta', 'quaranta', 'cinquanta', 'sessanta', 'settanta', 'ottanta', 'novanta'];
const SCALE_NAMES: string[] = ['', 'mila', 'milioni', 'miliardi', 'bilioni'];

// Language-specific error messages
export const ERROR_MESSAGES = {
    NOT_A_NUMBER: 'Il valore fornito non è un numero',
    NUMBER_TOO_LARGE: 'Numero troppo grande: è supportato un massimo di 999 bilioni',
};

// Language-specific text
export const LANGUAGE_TEXT = {
    NEGATIVE: 'negativo',
    DECIMAL: 'virgola',
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
 * Converts the integer part of a number to words in Italian
 */
export function convertIntegerPart(integerPart: string): string {
    if (integerPart === '0') return DIGIT_NAMES[0];

    // Remove leading zeros
    integerPart = integerPart.replace(/^0+/, '');
    if (integerPart === '') return DIGIT_NAMES[0];

    const digits = integerPart.split('');
    const length = digits.length;

    let result = '';
    let skipNext = false;

    for (let i = 0; i < length; i++) {
        if (skipNext) {
            skipNext = false;
            continue;
        }

        const digit = parseInt(digits[i], 10);
        const position = length - i;

        // Handle different positions
        const positionInGroup = position % 3;
        const scaleIndex = Math.floor((position - 1) / 3);

        // Process hundreds
        if (positionInGroup === 0 && digit > 0) {
            if (digit === 1) {
                result += 'cento';
            } else {
                result += `${DIGIT_NAMES[digit]}cento`;
            }
            result += ' ';
        }
        // Process tens
        else if (positionInGroup === 2) {
            if (digit === 1) {
                // Special case for 10-19
                const nextDigit = parseInt(digits[i + 1], 10);
                result += `${TEENS[nextDigit]} `;
                skipNext = true;
            } else if (digit > 1) {
                let tensWord = TENS_MULTIPLES[digit - 2];
                const nextDigit = parseInt(digits[i + 1], 10);

                if (nextDigit === 0) {
                    result += `${tensWord} `;
                } else {
                    // Handle phonetic rules for Italian
                    if (nextDigit === 1 || nextDigit === 8) {
                        tensWord = tensWord.slice(0, -1); // Remove final vowel
                    } else if (tensWord === 'venti' && nextDigit === 3) {
                        tensWord = 'vent'; // Special case for 23
                    }

                    result += `${tensWord}${DIGIT_NAMES[nextDigit]} `;
                    skipNext = true;
                }
            }
        }
        // Process ones
        else if (positionInGroup === 1 && !skipNext) {
            // Special case for 1: "un" instead of "uno" in most contexts except when alone
            if (digit === 1) {
                if (scaleIndex === 0 && length === 1) {
                    result += 'uno ';
                } else if (scaleIndex === 1) {
                    // No "un" before "mila"
                } else if (scaleIndex > 1) {
                    result += 'un ';
                } else {
                    result += 'uno ';
                }
            } else if (digit > 0) {
                result += `${DIGIT_NAMES[digit]} `;
            }
        }

        // Add scale name (thousand, million, etc.) if this is the last digit in a group
        // and the group has some non-zero value
        if (positionInGroup === 1 && scaleIndex > 0 && hasNonZeroDigit(digits, i - (positionInGroup - 1), 3)) {
            if (scaleIndex === 1) {
                if (hasNonZeroDigit(digits, i - 2, 3) && parseInt(digits[i], 10) === 1 && !skipNext) {
                    result += 'mille ';
                } else {
                    result += `${SCALE_NAMES[scaleIndex]} `;
                }
            } else {
                // For million and above
                const value = parseInt(integerPart.substring(i - 2, i + 1), 10);
                if (value === 1) {
                    result += `${SCALE_NAMES[scaleIndex].slice(0, -1)}e `; // Use singular
                } else {
                    result += `${SCALE_NAMES[scaleIndex]} `;
                }
            }
        }
    }

    return result.trim();
}

/**
 * Converts the decimal part of a number to words in Italian
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