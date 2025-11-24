import { NextResponse } from "next/server";
import { buildHierarchy } from "@/lib/mock-data";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const selectedIds: string[] = Array.isArray(body.selectedIds) ? body.selectedIds : [];

  const hierarchy = buildHierarchy();

  // construir mapa id -> vecinos (padre <-> hijo)
  const neighbors: Record<string, string[]> = {};
  function traverse(node: any, parent?: any) {
    if (!node) return;
    neighbors[node.id] = neighbors[node.id] || [];
    if (parent) {
      neighbors[node.id].push(parent.id);
      neighbors[parent.id] = neighbors[parent.id] || [];
      neighbors[parent.id].push(node.id);
    }
    (node.children || []).forEach((c: any) => traverse(c, node));
  }
  // incluir raíz con children
  traverse({ id: "root", children: hierarchy });

  // score: vecinos más frecuentes de los seleccionados, excluir ya seleccionados
  const score = new Map<string, number>();
  selectedIds.forEach((id) => {
    (neighbors[id] || []).forEach((nb) => {
      if (!selectedIds.includes(nb)) score.set(nb, (score.get(nb) || 0) + 1);
    });
  });

  const recommendations = Array.from(score.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([id, s]) => ({ id, score: s }));

  return NextResponse.json({ recommendations });
}

export async function GET() {
  // mantener compatibilidad: devolver vacío o top-level recomendaciones
  return NextResponse.json({ recommendations: [] });
}
