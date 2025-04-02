/**
 * English language implementation for number-to-word conversion
 */

// Translation maps
const DIGIT_NAMES: string[] = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const TEENS_NAMES: string[] = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS_MULTIPLES: string[] = ['twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const SCALE_NAMES: string[] = ['', 'thousand', 'million', 'billion', 'trillion'];

// Language-specific error messages
export const ERROR_MESSAGES = {
    NOT_A_NUMBER: 'The provided value is not a number',
    NUMBER_TOO_LARGE: 'Number too large: maximum of 999 trillion is supported',
};

// Language-specific text
export const LANGUAGE_TEXT = {
    NEGATIVE: 'negative',
    DECIMAL: 'point',
};

/**
 * Converts a number from 1-99 to English words
 */
function convertTwoDigits(number: number): string {
    if (number === 0) return '';
    
    if (number < 10) {
        return DIGIT_NAMES[number];
    } else if (number < 20) {
        return TEENS_NAMES[number - 10];
    } else {
        const tens = Math.floor(number / 10);
        const ones = number % 10;
        
        if (ones === 0) {
            return TENS_MULTIPLES[tens - 2];
        } else {
            return TENS_MULTIPLES[tens - 2] + '-' + DIGIT_NAMES[ones];
        }
    }
}

/**
 * Converts a number from 1-999 to English words
 */
function convertThreeDigits(number: number): string {
    if (number === 0) return '';
    
    const hundreds = Math.floor(number / 100);
    const tensAndOnes = number % 100;
    
    let result = '';
    
    if (hundreds > 0) {
        result += DIGIT_NAMES[hundreds] + ' hundred';
        if (tensAndOnes > 0) {
            result += ' ';
        }
    }
    
    if (tensAndOnes > 0) {
        result += convertTwoDigits(tensAndOnes);
    }
    
    return result;
}

/**
 * Converts the integer part of a number to words in English
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
        
        const groupStr = convertThreeDigits(group);
        if (i > 0) {
            result += groupStr + ' ' + SCALE_NAMES[i] + ' ';
        } else {
            result += groupStr;
        }
    }
    
    return result.trim();
}

/**
 * Converts the decimal part of a number to words in English
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
