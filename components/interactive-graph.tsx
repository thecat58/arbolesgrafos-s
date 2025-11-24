"use client";
import React, { useCallback, useEffect, useState } from "react";
import ReactFlow, { Background, Controls, MiniMap, Node, Edge } from "reactflow";
import "reactflow/dist/style.css";
import { useSelection } from "./selection-context";

type RawNode = { id: string; name?: string; x?: number; y?: number; data?: any };
type RawEdge = { source: string; target: string };

export default function InteractiveGraph({ nodes: initialNodes = [], edges: initialEdges = [] }: { nodes?: RawNode[]; edges?: RawEdge[] }) {
  const { add } = useSelection();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  useEffect(() => {
    setNodes(
      (initialNodes || []).map((n) => ({
        id: n.id,
        position: { x: n.x ?? 0, y: n.y ?? 0 },
        data: { label: n.name ?? n.id },
      }))
    );
    setEdges(
      (initialEdges || []).map((e, i) => ({
        id: `e${i}`,
        source: e.source,
        target: e.target,
      }))
    );
  }, [initialNodes, initialEdges]);

  const onNodeClick = useCallback((_: any, node: Node) => {
    add(node.id);
  }, [add]);

  return (
    <div style={{ width: "100%", height: "600px", border: "1px solid var(--border)" }}>
      <ReactFlow nodes={nodes} edges={edges} onNodeClick={onNodeClick} fitView>
        <MiniMap />
        <Controls />
        <Background gap={16} />
      </ReactFlow>
    </div>
  );
}