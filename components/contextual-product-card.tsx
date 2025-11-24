"use client";
import React from "react";
import type { ContextualNode } from "@/lib/types";

export default function ContextualProductCard({ node, path, onClose, onNavigate }: { node: ContextualNode; path?: any; onClose?: ()=>void; onNavigate?: (n: ContextualNode)=>void }) {
  const imgSrc = node?.imageUrl || `/images/${node.id}.jpg` || "/images/placeholder.png";

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    if (target.src.endsWith("/placeholder.png")) return;
    target.src = "/images/placeholder.png";
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border">
      <div className="flex gap-4">
        <div className="w-32 h-32 flex-shrink-0 bg-gray-100 dark:bg-slate-800 rounded overflow-hidden">
          <img
            src={imgSrc}
            alt={node.name || "producto"}
            onError={handleImgError}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">{node.name}</h3>
          <p className="text-sm text-muted-foreground">{node?.description}</p>
          <div className="mt-3 flex gap-2">
            <button onClick={() => onNavigate?.(node)} className="btn">Ver</button>
            <button onClick={() => {/* añadir al carrito via selection-context si quieres */}} className="btn-outline">Añadir</button>
          </div>
        </div>
      </div>
    </div>
  );
}
