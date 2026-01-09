/**
 * Server-side constants for enum values and validation
 * These should match the client-side constants where applicable
 */

// Committee Types
export const COMMITTEE_TYPES = {
  PRODUCTION: "समिति-उपार्जन केंद्र",
  STORAGE: "संग्रहण केंद्र",
};

export const COMMITTEE_TYPE_VALUES = Object.values(COMMITTEE_TYPES);

// Paddy/Grain Types
export const PADDY_TYPES = {
  MOTA: "धान(मोटा)",
  PATLA: "धान(पतला)",
  SARNA: "धान(सरना)",
  MAHAMAYA: "धान(महामाया)",
  RB_GOLD: "धान(RB GOLD)",
};

export const PADDY_TYPE_VALUES = Object.values(PADDY_TYPES);

// Rice Types
export const RICE_TYPES = {
  MOTA: "चावल(मोटा)",
  PATLA: "चावल(पतला)",
};

export const RICE_TYPE_VALUES = Object.values(RICE_TYPES);

// Delivery Options
export const DELIVERY_OPTIONS = {
  PICKUP: "pickup",
  DELIVERY: "delivery",
};

export const DELIVERY_OPTION_VALUES = Object.values(DELIVERY_OPTIONS);

// Purchase Types
export const PURCHASE_TYPES = {
  DO_PURCHASE: "do-purchase",
  OTHER_PURCHASE: "other-purchase",
  LOT_PURCHASE: "lot-purchase",
};

export const PURCHASE_TYPE_VALUES = Object.values(PURCHASE_TYPES);

// Gunny/Packaging Options
export const GUNNY_OPTIONS = {
  WITH_WEIGHT: "with-weight",
  WITH_QUANTITY: "with-quantity",
  RETURN: "return",
};

export const GUNNY_OPTION_VALUES = Object.values(GUNNY_OPTIONS);

// FRK Options
export const FRK_OPTIONS = {
  FRK_INCLUDED: "frk-included",
  FRK_GIVE: "frk-give",
};

export const FRK_OPTION_VALUES = Object.values(FRK_OPTIONS);

// Payment Modes
export const PAYMENT_MODES = {
  CASH: "CASH",
  BANK: "BANK",
  CHEQUE: "CHEQUE",
  ONLINE: "ONLINE",
};

export const PAYMENT_MODE_VALUES = Object.values(PAYMENT_MODES);

// Hamali/Labor Types
export const HAMALI_TYPES = {
  INWARD: "INWARD",
  OUTWARD: "OUTWARD",
  MILLING: "MILLING",
  OTHER: "OTHER",
};

export const HAMALI_TYPE_VALUES = Object.values(HAMALI_TYPES);

// Deal Types for Purchase
export const PURCHASE_DEAL_TYPES = {
  PADDY: "PADDY",
  RICE: "RICE",
  SACK: "SACK",
  FRK: "FRK",
  OTHER: "OTHER",
};

export const PURCHASE_DEAL_TYPE_VALUES = Object.values(PURCHASE_DEAL_TYPES);

// Deal Types for Sales
export const SALE_DEAL_TYPES = {
  RICE: "RICE",
  PADDY: "PADDY",
  BROKENS: "BROKENS",
  BREWERS: "BREWERS",
  HUSK: "HUSK",
  RICE_BRAN: "RICE_BRAN",
  WHITE_BRAN: "WHITE_BRAN",
  SACK: "SACK",
  FRK: "FRK",
  OTHER: "OTHER",
};

export const SALE_DEAL_TYPE_VALUES = Object.values(SALE_DEAL_TYPES);
