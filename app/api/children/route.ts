import { NextResponse } from "next/server"
import { getContextualChildren, getNodeById } from "@/lib/contextual-data"
import type { NavigationPath } from "@/lib/types"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const parentId = searchParams.get("parentId")
    const rootDeviceId = searchParams.get("rootDeviceId")

    if (!parentId) {
      return NextResponse.json({ error: "parentId is required" }, { status: 400 })
    }

    const parentNode = getNodeById(parentId)
    if (!parentNode) {
      return NextResponse.json({ error: "Parent node not found" }, { status: 404 })
    }

    // Build path from parentId and rootDeviceId
    const path: NavigationPath = {
      nodes: [parentNode],
      rootDeviceId: rootDeviceId || parentId,
      currentLevel: parentNode.level,
    }

    const result = getContextualChildren(path)
    return NextResponse.json(result)
  } catch (error) {
    console.error("[API] Error fetching contextual children:", error)
    return NextResponse.json({ error: "Failed to fetch children" }, { status: 500 })
  }
}

// Keep POST method for compatibility
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const path: NavigationPath = body.path

    const result = getContextualChildren(path)
    return NextResponse.json(result)
  } catch (error) {
    console.error("[API] Error fetching contextual children:", error)
    return NextResponse.json({ error: "Failed to fetch children" }, { status: 500 })
  }
}
