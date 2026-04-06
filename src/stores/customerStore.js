import { create } from 'zustand';
import { fetchCustomers, fetchKpiSummary, fetchCsatSurveys, updateCustomerField } from '../api/customers.js';

export const useCustomerStore = create((set, get) => ({
  // Data
  customers: [],
  totalCount: 0,
  kpiData: null,
  csatSurveys: [],
  csatCustomerName: '',

  // Pagination
  page: 1,
  pageSize: 25,

  // Sorting
  sortBy: 'revenue_usd',
  sortDir: 'desc',

  // Filters
  filters: { customer_status: 'active' },
  searchTerm: '',
  myCustomersOnly: false,

  // UI
  currency: 'usd',
  isFullscreen: false,
  isCsatModalOpen: false,
  isLoading: false,
  error: null,

  /**
   * Fetch customers from API with current state params
   */
  loadCustomers: async () => {
    const { page, pageSize, sortBy, sortDir, filters, searchTerm, myCustomersOnly } = get();
    set({ isLoading: true, error: null });
    try {
      const data = await fetchCustomers({
        page,
        pageSize,
        sortBy,
        sortDir,
        filters,
        search: searchTerm,
        myCustomers: myCustomersOnly,
      });
      set({ customers: data.rows, totalCount: data.totalCount, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  /**
   * Fetch KPI summary
   */
  loadKpiSummary: async () => {
    try {
      const data = await fetchKpiSummary();
      set({ kpiData: data });
    } catch (error) {
      console.error('Failed to load KPI summary:', error);
    }
  },

  /**
   * Fetch CSAT surveys for a customer and open modal
   */
  openCsatModal: async (customerId, customerName) => {
    try {
      const data = await fetchCsatSurveys(customerId);
      set({ csatSurveys: data, csatCustomerName: customerName, isCsatModalOpen: true });
    } catch (error) {
      console.error('Failed to load CSAT surveys:', error);
    }
  },

  closeCsatModal: () => set({ isCsatModalOpen: false, csatSurveys: [], csatCustomerName: '' }),

  /**
   * Toggle a boolean field on a customer and save to API
   */
  toggleCustomerField: async (customerId, field) => {
    const customers = get().customers;
    const customer = customers.find((c) => c.id === customerId);
    if (!customer) return;
    const newValue = !customer[field];
    // Optimistic update
    set({
      customers: customers.map((c) =>
        c.id === customerId ? { ...c, [field]: newValue } : c
      ),
    });
    try {
      await updateCustomerField(customerId, field, newValue);
    } catch (error) {
      // Revert on failure
      set({
        customers: get().customers.map((c) =>
          c.id === customerId ? { ...c, [field]: !newValue } : c
        ),
      });
      console.error('Failed to update customer field:', error);
    }
  },

  /**
   * Optimistically patch one or more fields on a customer in the list.
   * Used after saving from an inline modal (e.g., client partner update).
   */
  patchCustomer: (customerId, fields) => {
    set((s) => ({
      customers: s.customers.map((c) => c.id === customerId ? { ...c, ...fields } : c),
    }));
  },

  // Pagination actions
  setPage: (page) => {
    set({ page });
    get().loadCustomers();
  },

  setPageSize: (pageSize) => {
    set({ pageSize, page: 1 });
    get().loadCustomers();
  },

  // Sort action
  setSort: (sortBy) => {
    const state = get();
    const newDir = state.sortBy === sortBy && state.sortDir === 'asc' ? 'desc' : 'asc';
    set({ sortBy, sortDir: newDir, page: 1 });
    get().loadCustomers();
  },

  // Filter actions
  addFilter: (column, value) => {
    const filters = { ...get().filters, [column]: value };
    set({ filters, page: 1 });
    get().loadCustomers();
  },

  removeFilter: (column) => {
    const filters = { ...get().filters };
    delete filters[column];
    set({ filters, page: 1 });
    get().loadCustomers();
  },

  clearFilters: () => {
    set({ filters: {}, page: 1 });
    get().loadCustomers();
  },

  // Search
  setSearchTerm: (searchTerm) => {
    set({ searchTerm, page: 1 });
    get().loadCustomers();
  },

  // Toggles
  toggleMyCustomers: () => {
    set((state) => ({ myCustomersOnly: !state.myCustomersOnly }));
    get().loadCustomers();
  },

  toggleCurrency: () => {
    set((state) => ({ currency: state.currency === 'usd' ? 'inr' : 'usd' }));
  },

  toggleFullscreen: () => {
    set((state) => ({ isFullscreen: !state.isFullscreen }));
  },
}));
