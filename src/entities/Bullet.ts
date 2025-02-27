import { GameObjects, Physics } from "phaser";

export class Bullet extends GameObjects.Rectangle
{
    private arcadeBody: Physics.Arcade.Body;

    public init()
    {
        this.arcadeBody = this.body as Physics.Arcade.Body;
        this.arcadeBody.allowGravity = false;
        this.arcadeBody.setFriction(0, 0);
    }

    public enable(x: number, y: number, width: number, height: number, color: number, velocityX: number, velocityY: number)
    {
        this.setPosition(x, y);
        this.setSize(width, height);
        this.setFillStyle(color);
        this.setOrigin(0.5);

        this.scene.physics.world.add(this.arcadeBody);
        this.arcadeBody.setVelocity(velocityX, velocityY);
        this.arcadeBody.setSize(width, height);

        this.setActive(true);
        this.setVisible(true);
    }

    public disable()
    {
        this.scene.physics.world.remove(this.arcadeBody);
        this.arcadeBody.setEnable(false);
        this.setActive(false);
        this.setVisible(false);
    }

    update(time: number, delta: number)
    {
        super.update(time, delta);

        if( this.y > this.scene.cameras.main.height + this.displayHeight || this.y < -this.displayHeight ||
            this.x > this.scene.cameras.main.width + this.displayWidth || this.x < -this.displayWidth)
            this.disable();
    }
}