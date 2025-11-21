# TechExplorer - Device Management App

Aplicación de exploración de productos tecnológicos con tres vistas complementarias: listas clasificadas, árbol jerárquico profundo y grafo poligonal n-gonal interactivo.

## Características Principales

### 🎯 Tres Vistas Integradas

1. **Listas Clasificadas**: Índice filtrable por categoría, marca, tipo de accesorio y compatibilidad
2. **Árbol Jerárquico**: Visualización de relaciones padre-hijo con **profundidad ilimitada**
   - Soporta cadenas largas: `device → accessory → accessory → accessory → accessory → ...`
   - Ejemplo real: `iPhone → Case → Wallet → Card Holder → AirTag Holder → Keychain`
3. **Grafo N-gonal**: Visualización interactiva de todas las conexiones
   - Nodos clickeables que despliegan fichas dinámicas
   - Información completa: qué es, para qué sirve, compatibilidad, variantes, precios, alternativas

### 🔧 Backend Python

Scripts Python en `/scripts` que generan la estructura de datos:

- **`generate_catalog.py`**: Construye listas clasificadas con índices optimizados
- **`build_hierarchy_tree.py`**: Genera árbol completo con profundidad variable ilimitada
- **`compute_graph_connections.py`**: Calcula conexiones del grafo y layout n-gonal

### 🧠 Sistema de Recomendaciones

Analiza el recorrido del usuario entre vistas y aprende preferencias implícitas:

- Kits sugeridos
- Combinaciones frecuentes
- Equivalentes para productos sin stock
- Recomendaciones personalizadas basadas en navegación

### 🚀 Tecnologías

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Python scripts (ejecutables desde la app)
- **Visualización**: Canvas API para grafos, recursión para árbol profundo
- **Estado**: React hooks con tracking de navegación

## Estructura de Profundidad Ilimitada

La aplicación soporta cadenas de accesorios sin límite de profundidad:

\`\`\`
Device (Depth 0)
└── Accessory (Depth 0)
    └── Sub-Accessory (Depth 1)
        └── Sub-Sub-Accessory (Depth 2)
            └── Sub-Sub-Sub-Accessory (Depth 3)
                └── ... (unlimited)
\`\`\`

Ejemplo real implementado:

\`\`\`
iPhone 15 Pro
└── MagSafe Case
    └── MagSafe Wallet
        └── RFID Card Holder
            └── AirTag Holder Clip
                └── Leather Keychain
\`\`\`

## Ejecutar la Aplicación

\`\`\`bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Ejecutar scripts Python backend
python scripts/generate_catalog.py
python scripts/build_hierarchy_tree.py
python scripts/compute_graph_connections.py
\`\`\`

## Arquitectura

\`\`\`
app/
├── api/              # API routes que simulan backend Python
│   ├── catalog/      # Generación de catálogo
│   ├── tree/         # Construcción de árbol
│   └── graph/        # Cálculo de conexiones
├── page.tsx          # Vista principal con tabs
components/
├── lists-view.tsx    # Vista de listas clasificadas
├── tree-view.tsx     # Árbol jerárquico (profundidad ilimitada)
├── graph-view.tsx    # Grafo interactivo n-gonal
└── product-card.tsx  # Ficha dinámica de productos
lib/
├── types.ts          # Tipos TypeScript
└── mock-data.ts      # Datos de ejemplo con cadenas profundas
scripts/
├── generate_catalog.py           # Backend: generación de catálogo
├── build_hierarchy_tree.py       # Backend: árbol con profundidad ilimitada
└── compute_graph_connections.py  # Backend: grafo y conexiones
\`\`\`

## Innovación

La aplicación transforma catálogos tradicionales en una experiencia visual e inteligente:

- ✅ Navega entre vistas complementarias (lista → árbol → grafo)
- ✅ Profundidad ilimitada en relaciones de accesorios
- ✅ Sistema de aprendizaje basado en comportamiento
- ✅ Recomendaciones personalizadas y contextuales
- ✅ Fichas dinámicas con alternativas inteligentes
- ✅ Backend Python que genera toda la estructura
