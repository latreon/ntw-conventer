/**
 * Swedish language implementation for number-to-word conversion
 */

// Translation maps
const DIGIT_NAMES: string[] = ['noll', 'ett', 'två', 'tre', 'fyra', 'fem', 'sex', 'sju', 'åtta', 'nio'];
const TEENS_NAMES: string[] = ['tio', 'elva', 'tolv', 'tretton', 'fjorton', 'femton', 'sexton', 'sjutton', 'arton', 'nitton'];
const TENS_MULTIPLES: string[] = ['tjugo', 'trettio', 'fyrtio', 'femtio', 'sextio', 'sjuttio', 'åttio', 'nittio'];
const SCALE_NAMES: string[] = ['', 'tusen', 'miljon', 'miljard', 'biljon', 'biljard', 'triljon'];
const SCALE_NAMES_PLURAL: string[] = ['', 'tusen', 'miljoner', 'miljarder', 'biljoner', 'biljarder', 'triljoner'];

// Language-specific error messages
export const ERROR_MESSAGES = {
    NOT_A_NUMBER: 'Det angivna värdet är inte ett nummer',
    NUMBER_TOO_LARGE: 'För stort tal: högst 999 triljoner stöds',
};

// Language-specific text
export const LANGUAGE_TEXT = {
    NEGATIVE: 'minus',
    DECIMAL: 'komma',
};

/**
 * Converts the integer part of a number to words in Swedish
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

    // Process number in groups of 3 digits
    for (let i = 0; i < length; i++) {
        if (skipNext) {
            skipNext = false;
            continue;
        }

        const digit = parseInt(digits[i], 10);
        const position = length - i;

        // Handle different positions
        const positionInGroup = position % 3 || 3;
        const scaleIndex = Math.floor((position - 1) / 3);

        // Process hundreds
        if (positionInGroup === 3 && digit > 0) {
            result += `${DIGIT_NAMES[digit]}hundra`;
            // No space after hundred in Swedish
        }
        // Process tens
        else if (positionInGroup === 2) {
            if (digit === 1) {
                // Special case for 10-19
                const nextDigit = parseInt(digits[i + 1], 10);
                result += `${TEENS_NAMES[nextDigit]} `;
                skipNext = true;
            } else if (digit > 1) {
                // For numbers like 20, 30, etc.
                if (i + 1 < length && parseInt(digits[i + 1], 10) === 0) {
                    result += `${TENS_MULTIPLES[digit - 2]} `;
                } else {
                    // For numbers like 21, 35, etc.
                    result += `${TENS_MULTIPLES[digit - 2]}`;
                }
            }
        }
        // Process ones
        else if (positionInGroup === 1 && !skipNext) {
            // Special case for Swedish: When saying 1 in most positions, use "ett" except at the end of the number
            if (digit === 1) {
                if (scaleIndex === 0 || digit == 0) {
                    // At the end of the number use "ett"
                    result += `${DIGIT_NAMES[digit]} `;
                } else {
                    // In other places use "en" for 1 million, "en" for 1 billion etc.
                    result += 'en ';
                }
            } else if (digit > 0) {
                result += `${DIGIT_NAMES[digit]} `;
            }
        }

        // Add scale name (thousand, million, etc.) if this is the last digit in a group
        if (positionInGroup === 1 && scaleIndex > 0) {
            // Check if this group has any non-zero digit
            let hasNonZeroDigit = false;
            for (let j = 0; j < 3 && i - positionInGroup + 1 + j < length; j++) {
                if (parseInt(digits[i - positionInGroup + 1 + j], 10) !== 0) {
                    hasNonZeroDigit = true;
                    break;
                }
            }

            if (hasNonZeroDigit) {
                const groupValue = parseInt(integerPart.substring(length - position, length - position + 3), 10);
                const scaleName = groupValue === 1 ? SCALE_NAMES[scaleIndex] : SCALE_NAMES_PLURAL[scaleIndex];
                result += `${scaleName} `;
            }
        }
    }

    return result.trim();
}

/**
 * Converts the decimal part of a number to words in Swedish
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