import { Scene } from "phaser";
import { Item } from "./Item";
import { Player } from "../entities/Player";
import { GameDataKeys } from "../GameDataKey";

export class IncreaseFireRate extends Item
{
    constructor(scene: Scene, x: number, y: number)
    {
        super(scene, x, y, "sprites", "fire.png", 7);
    }

    public apply(player: Player): void
    {
        player.scene.registry.get(GameDataKeys.PLAYER_STATE).increaseFireRate(0.75);
    }

    public getDescription(): string {
        return "Improve your fire rate to shoot more bullets !";
    }
}