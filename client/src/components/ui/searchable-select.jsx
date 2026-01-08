import * as React from 'react';
import Select from 'react-select';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

/**
 * SearchableSelect - A searchable dropdown using react-select with shadcn/ui theme
 */
export function SearchableSelect({
    options = [],
    value,
    onChange,
    placeholder = 'Select...',
    disabled = false,
    isLoading = false,
    noOptionsMessage = 'No results found',
    className,
    isClearable = false,
    ...props
}) {
    const selectedOption = React.useMemo(() => {
        if (!value) return null;
        const found = options.find((opt) => opt.value === value);
        if (found) return found;
        
        // Fallback: If option not found (e.g. data not loaded yet, or legacy value),
        // return an object with the value as label so it displays correctly.
        return { value, label: value };
    }, [value, options]);

    const handleChange = (selected) => {
        onChange(selected?.value || '');
    };

    const customStyles = {
        control: (base, state) => ({
            ...base,
            minHeight: '2.25rem',
            borderRadius: 'var(--radius-md, 0.375rem)',
            borderWidth: '1px',
            borderColor: state.isFocused
                ? 'var(--ring, oklch(0.58 0.25 260))'
                : 'var(--input, oklch(0.88 0.015 240))',
            backgroundColor: 'transparent',
            boxShadow: state.isFocused
                ? '0 0 0 3px oklch(0.58 0.25 260 / 0.5)'
                : 'none',
            '&:hover': {
                borderColor: state.isFocused
                    ? 'var(--ring, oklch(0.58 0.25 260))'
                    : 'var(--input, oklch(0.88 0.015 240))',
            },
            cursor: state.isDisabled ? 'not-allowed' : 'pointer',
            opacity: state.isDisabled ? 0.5 : 1,
            fontSize: '1rem',
        }),
        valueContainer: (base) => ({
            ...base,
            padding: '0 0.75rem',
        }),
        singleValue: (base) => ({
            ...base,
            color: 'oklch(0.18 0.04 250)',
        }),
        placeholder: (base) => ({
            ...base,
            color: 'oklch(0.48 0.06 245)',
        }),
        input: (base) => ({
            ...base,
            color: 'oklch(0.18 0.04 250)',
            margin: 0,
            padding: 0,
        }),
        menu: (base) => ({
            ...base,
            backgroundColor: 'oklch(1 0 0)',
            border: '1px solid oklch(0.88 0.015 240)',
            borderRadius: 'var(--radius-md, 0.375rem)',
            boxShadow: '0 4px 12px -2px rgb(0 0 0 / 0.1)',
            zIndex: 50,
            overflow: 'hidden',
            marginTop: '4px',
        }),
        menuList: (base) => ({
            ...base,
            padding: '0.25rem',
            maxHeight: '200px',
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected
                ? 'oklch(0.58 0.25 260)'
                : state.isFocused
                    ? 'oklch(0.94 0.04 245)'
                    : 'transparent',
            color: state.isSelected
                ? 'oklch(0.99 0 0)'
                : state.isFocused
                    ? 'oklch(0.28 0.14 250)'
                    : 'oklch(0.18 0.04 250)',
            cursor: 'pointer',
            borderRadius: 'var(--radius-sm, 0.25rem)',
            padding: '0.5rem 0.75rem',
            fontSize: '1rem',
            '&:active': {
                backgroundColor: 'oklch(0.94 0.04 245)',
            },
        }),
        indicatorSeparator: () => ({
            display: 'none',
        }),
        dropdownIndicator: (base, state) => ({
            ...base,
            color: 'oklch(0.48 0.06 245)',
            padding: '0 0.5rem',
            transition: 'transform 0.2s ease',
            transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            '&:hover': {
                color: 'oklch(0.18 0.04 250)',
            },
        }),
        clearIndicator: (base) => ({
            ...base,
            color: 'oklch(0.48 0.06 245)',
            padding: '0 0.25rem',
            '&:hover': {
                color: 'oklch(0.58 0.24 25)',
            },
        }),
        loadingIndicator: (base) => ({
            ...base,
            color: 'oklch(0.48 0.06 245)',
        }),
        noOptionsMessage: (base) => ({
            ...base,
            color: 'oklch(0.48 0.06 245)',
            fontSize: '1rem',
            padding: '1rem 0',
        }),
    };

    const LoadingIndicator = () => (
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground mr-2" />
    );

    return (
        <Select
            options={options}
            value={selectedOption}
            onChange={handleChange}
            placeholder={placeholder}
            isDisabled={disabled}
            isLoading={isLoading}
            isClearable={isClearable}
            isSearchable={true}
            styles={customStyles}
            noOptionsMessage={() => noOptionsMessage}
            components={{ LoadingIndicator }}
            classNamePrefix="react-select"
            className={cn('w-full', className)}
            menuPlacement="auto"
            menuPosition="absolute"
            {...props}
        />
    );
}

export default SearchableSelect;
