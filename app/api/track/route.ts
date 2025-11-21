import { NextResponse } from "next/server"

// Endpoint para rastrear la navegación del usuario
let navigationHistory: any[] = []

export async function POST(request: Request) {
  try {
    const data = await request.json()

    navigationHistory.push({
      ...data,
      timestamp: new Date().toISOString(),
    })

    // Mantener solo los últimos 100 eventos
    if (navigationHistory.length > 100) {
      navigationHistory = navigationHistory.slice(-100)
    }

    return NextResponse.json({
      success: true,
      historyLength: navigationHistory.length,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to track" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    history: navigationHistory,
    count: navigationHistory.length,
  })
}
