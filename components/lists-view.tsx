"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockDevices, mockAccessories } from "@/lib/mock-data"
import type { UserNavigation } from "@/lib/types"

interface ListsViewProps {
  onNavigate: (navigation: UserNavigation) => void
}

export function ListsView({ onNavigate }: ListsViewProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [brandFilter, setBrandFilter] = useState<string>("all")
  const [selectedItem, setSelectedItem] = useState<string | null>(null)

  const filteredDevices = useMemo(() => {
    return mockDevices.filter((device) => {
      const matchesSearch =
        device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        device.brand.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = categoryFilter === "all" || device.category === categoryFilter
      const matchesBrand = brandFilter === "all" || device.brand === brandFilter
      return matchesSearch && matchesCategory && matchesBrand
    })
  }, [searchQuery, categoryFilter, brandFilter])

  const filteredAccessories = useMemo(() => {
    return mockAccessories.filter((acc) => {
      const matchesSearch =
        acc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        acc.brand.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesBrand = brandFilter === "all" || acc.brand === brandFilter
      return matchesSearch && matchesBrand
    })
  }, [searchQuery, brandFilter])

  const handleItemClick = (id: string) => {
    setSelectedItem(id)
    onNavigate({
      timestamp: Date.now(),
      view: "list",
      nodeId: id,
      filters: { category: categoryFilter, brand: brandFilter, search: searchQuery },
    })
  }

  const brands = Array.from(new Set([...mockDevices.map((d) => d.brand), ...mockAccessories.map((a) => a.brand)]))

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Input
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                <SelectItem value="smartphones">Smartphones</SelectItem>
                <SelectItem value="tablets">Tablets</SelectItem>
                <SelectItem value="laptops">Laptops</SelectItem>
                <SelectItem value="cameras">Cámaras</SelectItem>
                <SelectItem value="audio">Audio</SelectItem>
                <SelectItem value="wearables">Wearables</SelectItem>
              </SelectContent>
            </Select>
            <Select value={brandFilter} onValueChange={setBrandFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Marca" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las marcas</SelectItem>
                {brands.map((brand) => (
                  <SelectItem key={brand} value={brand}>
                    {brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Devices List */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-foreground">Dispositivos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDevices.map((device) => (
            <Card
              key={device.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedItem === device.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => handleItemClick(device.id)}
            >
              <CardContent className="p-4">
                <img
                  src={device.imageUrl || "/placeholder.svg"}
                  alt={device.name}
                  className="w-full h-32 object-cover rounded-md mb-3"
                />
                <h3 className="font-semibold text-foreground mb-1">{device.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{device.brand}</p>
                <div className="flex gap-2">
                  <Badge variant="secondary">{device.category}</Badge>
                  <Badge variant="outline">{device.releaseYear}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Accessories List */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-foreground">Accesorios</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredAccessories.map((accessory) => (
            <Card
              key={accessory.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedItem === accessory.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => handleItemClick(accessory.id)}
            >
              <CardContent className="p-3">
                <img
                  src={accessory.imageUrl || "/placeholder.svg"}
                  alt={accessory.name}
                  className="w-full h-24 object-cover rounded-md mb-2"
                />
                <h3 className="font-semibold text-sm text-foreground mb-1">{accessory.name}</h3>
                <p className="text-xs text-muted-foreground mb-2">{accessory.brand}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-primary">${accessory.price.toFixed(2)}</span>
                  <Badge variant={accessory.inStock ? "default" : "destructive"} className="text-xs">
                    {accessory.inStock ? "Stock" : "Agotado"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
