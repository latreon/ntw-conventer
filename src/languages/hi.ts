/**
 * Hindi language implementation for number-to-word conversion
 */

// Translation maps
const DIGIT_NAMES: string[] = ['शून्य', 'एक', 'दो', 'तीन', 'चार', 'पांच', 'छह', 'सात', 'आठ', 'नौ'];
const TEENS_NAMES: string[] = ['दस', 'ग्यारह', 'बारह', 'तेरह', 'चौदह', 'पंद्रह', 'सोलह', 'सत्रह', 'अठारह', 'उन्नीस'];
const TENS_MULTIPLES: string[] = ['बीस', 'तीस', 'चालीस', 'पचास', 'साठ', 'सत्तर', 'अस्सी', 'नब्बे'];
const TENS_PLUS_NAMES: string[] = [
    ['इक्कीस', 'बाईस', 'तेईस', 'चौबीस', 'पच्चीस', 'छब्बीस', 'सत्ताईस', 'अट्ठाईस', 'उनतीस'],
    ['इकतीस', 'बत्तीस', 'तैंतीस', 'चौंतीस', 'पैंतीस', 'छत्तीस', 'सैंतीस', 'अड़तीस', 'उनतालीस'],
    ['इकतालीस', 'बयालीस', 'तैंतालीस', 'चवालीस', 'पैंतालीस', 'छियालीस', 'सैंतालीस', 'अड़तालीस', 'उनचास'],
    ['इक्यावन', 'बावन', 'तिरपन', 'चौवन', 'पचपन', 'छप्पन', 'सत्तावन', 'अट्ठावन', 'उनसठ'],
    ['इकसठ', 'बासठ', 'तिरसठ', 'चौंसठ', 'पैंसठ', 'छियासठ', 'सड़सठ', 'अड़सठ', 'उनहत्तर'],
    ['इकहत्तर', 'बहत्तर', 'तिहत्तर', 'चौहत्तर', 'पचहत्तर', 'छिहत्तर', 'सतहत्तर', 'अठहत्तर', 'उन्यासी'],
    ['इक्यासी', 'बयासी', 'तिरासी', 'चौरासी', 'पचासी', 'छियासी', 'सत्तासी', 'अट्ठासी', 'नवासी'],
    ['इक्यानवे', 'बानवे', 'तिरानवे', 'चौरानवे', 'पचानवे', 'छियानवे', 'सत्तानवे', 'अट्ठानवे', 'निन्यानवे'],
];
const SCALE_NAMES: string[] = ['', 'सौ', 'हज़ार', 'लाख', 'करोड़', 'अरब', 'खरब'];

// Language-specific error messages
export const ERROR_MESSAGES = {
    NOT_A_NUMBER: 'दिया गया मान एक संख्या नहीं है',
    NUMBER_TOO_LARGE: 'बहुत बड़ी संख्या: अधिकतम 999 खरब समर्थित है',
};

// Language-specific text
export const LANGUAGE_TEXT = {
    NEGATIVE: 'ऋण',
    DECIMAL: 'दशमलव',
};

/**
 * Converts a number from 1-99 to Hindi words
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
            // Hindi has specific words for numbers like 21, 22, etc.
            return TENS_PLUS_NAMES[tens - 2][ones - 1];
        }
    }
}

/**
 * Converts the integer part of a number to words in Hindi
 * Hindi numbering system: 1, 10, 100, 1000, 10K=lakh, 1M=10lakh, 10M=crore
 */
export function convertIntegerPart(integerPart: string): string {
    if (integerPart === '0') return DIGIT_NAMES[0];
    
    // Remove leading zeros
    integerPart = integerPart.replace(/^0+/, '');
    if (integerPart === '') return DIGIT_NAMES[0];
    
    const num = parseInt(integerPart, 10);
    
    // Handle special case for 0
    if (num === 0) return DIGIT_NAMES[0];
    
    // Handle special cases for small numbers
    if (num <= 99) {
        return convertTwoDigits(num);
    }
    
    let result = '';
    let remaining = num;
    
    // Handle hundreds (सौ)
    const hundreds = Math.floor(remaining / 100) % 10;
    if (hundreds > 0) {
        result += DIGIT_NAMES[hundreds] + ' ' + SCALE_NAMES[1] + ' ';
        remaining %= 100;
    }
    
    // Handle thousands (हज़ार)
    const thousands = Math.floor(num / 1000) % 100;
    if (thousands > 0) {
        if (thousands <= 99) {
            result += convertTwoDigits(thousands) + ' ' + SCALE_NAMES[2] + ' ';
        }
        remaining %= 1000;
    }
    
    // Handle lakhs (लाख) - hundred thousand
    const lakhs = Math.floor(num / 100000) % 100;
    if (lakhs > 0) {
        if (lakhs <= 99) {
            result += convertTwoDigits(lakhs) + ' ' + SCALE_NAMES[3] + ' ';
        }
        remaining %= 100000;
    }
    
    // Handle crores (करोड़) - ten million
    const crores = Math.floor(num / 10000000) % 100;
    if (crores > 0) {
        if (crores <= 99) {
            result += convertTwoDigits(crores) + ' ' + SCALE_NAMES[4] + ' ';
        }
        remaining %= 10000000;
    }
    
    // Handle arabs (अरब) - billion
    const arabs = Math.floor(num / 1000000000) % 100;
    if (arabs > 0) {
        if (arabs <= 99) {
            result += convertTwoDigits(arabs) + ' ' + SCALE_NAMES[5] + ' ';
        }
        remaining %= 1000000000;
    }
    
    // Handle kharabs (खरब) - hundred billion
    const kharabs = Math.floor(num / 100000000000) % 100;
    if (kharabs > 0) {
        if (kharabs <= 99) {
            result += convertTwoDigits(kharabs) + ' ' + SCALE_NAMES[6] + ' ';
        }
    }
    
    // Add remaining digits (1-99)
    if (remaining > 0 && remaining <= 99) {
        result += convertTwoDigits(remaining);
    }
    
    return result.trim();
}

/**
 * Converts the decimal part of a number to words in Hindi
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