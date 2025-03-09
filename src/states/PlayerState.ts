import { Events } from "phaser";
import { HealthComponent } from "../components/HealthComponent";
import { Item } from "../items/Item";

export class PlayerState extends Events.EventEmitter
{
    private coins: number;
    private score: number;
    private items: Item[];
    private health: HealthComponent;
    private ships: number[];
    private bulletSpeed: number;
    private fireRate: number;

    constructor()
    {
        super();

        this.coins = 10;
        this.score = 0;
        this.items = [];
        this.health = new HealthComponent(3);
        this.ships = [1];
        this.bulletSpeed = 1024;
        this.fireRate = 0.5;
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

    public addShip(shipId: number)
    {
        this.ships.push(shipId);
    }

    public getShips(): number[]
    {
        return this.ships;
    }

    public increaseBulletSpeed(multiplier: number)
    {
        this.bulletSpeed *= multiplier;
    }

    public getBulletSpeed(): number
    {
        return this.bulletSpeed;
    }

    public increaseFireRate(multiplier: number)
    {
        this.fireRate *= multiplier;
    }

    public getFireRate(): number
    {
        return this.fireRate;
    }
}