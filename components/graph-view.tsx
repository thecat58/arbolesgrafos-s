"use client"

import type React from "react"

import { useState, useMemo, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { UserNavigation, GraphNode } from "@/lib/types"
import { mockDevices, mockAccessories, mockFeatures } from "@/lib/mock-data"
import { ProductCard } from "@/components/product-card"

interface GraphViewProps {
  onNavigate: (navigation: UserNavigation) => void
}

export function GraphView({ onNavigate }: GraphViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null)
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null)
  const [showProductCard, setShowProductCard] = useState(false)
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })

  // Build graph nodes from mock data
  const graphNodes = useMemo(() => {
    const nodes: GraphNode[] = []
    const centerX = dimensions.width / 2
    const centerY = dimensions.height / 2
    const radius = Math.min(dimensions.width, dimensions.height) * 0.35

    // Helper to calculate accessory depth
    const getAccessoryDepth = (accessoryId: string): number => {
      const accessory = mockAccessories.find((acc) => acc.id === accessoryId)
      if (!accessory || !accessory.parentAccessoryId) return 0
      return 1 + getAccessoryDepth(accessory.parentAccessoryId)
    }

    // Add devices in a circle
    const deviceAngleStep = (Math.PI * 2) / mockDevices.length
    mockDevices.forEach((device, index) => {
      const angle = index * deviceAngleStep - Math.PI / 2
      nodes.push({
        id: device.id,
        label: device.name,
        type: "device",
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        connections: mockAccessories
          .filter((acc) => acc.compatibleDevices.includes(device.id) && !acc.parentAccessoryId)
          .map((acc) => acc.id),
        data: device,
      })
    })

    // Add accessories in an outer ring
    const accessoryRadius = radius * 1.5
    const accessoryAngleStep = (Math.PI * 2) / mockAccessories.length
    mockAccessories.forEach((accessory, index) => {
      const angle = index * accessoryAngleStep - Math.PI / 2
      nodes.push({
        id: accessory.id,
        label: accessory.name,
        type: "accessory",
        x: centerX + Math.cos(angle) * accessoryRadius,
        y: centerY + Math.sin(angle) * accessoryRadius,
        connections: mockAccessories.filter((acc) => acc.compatibleDevices.includes(accessory.id)).map((acc) => acc.id),
        data: accessory,
      })
    })

    // Add features in between
    const featureRadius = radius * 0.6
    const featureAngleStep = (Math.PI * 2) / mockFeatures.length
    mockFeatures.forEach((feature, index) => {
      const angle = index * featureAngleStep
      nodes.push({
        id: feature.id,
        label: feature.name,
        type: "feature",
        x: centerX + Math.cos(angle) * featureRadius,
        y: centerY + Math.sin(angle) * featureRadius,
        connections: feature.relatedAccessoryIds,
        data: feature,
      })
    })

    return nodes
  }, [dimensions])

  // Draw the graph
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, dimensions.width, dimensions.height)

    // Draw connections first (so they appear behind nodes)
    ctx.strokeStyle = "rgba(100, 100, 100, 0.2)"
    ctx.lineWidth = 1

    graphNodes.forEach((node) => {
      node.connections.forEach((connId) => {
        const targetNode = graphNodes.find((n) => n.id === connId)
        if (targetNode) {
          ctx.beginPath()
          ctx.moveTo(node.x, node.y)
          ctx.lineTo(targetNode.x, targetNode.y)
          ctx.stroke()
        }
      })
    })

    // Highlight selected node connections
    if (selectedNode) {
      ctx.strokeStyle = "rgba(59, 130, 246, 0.6)"
      ctx.lineWidth = 2

      selectedNode.connections.forEach((connId) => {
        const targetNode = graphNodes.find((n) => n.id === connId)
        if (targetNode) {
          ctx.beginPath()
          ctx.moveTo(selectedNode.x, selectedNode.y)
          ctx.lineTo(targetNode.x, targetNode.y)
          ctx.stroke()
        }
      })
    }

    // Draw nodes
    graphNodes.forEach((node) => {
      const isSelected = selectedNode?.id === node.id
      const isHovered = hoveredNode?.id === node.id
      const isConnected = selectedNode?.connections.includes(node.id)

      // Node appearance based on type
      let fillColor = "#94a3b8"
      let strokeColor = "#64748b"
      let nodeRadius = 8

      switch (node.type) {
        case "device":
          fillColor = isSelected || isHovered ? "#3b82f6" : "#60a5fa"
          strokeColor = "#2563eb"
          nodeRadius = 12
          break
        case "accessory":
          fillColor = isSelected || isHovered ? "#f59e0b" : "#fbbf24"
          strokeColor = "#d97706"
          nodeRadius = 10
          break
        case "feature":
          fillColor = isSelected || isHovered ? "#8b5cf6" : "#a78bfa"
          strokeColor = "#7c3aed"
          nodeRadius = 8
          break
      }

      // Highlight connected nodes
      if (isConnected) {
        fillColor = "#10b981"
        strokeColor = "#059669"
      }

      // Draw node
      ctx.beginPath()
      ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2)
      ctx.fillStyle = fillColor
      ctx.fill()
      ctx.strokeStyle = strokeColor
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw node label on hover or selection
      if (isSelected || isHovered || isConnected) {
        ctx.fillStyle = "#1e293b"
        ctx.font = "12px sans-serif"
        ctx.textAlign = "center"
        ctx.textBaseline = "bottom"

        // Background for text
        const textWidth = ctx.measureText(node.label).width
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
        ctx.fillRect(node.x - textWidth / 2 - 4, node.y - nodeRadius - 20, textWidth + 8, 18)

        ctx.fillStyle = "#1e293b"
        ctx.fillText(node.label, node.x, node.y - nodeRadius - 4)
      }
    })
  }, [graphNodes, selectedNode, hoveredNode, dimensions])

  // Handle canvas click
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    // Find clicked node
    const clickedNode = graphNodes.find((node) => {
      const distance = Math.sqrt(Math.pow(x - node.x, 2) + Math.pow(y - node.y, 2))
      const nodeRadius = node.type === "device" ? 12 : node.type === "accessory" ? 10 : 8
      return distance <= nodeRadius
    })

    if (clickedNode) {
      setSelectedNode(clickedNode)
      setShowProductCard(true)
      onNavigate({
        timestamp: Date.now(),
        view: "graph",
        nodeId: clickedNode.id,
      })
    } else {
      setShowProductCard(false)
    }
  }

  // Handle canvas hover
  const handleCanvasMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    // Find hovered node
    const hoveredNode = graphNodes.find((node) => {
      const distance = Math.sqrt(Math.pow(x - node.x, 2) + Math.pow(y - node.y, 2))
      const nodeRadius = node.type === "device" ? 12 : node.type === "accessory" ? 10 : 8
      return distance <= nodeRadius
    })

    setHoveredNode(hoveredNode || null)
    canvas.style.cursor = hoveredNode ? "pointer" : "default"
  }

  // Update dimensions on mount and resize
  useEffect(() => {
    const updateDimensions = () => {
      const container = canvasRef.current?.parentElement
      if (container) {
        setDimensions({
          width: container.clientWidth,
          height: Math.max(600, container.clientHeight),
        })
      }
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  const resetView = () => {
    setSelectedNode(null)
    setShowProductCard(false)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Graph Canvas */}
      <Card className={showProductCard ? "lg:col-span-2" : "lg:col-span-3"}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Grafo Interactivo</h2>
              <p className="text-sm text-muted-foreground mt-1">Haz clic en cualquier nodo para ver detalles</p>
            </div>
            <div className="flex gap-2">
              {selectedNode && (
                <Button variant="outline" size="sm" onClick={resetView}>
                  Limpiar selección
                </Button>
              )}
              <Badge variant="secondary" className="text-xs">
                {graphNodes.length} nodos
              </Badge>
            </div>
          </div>

          <div className="border border-border rounded-lg bg-card overflow-hidden">
            <canvas
              ref={canvasRef}
              width={dimensions.width}
              height={dimensions.height}
              onClick={handleCanvasClick}
              onMouseMove={handleCanvasMove}
              className="w-full"
            />
          </div>

          <div className="mt-4 flex items-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#60a5fa] border-2 border-[#2563eb]" />
              <span>Dispositivo</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#fbbf24] border-2 border-[#d97706]" />
              <span>Accesorio</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#a78bfa] border-2 border-[#7c3aed]" />
              <span>Característica</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#10b981] border-2 border-[#059669]" />
              <span>Conectado</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product Card Panel */}
      {showProductCard && selectedNode && (
        <div className="lg:col-span-1">
          <ProductCard node={selectedNode} onClose={() => setShowProductCard(false)} />
        </div>
      )}
    </div>
  )
}
