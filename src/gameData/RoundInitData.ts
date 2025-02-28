import { Physics } from "phaser";
import { Player } from "../entities/Player";

export type UserInterfaceData = {
    enemiesLeft: number;
    enemies: Physics.Arcade.Group;
    player: Player;
}