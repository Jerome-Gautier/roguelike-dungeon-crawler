export interface Enemy {
    name: string;
    description: string;
    image: string;
    health: number;
    healthMax: number;
    damageMin: number;
    damageMax: number;
    xp: number;
    level: number;
    posX: number;
    posY: number;
    active: boolean;
    size: number;
    isCharmed?: boolean;
}

export const enemies: { [key: string]: Enemy } = {
    "infantryman": {
        name: "Noxus Infantryman",
        description: "A Noxian soldier, trained to fight in the front lines.",
        image: "/images/enemies/infantryman_mini.png",
        health: 50,
        healthMax: 50,
        damageMin: 10,
        damageMax: 15,
        xp: 50,
        level: 1,
        size: 1,
        posX: 0,
        posY: 0,
        active: false,
    },
    "darius": {
        name: "Darius",
        description: "The Hand of Noxus, a powerful warrior and leader.",
        image: "/images/enemies/darius.png",
        health: 500,
        healthMax: 500,
        damageMin: 50,
        damageMax: 70,
        xp: 100,
        level: 5,
        size: 1,
        posX: 0,
        posY: 0,
        active: false,
    },
    "sion": {
        name: "Sion",
        description: "A monstrous undead warrior, once a proud leader of the Noxian army.",
        image: "/images/enemies/sion.png",
        health: 1000,
        healthMax: 1000,
        damageMin: 30,
        damageMax: 50,
        xp: 200,
        level: 10,
        size: 2,
        posX: 0,
        posY: 0,
        active: false,
    }
}