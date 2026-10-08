"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardErrorBoundaryProps {
  children: ReactNode;
}

interface DashboardErrorBoundaryState {
  failed: boolean;
}

export class DashboardErrorBoundary extends Component<DashboardErrorBoundaryProps, DashboardErrorBoundaryState> {
  state: DashboardErrorBoundaryState = { failed: false };

  static getDerivedStateFromError(): DashboardErrorBoundaryState {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("FlowView render failure", error, info.componentStack);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <main className="grid min-h-screen place-items-center bg-[#070a17] px-5 text-white">
        <section className="w-full max-w-md rounded-[24px] border border-rose-400/20 bg-[#0d1122] p-7 text-center shadow-2xl">
          <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-rose-400/10 text-rose-300">
            <AlertTriangle className="size-6" />
          </span>
          <h1 className="mt-5 text-xl font-semibold">Não foi possível abrir esta visualização</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            Seus dados continuam salvos neste navegador. Recarregue o FlowView para tentar novamente.
          </p>
          <Button onClick={() => window.location.reload()} className="mt-6 min-h-11 w-full bg-gradient-to-r from-violet-500 to-blue-500 text-white">
            <RotateCcw />Recarregar FlowView
          </Button>
        </section>
      </main>
    );
  }
}
