/**
 * Portuguese language implementation for number-to-word conversion
 */

// Translation maps
const DIGIT_NAMES: string[] = ['zero', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove'];
const DIGIT_NAMES_FEMININE: string[] = ['zero', 'uma', 'duas', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove'];
const TEENS: string[] = ['dez', 'onze', 'doze', 'treze', 'catorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'];
const TENS_MULTIPLES: string[] = ['vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
const HUNDREDS: string[] = ['cem', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos'];
const HUNDREDS_FEMININE: string[] = ['cem', 'duzentas', 'trezentas', 'quatrocentas', 'quinhentas', 'seiscentas', 'setecentas', 'oitocentas', 'novecentas'];
const SCALE_NAMES: string[] = ['', 'mil', 'milhão', 'bilhão', 'trilhão'];
const SCALE_NAMES_PLURAL: string[] = ['', 'mil', 'milhões', 'bilhões', 'trilhões'];

// Language-specific error messages
export const ERROR_MESSAGES = {
    NOT_A_NUMBER: 'O valor fornecido não é um número',
    NUMBER_TOO_LARGE: 'Número muito grande: o máximo suportado é 999 trilhões',
};

// Language-specific text
export const LANGUAGE_TEXT = {
    NEGATIVE: 'negativo',
    DECIMAL: 'vírgula',
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
 * Converts a three-digit group to words in Portuguese
 */
function convertGroup(value: number, isFeminine = false): string {
    if (value === 0) return '';

    const hundreds = Math.floor(value / 100);
    const tens = Math.floor((value % 100) / 10);
    const ones = value % 10;

    let result = '';

    // Handle hundreds
    if (hundreds > 0) {
        if (hundreds === 1 && (tens > 0 || ones > 0)) {
            result += 'cento ';
        } else {
            result += `${isFeminine ? HUNDREDS_FEMININE[hundreds - 1] : HUNDREDS[hundreds - 1]} `;
        }
    }

    // Handle tens and ones
    if (tens === 1) {
        // Special case for 10-19
        result += `${TEENS[ones]} `;
    } else if (tens > 1) {
        result += `${TENS_MULTIPLES[tens - 2]} `;
        if (ones > 0) {
            result += `e ${isFeminine ? DIGIT_NAMES_FEMININE[ones] : DIGIT_NAMES[ones]} `;
        }
    } else if (ones > 0) {
        result += `${isFeminine ? DIGIT_NAMES_FEMININE[ones] : DIGIT_NAMES[ones]} `;
    }

    return result;
}

/**
 * Converts the integer part of a number to words in Portuguese
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

        // Determine if we need "e" between values
        if (result && (groupValue < 100 || scaleIndex === 0)) {
            result += 'e ';
        }

        // Convert the group
        const isFeminine = false; // Default to masculine
        result += convertGroup(groupValue, isFeminine);

        // Add scale name
        if (scaleIndex > 0) {
            if (groupValue === 1 && scaleIndex > 1) {
                result += `${SCALE_NAMES[scaleIndex]} `;
            } else {
                result += `${SCALE_NAMES_PLURAL[scaleIndex]} `;
            }
        }
    }

    return result.trim();
}

/**
 * Converts the decimal part of a number to words in Portuguese
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