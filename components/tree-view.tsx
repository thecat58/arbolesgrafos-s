"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { UserNavigation, TreeNode, Device, Accessory } from "@/lib/types"
import { mockDevices, mockAccessories, mockFeatures } from "@/lib/mock-data"
import { ChevronRight, ChevronDown } from "lucide-react"

interface TreeViewProps {
  onNavigate: (navigation: UserNavigation) => void
}

export function TreeView({ onNavigate }: TreeViewProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(["root"]))
  const [selectedNode, setSelectedNode] = useState<string | null>(null)

  // Build tree structure from mock data
  const treeData = useMemo(() => {
    // Recursive function to build accessory subtree with unlimited depth
    const buildAccessorySubtree = (accessoryId: string, depth = 0): TreeNode | null => {
      const accessory = mockAccessories.find((acc) => acc.id === accessoryId)
      if (!accessory) return null

      // Find child accessories (accessories that have this accessory as parent)
      const childAccessories = mockAccessories.filter((acc) => acc.parentAccessoryId === accessoryId)

      // Find related features
      const relatedFeatures = mockFeatures.filter((feat) => feat.relatedAccessoryIds.includes(accessoryId))

      const childNodes: TreeNode[] = [
        // Recursively build child accessory nodes (unlimited depth)
        ...(childAccessories
          .map((childAcc) => buildAccessorySubtree(childAcc.id, depth + 1))
          .filter(Boolean) as TreeNode[]),
        // Add feature nodes
        ...relatedFeatures.map((feature) => ({
          id: feature.id,
          label: feature.name,
          type: "feature" as const,
          children: [],
          data: feature,
          depth: depth + 1,
        })),
      ]

      return {
        id: accessory.id,
        label: accessory.name,
        type: depth === 0 ? "accessory" : "sub-accessory",
        children: childNodes,
        data: accessory,
        depth,
      }
    }

    const nodes: TreeNode[] = mockDevices.map((device) => {
      // Find top-level accessories (those without a parent that are compatible with this device)
      const topLevelAccessories = mockAccessories.filter(
        (acc) => acc.compatibleDevices.includes(device.id) && !acc.parentAccessoryId,
      )

      const accessoryNodes: TreeNode[] = topLevelAccessories
        .map((accessory) => buildAccessorySubtree(accessory.id, 0))
        .filter(Boolean) as TreeNode[]

      return {
        id: device.id,
        label: device.name,
        type: "device" as const,
        children: accessoryNodes,
        data: device,
        depth: 0,
      }
    })

    return nodes
  }, [])

  const toggleNode = (nodeId: string) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId)
      } else {
        newSet.add(nodeId)
      }
      return newSet
    })
  }

  const handleNodeClick = (nodeId: string, type: string) => {
    setSelectedNode(nodeId)
    onNavigate({
      timestamp: Date.now(),
      view: "tree",
      nodeId,
    })
  }

  const getNodeIcon = (type: TreeNode["type"]) => {
    switch (type) {
      case "device":
        return (
          <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-primary"
            >
              <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
              <path d="M12 18h.01" />
            </svg>
          </div>
        )
      case "accessory":
        return (
          <div className="w-6 h-6 rounded-md bg-accent/10 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-accent"
            >
              <path d="M20 7h-9" />
              <path d="M14 17H5" />
              <circle cx="17" cy="17" r="3" />
              <circle cx="7" cy="7" r="3" />
            </svg>
          </div>
        )
      case "sub-accessory":
        return (
          <div className="w-6 h-6 rounded-md bg-chart-3/10 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-chart-3"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
          </div>
        )
      case "feature":
        return (
          <div className="w-6 h-6 rounded-md bg-chart-4/10 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-chart-4"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
        )
    }
  }

  const getNodeBadge = (node: TreeNode) => {
    if (node.type === "device") {
      const device = node.data as Device
      return (
        <Badge variant="secondary" className="ml-2 text-xs">
          {device.category}
        </Badge>
      )
    }
    if (node.type === "accessory" || node.type === "sub-accessory") {
      const accessory = node.data as Accessory
      return (
        <Badge variant={accessory.inStock ? "default" : "destructive"} className="ml-2 text-xs">
          {accessory.inStock ? `$${accessory.price}` : "Sin stock"}
        </Badge>
      )
    }
    return null
  }

  const renderTreeNode = (node: TreeNode, level = 0) => {
    const isExpanded = expandedNodes.has(node.id)
    const hasChildren = node.children && node.children.length > 0
    const isSelected = selectedNode === node.id

    return (
      <div key={node.id} className="select-none">
        <div
          className={`flex items-center gap-2 py-2 px-3 rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
            isSelected ? "bg-primary/10 border border-primary/20" : ""
          }`}
          style={{ paddingLeft: `${level * 24 + 12}px` }}
          onClick={() => {
            if (hasChildren) toggleNode(node.id)
            handleNodeClick(node.id, node.type)
          }}
        >
          {hasChildren ? (
            <button className="flex-shrink-0 w-5 h-5 flex items-center justify-center hover:bg-muted rounded">
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
          ) : (
            <div className="w-5 h-5" />
          )}

          {getNodeIcon(node.type)}

          <span className="text-sm font-medium text-foreground flex-1">{node.label}</span>

          {getNodeBadge(node)}

          {node.depth > 0 && (
            <Badge variant="outline" className="text-xs ml-1">
              L{node.depth}
            </Badge>
          )}

          {hasChildren && (
            <Badge variant="outline" className="text-xs">
              {node.children.length}
            </Badge>
          )}
        </div>

        {isExpanded && hasChildren && (
          <div className="mt-1">{node.children.map((child) => renderTreeNode(child, level + 1))}</div>
        )}
      </div>
    )
  }

  const expandAll = () => {
    const allIds = new Set<string>()
    const collectIds = (nodes: TreeNode[]) => {
      nodes.forEach((node) => {
        allIds.add(node.id)
        if (node.children) collectIds(node.children)
      })
    }
    collectIds(treeData)
    setExpandedNodes(allIds)
  }

  const collapseAll = () => {
    setExpandedNodes(new Set())
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Árbol Jerárquico</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Explora relaciones de profundidad ilimitada: accessory → accessory → accessory...
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={expandAll}>
              Expandir todo
            </Button>
            <Button variant="outline" size="sm" onClick={collapseAll}>
              Colapsar todo
            </Button>
          </div>
        </div>

        <div className="border border-border rounded-lg bg-card p-4 max-h-[600px] overflow-y-auto">
          {treeData.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No hay datos disponibles</p>
          ) : (
            <div className="space-y-1">{treeData.map((node) => renderTreeNode(node, 0))}</div>
          )}
        </div>

        <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            {getNodeIcon("device")}
            <span>Dispositivo</span>
          </div>
          <div className="flex items-center gap-2">
            {getNodeIcon("accessory")}
            <span>Accesorio (L0)</span>
          </div>
          <div className="flex items-center gap-2">
            {getNodeIcon("sub-accessory")}
            <span>Sub-accesorio (L1+)</span>
          </div>
          <div className="flex items-center gap-2">
            {getNodeIcon("feature")}
            <span>Característica</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
