"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { NavigationPath, ContextualNode } from "@/lib/types"
import { Sparkles, Loader2, TrendingUp, Package } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ContextualRecommendationsProps {
  path: NavigationPath
  onNodeSelect: (node: ContextualNode) => void
}

interface Recommendation {
  node: ContextualNode
  reason: string
  confidence: number
}

export function ContextualRecommendations({ path, onNodeSelect }: ContextualRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadRecommendations()
  }, [path])

  const loadRecommendations = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path }),
      })
      const data = await response.json()
      setRecommendations(data.recommendations || [])
    } catch (error) {
      console.error("[v0] Error loading recommendations:", error)
      setRecommendations([])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-slate-200 dark:border-slate-800 shadow-sm sticky top-24">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-yellow-500" />
          Recomendaciones Inteligentes
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-0">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          </div>
        ) : recommendations.length === 0 ? (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Explora dispositivos para recibir recomendaciones personalizadas</p>
          </div>
        ) : (
          <ScrollArea className="h-[500px] pr-2">
            <div className="space-y-3">
              {recommendations.map((rec, index) => (
                <div
                  key={rec.node.id}
                  className="bg-gradient-to-br from-blue-50 to-violet-50 dark:from-blue-950/20 dark:to-violet-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-2 mb-2">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 text-white flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100">{rec.node.name}</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{rec.reason}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="text-xs">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {Math.round(rec.confidence * 100)}% confianza
                    </Badge>
                    {rec.node.price && (
                      <Badge variant="outline" className="text-xs">
                        ${rec.node.price.toFixed(2)}
                      </Badge>
                    )}
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full text-xs h-8 bg-transparent"
                    onClick={() => onNodeSelect(rec.node)}
                  >
                    Ver detalles
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
