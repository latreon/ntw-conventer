/**
 * Azerbaijani language implementation for number-to-word conversion
 */

// Translation maps
const DIGIT_NAMES: string[] = ['sıfır', 'bir', 'iki', 'üç', 'dörd', 'beş', 'altı', 'yeddi', 'səkkiz', 'doqquz'];
const TEENS_NAMES: string[] = ['on', 'on bir', 'on iki', 'on üç', 'on dörd', 'on beş', 'on altı', 'on yeddi', 'on səkkiz', 'on doqquz'];
const TENS_MULTIPLES: string[] = ['iyirmi', 'otuz', 'qırx', 'əlli', 'altmış', 'yetmiş', 'səksən', 'doxsan'];
const SCALE_NAMES: string[] = ['', 'min', 'milyon', 'milyard', 'trilyon'];

// Language-specific error messages
export const ERROR_MESSAGES = {
    NOT_A_NUMBER: 'Verilən dəyər bir rəqəm deyil',
    NUMBER_TOO_LARGE: 'Çox böyük nömrə: maksimum 999 trilyon dəstəklənir',
};

// Language-specific text
export const LANGUAGE_TEXT = {
    NEGATIVE: 'mənfi',
    DECIMAL: 'tam',
};

/**
 * Converts a number from 1-99 to Azerbaijani words
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
            return TENS_MULTIPLES[tens - 2] + ' ' + DIGIT_NAMES[ones];
        }
    }
}

/**
 * Converts a number from 100-999 to Azerbaijani words
 */
function convertThreeDigits(number: number): string {
    if (number === 0) return '';
    
    const hundreds = Math.floor(number / 100);
    const tensAndOnes = number % 100;
    
    let result = '';
    
    if (hundreds > 0) {
        result += DIGIT_NAMES[hundreds] + ' yüz';
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
 * Converts the integer part of a number to words in Azerbaijani
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
            // For scale groups (thousands, millions, etc.)
            result += groupStr + ' ' + SCALE_NAMES[i] + ' ';
        } else {
            // For the ones group
            result += groupStr;
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
        if (i > 0) result += ' ';
        result += DIGIT_NAMES[digit];
    }
    
    return result;
} 