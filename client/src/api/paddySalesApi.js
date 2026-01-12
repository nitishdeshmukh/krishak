/**
 * API service for paddy sales deal-related endpoints
 */
import apiClient from "@/lib/apiClient";

export const fetchPaddySales = async ({
  page = 1,
  pageSize = 10,
  filters = [],
  sorting = [],
}) => {
  const params = { page: page.toString(), pageSize: pageSize.toString() };
  filters.forEach((filter) => {
    if (filter.value) params[`filter[${filter.id}]`] = filter.value;
  });
  if (sorting.length > 0) {
    params.sortBy = sorting[0].id;
    params.sortOrder = sorting[0].desc ? "desc" : "asc";
  }

  try {
    return await apiClient.get("/sales/paddy", { params });
  } catch (error) {
    throw error;
  }
};

export const createPaddySale = async (saleData) => {
  try {
    const data = await apiClient.post("/sales/paddy", saleData);
    return data;
  } catch (error) {
    throw error;
  }
};

// Fetch all paddy sales (only sale numbers for dropdown)
export const fetchAllPaddySales = async () => {
  try {
    const data = await apiClient.get("/sales/paddy/all");
    return data;
  } catch (error) {
    throw error;
  }
};

// Fetch paddy sale details by sale number (for auto-fill)
export const fetchPaddySaleBySaleNumber = async (saleNumber) => {
  try {
    const data = await apiClient.get(`/sales/paddy/by-number/${saleNumber}`);
    return data;
  } catch (error) {
    throw error;
  }
};

// Delete paddy sale
export const deletePaddySale = async (id) => {
  try {
    const data = await apiClient.delete(`/sales/paddy/${id}`);
    return data;
  } catch (error) {
    throw error;
  }
};
// Update paddy sale
export const updatePaddySale = async ({ id, ...data }) => {
  try {
    const response = await apiClient.put(`/sales/paddy/${id}`, data);
    return response;
  } catch (error) {
    throw error;
  }
};

export default {
  fetchPaddySales,
  createPaddySale,
  updatePaddySale,
  fetchAllPaddySales,
  fetchPaddySaleBySaleNumber,
  deletePaddySale,
};
