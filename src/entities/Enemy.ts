import { Animations, Physics, Scene, Time } from "phaser";
import { Entity } from "./Entity";
import { WeaponComponent } from "../components/WeaponComponent";

export class Enemy extends Entity
{
    private shootTimer: Time.TimerEvent;

    public init(scene: Scene, texture: string, frame: string, bullets: Physics.Arcade.Group)
    {
        this.setTexture(texture, frame);
        
        this.addComponent(new WeaponComponent(bullets, scene.sound.add("sfx_laser2"), 4, 12, 0xffe066, 1024));

        this.shootTimer = this.scene.time.addEvent({
            delay: Phaser.Math.Between(1000, 2500),
            callback: this.shoot,
            callbackScope: this,
            loop: true
        });

        this.setAngle(90);

        this.anims.create({
            key: 'enemyShoot',
            frames: [
                { key: 'sprites', frame: 'enemy.png' },
                { key: 'sprites', frame: 'shoot1.png' },
                { key: 'sprites', frame: 'shoot2.png'}
            ],
            frameRate: 4,
        });
    }

    private shoot()
    {
        this.play("enemyShoot");
        this.once(Animations.Events.ANIMATION_COMPLETE, () => {
            this.getComponent(WeaponComponent)?.shoot(this);
        });
    }

    public enable(x: number, y: number, texture: string, frame: string)
    {
        this.setTexture(texture, frame);
        this.setPosition(x, y);
        this.arcadeBody.setCircle(this.displayWidth * 0.65, -12, 5);

        this.scene.physics.world.add(this.arcadeBody);

        this.setActive(true);
        this.setVisible(true);

        this.arcadeBody.setVelocityY(256);
        this.shootTimer.paused = false;
    }

    public disable()
    {
        this.scene.physics.world.remove(this.arcadeBody);
        this.arcadeBody.setEnable(false);
        this.setActive(false);
        this.setVisible(false);
        this.shootTimer.paused = true;
    }

    public update(time: number, delta: number)
    {
        if(this.y >= this.scene.cameras.main.height + this.displayHeight)
            this.disable();
    }
}