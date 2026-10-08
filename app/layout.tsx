import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  metadataBase: new URL("https://dashhub-caua.rodolfinhom5.chatgpt.site"),
  title: "FlowView — seus dados, sua visão",
  description: "Crie, importe dados e personalize dashboards com a sua própria identidade.",
  applicationName: "FlowView",
  authors: [{ name: "Cauã Rodolpho", url: "https://github.com/CauaRodolpho" }],
  creator: "Cauã Rodolpho",
  keywords: ["dashboard", "React", "TypeScript", "visualização de dados", "portfólio front-end"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    title: "FlowView — dashboards personalizáveis",
    description: "Transforme dados financeiros, comerciais e de marketing em dashboards interativos.",
  },
  twitter: {
    card: "summary",
    title: "FlowView — dashboards personalizáveis",
    description: "Transforme dados em indicadores, gráficos e insights personalizáveis.",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var raw=localStorage.getItem('flowview:workspace');var saved=raw?JSON.parse(raw).preferences?.theme:null;var theme=saved==='light'||saved==='dark'?saved:(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');document.documentElement.dataset.theme=theme;document.documentElement.style.colorScheme=theme;}catch(e){document.documentElement.dataset.theme='dark';}})();` }} />
      </head>
      <body className="antialiased">
        <a className="skip-link" href="#conteudo-principal">Pular para o conteúdo</a>
        <div id="conteudo-principal" tabIndex={-1}>{children}</div>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
