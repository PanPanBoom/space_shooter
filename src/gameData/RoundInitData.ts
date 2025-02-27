import { Physics } from "phaser";
import { Player } from "../entities/Player";

export type RoundInitData = {
    round: number;
}

export type UserInterfaceData = {
    round: number;
    enemiesLeft: number;
    enemies: Physics.Arcade.Group;
    player: Player;
}