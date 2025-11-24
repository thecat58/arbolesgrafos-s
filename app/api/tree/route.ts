import { NextResponse } from "next/server"
import { mockDevices, mockAccessories, mockFeatures } from "@/lib/mock-data"
import type { TreeNode } from "@/lib/types"

// API endpoint that simulates Python backend tree construction
export async function GET() {
  // Recursive function to build accessory subtree (unlimited depth)
  const buildAccessorySubtree = (accessoryId: string, depth = 0): TreeNode | null => {
    const accessory = mockAccessories.find((acc) => acc.id === accessoryId)
    if (!accessory) return null

    const childAccessories = mockAccessories.filter((acc) => acc.parentAccessoryId === accessoryId)
    const relatedFeatures = mockFeatures.filter((feat) => feat.relatedAccessoryIds.includes(accessoryId))

    const childNodes: TreeNode[] = [
      ...(childAccessories
        .map((childAcc) => buildAccessorySubtree(childAcc.id, depth + 1))
        .filter(Boolean) as TreeNode[]),
      ...relatedFeatures.map((feature) => ({
        id: feature.id,
        label: feature.name,
        type: "feature" as const,
        children: [],
        data: feature,
        depth: depth + 1,
      })),
    ]

    return {
      id: accessory.id,
      label: accessory.name,
      type: depth === 0 ? "accessory" : "sub-accessory",
      children: childNodes,
      data: accessory,
      depth,
    }
  }

  const tree: TreeNode[] = mockDevices.map((device) => {
    const topLevelAccessories = mockAccessories.filter(
      (acc) => acc.compatibleDevices.includes(device.id) && !acc.parentAccessoryId,
    )

    const accessoryNodes: TreeNode[] = topLevelAccessories
      .map((accessory) => buildAccessorySubtree(accessory.id, 0))
      .filter(Boolean) as TreeNode[]

    return {
      id: device.id,
      label: device.name,
      type: "device" as const,
      children: accessoryNodes,
      data: device,
      depth: 0,
    }
  })

  // Calculate max depth
  const getMaxDepth = (node: TreeNode): number => {
    if (!node.children || node.children.length === 0) return node.depth
    return Math.max(...node.children.map(getMaxDepth))
  }

  const maxDepth = Math.max(...tree.map(getMaxDepth))

  return NextResponse.json({
    tree,
    metadata: {
      max_depth: maxDepth,
      total_nodes: tree.length,
      supports_unlimited_depth: true,
    },
  })
}
