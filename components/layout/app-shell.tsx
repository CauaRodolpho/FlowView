"use client";

import { BarChart3, Code2, LayoutDashboard, LayoutTemplate, Menu, PanelLeftClose, PanelLeftOpen, Search, Settings, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { WorkspaceProfile } from "@/lib/dashboard-workspace";
import { cn } from "@/lib/utils";

export type AppPage = "home" | "templates" | "dashboard";

export const appNavigation = [
  { id: "home" as const, label: "Meus dashboards", icon: LayoutDashboard },
  { id: "templates" as const, label: "Templates", icon: LayoutTemplate },
];

function Brand({ collapsed, onHome }: { collapsed: boolean; onHome: () => void }) {
  return (
    <button type="button" onClick={onHome} aria-label="Ir para meus dashboards" className="flex min-h-11 items-center gap-3 rounded-xl text-left transition hover:opacity-85">
      <span className="relative grid size-10 place-items-center rounded-xl border border-primary/20 bg-primary/10">
        <BarChart3 className="size-5 text-primary" strokeWidth={2.2} />
      </span>
      <span className={cn(collapsed && "lg:hidden")}>
        <span className="block text-[17px] font-semibold tracking-[-0.02em] text-sidebar-foreground">FlowView</span>
        <span className="block text-xs font-medium text-muted-foreground">Dashboard studio</span>
      </span>
    </button>
  );
}

type SidebarProps = {
  page: AppPage;
  go: (page: AppPage) => void;
  open: boolean;
  close: () => void;
  collapsed: boolean;
  toggle: () => void;
};

export function AppSidebar({ page, go, open, close, collapsed, toggle }: SidebarProps) {
  const goTo = (nextPage: AppPage) => {
    go(nextPage);
    close();
  };

  return (
    <>
      <button type="button" aria-label="Fechar menu" className={cn("fixed inset-0 z-40 bg-background/75 backdrop-blur-sm lg:hidden", open ? "block" : "hidden")} onClick={close} />
      <aside aria-label="Menu principal" className={cn("fixed inset-y-0 left-0 z-50 flex w-[min(272px,calc(100vw-40px))] flex-col border-r border-sidebar-border bg-sidebar p-5 text-sidebar-foreground transition-[width,transform,padding] duration-300 lg:w-[272px] lg:translate-x-0", collapsed && "lg:w-[88px] lg:px-4", open ? "translate-x-0" : "-translate-x-full")}>
        <div className={cn("flex items-center justify-between gap-2 px-1", collapsed && "lg:flex-col lg:justify-start")}>
          <Brand collapsed={collapsed} onHome={() => goTo("home")} />
          <Button variant="ghost" size="icon" onClick={toggle} className={cn("hidden size-9 shrink-0 rounded-lg text-muted-foreground hover:bg-sidebar-accent hover:text-primary lg:inline-flex", collapsed && "lg:mt-1")} aria-label={collapsed ? "Expandir menu" : "Recolher menu"} title={collapsed ? "Expandir menu" : "Recolher menu"}>
            {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
          </Button>
          <Button variant="ghost" size="icon" className="size-11 text-muted-foreground lg:hidden" onClick={close} aria-label="Fechar menu"><X /></Button>
        </div>

        <nav className="mt-10 space-y-2" aria-label="Navegação principal">
          {appNavigation.map((item) => {
            const active = page === item.id || (page === "dashboard" && item.id === "home");
            return (
              <button key={item.id} onClick={() => goTo(item.id)} title={collapsed ? item.label : undefined} aria-current={active ? "page" : undefined} className={cn("group flex min-h-11 w-full items-center gap-3 rounded-lg border px-3.5 py-3 text-left text-sm font-medium transition", collapsed && "lg:justify-center lg:px-0", active ? "border-sidebar-primary/15 bg-sidebar-accent text-sidebar-accent-foreground" : "border-transparent text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground")}>
                <item.icon className={cn("size-[18px] shrink-0", active ? "text-sidebar-primary" : "group-hover:text-sidebar-accent-foreground")} />
                <span className={cn(collapsed && "lg:hidden")}>{item.label}</span>
                {active && <span className={cn("ml-auto h-4 w-0.5 rounded-full bg-sidebar-primary", collapsed && "lg:hidden")} />}
              </button>
            );
          })}
        </nav>

        <div className={cn("mt-auto rounded-xl border border-sidebar-border bg-sidebar-accent p-4", collapsed && "lg:hidden")}>
          <div className="mb-3 grid size-9 place-items-center rounded-lg bg-primary/10 text-primary"><LayoutDashboard className="size-4" /></div>
          <p className="text-sm font-semibold">Seu espaço, seu jeito</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Organize seus indicadores em uma visão feita para você.</p>
        </div>

        <a href="https://github.com/CauaRodolpho" target="_blank" rel="noreferrer" title="GitHub de Cauã Rodolpho" className={cn("mt-4 flex min-h-11 items-center gap-3 border-t border-sidebar-border pt-4 text-muted-foreground transition hover:text-primary", collapsed && "lg:mt-auto lg:justify-center")}>
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-sidebar-accent"><Code2 className="size-4" /></span>
          <span className={cn("text-xs leading-relaxed", collapsed && "lg:hidden")}>Desenvolvido por<br /><strong className="font-medium text-sidebar-foreground">Cauã Rodolpho</strong></span>
        </a>
      </aside>
    </>
  );
}

type HeaderProps = {
  title: string;
  menu: () => void;
  profile: WorkspaceProfile;
  openProfile: () => void;
  openSettings: () => void;
  query: string;
  onQueryChange: (value: string) => void;
  canSearch: boolean;
};

export function AppHeader({ title, menu, profile, openProfile, openSettings, query, onQueryChange, canSearch }: HeaderProps) {
  const currentDate = new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long" }).format(new Date());

  return (
    <header className="sticky top-0 z-30 flex min-h-[76px] flex-wrap items-center gap-3 border-b border-border bg-background/95 px-4 py-3 backdrop-blur-md sm:px-7 md:h-[76px] md:flex-nowrap md:gap-4 md:py-0 lg:px-9">
      <Button variant="ghost" size="icon" className="size-11 shrink-0 lg:hidden" onClick={menu} aria-label="Abrir menu"><Menu /></Button>
      <div className="min-w-0"><p className="truncate text-lg font-semibold tracking-[-0.02em] text-foreground">{title}</p><p className="hidden text-xs capitalize text-muted-foreground sm:block">{currentDate}</p></div>
      {canSearch && <div className="relative order-3 w-full basis-full md:order-none md:ml-auto md:w-auto md:basis-auto"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input value={query} onChange={(event) => onQueryChange(event.target.value)} className="h-11 w-full rounded-lg border border-border bg-card pl-10 pr-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary/50 md:h-10 md:w-60" placeholder="Buscar dashboard" aria-label="Buscar dashboard" /></div>}
      <div className={cn("flex items-center gap-2 sm:gap-3", canSearch ? "ml-auto md:ml-0" : "ml-auto")}>
        <Button variant="ghost" size="icon" onClick={openSettings} className="size-11 rounded-xl border border-border text-muted-foreground hover:bg-accent hover:text-foreground" aria-label="Configurações"><Settings /></Button>
        <button onClick={openProfile} className="flex min-h-11 items-center gap-2 rounded-lg border border-border bg-card p-1.5 pr-2 transition hover:border-primary/25" aria-label="Abrir perfil"><span className="grid size-8 place-items-center rounded-md border border-primary/20 bg-primary/10 text-xs font-semibold text-primary">{profile.initials}</span><span className="hidden max-w-28 truncate text-left text-xs font-medium text-foreground xl:block">{profile.name}</span></button>
      </div>
    </header>
  );
}

export function MobileNavigation({ page, go }: { page: AppPage; go: (page: AppPage) => void }) {
  return (
    <nav className="fixed inset-x-3 bottom-[max(.75rem,env(safe-area-inset-bottom))] z-40 grid grid-cols-2 rounded-2xl border border-border bg-card/95 p-1.5 shadow-2xl backdrop-blur-xl lg:hidden" aria-label="Navegação móvel">
      {appNavigation.map((item) => {
        const active = page === item.id || (page === "dashboard" && item.id === "home");
        return <button key={item.id} onClick={() => go(item.id)} aria-current={active ? "page" : undefined} className={cn("flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl py-2 text-xs font-medium", active ? "bg-primary/15 text-primary" : "text-muted-foreground")}><item.icon className="size-5" />{item.label.replace("Meus ", "")}</button>;
      })}
    </nav>
  );
}
