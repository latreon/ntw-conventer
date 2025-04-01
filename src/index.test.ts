import { convertToWord, isSupportedLanguage, getSupportedLanguageCodes } from './index';

describe('convertToWord - Azerbaijani', () => {
    const azOptions = { language: 'az' };

    test('should convert zero correctly', () => {
        expect(convertToWord(0, azOptions)).toBe('sıfır');
    });

    test('should convert single digits correctly', () => {
        expect(convertToWord(1, azOptions)).toBe('bir');
        expect(convertToWord(5, azOptions)).toBe('beş');
        expect(convertToWord(9, azOptions)).toBe('doqquz');
    });

    test('should convert teen numbers correctly', () => {
        expect(convertToWord(10, azOptions)).toBe('on');
        expect(convertToWord(13, azOptions)).toBe('on üç');
        expect(convertToWord(19, azOptions)).toBe('on doqquz');
    });

    test('should convert tens correctly', () => {
        expect(convertToWord(20, azOptions)).toBe('iyirmi');
        expect(convertToWord(50, azOptions)).toBe('əlli');
        expect(convertToWord(99, azOptions)).toBe('doxsan doqquz');
    });

    test('should convert hundreds correctly', () => {
        expect(convertToWord(100, azOptions)).toBe('bir yüz');
        expect(convertToWord(101, azOptions)).toBe('bir yüz bir');
        expect(convertToWord(110, azOptions)).toBe('bir yüz on');
        expect(convertToWord(199, azOptions)).toBe('bir yüz doxsan doqquz');
        expect(convertToWord(999, azOptions)).toBe('doqquz yüz doxsan doqquz');
    });

    test('should convert thousands correctly', () => {
        expect(convertToWord(1000, azOptions)).toBe('bir min');
        expect(convertToWord(1001, azOptions)).toBe('bir min bir');
        expect(convertToWord(1100, azOptions)).toBe('bir min bir yüz');
        expect(convertToWord(2345, azOptions)).toBe('iki min üç yüz qırx beş');
        expect(convertToWord(10000, azOptions)).toBe('on min');
        expect(convertToWord(999999, azOptions)).toBe('doqquz yüz doxsan doqquz min doqquz yüz doxsan doqquz');
    });

    test('should handle decimal numbers correctly', () => {
        expect(convertToWord(1.5, azOptions)).toBe('bir tam beş');
        expect(convertToWord(100.01, azOptions)).toBe('bir yüz tam sıfır bir');
        expect(convertToWord(0.123, azOptions)).toBe('sıfır tam bir iki üç');
    });

    test('should handle negative numbers correctly', () => {
        expect(convertToWord(-1, azOptions)).toBe('mənfi bir');
        expect(convertToWord(-1000, azOptions)).toBe('mənfi bir min');
        expect(convertToWord(-1.5, azOptions)).toBe('mənfi bir tam beş');
    });
});

describe('convertToWord - English', () => {
    const enOptions = { language: 'en' };

    test('should convert zero correctly', () => {
        expect(convertToWord(0, enOptions)).toBe('zero');
    });

    test('should convert single digits correctly', () => {
        expect(convertToWord(1, enOptions)).toBe('one');
        expect(convertToWord(5, enOptions)).toBe('five');
        expect(convertToWord(9, enOptions)).toBe('nine');
    });

    test('should convert teen numbers correctly', () => {
        expect(convertToWord(10, enOptions)).toBe('ten');
        expect(convertToWord(13, enOptions)).toBe('thirteen');
        expect(convertToWord(19, enOptions)).toBe('nineteen');
    });

    test('should convert tens correctly', () => {
        expect(convertToWord(20, enOptions)).toBe('twenty');
        expect(convertToWord(50, enOptions)).toBe('fifty');
        expect(convertToWord(99, enOptions)).toBe('ninety-nine');
    });

    test('should convert hundreds correctly', () => {
        expect(convertToWord(100, enOptions)).toBe('one hundred');
        expect(convertToWord(101, enOptions)).toBe('one hundred one');
        expect(convertToWord(110, enOptions)).toBe('one hundred ten');
        expect(convertToWord(199, enOptions)).toBe('one hundred ninety-nine');
    });

    test('should handle decimal numbers correctly', () => {
        expect(convertToWord(1.5, enOptions)).toBe('one point five');
        expect(convertToWord(100.01, enOptions)).toBe('one hundred point zero one');
    });

    test('should handle negative numbers correctly', () => {
        expect(convertToWord(-1, enOptions)).toBe('negative one');
        expect(convertToWord(-1000, enOptions)).toBe('negative one thousand');
    });
});

describe('convertToWord - Turkish', () => {
    const trOptions = { language: 'tr' };

    test('should convert zero correctly', () => {
        expect(convertToWord(0, trOptions)).toBe('sıfır');
    });

    test('should convert single digits correctly', () => {
        expect(convertToWord(1, trOptions)).toBe('bir');
        expect(convertToWord(5, trOptions)).toBe('beş');
        expect(convertToWord(9, trOptions)).toBe('dokuz');
    });

    test('should convert hundreds correctly', () => {
        expect(convertToWord(100, trOptions)).toBe('yüz');  // Note: In Turkish it's just "yüz" not "bir yüz"
        expect(convertToWord(200, trOptions)).toBe('iki yüz');
    });

    test('should convert thousands correctly', () => {
        expect(convertToWord(1000, trOptions)).toBe('bin');  // Note: In Turkish it's just "bin" not "bir bin"
        expect(convertToWord(2000, trOptions)).toBe('iki bin');
    });
});

describe('convertToWord - General options', () => {
    test('should apply capitalize option correctly for different languages', () => {
        expect(convertToWord(123, { language: 'en', capitalize: true })).toBe('One hundred twenty-three');
        expect(convertToWord(123, { language: 'az', capitalize: true })).toBe('Bir yüz iyirmi üç');
        expect(convertToWord(123, { language: 'tr', capitalize: true })).toBe('Yüz yirmi üç');
    });

    test('should apply includeDecimalText option correctly', () => {
        expect(convertToWord(1.5, { language: 'en', includeDecimalText: false })).toBe('one');
        expect(convertToWord(1.5, { language: 'az', includeDecimalText: false })).toBe('bir');
    });

    test('should use default language when not specified', () => {
        expect(convertToWord(5)).toBe('five');  // Default is English
    });

    test('should use default language when invalid language is provided', () => {
        expect(convertToWord(5, { language: 'invalid' })).toBe('five');
    });
});

describe('isSupportedLanguage', () => {
    test('should return true for supported languages', () => {
        expect(isSupportedLanguage('en')).toBe(true);
        expect(isSupportedLanguage('az')).toBe(true);
        expect(isSupportedLanguage('tr')).toBe(true);
        expect(isSupportedLanguage('de')).toBe(true);
        expect(isSupportedLanguage('fr')).toBe(true);

        // Case insensitive
        expect(isSupportedLanguage('EN')).toBe(true);
    });

    test('should return false for unsupported languages', () => {
        expect(isSupportedLanguage('es')).toBe(false);
        expect(isSupportedLanguage('invalid')).toBe(false);
    });
});

describe('getSupportedLanguageCodes', () => {
    test('should return all supported language codes', () => {
        const supportedCodes = getSupportedLanguageCodes();
        expect(supportedCodes).toContain('en');
        expect(supportedCodes).toContain('az');
        expect(supportedCodes).toContain('tr');
        expect(supportedCodes.length).toBe(3);
    });
}); 