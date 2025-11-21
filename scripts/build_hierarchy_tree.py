"""
Backend Python script to build the complete hierarchical tree.
This script constructs the tree structure with unlimited depth for accessory chains.
"""
import json
from typing import List, Dict, Any, Optional

def build_hierarchy_tree(devices: List[Dict], accessories: List[Dict], features: List[Dict]) -> List[Dict]:
    """
    Build a complete hierarchical tree with unlimited depth.
    Supports long chains like: device → accessory → accessory → accessory → accessory → ...
    
    Returns a list of tree nodes with recursive children structure.
    """
    
    def build_accessory_tree(accessory_id: str, depth: int = 0) -> Optional[Dict]:
        """Recursively build accessory subtree with unlimited depth"""
        accessory = next((acc for acc in accessories if acc["id"] == accessory_id), None)
        if not accessory:
            return None
        
        node = {
            "id": accessory["id"],
            "label": accessory["name"],
            "type": "accessory" if depth == 0 else "sub-accessory",
            "depth": depth,
            "data": accessory,
            "children": []
        }
        
        # Find child accessories (unlimited depth)
        child_accessories = [acc for acc in accessories if acc.get("parentAccessoryId") == accessory_id]
        
        for child_acc in child_accessories:
            child_node = build_accessory_tree(child_acc["id"], depth + 1)
            if child_node:
                node["children"].append(child_node)
        
        # Add related features
        related_features = [feat for feat in features if accessory_id in feat.get("relatedAccessoryIds", [])]
        for feature in related_features:
            node["children"].append({
                "id": feature["id"],
                "label": feature["name"],
                "type": "feature",
                "depth": depth + 1,
                "data": feature,
                "children": []
            })
        
        return node
    
    tree = []
    
    # Build tree starting from devices
    for device in devices:
        device_node = {
            "id": device["id"],
            "label": device["name"],
            "type": "device",
            "depth": 0,
            "data": device,
            "children": []
        }
        
        # Find top-level accessories (those without a parent OR those that are compatible with this device)
        device_accessories = [
            acc for acc in accessories 
            if device["id"] in acc.get("compatibleDevices", []) and not acc.get("parentAccessoryId")
        ]
        
        for accessory in device_accessories:
            accessory_node = build_accessory_tree(accessory["id"], 0)
            if accessory_node:
                device_node["children"].append(accessory_node)
        
        tree.append(device_node)
    
    return tree

def analyze_tree_depth(tree: List[Dict]) -> Dict[str, Any]:
    """Analyze the tree to find maximum depth and path statistics"""
    
    def get_max_depth(node: Dict) -> int:
        if not node.get("children"):
            return node.get("depth", 0)
        return max(get_max_depth(child) for child in node["children"])
    
    def count_nodes(node: Dict) -> int:
        return 1 + sum(count_nodes(child) for child in node.get("children", []))
    
    max_depth = max(get_max_depth(node) for node in tree) if tree else 0
    total_nodes = sum(count_nodes(node) for node in tree)
    
    return {
        "max_depth": max_depth,
        "total_nodes": total_nodes,
        "root_nodes": len(tree)
    }

if __name__ == "__main__":
    # Sample data (in production, this would come from database)
    devices = [
        {"id": "dev-1", "name": "iPhone 15 Pro", "category": "smartphones"},
        {"id": "dev-2", "name": "Galaxy S24 Ultra", "category": "smartphones"},
        {"id": "dev-3", "name": "MacBook Pro 16\"", "category": "laptops"}
    ]
    
    accessories = [
        {"id": "acc-1", "name": "MagSafe Case", "compatibleDevices": ["dev-1"]},
        {"id": "acc-9", "name": "MagSafe Wallet", "compatibleDevices": ["dev-1"], "parentAccessoryId": "acc-1"},
        {"id": "acc-11", "name": "RFID Card Holder", "compatibleDevices": ["dev-1"], "parentAccessoryId": "acc-9"},
        {"id": "acc-12", "name": "AirTag Holder", "compatibleDevices": ["dev-1"], "parentAccessoryId": "acc-11"},
        {"id": "acc-13", "name": "Leather Keychain", "compatibleDevices": ["dev-1"], "parentAccessoryId": "acc-12"},
    ]
    
    features = [
        {"id": "feat-1", "name": "Protection", "relatedAccessoryIds": ["acc-1"]}
    ]
    
    tree = build_hierarchy_tree(devices, accessories, features)
    stats = analyze_tree_depth(tree)
    
    print(json.dumps(tree, indent=2))
    print(f"\n✓ Built tree with unlimited depth support")
    print(f"✓ Maximum depth reached: {stats['max_depth']} levels")
    print(f"✓ Total nodes: {stats['total_nodes']}")
    print(f"✓ Root devices: {stats['root_nodes']}")
    print(f"\n✓ Example chain: Device → Accessory → Accessory → Accessory → Accessory → Accessory")
