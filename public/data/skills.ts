export interface Skill {
    name: string;
    id: string;
    description: string;
    image: string;
    type: string;
    manaCost: number;
    damage: number;
    range?: number;
    unlocked: boolean;
}

export const skills :{ [key: string]: Skill } = {
    "essencetheft": {
        name: "Essence Theft",
        id: "essencetheft",
        description: "Ahri regains health and mana from the life essence of her defeated foes.",
        type: "Passive",
        image: "/images/player/skills/essence_theft.png",
        manaCost: 0,
        damage: 0,
        unlocked: false,
    },
    "orbofdeception": {
        name: "Orb of Deception",
        id: "orbofdeception",
        description: "Ahri throws her orb in front of her, destroying everything on its path.",
        image: "/images/player/skills/orb_of_deception.png",
        type: "Cast on target",
        manaCost: 55,
        damage: 100,
        range: 5,
        unlocked: false,
    },
    "foxfire": {
        name: "Fox-Fire",
        id: "foxfire",
        description: "Deals damage to all enemies surrounding Ahri (doesn't trigger enemy attacks).",
        image: "/images/player/skills/fox_fire.png",
        type: "Instant cast",
        manaCost: 30,
        damage: 25,
        range: 1,
        unlocked: false,
    },
    "charm": {
        name: "Charm",
        id: "charm",
        description: "Ahri charms an enemy, causing him to become armlesss to her for the rest of the game.",
        image: "/images/player/skills/charm.png",
        type: "Cast on target",
        manaCost: 40,
        damage: 0,
        range: 4,
        unlocked: false,
    },
    "spiritrush": {
        name: "Spirit Rush",
        id: "spiritrush",
        description: "Ahri dashes in the selected direction, dealing damage to all enemies surrounding her landing spot (can move through solid terrains and enemies without taking damage).",
        image: "/images/player/skills/spirit_rush.png",
        type: "Cast on target",
        manaCost: 30,
        damage: 25,
        range: 2,
        unlocked: false,
    },
}