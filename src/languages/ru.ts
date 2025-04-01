/**
 * Russian language implementation for number-to-word conversion
 */

// Translation maps
const DIGIT_NAMES: string[] = ['ноль', 'один', 'два', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять'];
const DIGIT_NAMES_FEMININE: string[] = ['ноль', 'одна', 'две', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять'];
const TEENS: string[] = ['десять', 'одиннадцать', 'двенадцать', 'тринадцать', 'четырнадцать', 'пятнадцать', 'шестнадцать', 'семнадцать', 'восемнадцать', 'девятнадцать'];
const TENS_MULTIPLES: string[] = ['двадцать', 'тридцать', 'сорок', 'пятьдесят', 'шестьдесят', 'семьдесят', 'восемьдесят', 'девяносто'];
const HUNDREDS: string[] = ['сто', 'двести', 'триста', 'четыреста', 'пятьсот', 'шестьсот', 'семьсот', 'восемьсот', 'девятьсот'];

// Scale names with correct grammatical forms
const THOUSAND: string[] = ['тысяча', 'тысячи', 'тысяч']; // Feminine gender
const MILLION: string[] = ['миллион', 'миллиона', 'миллионов']; // Masculine gender
const BILLION: string[] = ['миллиард', 'миллиарда', 'миллиардов']; // Masculine gender
const TRILLION: string[] = ['триллион', 'триллиона', 'триллионов']; // Masculine gender

// Language-specific error messages
export const ERROR_MESSAGES = {
    NOT_A_NUMBER: 'Предоставленное значение не является числом',
    NUMBER_TOO_LARGE: 'Слишком большое число: поддерживается максимум 999 триллионов',
};

// Language-specific text
export const LANGUAGE_TEXT = {
    NEGATIVE: 'минус',
    DECIMAL: 'целых',
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
 * Selects the correct grammatical form based on the number
 * Russian has 3 forms depending on the last digits
 */
function getNumberForm(value: number): number {
    value = Math.abs(value);
    const lastDigit = value % 10;
    const lastTwoDigits = value % 100;

    // For 11-19, use form 2
    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
        return 2;
    }

    // For 1, use form 0
    if (lastDigit === 1) {
        return 0;
    }

    // For 2-4, use form 1
    if (lastDigit >= 2 && lastDigit <= 4) {
        return 1;
    }

    // For 0, 5-9, use form 2
    return 2;
}

/**
 * Converts a three-digit group to words in Russian
 */
function convertGroup(digits: string, isFeminine = false): string {
    const value = parseInt(digits, 10);
    if (value === 0) return '';

    let result = '';

    // Handle hundreds
    if (digits.length === 3) {
        const hundred = parseInt(digits[0], 10);
        if (hundred > 0) {
            result += `${HUNDREDS[hundred - 1]} `;
        }
        digits = digits.substring(1);
    }

    // Handle tens and ones
    const num = parseInt(digits, 10);
    if (num >= 10 && num <= 19) {
        result += `${TEENS[num - 10]} `;
    } else {
        const ten = Math.floor(num / 10);
        const one = num % 10;

        if (ten > 0) {
            result += `${TENS_MULTIPLES[ten - 2]} `;
        }

        if (one > 0) {
            if (isFeminine) {
                result += `${DIGIT_NAMES_FEMININE[one]} `;
            } else {
                result += `${DIGIT_NAMES[one]} `;
            }
        }
    }

    return result;
}

/**
 * Converts the integer part of a number to words in Russian
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

        // Thousands are feminine in Russian
        const isFeminine = scaleIndex === 1;
        const groupText = convertGroup(groups[i], isFeminine);

        result += groupText;

        // Add scale name
        if (scaleIndex === 1) {
            const form = getNumberForm(groupValue);
            result += `${THOUSAND[form]} `;
        } else if (scaleIndex === 2) {
            const form = getNumberForm(groupValue);
            result += `${MILLION[form]} `;
        } else if (scaleIndex === 3) {
            const form = getNumberForm(groupValue);
            result += `${BILLION[form]} `;
        } else if (scaleIndex === 4) {
            const form = getNumberForm(groupValue);
            result += `${TRILLION[form]} `;
        }
    }

    return result.trim();
}

/**
 * Converts the decimal part of a number to words in Russian
 */
export function convertDecimalPart(decimalPart: string): string {
    if (!decimalPart || decimalPart === '0') return '';

    // Remove trailing zeros
    decimalPart = decimalPart.replace(/0+$/, '');
    if (decimalPart === '') return '';

    const decimalValue = parseInt(decimalPart, 10);

    // Get the correct Russian word for the decimal part
    let decimalName = '';
    if (decimalPart.length === 1) {
        decimalName = 'десятых';
    } else if (decimalPart.length === 2) {
        decimalName = 'сотых';
    } else if (decimalPart.length === 3) {
        decimalName = 'тысячных';
    } else {
        decimalName = `десятитысячных`;
    }

    const digits = decimalPart.split('');
    let result = '';

    for (let i = 0; i < digits.length; i++) {
        const digit = parseInt(digits[i], 10);
        result += `${DIGIT_NAMES[digit]} `;
    }

    return result.trim();
} 