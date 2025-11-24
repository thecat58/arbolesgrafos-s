import { NextResponse } from "next/server"
import { buildHierarchy, findNodeInHierarchy } from "@/lib/mock-data"

// Endpoint para calcular el layout del grafo n-gonal
export async function GET(request: Request, { params }: { params: { nodeId: string } }) {
  const nodeId = params.nodeId
  const { searchParams } = new URL(request.url)
  const radius = Number.parseInt(searchParams.get("radius") || "300")

  const hierarchy = buildHierarchy()

  const rootNode =
    nodeId === "root"
      ? { id: "root", name: "Root", children: hierarchy, type: "device", level: 0, data: {} }
      : findNodeInHierarchy(hierarchy, nodeId)

  if (!rootNode) {
    return NextResponse.json({ error: "Node not found" }, { status: 404 })
  }

  // Calcular layout n-gonal (simulando el script Python compute_graph_connections.py)
  const nodes: any[] = []
  const edges: any[] = []

  function processNode(node: any, parentId?: string, depth = 0) {
    const angle = nodes.length * ((2 * Math.PI) / 20) // Distribuir en círculo
    const nodeRadius = radius * (1 + depth * 0.3)

    nodes.push({
      id: node.id,
      name: node.name,
      type: node.type,
      level: node.level,
      data: node.data,
      x: 400 + Math.cos(angle) * nodeRadius,
      y: 400 + Math.sin(angle) * nodeRadius,
    })

    if (parentId) {
      edges.push({
        source: parentId,
        target: node.id,
      })
    }

    if (node.children) {
      node.children.forEach((child: any) => processNode(child, node.id, depth + 1))
    }
  }

  processNode(rootNode)

  return NextResponse.json({
    nodes,
    edges,
    center: { x: 400, y: 400 },
    levels: Math.max(...nodes.map((n) => n.level)) + 1,
  })
}
