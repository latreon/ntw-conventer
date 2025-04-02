/**
 * Polish language implementation for number-to-word conversion
 */

// Translation maps
const DIGIT_NAMES: string[] = ['zero', 'jeden', 'dwa', 'trzy', 'cztery', 'pięć', 'sześć', 'siedem', 'osiem', 'dziewięć'];
const TEENS_NAMES: string[] = ['dziesięć', 'jedenaście', 'dwanaście', 'trzynaście', 'czternaście', 'piętnaście', 'szesnaście', 'siedemnaście', 'osiemnaście', 'dziewiętnaście'];
const TENS_MULTIPLES: string[] = ['dwadzieścia', 'trzydzieści', 'czterdzieści', 'pięćdziesiąt', 'sześćdziesiąt', 'siedemdziesiąt', 'osiemdziesiąt', 'dziewięćdziesiąt'];
const HUNDREDS_NAMES: string[] = ['sto', 'dwieście', 'trzysta', 'czterysta', 'pięćset', 'sześćset', 'siedemset', 'osiemset', 'dziewięćset'];
const SCALE_NAMES: string[] = ['', 'tysiąc', 'milion', 'miliard', 'bilion', 'biliard', 'trylion'];
const SCALE_NAMES_PLURAL: string[] = ['', 'tysiące', 'miliony', 'miliardy', 'biliony', 'biliardy', 'tryliony'];
const SCALE_NAMES_GENITIVE: string[] = ['', 'tysięcy', 'milionów', 'miliardów', 'bilionów', 'biliardów', 'trylionów'];

// Language-specific error messages
export const ERROR_MESSAGES = {
    NOT_A_NUMBER: 'Podana wartość nie jest liczbą',
    NUMBER_TOO_LARGE: 'Zbyt duża liczba: maksymalnie obsługiwane jest 999 trylionów',
};

// Language-specific text
export const LANGUAGE_TEXT = {
    NEGATIVE: 'minus',
    DECIMAL: 'przecinek',
};

/**
 * Determines the plural form to use for scales in Polish
 */
function getScalePlural(value: number, digit: number): string {
    const lastTwoDigits = value % 100;
    
    if (lastTwoDigits >= 10 && lastTwoDigits <= 20) {
        // For numbers 11-19, use genitive plural
        return SCALE_NAMES_GENITIVE[digit];
    }
    
    const lastDigit = value % 10;
    
    if (lastDigit === 1) {
        // For numbers ending with 1 (except 11), use singular
        return SCALE_NAMES[digit];
    } else if (lastDigit >= 2 && lastDigit <= 4) {
        // For numbers ending with 2-4 (except 12-14), use plural form 1
        return SCALE_NAMES_PLURAL[digit];
    } else {
        // For numbers ending with 0, 5-9, use genitive plural
        return SCALE_NAMES_GENITIVE[digit];
    }
}

/**
 * Converts a number group (1-999) to words in Polish
 */
function convertGroup(group: number): string {
    if (group === 0) return '';
    
    let result = '';
    
    // Handle hundreds
    const hundreds = Math.floor(group / 100);
    if (hundreds > 0) {
        result += HUNDREDS_NAMES[hundreds - 1] + ' ';
    }
    
    // Handle tens and ones
    const tensAndOnes = group % 100;
    
    if (tensAndOnes >= 10 && tensAndOnes <= 19) {
        // Special case for 10-19
        result += TEENS_NAMES[tensAndOnes - 10];
    } else {
        // Handle tens (20-99)
        const tens = Math.floor(tensAndOnes / 10);
        if (tens > 1) {
            result += TENS_MULTIPLES[tens - 2] + ' ';
        }
        
        // Handle ones
        const ones = tensAndOnes % 10;
        if (ones > 0) {
            result += DIGIT_NAMES[ones];
        } else if (tens === 0 && hundreds === 0) {
            // If we have no hundreds, tens, or ones, we should return "zero"
            result += DIGIT_NAMES[0];
        }
    }
    
    return result.trim();
}

/**
 * Converts the integer part of a number to words in Polish
 */
export function convertIntegerPart(integerPart: string): string {
    if (integerPart === '0') return DIGIT_NAMES[0];
    
    // Remove leading zeros
    integerPart = integerPart.replace(/^0+/, '');
    if (integerPart === '') return DIGIT_NAMES[0];
    
    const num = parseInt(integerPart, 10);
    
    // Handle special case for 0
    if (num === 0) return DIGIT_NAMES[0];
    
    // Process number in groups of 3 digits
    const groups: number[] = [];
    let tempNum = num;
    
    while (tempNum > 0) {
        groups.push(tempNum % 1000);
        tempNum = Math.floor(tempNum / 1000);
    }
    
    let result = '';
    
    for (let i = groups.length - 1; i >= 0; i--) {
        const group = groups[i];
        
        if (group !== 0) {
            const groupStr = convertGroup(group);
            
            // Add scale name (thousand, million, etc.)
            if (i > 0) {
                const scaleName = getScalePlural(group, i);
                result += groupStr + ' ' + scaleName + ' ';
            } else {
                result += groupStr;
            }
        }
    }
    
    return result.trim();
}

/**
 * Converts the decimal part of a number to words in Polish
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