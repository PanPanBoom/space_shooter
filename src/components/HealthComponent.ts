import { Events } from "phaser";

export class HealthComponent extends Events.EventEmitter implements IComponent
{
    private value: number;
    private readonly max: number;

    constructor(value: number)
    {
        super();

        this.value = value;
        this.max = value;
    }

    public getValue(): number
    {
        return this.value;
    }

    public getMax(): number
    {
        return this.max;
    }

    public inc(amount: number): void
    {
        const oldValue = this.value;

        if(this.value + amount <= this.max)
            this.value += amount;

        if(this.value <= 0)
            this.emit('death');

        if(oldValue != this.value)
            this.emit('change', this.value);
    }
}