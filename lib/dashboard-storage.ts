import type { DashboardSummary } from "../types/dashboard";

export const STORAGE_KEY = "flowview:workspace";
export const STORAGE_VERSION = 3;
export type WorkspaceTheme = "light" | "dark";

export interface StoredProfile {
  name: string;
  role: string;
  initials: string;
}

export interface FlowViewWorkspace {
  version: number;
  dashboards: DashboardSummary[];
  profile?: StoredProfile;
  preferences?: { sidebarCollapsed?: boolean; welcomeSeen?: boolean; theme?: WorkspaceTheme };
  widgetLayouts?: Record<string, unknown[]>;
}

const emptyWorkspace = (dashboards: DashboardSummary[]): FlowViewWorkspace => ({ version: STORAGE_VERSION, dashboards, widgetLayouts: {} });

export function decodeWorkspace(raw: string | null, fallback: DashboardSummary[]): FlowViewWorkspace {
  if (!raw) return emptyWorkspace(fallback);
  try {
    const parsed = JSON.parse(raw) as Partial<FlowViewWorkspace> | DashboardSummary[];
    if (Array.isArray(parsed)) return emptyWorkspace(parsed);
    if (!Array.isArray(parsed.dashboards)) return emptyWorkspace(fallback);
    return { version: STORAGE_VERSION, dashboards: parsed.dashboards, profile: parsed.profile, preferences: parsed.preferences, widgetLayouts: parsed.widgetLayouts ?? {} };
  } catch {
    return emptyWorkspace(fallback);
  }
}

export function loadWorkspace(fallback: DashboardSummary[] = []) {
  if (typeof window === "undefined") return emptyWorkspace(fallback);
  const current = window.localStorage.getItem(STORAGE_KEY);
  const legacy = window.localStorage.getItem("flowview:dashboards") ?? window.localStorage.getItem("dashhub:dashboards");
  const workspace = decodeWorkspace(current ?? legacy, fallback);
  if (!workspace.profile) {
    try { workspace.profile = JSON.parse(window.localStorage.getItem("flowview:profile") ?? "null") ?? undefined; } catch { /* ignore invalid legacy data */ }
  }
  if (workspace.preferences?.sidebarCollapsed === undefined) {
    workspace.preferences = { ...workspace.preferences, sidebarCollapsed: window.localStorage.getItem("flowview:sidebar-collapsed") === "true" };
  }
  return workspace;
}

export function saveWorkspace(workspace: FlowViewWorkspace) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...workspace, version: STORAGE_VERSION }));
}

export const loadDashboards = (fallback: DashboardSummary[]) => loadWorkspace(fallback).dashboards;
export const saveDashboards = (dashboards: DashboardSummary[]) => saveWorkspace({ ...loadWorkspace(), dashboards });
export const loadProfile = (fallback: StoredProfile) => loadWorkspace().profile ?? fallback;
export const saveProfile = (profile: StoredProfile) => saveWorkspace({ ...loadWorkspace(), profile });
export const loadSidebarCollapsed = () => loadWorkspace().preferences?.sidebarCollapsed ?? false;
export function saveSidebarCollapsed(sidebarCollapsed: boolean) { const workspace = loadWorkspace(); saveWorkspace({ ...workspace, preferences: { ...workspace.preferences, sidebarCollapsed } }); }
export const loadWelcomeSeen = () => loadWorkspace().preferences?.welcomeSeen ?? false;
export function saveWelcomeSeen(welcomeSeen: boolean) { const workspace = loadWorkspace(); saveWorkspace({ ...workspace, preferences: { ...workspace.preferences, welcomeSeen } }); }
export const loadTheme = (): WorkspaceTheme => {
  const stored = loadWorkspace().preferences?.theme;
  if (stored === "light" || stored === "dark") return stored;
  if (typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: light)").matches) return "light";
  return "dark";
};
export function saveTheme(theme: WorkspaceTheme) { const workspace = loadWorkspace(); saveWorkspace({ ...workspace, preferences: { ...workspace.preferences, theme } }); }

export function loadWidgetLayout<T>(key: string, fallback: T[]): T[] {
  const current = loadWorkspace().widgetLayouts?.[key];
  if (Array.isArray(current)) return current as T[];
  if (typeof window === "undefined") return fallback;
  const legacy = window.localStorage.getItem(key);
  if (!legacy) return fallback;
  try { return JSON.parse(legacy) as T[]; } catch { return fallback; }
}

export function saveWidgetLayout<T>(key: string, layout: T[]) {
  const workspace = loadWorkspace();
  saveWorkspace({ ...workspace, widgetLayouts: { ...workspace.widgetLayouts, [key]: layout as unknown[] } });
}

export function removeWidgetLayout(key: string) {
  const workspace = loadWorkspace();
  const widgetLayouts = { ...workspace.widgetLayouts };
  delete widgetLayouts[key];
  saveWorkspace({ ...workspace, widgetLayouts });
}
