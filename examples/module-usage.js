// Simple ES Module import example
import { convertToWord } from 'number-to-word-az';

// Basic function call with arguments
const result = convertToWord(42, { language: 'az' });
console.log(result); // Output: qırx iki

// Function can be used directly in code
function formatAmount(amount, language = 'en') {
    return convertToWord(amount, {
        language,
        capitalize: true
    });
}

// Example usage
const price = 1250.99;
console.log(`Amount: ${price}`);
console.log(`In English: ${formatAmount(price)}`);
console.log(`In Azerbaijani: ${formatAmount(price, 'az')}`);
console.log(`In Turkish: ${formatAmount(price, 'tr')}`); 