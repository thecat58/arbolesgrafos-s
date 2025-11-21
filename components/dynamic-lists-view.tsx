"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, ChevronRight } from "lucide-react"
import { apiClient, type ApiNode } from "@/lib/api-client"

interface DynamicListsViewProps {
  currentRootId: string
  onNodeSelect: (nodeId: string) => void
}

export function DynamicListsView({ currentRootId, onNodeSelect }: DynamicListsViewProps) {
  const [catalog, setCatalog] = useState<{
    devices: ApiNode[]
    accessories: ApiNode[]
    features: ApiNode[]
  }>({ devices: [], accessories: [], features: [] })
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState<"all" | "devices" | "accessories" | "features">("all")

  useEffect(() => {
    const loadCatalog = async () => {
      try {
        const data = await apiClient.getCatalog()
        setCatalog(data)
        console.log("[v0] Catalog loaded:", data)
      } catch (error) {
        console.error("[v0] Error loading catalog:", error)
      }
    }

    loadCatalog()
  }, [currentRootId])

  const getAllItems = () => {
    const all = [...catalog.devices, ...catalog.accessories, ...catalog.features]

    return all.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.data.brand?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory =
        activeCategory === "all" ||
        (activeCategory === "devices" && item.type === "device") ||
        (activeCategory === "accessories" && item.type === "accessory") ||
        (activeCategory === "features" && item.type === "feature")
      return matchesSearch && matchesCategory
    })
  }

  const filteredItems = getAllItems()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Listas Clasificadas</CardTitle>
        <p className="text-sm text-muted-foreground">Índice filtrable por categoría y búsqueda</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o marca..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Filters */}
        <div className="flex gap-2">
          <Button
            variant={activeCategory === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory("all")}
          >
            Todos ({catalog.devices.length + catalog.accessories.length + catalog.features.length})
          </Button>
          <Button
            variant={activeCategory === "devices" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory("devices")}
          >
            Dispositivos ({catalog.devices.length})
          </Button>
          <Button
            variant={activeCategory === "accessories" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory("accessories")}
          >
            Accesorios ({catalog.accessories.length})
          </Button>
          <Button
            variant={activeCategory === "features" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory("features")}
          >
            Características ({catalog.features.length})
          </Button>
        </div>

        {/* Items List */}
        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {filteredItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNodeSelect(item.id)}
              className="w-full flex items-center gap-4 p-4 rounded-lg border border-border hover:border-primary hover:bg-accent transition-all text-left"
            >
              {item.data.imageUrl && (
                <img
                  src={item.data.imageUrl || "/placeholder.svg"}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-foreground">{item.name}</h3>
                  <Badge variant="outline" className="text-xs">
                    L{item.level}
                  </Badge>
                </div>
                {item.data.brand && <p className="text-sm text-muted-foreground">{item.data.brand}</p>}
                {item.data.description && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{item.data.description}</p>
                )}
              </div>
              <div className="text-right">
                {item.data.price && <p className="font-bold text-primary">${item.data.price}</p>}
                <Badge variant={item.data.inStock === false ? "destructive" : "default"} className="text-xs mt-1">
                  {item.data.inStock === false ? "Agotado" : "Disponible"}
                </Badge>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          ))}

          {filteredItems.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No se encontraron resultados</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
