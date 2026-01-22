import { Opponent, Self } from "./consts.ts";
import logger from "./logger.ts";
import type { CardName, AllStats, Player, CardStat, StatFunction } from "./types.ts";
import FireyImage from "../assets/firey.jpg";
import WateryImage from "../assets/watery.jpg";
import ShieldImage from "../assets/shield.jpg";
import JumpImage from "../assets/jump.jpg";
import SwordImage from "../assets/sword.jpg";
import MirrorImage from "../assets/mirror.jpg";
import ThunderImage from "../assets/thunder.jpg";
import TimeImage from "../assets/time.jpg";

export const StatFunctions: Record<keyof AllStats, StatFunction> = {
    damage: function (apply_to: Player, value: AllStats["damage"]) {
        apply_to.hp -= value;
        logger.info(`Dealt ${value} damage to ${apply_to.name}. HP is now ${apply_to.hp}`);
    },

    def: function (apply_to: Player, value: AllStats["def"]) {
        if (!apply_to.status.tempDef) apply_to.status.tempDef = 0;
        apply_to.status.tempDef += value;
        logger.info(`${apply_to.name} gains ${value} defense`);
        // debugger;
    },

    dodge: function (apply_to: Player, value: AllStats["dodge"]) {
        if (!apply_to.status.tempDodge) apply_to.status.tempDodge = 0;
        apply_to.status.tempDodge += value;
        logger.info(`${apply_to.name} gains ${value}% dodge chance`);
        // debugger;
    },

    stun: function (apply_to: Player, value: AllStats["stun"]) {
        if (value === true) {
            apply_to.status.isStunned = true;
            logger.info(`${apply_to.name} is stunned and will miss their next turn`);
            // debugger;
        }
    }
};

// export const AllCards: Record<CardName, CardStat[]> = {
export const AllCards: Record<CardName, Record<"image", any> & Record<"details", CardStat[]>> = {
    "The Firey": {
        image: FireyImage,
        details: [
                { stat: "damage", value: 30, apply_to: Opponent }
        ]
    },

    "The Watery": {
        image: WateryImage,
        details: [
                { stat: "damage", value: 15, apply_to: Opponent },
                { stat: "dodge", value: 10, apply_to: Self }

        ]
    },

    "The Shield": {
        image: ShieldImage,
        details: [
                { stat: "def", value: 25, apply_to: Self }
        ]
    },

    "The Jump": {
        image: JumpImage,
        details: [
                { stat: "dodge", value: 30, apply_to: Self }
        ]
    },

    "The Sword": {
        image: SwordImage,
        details: [
                { stat: "damage", value: 25, apply_to: Opponent },
                { stat: "def", value: 10, apply_to: Self }
        ]
    },

    "The Mirror": {
        image: MirrorImage,
        details: [

                { stat: "damage", value: 15, apply_to: Opponent },
                { stat: "damage", value: 15, apply_to: Self }
        ]
    },

    "The Thunder": {
        image: ThunderImage,
        details: [
                { stat: "damage", value: 20, apply_to: Opponent },
                { stat: "stun", value: true, apply_to: Opponent }
        ]
    },

    "The Time": {
        image: TimeImage,
        details: [

                { stat: "stun", value: true, apply_to: Opponent },
                { stat: "dodge", value: 20, apply_to: Self }
        
        ]
    },

};
