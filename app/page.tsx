"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ContextualListView } from "@/components/contextual-list-view"
import { ContextualTreeView } from "@/components/contextual-tree-view"
import { ContextualGraphView } from "@/components/contextual-graph-view"
import { ContextualProductCard } from "@/components/contextual-product-card"
import { PathBreadcrumb } from "@/components/path-breadcrumb"
import { ContextualRecommendations } from "@/components/contextual-recommendations"
import type { NavigationPath, ContextualNode } from "@/lib/types"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Page() {
  const [activeView, setActiveView] = useState<"list" | "tree" | "graph">("list")
  const [navigationPath, setNavigationPath] = useState<NavigationPath>({
    nodes: [],
    rootDeviceId: "",
  })
  const [selectedNode, setSelectedNode] = useState<ContextualNode | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleNodeSelect = async (node: ContextualNode) => {
    console.log("[v0] Node selected:", node.id, node.name)
    setIsLoading(true)
    setError(null)

    try {
      // Agregar el nodo al camino de navegación
      const newPath: NavigationPath = {
        nodes: [...navigationPath.nodes, node],
        rootDeviceId: navigationPath.nodes.length === 0 ? node.id : navigationPath.rootDeviceId,
      }

      setNavigationPath(newPath)
      setSelectedNode(node)

      // Registrar la navegación para aprendizaje
      await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "node_select",
          nodeId: node.id,
          path: newPath,
          view: activeView,
          timestamp: Date.now(),
        }),
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al seleccionar nodo")
      console.error("[v0] Error selecting node:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoBack = () => {
    if (navigationPath.nodes.length === 0) return

    const newNodes = navigationPath.nodes.slice(0, -1)
    const newPath: NavigationPath = {
      nodes: newNodes,
      rootDeviceId: newNodes.length === 0 ? "" : navigationPath.rootDeviceId,
    }

    setNavigationPath(newPath)
    setSelectedNode(newNodes.length > 0 ? newNodes[newNodes.length - 1] : null)
  }

  const handleReset = () => {
    setNavigationPath({ nodes: [], rootDeviceId: "" })
    setSelectedNode(null)
  }

  const currentLevel = navigationPath.nodes.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400 bg-clip-text text-transparent">
                TechExplorer Pro
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Navegación contextual inteligente • Profundidad ilimitada
              </p>
            </div>
            <div className="flex items-center gap-3">
              {navigationPath.nodes.length > 0 && (
                <>
                  <Button variant="outline" size="sm" onClick={handleGoBack} className="gap-2 bg-transparent">
                    <ArrowLeft className="w-4 h-4" />
                    Atrás
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleReset}>
                    Reiniciar
                  </Button>
                </>
              )}
              {isLoading && (
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Cargando...
                </div>
              )}
            </div>
          </div>

          {/* Breadcrumb Path */}
          {navigationPath.nodes.length > 0 && <PathBreadcrumb path={navigationPath} onNavigateToLevel={handleReset} />}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Context Info */}
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center font-bold text-lg">
              {currentLevel}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                {currentLevel === 0 && "Selecciona un dispositivo para comenzar"}
                {currentLevel === 1 && `Accesorios compatibles con ${navigationPath.nodes[0]?.name}`}
                {currentLevel >= 2 && `Sub-accesorios compatibles con ${navigationPath.nodes[currentLevel - 1]?.name}`}
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                {currentLevel === 0 &&
                  "La navegación es contextual: cada selección filtra automáticamente las opciones compatibles."}
                {currentLevel > 0 &&
                  `Solo se muestran elementos compatibles con tu selección actual. Dispositivo raíz: ${navigationPath.rootDeviceId}`}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Views */}
          <div className="lg:col-span-3 space-y-6">
            <Tabs value={activeView} onValueChange={(v) => setActiveView(v as typeof activeView)} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6 bg-slate-100 dark:bg-slate-800">
                <TabsTrigger
                  value="list"
                  className="gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="8" x2="21" y1="6" y2="6" />
                    <line x1="8" x2="21" y1="12" y2="12" />
                    <line x1="8" x2="21" y1="18" y2="18" />
                    <line x1="3" x2="3.01" y1="6" y2="6" />
                    <line x1="3" x2="3.01" y1="12" y2="12" />
                    <line x1="3" x2="3.01" y1="18" y2="18" />
                  </svg>
                  Lista Contextual
                </TabsTrigger>
                <TabsTrigger
                  value="tree"
                  className="gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 2v6" />
                    <path d="m15 9-3 3-3-3" />
                    <path d="M8 11v5" />
                    <path d="M16 11v5" />
                  </svg>
                  Árbol del Camino
                </TabsTrigger>
                <TabsTrigger
                  value="graph"
                  className="gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="2" />
                    <path d="M12 2v4" />
                    <path d="M12 18v4" />
                  </svg>
                  Grafo Contextual
                </TabsTrigger>
              </TabsList>

              <TabsContent value="list" className="mt-0">
                <ContextualListView path={navigationPath} onNodeSelect={handleNodeSelect} />
              </TabsContent>

              <TabsContent value="tree" className="mt-0">
                <ContextualTreeView path={navigationPath} onNodeSelect={handleNodeSelect} />
              </TabsContent>

              <TabsContent value="graph" className="mt-0">
                <ContextualGraphView path={navigationPath} onNodeSelect={handleNodeSelect} />
              </TabsContent>
            </Tabs>

            {/* Smart Product Card */}
            {selectedNode && (
              <ContextualProductCard
                node={selectedNode}
                path={navigationPath}
                onClose={() => setSelectedNode(null)}
                onNavigate={handleNodeSelect}
              />
            )}
          </div>

          {/* Recommendations Sidebar */}
          <div className="lg:col-span-1">
            <ContextualRecommendations path={navigationPath} onNodeSelect={handleNodeSelect} />
          </div>
        </div>
      </main>
    </div>
  )
}
