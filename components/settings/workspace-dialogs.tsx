"use client";

import type { Dispatch, SetStateAction } from "react";
import { BarChart3, LayoutDashboard, LayoutTemplate, Palette, Settings, Sparkles, Sun, Moon, Trash2, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { WorkspaceProfile } from "@/lib/dashboard-workspace";
import { cn } from "@/lib/utils";
import type { DashboardSummary } from "@/types/dashboard";

type SettingsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  showWelcome: () => void;
  dashboardCount: number;
};

export function SettingsDialog({ open, onOpenChange, theme, setTheme, showWelcome, dashboardCount }: SettingsDialogProps) {
  const themes = [
    { id: "light" as const, label: "Claro", description: "Superfícies claras e contraste suave", icon: Sun },
    { id: "dark" as const, label: "Escuro", description: "Interface elétrica com baixa luminosidade", icon: Moon },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flowview-settings max-h-[calc(100dvh-1rem)] w-[calc(100%-1rem)] overflow-y-auto border-border bg-card text-card-foreground sm:max-w-lg">
        <DialogHeader><DialogTitle>Configurações</DialogTitle><DialogDescription>Ajuste a aparência e as preferências deste navegador.</DialogDescription></DialogHeader>
        <div className="space-y-5">
          <section>
            <h2 className="text-sm font-semibold">Aparência</h2>
            <p className="mt-1 text-sm text-muted-foreground">Escolha o tema que deixa seus dados mais confortáveis de visualizar.</p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {themes.map((option) => (
                <button key={option.id} type="button" onClick={() => setTheme(option.id)} aria-pressed={theme === option.id} className={cn("min-h-24 rounded-xl border p-4 text-left transition", theme === option.id ? "border-primary/50 bg-primary/10 text-foreground" : "border-border bg-muted/30 hover:border-primary/30")}>
                  <option.icon className={cn("size-5", theme === option.id ? "text-primary" : "text-muted-foreground")} />
                  <span className="mt-4 block text-sm font-semibold">{option.label}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">{option.description}</span>
                </button>
              ))}
            </div>
          </section>
          <section className="rounded-xl border border-border bg-muted/30 p-4"><h2 className="text-sm font-semibold">Dados locais</h2><p className="mt-1 text-sm leading-relaxed text-muted-foreground">{dashboardCount} dashboard{dashboardCount === 1 ? "" : "s"} e suas personalizações estão salvos somente neste navegador.</p></section>
          <section className="flex flex-col gap-3 rounded-xl border border-border bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-sm font-semibold">Apresentação do FlowView</h2><p className="mt-1 text-sm text-muted-foreground">Reveja os principais caminhos do produto.</p></div><Button onClick={() => { onOpenChange(false); showWelcome(); }} variant="outline" className="min-h-11 shrink-0"><LayoutDashboard />Ver apresentação</Button></section>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function WelcomeDialog({ open, onClose, onCreate, onExplore }: { open: boolean; onClose: () => void; onCreate: () => void; onExplore: () => void }) {
  return (
    <Dialog open={open} onOpenChange={(nextOpen) => { if (!nextOpen) onClose(); }}>
      <DialogContent className="border-border bg-card text-card-foreground sm:max-w-xl">
        <DialogHeader><div className="mb-2 grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400 text-white shadow-[0_0_35px_rgba(34,211,238,.2)]"><BarChart3 className="size-6" /></div><DialogTitle className="text-2xl">Conheça o FlowView</DialogTitle><DialogDescription className="text-sm leading-relaxed">Explore a demonstração AnaCraft ou crie uma visualização com seus próprios dados. Tudo fica salvo neste navegador.</DialogDescription></DialogHeader>
        <div className="grid gap-3 sm:grid-cols-3">
          <WelcomeFeature icon={LayoutDashboard} title="Veja um caso completo" description="Dados simulados de vendas, produção, estoque e metas." tone="pink" />
          <WelcomeFeature icon={LayoutTemplate} title="Comece rápido" description="Use dados de exemplo ou importe um CSV." tone="violet" />
          <WelcomeFeature icon={Palette} title="Personalize tudo" description="Altere conteúdo, widgets, ordem, estilo e cores." tone="cyan" />
        </div>
        <DialogFooter className="gap-2 sm:gap-2"><Button variant="outline" onClick={onCreate} className="min-h-11">Criar meu dashboard</Button><Button onClick={onExplore} className="min-h-11 bg-gradient-to-r from-violet-500 to-blue-500 text-white"><Sparkles />Explorar AnaCraft</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function WelcomeFeature({ icon: Icon, title, description, tone }: { icon: typeof LayoutDashboard; title: string; description: string; tone: "pink" | "violet" | "cyan" }) {
  const styles = { pink: "border-pink-400/20 bg-pink-400/5 text-pink-400", violet: "border-violet-400/20 bg-violet-400/5 text-violet-400", cyan: "border-cyan-400/20 bg-cyan-400/5 text-cyan-400" };
  return <div className={cn("rounded-2xl border p-4", styles[tone])}><Icon className="size-5" /><p className="mt-3 text-sm font-semibold text-foreground">{title}</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p></div>;
}

export function DeleteDashboardDialog({ dashboard, onClose, onConfirm }: { dashboard: DashboardSummary | null; onClose: () => void; onConfirm: () => void }) {
  return <Dialog open={Boolean(dashboard)} onOpenChange={(open) => { if (!open) onClose(); }}><DialogContent className="border-border bg-card text-card-foreground sm:max-w-md"><DialogHeader><DialogTitle>Excluir dashboard?</DialogTitle><DialogDescription>{dashboard ? `“${dashboard.name}” será removido deste navegador. Você poderá desfazer logo depois.` : "Você poderá desfazer logo depois."}</DialogDescription></DialogHeader><DialogFooter><Button variant="ghost" onClick={onClose}>Cancelar</Button><Button onClick={onConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90"><Trash2 />Excluir</Button></DialogFooter></DialogContent></Dialog>;
}

type ProfileDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  draft: WorkspaceProfile;
  setDraft: Dispatch<SetStateAction<WorkspaceProfile>>;
  onSave: () => void;
  onSettings: () => void;
};

export function ProfileDialog({ open, onOpenChange, draft, setDraft, onSave, onSettings }: ProfileDialogProps) {
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="border-border bg-card text-card-foreground sm:max-w-md"><DialogHeader><DialogTitle>Perfil do workspace</DialogTitle><DialogDescription>Personalize como seu perfil aparece no FlowView.</DialogDescription></DialogHeader><div className="flex items-center gap-4 rounded-2xl border border-border bg-muted/30 p-4"><span className="grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 text-lg font-semibold text-white">{draft.initials || "CR"}</span><div><p className="font-semibold">{draft.name || "Seu nome"}</p><p className="mt-1 text-sm text-muted-foreground">{draft.role || "Sua função"}</p></div></div><div className="space-y-3"><label className="text-sm">Nome<Input value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} className="mt-2" /></label><label className="text-sm">Função<Input value={draft.role} onChange={(event) => setDraft((current) => ({ ...current, role: event.target.value }))} className="mt-2" /></label><label className="text-sm">Iniciais<Input value={draft.initials} maxLength={3} onChange={(event) => setDraft((current) => ({ ...current, initials: event.target.value.toUpperCase() }))} className="mt-2" /></label></div><button onClick={onSettings} className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-3 text-left text-sm transition hover:border-primary/25"><Settings className="size-4 text-primary" />Abrir configurações do workspace</button><DialogFooter><Button variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button><Button onClick={onSave} className="bg-gradient-to-r from-violet-500 to-blue-500 text-white"><UserRound />Salvar perfil</Button></DialogFooter></DialogContent></Dialog>;
}
