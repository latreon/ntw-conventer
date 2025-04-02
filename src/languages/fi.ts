/**
 * Finnish language implementation for number-to-word conversion
 */

// Translation maps
const DIGIT_NAMES: string[] = ['nolla', 'yksi', 'kaksi', 'kolme', 'neljä', 'viisi', 'kuusi', 'seitsemän', 'kahdeksan', 'yhdeksän'];
const TEENS_NAMES: string[] = ['kymmenen', 'yksitoista', 'kaksitoista', 'kolmetoista', 'neljätoista', 'viisitoista', 'kuusitoista', 'seitsemäntoista', 'kahdeksantoista', 'yhdeksäntoista'];
const TENS_PREFIXES: string[] = ['', '', 'kaksi', 'kolme', 'neljä', 'viisi', 'kuusi', 'seitsemän', 'kahdeksan', 'yhdeksän'];
const SCALE_NAMES: string[] = ['', 'tuhat', 'miljoona', 'miljardi', 'biljoona', 'triljoona'];
const SCALE_NAMES_PARTITIVE: string[] = ['', 'tuhatta', 'miljoonaa', 'miljardia', 'biljoonaa', 'triljoonaa'];

// Language-specific error messages
export const ERROR_MESSAGES = {
    NOT_A_NUMBER: 'Annettu arvo ei ole numero',
    NUMBER_TOO_LARGE: 'Liian suuri luku: enintään 999 triljoonaa tuetaan',
};

// Language-specific text
export const LANGUAGE_TEXT = {
    NEGATIVE: 'miinus',
    DECIMAL: 'pilkku',
};

/**
 * Chooses the correct form of the scale name in Finnish (nominative or partitive)
 * @param num The number for which to choose the scale name
 * @param scaleIndex The index of the scale
 * @returns The appropriate scale name
 */
function getScaleName(num: number, scaleIndex: number): string {
    if (num === 1) {
        return SCALE_NAMES[scaleIndex]; // Nominative for exactly 1
    } else {
        return SCALE_NAMES_PARTITIVE[scaleIndex]; // Partitive for other numbers
    }
}

/**
 * Converts a group of up to three digits to words in Finnish
 * @param group A number between 0 and 999
 * @returns The Finnish word representation of the group
 */
function convertGroup(group: number): string {
    if (group === 0) return '';
    
    let result = '';
    
    // Handle hundreds
    const hundreds = Math.floor(group / 100);
    if (hundreds > 0) {
        if (hundreds === 1) {
            result += 'sata'; // One hundred is just "sata"
        } else {
            result += DIGIT_NAMES[hundreds] + 'sataa'; // Others are "kaksisataa", "kolmesataa", etc.
        }
    }
    
    // Handle tens and ones
    const tensAndOnes = group % 100;
    
    if (tensAndOnes > 0) {
        if (hundreds > 0) result += ' '; // Add space if we already have hundreds
        
        if (tensAndOnes < 10) {
            // Single digit
            result += DIGIT_NAMES[tensAndOnes];
        } else if (tensAndOnes < 20) {
            // Teens (11-19)
            result += TEENS_NAMES[tensAndOnes - 10];
        } else {
            // Greater than 19
            const tens = Math.floor(tensAndOnes / 10);
            const ones = tensAndOnes % 10;
            
            if (ones === 0) {
                // Exact tens (20, 30, etc.)
                result += TENS_PREFIXES[tens] + 'kymmentä';
            } else {
                // Tens with ones (21, 32, etc.)
                result += TENS_PREFIXES[tens] + 'kymmentä' + ' ' + DIGIT_NAMES[ones];
            }
        }
    }
    
    return result;
}

/**
 * Converts the integer part of a number to words in Finnish
 */
export function convertIntegerPart(integerPart: string): string {
    if (integerPart === '0') return DIGIT_NAMES[0];
    
    // Remove leading zeros
    integerPart = integerPart.replace(/^0+/, '');
    if (integerPart === '') return DIGIT_NAMES[0];
    
    const number = BigInt(integerPart);
    
    // Handle special case for 0
    if (number === 0n) return DIGIT_NAMES[0];
    
    // Process number in groups of 3 digits
    const groups: number[] = [];
    let tempNum = Number(number);
    
    while (tempNum > 0) {
        groups.push(tempNum % 1000);
        tempNum = Math.floor(tempNum / 1000);
    }
    
    let result = '';
    
    for (let i = groups.length - 1; i >= 0; i--) {
        const group = groups[i];
        
        if (group !== 0) {
            // For thousand and above, we need special handling
            if (i > 0) {
                if (group === 1) {
                    // For "yksi tuhat", we just say "tuhat"
                    if (i === 1) {
                        result += getScaleName(group, i) + ' ';
                    } else {
                        // For "yksi miljoona", etc.
                        result += DIGIT_NAMES[group] + ' ' + getScaleName(group, i) + ' ';
                    }
                } else {
                    // For other numbers with scales
                    result += convertGroup(group) + ' ' + getScaleName(group, i) + ' ';
                }
            } else {
                // No scale for the ones position
                result += convertGroup(group);
            }
        }
    }
    
    return result.trim();
}

/**
 * Converts the decimal part of a number to words in Finnish
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