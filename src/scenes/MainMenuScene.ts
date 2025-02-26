import { Game, GameObjects, Scene } from "phaser";
import { SceneNames } from "./SceneNames";

export class MainMenuScene extends Scene
{
    private bg: GameObjects.TileSprite;
    private playerShip: GameObjects.Sprite;

    constructor()
    {
        super(SceneNames.MAIN_MENU_SCENE);
    }

    preload()
    {
        this.load.setPath('assets');
        this.load.image('bg', 'Backgrounds/blue.png');
        this.load.atlas('sprites', 'Spritesheet/texture.png', 'Spritesheet/texture.json');
        this.load.font('future', 'Fonts/kenvector_future.ttf');
    }

    create()
    {
        this.bg = this.add.tileSprite(0, 0, this.cameras.main.width, this.cameras.main.height, "bg").setOrigin(0).setTileScale(2);

        const playerShipOffsetX = 64;
        this.playerShip = this.add.sprite(this.cameras.main.centerX - playerShipOffsetX, this.cameras.main.centerY, 'sprites', 'ship1_frame1.png').setAngle(-90);
        
        this.anims.create({
            key: 'playerShipIdle',
            frames: [
                { key: 'sprites', frame: 'ship1_frame1.png' },
                { key: 'sprites', frame: 'ship1_frame2.png' }
            ],
            frameRate: 30,
            repeat: -1
        });
        this.playerShip.play('playerShipIdle');

        this.tweens.add({
            targets: this.playerShip,
            x: '+= ' + playerShipOffsetX * 2,
            duration: 700,
            yoyo: true,
            repeat: -1,
            ease: 'Quad.easeInOut'
        });

        // this.tweens.add({
        //     targets: this.playerShip,
        //     tint: 0x000000ff,
        //     duration: 700,
        //     yoyo: true,
        //     repeat: -1,
        //     ease: 'Quad.easeInOut'
        // });

        const fontSize = 64;

        this.add.text(this.cameras.main.centerX, 256, 'Main Menu', {fontSize: fontSize + 'px', color: 'white', fontFamily: 'future'}).setOrigin(0.5);
        this.add.text(this.cameras.main.centerX, this.cameras.main.height - 256, 'Press SPACE to start', {fontSize: fontSize + 'px', color: 'white', fontFamily: 'future'}).setOrigin(0.5);

        this.input.keyboard?.once('keydown-SPACE', () => {
            this.scene.start(SceneNames.MAIN_GAME_SCENE, {
                round: 1
            });
        })
    }

    update(time: number, delta: number)
    {
        this.bg.tilePositionY -= 0.1 * delta;
    }
}