"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import type { GraphNode, Device, Accessory, Feature } from "@/lib/types"
import { mockAccessories, mockDevices } from "@/lib/mock-data"

interface ProductCardProps {
  node: GraphNode
  onClose: () => void
}

export function ProductCard({ node, onClose }: ProductCardProps) {
  const renderDeviceCard = (device: Device) => (
    <>
      <img
        src={device.imageUrl || "/placeholder.svg"}
        alt={device.name}
        className="w-full h-48 object-cover rounded-lg mb-4"
      />
      <div className="space-y-3">
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-1">Marca</h4>
          <p className="text-base text-foreground">{device.brand}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-1">Modelo</h4>
          <p className="text-base text-foreground">{device.model}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-1">Categoría</h4>
          <Badge variant="secondary">{device.category}</Badge>
        </div>
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-1">Año</h4>
          <p className="text-base text-foreground">{device.releaseYear}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-1">Descripción</h4>
          <p className="text-sm text-foreground leading-relaxed">{device.description}</p>
        </div>

        {/* Compatible accessories */}
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-2">Accesorios compatibles</h4>
          <div className="space-y-2">
            {mockAccessories
              .filter((acc) => acc.compatibleDevices.includes(device.id))
              .slice(0, 3)
              .map((acc) => (
                <div key={acc.id} className="flex items-center gap-3 p-2 rounded-lg border border-border">
                  <img
                    src={acc.imageUrl || "/placeholder.svg"}
                    alt={acc.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{acc.name}</p>
                    <p className="text-xs text-muted-foreground">{acc.brand}</p>
                  </div>
                  <span className="text-sm font-bold text-primary">${acc.price.toFixed(2)}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  )

  const renderAccessoryCard = (accessory: Accessory) => {
    const alternatives = accessory.alternativeIds
      ? mockAccessories.filter((acc) => accessory.alternativeIds?.includes(acc.id))
      : []

    const compatibleDevices = mockDevices.filter((dev) => accessory.compatibleDevices.includes(dev.id))

    return (
      <>
        <img
          src={accessory.imageUrl || "/placeholder.svg"}
          alt={accessory.name}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Marca</h4>
            <p className="text-base text-foreground">{accessory.brand}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Tipo</h4>
            <Badge variant="secondary">{accessory.type}</Badge>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Precio</h4>
            <p className="text-2xl font-bold text-primary">${accessory.price.toFixed(2)}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Disponibilidad</h4>
            <Badge variant={accessory.inStock ? "default" : "destructive"}>
              {accessory.inStock ? "En stock" : "Agotado"}
            </Badge>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Descripción</h4>
            <p className="text-sm text-foreground leading-relaxed">{accessory.description}</p>
          </div>

          {/* Compatible devices */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Compatible con</h4>
            <div className="flex flex-wrap gap-2">
              {compatibleDevices.map((dev) => (
                <Badge key={dev.id} variant="outline">
                  {dev.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Alternatives if out of stock */}
          {!accessory.inStock && alternatives.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Alternativas disponibles</h4>
              <div className="space-y-2">
                {alternatives.map((alt) => (
                  <div key={alt.id} className="flex items-center gap-3 p-2 rounded-lg border border-border bg-muted/30">
                    <img
                      src={alt.imageUrl || "/placeholder.svg"}
                      alt={alt.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{alt.name}</p>
                      <p className="text-xs text-muted-foreground">{alt.brand}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-primary">${alt.price.toFixed(2)}</span>
                      {alt.inStock && (
                        <Badge variant="default" className="text-xs ml-2">
                          Disponible
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button className="w-full mt-4">{accessory.inStock ? "Agregar al carrito" : "Ver alternativas"}</Button>
        </div>
      </>
    )
  }

  const renderFeatureCard = (feature: Feature) => (
    <>
      <div className="space-y-3">
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-1">Categoría</h4>
          <Badge variant="secondary">{feature.category}</Badge>
        </div>
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-1">Descripción</h4>
          <p className="text-sm text-foreground leading-relaxed">{feature.description}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-2">Accesorios relacionados</h4>
          <div className="space-y-2">
            {mockAccessories
              .filter((acc) => feature.relatedAccessoryIds.includes(acc.id))
              .map((acc) => (
                <div key={acc.id} className="flex items-center gap-3 p-2 rounded-lg border border-border">
                  <img
                    src={acc.imageUrl || "/placeholder.svg"}
                    alt={acc.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{acc.name}</p>
                    <p className="text-xs text-muted-foreground">{acc.brand}</p>
                  </div>
                  <span className="text-sm font-bold text-primary">${acc.price.toFixed(2)}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  )

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{node.label}</CardTitle>
            <p className="text-xs text-muted-foreground mt-1 capitalize">{node.type}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="max-h-[600px] overflow-y-auto">
        {node.type === "device" && renderDeviceCard(node.data as Device)}
        {node.type === "accessory" && renderAccessoryCard(node.data as Accessory)}
        {node.type === "feature" && renderFeatureCard(node.data as Feature)}
      </CardContent>
    </Card>
  )
}
