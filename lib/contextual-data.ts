import type { ContextualNode, NavigationPath, CompatibilityCheck, ContextualChildren } from "./types"

// Base de datos de nodos contextuales
const contextualNodes: ContextualNode[] = [
  // DISPOSITIVOS (Nivel 0 - siempre el inicio)
  {
    id: "dev-1",
    name: "iPhone 15 Pro",
    type: "device",
    level: 0,
    brand: "Apple",
    imageUrl: "/iphone-15-pro.png",
    description: "Smartphone premium con chip A17 Pro y cámara avanzada de 48MP",
    compatibleWith: [],
    data: {
      category: "smartphones",
      model: "A2848",
      releaseYear: 2023,
      features: ["5G", "MagSafe", "USB-C", "ProMotion 120Hz"],
    },
  },
  {
    id: "dev-2",
    name: "Galaxy S24 Ultra",
    type: "device",
    level: 0,
    brand: "Samsung",
    imageUrl: "/samsung-galaxy-s24-ultra.png",
    description: "Android flagship con S-Pen integrado y cámara de 200MP",
    compatibleWith: [],
    data: {
      category: "smartphones",
      model: "SM-S928",
      releaseYear: 2024,
      features: ["5G", "S-Pen", "USB-C", "Snapdragon 8 Gen 3"],
    },
  },
  {
    id: "dev-3",
    name: 'MacBook Pro 16"',
    type: "device",
    level: 0,
    brand: "Apple",
    imageUrl: "/macbook-pro.png",
    description: "Laptop profesional con chip M3 Max y pantalla Liquid Retina XDR",
    compatibleWith: [],
    data: {
      category: "laptops",
      model: "M3 Max",
      releaseYear: 2023,
      features: ["Apple Silicon", "Thunderbolt 4", "ProMotion"],
    },
  },
  {
    id: "dev-4",
    name: "Sony A7 IV",
    type: "device",
    level: 0,
    brand: "Sony",
    imageUrl: "/sony-mirrorless-camera.jpg",
    description: "Cámara mirrorless full-frame de 33MP con video 4K 60fps",
    compatibleWith: [],
    data: {
      category: "cameras",
      model: "ILCE-7M4",
      releaseYear: 2021,
      features: ["33MP Sensor", "4K 60p", "E-Mount"],
    },
  },

  // ACCESORIOS NIVEL 1 (Compatible con dispositivos)
  {
    id: "acc-1",
    name: "MagSafe Case",
    type: "accessory",
    level: 1,
    brand: "Apple",
    imageUrl: "/iphone-magsafe-case.jpg",
    description: "Funda protectora con soporte magnético MagSafe integrado",
    price: 59.99,
    inStock: true,
    compatibleWith: ["dev-1"],
    data: {
      accessoryType: "case",
      features: ["MagSafe", "Protección contra caídas", "Botones de aluminio"],
    },
  },
  {
    id: "acc-2",
    name: "Silicone Case",
    type: "accessory",
    level: 1,
    brand: "Samsung",
    imageUrl: "/samsung-phone-case.jpg",
    description: "Funda de silicona premium con interior de microfibra",
    price: 39.99,
    inStock: true,
    compatibleWith: ["dev-2"],
    data: {
      accessoryType: "case",
      features: ["Agarre suave", "Protección", "S-Pen compatible"],
    },
  },
  {
    id: "acc-3",
    name: "USB-C Cable 2m",
    type: "accessory",
    level: 1,
    brand: "Anker",
    imageUrl: "/usb-c-cable.jpg",
    description: "Cable de carga rápida certificado USB-C con tecnología PowerIQ",
    price: 19.99,
    inStock: true,
    compatibleWith: ["dev-1", "dev-2", "dev-3"],
    data: {
      accessoryType: "cable",
      features: ["100W PD", "Trenzado de nylon", "Certificado"],
      alternativeIds: ["acc-8"],
    },
  },
  {
    id: "acc-4",
    name: "67W GaN Charger",
    type: "accessory",
    level: 1,
    brand: "Anker",
    imageUrl: "/usb-c-fast-charger.jpg",
    description: "Cargador compacto de nitruro de galio con puerto dual",
    price: 49.99,
    inStock: false,
    compatibleWith: ["dev-1", "dev-2", "dev-3"],
    data: {
      accessoryType: "charger",
      features: ["GaN Technology", "Dual Port", "Foldable Plug"],
      alternativeIds: ["acc-9"],
    },
  },
  {
    id: "acc-5",
    name: "Laptop Stand",
    type: "accessory",
    level: 1,
    brand: "Rain Design",
    imageUrl: "/aluminum-laptop-stand.jpg",
    description: "Soporte de aluminio ergonómico con ángulo ajustable",
    price: 79.99,
    inStock: true,
    compatibleWith: ["dev-3"],
    data: {
      accessoryType: "stand",
      features: ["Aluminio anodizado", "Ergonómico", "Cable management"],
    },
  },
  {
    id: "acc-6",
    name: "FE 24-70mm f/2.8 GM Lens",
    type: "accessory",
    level: 1,
    brand: "Sony",
    imageUrl: "/camera-lens-sony.jpg",
    description: "Lente zoom estándar profesional de apertura constante",
    price: 899.99,
    inStock: true,
    compatibleWith: ["dev-4"],
    data: {
      accessoryType: "lens",
      features: ["G Master", "f/2.8", "Weather Sealed"],
    },
  },
  {
    id: "acc-7",
    name: "Screen Protector Glass",
    type: "accessory",
    level: 1,
    brand: "Belkin",
    imageUrl: "/iphone-magsafe-case.jpg",
    description: "Protector de pantalla de vidrio templado con aplicador incluido",
    price: 29.99,
    inStock: true,
    compatibleWith: ["dev-1"],
    data: {
      accessoryType: "screen-protector",
      features: ["Vidrio templado 9H", "Anti-huellas", "Aplicador fácil"],
    },
  },
  {
    id: "acc-8",
    name: "USB-C Cable 1.5m Premium",
    type: "accessory",
    level: 1,
    brand: "Belkin",
    imageUrl: "/premium-usb-c-cable.jpg",
    description: "Cable reforzado con certificación MFi y conectores metálicos",
    price: 24.99,
    inStock: true,
    compatibleWith: ["dev-1", "dev-2", "dev-3"],
    data: {
      accessoryType: "cable",
      features: ["MFi Certified", "Kevlar Reinforced", "240W Support"],
      alternativeIds: ["acc-3"],
    },
  },
  {
    id: "acc-9",
    name: "65W Dual Port Charger",
    type: "accessory",
    level: 1,
    brand: "Ugreen",
    imageUrl: "/dual-port-charger.jpg",
    description: "Cargador con dos puertos USB-C y distribución inteligente de energía",
    price: 44.99,
    inStock: true,
    compatibleWith: ["dev-1", "dev-2", "dev-3"],
    data: {
      accessoryType: "charger",
      features: ["Dual USB-C", "Power Distribution", "Compact"],
      alternativeIds: ["acc-4"],
    },
  },

  // ACCESORIOS NIVEL 2 (Compatible con accesorios nivel 1)
  {
    id: "sub-acc-1",
    name: "MagSafe Wallet",
    type: "sub-accessory",
    level: 2,
    brand: "Apple",
    imageUrl: "/magsafe-wallet.jpg",
    description: "Billetera magnética con soporte para 3 tarjetas y Find My integrado",
    price: 59.99,
    inStock: true,
    compatibleWith: ["acc-1"], // Solo compatible con MagSafe Case
    data: {
      accessoryType: "case",
      features: ["Find My", "3 Card Slots", "RFID Protection"],
    },
  },
  {
    id: "sub-acc-2",
    name: "MagSafe Battery Pack",
    type: "sub-accessory",
    level: 2,
    brand: "Apple",
    imageUrl: "/magsafe-wallet.jpg",
    description: "Batería externa magnética de 5000mAh con carga inalámbrica",
    price: 99.99,
    inStock: true,
    compatibleWith: ["acc-1"], // Solo compatible con MagSafe Case
    data: {
      accessoryType: "battery",
      features: ["5000mAh", "15W Wireless", "Pass-through charging"],
    },
  },
  {
    id: "sub-acc-3",
    name: "Cable Organizer Clips",
    type: "sub-accessory",
    level: 2,
    brand: "Anker",
    imageUrl: "/cable-organizer.png",
    description: "Pack de clips organizadores adhesivos para gestión de cables",
    price: 9.99,
    inStock: true,
    compatibleWith: ["acc-3", "acc-8"], // Compatible con ambos cables
    data: {
      accessoryType: "cable",
      features: ["6-Pack", "Adhesivo 3M", "Silicona flexible"],
    },
  },
  {
    id: "sub-acc-4",
    name: "Case Lanyard Strap",
    type: "sub-accessory",
    level: 2,
    brand: "Generic",
    imageUrl: "/samsung-phone-case.jpg",
    description: "Correa ajustable para llevar el teléfono colgado",
    price: 12.99,
    inStock: true,
    compatibleWith: ["acc-2"], // Compatible con Samsung case
    data: {
      accessoryType: "case",
      features: ["Ajustable", "Nylon trenzado", "Mosquetón metálico"],
    },
  },
  {
    id: "sub-acc-5",
    name: "VESA Monitor Arm Adapter",
    type: "sub-accessory",
    level: 2,
    brand: "Rain Design",
    imageUrl: "/aluminum-laptop-stand.jpg",
    description: "Adaptador VESA para montar el stand en brazo de monitor",
    price: 34.99,
    inStock: true,
    compatibleWith: ["acc-5"], // Compatible con Laptop Stand
    data: {
      accessoryType: "mount",
      features: ["VESA 75x75", "VESA 100x100", "Aluminio"],
    },
  },
  {
    id: "sub-acc-6",
    name: "Lens Filter ND 6-Stop",
    type: "sub-accessory",
    level: 2,
    brand: "B+W",
    imageUrl: "/camera-lens-sony.jpg",
    description: "Filtro de densidad neutra de 6 pasos para control de exposición",
    price: 129.99,
    inStock: true,
    compatibleWith: ["acc-6"], // Compatible con Sony Lens
    data: {
      accessoryType: "lens",
      features: ["ND 1.8", "Multi-coated", "82mm"],
    },
  },
  {
    id: "sub-acc-7",
    name: "Lens Hood",
    type: "sub-accessory",
    level: 2,
    brand: "Sony",
    imageUrl: "/camera-lens-sony.jpg",
    description: "Parasol de lente para reducir reflejos y protección frontal",
    price: 39.99,
    inStock: true,
    compatibleWith: ["acc-6"], // Compatible con Sony Lens
    data: {
      accessoryType: "lens",
      features: ["Bayonet Mount", "Reversible", "Petal Design"],
    },
  },

  // ACCESORIOS NIVEL 3 (Compatible con accesorios nivel 2)
  {
    id: "sub-sub-acc-1",
    name: "AirTag Holder Clip",
    type: "sub-accessory",
    level: 3,
    brand: "Belkin",
    imageUrl: "/magsafe-wallet.jpg",
    description: "Clip para AirTag que se adhiere al compartimento de tarjetas",
    price: 14.99,
    inStock: true,
    compatibleWith: ["sub-acc-1"], // Compatible con MagSafe Wallet
    data: {
      accessoryType: "case",
      features: ["AirTag Compatible", "Adhesivo seguro", "Bajo perfil"],
    },
  },
  {
    id: "sub-sub-acc-2",
    name: "Wallet Card Sleeves RFID",
    type: "sub-accessory",
    level: 3,
    brand: "Generic",
    imageUrl: "/magsafe-wallet.jpg",
    description: "Pack de fundas protectoras RFID para tarjetas individuales",
    price: 7.99,
    inStock: true,
    compatibleWith: ["sub-acc-1"], // Compatible con MagSafe Wallet
    data: {
      accessoryType: "case",
      features: ["3-Pack", "RFID Blocking", "Ultra-slim"],
    },
  },
  {
    id: "sub-sub-acc-3",
    name: "Cable Tie Wraps",
    type: "sub-accessory",
    level: 3,
    brand: "Velcro",
    imageUrl: "/cable-organizer.png",
    description: "Cintas de velcro reutilizables para agrupar cables organizados",
    price: 5.99,
    inStock: true,
    compatibleWith: ["sub-acc-3"], // Compatible con Cable Organizer
    data: {
      accessoryType: "cable",
      features: ["10-Pack", "Reusable", "Múltiples colores"],
    },
  },
  {
    id: "sub-sub-acc-4",
    name: "Monitor Arm Cable Tray",
    type: "sub-accessory",
    level: 3,
    brand: "Rain Design",
    imageUrl: "/aluminum-laptop-stand.jpg",
    description: "Bandeja para organizar cables en el brazo del monitor",
    price: 24.99,
    inStock: true,
    compatibleWith: ["sub-acc-5"], // Compatible with VESA Adapter
    data: {
      accessoryType: "cable",
      features: ["Clip-on Design", "Aluminio", "15cm Length"],
    },
  },
  {
    id: "sub-sub-acc-5",
    name: "Lens Cap Keeper",
    type: "sub-accessory",
    level: 3,
    brand: "Generic",
    imageUrl: "/camera-lens-sony.jpg",
    description: "Correa de seguridad para evitar perder la tapa del lente",
    price: 4.99,
    inStock: true,
    compatibleWith: ["sub-acc-7"], // Compatible con Lens Hood
    data: {
      accessoryType: "lens",
      features: ["Elástico", "Adhesivo 3M", "Universal"],
    },
  },

  // ACCESORIOS NIVEL 4 (Compatible con accesorios nivel 3)
  {
    id: "level-4-acc-1",
    name: "Mini Leather Keychain",
    type: "sub-accessory",
    level: 4,
    brand: "Apple",
    imageUrl: "/magsafe-wallet.jpg",
    description: "Llavero de cuero premium que se engancha al clip de AirTag",
    price: 9.99,
    inStock: true,
    compatibleWith: ["sub-sub-acc-1"], // Compatible con AirTag Holder
    data: {
      accessoryType: "case",
      features: ["Cuero genuino", "Anilla metálica", "Diseño compacto"],
    },
  },
  {
    id: "level-4-acc-2",
    name: "Cable Label Stickers",
    type: "sub-accessory",
    level: 4,
    brand: "Generic",
    imageUrl: "/cable-organizer.png",
    description: "Etiquetas adhesivas para identificar cables agrupados",
    price: 3.99,
    inStock: true,
    compatibleWith: ["sub-sub-acc-3"], // Compatible con Cable Tie Wraps
    data: {
      accessoryType: "cable",
      features: ["50-Pack", "Waterproof", "Escribibles"],
    },
  },

  // ACCESORIOS NIVEL 5 (Compatible con accesorios nivel 4) - Profundidad máxima en este ejemplo
  {
    id: "level-5-acc-1",
    name: "Keychain Charm Mini",
    type: "sub-accessory",
    level: 5,
    brand: "Generic",
    imageUrl: "/magsafe-wallet.jpg",
    description: "Charm decorativo miniatura para personalizar el llavero",
    price: 2.99,
    inStock: true,
    compatibleWith: ["level-4-acc-1"], // Compatible con Mini Leather Keychain
    data: {
      accessoryType: "case",
      features: ["Enamel", "Múltiples diseños", "Mosquetón incluido"],
    },
  },
]

export function getDevices(): ContextualNode[] {
  return contextualNodes.filter((node) => node.type === "device")
}

export function checkCompatibility(nodeId: string, path: NavigationPath): CompatibilityCheck {
  const node = contextualNodes.find((n) => n.id === nodeId)
  if (!node) {
    return { isCompatible: false, reason: "Nodo no encontrado", compatibleWithNodeIds: [] }
  }

  // Si el camino está vacío, solo los dispositivos son válidos
  if (path.nodes.length === 0) {
    return {
      isCompatible: node.type === "device",
      reason: node.type === "device" ? "Dispositivo raíz válido" : "Debe seleccionar un dispositivo primero",
      compatibleWithNodeIds: [],
    }
  }

  // Obtener el último nodo del camino (padre inmediato)
  const lastNode = path.nodes[path.nodes.length - 1]

  // Verificar si el nodo es compatible con el padre inmediato
  const isCompatibleWithParent = node.compatibleWith.includes(lastNode.id)

  if (!isCompatibleWithParent) {
    return {
      isCompatible: false,
      reason: `No compatible con ${lastNode.name}`,
      compatibleWithNodeIds: node.compatibleWith,
    }
  }

  // Verificar compatibilidad con el dispositivo raíz
  const rootDevice = path.nodes[0]
  const isCompatibleWithRoot =
    node.compatibleWith.includes(rootDevice.id) ||
    path.nodes.some((pathNode) => node.compatibleWith.includes(pathNode.id))

  return {
    isCompatible: true,
    reason: `Compatible con ${lastNode.name}`,
    compatibleWithNodeIds: [lastNode.id, rootDevice.id],
  }
}

export function getContextualChildren(path: NavigationPath): ContextualChildren {
  if (path.nodes.length === 0) {
    // Sin camino, devolver solo dispositivos
    const devices = getDevices()
    return {
      children: devices,
      totalCount: devices.length,
      filteredByCompatibility: 0,
    }
  }

  const lastNode = path.nodes[path.nodes.length - 1]
  const allNodes = contextualNodes

  // Filtrar nodos que son compatibles con el último nodo del camino
  const compatibleChildren = allNodes.filter((node) => {
    return node.compatibleWith.includes(lastNode.id)
  })

  const totalPossibleChildren = allNodes.filter((node) => node.level === lastNode.level + 1).length

  return {
    children: compatibleChildren,
    totalCount: compatibleChildren.length,
    filteredByCompatibility: totalPossibleChildren - compatibleChildren.length,
  }
}

export function getNodeById(nodeId: string): ContextualNode | null {
  return contextualNodes.find((node) => node.id === nodeId) || null
}

export function getAlternatives(nodeId: string): ContextualNode[] {
  const node = getNodeById(nodeId)
  if (!node || !node.data.alternativeIds) return []

  return node.data.alternativeIds.map((altId) => getNodeById(altId)).filter((n): n is ContextualNode => n !== null)
}

export function getPathRecommendations(path: NavigationPath): ContextualNode[] {
  if (path.nodes.length === 0) return []

  const lastNode = path.nodes[path.nodes.length - 1]
  const rootDevice = path.nodes[0]

  const recommendations = contextualNodes.filter((node) => {
    // Don't recommend nodes already in path
    if (path.nodes.some((pathNode) => pathNode.id === node.id)) {
      return false
    }

    // Recommend nodes compatible with last node (direct children)
    if (node.compatibleWith.includes(lastNode.id)) {
      return true
    }

    // Recommend popular accessories for root device not yet explored
    if (node.compatibleWith.includes(rootDevice.id) && node.level <= lastNode.level + 2) {
      return true
    }

    return false
  })

  // Sort by relevance: direct children first, then by level
  recommendations.sort((a, b) => {
    const aDirectChild = a.compatibleWith.includes(lastNode.id)
    const bDirectChild = b.compatibleWith.includes(lastNode.id)

    if (aDirectChild && !bDirectChild) return -1
    if (!aDirectChild && bDirectChild) return 1

    return a.level - b.level
  })

  return recommendations.slice(0, 5) // Limit to 5 recommendations
}

export function generateSmartQuestions(node: ContextualNode, path: NavigationPath) {
  const questions = [
    {
      question: "¿Qué es?",
      answer: `${node.description}. Es un ${node.type === "device" ? "dispositivo" : "accesorio"} de la marca ${node.brand}.`,
    },
    {
      question: "¿Para qué sirve?",
      answer:
        node.type === "device"
          ? `Este dispositivo es ideal para ${node.data.features?.join(", ")}. Lanzado en ${node.data.releaseYear}.`
          : `Este accesorio mejora tu ${path.nodes[0]?.name || "dispositivo"} con ${node.data.features?.join(", ")}.`,
    },
  ]

  if (path.nodes.length > 0) {
    questions.push({
      question: "Compatibilidad con el dispositivo raíz",
      answer: `Compatible con ${path.nodes[0].name}. ${node.compatibleWith.length > 1 ? `También compatible con ${node.compatibleWith.length - 1} dispositivo(s) más.` : ""}`,
    })
  }

  if (node.data.features && node.data.features.length > 0) {
    questions.push({
      question: "Características destacadas",
      answer: node.data.features.join(" • "),
    })
  }

  if (!node.inStock && node.data.alternativeIds) {
    questions.push({
      question: "Alternativas disponibles",
      answer: `Este producto está agotado. Tenemos ${node.data.alternativeIds.length} alternativa(s) disponible(s).`,
    })
  }

  return questions
}
