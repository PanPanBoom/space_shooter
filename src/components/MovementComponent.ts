import { Entity } from "../entities/Entity";

export class MovementComponent implements IComponent
{
    private speed: number = 0;

    constructor(speed?: number)
    {
        if(speed)
            this.speed = speed;
    }

    public setSpeed(newSpeed: number)
    {
        this.speed = newSpeed;
    }

    public moveHorizontally(entity: Entity, delta: number)
    {
        entity.x += this.speed * delta;
    }

    public moveVertically(entity: Entity, delta: number)
    {
        entity.y += this.speed * delta;
    }
}