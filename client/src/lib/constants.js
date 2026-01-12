/**
 * Constants for form options used across the application
 */

// Committee type options for dropdowns
export const committeeTypeOptions = [
  { value: "समिति-उपार्जन केंद्र", label: "उपार्जन केंद्र" },
  { value: "संग्रहण केंद्र", label: "संग्रहण केंद्र" },
];

// Paddy/Grain type options for dropdowns
export const paddyTypeOptions = [
  { value: "धान(मोटा)", label: "धान(मोटा)" },
  { value: "धान(पतला)", label: "धान(पतला)" },
  { value: "धान(सरना)", label: "धान(सरना)" },
  { value: "धान(महामाया)", label: "धान(महामाया)" },
  { value: "धान(RB GOLD)", label: "धान(RB GOLD)" },
];

// Rice type options for dropdowns
export const riceTypeOptions = [
  { value: "चावल(मोटा)", label: "चावल(मोटा)" },
  { value: "चावल(पतला)", label: "चावल(पतला)" },
];

// Delevery options for dropdowns
export const deliveryOptions = [
  { value: "पड़े में", label: "Pickup", labelHi: "पड़े में" },
  { value: "पहुंचा कर", label: "Delivery", labelHi: "पहुंचा कर" },
];

export const gunnyDeliveryOptions = [
  { value: "मिल में", label: "in Mill", labelHi: "मिल में" },
  {
    value: "समिति / संग्रहण केंद्र में",
    label: "in Committee / Collection Center",
    labelHi: "समिति / संग्रहण केंद्र में",
  },
];

// Purchase Type options for dropdowns
export const purchaseTypeOptions = [
  { value: "DO खरीदी", label: "DO Purchase", labelHi: "DO खरीदी" },
  { value: "अन्य खरीदी", label: "Other Purchase", labelHi: "अन्य खरीदी" },
];

// Gunny Options for dropdowns
export const gunnyOptions = [
  { value: "सहित (वजन में)", label: "With Weight", labelHi: "सहित (वजन में)" },
  { value: "सहित (भाव में)", label: "With Rate", labelHi: "सहित (भाव में)" },
  { value: "वापसी", label: "Return", labelHi: "वापसी" },
];

export const lotOptions = [
  { value: "LOT खरीदी", label: "LOT Purchase", labelHi: "LOT खरीदी" },
  { value: "अन्य खरीदी", label: "Other Purchase", labelHi: "अन्य खरीदी" },
];

export const frkOptions = [
  { value: "FRK सहित", label: "with FRK", labelHi: "FRK सहित" },
  { value: "FRK देना है", label: "FRK to be provided", labelHi: "FRK देना है" },
  { value: "NON FRK", label: "Non FRK", labelHi: "NON FRK" },
];

export const salesTypeOptions = [
  { value: "DO बिक्री", label: "DO Sales", labelHi: "DO बिक्री" },
  {
    value: "अन्य (मिल से बिक्री)",
    label: "Other Sales(Sales from Mill)",
    labelHi: "अन्य (मिल से बिक्री)",
  },
];

// Purchase Deal Types
export const purchaseDealTypes = [
  { value: "PADDY", label: "Paddy Purchase", labelHi: "धान खरीदी" },
  { value: "RICE", label: "Rice Purchase", labelHi: "चावल खरीदी" },
  { value: "SACK", label: "Sack Purchase", labelHi: "बोरी खरीदी" },
  { value: "FRK", label: "FRK Purchase", labelHi: "FRK खरीदी" },
  { value: "OTHER", label: "Other Purchase", labelHi: "अन्य खरीदी" },
];

export const quantityType = [
  { value: "क्विंटल", label: "क्विंटल", labelHi: "क्विंटल" },
  { value: "कि.ग्रा.", label: "कि.ग्रा.", labelHi: "कि.ग्रा." },
  { value: "टन", label: "टन", labelHi: "टन" },
  { value: "नग", label: "नग", labelHi: "नग" },
  { value: "अन्य", label: "अन्य", labelHi: "अन्य" },
];
// Sale Deal Types
export const saleDealTypes = [
  { value: "RICE", label: "Rice Sale", labelHi: "चावल बिक्री" },
  { value: "PADDY", label: "Paddy Sale", labelHi: "धान बिक्री" },
  { value: "BROKENS", label: "Brokens Sale", labelHi: "खंडा बिक्री" },
  { value: "BREWERS", label: "Brewers Sale", labelHi: "नक्खी बिक्री" },
  { value: "HUSK", label: "Husk Sale", labelHi: "भूसा बिक्री" },
  { value: "RICE_BRAN", label: "Rice Bran Sale", labelHi: "कोढ़ा बिक्री" },
  {
    value: "WHITE_BRAN",
    label: "White Bran Sale",
    labelHi: "सिल्की कोढ़ा बिक्री",
  },
  { value: "SACK", label: "Sack Sale", labelHi: "बोरी बिक्री" },
  { value: "FRK", label: "FRK Sale", labelHi: "FRK बिक्री" },
  { value: "OTHER", label: "Other Sale", labelHi: "अन्य बिक्री" },
];

// Payment Modes
export const paymentModeOptions = [
  { value: "CASH", label: "Cash", labelHi: "नकद" },
  { value: "BANK", label: "Bank Transfer", labelHi: "बैंक ट्रांसफर" },
  { value: "CHEQUE", label: "Cheque", labelHi: "चेक" },
  { value: "ONLINE", label: "Online/UPI", labelHi: "ऑनलाइन/UPI" },
];

// Hamali Types
export const hamaliTypes = [
  { value: "INWARD", label: "Inward", labelHi: "आवक" },
  { value: "OUTWARD", label: "Outward", labelHi: "जावक" },
  { value: "MILLING", label: "Milling", labelHi: "मिलिंग" },
  { value: "OTHER", label: "Other", labelHi: "अन्य" },
];

// Month options
export const monthOptions = [
  { value: "Jan", label: "January", labelHi: "जनवरी" },
  { value: "Feb", label: "February", labelHi: "फरवरी" },
  { value: "Mar", label: "March", labelHi: "मार्च" },
  { value: "Apr", label: "April", labelHi: "अप्रैल" },
  { value: "May", label: "May", labelHi: "मई" },
  { value: "Jun", label: "June", labelHi: "जून" },
  { value: "Jul", label: "July", labelHi: "जुलाई" },
  { value: "Aug", label: "August", labelHi: "अगस्त" },
  { value: "Sep", label: "September", labelHi: "सितंबर" },
  { value: "Oct", label: "October", labelHi: "अक्टूबर" },
  { value: "Nov", label: "November", labelHi: "नवंबर" },
  { value: "Dec", label: "December", labelHi: "दिसंबर" },
];
