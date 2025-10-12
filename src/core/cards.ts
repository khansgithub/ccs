import logger from "./logger.ts";
import type { CardName, AllStats, Player, CardStat, StatFunction } from "./types.ts";

export const AllCards: Record<CardName, CardStat[]> = {
    "Foo": [
        {
            stat: "damage",
            apply_to: "opponent",
            value: 10
        }
    ],
    "Bar":[
        {
            stat: "damage",
            apply_to: "opponent",
            value: 20
        }
    ]
};

export const StatFunctions: Record<keyof AllStats, StatFunction> = {
    damage: function(apply_to: Player, value: any){
        apply_to.hp -= value;
        logger.info(`Dealt ${value} damage to ${apply_to}`);
    },
    def: function(apply_to: Player, value: any){

    },
    dodge: function(apply_to: Player, value: any){

    },
    stun: function(apply_to: Player, value: any){

    },
};

// let q = {
//     "Fireball":[
//         {
//             "stat": "damage",
//             "value": 20,
//             "apply_to": new Player("asd")
//         }
//     ]
// }

// let m = {
//     "damage": function(apply_to: Player, value: any){
//         apply_to.hp -= value;
//     }
// }