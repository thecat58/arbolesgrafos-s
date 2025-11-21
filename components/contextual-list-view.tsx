"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { NavigationPath, ContextualNode } from "@/lib/types"
import { Search, Loader2, Package, Smartphone, Wrench, Star } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ContextualListViewProps {
  path: NavigationPath
  onNodeSelect: (node: ContextualNode) => void
}

export function ContextualListView({ path, onNodeSelect }: ContextualListViewProps) {
  const [items, setItems] = useState<ContextualNode[]>([])
  const [filteredItems, setFilteredItems] = useState<ContextualNode[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadContextualItems()
  }, [path])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredItems(items)
    } else {
      const query = searchQuery.toLowerCase()
      setFilteredItems(
        items.filter(
          (item) =>
            item.name.toLowerCase().includes(query) ||
            item.brand?.toLowerCase().includes(query) ||
            item.category?.toLowerCase().includes(query),
        ),
      )
    }
  }, [searchQuery, items])

  const loadContextualItems = async () => {
    setIsLoading(true)
    try {
      // Si no hay nodos, cargar dispositivos raíz
      if (path.nodes.length === 0) {
        const response = await fetch("/api/devices")
        const data = await response.json()
        setItems(data.devices || [])
        setFilteredItems(data.devices || [])
      } else {
        // Cargar hijos compatibles del último nodo
        const lastNode = path.nodes[path.nodes.length - 1]
        const response = await fetch(`/api/children?parentId=${lastNode.id}&rootDeviceId=${path.rootDeviceId}`)
        const data = await response.json()
        setItems(data.children || [])
        setFilteredItems(data.children || [])
      }
    } catch (error) {
      console.error("[v0] Error loading contextual items:", error)
      setItems([])
      setFilteredItems([])
    } finally {
      setIsLoading(false)
    }
  }

  const getNodeIcon = (type: string) => {
    switch (type) {
      case "device":
        return <Smartphone className="w-5 h-5" />
      case "accessory":
        return <Package className="w-5 h-5" />
      case "sub_accessory":
        return <Wrench className="w-5 h-5" />
      case "feature":
        return <Star className="w-5 h-5" />
      default:
        return <Package className="w-5 h-5" />
    }
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      device: "Dispositivo",
      accessory: "Accesorio",
      sub_accessory: "Sub-accesorio",
      feature: "Característica",
    }
    return labels[type] || type
  }

  if (isLoading) {
    return (
      <Card className="border-slate-200 dark:border-slate-800">
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="text-sm text-slate-600 dark:text-slate-400">Cargando opciones contextuales...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between mb-3">
          <CardTitle className="text-lg">
            {path.nodes.length === 0 ? "Dispositivos Disponibles" : "Opciones Compatibles"}
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {filteredItems.length} {filteredItems.length === 1 ? "elemento" : "elementos"}
          </Badge>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Buscar por nombre, marca o categoría..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
          />
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="font-medium mb-1">
              {path.nodes.length === 0 ? "No hay dispositivos disponibles" : "No hay elementos compatibles"}
            </p>
            <p className="text-sm">
              {searchQuery
                ? "Intenta con otro término de búsqueda"
                : "Este elemento no tiene accesorios o sub-accesorios adicionales"}
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-2">
              {filteredItems.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  className="w-full h-auto p-4 justify-start hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
                  onClick={() => onNodeSelect(item)}
                >
                  <div className="flex items-start gap-3 w-full">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 text-white flex items-center justify-center">
                      {getNodeIcon(item.type)}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-slate-900 dark:text-slate-100">{item.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {getTypeLabel(item.type)}
                        </Badge>
                      </div>
                      {item.brand && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Marca: {item.brand}</p>
                      )}
                      {item.category && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Categoría: {item.category}</p>
                      )}
                      {item.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                          {item.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        {item.price && (
                          <Badge variant="secondary" className="text-xs">
                            ${item.price.toFixed(2)}
                          </Badge>
                        )}
                        {item.inStock !== undefined && (
                          <Badge variant={item.inStock ? "default" : "destructive"} className="text-xs">
                            {item.inStock ? "En stock" : "Sin stock"}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
