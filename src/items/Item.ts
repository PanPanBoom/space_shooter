import { GameObjects, Scene } from "phaser";
import { Player } from "../entities/Player";

export abstract class Item extends GameObjects.Image
{
    private price: number;

    constructor(scene: Scene, x: number, y: number, texture: string, frame: string, price: number)
    {
        super(scene, x, y, texture, frame);
        this.price = price;
    }

    public abstract apply(player: Player): void;
    public abstract getDescription(): string;
    
    public getPrice(): number
    {
        return this.price;
    }
}