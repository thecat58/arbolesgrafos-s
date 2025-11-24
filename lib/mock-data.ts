import type { Device, Accessory, Feature } from "./types"

/**
 * Datos mock de dispositivos y accesorios.
 * Traducción de campos visibles para la interfaz al español.
 */

export const mockDevices: Device[] = [
  {
    id: "dev-1",
    name: "iPhone 15 Pro",
    brand: "Apple",
    category: "smartphones",
    model: "A2848",
    imageUrl: "/iphone-15-pro.png",
    description: "Smartphone premium con chip A17 Pro y cámara avanzada",
    releaseYear: 2023,
  },
  {
    id: "dev-2",
    name: "Galaxy S24 Ultra",
    brand: "Samsung",
    category: "smartphones",
    model: "SM-S928",
    imageUrl: "/samsung-galaxy-s24-ultra.png",
    description: "Teléfono Android de gama alta con S-Pen integrado y cámara de 200MP",
    releaseYear: 2024,
  },
  {
    id: "dev-3",
    name: 'MacBook Pro 16"',
    brand: "Apple",
    category: "laptops",
    model: "M3 Max",
    imageUrl: "/macbook-pro.png",
    description: "Portátil profesional con chip M3 Max",
    releaseYear: 2023,
  },
  {
    id: "dev-4",
    name: "Sony A7 IV",
    brand: "Sony",
    category: "cameras",
    model: "ILCE-7M4",
    imageUrl: "/sony-mirrorless-camera.jpg",
    description: "Cámara mirrorless de fotograma completo",
    releaseYear: 2021,
  },
]

export const mockAccessories: Accessory[] = [
  {
    id: "acc-1",
    name: "Funda MagSafe",
    brand: "Apple",
    type: "case",
    compatibleDevices: ["dev-1"],
    imageUrl: "/iphone-magsafe-case.jpg",
    description: "Funda con soporte MagSafe integrado",
    price: 59.99,
    inStock: true,
  },
  {
    id: "acc-2",
    name: "Cable USB-C 2 m",
    brand: "Anker",
    type: "cable",
    compatibleDevices: ["dev-1", "dev-2", "dev-3"],
    imageUrl: "/usb-c-cable.jpg",
    description: "Cable de carga rápida USB-C a USB-C",
    price: 19.99,
    inStock: true,
    alternativeIds: ["acc-7"],
  },
  {
    id: "acc-3",
    name: "Cargador GaN 67W",
    brand: "Anker",
    type: "charger",
    compatibleDevices: ["dev-1", "dev-2", "dev-3"],
    imageUrl: "/usb-c-fast-charger.jpg",
    description: "Cargador compacto de nitruro de galio (GaN)",
    price: 49.99,
    inStock: false,
    alternativeIds: ["acc-8"],
  },
  {
    id: "acc-4",
    name: "Funda de silicona",
    brand: "Samsung",
    type: "case",
    compatibleDevices: ["dev-2"],
    imageUrl: "/samsung-phone-case.jpg",
    description: "Funda de silicona premium",
    price: 39.99,
    inStock: true,
  },
  {
    id: "acc-5",
    name: "Soporte para portátil",
    brand: "Rain Design",
    type: "stand",
    compatibleDevices: ["dev-3"],
    imageUrl: "/aluminum-laptop-stand.jpg",
    description: "Soporte de aluminio ergonómico",
    price: 79.99,
    inStock: true,
  },
  {
    id: "acc-6",
    name: "Objetivo FE 24-70mm",
    brand: "Sony",
    type: "lens",
    compatibleDevices: ["dev-4"],
    imageUrl: "/camera-lens-sony.jpg",
    description: "Lente zoom estándar versátil",
    price: 899.99,
    inStock: true,
  },
  {
    id: "acc-7",
    name: "Cable USB-C 1.5 m",
    brand: "Belkin",
    type: "cable",
    compatibleDevices: ["dev-1", "dev-2", "dev-3"],
    imageUrl: "/premium-usb-c-cable.jpg",
    description: "Cable reforzado con certificación MFi",
    price: 24.99,
    inStock: true,
    alternativeIds: ["acc-2"],
  },
  {
    id: "acc-8",
    name: "Cargador 65W de doble puerto",
    brand: "Ugreen",
    type: "charger",
    compatibleDevices: ["dev-1", "dev-2", "dev-3"],
    imageUrl: "/dual-port-charger.jpg",
    description: "Cargador con dos puertos USB-C",
    price: 44.99,
    inStock: true,
    alternativeIds: ["acc-3"],
  },
  {
    id: "acc-9",
    name: "Billetera MagSafe",
    brand: "Apple",
    type: "case",
    compatibleDevices: ["dev-1"],
    parentAccessoryId: "acc-1", // Se acopla a la funda MagSafe
    imageUrl: "/magsafe-wallet.jpg",
    description: "Billetera magnética que se adhiere a la funda MagSafe",
    price: 39.99,
    inStock: true,
  },
  {
    id: "acc-11",
    name: "Porta tarjetas RFID",
    brand: "Apple",
    type: "case",
    compatibleDevices: ["dev-1"],
    parentAccessoryId: "acc-9", // Se inserta en la billetera MagSafe
    imageUrl: "/magsafe-wallet.jpg",
    description: "Porta tarjetas RFID que se inserta en la billetera",
    price: 19.99,
    inStock: true,
  },
  {
    id: "acc-12",
    name: "Clip para AirTag",
    brand: "Belkin",
    type: "case",
    compatibleDevices: ["dev-1"],
    parentAccessoryId: "acc-11", // Se acopla al porta tarjetas
    imageUrl: "/magsafe-wallet.jpg",
    description: "Clip para AirTag que se adhiere al porta tarjetas",
    price: 14.99,
    inStock: true,
  },
  {
    id: "acc-13",
    name: "Llavero de cuero",
    brand: "Apple",
    type: "case",
    compatibleDevices: ["dev-1"],
    parentAccessoryId: "acc-12", // Se engancha al clip de AirTag
    imageUrl: "/magsafe-wallet.jpg",
    description: "Llavero de cuero que se engancha al clip de AirTag",
    price: 9.99,
    inStock: true,
  },
  {
    id: "acc-10",
    name: "Organizador de cables",
    brand: "Anker",
    type: "cable",
    compatibleDevices: ["dev-1", "dev-2", "dev-3"],
    parentAccessoryId: "acc-2", // Se acopla al cable USB-C
    imageUrl: "/cable-organizer.png",
    description: "Organizador de cables para mantener el orden",
    price: 9.99,
    inStock: true,
  },
  {
    id: "acc-14",
    name: "Pack de clips para cables (6)",
    brand: "Anker",
    type: "cable",
    compatibleDevices: ["dev-1", "dev-2", "dev-3"],
    parentAccessoryId: "acc-10", // Se acopla al organizador de cables
    imageUrl: "/cable-organizer.png",
    description: "Pack de clips adhesivos para fijar cables",
    price: 6.99,
    inStock: true,
  },
  {
    id: "acc-15",
    name: "Recambios de tiras adhesivas",
    brand: "Generic",
    type: "cable",
    compatibleDevices: ["dev-1", "dev-2", "dev-3"],
    parentAccessoryId: "acc-14", // Repuesto para los clips
    imageUrl: "/cable-organizer.png",
    description: "Tiras adhesivas de repuesto para los clips",
    price: 3.99,
    inStock: true,
  },
  {
    id: "acc-16",
    name: "Adaptador VESA para brazo de monitor",
    brand: "Rain Design",
    type: "mount",
    compatibleDevices: ["dev-3"],
    parentAccessoryId: "acc-5", // Se acopla al soporte de portátil
    imageUrl: "/aluminum-laptop-stand.jpg",
    description: "Adaptador VESA para montar el soporte en un brazo de monitor",
    price: 34.99,
    inStock: true,
  },
  {
    id: "acc-17",
    name: "Bandeja para gestión de cables",
    brand: "Rain Design",
    type: "cable",
    compatibleDevices: ["dev-3"],
    parentAccessoryId: "acc-16", // Se acopla al adaptador VESA
    imageUrl: "/aluminum-laptop-stand.jpg",
    description: "Bandeja para organizar cables en el brazo del monitor",
    price: 24.99,
    inStock: true,
  },
]

export const mockFeatures: Feature[] = [
  {
    id: "feat-1",
    name: "Carga rápida",
    description: "Tecnología de carga acelerada",
    category: "charging",
    relatedAccessoryIds: ["acc-2", "acc-3", "acc-7", "acc-8"],
  },
  {
    id: "feat-2",
    name: "Protección",
    description: "Accesorios de protección física",
    category: "protection",
    relatedAccessoryIds: ["acc-1", "acc-4"],
  },
  {
    id: "feat-3",
    name: "Ergonomía",
    description: "Mejora la postura y comodidad",
    category: "ergonomics",
    relatedAccessoryIds: ["acc-5"],
  },
]

/**
 * Construye la jerarquía (árbol) a partir de los mocks.
 * Devuelve un arreglo de nodos raíz (cada dispositivo con sus accesorios y características).
 */
export function buildHierarchy() {
  const nodes: any[] = []

  // Agregar dispositivos como nodos raíz (nivel 0)
  mockDevices.forEach((device) => {
    nodes.push({
      id: device.id,
      name: device.name,
      type: "device",
      level: 0,
      data: {
        brand: device.brand,
        category: device.category,
        model: device.model,
        imageUrl: device.imageUrl,
        description: device.description,
        releaseYear: device.releaseYear,
      },
      children: [],
    })
  })

  // Agregar accesorios y construir jerarquía de profundidad ilimitada
  const accessoryNodesMap = new Map<string, any>()

  mockAccessories.forEach((accessory) => {
    const node = {
      id: accessory.id,
      name: accessory.name,
      type: "accessory",
      level: 1, // Se actualizará según profundidad
      parent_id: accessory.parentAccessoryId || undefined,
      data: {
        brand: accessory.brand,
        accessoryType: accessory.type,
        compatibleDevices: accessory.compatibleDevices,
        imageUrl: accessory.imageUrl,
        description: accessory.description,
        price: accessory.price,
        inStock: accessory.inStock,
        alternativeIds: accessory.alternativeIds,
      },
      children: [],
    }
    accessoryNodesMap.set(accessory.id, node)
  })

  // Construir relaciones jerárquicas de profundidad variable
  mockAccessories.forEach((accessory) => {
    const node = accessoryNodesMap.get(accessory.id)!

    if (accessory.parentAccessoryId) {
      // Es un sub-accesorio de otro accesorio
      const parentNode = accessoryNodesMap.get(accessory.parentAccessoryId)
      if (parentNode) {
        parentNode.children.push(node)
        // Calcular nivel basado en el padre
        node.level = parentNode.level + 1
      }
    } else {
      // Es un accesorio directo de dispositivos
      accessory.compatibleDevices.forEach((deviceId) => {
        const deviceNode = nodes.find((n) => n.id === deviceId)
        if (deviceNode) {
          deviceNode.children.push(node)
          node.level = 1
        }
      })
    }
  })

  // Agregar características como hojas del árbol
  mockFeatures.forEach((feature) => {
    const featureNode = {
      id: feature.id,
      name: feature.name,
      type: "feature",
      level: 2, // Se actualizará según profundidad
      data: {
        description: feature.description,
        category: feature.category,
        relatedAccessoryIds: feature.relatedAccessoryIds,
      },
      children: [],
    }

    // Vincular características con sus accesorios relacionados
    feature.relatedAccessoryIds.forEach((accId) => {
      const accNode = accessoryNodesMap.get(accId)
      if (accNode) {
        const featureClone = { ...featureNode, level: accNode.level + 1 }
        accNode.children.push(featureClone)
      }
    })
  })

  return nodes
}

export function findNodeInHierarchy(hierarchy: any[], nodeId: string): any | null {
  for (const node of hierarchy) {
    if (node.id === nodeId) {
      return node
    }
    if (node.children && node.children.length > 0) {
      const found = findNodeInHierarchy(node.children, nodeId)
      if (found) return found
    }
  }
  return null
}

export function getAllNodesFlat(hierarchy: any[]): any[] {
  const result: any[] = []

  function traverse(nodes: any[]) {
    for (const node of nodes) {
      result.push(node)
      if (node.children && node.children.length > 0) {
        traverse(node.children)
      }
    }
  }

  traverse(hierarchy)
  return result
}

export function getNodeDepth(hierarchy: any[], nodeId: string): number {
  function findDepth(nodes: any[], depth: number): number {
    for (const node of nodes) {
      if (node.id === nodeId) {
        return depth
      }
      if (node.children && node.children.length > 0) {
        const childDepth = findDepth(node.children, depth + 1)
        if
