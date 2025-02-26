import { Physics, Sound } from "phaser";
import { Bullet } from "../entities/Bullet";
import { Entity } from "../entities/Entity";

export class WeaponComponent implements IComponent
{
    private bullets: Physics.Arcade.Group;
    private shootSound: Sound.BaseSound;
    private readonly bulletWidth: number;
    private readonly bulletHeight: number;
    private readonly bulletColor: number;
    private readonly bulletSpeed: number;

    public constructor(bulletsGroup: Physics.Arcade.Group, shootSound: Sound.BaseSound, bulletWidth: number, bulletHeight: number, bulletColor: number, bulletSpeed: number)
    {
        this.bullets = bulletsGroup;
        this.shootSound = shootSound;
        this.bulletWidth = bulletWidth;
        this.bulletHeight = bulletHeight;
        this.bulletColor = bulletColor;
        this.bulletSpeed = bulletSpeed;
    }

    public shoot(entity: Entity)
    {
        const bullet = this.bullets.get() as Bullet;
        if(bullet)
        {
            const angle = entity.rotation;
            const forwardX: number = Math.cos(angle);
            const forwardY: number = Math.sin(angle);
            const velocityX = forwardX * this.bulletSpeed;
            const velocityY = forwardY * this.bulletSpeed;

            bullet.enable(entity.x + forwardX * entity.arcadeBody.radius, entity.y + forwardY * entity.arcadeBody.radius, this.bulletWidth, this.bulletHeight, this.bulletColor, velocityX, velocityY);
            this.shootSound.play();
        }
    }
}