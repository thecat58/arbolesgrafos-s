"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Recommendation } from "@/lib/types"
import { mockDevices, mockAccessories } from "@/lib/mock-data"

interface RecommendationsPanelProps {
  recommendations: Recommendation[]
}

export function RecommendationsPanel({ recommendations }: RecommendationsPanelProps) {
  const getRecommendationIcon = (type: Recommendation["type"]) => {
    switch (type) {
      case "kit":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-primary"
          >
            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
            <path d="m3.3 7 8.7 5 8.7-5" />
            <path d="M12 22V12" />
          </svg>
        )
      case "combination":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-accent"
          >
            <path d="M12 2v6" />
            <path d="M12 22v-6" />
            <path d="M22 12h-6" />
            <path d="M2 12h6" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        )
      case "equivalent":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-chart-3"
          >
            <polyline points="17 1 21 5 17 9" />
            <path d="M3 11V9a4 4 0 0 1 4-4h14" />
            <polyline points="7 23 3 19 7 15" />
            <path d="M21 13v2a4 4 0 0 1-4 4H3" />
          </svg>
        )
      case "personalized":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-chart-4"
          >
            <path d="M12 2v20" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        )
    }
  }

  const getProductName = (id: string) => {
    const device = mockDevices.find((d) => d.id === id)
    if (device) return device.name
    const accessory = mockAccessories.find((a) => a.id === id)
    if (accessory) return accessory.name
    return "Producto"
  }

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
            <path d="M20 3v4" />
            <path d="M22 5h-4" />
            <path d="M4 17v2" />
            <path d="M5 18H3" />
          </svg>
          Recomendaciones
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.length === 0 ? (
          <div className="text-center py-8 space-y-3">
            <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-muted-foreground"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
            </div>
            <p className="text-sm text-muted-foreground">
              Explora productos para recibir recomendaciones personalizadas
            </p>
          </div>
        ) : (
          recommendations.map((rec) => (
            <Card key={rec.id} className="border-border bg-card/50">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    {getRecommendationIcon(rec.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs capitalize">
                        {rec.type === "kit" && "Kit"}
                        {rec.type === "combination" && "Combinación"}
                        {rec.type === "equivalent" && "Equivalente"}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <div
                          className="h-1.5 flex-1 bg-secondary rounded-full overflow-hidden"
                          style={{ width: "40px" }}
                        >
                          <div
                            className="h-full bg-primary transition-all"
                            style={{ width: `${rec.confidence * 100}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-muted-foreground">
                          {Math.round(rec.confidence * 100)}%
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-foreground font-medium leading-relaxed">{rec.reason}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {rec.items.slice(0, 3).map((itemId) => (
                    <div key={itemId} className="text-xs text-muted-foreground flex items-center gap-2 pl-13">
                      <div className="w-1 h-1 rounded-full bg-primary" />
                      <span className="truncate">{getProductName(itemId)}</span>
                    </div>
                  ))}
                  {rec.items.length > 3 && (
                    <div className="text-xs text-muted-foreground pl-13">+{rec.items.length - 3} más</div>
                  )}
                </div>

                <Button size="sm" className="w-full mt-2 bg-transparent" variant="outline">
                  Ver detalles
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </CardContent>
    </Card>
  )
}
