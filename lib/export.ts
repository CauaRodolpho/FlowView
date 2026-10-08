import { safeFileName } from "@/lib/formatters";

export function downloadFile(name: string, content: BlobPart, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
}

export function rowsToCsv(rows: Array<Array<string | number>>) {
  return `\uFEFF${rows
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(";"))
    .join("\n")}`;
}

export function exportCsv(name: string, rows: Array<Array<string | number>>) {
  downloadFile(`${safeFileName(name)}.csv`, rowsToCsv(rows), "text/csv;charset=utf-8");
}

export function exportJson(name: string, data: unknown) {
  downloadFile(`${safeFileName(name)}.json`, JSON.stringify(data, null, 2), "application/json");
}

export function exportCanvas(name: string, canvas: HTMLCanvasElement) {
  canvas.toBlob((blob) => {
    if (blob) downloadFile(`${safeFileName(name)}.png`, blob, "image/png");
  });
}

export function printDashboard() {
  window.setTimeout(() => window.print(), 100);
}
