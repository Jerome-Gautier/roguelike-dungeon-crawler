export interface Item {
    name: string;
    description: string;
    type: string;
    effects: {
        [key: string]: number;
    };
    image: string;
    num: number;
    owned: number;
}

export const items: { [key: string]: Item }  = {
    "memory_shard": {
        "name": "Memory Shard",
        "description": "A shard of Ahri's lost memory. There are 20 of them scattered around the forest.",
        "type": "quest",
        "effects": {
            "xp": 25,
            "health": 5,
            "mana": 10
        },
        "image": "/images/items/memory_shard.png",
        "owned": 0,
        "num": 20
    },
    "health_potion": {
        "name": "Health Potion",
        "description": "Restores 50 health points.",
        "type": "consumable",
        "effects": {
        "health": 50
        },
        "image": "/images/items/health_potion.png",
        "owned": 0,
        "num": 5
    },
    "mana_potion": {
        "name": "Mana Potion",
        "description": "Restores 50 mana points.",
        "type": "consumable",
        "effects": {
        "mana": 100
        },
        "image": "/images/items/mana_potion.png",
        "owned": 0,
        "num": 5
    }
}