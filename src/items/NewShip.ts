import { Scene } from "phaser";
import { Item } from "./Item";
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
        player.selectShip(this.shipId);
    }

    public getDescription(): string {
        return "Unlocks a new ship moving faster !"
    }
}