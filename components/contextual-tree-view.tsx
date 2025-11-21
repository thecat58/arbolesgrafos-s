"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { NavigationPath, ContextualNode } from "@/lib/types"
import { ChevronRight, Loader2, Package, Smartphone, Wrench, Star } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ContextualTreeViewProps {
  path: NavigationPath
  onNodeSelect: (node: ContextualNode) => void
}

export function ContextualTreeView({ path, onNodeSelect }: ContextualTreeViewProps) {
  const [nextLevelNodes, setNextLevelNodes] = useState<ContextualNode[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadNextLevel()
  }, [path])

  const loadNextLevel = async () => {
    setIsLoading(true)
    try {
      if (path.nodes.length === 0) {
        const response = await fetch("/api/devices")
        const data = await response.json()
        setNextLevelNodes(data.devices || [])
      } else {
        const lastNode = path.nodes[path.nodes.length - 1]
        const response = await fetch(`/api/children?parentId=${lastNode.id}&rootDeviceId=${path.rootDeviceId}`)
        const data = await response.json()
        setNextLevelNodes(data.children || [])
      }
    } catch (error) {
      console.error("[v0] Error loading next level:", error)
      setNextLevelNodes([])
    } finally {
      setIsLoading(false)
    }
  }

  const getNodeIcon = (type: string) => {
    switch (type) {
      case "device":
        return <Smartphone className="w-4 h-4" />
      case "accessory":
        return <Package className="w-4 h-4" />
      case "sub_accessory":
        return <Wrench className="w-4 h-4" />
      case "feature":
        return <Star className="w-4 h-4" />
      default:
        return <Package className="w-4 h-4" />
    }
  }

  return (
    <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          Árbol del Camino
          <Badge variant="secondary" className="text-xs">
            Nivel {path.nodes.length}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-[600px]">
          {/* Path Tree */}
          <div className="space-y-1 mb-6">
            {path.nodes.map((node, index) => (
              <div key={node.id} className="flex items-start gap-2" style={{ marginLeft: `${index * 24}px` }}>
                <div
                  className={`flex-shrink-0 w-6 h-6 rounded flex items-center justify-center text-white ${
                    index === path.nodes.length - 1
                      ? "bg-gradient-to-br from-blue-600 to-violet-600"
                      : "bg-slate-400 dark:bg-slate-600"
                  }`}
                >
                  {getNodeIcon(node.type)}
                </div>
                <div className="flex-1 py-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-medium ${
                        index === path.nodes.length - 1
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {node.name}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      L{index}
                    </Badge>
                  </div>
                  {node.brand && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Marca: {node.brand}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Next Level Preview */}
          {path.nodes.length > 0 && (
            <>
              <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mb-3">
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                  <ChevronRight className="w-4 h-4" />
                  Siguiente nivel disponible ({nextLevelNodes.length})
                </h4>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                </div>
              ) : nextLevelNodes.length === 0 ? (
                <div className="text-center py-6 text-slate-500 dark:text-slate-400 text-sm">
                  <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No hay elementos adicionales en este camino</p>
                </div>
              ) : (
                <div className="space-y-1" style={{ marginLeft: `${path.nodes.length * 24}px` }}>
                  {nextLevelNodes.map((node) => (
                    <Button
                      key={node.id}
                      variant="ghost"
                      className="w-full justify-start h-auto py-2 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                      onClick={() => onNodeSelect(node)}
                    >
                      <div className="flex items-center gap-2 w-full">
                        <div className="flex-shrink-0 w-6 h-6 rounded bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                          {getNodeIcon(node.type)}
                        </div>
                        <span className="text-sm font-medium flex-1 text-left">{node.name}</span>
                        {node.price && (
                          <Badge variant="secondary" className="text-xs">
                            ${node.price.toFixed(2)}
                          </Badge>
                        )}
                      </div>
                    </Button>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Initial State */}
          {path.nodes.length === 0 && (
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                Dispositivos disponibles ({nextLevelNodes.length})
              </h4>
              {isLoading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                </div>
              ) : (
                nextLevelNodes.map((node) => (
                  <Button
                    key={node.id}
                    variant="ghost"
                    className="w-full justify-start h-auto py-2 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                    onClick={() => onNodeSelect(node)}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <div className="flex-shrink-0 w-6 h-6 rounded bg-gradient-to-br from-blue-600 to-violet-600 text-white flex items-center justify-center">
                        {getNodeIcon(node.type)}
                      </div>
                      <span className="text-sm font-medium flex-1 text-left">{node.name}</span>
                      {node.price && (
                        <Badge variant="secondary" className="text-xs">
                          ${node.price.toFixed(2)}
                        </Badge>
                      )}
                    </div>
                  </Button>
                ))
              )}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
