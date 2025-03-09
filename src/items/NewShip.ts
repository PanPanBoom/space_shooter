import { Scene } from "phaser";
import { Item } from "./Item";
import { GameDataKeys } from "../GameDataKey";
import { Player } from "../entities/Player";

export class NewShip extends Item
{
    private shipId: number;
    constructor(scene: Scene, x: number, y: number, shipId: number)
    {
        super(scene, x, y, "sprites", "ship" + shipId + "_frame1.png", 10);
        this.shipId = shipId;
    }

    public apply(player: Player): void {
        player.scene.registry.get(GameDataKeys.PLAYER_STATE).addShip(this.shipId);
    }

    public getDescription(): string {
        return "Unlocks a new ship moving faster !"
    }
}