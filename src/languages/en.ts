/**
 * English language implementation for number-to-word conversion
 */

// Translation maps
const DIGIT_NAMES: string[] = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const TEENS: string[] = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS_MULTIPLES: string[] = ['twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const SCALE_NAMES: string[] = ['', 'thousand', 'million', 'billion', 'trillion'];

// Language-specific error messages
export const ERROR_MESSAGES = {
  NOT_A_NUMBER: 'The provided value is not a number',
  NUMBER_TOO_LARGE: 'Number too large: maximum 999 trillion is supported',
};

// Language-specific text
export const LANGUAGE_TEXT = {
  NEGATIVE: 'negative',
  DECIMAL: 'point',
};

/**
 * Checks if a range of digits has at least one non-zero value
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
 * Converts the integer part of a number to words in English
 */
export function convertIntegerPart(integerPart: string): string {
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
      result += `${DIGIT_NAMES[digit]} hundred `;
    }
    // Process tens
    else if (positionInGroup === 2) {
      if (digit === 1) {
        // Special case for 10-19
        const nextDigit = parseInt(digits[i + 1], 10);
        result += `${TEENS[nextDigit]} `;
        skipNext = true;
      } else if (digit > 1) {
        const nextDigit = parseInt(digits[i + 1], 10);
        if (nextDigit === 0) {
          result += `${TENS_MULTIPLES[digit - 2]} `;
        } else {
          result += `${TENS_MULTIPLES[digit - 2]}-${DIGIT_NAMES[nextDigit]} `;
          skipNext = true;
        }
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
 * Converts the decimal part of a number to words in English
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