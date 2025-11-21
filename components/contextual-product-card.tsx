"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { NavigationPath, ContextualNode } from "@/lib/types"
import { X, Package, DollarSign, CheckCircle, XCircle, ChevronRight } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ContextualProductCardProps {
  node: ContextualNode
  path: NavigationPath
  onClose: () => void
  onNavigate: (node: ContextualNode) => void
}

export function ContextualProductCard({ node, path, onClose, onNavigate }: ContextualProductCardProps) {
  return (
    <Card className="border-slate-200 dark:border-slate-800 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-xl">{node.name}</CardTitle>
              <Badge variant="outline">{node.type}</Badge>
            </div>
            {node.brand && <p className="text-sm text-slate-600 dark:text-slate-400">Marca: {node.brand}</p>}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <ScrollArea className="max-h-[400px]">
          <div className="space-y-4">
            {/* Description */}
            {node.description && (
              <div>
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  ¿Qué es?
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">{node.description}</p>
              </div>
            )}

            {/* Purpose */}
            <div>
              <h4 className="font-semibold text-sm mb-2">¿Para qué sirve?</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Este {node.type === "device" ? "dispositivo" : "accesorio"} está diseñado para{" "}
                {node.category?.toLowerCase() || "uso general"} y complementa tu experiencia tecnológica.
              </p>
            </div>

            {/* Compatibility */}
            <div>
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Compatibilidad
              </h4>
              <div className="flex flex-wrap gap-2">
                {path.nodes.length > 0 ? (
                  path.nodes.map((pathNode) => (
                    <Badge key={pathNode.id} variant="secondary" className="text-xs">
                      {pathNode.name}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-slate-600 dark:text-slate-400">Compatible con múltiples dispositivos</p>
                )}
              </div>
            </div>

            {/* Pricing */}
            {node.price && (
              <div>
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Precio
                </h4>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">${node.price.toFixed(2)}</span>
                  {node.inStock !== undefined && (
                    <Badge variant={node.inStock ? "default" : "destructive"} className="text-xs">
                      {node.inStock ? (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          En stock
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3 mr-1" />
                          Sin stock
                        </>
                      )}
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Alternatives if out of stock */}
            {node.inStock === false && (
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                <h4 className="font-semibold text-sm mb-2 text-amber-900 dark:text-amber-100">
                  Alternativas disponibles
                </h4>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Este producto no está disponible actualmente. Consulta productos similares en las recomendaciones.
                </p>
              </div>
            )}

            {/* Continue navigation */}
            <div className="pt-2">
              <Button className="w-full gap-2 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700">
                Explorar accesorios compatibles
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
