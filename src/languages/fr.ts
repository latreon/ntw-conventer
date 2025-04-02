/**
 * French language implementation for number-to-word conversion
 */

// Translation maps
const DIGIT_NAMES: string[] = ['zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf'];
const TEENS_NAMES: string[] = ['dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
const TENS_MULTIPLES: string[] = ['vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante-dix', 'quatre-vingt', 'quatre-vingt-dix'];
const SCALE_NAMES: string[] = ['', 'mille', 'million', 'milliard', 'billion', 'billiard', 'trillion'];
const SCALE_NAMES_PLURAL: string[] = ['', 'mille', 'millions', 'milliards', 'billions', 'billiards', 'trillions'];

// Language-specific error messages
export const ERROR_MESSAGES = {
    NOT_A_NUMBER: 'La valeur fournie n\'est pas un nombre',
    NUMBER_TOO_LARGE: 'Nombre trop grand: maximum de 999 billions pris en charge',
};

// Language-specific text
export const LANGUAGE_TEXT = {
    NEGATIVE: 'moins',
    DECIMAL: 'virgule',
};

/**
 * Gets the appropriate scale name based on the number
 */
function getScaleName(number: number, scaleIndex: number): string {
    // For "mille" (thousand), we never use plural in French
    if (scaleIndex === 1) return SCALE_NAMES[scaleIndex];
    
    if (number === 1) {
        return SCALE_NAMES[scaleIndex];
    } else {
        return SCALE_NAMES_PLURAL[scaleIndex];
    }
}

/**
 * French has special rules for 70-99
 * 70-79: soixante-dix, soixante-et-onze, soixante-douze, etc. (sixty-ten, sixty-and-eleven, sixty-twelve)
 * 90-99: quatre-vingt-dix, quatre-vingt-onze, etc. (four-twenty-ten, four-twenty-eleven)
 */
function handleSpecialTens(number: number): string {
    if (number >= 70 && number <= 79) {
        // 70-79: soixante-dix (60+10), soixante-et-onze (60+11), etc.
        return 'soixante-' + (number === 71 ? 'et-onze' : TEENS_NAMES[number - 70]);
    }
    
    if (number >= 90 && number <= 99) {
        // 90-99: quatre-vingt-dix (4*20+10), quatre-vingt-onze (4*20+11), etc.
        return 'quatre-vingt-' + TEENS_NAMES[number - 90];
    }
    
    return '';
}

/**
 * Converts a number from 1-99 to French words
 */
function convertTwoDigits(number: number): string {
    if (number === 0) return '';
    
    if (number < 10) {
        return DIGIT_NAMES[number];
    } else if (number < 20) {
        return TEENS_NAMES[number - 10];
    } else if (number === 21 || number === 31 || number === 41 || number === 51 || number === 61) {
        // Special case for numbers like 21, 31, 41, 51, 61 that use "et-un" (and-one)
        const tens = Math.floor(number / 10);
        return TENS_MULTIPLES[tens - 2] + '-et-un';
    } else if ((number >= 70 && number <= 79) || (number >= 90 && number <= 99)) {
        // Special case for 70-79 and 90-99
        return handleSpecialTens(number);
    } else {
        const tens = Math.floor(number / 10);
        const ones = number % 10;
        
        if (ones === 0) {
            if (number === 80) {
                // Special case for 80: quatre-vingts (with an 's')
                return 'quatre-vingts';
            }
            return TENS_MULTIPLES[tens - 2];
        } else {
            return TENS_MULTIPLES[tens - 2] + '-' + DIGIT_NAMES[ones];
        }
    }
}

/**
 * Converts a number from 100-999 to French words
 */
function convertThreeDigits(number: number): string {
    const hundreds = Math.floor(number / 100);
    const tensAndOnes = number % 100;
    
    let result = '';
    
    if (hundreds > 0) {
        if (hundreds === 1) {
            // For 100, we say "cent" not "un cent"
            result += 'cent';
        } else {
            result += DIGIT_NAMES[hundreds] + ' cent';
            // Special case for exact hundreds (200, 300, etc.) - add 's' in French
            if (tensAndOnes === 0 && hundreds > 1) {
                result += 's';
            }
        }
    }
    
    if (tensAndOnes > 0) {
        if (hundreds > 0) {
            result += ' ';
        }
        result += convertTwoDigits(tensAndOnes);
    }
    
    return result;
}

/**
 * Converts the integer part of a number to words in French
 */
export function convertIntegerPart(integerPart: string): string {
    if (integerPart === '0') return DIGIT_NAMES[0];
    
    // Remove leading zeros
    integerPart = integerPart.replace(/^0+/, '');
    if (integerPart === '') return DIGIT_NAMES[0];
    
    const number = parseInt(integerPart, 10);
    
    // Handle special case for 0
    if (number === 0) return DIGIT_NAMES[0];
    
    // Process number in groups of 3 digits
    const groups: number[] = [];
    let tempNum = number;
    
    while (tempNum > 0) {
        groups.push(tempNum % 1000);
        tempNum = Math.floor(tempNum / 1000);
    }
    
    let result = '';
    
    for (let i = groups.length - 1; i >= 0; i--) {
        const group = groups[i];
        
        if (group === 0) continue;
        
        if (i > 0) {
            // For scale groups (thousands, millions, etc.)
            if (i === 1) {
                // For thousands, we don't say "un mille", just "mille"
                if (group === 1) {
                    result += 'mille ';
                } else {
                    result += convertThreeDigits(group) + ' ' + getScaleName(group, i) + ' ';
                }
            } else {
                result += convertThreeDigits(group) + ' ' + getScaleName(group, i) + ' ';
            }
        } else {
            // For the ones group
            result += convertThreeDigits(group);
        }
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
        if (i > 0) result += ' ';
        result += DIGIT_NAMES[digit];
    }
    
    return result;
} 