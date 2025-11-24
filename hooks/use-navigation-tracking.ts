"use client"

import { useState, useCallback } from "react"
import type { UserNavigation, Recommendation } from "@/lib/types"
import { mockDevices, mockAccessories, mockFeatures } from "@/lib/mock-data"

export function useNavigationTracking() {
  const [navigationHistory, setNavigationHistory] = useState<UserNavigation[]>([])

  const trackNavigation = useCallback((navigation: UserNavigation) => {
    setNavigationHistory((prev) => [...prev, navigation])
  }, [])

  const getRecommendations = useCallback((): Recommendation[] => {
    if (navigationHistory.length < 3) {
      return []
    }

    const recommendations: Recommendation[] = []

    // 1. Analyze view preferences
    const viewCounts = navigationHistory.reduce(
      (acc, nav) => {
        acc[nav.view] = (acc[nav.view] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    // 2. Track visited products
    const visitedNodes = navigationHistory.filter((nav) => nav.nodeId).map((nav) => nav.nodeId as string)

    const visitedDevices = visitedNodes.filter((id) => id.startsWith("dev-"))
    const visitedAccessories = visitedNodes.filter((id) => id.startsWith("acc-"))

    // 3. Generate personalized recommendations based on view preference
    if (viewCounts.graph > viewCounts.list && viewCounts.graph > viewCounts.tree) {
      recommendations.push({
        id: "rec-visual",
        type: "personalized",
        items: ["acc-1", "acc-2", "acc-3"],
        reason: "Te gusta explorar visualmente. Estos accesorios tienen múltiples conexiones interesantes",
        confidence: 0.85,
      })
    }

    // 4. Kit recommendations based on visited devices
    if (visitedDevices.length > 0) {
      const lastDevice = mockDevices.find((d) => d.id === visitedDevices[visitedDevices.length - 1])
      if (lastDevice) {
        const compatibleAccessories = mockAccessories
          .filter((acc) => acc.compatibleDevices.includes(lastDevice.id) && acc.inStock)
          .slice(0, 3)

        if (compatibleAccessories.length >= 2) {
          recommendations.push({
            id: "rec-kit",
            type: "kit",
            items: compatibleAccessories.map((a) => a.id),
            reason: `Kit completo para tu ${lastDevice.name}`,
            confidence: 0.92,
          })
        }
      }
    }

    // 5. Combination recommendations (frequently viewed together)
    const nodeFrequency = visitedNodes.reduce(
      (acc, nodeId) => {
        acc[nodeId] = (acc[nodeId] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const frequentNodes = Object.entries(nodeFrequency)
      .filter(([_, count]) => count >= 2)
      .map(([nodeId]) => nodeId)

    if (frequentNodes.length >= 2) {
      recommendations.push({
        id: "rec-combo",
        type: "combination",
        items: frequentNodes.slice(0, 3),
        reason: "Productos que has revisado múltiples veces",
        confidence: 0.78,
      })
    }

    // 6. Equivalent recommendations (alternatives for out-of-stock items)
    const viewedOutOfStock = visitedAccessories
      .map((id) => mockAccessories.find((a) => a.id === id))
      .filter((acc) => acc && !acc.inStock)

    if (viewedOutOfStock.length > 0) {
      const outOfStockAcc = viewedOutOfStock[0]
      if (outOfStockAcc && outOfStockAcc.alternativeIds) {
        recommendations.push({
          id: "rec-equiv",
          type: "equivalent",
          items: outOfStockAcc.alternativeIds,
          reason: `Alternativas disponibles para ${outOfStockAcc.name}`,
          confidence: 0.88,
        })
      }
    }

    // 7. Category-based recommendations (explore similar categories)
    const usedFilters = navigationHistory
      .filter((nav) => nav.filters?.category && nav.filters.category !== "all")
      .map((nav) => nav.filters?.category)

    if (usedFilters.length > 0) {
      const mostUsedCategory = usedFilters[usedFilters.length - 1]
      const categoryDevices = mockDevices.filter((d) => d.category === mostUsedCategory).slice(0, 3)

      if (categoryDevices.length > 0) {
        recommendations.push({
          id: "rec-category",
          type: "personalized",
          items: categoryDevices.map((d) => d.id),
          reason: `Más productos en ${mostUsedCategory}`,
          confidence: 0.72,
        })
      }
    }

    // 8. Brand loyalty recommendations
    const brandCounts = navigationHistory
      .filter((nav) => nav.filters?.brand && nav.filters.brand !== "all")
      .reduce(
        (acc, nav) => {
          const brand = nav.filters?.brand
          if (brand) acc[brand] = (acc[brand] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      )

    const preferredBrand = Object.entries(brandCounts).sort(([, a], [, b]) => b - a)[0]?.[0]

    if (preferredBrand) {
      const brandAccessories = mockAccessories.filter((acc) => acc.brand === preferredBrand && acc.inStock).slice(0, 3)

      if (brandAccessories.length > 0) {
        recommendations.push({
          id: "rec-brand",
          type: "personalized",
          items: brandAccessories.map((a) => a.id),
          reason: `Te gusta ${preferredBrand}. Descubre más de esta marca`,
          confidence: 0.8,
        })
      }
    }

    // 9. Feature-based recommendations
    const viewedFeatures = visitedNodes
      .filter((id) => id.startsWith("feat-"))
      .map((id) => mockFeatures.find((f) => f.id === id))
      .filter(Boolean)

    if (viewedFeatures.length > 0) {
      const feature = viewedFeatures[0]
      if (feature) {
        const relatedAccessories = mockAccessories
          .filter((acc) => feature.relatedAccessoryIds.includes(acc.id))
          .slice(0, 3)

        if (relatedAccessories.length > 0) {
          recommendations.push({
            id: "rec-feature",
            type: "personalized",
            items: relatedAccessories.map((a) => a.id),
            reason: `Accesorios con ${feature.name}`,
            confidence: 0.76,
          })
        }
      }
    }

    // Sort by confidence and return top recommendations
    return recommendations.sort((a, b) => b.confidence - a.confidence).slice(0, 5)
  }, [navigationHistory])

  const getNavigationInsights = useCallback(() => {
    return {
      totalInteractions: navigationHistory.length,
      viewDistribution: navigationHistory.reduce(
        (acc, nav) => {
          acc[nav.view] = (acc[nav.view] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      ),
      uniqueNodesVisited: new Set(navigationHistory.filter((n) => n.nodeId).map((n) => n.nodeId)).size,
    }
  }, [navigationHistory])

  return {
    trackNavigation,
    getRecommendations,
    navigationHistory,
    getNavigationInsights,
  }
}
