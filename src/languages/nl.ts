/**
 * Dutch language implementation for number-to-word conversion
 */

// Translation maps
const DIGIT_NAMES: string[] = ['nul', 'een', 'twee', 'drie', 'vier', 'vijf', 'zes', 'zeven', 'acht', 'negen'];
const TEENS: string[] = ['tien', 'elf', 'twaalf', 'dertien', 'veertien', 'vijftien', 'zestien', 'zeventien', 'achttien', 'negentien'];
const TENS_MULTIPLES: string[] = ['twintig', 'dertig', 'veertig', 'vijftig', 'zestig', 'zeventig', 'tachtig', 'negentig'];
const SCALE_NAMES: string[] = ['', 'duizend', 'miljoen', 'miljard', 'biljoen'];

// Language-specific error messages
export const ERROR_MESSAGES = {
    NOT_A_NUMBER: 'De opgegeven waarde is geen getal',
    NUMBER_TOO_LARGE: 'Getal te groot: maximaal 999 biljoen wordt ondersteund',
};

// Language-specific text
export const LANGUAGE_TEXT = {
    NEGATIVE: 'negatief',
    DECIMAL: 'komma',
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
 * Converts a two-digit number to words in Dutch
 */
function convertTwoDigits(value: number): string {
    if (value < 10) {
        return DIGIT_NAMES[value];
    } else if (value < 20) {
        return TEENS[value - 10];
    } else {
        const ten = Math.floor(value / 10);
        const one = value % 10;

        if (one === 0) {
            return TENS_MULTIPLES[ten - 2];
        } else {
            // In Dutch, we say "one and twenty" instead of "twenty-one"
            return `${DIGIT_NAMES[one]}en${TENS_MULTIPLES[ten - 2]}`;
        }
    }
}

/**
 * Converts the integer part of a number to words in Dutch
 */
export function convertIntegerPart(integerPart: string): string {
    if (integerPart === '0') return DIGIT_NAMES[0];

    // Remove leading zeros
    integerPart = integerPart.replace(/^0+/, '');
    if (integerPart === '') return DIGIT_NAMES[0];

    // Split into groups of 3 digits, from right to left
    const groups: string[] = [];
    let currentGroup = '';
    for (let i = integerPart.length - 1; i >= 0; i--) {
        currentGroup = integerPart[i] + currentGroup;
        if (currentGroup.length === 3 || i === 0) {
            groups.push(currentGroup);
            currentGroup = '';
        }
    }

    let result = '';

    // Process each group
    for (let i = groups.length - 1; i >= 0; i--) {
        const scaleIndex = i;
        const groupValue = parseInt(groups[i], 10);

        if (groupValue === 0) continue;

        // Convert the group
        let groupText = '';

        // Handle hundreds
        const hundred = Math.floor(groupValue / 100);
        if (hundred > 0) {
            if (hundred === 1) {
                groupText += 'honderd';
            } else {
                groupText += `${DIGIT_NAMES[hundred]}honderd`;
            }
        }

        // Handle tens and ones
        const remainder = groupValue % 100;
        if (remainder > 0) {
            if (groupText.length > 0) {
                groupText += remainder < 10 ? 'en' : '';
            }
            groupText += convertTwoDigits(remainder);
        }

        // Add scale name if applicable
        if (scaleIndex > 0 && groupValue > 0) {
            // For Dutch, we need to handle some special cases
            if (scaleIndex === 1) {
                // For thousands
                result += `${groupText}${groupText ? '' : ''}${SCALE_NAMES[scaleIndex]} `;
            } else {
                // For millions and above
                result += `${groupText} ${SCALE_NAMES[scaleIndex]} `;
            }
        } else {
            result += `${groupText} `;
        }
    }

    return result.trim();
}

/**
 * Converts the decimal part of a number to words in Dutch
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