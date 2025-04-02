/**
 * Arabic language implementation for number-to-word conversion
 */

// Translation maps
const DIGIT_NAMES: string[] = ['صفر', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة'];
const DIGIT_NAMES_FEMININE: string[] = ['صفر', 'واحدة', 'اثنتان', 'ثلاث', 'أربع', 'خمس', 'ست', 'سبع', 'ثمان', 'تسع'];
const TENS_NAMES: string[] = ['عشرة', 'أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر', 'ستة عشر', 'سبعة عشر', 'ثمانية عشر', 'تسعة عشر'];
const TENS_NAMES_FEMININE: string[] = ['عشر', 'إحدى عشرة', 'اثنتا عشرة', 'ثلاث عشرة', 'أربع عشرة', 'خمس عشرة', 'ست عشرة', 'سبع عشرة', 'ثمان عشرة', 'تسع عشرة'];
const TENS_MULTIPLES: string[] = ['عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];
const HUNDREDS_NAMES: string[] = ['مائة', 'مائتان', 'ثلاثمائة', 'أربعمائة', 'خمسمائة', 'ستمائة', 'سبعمائة', 'ثمانمائة', 'تسعمائة'];
const SCALE_NAMES: string[] = ['', 'ألف', 'مليون', 'مليار', 'تريليون'];
const SCALE_NAMES_DUAL: string[] = ['', 'ألفان', 'مليونان', 'ملياران', 'تريليونان'];
const SCALE_NAMES_PLURAL: string[] = ['', 'آلاف', 'ملايين', 'مليارات', 'تريليونات'];
const SCALE_NAMES_GENITIVE: string[] = ['', 'ألف', 'مليون', 'مليار', 'تريليون'];

// Language-specific error messages
export const ERROR_MESSAGES = {
    NOT_A_NUMBER: 'القيمة المقدمة ليست رقما',
    NUMBER_TOO_LARGE: 'الرقم كبير جدا: الحد الأقصى المدعوم هو 999 تريليون',
};

// Language-specific text
export const LANGUAGE_TEXT = {
    NEGATIVE: 'سالب',
    DECIMAL: 'فاصلة',
};

/**
 * Gets the appropriate scale name based on the number
 */
function getScaleName(number: number, index: number): string {
    if (number === 1) {
        return SCALE_NAMES[index];
    } else if (number === 2) {
        return SCALE_NAMES_DUAL[index];
    } else if (number >= 3 && number <= 10) {
        return SCALE_NAMES_PLURAL[index];
    } else {
        return SCALE_NAMES_GENITIVE[index];
    }
}

/**
 * Converts a number from 1-99 to Arabic words
 */
function convertTwoDigits(number: number, isFeminine: boolean = false): string {
    if (number === 0) return '';
    
    if (number < 10) {
        return isFeminine ? DIGIT_NAMES_FEMININE[number] : DIGIT_NAMES[number];
    } else if (number < 20) {
        return isFeminine ? TENS_NAMES_FEMININE[number - 10] : TENS_NAMES[number - 10];
    } else {
        const tens = Math.floor(number / 10);
        const ones = number % 10;
        
        if (ones === 0) {
            return TENS_MULTIPLES[tens - 2];
        } else {
            const onesWord = isFeminine ? DIGIT_NAMES_FEMININE[ones] : DIGIT_NAMES[ones];
            return onesWord + ' و' + TENS_MULTIPLES[tens - 2];
        }
    }
}

/**
 * Converts a number from 100-999 to Arabic words
 */
function convertThreeDigits(number: number): string {
    const hundreds = Math.floor(number / 100);
    const tensAndOnes = number % 100;
    
    let result = '';
    
    if (hundreds > 0) {
        result += HUNDREDS_NAMES[hundreds - 1];
    }
    
    if (tensAndOnes > 0) {
        if (hundreds > 0) {
            result += ' و';
        }
        result += convertTwoDigits(tensAndOnes);
    }
    
    return result;
}

/**
 * Converts the integer part of a number to words in Arabic
 */
export function convertIntegerPart(integerPart: string): string {
    if (integerPart === '0') return DIGIT_NAMES[0];
    
    // Remove leading zeros
    integerPart = integerPart.replace(/^0+/, '');
    if (integerPart === '') return DIGIT_NAMES[0];
    
    const number = parseInt(integerPart, 10);
    
    // Special case for zero
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
            if (group === 1) {
                // For "1 thousand", "1 million", etc.
                result += getScaleName(1, i);
            } else if (group === 2) {
                // For "2 thousand", "2 million", etc.
                result += getScaleName(2, i);
            } else if (group >= 3 && group <= 10) {
                // For 3-10 thousand, million, etc.
                result += convertThreeDigits(group) + ' ' + getScaleName(group, i);
            } else {
                // For 11+ thousand, million, etc.
                result += convertThreeDigits(group) + ' ' + getScaleName(11, i);
            }
            
            if (i > 0 && groups[i - 1] > 0) {
                result += ' و';
            }
        } else {
            // For the ones group (no scale)
            result += convertThreeDigits(group);
        }
    }
    
    return result;
}

/**
 * Converts the decimal part of a number to words in Arabic
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