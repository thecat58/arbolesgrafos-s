"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { apiClient, type GraphData } from "@/lib/api-client"
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react"

interface DynamicGraphViewProps {
  currentRootId: string
  onNodeSelect: (nodeId: string) => void
}

export function DynamicGraphView({ currentRootId, onNodeSelect }: DynamicGraphViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [graphData, setGraphData] = useState<GraphData | null>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [zoom, setZoom] = useState(1)

  useEffect(() => {
    const loadGraph = async () => {
      try {
        const data = await apiClient.getGraph(currentRootId, 250)
        setGraphData(data)
        console.log("[v0] Graph loaded:", data)
      } catch (error) {
        console.error("[v0] Error loading graph:", error)
      }
    }

    loadGraph()
  }, [currentRootId])

  useEffect(() => {
    if (!canvasRef.current || !graphData) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.save()

    // Apply zoom
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    ctx.translate(centerX, centerY)
    ctx.scale(zoom, zoom)
    ctx.translate(-centerX, -centerY)

    // Draw edges first
    ctx.strokeStyle = "rgba(148, 163, 184, 0.3)"
    ctx.lineWidth = 2

    graphData.edges.forEach((edge) => {
      const sourceNode = graphData.nodes.find((n) => n.id === edge.source)
      const targetNode = graphData.nodes.find((n) => n.id === edge.target)

      if (sourceNode && targetNode) {
        ctx.beginPath()
        ctx.moveTo(sourceNode.x, sourceNode.y)
        ctx.lineTo(targetNode.x, targetNode.y)
        ctx.stroke()
      }
    })

    // Draw nodes
    graphData.nodes.forEach((node) => {
      const isHovered = hoveredNode === node.id
      const isSelected = selectedNode === node.id

      // Node color by type
      let color = "#60a5fa" // blue for devices
      if (node.type === "accessory") color = "#fb923c" // orange
      if (node.type === "feature") color = "#a78bfa" // purple

      // Draw node circle
      ctx.beginPath()
      ctx.arc(node.x, node.y, isHovered || isSelected ? 24 : 20, 0, 2 * Math.PI)
      ctx.fillStyle = color
      ctx.fill()

      // Border for selected/hovered
      if (isSelected || isHovered) {
        ctx.strokeStyle = isSelected ? "#ffffff" : color
        ctx.lineWidth = 3
        ctx.stroke()
      }

      // Draw level badge
      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 11px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(`L${node.level}`, node.x, node.y)

      // Draw label below node
      ctx.fillStyle = "#1e293b"
      ctx.font = "12px sans-serif"
      ctx.fillText(node.name.length > 20 ? node.name.substring(0, 20) + "..." : node.name, node.x, node.y + 35)
    })

    ctx.restore()
  }, [graphData, hoveredNode, selectedNode, zoom])

  // Handle mouse interactions
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !graphData) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left - canvas.width / 2) / zoom + canvas.width / 2
    const y = (e.clientY - rect.top - canvas.height / 2) / zoom + canvas.height / 2

    // Check if clicked on a node
    const clickedNode = graphData.nodes.find((node) => {
      const distance = Math.sqrt(Math.pow(node.x - x, 2) + Math.pow(node.y - y, 2))
      return distance <= 20
    })

    if (clickedNode) {
      setSelectedNode(clickedNode.id)
      onNodeSelect(clickedNode.id)
    }
  }

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !graphData) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left - canvas.width / 2) / zoom + canvas.width / 2
    const y = (e.clientY - rect.top - canvas.height / 2) / zoom + canvas.height / 2

    const hoveredNode = graphData.nodes.find((node) => {
      const distance = Math.sqrt(Math.pow(node.x - x, 2) + Math.pow(node.y - y, 2))
      return distance <= 20
    })

    setHoveredNode(hoveredNode?.id || null)
    canvas.style.cursor = hoveredNode ? "pointer" : "default"
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Grafo Poligonal N-gonal</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Distribución simétrica y equilibrada</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{graphData?.nodes.length || 0} nodos</Badge>
            <Badge variant="outline">{graphData?.levels || 0} niveles</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setZoom(Math.min(zoom + 0.2, 3))}>
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setZoom(Math.max(zoom - 0.2, 0.5))}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setZoom(1)}>
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Zoom: {Math.round(zoom * 100)}%</p>
          </div>

          {/* Canvas */}
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            onClick={handleCanvasClick}
            onMouseMove={handleCanvasMouseMove}
            className="w-full border border-border rounded-lg bg-muted/20"
          />

          {/* Legend */}
          <div className="flex items-center gap-6 justify-center text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#60a5fa]" />
              <span className="text-muted-foreground">Dispositivos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#fb923c]" />
              <span className="text-muted-foreground">Accesorios</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#a78bfa]" />
              <span className="text-muted-foreground">Características</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
