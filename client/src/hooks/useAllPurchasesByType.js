/**
 * Hook to fetch all purchase deals based on type
 * Combines all purchase APIs for use in forms
 */
import { useQuery } from '@tanstack/react-query';
import { fetchPaddyPurchases } from '../api/paddyPurchasesApi';
import { fetchRicePurchases } from '../api/ricePurchasesApi';
import { fetchSackPurchases } from '../api/sackPurchasesApi';
import { fetchFRKPurchases } from '../api/frkPurchasesApi';
import { fetchOtherPurchases } from '../api/otherPurchasesApi';

// Map of purchase type to API function and response field
const purchaseApiMap = {
    PADDY: { fetch: fetchPaddyPurchases, field: 'paddyPurchases' },
    RICE: { fetch: fetchRicePurchases, field: 'ricePurchases' },
    SACK: { fetch: fetchSackPurchases, field: 'sackPurchases' },
    FRK: { fetch: fetchFRKPurchases, field: 'frkPurchases' },
    OTHER: { fetch: fetchOtherPurchases, field: 'otherPurchases' },
};

/**
 * Hook to fetch all purchase deals for a specific type
 * @param {string} purchaseType - The type of purchase (PADDY, RICE, etc.)
 */
export const useAllPurchasesByType = (purchaseType) => {
    const query = useQuery({
        queryKey: ['allPurchases', purchaseType],
        queryFn: async () => {
            if (!purchaseType || !purchaseApiMap[purchaseType]) {
                return [];
            }

            const config = purchaseApiMap[purchaseType];
            const response = await config.fetch({ page: 1, pageSize: 1000 });
            return response?.data?.[config.field] || [];
        },
        enabled: !!purchaseType && !!purchaseApiMap[purchaseType],
        staleTime: 30000,
    });

    return {
        ...query,
        purchases: query.data || [],
        isLoading: query.isLoading,
    };
};

export default useAllPurchasesByType;
