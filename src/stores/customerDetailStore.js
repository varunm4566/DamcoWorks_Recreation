import { create } from 'zustand';
import {
  fetchCustomerDetail,
  fetchCustomerProjects,
  fetchProjectThoughts,
  fetchMonthlyRevenue,
  fetchMonthlyBreakdown,
  fetchYearlyRevenue,
  fetchYearlyBreakdown,
  fetchStakeholders,
  createStakeholder,
  updateStakeholder,
  fetchPartnerLogs,
  updateClientPartner,
  fetchEligiblePartners,
  fetchBookings,
  fetchBookingMonths,
} from '../api/customerDetail.js';

/**
 * Store for Customer Detail page.
 * Manages all state across Delivery, Stakeholders, and Logs sections.
 */
export const useCustomerDetailStore = create((set, get) => ({
  // ── Active Customer ────────────────────────────────────────────
  customer: null,
  customerLoading: false,
  customerError: null,

  // ── Active Section ─────────────────────────────────────────────
  activeSection: 'delivery',

  // ── Accordions (open/closed state) ────────────────────────────
  accordions: {
    projects: true,
    fyRevenue: true,
    profitMargin: false,
    lifetimeRevenue: false,
    billing: false,
    bookings: false,
  },

  // ── Projects ───────────────────────────────────────────────────
  projects: [],
  projectsLoading: false,
  projectsError: null,
  projectsTotalCount: 0,
  projectsPage: 1,
  projectsPageSize: 5,
  projectsSortCol: 'name',
  projectsSortDir: 'asc',
  projectsStatusFilter: '',
  projectsSearch: '',
  projectsCurrency: 'usd',
  projectsSearchOpen: false,

  // ── Current FY Revenue ─────────────────────────────────────────
  fyRevenue: [],
  fyRevenueLoading: false,
  fyRevenueTotalCount: 0,
  fyRevenuePage: 1,
  fyRevenuePageSize: 5,
  fyRevenueCurrency: 'usd',

  // ── Lifetime Revenue ───────────────────────────────────────────
  ltRevenue: [],
  ltRevenueLoading: false,
  ltRevenueTotalCount: 0,
  ltRevenuePage: 1,
  ltRevenuePageSize: 5,
  ltRevenueCurrency: 'usd',

  // ── Bookings ───────────────────────────────────────────────────
  bookings: [],
  bookingsLoading: false,
  bookingsTotalCount: 0,
  bookingsPage: 1,
  bookingsPageSize: 5,
  bookingsCurrency: 'usd',
  bookingsExpandedRows: {},  // { [bookingId]: monthsArray | null }
  bookingsExpandedLoading: {},

  // ── Stakeholders ───────────────────────────────────────────────
  stakeholders: [],
  stakeholdersLoading: false,
  manageStakeholdersOpen: false,
  selectedStakeholder: null,  // null = Add mode

  // ── Partner Logs ───────────────────────────────────────────────
  clientPartnerLogs: [],
  clientCoPartnerLogs: [],
  partnerLogsLoading: false,
  partnerLogsTab: 'client_partner',
  eligiblePartners: [],

  // ── Modals ─────────────────────────────────────────────────────
  overallHealthModal: null,    // project row object
  financialHealthModal: null,
  aiPulseModal: null,
  aiPulseThoughts: [],
  aiPulseThoughtsLoading: false,
  breakdownModal: null,        // { title, rows }
  breakdownLoading: false,
  clientPartnerModalOpen: false,

  // ══════════════════════════════════════════════════════════════
  // ACTIONS
  // ══════════════════════════════════════════════════════════════

  /**
   * Load customer header. Must be called once on page mount.
   * @param {number} customerId
   */
  async loadCustomer(customerId) {
    set({ customerLoading: true, customerError: null });
    try {
      const data = await fetchCustomerDetail(customerId);
      set({ customer: data, customerLoading: false });
    } catch (err) {
      set({ customerError: err.message, customerLoading: false });
    }
  },

  /**
   * Load projects for a customer (uses current pagination/sort/filter state).
   * @param {number} customerId
   */
  async loadProjects(customerId) {
    const { projectsPage, projectsPageSize, projectsSortCol, projectsSortDir, projectsStatusFilter, projectsSearch } = get();
    set({ projectsLoading: true, projectsError: null });
    try {
      const data = await fetchCustomerProjects(customerId, {
        page: projectsPage,
        pageSize: projectsPageSize,
        sort: projectsSortCol,
        order: projectsSortDir,
        status: projectsStatusFilter,
        search: projectsSearch,
      });
      set({ projects: data.rows, projectsTotalCount: data.totalCount, projectsLoading: false });
    } catch (err) {
      set({ projectsError: err.message, projectsLoading: false });
    }
  },

  setProjectsSort(customerId, col) {
    const { projectsSortCol, projectsSortDir } = get();
    const newDir = projectsSortCol === col && projectsSortDir === 'asc' ? 'desc' : 'asc';
    set({ projectsSortCol: col, projectsSortDir: newDir, projectsPage: 1 });
    get().loadProjects(customerId);
  },

  setProjectsPage(customerId, page) {
    set({ projectsPage: page });
    get().loadProjects(customerId);
  },

  setProjectsPageSize(customerId, size) {
    set({ projectsPageSize: size, projectsPage: 1 });
    get().loadProjects(customerId);
  },

  setProjectsStatusFilter(customerId, status) {
    set({ projectsStatusFilter: status, projectsPage: 1 });
    get().loadProjects(customerId);
  },

  setProjectsSearch(customerId, search) {
    set({ projectsSearch: search, projectsPage: 1 });
    get().loadProjects(customerId);
  },

  toggleProjectsCurrency() {
    const { projectsCurrency } = get();
    set({ projectsCurrency: projectsCurrency === 'usd' ? 'inr' : 'usd' });
  },

  toggleProjectsSearchOpen() {
    set((s) => ({ projectsSearchOpen: !s.projectsSearchOpen, projectsSearch: '' }));
  },

  // ── Current FY Revenue ─────────────────────────────────────────

  async loadFyRevenue(customerId) {
    const { fyRevenuePage, fyRevenuePageSize } = get();
    set({ fyRevenueLoading: true });
    try {
      const data = await fetchMonthlyRevenue(customerId, {
        page: fyRevenuePage,
        pageSize: fyRevenuePageSize,
      });
      set({ fyRevenue: data.rows, fyRevenueTotalCount: data.totalCount, fyRevenueLoading: false });
    } catch {
      set({ fyRevenueLoading: false });
    }
  },

  setFyRevenuePage(customerId, page) {
    set({ fyRevenuePage: page });
    get().loadFyRevenue(customerId);
  },

  setFyRevenuePageSize(customerId, size) {
    set({ fyRevenuePageSize: size, fyRevenuePage: 1 });
    get().loadFyRevenue(customerId);
  },

  toggleFyRevenueCurrency() {
    set((s) => ({ fyRevenueCurrency: s.fyRevenueCurrency === 'usd' ? 'inr' : 'usd' }));
  },

  async openBreakdownModal(customerId, monthYear) {
    set({ breakdownLoading: true, breakdownModal: { title: monthYear, rows: [] } });
    try {
      const rows = await fetchMonthlyBreakdown(customerId, monthYear);
      set({ breakdownModal: { title: monthYear, rows }, breakdownLoading: false });
    } catch {
      set({ breakdownLoading: false });
    }
  },

  closeBreakdownModal() {
    set({ breakdownModal: null });
  },

  // ── Lifetime Revenue ───────────────────────────────────────────

  async loadLtRevenue(customerId) {
    const { ltRevenuePage, ltRevenuePageSize } = get();
    set({ ltRevenueLoading: true });
    try {
      const data = await fetchYearlyRevenue(customerId, {
        page: ltRevenuePage,
        pageSize: ltRevenuePageSize,
      });
      set({ ltRevenue: data.rows, ltRevenueTotalCount: data.totalCount, ltRevenueLoading: false });
    } catch {
      set({ ltRevenueLoading: false });
    }
  },

  setLtRevenuePage(customerId, page) {
    set({ ltRevenuePage: page });
    get().loadLtRevenue(customerId);
  },

  setLtRevenuePageSize(customerId, size) {
    set({ ltRevenuePageSize: size, ltRevenuePage: 1 });
    get().loadLtRevenue(customerId);
  },

  toggleLtRevenueCurrency() {
    set((s) => ({ ltRevenueCurrency: s.ltRevenueCurrency === 'usd' ? 'inr' : 'usd' }));
  },

  async openYearlyBreakdownModal(customerId, fyYear) {
    set({ breakdownLoading: true, breakdownModal: { title: fyYear, rows: [] } });
    try {
      const rows = await fetchYearlyBreakdown(customerId, fyYear);
      set({ breakdownModal: { title: fyYear, rows }, breakdownLoading: false });
    } catch {
      set({ breakdownLoading: false });
    }
  },

  // ── Bookings ───────────────────────────────────────────────────

  async loadBookings(customerId) {
    const { bookingsPage, bookingsPageSize } = get();
    set({ bookingsLoading: true });
    try {
      const data = await fetchBookings(customerId, {
        page: bookingsPage,
        pageSize: bookingsPageSize,
      });
      set({ bookings: data.rows, bookingsTotalCount: data.totalCount, bookingsLoading: false });
    } catch {
      set({ bookingsLoading: false });
    }
  },

  setBookingsPage(customerId, page) {
    set({ bookingsPage: page });
    get().loadBookings(customerId);
  },

  setBookingsPageSize(customerId, size) {
    set({ bookingsPageSize: size, bookingsPage: 1 });
    get().loadBookings(customerId);
  },

  toggleBookingsCurrency() {
    set((s) => ({ bookingsCurrency: s.bookingsCurrency === 'usd' ? 'inr' : 'usd' }));
  },

  async toggleBookingRow(customerId, bookingId) {
    const { bookingsExpandedRows } = get();
    if (bookingsExpandedRows[bookingId] !== undefined) {
      // Collapse: remove from expanded
      const updated = { ...bookingsExpandedRows };
      delete updated[bookingId];
      set({ bookingsExpandedRows: updated });
    } else {
      // Expand: fetch months
      set((s) => ({ bookingsExpandedLoading: { ...s.bookingsExpandedLoading, [bookingId]: true } }));
      try {
        const months = await fetchBookingMonths(customerId, bookingId);
        set((s) => ({
          bookingsExpandedRows: { ...s.bookingsExpandedRows, [bookingId]: months },
          bookingsExpandedLoading: { ...s.bookingsExpandedLoading, [bookingId]: false },
        }));
      } catch {
        set((s) => ({ bookingsExpandedLoading: { ...s.bookingsExpandedLoading, [bookingId]: false } }));
      }
    }
  },

  // ── Stakeholders ───────────────────────────────────────────────

  async loadStakeholders(customerId) {
    set({ stakeholdersLoading: true });
    try {
      const data = await fetchStakeholders(customerId);
      set({ stakeholders: data, stakeholdersLoading: false });
    } catch {
      set({ stakeholdersLoading: false });
    }
  },

  openManageStakeholders(stakeholder = null) {
    set({ manageStakeholdersOpen: true, selectedStakeholder: stakeholder });
  },

  closeManageStakeholders() {
    set({ manageStakeholdersOpen: false, selectedStakeholder: null });
  },

  selectStakeholderForEdit(stakeholder) {
    set({ selectedStakeholder: stakeholder });
  },

  async saveStakeholder(customerId, data) {
    const { selectedStakeholder } = get();
    if (selectedStakeholder) {
      const updated = await updateStakeholder(customerId, selectedStakeholder.id, data);
      set((s) => ({
        stakeholders: s.stakeholders.map((sk) => sk.id === updated.id ? updated : sk),
        selectedStakeholder: updated,
      }));
    } else {
      const created = await createStakeholder(customerId, data);
      set((s) => ({ stakeholders: [...s.stakeholders, created] }));
    }
  },

  // ── Partner Logs ───────────────────────────────────────────────

  async loadPartnerLogs(customerId) {
    set({ partnerLogsLoading: true });
    try {
      const [cpLogs, ccpLogs] = await Promise.all([
        fetchPartnerLogs(customerId, 'client_partner'),
        fetchPartnerLogs(customerId, 'client_co_partner'),
      ]);
      set({ clientPartnerLogs: cpLogs, clientCoPartnerLogs: ccpLogs, partnerLogsLoading: false });
    } catch {
      set({ partnerLogsLoading: false });
    }
  },

  setPartnerLogsTab(tab) {
    set({ partnerLogsTab: tab });
  },

  async loadEligiblePartners() {
    try {
      const data = await fetchEligiblePartners();
      set({ eligiblePartners: data });
    } catch {
      // silently fail — list just stays empty
    }
  },

  openClientPartnerModal() {
    get().loadEligiblePartners();
    set({ clientPartnerModalOpen: true });
  },

  closeClientPartnerModal() {
    set({ clientPartnerModalOpen: false });
  },

  async saveClientPartner(customerId, partnerName, updatedBy) {
    await updateClientPartner(customerId, partnerName, updatedBy);
    // Refresh customer header and logs
    await get().loadCustomer(customerId);
    await get().loadPartnerLogs(customerId);
    set({ clientPartnerModalOpen: false });
  },

  // ── Project Modals ─────────────────────────────────────────────

  openOverallHealthModal(project) {
    set({ overallHealthModal: project });
  },
  closeOverallHealthModal() {
    set({ overallHealthModal: null });
  },

  openFinancialHealthModal(project) {
    set({ financialHealthModal: project });
  },
  closeFinancialHealthModal() {
    set({ financialHealthModal: null });
  },

  async openAiPulseModal(customerId, project) {
    set({ aiPulseModal: project, aiPulseThoughts: [], aiPulseThoughtsLoading: true });
    try {
      const thoughts = await fetchProjectThoughts(customerId, project.id);
      set({ aiPulseThoughts: thoughts, aiPulseThoughtsLoading: false });
    } catch {
      set({ aiPulseThoughtsLoading: false });
    }
  },
  closeAiPulseModal() {
    set({ aiPulseModal: null, aiPulseThoughts: [] });
  },

  // ── Accordion toggle ───────────────────────────────────────────

  toggleAccordion(key) {
    set((s) => {
      const isCurrentlyOpen = s.accordions[key];
      // Close all, then open the target (unless it was already open — then just close it)
      const allClosed = Object.fromEntries(Object.keys(s.accordions).map((k) => [k, false]));
      return { accordions: { ...allClosed, [key]: !isCurrentlyOpen } };
    });
  },

  // ── Reset ──────────────────────────────────────────────────────

  /** Reset store for a new customer navigation */
  reset() {
    set({
      customer: null, customerLoading: false, customerError: null,
      projects: [], projectsLoading: false, projectsTotalCount: 0, projectsPage: 1,
      fyRevenue: [], fyRevenueLoading: false, fyRevenueTotalCount: 0, fyRevenuePage: 1,
      ltRevenue: [], ltRevenueLoading: false, ltRevenueTotalCount: 0, ltRevenuePage: 1,
      bookings: [], bookingsLoading: false, bookingsTotalCount: 0, bookingsPage: 1,
      bookingsExpandedRows: {},
      stakeholders: [], stakeholdersLoading: false,
      clientPartnerLogs: [], clientCoPartnerLogs: [],
      overallHealthModal: null, financialHealthModal: null, aiPulseModal: null,
      breakdownModal: null, clientPartnerModalOpen: false, manageStakeholdersOpen: false,
    });
  },
}));
