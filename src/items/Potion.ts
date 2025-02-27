import { Scene } from "phaser";
import { HealthComponent } from "../components/HealthComponent";
import { Player } from "../entities/Player";
import { Item } from "./Item";

export class Potion extends Item
{
    constructor(scene: Scene, x: number, y: number)
    {
        super(scene, x, y, "sprites", "flask.png");
    }
    
    public apply(player: Player): void
    {
        player.getComponent(HealthComponent)?.inc(1);
    }
}