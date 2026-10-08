"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { dashboardModels as modelProfiles, dashboardModelName as modelName, type CreatorKind } from "@/data/dashboard-config";
import { templates } from "@/data/dashboards";
import { SimpleDashboardCreator } from "@/components/simple-dashboard-creator";
import { DashboardAppearanceDock } from "@/components/dashboard-appearance-dock";
import { DashboardHub, DashboardMiniPreview, ShowcaseDashboard } from "@/components/dashboard/dashboard-experience";
import { AppHeader, AppSidebar, MobileNavigation, type AppPage } from "@/components/layout/app-shell";
import { DeleteDashboardDialog, ProfileDialog, SettingsDialog, WelcomeDialog } from "@/components/settings/workspace-dialogs";
import { useDashboardWorkspace } from "@/hooks/use-dashboard-workspace";
import { cloneDashboard, createDashboardFromTemplate, filterDashboards, normalizeProfile, restoreDashboard, type WorkspaceProfile } from "@/lib/dashboard-workspace";
import { cn } from "@/lib/utils";
import type { DashboardKind, DashboardModel, DashboardSummary } from "@/types/dashboard";

function DashboardLoading() {
  return <div className="min-h-[60vh] bg-background p-5 sm:p-8"><div className="mx-auto max-w-[1440px] animate-pulse"><div className="mb-8 h-10 w-64 rounded-xl bg-muted" /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <div key={index} className="h-32 rounded-[22px] border border-border bg-card" />)}</div><div className="mt-4 grid gap-4 lg:grid-cols-3"><div className="h-80 rounded-[22px] border border-border bg-card lg:col-span-2" /><div className="h-80 rounded-[22px] border border-border bg-card" /></div></div></div>;
}

const dynamicOptions = { ssr: false, loading: DashboardLoading } as const;
const DashboardStudio = dynamic(() => import("@/components/dashboard-studio").then((module) => module.DashboardStudio), dynamicOptions);
const FinanceDashboard = dynamic(() => import("@/components/finance-dashboard").then((module) => module.FinanceDashboard), dynamicOptions);
const SalesDashboard = dynamic(() => import("@/components/sales-dashboard").then((module) => module.SalesDashboard), dynamicOptions);
const MarketingDashboard = dynamic(() => import("@/components/marketing-dashboard").then((module) => module.MarketingDashboard), dynamicOptions);


function TemplateGallery({ use, chooseModel, theme }: { use: (kind: DashboardKind, name: string, model: DashboardModel) => void; chooseModel: (model: DashboardModel) => void; theme: "light" | "dark" }) {
  const compositionLabels: Record<DashboardModel, string> = { simple: "Essencial", pro: "Balanceado", turbo: "Alta densidade", premium: "Monitoramento" };
  return <div className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-7 lg:px-9">
    <div className="max-w-2xl"><p className="text-xs font-medium uppercase tracking-[0.16em] text-cyan-300/70">Galeria visual</p><h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-white">Escolha como seus dados vão aparecer</h1><p className="mt-3 text-slate-400">Cada estilo oferece uma linguagem visual diferente. Nenhum representa plano, preço ou nível de acesso.</p></div>
    <section className="mt-8"><div className="mb-4 flex items-center justify-between"><div><h2 className="font-semibold text-white">Estilos de dashboard</h2><p className="mt-1 text-sm text-slate-500">Quatro maneiras de organizar e apresentar os mesmos dados.</p></div><span className="rounded-full border border-cyan-300/15 bg-cyan-300/[0.06] px-3 py-1 text-xs font-medium text-cyan-200">Estilos visuais</span></div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{modelProfiles.map((profile) => <article key={profile.id} className="group rounded-[18px] border border-white/[0.08] bg-[#11151d] p-3 transition hover:border-sky-300/25"><DashboardMiniPreview kind="custom" model={profile.id} theme={theme} /><div className="p-2 pt-4"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-300/70">{profile.eyebrow}</p><div className="mt-1 flex items-center justify-between gap-3"><h3 className="text-lg font-semibold text-white">{profile.name}</h3><span className="rounded-md border border-white/[.06] bg-white/[0.03] px-2 py-1 text-[11px] text-slate-400">{compositionLabels[profile.id]}</span></div><p className="mt-2 min-h-10 text-xs leading-relaxed text-slate-400">{profile.description}</p><Button onClick={() => chooseModel(profile.id)} variant="outline" className="mt-4 w-full rounded-lg border-white/[0.09] bg-transparent text-slate-200 hover:border-sky-300/30 hover:bg-sky-300/[0.05] hover:text-white">Escolher {profile.name}</Button></div></article>)}</div>
    </section>
    <section className="mt-10"><div><h2 className="font-semibold text-white">Bases prontas</h2><p className="mt-1 text-sm text-slate-400">Escolha o tipo de conteúdo e personalize o estilo depois.</p></div><div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{templates.map((template) => <article key={template.kind} className="rounded-[18px] border border-white/[0.08] bg-[#11151d] p-4"><DashboardMiniPreview kind={template.kind} model={template.model} theme={theme} /><div className="p-2 pt-5"><div className="flex items-start justify-between gap-3"><div><h3 className="font-semibold text-white">{template.name}</h3><p className="mt-1 text-sm leading-relaxed text-slate-400">{template.description}</p></div><span className="rounded-md bg-white/[0.04] px-2 py-1 text-xs text-slate-400">{modelName(template.model)}</span></div><Button onClick={() => use(template.kind, template.name, template.model)} variant="outline" className="mt-5 w-full rounded-lg border-white/[0.09] bg-transparent text-slate-200 hover:border-sky-400/30 hover:bg-sky-400/[0.05] hover:text-white">Usar base</Button></div></article>)}</div></section>
  </div>;
}

export function DashboardApp() {
  const [page, setPage] = useState<AppPage>("home");
  const [mobileMenu, setMobileMenu] = useState(false);
  const { dashboards, setDashboards, sidebarCollapsed, setSidebarCollapsed, profile, updateProfile, theme, setTheme } = useDashboardWorkspace();
  const [selected, setSelected] = useState("anacraft-store");
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newKind, setNewKind] = useState<CreatorKind>("custom");
  const [newModel, setNewModel] = useState<DashboardModel>("simple");
  const [query, setQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<DashboardSummary | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  const [profileDraft, setProfileDraft] = useState<WorkspaceProfile>(profile);
  const showWelcome = () => setWelcomeOpen(true);
  const dismissWelcome = () => setWelcomeOpen(false);

  useEffect(() => {
    const context = (document as unknown as {
      modelContext?: {
        registerTool: (tool: Record<string, unknown>, options?: { signal?: AbortSignal }) => void | Promise<void>;
      };
    }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const register = async () => {
      await context.registerTool({
        name: "list_dashboards",
        title: "Listar dashboards",
        description: "Lista os dashboards existentes no workspace atual.",
        inputSchema: { type: "object", properties: {}, additionalProperties: false },
        annotations: { readOnlyHint: true, untrustedContentHint: false },
        execute: () => dashboards.map(({ id, name, kind, model, widgetCount }) => ({ id, name, kind, model, widgetCount })),
      }, { signal: lifecycle.signal });
      await context.registerTool({
        name: "create_dashboard",
        title: "Criar dashboard",
        description: "Cria um dashboard a partir de um template e abre a nova visualização.",
        inputSchema: {
          type: "object",
          properties: {
            name: { type: "string", minLength: 1 },
            kind: { type: "string", enum: ["finance", "sales", "marketing", "custom"] },
            model: { type: "string", enum: ["simple", "turbo", "pro", "premium"] },
          },
          required: ["name", "kind", "model"],
          additionalProperties: false,
        },
        annotations: { readOnlyHint: false, untrustedContentHint: false },
        execute: (input: unknown) => {
          const value = input as { name?: unknown; kind?: unknown; model?: unknown };
          if (typeof value.name !== "string" || !value.name.trim()) throw new Error("Informe um nome para o dashboard.");
          if (!templates.some((item) => item.kind === value.kind)) throw new Error("Template inválido.");
          if (!modelProfiles.some((item) => item.id === value.model)) throw new Error("Estilo visual inválido.");
          const template = templates.find((item) => item.kind === value.kind)!;
          const item = createDashboardFromTemplate(template, value.name, value.model as DashboardModel);
          setDashboards((current) => [...current, item]);
          setSelected(item.id);
          setPage("dashboard");
          return { id: item.id, name: item.name, status: "created" };
        },
      }, { signal: lifecycle.signal });
    };
    void register().catch(() => undefined);
    return () => lifecycle.abort();
  }, [dashboards, setDashboards]);

  const active = useMemo(() => dashboards.find((item) => item.id === selected) ?? dashboards[0], [dashboards, selected]);
  const visibleDashboards = useMemo(() => filterDashboards(dashboards, query), [dashboards, query]);
  const title = page === "dashboard" ? active?.name ?? "Dashboard" : page === "templates" ? "Templates" : "Dashboards";
  function openDashboard(id: string) { setSelected(id); setPage("dashboard"); window.scrollTo({ top: 0, behavior: "smooth" }); }
  function addCreatedDashboard(item: DashboardSummary) { setDashboards((current) => [...current, item]); setCreateOpen(false); setNewName(""); openDashboard(item.id); toast.success("Dashboard criado e salvo neste navegador."); }
  function updateDashboard(id: string, patch: Partial<DashboardSummary>) { setDashboards((current) => current.map((item) => item.id === id ? { ...item, ...patch } : item)); }
  function duplicateDashboard(source: DashboardSummary) { const copy = cloneDashboard(source); setDashboards((current) => [...current, copy]); setSelected(copy.id); setPage("dashboard"); toast.success("Dashboard duplicado."); }
  function confirmDelete() { if (!deleteTarget || deleteTarget.kind === "anacraft") return; const removed = deleteTarget; const removedIndex = dashboards.findIndex((item) => item.id === removed.id); setDashboards((current) => current.filter((item) => item.id !== removed.id)); if (selected === removed.id) { setSelected("anacraft-store"); setPage("home"); } setDeleteTarget(null); toast.success("Dashboard excluído.", { action: { label: "Desfazer", onClick: () => { setDashboards((current) => restoreDashboard(current, removed, removedIndex)); toast.success("Dashboard restaurado."); } } }); }
  function saveProfile() { const next = normalizeProfile(profileDraft); updateProfile(next); setProfileOpen(false); toast.success("Perfil atualizado."); }

  function renderDashboard() {
    if (!active) return null;
    const update = (patch: Partial<DashboardSummary>) => updateDashboard(active.id, patch);
    const content = active.data && active.kind === "finance"
      ? <FinanceDashboard dashboard={active} back={() => setPage("home")} onUpdate={update} theme={theme} embedded />
      : active.data && active.kind === "sales"
        ? <SalesDashboard dashboard={active} back={() => setPage("home")} onUpdate={update} theme={theme} embedded />
        : active.data && active.kind === "marketing"
          ? <MarketingDashboard dashboard={active} back={() => setPage("home")} onUpdate={update} theme={theme} embedded />
          : active.data && active.kind !== "anacraft"
            ? <DashboardStudio dashboard={active} back={() => setPage("home")} onUpdate={update} onDuplicate={() => duplicateDashboard(active)} theme={theme} embedded />
            : <ShowcaseDashboard back={() => setPage("home")} name={active.name} model={active.model} duplicate={() => duplicateDashboard(active)} showcase={active.kind === "anacraft"} />;

    if (!active.data || active.kind === "anacraft") return content;
    return <DashboardAppearanceDock dashboard={active} onUpdate={update} onDuplicate={() => duplicateDashboard(active)} theme={theme}>{content}</DashboardAppearanceDock>;
  }

  return <div className="min-h-screen bg-background text-foreground selection:bg-sky-400/30">
    <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_74%_0%,rgba(56,189,248,.045),transparent_26%)]" />
    <AppSidebar page={page} go={setPage} open={mobileMenu} close={() => setMobileMenu(false)} collapsed={sidebarCollapsed} toggle={() => setSidebarCollapsed((current) => !current)} />
    <div className={cn("relative min-h-screen transition-[padding] duration-300", sidebarCollapsed ? "lg:pl-[88px]" : "lg:pl-[272px]")}><AppHeader title={title} menu={() => setMobileMenu(true)} profile={profile} openProfile={() => { setProfileDraft(profile); setProfileOpen(true); }} openSettings={() => setSettingsOpen(true)} query={query} onQueryChange={setQuery} canSearch={page === "home"} /><main>{page === "home" && <DashboardHub dashboards={visibleDashboards} query={query} clearSearch={() => setQuery("")} open={openDashboard} create={() => { setNewKind("custom"); setNewName(""); setNewModel("simple"); setCreateOpen(true); }} showTemplates={() => setPage("templates")} remove={setDeleteTarget} theme={theme} />}{page === "dashboard" && renderDashboard()}{page === "templates" && <TemplateGallery use={(kind, name, model) => { setNewKind(kind as CreatorKind); setNewName(name); setNewModel(model); setCreateOpen(true); }} chooseModel={(model) => { setNewModel(model); setNewKind("custom"); setNewName(""); setCreateOpen(true); }} theme={theme} />}</main></div>
    <SimpleDashboardCreator key={`${createOpen}-${newKind}-${newModel}-${newName}-${theme}`} open={createOpen} onOpenChange={setCreateOpen} initialKind={newKind} initialModel={newModel} initialName={newName} theme={theme} onCreate={addCreatedDashboard} />
    <WelcomeDialog open={welcomeOpen} onClose={dismissWelcome} onCreate={() => { dismissWelcome(); setNewKind("custom"); setNewName(""); setNewModel("simple"); setCreateOpen(true); }} onExplore={() => { dismissWelcome(); openDashboard("anacraft-store"); }} />
    <DeleteDashboardDialog dashboard={deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={confirmDelete} />
    <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} theme={theme} setTheme={setTheme} showWelcome={showWelcome} dashboardCount={dashboards.length} />
    <ProfileDialog open={profileOpen} onOpenChange={setProfileOpen} draft={profileDraft} setDraft={setProfileDraft} onSave={saveProfile} onSettings={() => { setProfileOpen(false); setSettingsOpen(true); }} />
    <MobileNavigation page={page} go={setPage} />
  </div>;
}
