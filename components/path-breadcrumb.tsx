"use client"

import type { NavigationPath } from "@/lib/types"
import { ChevronRight } from "lucide-react"

interface PathBreadcrumbProps {
  path: NavigationPath
  onNavigateToLevel: (level: number) => void
}

export function PathBreadcrumb({ path, onNavigateToLevel }: PathBreadcrumbProps) {
  return (
    <div className="flex items-center gap-2 mt-3 text-sm overflow-x-auto pb-2">
      {path.nodes.map((node, index) => (
        <div key={node.id} className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => onNavigateToLevel(index)}
            className="px-3 py-1.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
          >
            <span className="w-5 h-5 rounded-full bg-blue-600 dark:bg-blue-500 text-white text-xs flex items-center justify-center font-medium">
              {index}
            </span>
            <span className="font-medium text-slate-900 dark:text-slate-100">{node.name}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">{node.brand}</span>
          </button>
          {index < path.nodes.length - 1 && <ChevronRight className="w-4 h-4 text-slate-400" />}
        </div>
      ))}
    </div>
  )
}
