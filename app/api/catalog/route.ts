import { NextResponse } from "next/server"
import { buildHierarchy } from "@/lib/mock-data"

// API endpoint que simula la generación del catálogo del backend Python
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")
  const brand = searchParams.get("brand")

  // Construir jerarquía completa
  const hierarchy = buildHierarchy()

  // Separar por tipo
  const devices: any[] = []
  const accessories: any[] = []
  const features: any[] = []

  function collectNodes(nodes: any[]) {
    for (const node of nodes) {
      if (node.type === "device") {
        devices.push(node)
      } else if (node.type === "accessory") {
        accessories.push(node)
      } else if (node.type === "feature") {
        features.push(node)
      }

      if (node.children && node.children.length > 0) {
        collectNodes(node.children)
      }
    }
  }

  collectNodes(hierarchy)

  // Aplicar filtros si existen
  let filteredDevices = devices
  let filteredAccessories = accessories
  const filteredFeatures = features

  if (category) {
    filteredDevices = filteredDevices.filter((d) => d.data.category === category)
  }

  if (brand) {
    filteredDevices = filteredDevices.filter((d) => d.data.brand === brand)
    filteredAccessories = filteredAccessories.filter((a) => a.data.brand === brand)
  }

  const catalog = {
    devices: filteredDevices,
    accessories: filteredAccessories,
    features: filteredFeatures,
    metadata: {
      total_devices: filteredDevices.length,
      total_accessories: filteredAccessories.length,
      total_features: filteredFeatures.length,
      generated_at: new Date().toISOString(),
    },
  }

  return NextResponse.json(catalog)
}
