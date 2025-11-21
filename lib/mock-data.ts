import type { Device, Accessory, Feature } from "./types"

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
    description: "Android flagship con S-Pen y cámara de 200MP",
    releaseYear: 2024,
  },
  {
    id: "dev-3",
    name: 'MacBook Pro 16"',
    brand: "Apple",
    category: "laptops",
    model: "M3 Max",
    imageUrl: "/macbook-pro.png",
    description: "Laptop profesional con chip M3 Max",
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
    name: "MagSafe Case",
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
    name: "USB-C Cable 2m",
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
    name: "67W GaN Charger",
    brand: "Anker",
    type: "charger",
    compatibleDevices: ["dev-1", "dev-2", "dev-3"],
    imageUrl: "/usb-c-fast-charger.jpg",
    description: "Cargador compacto de nitruro de galio",
    price: 49.99,
    inStock: false,
    alternativeIds: ["acc-8"],
  },
  {
    id: "acc-4",
    name: "Silicone Case",
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
    name: "Laptop Stand",
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
    name: "FE 24-70mm Lens",
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
    name: "USB-C Cable 1.5m",
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
    name: "65W Dual Port Charger",
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
    name: "MagSafe Wallet",
    brand: "Apple",
    type: "case",
    compatibleDevices: ["dev-1"],
    parentAccessoryId: "acc-1", // Attaches to MagSafe Case
    imageUrl: "/magsafe-wallet.jpg",
    description: "Billetera magnética que se adhiere a la funda MagSafe",
    price: 39.99,
    inStock: true,
  },
  {
    id: "acc-11",
    name: "RFID Card Holder",
    brand: "Apple",
    type: "case",
    compatibleDevices: ["dev-1"],
    parentAccessoryId: "acc-9", // Attaches to MagSafe Wallet
    imageUrl: "/magsafe-wallet.jpg",
    description: "Porta tarjetas RFID que se inserta en la billetera",
    price: 19.99,
    inStock: true,
  },
  {
    id: "acc-12",
    name: "AirTag Holder Clip",
    brand: "Belkin",
    type: "case",
    compatibleDevices: ["dev-1"],
    parentAccessoryId: "acc-11", // Attaches to Card Holder
    imageUrl: "/magsafe-wallet.jpg",
    description: "Clip para AirTag que se adhiere al porta tarjetas",
    price: 14.99,
    inStock: true,
  },
  {
    id: "acc-13",
    name: "Leather Keychain",
    brand: "Apple",
    type: "case",
    compatibleDevices: ["dev-1"],
    parentAccessoryId: "acc-12", // Attaches to AirTag Holder
    imageUrl: "/magsafe-wallet.jpg",
    description: "Llavero de cuero que se engancha al clip de AirTag",
    price: 9.99,
    inStock: true,
  },
  {
    id: "acc-10",
    name: "Cable Organizer",
    brand: "Anker",
    type: "cable",
    compatibleDevices: ["dev-1", "dev-2", "dev-3"],
    parentAccessoryId: "acc-2", // Attaches to USB-C Cable
    imageUrl: "/cable-organizer.png",
    description: "Organizador de cables para mantener ordenado",
    price: 9.99,
    inStock: true,
  },
  {
    id: "acc-14",
    name: "Cable Clips 6-Pack",
    brand: "Anker",
    type: "cable",
    compatibleDevices: ["dev-1", "dev-2", "dev-3"],
    parentAccessoryId: "acc-10", // Attaches to Cable Organizer
    imageUrl: "/cable-organizer.png",
    description: "Pack de clips adhesivos para fijar cables organizados",
    price: 6.99,
    inStock: true,
  },
  {
    id: "acc-15",
    name: "Adhesive Strip Refills",
    brand: "Generic",
    type: "cable",
    compatibleDevices: ["dev-1", "dev-2", "dev-3"],
    parentAccessoryId: "acc-14", // Attaches to Cable Clips
    imageUrl: "/cable-organizer.png",
    description: "Tiras adhesivas de repuesto para los clips",
    price: 3.99,
    inStock: true,
  },
  {
    id: "acc-16",
    name: "VESA Monitor Arm Adapter",
    brand: "Rain Design",
    type: "mount",
    compatibleDevices: ["dev-3"],
    parentAccessoryId: "acc-5", // Attaches to Laptop Stand
    imageUrl: "/aluminum-laptop-stand.jpg",
    description: "Adaptador VESA para montar el stand en brazo de monitor",
    price: 34.99,
    inStock: true,
  },
  {
    id: "acc-17",
    name: "Cable Management Tray",
    brand: "Rain Design",
    type: "cable",
    compatibleDevices: ["dev-3"],
    parentAccessoryId: "acc-16", // Attaches to Monitor Arm Adapter
    imageUrl: "/aluminum-laptop-stand.jpg",
    description: "Bandeja para organizar cables en el brazo del monitor",
    price: 24.99,
    inStock: true,
  },
]

export const mockFeatures: Feature[] = [
  {
    id: "feat-1",
    name: "Carga Rápida",
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
        if (childDepth !== -1) return childDepth
      }
    }
    return -1
  }

  return findDepth(hierarchy, 0)
}
