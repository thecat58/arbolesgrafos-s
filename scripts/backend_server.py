"""
Backend completo en Python usando FastAPI.
Modela datos con clase Nodo recursiva y expone API REST.
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from enum import Enum
import math
import json

app = FastAPI(title="TechExplorer Backend", version="1.0.0")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class NodeType(str, Enum):
    DEVICE = "device"
    ACCESSORY = "accessory"
    FEATURE = "feature"


class Node(BaseModel):
    """Clase Nodo recursiva con profundidad ilimitada"""
    id: str
    name: str
    type: NodeType
    level: int
    parent_id: Optional[str] = None
    children: List['Node'] = []
    data: Dict[str, Any] = {}
    
    class Config:
        use_enum_values = True


# Permitir referencias circulares
Node.model_rebuild()


# Base de datos en memoria (simula BD real)
NODES_DB: Dict[str, Node] = {}


def initialize_database():
    """Inicializa la base de datos con estructura profunda"""
    global NODES_DB
    
    # Nivel 0: Dispositivo
    iphone = Node(
        id="dev_1",
        name="iPhone 15 Pro Max",
        type=NodeType.DEVICE,
        level=0,
        data={
            "brand": "Apple",
            "category": "Smartphone",
            "price": 1199.00,
            "inStock": True,
            "description": "El smartphone más avanzado de Apple con chip A17 Pro",
            "imageUrl": "/iphone-15-pro.png"
        }
    )
    
    # Nivel 1: Accesorio principal
    case = Node(
        id="acc_1",
        name="Funda de Silicona MagSafe",
        type=NodeType.ACCESSORY,
        level=1,
        parent_id="dev_1",
        data={
            "brand": "Apple",
            "type": "Case",
            "price": 49.00,
            "inStock": True,
            "description": "Protección premium con soporte MagSafe integrado",
            "compatibleWith": ["iPhone 15 Pro Max", "iPhone 15 Pro"],
            "imageUrl": "/magsafe-case.jpg"
        }
    )
    
    # Nivel 2: Accesorio del accesorio
    wallet = Node(
        id="acc_2",
        name="Cartera MagSafe",
        type=NodeType.ACCESSORY,
        level=2,
        parent_id="acc_1",
        data={
            "brand": "Apple",
            "type": "Wallet",
            "price": 59.00,
            "inStock": True,
            "description": "Cartera magnética que se adhiere a fundas MagSafe",
            "compatibleWith": ["Fundas MagSafe"],
            "imageUrl": "/magsafe-wallet.jpg"
        }
    )
    
    # Nivel 3: Accesorio del accesorio del accesorio
    card_holder = Node(
        id="acc_3",
        name="Porta Tarjetas RFID",
        type=NodeType.ACCESSORY,
        level=3,
        parent_id="acc_2",
        data={
            "brand": "Bellroy",
            "type": "Card Holder",
            "price": 29.00,
            "inStock": True,
            "description": "Protección RFID para tarjetas dentro de la cartera",
            "compatibleWith": ["Cartera MagSafe"],
            "imageUrl": "/card-holder.jpg"
        }
    )
    
    # Nivel 4: Accesorio del accesorio del accesorio del accesorio
    airtag_holder = Node(
        id="acc_4",
        name="Soporte AirTag",
        type=NodeType.ACCESSORY,
        level=4,
        parent_id="acc_3",
        data={
            "brand": "Belkin",
            "type": "AirTag Holder",
            "price": 12.95,
            "inStock": True,
            "description": "Ranura para AirTag que se integra en el porta tarjetas",
            "compatibleWith": ["Porta Tarjetas"],
            "imageUrl": "/airtag-holder.png"
        }
    )
    
    # Nivel 5: Accesorio → accesorio → accesorio → accesorio → accesorio
    keychain = Node(
        id="acc_5",
        name="Llavero con Clip",
        type=NodeType.ACCESSORY,
        level=5,
        parent_id="acc_4",
        data={
            "brand": "Generic",
            "type": "Keychain",
            "price": 5.99,
            "inStock": True,
            "description": "Clip para enganchar el soporte AirTag a llaves o mochilas",
            "compatibleWith": ["Soporte AirTag"],
            "imageUrl": "/keychain.jpg"
        }
    )
    
    # Construir jerarquía recursiva
    airtag_holder.children = [keychain]
    card_holder.children = [airtag_holder]
    wallet.children = [card_holder]
    case.children = [wallet]
    
    # Agregar más accesorios de nivel 1 al iPhone
    charger = Node(
        id="acc_6",
        name="Cargador USB-C 20W",
        type=NodeType.ACCESSORY,
        level=1,
        parent_id="dev_1",
        data={
            "brand": "Apple",
            "type": "Charger",
            "price": 19.00,
            "inStock": True,
            "description": "Carga rápida para tu iPhone",
            "compatibleWith": ["iPhone 15 Pro Max"],
            "imageUrl": "/usb-c-charger.jpg"
        }
    )
    
    cable = Node(
        id="acc_7",
        name="Cable USB-C a USB-C",
        type=NodeType.ACCESSORY,
        level=2,
        parent_id="acc_6",
        data={
            "brand": "Apple",
            "type": "Cable",
            "price": 29.00,
            "inStock": False,
            "description": "Cable trenzado de 2 metros",
            "compatibleWith": ["Cargador USB-C"],
            "imageUrl": "/usb-c-cable.jpg",
            "alternatives": ["acc_8"]
        }
    )
    
    cable_organizer = Node(
        id="acc_8",
        name="Organizador de Cable",
        type=NodeType.ACCESSORY,
        level=3,
        parent_id="acc_7",
        data={
            "brand": "Anker",
            "type": "Cable Organizer",
            "price": 9.99,
            "inStock": True,
            "description": "Mantén tus cables ordenados",
            "compatibleWith": ["Cables"],
            "imageUrl": "/cable-organizer.png"
        }
    )
    
    cable.children = [cable_organizer]
    charger.children = [cable]
    
    iphone.children = [case, charger]
    
    # Características del iPhone
    feature1 = Node(
        id="feat_1",
        name="MagSafe",
        type=NodeType.FEATURE,
        level=1,
        parent_id="dev_1",
        data={
            "category": "Connectivity",
            "description": "Sistema de carga inalámbrica magnética",
            "relatedAccessories": ["acc_1", "acc_2"]
        }
    )
    
    feature2 = Node(
        id="feat_2",
        name="USB-C",
        type=NodeType.FEATURE,
        level=1,
        parent_id="dev_1",
        data={
            "category": "Connectivity",
            "description": "Puerto de carga universal USB-C",
            "relatedAccessories": ["acc_6", "acc_7"]
        }
    )
    
    iphone.children.extend([feature1, feature2])
    
    # Guardar en BD
    all_nodes = [iphone, case, wallet, card_holder, airtag_holder, 
                 keychain, charger, cable, cable_organizer, feature1, feature2]
    
    for node in all_nodes:
        NODES_DB[node.id] = node
    
    print(f"✅ Base de datos inicializada con {len(NODES_DB)} nodos")


@app.on_event("startup")
async def startup():
    initialize_database()


@app.get("/")
async def root():
    return {
        "message": "TechExplorer Backend API",
        "version": "1.0.0",
        "endpoints": {
            "catalog": "/api/catalog",
            "tree": "/api/tree/{node_id}",
            "node": "/api/node/{node_id}",
            "graph": "/api/graph/{node_id}",
            "children": "/api/children/{node_id}"
        }
    }


@app.get("/api/catalog")
async def get_catalog():
    """Retorna todas las listas clasificadas"""
    devices = [n for n in NODES_DB.values() if n.type == NodeType.DEVICE]
    accessories = [n for n in NODES_DB.values() if n.type == NodeType.ACCESSORY]
    features = [n for n in NODES_DB.values() if n.type == NodeType.FEATURE]
    
    return {
        "devices": [n.dict() for n in devices],
        "accessories": [n.dict() for n in accessories],
        "features": [n.dict() for n in features],
        "total": len(NODES_DB)
    }


@app.get("/api/tree/{node_id}")
async def get_tree(node_id: str):
    """Retorna el árbol completo desde un nodo raíz"""
    if node_id not in NODES_DB:
        raise HTTPException(status_code=404, detail=f"Node {node_id} not found")
    
    def build_tree(node: Node) -> dict:
        """Construye recursivamente el árbol"""
        return {
            "id": node.id,
            "name": node.name,
            "type": node.type,
            "level": node.level,
            "parent_id": node.parent_id,
            "data": node.data,
            "children": [build_tree(child) for child in node.children]
        }
    
    root = NODES_DB[node_id]
    return build_tree(root)


@app.get("/api/node/{node_id}")
async def get_node(node_id: str):
    """Retorna un nodo específico con sus hijos directos"""
    if node_id not in NODES_DB:
        raise HTTPException(status_code=404, detail=f"Node {node_id} not found")
    
    node = NODES_DB[node_id]
    return node.dict()


@app.get("/api/children/{node_id}")
async def get_children(node_id: str):
    """Retorna solo los hijos directos de un nodo"""
    if node_id not in NODES_DB:
        raise HTTPException(status_code=404, detail=f"Node {node_id} not found")
    
    node = NODES_DB[node_id]
    return {
        "parent": {"id": node.id, "name": node.name, "level": node.level},
        "children": [child.dict() for child in node.children],
        "hasChildren": len(node.children) > 0
    }


@app.get("/api/graph/{node_id}")
async def get_graph(node_id: str, radius: int = 300):
    """
    Genera un grafo poligonal n-gonal perfectamente equilibrado.
    Distribuye nodos en círculos concéntricos por nivel.
    """
    if node_id not in NODES_DB:
        raise HTTPException(status_code=404, detail=f"Node {node_id} not found")
    
    root = NODES_DB[node_id]
    
    # Recolectar todos los nodos recursivamente
    all_nodes = []
    edges = []
    
    def collect_nodes(node: Node, parent_id: Optional[str] = None):
        all_nodes.append(node)
        if parent_id:
            edges.append({"source": parent_id, "target": node.id})
        for child in node.children:
            collect_nodes(child, node.id)
    
    collect_nodes(root)
    
    # Agrupar por nivel para distribución poligonal
    levels: Dict[int, List[Node]] = {}
    for node in all_nodes:
        if node.level not in levels:
            levels[node.level] = []
        levels[node.level].append(node)
    
    # Calcular posiciones poligonales perfectas
    positioned_nodes = []
    center_x, center_y = 400, 400  # Centro del canvas
    
    for level, nodes_in_level in sorted(levels.items()):
        n = len(nodes_in_level)
        level_radius = radius * (level + 1) * 0.6  # Radio aumenta con el nivel
        
        for i, node in enumerate(nodes_in_level):
            # Distribución poligonal perfecta (n-gonal)
            angle = (2 * math.pi * i / n) - (math.pi / 2)  # Empezar desde arriba
            x = center_x + level_radius * math.cos(angle)
            y = center_y + level_radius * math.sin(angle)
            
            positioned_nodes.append({
                "id": node.id,
                "name": node.name,
                "type": node.type,
                "level": node.level,
                "data": node.data,
                "x": round(x, 2),
                "y": round(y, 2)
            })
    
    return {
        "nodes": positioned_nodes,
        "edges": edges,
        "center": {"x": center_x, "y": center_y},
        "levels": len(levels)
    }


@app.post("/api/track")
async def track_navigation(data: dict):
    """Endpoint para tracking de navegación del usuario"""
    # Aquí implementarías lógica de ML/recomendaciones
    print(f"📊 Tracking: {data}")
    return {"status": "tracked", "data": data}


if __name__ == "__main__":
    import uvicorn
    print("🚀 Iniciando backend TechExplorer...")
    print("📡 API disponible en: http://localhost:8000")
    print("📖 Documentación en: http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000)
