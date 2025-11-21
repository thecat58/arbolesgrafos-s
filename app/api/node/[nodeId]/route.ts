import { NextResponse } from "next/server"
import { buildHierarchy, findNodeInHierarchy } from "@/lib/mock-data"

// Endpoint para obtener detalles de un nodo específico
export async function GET(request: Request, { params }: { params: { nodeId: string } }) {
  const nodeId = params.nodeId
  const hierarchy = buildHierarchy()

  const node = findNodeInHierarchy(hierarchy, nodeId)

  if (!node) {
    return NextResponse.json({ error: "Node not found" }, { status: 404 })
  }

  return NextResponse.json(node)
}
