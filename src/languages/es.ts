/**
 * Spanish language implementation for number-to-word conversion
 */

// Translation maps
const DIGIT_NAMES: string[] = ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
const TEENS: string[] = ['diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve'];
const TENS_MULTIPLES: string[] = ['veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
const SCALE_NAMES: string[] = ['', 'mil', 'millón', 'billón', 'trillón'];
const SCALE_NAMES_PLURAL: string[] = ['', 'mil', 'millones', 'billones', 'trillones'];

// Language-specific error messages
export const ERROR_MESSAGES = {
    NOT_A_NUMBER: 'El valor proporcionado no es un número',
    NUMBER_TOO_LARGE: 'Número demasiado grande: se admite un máximo de 999 trillones',
};

// Language-specific text
export const LANGUAGE_TEXT = {
    NEGATIVE: 'negativo',
    DECIMAL: 'coma',
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
 * Converts the integer part of a number to words in Spanish
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
                result += 'cien ';
                if (hasNonZeroDigit(digits, i + 1, 2)) {
                    result = result.replace('cien', 'ciento');
                }
            } else if (digit === 5) {
                result += 'quinientos ';
            } else if (digit === 7) {
                result += 'setecientos ';
            } else if (digit === 9) {
                result += 'novecientos ';
            } else {
                result += `${DIGIT_NAMES[digit]}cientos `;
            }
        }
        // Process tens
        else if (positionInGroup === 2) {
            if (digit === 1) {
                // Special case for 10-19
                const nextDigit = parseInt(digits[i + 1], 10);
                result += `${TEENS[nextDigit]} `;
                skipNext = true;
            } else if (digit === 2) {
                // Special case for 20-29
                const nextDigit = parseInt(digits[i + 1], 10);
                if (nextDigit === 0) {
                    result += 'veinte ';
                } else {
                    result += `veinti${DIGIT_NAMES[nextDigit]} `;
                    skipNext = true;
                }
            } else if (digit > 2) {
                const nextDigit = parseInt(digits[i + 1], 10);
                if (nextDigit === 0) {
                    result += `${TENS_MULTIPLES[digit - 2]} `;
                } else {
                    result += `${TENS_MULTIPLES[digit - 2]} y ${DIGIT_NAMES[nextDigit]} `;
                    skipNext = true;
                }
            }
        }
        // Process ones
        else if (positionInGroup === 1 && !skipNext) {
            // Special case for 1: "un" instead of "uno" in most contexts
            if (digit === 1 && scaleIndex > 0) {
                result += 'un ';
            } else if (digit > 0) {
                result += `${DIGIT_NAMES[digit]} `;
            }
        }

        // Add scale name (thousand, million, etc.) if this is the last digit in a group
        // and the group has some non-zero value
        if (positionInGroup === 1 && scaleIndex > 0 && hasNonZeroDigit(digits, i - (positionInGroup - 1), 3)) {
            // Use plural form for millions and above when not preceded by "un"
            if (scaleIndex >= 2 && !(digit === 1 && !skipNext)) {
                result += `${SCALE_NAMES_PLURAL[scaleIndex]} `;
            } else {
                result += `${SCALE_NAMES[scaleIndex]} `;
            }
        }
    }

    return result.trim();
}

/**
 * Converts the decimal part of a number to words in Spanish
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