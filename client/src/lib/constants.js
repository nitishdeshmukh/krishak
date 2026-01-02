/**
 * Constants for form options used across the application
 */

// Paddy/Grain type options for dropdowns
export const paddyTypeOptions = [
    { value: 'धान(मोटा)', label: 'धान(मोटा)' },
    { value: 'धान(पतला)', label: 'धान(पतला)' },
    { value: 'धान(सरना)', label: 'धान(सरना)' },
    { value: 'धान(महामाया)', label: 'धान(महामाया)' },
    { value: 'धान(RB GOLD)', label: 'धान(RB GOLD)' },
];

// Rice type options for dropdowns
export const riceTypeOptions = [
    { value: 'चावल(मोटा)', label: 'चावल(मोटा)' },
    { value: 'चावल(पतला)', label: 'चावल(पतला)' },
];

// Alias for backward compatibility
export const grainTypeOptions = paddyTypeOptions;

// Purchase Deal Types
export const purchaseDealTypes = [
    { value: 'PADDY', label: 'Paddy Purchase', labelHi: 'धान खरीदी' },
    { value: 'RICE', label: 'Rice Purchase', labelHi: 'चावल खरीदी' },
    { value: 'SACK', label: 'Sack Purchase', labelHi: 'बोरी खरीदी' },
    { value: 'FRK', label: 'FRK Purchase', labelHi: 'FRK खरीदी' },
    { value: 'OTHER', label: 'Other Purchase', labelHi: 'अन्य खरीदी' },
];

// Sale Deal Types
export const saleDealTypes = [
    { value: 'RICE', label: 'Rice Sale', labelHi: 'चावल बिक्री' },
    { value: 'PADDY', label: 'Paddy Sale', labelHi: 'धान बिक्री' },
    { value: 'BROKENS', label: 'Brokens Sale', labelHi: 'खंडा बिक्री' },
    { value: 'BREWERS', label: 'Brewers Sale', labelHi: 'नक्खी बिक्री' },
    { value: 'HUSK', label: 'Husk Sale', labelHi: 'भूसा बिक्री' },
    { value: 'RICE_BRAN', label: 'Rice Bran Sale', labelHi: 'कोढ़ा बिक्री' },
    { value: 'WHITE_BRAN', label: 'White Bran Sale', labelHi: 'सिल्की कोढ़ा बिक्री' },
    { value: 'SACK', label: 'Sack Sale', labelHi: 'बोरी बिक्री' },
    { value: 'FRK', label: 'FRK Sale', labelHi: 'FRK बिक्री' },
    { value: 'OTHER', label: 'Other Sale', labelHi: 'अन्य बिक्री' },
];

// Payment Modes
export const paymentModeOptions = [
    { value: 'CASH', label: 'Cash', labelHi: 'नकद' },
    { value: 'BANK', label: 'Bank Transfer', labelHi: 'बैंक ट्रांसफर' },
    { value: 'CHEQUE', label: 'Cheque', labelHi: 'चेक' },
    { value: 'ONLINE', label: 'Online/UPI', labelHi: 'ऑनलाइन/UPI' },
];

// Hamali Types
export const hamaliTypes = [
    { value: 'INWARD', label: 'Inward', labelHi: 'आवक' },
    { value: 'OUTWARD', label: 'Outward', labelHi: 'जावक' },
    { value: 'MILLING', label: 'Milling', labelHi: 'मिलिंग' },
    { value: 'OTHER', label: 'Other', labelHi: 'अन्य' },
];

// Month options
export const monthOptions = [
    { value: 'Jan', label: 'January', labelHi: 'जनवरी' },
    { value: 'Feb', label: 'February', labelHi: 'फरवरी' },
    { value: 'Mar', label: 'March', labelHi: 'मार्च' },
    { value: 'Apr', label: 'April', labelHi: 'अप्रैल' },
    { value: 'May', label: 'May', labelHi: 'मई' },
    { value: 'Jun', label: 'June', labelHi: 'जून' },
    { value: 'Jul', label: 'July', labelHi: 'जुलाई' },
    { value: 'Aug', label: 'August', labelHi: 'अगस्त' },
    { value: 'Sep', label: 'September', labelHi: 'सितंबर' },
    { value: 'Oct', label: 'October', labelHi: 'अक्टूबर' },
    { value: 'Nov', label: 'November', labelHi: 'नवंबर' },
    { value: 'Dec', label: 'December', labelHi: 'दिसंबर' },
];
