/**
 * Japanese language implementation for number-to-word conversion
 */

// Translation maps
const DIGIT_NAMES: string[] = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
const TENS_MULTIPLES: string[] = ['十', '二十', '三十', '四十', '五十', '六十', '七十', '八十', '九十'];
const SCALE_NAMES: string[] = ['', '万', '億', '兆', '京'];

// Language-specific error messages
export const ERROR_MESSAGES = {
    NOT_A_NUMBER: '指定された値は数値ではありません',
    NUMBER_TOO_LARGE: '数値が大きすぎます：最大999兆まで対応しています',
};

// Language-specific text
export const LANGUAGE_TEXT = {
    NEGATIVE: 'マイナス',
    DECIMAL: '点',
};

/**
 * Converts the integer part of a number to words in Japanese
 */
export function convertIntegerPart(integerPart: string): string {
    if (integerPart === '0') return DIGIT_NAMES[0];

    // Remove leading zeros
    integerPart = integerPart.replace(/^0+/, '');
    if (integerPart === '') return DIGIT_NAMES[0];

    // Handle numbers up to 10^20
    const digits = integerPart.split('');
    const length = digits.length;
    let result = '';
    
    // Process in groups of 4 digits (Japanese number system uses 10,000 as base)
    for (let i = 0; i < length; i++) {
        const position = length - i;
        const digit = parseInt(digits[i], 10);
        
        // Skip zeros unless it's the only digit
        if (digit === 0 && (length > 1 || i > 0)) continue;
        
        // Calculate position within group and group index
        const positionInGroup = position % 4 || 4;
        const groupIndex = Math.floor((position - 1) / 4);
        
        // Add digit name (except for 1 in certain positions)
        if (digit === 1 && (positionInGroup === 2 || positionInGroup === 4)) {
            // For "一十" (10) and "一万" (10000), we omit the "一" in Japanese
        } else if (digit !== 0) {
            result += DIGIT_NAMES[digit];
        }
        
        // Add position name within the group
        if (digit !== 0) {
            if (positionInGroup === 2) {
                result += '十';
            } else if (positionInGroup === 3) {
                result += '百';
            } else if (positionInGroup === 4 && groupIndex > 0) {
                // For positions like 1000, 10000, etc., we say "千", "万", etc.
                result += '千';
            }
        }
        
        // Add group name (万, 億, 兆, etc.) at the end of each group of 4 digits
        if (positionInGroup === 1 && groupIndex > 0) {
            // Check if this group has any non-zero digit
            let hasNonZeroDigit = false;
            for (let j = 0; j < 4 && i - positionInGroup + 1 + j < length; j++) {
                if (parseInt(digits[i - positionInGroup + 1 + j], 10) !== 0) {
                    hasNonZeroDigit = true;
                    break;
                }
            }
            
            if (hasNonZeroDigit) {
                result += SCALE_NAMES[groupIndex];
            }
        }
    }

    return result || DIGIT_NAMES[0];
}

/**
 * Converts the decimal part of a number to words in Japanese
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
        result += DIGIT_NAMES[digit];
    }

    return result;
} 