/**
 * Hook to fetch all sale deals based on type
 * Combines all sale APIs for use in forms
 */
import { useQuery } from '@tanstack/react-query';
import { fetchRiceSales } from '../api/riceSalesApi';
import { fetchPaddySales } from '../api/paddySalesApi';
import { fetchBrokensSales } from '../api/brokensSalesApi';
import { fetchBrewersSales } from '../api/brewersSalesApi';
import { fetchHuskSales } from '../api/huskSalesApi';
import { fetchRiceBranSales } from '../api/riceBranSalesApi';
import { fetchWhiteBranSales } from '../api/whiteBranSalesApi';
import { fetchSackSales } from '../api/sackSalesApi';
import { fetchFRKSales } from '../api/frkSalesApi';
import { fetchOtherSales } from '../api/otherSalesApi';

// Map of sale type to API function and response field
const saleApiMap = {
    RICE: { fetch: fetchRiceSales, field: 'riceSales' },
    PADDY: { fetch: fetchPaddySales, field: 'paddySales' },
    BROKENS: { fetch: fetchBrokensSales, field: 'brokensSales' },
    BREWERS: { fetch: fetchBrewersSales, field: 'brewersSales' },
    HUSK: { fetch: fetchHuskSales, field: 'huskSales' },
    RICE_BRAN: { fetch: fetchRiceBranSales, field: 'riceBranSales' },
    WHITE_BRAN: { fetch: fetchWhiteBranSales, field: 'whiteBranSales' },
    SACK: { fetch: fetchSackSales, field: 'sackSales' },
    FRK: { fetch: fetchFRKSales, field: 'frkSales' },
    OTHER: { fetch: fetchOtherSales, field: 'otherSales' },
};

/**
 * Hook to fetch all sale deals for a specific type
 * @param {string} saleType - The type of sale (RICE, PADDY, etc.)
 */
export const useAllSalesByType = (saleType) => {
    const query = useQuery({
        queryKey: ['allSales', saleType],
        queryFn: async () => {
            if (!saleType || !saleApiMap[saleType]) {
                return [];
            }

            const config = saleApiMap[saleType];
            const response = await config.fetch({ page: 1, pageSize: 1000 });
            return response?.data?.[config.field] || [];
        },
        enabled: !!saleType && !!saleApiMap[saleType],
        staleTime: 30000,
    });

    return {
        ...query,
        sales: query.data || [],
        isLoading: query.isLoading,
    };
};

export default useAllSalesByType;
