/**
 * Language module registry for number-to-word conversion
 */

import * as ar from './ar';
import * as az from './az';
import * as de from './de';
import * as en from './en';
import * as es from './es';
import * as fi from './fi';
import * as fr from './fr';
import * as hi from './hi';
import * as it from './it';
import * as ja from './ja';
import * as nl from './nl';
import * as pl from './pl';
import * as pt from './pt';
import * as ru from './ru';
import * as sv from './sv';
import * as tr from './tr';

// Language module interface
export interface LanguageModule {
    convertIntegerPart: (integerPart: string) => string;
    convertDecimalPart: (decimalPart: string) => string;
    ERROR_MESSAGES: {
        NOT_A_NUMBER: string;
        NUMBER_TOO_LARGE: string;
    };
    LANGUAGE_TEXT: {
        NEGATIVE: string;
        DECIMAL: string;
    };
}

// Available languages with their ISO 639-1 codes
export const languages: { [code: string]: LanguageModule } = {
    ar, // Arabic
    az, // Azerbaijani
    de, // German
    en, // English
    es, // Spanish
    fi, // Finnish
    fr, // French
    hi, // Hindi
    it, // Italian
    ja, // Japanese
    nl, // Dutch
    pl, // Polish
    pt, // Portuguese
    ru, // Russian
    sv, // Swedish
    tr, // Turkish
};

// Default language code
export const DEFAULT_LANGUAGE = 'en';

/**
 * Get a language module by its code
 * @param code The ISO 639-1 language code
 * @returns The language module or the default one if not found
 */
export function getLanguage(code: string): LanguageModule {
    const languageCode = code.toLowerCase();
    return languages[languageCode] || languages[DEFAULT_LANGUAGE];
}

/**
 * Check if a language is supported
 * @param code The ISO 639-1 language code
 * @returns True if the language is supported
 */
export function isLanguageSupported(code: string): boolean {
    return code.toLowerCase() in languages;
}

/**
 * Get a list of all supported language codes
 * @returns Array of supported language codes
 */
export function getSupportedLanguages(): string[] {
    return Object.keys(languages);
} 