import { create } from 'zustand';
import { fetchProjects, fetchProjectKpiSummary, fetchDivisionCounts, fetchProjectById, fetchDmPdmList } from '../api/projects.js';

export const useProjectStore = create((set, get) => ({
  // Data
  projects: [],
  totalCount: 0,
  kpiData: null,
  divisionCounts: [],
  dmPdmList: [],
  selectedProject: null,

  // Division
  activeDivision: 'All',

  // Pagination
  page: 1,
  pageSize: 25,

  // Sorting
  sortBy: 'name',
  sortDir: 'asc',

  // Filters
  filters: {},
  searchTerm: '',
  selectedDm: '',
  activeKpiFilter: null,

  // UI
  isLoading: false,
  error: null,
  isGlobalFilterOpen: false,
  isDetailOpen: false,
  initialTab: 'overview',

  /**
   * Load projects from API with current state params
   */
  loadProjects: async () => {
    const { page, pageSize, sortBy, sortDir, filters, searchTerm, activeDivision, selectedDm, activeKpiFilter } = get();
    set({ isLoading: true, error: null });

    // Build combined filters
    const combinedFilters = { ...filters };
    if (selectedDm) combinedFilters.dm_pdm = selectedDm;
    if (activeKpiFilter) {
      switch (activeKpiFilter) {
        case 'criticalAttention':
          combinedFilters.is_critical_attention = true;
          break;
        case 'revenueAtRisk':
          combinedFilters.revenue_at_risk_gt = 0;
          break;
        case 'dpi':
          combinedFilters.spi_below = 0.9;
          break;
        case 'customerConfidence':
          combinedFilters.confidence_below = 3.5;
          break;
        case 'activeProject':
          combinedFilters.status = 'active';
          break;
        case 'bytTm':
          combinedFilters.project_type = 'BYT/T&M';
          combinedFilters.status = 'active';
          break;
        case 'fp':
          combinedFilters.project_type = 'FP';
          combinedFilters.status = 'active';
          break;
        case 'staffing':
          combinedFilters.project_type = 'Staffing';
          combinedFilters.status = 'active';
          break;
      }
    }

    try {
      const data = await fetchProjects({
        page, pageSize, sortBy, sortDir,
        division: activeDivision,
        filters: combinedFilters,
        search: searchTerm,
      });
      set({ projects: data.rows, totalCount: data.totalCount, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  /**
   * Load KPI summary for active division
   */
  loadKpiSummary: async () => {
    try {
      const data = await fetchProjectKpiSummary(get().activeDivision);
      set({ kpiData: data });
    } catch (error) {
      console.error('Failed to load KPI summary:', error);
    }
  },

  /**
   * Load division counts for tab bar
   */
  loadDivisionCounts: async () => {
    try {
      const data = await fetchDivisionCounts();
      set({ divisionCounts: data });
    } catch (error) {
      console.error('Failed to load division counts:', error);
    }
  },

  /**
   * Load DM/PDM list for dropdown
   */
  loadDmPdmList: async () => {
    try {
      const data = await fetchDmPdmList();
      set({ dmPdmList: data });
    } catch (error) {
      console.error('Failed to load DM/PDM list:', error);
    }
  },

  // Division tab
  setDivision: (division) => {
    set({ activeDivision: division, page: 1 });
    get().loadProjects();
    get().loadKpiSummary();
  },

  // Pagination
  setPage: (page) => {
    set({ page });
    get().loadProjects();
  },
  setPageSize: (pageSize) => {
    set({ pageSize, page: 1 });
    get().loadProjects();
  },

  // Sorting
  setSort: (sortBy) => {
    const state = get();
    const newDir = state.sortBy === sortBy && state.sortDir === 'asc' ? 'desc' : 'asc';
    set({ sortBy, sortDir: newDir, page: 1 });
    get().loadProjects();
  },

  // Filters
  addFilter: (column, value) => {
    const filters = { ...get().filters, [column]: value };
    set({ filters, page: 1 });
    get().loadProjects();
  },
  removeFilter: (column) => {
    const filters = { ...get().filters };
    delete filters[column];
    set({ filters, page: 1 });
    get().loadProjects();
  },
  clearFilters: () => {
    set({ filters: {}, activeKpiFilter: null, selectedDm: '', searchTerm: '', activeDivision: 'All', page: 1 });
    get().loadProjects();
    get().loadKpiSummary();
    get().loadDivisionCounts();
  },

  // Search
  setSearchTerm: (searchTerm) => {
    set({ searchTerm, page: 1 });
    get().loadProjects();
  },

  // DM/PDM dropdown
  setSelectedDm: (dm) => {
    set({ selectedDm: dm, page: 1 });
    get().loadProjects();
  },

  // KPI card filter
  setKpiFilter: (filterType) => {
    const current = get().activeKpiFilter;
    set({ activeKpiFilter: current === filterType ? null : filterType, page: 1 });
    get().loadProjects();
  },

  // Global filter panel
  toggleGlobalFilter: () => {
    set((state) => ({ isGlobalFilterOpen: !state.isGlobalFilterOpen }));
  },
  applyGlobalFilters: (selections) => {
    const filters = { ...get().filters };
    // Map global filter selections to filter keys
    for (const [category, values] of Object.entries(selections)) {
      if (values && values.length > 0) {
        filters[`tag_${category.toLowerCase()}`] = values;
      } else {
        delete filters[`tag_${category.toLowerCase()}`];
      }
    }
    set({ filters, isGlobalFilterOpen: false, page: 1 });
    get().loadProjects();
  },

  // Project detail fly-in
  openProjectDetail: async (projectId, tab = 'overview') => {
    try {
      const data = await fetchProjectById(projectId);
      set({ selectedProject: data, isDetailOpen: true, initialTab: tab });
    } catch (error) {
      console.error('Failed to load project detail:', error);
    }
  },
  closeProjectDetail: () => {
    set({ selectedProject: null, isDetailOpen: false });
  },
}));
