import { Events } from "phaser";
import { HealthComponent } from "../components/HealthComponent";
import { Item } from "../items/Item";

export class PlayerState extends Events.EventEmitter
{
    private coins: number;
    private score: number;
    private items: Item[];
    private health: HealthComponent;

    constructor()
    {
        super();

        this.coins = 5;
        this.score = 0;
        this.items = [];
        this.health = new HealthComponent(3);
    }

    public getCoins(): number
    {
        return this.coins;
    }

    public incCoins(value: number)
    {
        this.coins += value;
        this.emit('change-coins', this.coins);
    }

    public getScore(): number
    {
        return this.score;
    }

    public incScore(value: number)
    {
        this.score += value;
        this.emit('change-score', this.score);
    }

    public getItems(): Item[]
    {
        return this.items;
    }

    public addItem(item: Item)
    {
        this.items.push(item);
    }

    public clearItems()
    {
        this.items = [];
    }

    public getHealth(): HealthComponent
    {
        return this.health
    }
}