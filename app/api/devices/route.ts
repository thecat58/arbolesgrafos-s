import { NextResponse } from "next/server"
import { getDevices } from "@/lib/contextual-data"

export async function GET() {
  try {
    const devices = getDevices()
    return NextResponse.json({ devices })
  } catch (error) {
    console.error("[API] Error fetching devices:", error)
    return NextResponse.json({ error: "Failed to fetch devices" }, { status: 500 })
  }
}
