"use client";

import React from "react";
import { useSelection } from "./selection-context";
import type { NavigationPath, ContextualNode } from "@/lib/types";

type Props = {
  path?: NavigationPath;
  onNodeSelect?: (node: ContextualNode) => void;
};

export default function ContextualRecommendations({ path, onNodeSelect }: Props) {
  const { selectedIds, add } = useSelection();
  const [recs, setRecs] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!selectedIds.length) {
      setRecs([]);
      return;
    }
    let abort = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/recommendations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ selectedIds }),
        });
        const json = await res.json();
        if (!abort) setRecs(json.recommendations || json);
      } catch (e) {
        if (!abort) setRecs([]);
      } finally {
        if (!abort) setLoading(false);
      }
    })();
    return () => {
      abort = true;
    };
  }, [selectedIds]);

  const handleAdd = (r: any) => {
    add(r.id);
    if (onNodeSelect) {
      const node: ContextualNode = {
        id: r.id,
        name: r.name || "",
        type: r.type || "product",
        level: r.level ?? 0,
        data: r.data ?? {},
      } as ContextualNode;
      onNodeSelect(node);
    }
  };

  return (
    <div>
      {path && (
        <div style={{ fontSize: 12, color: "var(--muted)" }}>
          {path.nodes?.map((n) => n.name).filter(Boolean).join(" › ")}
        </div>
      )}
      <h4>Recomendaciones</h4>
      {loading && <div>Cargando...</div>}
      {!loading && recs.length === 0 && <div>No hay recomendaciones</div>}
      <div>
        {recs.map((r: any) => (
          <div key={r.id} style={{ marginBottom: 8, display: "flex", alignItems: "center" }}>
            <button onClick={() => handleAdd(r)} style={{ marginRight: 8 }}>
              Añadir
            </button>
            <span>{r.name || r.id} {r.score ? `(${r.score})` : ""}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
