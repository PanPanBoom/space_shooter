import { Scene } from "phaser";
import { Item } from "./Item";
import { Player } from "../entities/Player";
import { GameDataKeys } from "../GameDataKey";

export class IncreaseBulletSpeed extends Item
{
    constructor(scene: Scene, x: number, y: number)
    {
        super(scene, x, y, "sprites", "bow.png", 5);
    }

    public apply(player: Player): void
    {
        player.scene.registry.get(GameDataKeys.PLAYER_STATE).increaseBulletSpeed(1.25);
    }

    public getDescription(): string {
        return "Increase your bullets' speed !";
    }
}