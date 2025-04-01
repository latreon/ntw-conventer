/**
 * Multilingual number-to-word converter
 */
import { LanguageModule, getLanguage, isLanguageSupported, getSupportedLanguages, DEFAULT_LANGUAGE } from './languages';

/**
 * Azerbaijani translation maps for numbers
 */
const DIGIT_NAMES: string[] = ['sıfır', 'bir', 'iki', 'üç', 'dörd', 'beş', 'altı', 'yeddi', 'səkkiz', 'doqquz'];
const TENS_NAMES: string[] = ['on', 'on bir', 'on iki', 'on üç', 'on dörd', 'on beş', 'on altı', 'on yeddi', 'on səkkiz', 'on doqquz'];
const TENS_MULTIPLES: string[] = ['iyirmi', 'otuz', 'qırx', 'əlli', 'altmış', 'yetmiş', 'səksən', 'doxsan'];
const SCALE_NAMES: string[] = ['', 'min', 'milyon', 'milyard', 'trilyon'];

/**
 * Error messages
 */
const ERROR_MESSAGES = {
    NOT_A_NUMBER: 'Verilən dəyər rəqəm deyil',
    NUMBER_TOO_LARGE: 'Çox böyük rəqəm: maksimum 999 trilyon dəstəklənir',
};

/**
 * Configuration options for number conversion
 */
export interface ConversionOptions {
    /** Include the decimal point text (tam, point, etc.) for decimal numbers */
    includeDecimalText?: boolean;
    /** Capitalize the first letter of the result */
    capitalize?: boolean;
    /** The language code to use (ISO 639-1) */
    language?: string;
}

/**
 * Default configuration options
 */
const DEFAULT_OPTIONS: ConversionOptions = {
    includeDecimalText: true,
    capitalize: false,
    language: DEFAULT_LANGUAGE,
};

/**
 * Validates if the input is a valid number and within the supported range
 * @param input The input to validate
 * @param errorMessages Error messages in the selected language
 * @returns The validated number as a string or an error message
 */
function validateInput(input: number | string, errorMessages: LanguageModule['ERROR_MESSAGES']): string | Error {
    // Convert to string and clean up
    const numberStr = String(input).replace(/[\s,]/g, '');

    // Check if it's a valid number
    const numberValue = Number(numberStr);
    if (isNaN(numberValue)) {
        return new Error(errorMessages.NOT_A_NUMBER);
    }

    // Check if it's within the supported range
    if (Math.abs(numberValue) >= 1000000000000000) {
        return new Error(errorMessages.NUMBER_TOO_LARGE);
    }

    return numberStr;
}

/**
 * Converts a whole number part to words in Azerbaijani
 * @param integerPart The integer part of the number as a string
 * @returns The Azerbaijani word representation
 */
function convertIntegerPart(integerPart: string): string {
    if (integerPart === '0') return DIGIT_NAMES[0];

    // Remove leading zeros
    integerPart = integerPart.replace(/^0+/, '');
    if (integerPart === '') return DIGIT_NAMES[0];

    const digits = integerPart.split('');
    const length = digits.length;

    let result = '';
    let skipNext = false;

    for (let i = 0; i < length; i++) {
        if (skipNext) {
            skipNext = false;
            continue;
        }

        const digit = parseInt(digits[i], 10);
        const position = length - i;

        // Handle different positions
        const positionInGroup = position % 3;
        const scaleIndex = Math.floor((position - 1) / 3);

        // Process hundreds
        if (positionInGroup === 0 && digit > 0) {
            result += `${DIGIT_NAMES[digit]} yüz `;
        }
        // Process tens
        else if (positionInGroup === 2) {
            if (digit === 1) {
                // Special case for 10-19
                const nextDigit = parseInt(digits[i + 1], 10);
                result += `${TENS_NAMES[nextDigit]} `;
                skipNext = true;
            } else if (digit > 1) {
                result += `${TENS_MULTIPLES[digit - 2]} `;
            }
        }
        // Process ones
        else if (positionInGroup === 1 && !skipNext && digit > 0) {
            result += `${DIGIT_NAMES[digit]} `;
        }

        // Add scale name (thousand, million, etc.) if this is the last digit in a group
        // and the group has some non-zero value
        if (positionInGroup === 1 && scaleIndex > 0 && hasNonZeroDigit(digits, i - (positionInGroup - 1), 3)) {
            result += `${SCALE_NAMES[scaleIndex]} `;
        }
    }

    return result.trim();
}

/**
 * Checks if a range of digits has at least one non-zero value
 * @param digits Array of digits
 * @param start Starting index
 * @param length Length of the range to check
 * @returns True if there's a non-zero digit in the range
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
 * Converts the decimal part to words in Azerbaijani
 * @param decimalPart The decimal part of the number as a string
 * @returns The Azerbaijani word representation
 */
function convertDecimalPart(decimalPart: string): string {
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

/**
 * Converts a number to its word representation in the specified language
 * @param number The number to convert
 * @param options Configuration options
 * @returns The word representation in the specified language or an error message
 */
export function convertToWord(
    number: number | string,
    options?: ConversionOptions
): string {
    const mergedOptions = { ...DEFAULT_OPTIONS, ...options };

    // Get the language module
    const languageModule = getLanguage(mergedOptions.language || DEFAULT_LANGUAGE);

    // Validate input
    const validationResult = validateInput(number, languageModule.ERROR_MESSAGES);
    if (validationResult instanceof Error) {
        return validationResult.message;
    }

    const numberStr = validationResult;

    // Handle negative numbers
    const isNegative = numberStr.startsWith('-');
    const absNumberStr = isNegative ? numberStr.substring(1) : numberStr;

    // Split into integer and decimal parts
    const [integerPart, decimalPart] = absNumberStr.split('.');

    // Convert integer part
    let result = languageModule.convertIntegerPart(integerPart);

    // Convert decimal part if exists
    if (decimalPart && mergedOptions.includeDecimalText) {
        const decimalWords = languageModule.convertDecimalPart(decimalPart);
        if (decimalWords) {
            result += ` ${languageModule.LANGUAGE_TEXT.DECIMAL} ${decimalWords}`;
        }
    }

    // Add negative prefix if needed
    if (isNegative) {
        result = `${languageModule.LANGUAGE_TEXT.NEGATIVE} ${result}`;
    }

    // Capitalize if requested
    if (mergedOptions.capitalize) {
        result = result.charAt(0).toUpperCase() + result.slice(1);
    }

    return result;
}

// Export function to check if a language is supported
export const isSupportedLanguage = isLanguageSupported;

// Export function to get supported languages
export const getSupportedLanguageCodes = getSupportedLanguages;

// Export default and named functions
export default {
    convertToWord,
    isSupportedLanguage,
    getSupportedLanguageCodes,
}; 