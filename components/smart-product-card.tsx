"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { X, HelpCircle, CheckCircle, Package, TrendingUp, ChevronRight } from "lucide-react"
import type { ApiNode } from "@/lib/api-client"

interface SmartProductCardProps {
  node: ApiNode
  onClose: () => void
  onNavigate: (nodeId: string) => void
}

export function SmartProductCard({ node, onClose, onNavigate }: SmartProductCardProps) {
  const generateSmartQuestions = () => {
    const questions = [
      {
        icon: <HelpCircle className="w-4 h-4" />,
        question: "¿Qué es?",
        answer: node.data.description || `${node.name} es un ${node.type} de ${node.data.brand || "tecnología"}`,
      },
      {
        icon: <CheckCircle className="w-4 h-4" />,
        question: "¿Para qué sirve?",
        answer:
          node.type === "device"
            ? `Dispositivo principal que funciona como ${node.data.category || "producto tecnológico"}`
            : node.type === "accessory"
              ? `Accesorio que mejora o extiende las funcionalidades de ${node.data.compatibleWith?.[0] || "tu dispositivo"}`
              : `Característica que proporciona ${node.data.category || "funcionalidad adicional"}`,
      },
      {
        icon: <Package className="w-4 h-4" />,
        question: "¿Es compatible con mi dispositivo?",
        answer: node.data.compatibleWith
          ? `Compatible con: ${node.data.compatibleWith.join(", ")}`
          : node.type === "device"
            ? "Este es el dispositivo principal"
            : "Verifica compatibilidad en las especificaciones",
      },
    ]

    // Add variants question if applicable
    if (node.children && node.children.length > 0) {
      questions.push({
        icon: <TrendingUp className="w-4 h-4" />,
        question: "¿Qué variantes o accesorios existen?",
        answer: `${node.children.length} opciones disponibles en el siguiente nivel`,
      })
    }

    // Add alternatives question if out of stock
    if (node.data.inStock === false && node.data.alternatives) {
      questions.push({
        icon: <Package className="w-4 h-4" />,
        question: "¿Qué alternativas tengo si no hay stock?",
        answer: `${node.data.alternatives.length} alternativas disponibles con características similares`,
      })
    }

    return questions
  }

  const smartQuestions = generateSmartQuestions()

  return (
    <Card className="border-2 border-primary/20 shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs">
                Nivel {node.level}
              </Badge>
              <Badge variant="secondary" className="text-xs capitalize">
                {node.type}
              </Badge>
            </div>
            <CardTitle className="text-xl">{node.name}</CardTitle>
            {node.data.brand && <p className="text-sm text-muted-foreground mt-1">{node.data.brand}</p>}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Image */}
        {node.data.imageUrl && (
          <img
            src={node.data.imageUrl || "/placeholder.svg"}
            alt={node.name}
            className="w-full h-48 object-cover rounded-lg"
          />
        )}

        {/* Price and Stock */}
        {node.data.price !== undefined && (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-primary">${node.data.price.toFixed(2)}</p>
            </div>
            <Badge variant={node.data.inStock ? "default" : "destructive"}>
              {node.data.inStock ? "En stock" : "Agotado"}
            </Badge>
          </div>
        )}

        <Separator />

        {/* Smart Questions */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <HelpCircle className="w-4 h-4" />
            Preguntas Inteligentes
          </h3>

          {smartQuestions.map((q, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="mt-0.5 text-primary">{q.icon}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{q.question}</p>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{q.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Children/Next Level Navigation */}
        {node.children && node.children.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">
              Siguiente Nivel ({node.children.length} elementos)
            </h3>
            <div className="space-y-2">
              {node.children.slice(0, 3).map((child) => (
                <button
                  key={child.id}
                  onClick={() => onNavigate(child.id)}
                  className="w-full flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary hover:bg-accent transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-xs">
                      L{child.level}
                    </Badge>
                    <div className="text-left">
                      <p className="text-sm font-medium text-foreground">{child.name}</p>
                      {child.data.price && <p className="text-xs text-muted-foreground">${child.data.price}</p>}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
              ))}
              {node.children.length > 3 && (
                <p className="text-xs text-center text-muted-foreground">+{node.children.length - 3} más disponibles</p>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button className="flex-1" disabled={!node.data.inStock}>
            {node.data.inStock ? "Agregar al carrito" : "Ver alternativas"}
          </Button>
          {node.children && node.children.length > 0 && (
            <Button variant="outline" onClick={() => onNavigate(node.children![0].id)}>
              Explorar siguiente nivel
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
