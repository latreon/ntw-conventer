/**
 * Azerbaijani language implementation for number-to-word conversion
 */

// Translation maps
const DIGIT_NAMES: string[] = ['sıfır', 'bir', 'iki', 'üç', 'dörd', 'beş', 'altı', 'yeddi', 'səkkiz', 'doqquz'];
const TENS_NAMES: string[] = ['on', 'on bir', 'on iki', 'on üç', 'on dörd', 'on beş', 'on altı', 'on yeddi', 'on səkkiz', 'on doqquz'];
const TENS_MULTIPLES: string[] = ['iyirmi', 'otuz', 'qırx', 'əlli', 'altmış', 'yetmiş', 'səksən', 'doxsan'];
const SCALE_NAMES: string[] = ['', 'min', 'milyon', 'milyard', 'trilyon'];

// Language-specific error messages
export const ERROR_MESSAGES = {
    NOT_A_NUMBER: 'Verilən dəyər rəqəm deyil',
    NUMBER_TOO_LARGE: 'Çox böyük rəqəm: maksimum 999 trilyon dəstəklənir',
};

// Language-specific text
export const LANGUAGE_TEXT = {
    NEGATIVE: 'mənfi',
    DECIMAL: 'tam',
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
 * Converts the integer part of a number to words in Azerbaijani
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
            result += `${DIGIT_NAMES[digit]} yüz `;
        }
        // Process tens
        else if (positionInGroup === 2) {
            if (digit === 1) {
                // Special case for 10-19
                const nextDigit = parseInt(digits[i + 1], 10);
                result += `${TENS_NAMES[nextDigit]} `;
                skipNext = true;
            } else if (digit > 1) {
                result += `${TENS_MULTIPLES[digit - 2]} `;
            }
        }
        // Process ones
        else if (positionInGroup === 1 && !skipNext && digit > 0) {
            result += `${DIGIT_NAMES[digit]} `;
        }

        // Add scale name (thousand, million, etc.) if this is the last digit in a group
        // and the group has some non-zero value
        if (positionInGroup === 1 && scaleIndex > 0 && hasNonZeroDigit(digits, i - (positionInGroup - 1), 3)) {
            result += `${SCALE_NAMES[scaleIndex]} `;
        }
    }

    return result.trim();
}

/**
 * Converts the decimal part of a number to words in Azerbaijani
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