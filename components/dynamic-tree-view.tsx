"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronDown, Package, Smartphone } from "lucide-react"
import { apiClient, type ApiNode } from "@/lib/api-client"

interface DynamicTreeViewProps {
  currentRootId: string
  onNodeSelect: (nodeId: string) => void
}

export function DynamicTreeView({ currentRootId, onNodeSelect }: DynamicTreeViewProps) {
  const [treeData, setTreeData] = useState<ApiNode | null>(null)
  const [expanded, setExpanded] = useState<Set<string>>(new Set([currentRootId]))

  useEffect(() => {
    const loadTree = async () => {
      try {
        const data = await apiClient.getTree(currentRootId)
        setTreeData(data)
        setExpanded(new Set([currentRootId]))
        console.log("[v0] Tree loaded:", data)
      } catch (error) {
        console.error("[v0] Error loading tree:", error)
      }
    }

    loadTree()
  }, [currentRootId])

  const toggleExpand = (nodeId: string) => {
    const newExpanded = new Set(expanded)
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId)
    } else {
      newExpanded.add(nodeId)
    }
    setExpanded(newExpanded)
  }

  const renderNode = (node: ApiNode, depth = 0) => {
    const hasChildren = node.children && node.children.length > 0
    const isExpanded = expanded.has(node.id)
    const indent = depth * 24

    return (
      <div key={node.id} className="select-none">
        <div
          className="flex items-center gap-2 p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors"
          style={{ marginLeft: `${indent}px` }}
        >
          {/* Expand/Collapse button */}
          {hasChildren ? (
            <button onClick={() => toggleExpand(node.id)} className="p-0.5 hover:bg-muted rounded">
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
          ) : (
            <div className="w-5" />
          )}

          {/* Icon */}
          {node.type === "device" ? (
            <Smartphone className="w-4 h-4 text-blue-500" />
          ) : (
            <Package className="w-4 h-4 text-orange-500" />
          )}

          {/* Node info */}
          <button onClick={() => onNodeSelect(node.id)} className="flex-1 flex items-center gap-2 text-left">
            <span className="font-medium text-foreground">{node.name}</span>
            <Badge variant="outline" className="text-xs">
              L{node.level}
            </Badge>
            {node.data.price && <span className="text-sm text-primary font-semibold">${node.data.price}</span>}
            {node.data.inStock === false && (
              <Badge variant="destructive" className="text-xs">
                Agotado
              </Badge>
            )}
          </button>

          {/* Children count */}
          {hasChildren && (
            <Badge variant="secondary" className="text-xs">
              {node.children!.length}
            </Badge>
          )}
        </div>

        {/* Render children recursively */}
        {hasChildren && isExpanded && (
          <div className="space-y-0.5">{node.children!.map((child) => renderNode(child, depth + 1))}</div>
        )}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Árbol Jerárquico Recursivo</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Profundidad ilimitada con relaciones padre-hijo</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (treeData) {
                  const allIds = new Set<string>()
                  const collectIds = (node: ApiNode) => {
                    allIds.add(node.id)
                    node.children?.forEach(collectIds)
                  }
                  collectIds(treeData)
                  setExpanded(allIds)
                }
              }}
            >
              Expandir todo
            </Button>
            <Button variant="outline" size="sm" onClick={() => setExpanded(new Set([currentRootId]))}>
              Contraer todo
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-0.5 max-h-[600px] overflow-y-auto">
          {treeData ? (
            renderNode(treeData)
          ) : (
            <p className="text-center text-muted-foreground py-8">Cargando árbol...</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
