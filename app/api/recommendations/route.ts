import { NextResponse } from "next/server"
import { getPathRecommendations } from "@/lib/contextual-data"
import type { NavigationPath } from "@/lib/types"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const path: NavigationPath = body.path

    const recommendedNodes = getPathRecommendations(path)

    // Transform nodes into recommendations with reason and confidence
    const recommendations = recommendedNodes.map((node, index) => {
      let reason = "Recomendado por compatibilidad"
      let confidence = 0.8

      if (path.nodes.length > 0) {
        const lastNode = path.nodes[path.nodes.length - 1]
        const rootDevice = path.nodes[0]

        if (node.compatibleWith.includes(lastNode.id)) {
          reason = `Compatible con ${lastNode.name}`
          confidence = 0.95
        } else if (node.compatibleWith.includes(rootDevice.id)) {
          reason = `Accesorio popular para ${rootDevice.name}`
          confidence = 0.85
        }

        if (node.inStock === false && node.data.alternativeIds) {
          reason = `Alternativa disponible (${node.name} agotado)`
          confidence = 0.75
        }
      }

      // Adjust confidence based on position
      confidence -= index * 0.05

      return {
        node,
        reason,
        confidence: Math.max(0.5, Math.min(1.0, confidence)),
      }
    })

    return NextResponse.json({ recommendations })
  } catch (error) {
    console.error("[API] Error fetching recommendations:", error)
    return NextResponse.json({ error: "Failed to fetch recommendations" }, { status: 500 })
  }
}
