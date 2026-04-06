import { create } from 'zustand';

// ── Overview store ──────────────────────────────────────────────
export const useOverviewStore = create((set) => ({
  myCOE: false,
  sort: { column: null, direction: 'asc' },
  filters: {},          // { columnKey: selectedValue }
  page: 1,
  pageSize: 10,
  hideDetails: false,

  setMyCOE: (v) => set({ myCOE: v, page: 1 }),
  setSort: (column) =>
    set((s) => ({
      sort: {
        column,
        direction: s.sort.column === column && s.sort.direction === 'asc' ? 'desc' : 'asc',
      },
    })),
  setFilter: (col, val) => set((s) => ({ filters: { ...s.filters, [col]: val }, page: 1 })),
  clearFilter: (col) =>
    set((s) => {
      const f = { ...s.filters };
      delete f[col];
      return { filters: f, page: 1 };
    }),
  clearAllFilters: () => set({ filters: {}, page: 1 }),
  setPage: (p) => set({ page: p }),
  setPageSize: (ps) => set({ pageSize: ps, page: 1 }),
  toggleHideDetails: () => set((s) => ({ hideDetails: !s.hideDetails })),
}));

// ── People list store ───────────────────────────────────────────
export const usePeopleListStore = create((set) => ({
  myPeople: true,
  activeTab: 'all',     // 'all' | 'bench'
  viewMode: 'list',     // 'list' | 'calendar'
  search: '',
  sort: { column: null, direction: 'asc' },
  filters: {},
  page: 1,
  pageSize: 10,
  hideDetails: false,

  setMyPeople: (v) => set({ myPeople: v, page: 1 }),
  setActiveTab: (t) => set({ activeTab: t, page: 1 }),
  setViewMode: (v) => set({ viewMode: v }),
  setSearch: (s) => set({ search: s, page: 1 }),
  setSort: (column) =>
    set((s) => ({
      sort: {
        column,
        direction: s.sort.column === column && s.sort.direction === 'asc' ? 'desc' : 'asc',
      },
    })),
  setFilter: (col, val) => set((s) => ({ filters: { ...s.filters, [col]: val }, page: 1 })),
  clearFilter: (col) =>
    set((s) => {
      const f = { ...s.filters };
      delete f[col];
      return { filters: f, page: 1 };
    }),
  clearAllFilters: () => set({ filters: {}, page: 1 }),
  setPage: (p) => set({ page: p }),
  setPageSize: (ps) => set({ pageSize: ps, page: 1 }),
  toggleHideDetails: () => set((s) => ({ hideDetails: !s.hideDetails })),
}));

// ── Project store ───────────────────────────────────────────────
export const useProjectStore = create((set) => ({
  myCOE: false,
  search: '',
  sort: { column: null, direction: 'asc' },
  filters: {},
  page: 1,
  pageSize: 10,
  hideDetails: false,

  setMyCOE: (v) => set({ myCOE: v, page: 1 }),
  setSearch: (s) => set({ search: s, page: 1 }),
  setSort: (column) =>
    set((s) => ({
      sort: {
        column,
        direction: s.sort.column === column && s.sort.direction === 'asc' ? 'desc' : 'asc',
      },
    })),
  setFilter: (col, val) => set((s) => ({ filters: { ...s.filters, [col]: val }, page: 1 })),
  clearFilter: (col) =>
    set((s) => {
      const f = { ...s.filters };
      delete f[col];
      return { filters: f, page: 1 };
    }),
  clearAllFilters: () => set({ filters: {}, page: 1 }),
  setPage: (p) => set({ page: p }),
  setPageSize: (ps) => set({ pageSize: ps, page: 1 }),
  toggleHideDetails: () => set((s) => ({ hideDetails: !s.hideDetails })),
}));
