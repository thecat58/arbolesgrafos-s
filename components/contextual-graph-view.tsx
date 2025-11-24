"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { NavigationPath, ContextualNode } from "@/lib/types"
import { Loader2 } from "lucide-react"

interface ContextualGraphViewProps {
  path: NavigationPath
  onNodeSelect: (node: ContextualNode) => void
}

interface GraphNode extends ContextualNode {
  x: number
  y: number
  radius: number
}

export function ContextualGraphView({ path, onNodeSelect }: ContextualGraphViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [nodes, setNodes] = useState<GraphNode[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null)

  useEffect(() => {
    loadGraphData()
  }, [path])

  useEffect(() => {
    if (nodes.length > 0) {
      drawGraph()
    }
  }, [nodes, hoveredNode])

  const loadGraphData = async () => {
    setIsLoading(true)
    try {
      // Combinar nodos del path + nodos del siguiente nivel
      const pathNodes: GraphNode[] = path.nodes.map((node, index) => ({
        ...node,
        x: 0,
        y: 0,
        radius: 30 - index * 3, // Decrece con la profundidad
      }))

      let nextLevelNodes: ContextualNode[] = []
      if (path.nodes.length === 0) {
        const response = await fetch("/api/devices")
        const data = await response.json()
        nextLevelNodes = data.devices || []
      } else {
        const lastNode = path.nodes[path.nodes.length - 1]
        const response = await fetch(`/api/children?parentId=${lastNode.id}&rootDeviceId=${path.rootDeviceId}`)
        const data = await response.json()
        nextLevelNodes = data.children || []
      }

      const nextNodes: GraphNode[] = nextLevelNodes.map((node) => ({
        ...node,
        x: 0,
        y: 0,
        radius: 25,
      }))

      const allNodes = [...pathNodes, ...nextNodes]
      calculateNodePositions(allNodes, pathNodes.length)
      setNodes(allNodes)
    } catch (error) {
      console.error("[v0] Error loading graph:", error)
      setNodes([])
    } finally {
      setIsLoading(false)
    }
  }

  const calculateNodePositions = (allNodes: GraphNode[], pathLength: number) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    // Posicionar nodos del path en línea vertical
    allNodes.slice(0, pathLength).forEach((node, index) => {
      node.x = centerX
      node.y = centerY - 150 + index * 80
    })

    // Posicionar nodos del siguiente nivel en círculo
    const nextNodes = allNodes.slice(pathLength)
    const radius = 180
    const angleStep = (Math.PI * 2) / Math.max(nextNodes.length, 1)

    nextNodes.forEach((node, index) => {
      const angle = angleStep * index - Math.PI / 2
      node.x = centerX + Math.cos(angle) * radius
      node.y = centerY + Math.sin(angle) * radius + 100
    })
  }

  const drawGraph = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const pathLength = path.nodes.length

    // Draw connections
    ctx.strokeStyle = "rgba(148, 163, 184, 0.3)"
    ctx.lineWidth = 2

    // Connections from path nodes
    for (let i = 0; i < pathLength - 1; i++) {
      const from = nodes[i]
      const to = nodes[i + 1]
      ctx.beginPath()
      ctx.moveTo(from.x, from.y)
      ctx.lineTo(to.x, to.y)
      ctx.stroke()
    }

    // Connections to next level
    if (pathLength > 0) {
      const lastPathNode = nodes[pathLength - 1]
      for (let i = pathLength; i < nodes.length; i++) {
        const nextNode = nodes[i]
        ctx.beginPath()
        ctx.moveTo(lastPathNode.x, lastPathNode.y)
        ctx.lineTo(nextNode.x, nextNode.y)
        ctx.stroke()
      }
    }

    // Draw nodes
    nodes.forEach((node, index) => {
      const isPathNode = index < pathLength
      const isHovered = hoveredNode?.id === node.id
      const isLastPath = index === pathLength - 1

      ctx.beginPath()
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)

      // Fill
      if (isLastPath) {
        const gradient = ctx.createLinearGradient(node.x - node.radius, node.y, node.x + node.radius, node.y)
        gradient.addColorStop(0, "#2563eb")
        gradient.addColorStop(1, "#7c3aed")
        ctx.fillStyle = gradient
      } else if (isPathNode) {
        ctx.fillStyle = isHovered ? "#64748b" : "#94a3b8"
      } else {
        ctx.fillStyle = isHovered ? "#3b82f6" : "#cbd5e1"
      }

      ctx.fill()

      // Border
      ctx.strokeStyle = isHovered ? "#1e40af" : isPathNode ? "#475569" : "#94a3b8"
      ctx.lineWidth = isHovered ? 3 : 2
      ctx.stroke()

      // Text
      ctx.fillStyle = isPathNode || isHovered ? "#ffffff" : "#1e293b"
      ctx.font = `${isPathNode ? "bold " : ""}12px sans-serif`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      const text = node.name.length > 12 ? node.name.substring(0, 10) + "..." : node.name
      ctx.fillText(text, node.x, node.y)

      // Level badge
      if (isPathNode) {
        ctx.fillStyle = "#f1f5f9"
        ctx.font = "10px sans-serif"
        ctx.fillText(`L${index}`, node.x, node.y + node.radius + 12)
      }
    })
  }

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const clickedNode = nodes.find((node) => {
      const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2)
      return distance <= node.radius
    })

    if (clickedNode && nodes.indexOf(clickedNode) >= path.nodes.length) {
      onNodeSelect(clickedNode)
    }
  }

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const hoveredNode = nodes.find((node) => {
      const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2)
      return distance <= node.radius
    })

    setHoveredNode(hoveredNode || null)
    canvas.style.cursor = hoveredNode ? "pointer" : "default"
  }

  return (
    <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Grafo Contextual N-gonal</CardTitle>
          <Badge variant="secondary" className="text-xs">
            {nodes.length} nodos
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-[600px]">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <p className="text-sm text-slate-600 dark:text-slate-400">Generando grafo contextual...</p>
            </div>
          </div>
        ) : (
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={800}
              height={600}
              className="w-full border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
              onClick={handleCanvasClick}
              onMouseMove={handleCanvasMouseMove}
            />
            {hoveredNode && (
              <div className="absolute top-4 left-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 shadow-lg">
                <p className="font-semibold text-sm">{hoveredNode.name}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{hoveredNode.type}</p>
                {hoveredNode.price && (
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">${hoveredNode.price.toFixed(2)}</p>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
