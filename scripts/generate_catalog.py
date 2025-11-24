"""
Backend Python script to generate device catalog data.
This script builds the complete product lists with filtering capabilities.
"""
import json
from typing import List, Dict, Any
from datetime import datetime

def generate_device_catalog() -> Dict[str, Any]:
    """
    Generate a complete catalog of devices with metadata for filtering.
    Returns structured data that the frontend can consume.
    """
    
    # Device data structure
    devices = [
        {
            "id": "dev-1",
            "name": "iPhone 15 Pro",
            "brand": "Apple",
            "category": "smartphones",
            "model": "A2848",
            "releaseYear": 2023,
            "specs": {
                "processor": "A17 Pro",
                "ram": "8GB",
                "storage": ["128GB", "256GB", "512GB", "1TB"],
                "display": "6.1 inch OLED"
            },
            "tags": ["5g", "wireless-charging", "magsafe", "premium"]
        },
        {
            "id": "dev-2",
            "name": "Galaxy S24 Ultra",
            "brand": "Samsung",
            "category": "smartphones",
            "model": "SM-S928",
            "releaseYear": 2024,
            "specs": {
                "processor": "Snapdragon 8 Gen 3",
                "ram": "12GB",
                "storage": ["256GB", "512GB", "1TB"],
                "display": "6.8 inch Dynamic AMOLED"
            },
            "tags": ["5g", "s-pen", "wireless-charging", "flagship"]
        },
        {
            "id": "dev-3",
            "name": "MacBook Pro 16\"",
            "brand": "Apple",
            "category": "laptops",
            "model": "M3 Max",
            "releaseYear": 2023,
            "specs": {
                "processor": "M3 Max",
                "ram": "36GB",
                "storage": ["512GB", "1TB", "2TB"],
                "display": "16.2 inch Liquid Retina XDR"
            },
            "tags": ["professional", "thunderbolt", "usb-c", "macos"]
        },
        {
            "id": "dev-4",
            "name": "Sony A7 IV",
            "brand": "Sony",
            "category": "cameras",
            "model": "ILCE-7M4",
            "releaseYear": 2021,
            "specs": {
                "sensor": "33MP Full-Frame",
                "video": "4K 60fps",
                "stabilization": "5-axis IBIS",
                "mount": "E-mount"
            },
            "tags": ["mirrorless", "full-frame", "professional", "hybrid"]
        }
    ]
    
    # Build filtered indexes
    catalog = {
        "devices": devices,
        "indexes": {
            "by_category": {},
            "by_brand": {},
            "by_year": {},
            "by_tags": {}
        },
        "metadata": {
            "total_devices": len(devices),
            "generated_at": datetime.now().isoformat(),
            "categories": list(set(d["category"] for d in devices)),
            "brands": list(set(d["brand"] for d in devices))
        }
    }
    
    # Build category index
    for device in devices:
        category = device["category"]
        if category not in catalog["indexes"]["by_category"]:
            catalog["indexes"]["by_category"][category] = []
        catalog["indexes"]["by_category"][category].append(device["id"])
    
    # Build brand index
    for device in devices:
        brand = device["brand"]
        if brand not in catalog["indexes"]["by_brand"]:
            catalog["indexes"]["by_brand"][brand] = []
        catalog["indexes"]["by_brand"][brand].append(device["id"])
    
    # Build year index
    for device in devices:
        year = str(device["releaseYear"])
        if year not in catalog["indexes"]["by_year"]:
            catalog["indexes"]["by_year"][year] = []
        catalog["indexes"]["by_year"][year].append(device["id"])
    
    # Build tags index
    for device in devices:
        for tag in device.get("tags", []):
            if tag not in catalog["indexes"]["by_tags"]:
                catalog["indexes"]["by_tags"][tag] = []
            catalog["indexes"]["by_tags"][tag].append(device["id"])
    
    return catalog

if __name__ == "__main__":
    catalog = generate_device_catalog()
    print(json.dumps(catalog, indent=2))
    print(f"\n✓ Generated catalog with {catalog['metadata']['total_devices']} devices")
    print(f"✓ Categories: {', '.join(catalog['metadata']['categories'])}")
    print(f"✓ Brands: {', '.join(catalog['metadata']['brands'])}")
