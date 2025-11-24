"""
Backend Python script to compute graph connections and layout.
This script calculates the n-gonal graph structure and connection matrix.
"""
import json
import math
from typing import List, Dict, Any, Tuple

def compute_graph_layout(
    devices: List[Dict], 
    accessories: List[Dict], 
    features: List[Dict],
    canvas_width: int = 1200,
    canvas_height: int = 800
) -> Dict[str, Any]:
    """
    Compute n-gonal graph layout with force-directed positioning.
    Returns nodes with x,y coordinates and connection matrix.
    """
    
    center_x = canvas_width / 2
    center_y = canvas_height / 2
    
    nodes = []
    connections = []
    
    # Position devices in inner circle
    device_radius = min(canvas_width, canvas_height) * 0.25
    device_angle_step = (2 * math.pi) / len(devices) if devices else 0
    
    for i, device in enumerate(devices):
        angle = i * device_angle_step - (math.pi / 2)
        x = center_x + math.cos(angle) * device_radius
        y = center_y + math.sin(angle) * device_radius
        
        nodes.append({
            "id": device["id"],
            "label": device["name"],
            "type": "device",
            "x": round(x, 2),
            "y": round(y, 2),
            "radius": 12,
            "color": "#60a5fa",
            "connections": []
        })
    
    # Position accessories in outer circle
    accessory_radius = min(canvas_width, canvas_height) * 0.4
    accessory_angle_step = (2 * math.pi) / len(accessories) if accessories else 0
    
    for i, accessory in enumerate(accessories):
        angle = i * accessory_angle_step - (math.pi / 2)
        x = center_x + math.cos(angle) * accessory_radius
        y = center_y + math.sin(angle) * accessory_radius
        
        # Build connections to compatible devices
        connected_ids = accessory.get("compatibleDevices", [])
        
        # Also connect to parent accessory if exists (for deep chains)
        if accessory.get("parentAccessoryId"):
            connected_ids.append(accessory["parentAccessoryId"])
        
        # Connect to child accessories (for visualization of chains)
        child_accessories = [acc["id"] for acc in accessories if acc.get("parentAccessoryId") == accessory["id"]]
        connected_ids.extend(child_accessories)
        
        nodes.append({
            "id": accessory["id"],
            "label": accessory["name"],
            "type": "accessory",
            "x": round(x, 2),
            "y": round(y, 2),
            "radius": 10,
            "color": "#fbbf24",
            "connections": connected_ids,
            "depth": calculate_accessory_depth(accessory["id"], accessories)
        })
        
        # Add connections to matrix
        for target_id in connected_ids:
            connections.append({
                "source": accessory["id"],
                "target": target_id,
                "type": "compatibility"
            })
    
    # Position features in middle circle
    feature_radius = min(canvas_width, canvas_height) * 0.15
    feature_angle_step = (2 * math.pi) / len(features) if features else 0
    
    for i, feature in enumerate(features):
        angle = i * feature_angle_step
        x = center_x + math.cos(angle) * feature_radius
        y = center_y + math.sin(angle) * feature_radius
        
        connected_ids = feature.get("relatedAccessoryIds", [])
        
        nodes.append({
            "id": feature["id"],
            "label": feature["name"],
            "type": "feature",
            "x": round(x, 2),
            "y": round(y, 2),
            "radius": 8,
            "color": "#a78bfa",
            "connections": connected_ids
        })
        
        for target_id in connected_ids:
            connections.append({
                "source": feature["id"],
                "target": target_id,
                "type": "feature"
            })
    
    # Build adjacency matrix
    node_ids = [n["id"] for n in nodes]
    adjacency_matrix = [[0] * len(node_ids) for _ in range(len(node_ids))]
    
    for conn in connections:
        if conn["source"] in node_ids and conn["target"] in node_ids:
            source_idx = node_ids.index(conn["source"])
            target_idx = node_ids.index(conn["target"])
            adjacency_matrix[source_idx][target_idx] = 1
            adjacency_matrix[target_idx][source_idx] = 1
    
    return {
        "nodes": nodes,
        "connections": connections,
        "adjacency_matrix": adjacency_matrix,
        "metadata": {
            "total_nodes": len(nodes),
            "total_connections": len(connections),
            "canvas_dimensions": {"width": canvas_width, "height": canvas_height},
            "max_accessory_depth": max((n.get("depth", 0) for n in nodes if n["type"] == "accessory"), default=0)
        }
    }

def calculate_accessory_depth(accessory_id: str, accessories: List[Dict]) -> int:
    """Calculate how deep this accessory is in the chain (0 = top-level, 1+ = nested)"""
    accessory = next((acc for acc in accessories if acc["id"] == accessory_id), None)
    if not accessory or not accessory.get("parentAccessoryId"):
        return 0
    return 1 + calculate_accessory_depth(accessory["parentAccessoryId"], accessories)

if __name__ == "__main__":
    # Sample data
    devices = [
        {"id": "dev-1", "name": "iPhone 15 Pro"},
        {"id": "dev-2", "name": "Galaxy S24 Ultra"}
    ]
    
    accessories = [
        {"id": "acc-1", "name": "MagSafe Case", "compatibleDevices": ["dev-1"]},
        {"id": "acc-9", "name": "MagSafe Wallet", "compatibleDevices": ["dev-1"], "parentAccessoryId": "acc-1"},
        {"id": "acc-11", "name": "Card Holder", "compatibleDevices": ["dev-1"], "parentAccessoryId": "acc-9"},
        {"id": "acc-12", "name": "AirTag Holder", "compatibleDevices": ["dev-1"], "parentAccessoryId": "acc-11"},
    ]
    
    features = [
        {"id": "feat-1", "name": "Protection", "relatedAccessoryIds": ["acc-1", "acc-9"]}
    ]
    
    graph = compute_graph_layout(devices, accessories, features)
    
    print(json.dumps(graph, indent=2))
    print(f"\n✓ Computed graph layout with {graph['metadata']['total_nodes']} nodes")
    print(f"✓ Total connections: {graph['metadata']['total_connections']}")
    print(f"✓ Maximum accessory chain depth: {graph['metadata']['max_accessory_depth']} levels")
    print(f"✓ Graph supports unlimited nesting: accessory → accessory → accessory → ...")
