import { create } from 'zustand';
import {
  fetchDeliveryDivisions,
  fetchDeliveryKpi,
  fetchDeliveryTable,
  fetchPersonById,
  fetchPersonCustomers,
  fetchPersonProjects,
  fetchPersonEngTeam,
} from '../api/delivery.js';

export const useDeliveryStore = create((set, get) => ({
  // Division tabs
  divisions:      [],
  activeDivision: 'Technology Services',

  // KPI data
  kpiData:    null,
  kpiLoading: false,

  // Active KPI filter — { label, roleType } | null
  activeKpiFilter: null,

  // Table data
  tableData:    [],
  tableLoading: false,

  // Sorting
  sortCol: 'name',
  sortDir: 'asc',

  // Filters
  filters: {
    division:   'Technology Services',
    roleType:   null,
    nameSearch: '',
  },

  // UI state
  isFullscreen: false,
  error: null,

  // ── Person Detail Modal ──
  modalOpen:      false,
  modalPerson:    null,   // { id, name, role, customerCount, projectCount, headCount }
  modalTab:       'customers', // 'customers' | 'projects' | 'engineering'
  modalCustomers: [],
  modalProjects:  [],
  modalEngTeam:   [],
  modalLoading:   false,
  toBeStarted:    false,

  // ─── Actions ──────────────────────────────────────────────────────────────

  /**
   * Load division list from API
   */
  loadDivisions: async () => {
    try {
      const data = await fetchDeliveryDivisions();
      set({ divisions: data });
    } catch {
      set({ divisions: [
        { id: 1, name: 'Technology Services' },
        { id: 2, name: 'Insurance' },
      ]});
    }
  },

  /**
   * Load KPI summary for the active division
   */
  loadKpi: async () => {
    const { activeDivision } = get();
    set({ kpiLoading: true });
    try {
      const data = await fetchDeliveryKpi(activeDivision);
      set({ kpiData: data, kpiLoading: false });
    } catch (error) {
      set({ error: error.message, kpiLoading: false });
    }
  },

  /**
   * Load table rows for the active division + current sort/filter state
   */
  loadTable: async () => {
    const { activeDivision, sortCol, sortDir, filters } = get();
    set({ tableLoading: true, error: null });
    try {
      const data = await fetchDeliveryTable({
        division: activeDivision,
        sort:     sortCol,
        order:    sortDir,
        role:     filters.roleType   || '',
        name:     filters.nameSearch || '',
      });
      set({ tableData: data, tableLoading: false });
    } catch (error) {
      set({ error: error.message, tableLoading: false });
    }
  },

  /**
   * Switch active division tab — clears KPI filter, reloads both KPI + table
   */
  setActiveDivision: (divisionName) => {
    set({
      activeDivision:  divisionName,
      activeKpiFilter: null,
      filters: { division: divisionName, roleType: null, nameSearch: '' },
    });
    get().loadKpi();
    get().loadTable();
  },

  /**
   * Click a KPI sub-card number — toggles that role filter on/off
   * @param {string} label     - display label e.g. "Delivery Managers"
   * @param {string} roleType  - DB role value e.g. "Delivery Manager"
   */
  setKpiFilter: (label, roleType) => {
    const { activeKpiFilter } = get();
    // Toggle off if same KPI clicked again
    if (activeKpiFilter?.roleType === roleType) {
      set({
        activeKpiFilter: null,
        filters: { ...get().filters, roleType: null },
      });
    } else {
      set({
        activeKpiFilter: { label, roleType },
        filters: { ...get().filters, roleType },
      });
    }
    get().loadTable();
  },

  /**
   * Set sort column — toggles direction on same column
   */
  setSort: (col) => {
    const { sortCol, sortDir } = get();
    const newDir = sortCol === col && sortDir === 'asc' ? 'desc' : 'asc';
    set({ sortCol: col, sortDir: newDir });
    get().loadTable();
  },

  /**
   * Apply role + name filter from the funnel dropdown
   * @param {string|null} roleType
   * @param {string|null} nameSearch
   */
  applyRoleFilter: (roleType, nameSearch = null) => {
    set({
      activeKpiFilter: roleType ? { label: roleType, roleType } : null,
      filters: { ...get().filters, roleType, nameSearch: nameSearch || '' },
    });
    get().loadTable();
  },

  /**
   * Remove a single filter chip
   */
  removeFilter: (key) => {
    if (key === 'roleType' || key === 'kpi') {
      set({
        activeKpiFilter: null,
        filters: { ...get().filters, roleType: null },
      });
      get().loadTable();
    }
  },

  /**
   * Clear all filters — resets division to 'both', clears role + KPI filters
   */
  clearFilters: () => {
    set({
      activeKpiFilter: null,
      activeDivision:  'both',
      filters: { division: 'both', roleType: null, nameSearch: '' },
    });
    get().loadKpi();
    get().loadTable();
  },

  /**
   * Toggle fullscreen mode
   */
  toggleFullscreen: () => set((s) => ({ isFullscreen: !s.isFullscreen })),

  // ── Modal actions ──────────────────────────────────────────────────────────

  /**
   * Open the person detail modal for a given person + initial tab.
   * @param {number} personId
   * @param {'customers'|'projects'|'engineering'} initialTab
   */
  openPersonModal: async (personId, initialTab = 'customers') => {
    set({ modalOpen: true, modalLoading: true, modalTab: initialTab,
          modalPerson: null, modalCustomers: [], modalProjects: [], modalEngTeam: [] });
    try {
      const person = await fetchPersonById(personId);
      set({ modalPerson: person });
      // Load all three tabs in parallel
      const [customers, projects, engTeam] = await Promise.all([
        fetchPersonCustomers(personId),
        fetchPersonProjects(personId, false),
        fetchPersonEngTeam(personId),
      ]);
      set({ modalCustomers: customers, modalProjects: projects, modalEngTeam: engTeam, modalLoading: false });
    } catch (error) {
      set({ modalLoading: false, error: error.message });
    }
  },

  /**
   * Switch modal tab
   */
  setModalTab: (tab) => set({ modalTab: tab }),

  /**
   * Toggle "To be Started" and reload projects tab
   */
  toggleToBeStarted: async () => {
    const { modalPerson, toBeStarted } = get();
    const next = !toBeStarted;
    set({ toBeStarted: next, modalLoading: true });
    try {
      const projects = await fetchPersonProjects(modalPerson.id, next);
      set({ modalProjects: projects, modalLoading: false });
    } catch {
      set({ modalLoading: false });
    }
  },

  /**
   * Close the modal
   */
  closeModal: () => set({
    modalOpen: false, modalPerson: null, toBeStarted: false,
    modalCustomers: [], modalProjects: [], modalEngTeam: [],
  }),
}));
