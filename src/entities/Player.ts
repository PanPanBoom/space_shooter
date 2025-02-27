import { Entity } from "./Entity";
import { WeaponComponent } from "../components/WeaponComponent";
import { Physics, Scene, Types } from "phaser";
import { MovementComponent } from "../components/MovementComponent";
import { HealthComponent } from "../components/HealthComponent";

export class Player extends Entity
{
    private rateOfFire: number;
    private playerShipData: PlayerShipData;
    private lastShotTime: number;
    private cursorKeys: Types.Input.Keyboard.CursorKeys;

    public constructor(scene: Scene, x: number, y: number, texture: string, frame: string, bullets: Physics.Arcade.Group)
    {
        super(scene, x, y, texture, frame);

        this.rateOfFire = 0.5;
        this.lastShotTime = 0;

        if(this.scene.input.keyboard)
        {
            this.cursorKeys = this.scene.input.keyboard.createCursorKeys();
            this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE).on('down', () => this.selectShip(1));
            this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO).on('down', () => this.selectShip(2));
        }
        else
            console.error("No keyboard input");

        this.addComponent(new WeaponComponent(bullets, scene.sound.add("sfx_laser1"), 4, 12, 0xffe066, 1024));
        this.addComponent(new MovementComponent());
        this.addComponent(new HealthComponent(3));

        const defaultShip: number = 1;

        this.selectShip(defaultShip);

        this.setAngle(-90);

        const playerShipsData = this.scene.cache.json.get("playerShips") as PlayerShipsData;
        this.play('shipIdle');
    }

    private createAnimation(shipId: number)
    {
        this.anims.create({
            key: 'shipIdle',
            frames: [
                { key: 'sprites', frame: 'ship' + shipId + '_frame1.png' },
                { key: 'sprites', frame: 'ship' + shipId + '_frame2.png' }
            ],
            frameRate: 30,
            repeat: -1
        });
    }

    private selectShip(shipId: number)
    {
        const playerShipsData = this.scene.cache.json.get("playerShips") as PlayerShipsData;
        this.playerShipData = playerShipsData[shipId];

        this.setTexture('sprites', this.playerShipData.texture);
        this.getComponent(MovementComponent)?.setSpeed(this.playerShipData.movementSpeed);
        this.arcadeBody.setCircle(this.playerShipData.body.radius, this.playerShipData.body.offsetX, this.playerShipData.body.offsetY);
    
        const animName: string = "shipIdle";
        if(this.anims.exists(animName))
            this.anims.remove(animName);

        this.createAnimation(shipId);
        this.play(animName);
    }

    public preUpdate(time: number, delta: number)
    {
        super.preUpdate(time, delta);
        if(this.playerShipData)
        {
            if(this.cursorKeys.left.isDown)
                this.getComponent(MovementComponent)?.moveHorizontally(this, -delta);
        
            else if(this.cursorKeys.right.isDown)
                this.getComponent(MovementComponent)?.moveHorizontally(this, delta);
        }

        if(this.cursorKeys.space.isDown && time - this.lastShotTime > this.rateOfFire * 1000)
        {
            this.getComponent(WeaponComponent)?.shoot(this);
                
            this.lastShotTime = time;
        }

        this.x = Phaser.Math.Clamp(this.x, this.displayWidth / 2, this.scene.cameras.main.width - this.displayWidth / 2);
    }
}