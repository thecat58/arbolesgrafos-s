// Cliente API para comunicarse con las API routes de Next.js
// (que simulan el comportamiento del backend Python)

export interface ApiNode {
  id: string
  name: string
  type: "device" | "accessory" | "feature"
  level: number
  parent_id?: string
  data: Record<string, any>
  children?: ApiNode[]
}

export interface GraphData {
  nodes: Array<{
    id: string
    name: string
    type: string
    level: number
    data: Record<string, any>
    x: number
    y: number
  }>
  edges: Array<{
    source: string
    target: string
  }>
  center: { x: number; y: number }
  levels: number
}

export class ApiClient {
  private baseUrl: string

  constructor(baseUrl = "") {
    this.baseUrl = baseUrl
  }

  async getCatalog() {
    const response = await fetch(`${this.baseUrl}/api/catalog`)
    if (!response.ok) throw new Error("Failed to fetch catalog")
    return response.json()
  }

  async getTree(nodeId: string): Promise<ApiNode> {
    const response = await fetch(`${this.baseUrl}/api/tree/${nodeId}`)
    if (!response.ok) throw new Error(`Failed to fetch tree for ${nodeId}`)
    return response.json()
  }

  async getNode(nodeId: string): Promise<ApiNode> {
    const response = await fetch(`${this.baseUrl}/api/node/${nodeId}`)
    if (!response.ok) throw new Error(`Failed to fetch node ${nodeId}`)
    return response.json()
  }

  async getChildren(nodeId: string) {
    const response = await fetch(`${this.baseUrl}/api/children/${nodeId}`)
    if (!response.ok) throw new Error(`Failed to fetch children for ${nodeId}`)
    return response.json()
  }

  async getGraph(nodeId: string, radius = 300): Promise<GraphData> {
    const response = await fetch(`${this.baseUrl}/api/graph/${nodeId}?radius=${radius}`)
    if (!response.ok) throw new Error(`Failed to fetch graph for ${nodeId}`)
    return response.json()
  }

  async trackNavigation(data: any) {
    const response = await fetch(`${this.baseUrl}/api/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error("Failed to track navigation")
    return response.json()
  }
}

export const apiClient = new ApiClient()
