/**
 * German language implementation for number-to-word conversion
 */

// Translation maps
const DIGIT_NAMES: string[] = ['null', 'ein', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun'];
const DIGIT_NAMES_STANDALONE: string[] = ['null', 'eins', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun'];
const TEENS_NAMES: string[] = ['zehn', 'elf', 'zwölf', 'dreizehn', 'vierzehn', 'fünfzehn', 'sechzehn', 'siebzehn', 'achtzehn', 'neunzehn'];
const TENS_MULTIPLES: string[] = ['zwanzig', 'dreißig', 'vierzig', 'fünfzig', 'sechzig', 'siebzig', 'achtzig', 'neunzig'];
const SCALE_NAMES: string[] = ['', 'tausend', 'Million', 'Milliarde', 'Billion', 'Billiarde', 'Trillion'];
const SCALE_NAMES_PLURAL: string[] = ['', 'tausend', 'Millionen', 'Milliarden', 'Billionen', 'Billiarden', 'Trillionen'];

// Language-specific error messages
export const ERROR_MESSAGES = {
    NOT_A_NUMBER: 'Der angegebene Wert ist keine Zahl',
    NUMBER_TOO_LARGE: 'Zahl zu groß: maximal 999 Billionen werden unterstützt',
};

// Language-specific text
export const LANGUAGE_TEXT = {
    NEGATIVE: 'minus',
    DECIMAL: 'Komma',
};

/**
 * Gets the appropriate scale name based on the number
 */
function getScaleName(number: number, scaleIndex: number): string {
    if (number === 1) {
        return SCALE_NAMES[scaleIndex];
    } else {
        return SCALE_NAMES_PLURAL[scaleIndex];
    }
}

/**
 * Converts a number from 1-99 to German words
 */
function convertTwoDigits(number: number, needsEins: boolean = false): string {
    if (number === 0) return '';
    
    if (number === 1 && needsEins) {
        return DIGIT_NAMES_STANDALONE[1]; // "eins" for standalone, not "ein"
    } else if (number < 10) {
        return DIGIT_NAMES[number];
    } else if (number < 20) {
        return TEENS_NAMES[number - 10];
    } else {
        const tens = Math.floor(number / 10);
        const ones = number % 10;
        
        if (ones === 0) {
            return TENS_MULTIPLES[tens - 2];
        } else {
            // In German, 21 is "einundzwanzig" (oneandtwenty)
            return DIGIT_NAMES[ones] + 'und' + TENS_MULTIPLES[tens - 2];
        }
    }
}

/**
 * Converts a number from 100-999 to German words
 */
function convertThreeDigits(number: number): string {
    const hundreds = Math.floor(number / 100);
    const tensAndOnes = number % 100;
    
    let result = '';
    
    if (hundreds > 0) {
        result += DIGIT_NAMES[hundreds] + 'hundert';
    }
    
    if (tensAndOnes > 0) {
        result += convertTwoDigits(tensAndOnes);
    }
    
    return result;
}

/**
 * Converts the integer part of a number to words in German
 */
export function convertIntegerPart(integerPart: string): string {
    if (integerPart === '0') return DIGIT_NAMES_STANDALONE[0];
    
    // Remove leading zeros
    integerPart = integerPart.replace(/^0+/, '');
    if (integerPart === '') return DIGIT_NAMES_STANDALONE[0];
    
    const number = parseInt(integerPart, 10);
    
    // Handle special case for 0
    if (number === 0) return DIGIT_NAMES_STANDALONE[0];
    
    // Handle special case for 1 as standalone
    if (number === 1) return DIGIT_NAMES_STANDALONE[1];
    
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
                // For thousands, we just say "eintausend", not "eine tausend"
                result += convertThreeDigits(group) + getScaleName(group, i);
            } else {
                // For millions and above, we add articles and endings
                if (group === 1) {
                    result += 'eine ' + getScaleName(group, i) + ' ';
                } else {
                    result += convertThreeDigits(group) + ' ' + getScaleName(group, i) + ' ';
                }
            }
        } else {
            // For the ones group
            result += convertThreeDigits(group);
        }
    }
    
    return result.trim();
}

/**
 * Converts the decimal part of a number to words in German
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
        // Use standalone forms for digits after decimal point
        result += DIGIT_NAMES_STANDALONE[digit];
    }
    
    return result;
}
