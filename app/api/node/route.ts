import { NextResponse } from "next/server"
import { getNodeById, getAlternatives, generateSmartQuestions } from "@/lib/contextual-data"
import type { NavigationPath } from "@/lib/types"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const nodeId: string = body.nodeId
    const path: NavigationPath = body.path

    const node = getNodeById(nodeId)
    if (!node) {
      return NextResponse.json({ error: "Node not found" }, { status: 404 })
    }

    const alternatives = getAlternatives(nodeId)
    const smartQuestions = generateSmartQuestions(node, path)

    return NextResponse.json({
      node,
      alternatives,
      smartQuestions,
    })
  } catch (error) {
    console.error("[API] Error fetching node:", error)
    return NextResponse.json({ error: "Failed to fetch node" }, { status: 500 })
  }
}
