export interface ColumnSettings {
  image: boolean;
  title: boolean;
  desc: boolean;
  category: boolean;
  tag: boolean;
  type: boolean;
  amazonUrl: boolean;
}

export interface ActionSettings {
  edit: boolean;
  delete: boolean;
  moveTop: boolean;
  movePosition: boolean;
  moveBottom: boolean;
}

export interface TableSettings {
  coloringBook: ColumnSettings;
  notebook: ColumnSettings;
  actions: ActionSettings;
}

export const defaultTableSettings = (): TableSettings => ({
  coloringBook: {
    image: true,
    title: true,
    desc: true,
    category: true,
    tag: true,
    type: false,
    amazonUrl: true,
  },
  notebook: {
    image: true,
    title: true,
    desc: true,
    category: true,
    tag: true,
    type: true,
    amazonUrl: true,
  },
  actions: {
    edit: true,
    delete: true,
    moveTop: true,
    movePosition: true,
    moveBottom: true,
  },
});

const STORAGE_KEY = "admin-table-settings";

export function loadTableSettings(): TableSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as TableSettings;
      // Deep-merge so new keys added later still appear
      const defaults = defaultTableSettings();
      return {
        coloringBook: { ...defaults.coloringBook, ...parsed.coloringBook },
        notebook: { ...defaults.notebook, ...parsed.notebook },
        actions: { ...defaults.actions, ...parsed.actions },
      };
    }
  } catch {
    // ignore
  }
  return defaultTableSettings();
}

export function saveTableSettings(s: TableSettings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}
