"use client";

import { useEffect, useState } from "react";
import { initialDashboards } from "../data/dashboards";
import {
  loadDashboards,
  loadProfile,
  loadSidebarCollapsed,
  loadTheme,
  loadWelcomeSeen,
  saveDashboards,
  saveProfile,
  saveSidebarCollapsed,
  saveTheme,
  saveWelcomeSeen,
  type WorkspaceTheme,
} from "../lib/dashboard-storage";
import {
  DEFAULT_PROFILE,
  normalizeStoredDashboards,
  type StoredDashboard,
  type WorkspaceProfile,
} from "../lib/dashboard-workspace";
import type { DashboardSummary } from "../types/dashboard";

export function useDashboardWorkspace() {
  const [dashboards, setDashboards] = useState<DashboardSummary[]>(initialDashboards);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [profile, setProfile] = useState<WorkspaceProfile>(DEFAULT_PROFILE);
  const [theme, setTheme] = useState<WorkspaceTheme>("dark");
  const [welcomeSeen, setWelcomeSeen] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const stored = loadDashboards(initialDashboards) as StoredDashboard[];
      const savedProfile = loadProfile(DEFAULT_PROFILE);
      setDashboards(normalizeStoredDashboards(stored));
      setSidebarCollapsed(loadSidebarCollapsed());
      setProfile(savedProfile);
      setTheme(loadTheme());
      setWelcomeSeen(loadWelcomeSeen());
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (hydrated) saveDashboards(dashboards);
  }, [dashboards, hydrated]);

  useEffect(() => {
    if (hydrated) saveSidebarCollapsed(sidebarCollapsed);
  }, [hydrated, sidebarCollapsed]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    if (hydrated) saveTheme(theme);
  }, [hydrated, theme]);

  const updateProfile = (next: WorkspaceProfile) => {
    setProfile(next);
    saveProfile(next);
  };

  const dismissWelcome = () => {
    setWelcomeSeen(true);
    saveWelcomeSeen(true);
  };

  const showWelcome = () => {
    setWelcomeSeen(false);
    saveWelcomeSeen(false);
  };

  return {
    dashboards,
    setDashboards,
    sidebarCollapsed,
    setSidebarCollapsed,
    profile,
    updateProfile,
    theme,
    setTheme,
    hydrated,
    welcomeSeen,
    dismissWelcome,
    showWelcome,
  };
}
