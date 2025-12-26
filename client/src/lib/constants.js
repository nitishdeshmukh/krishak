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
