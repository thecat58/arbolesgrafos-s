export type NodeType = "device" | "accessory" | "sub-accessory" | "feature"
export type DeviceCategory = "smartphones" | "tablets" | "laptops" | "cameras" | "audio" | "wearables"
export type AccessoryType =
  | "case"
  | "charger"
  | "cable"
  | "adapter"
  | "mount"
  | "screen-protector"
  | "battery"
  | "memory"
  | "lens"
  | "stand"

export interface NavigationPath {
  nodes: ContextualNode[] // [Device, Accessory, Sub-accessory, ...]
  rootDeviceId: string
}

export interface ContextualNode {
  id: string
  name: string
  type: NodeType
  level: number
  brand: string
  imageUrl: string
  description: string
  price?: number
  inStock?: boolean
  compatibleWith: string[] // IDs de dispositivos o accesorios padre
  // Data específica según tipo
  data: {
    category?: DeviceCategory
    accessoryType?: AccessoryType
    model?: string
    releaseYear?: number
    alternativeIds?: string[]
    features?: string[]
  }
}

export interface CompatibilityCheck {
  isCompatible: boolean
  reason: string
  compatibleWithNodeIds: string[]
}

export interface ContextualChildren {
  children: ContextualNode[]
  totalCount: number
  filteredByCompatibility: number
}

export interface UserNavigation {
  timestamp: number
  view: "list" | "tree" | "graph"
  path: NavigationPath
  action: "select" | "back" | "filter"
}

export interface Recommendation {
  id: string
  type: "kit" | "combination" | "equivalent" | "suggested-path"
  items: ContextualNode[]
  reason: string
  confidence: number
  basedOnPath: string[] // IDs del camino que generó esta recomendación
}

export interface SmartCardQuestion {
  question: string
  answer: string
}
