/**
 * Multilingual number-to-word converter
 */
import { LanguageModule, getLanguage, isLanguageSupported, getSupportedLanguages, DEFAULT_LANGUAGE } from './languages';

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