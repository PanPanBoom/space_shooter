import { GameObjects, Scene } from "phaser";
import { Player } from "../entities/Player";

export abstract class Item extends GameObjects.Image
{
    private price: number;

    public abstract apply(player: Player): void;
}