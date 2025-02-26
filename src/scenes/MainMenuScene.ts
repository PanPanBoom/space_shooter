import { Game, GameObjects, Scene } from "phaser";
import { SceneNames } from "./SceneNames";

export class MainMenuScene extends Scene
{
    private bg: GameObjects.TileSprite;
    private playerShip: GameObjects.Image;

    constructor()
    {
        super(SceneNames.MAIN_MENU_SCENE);
    }

    preload()
    {
        this.load.setPath('assets');
        this.load.image('bg', 'Backgrounds/blue.png');
        this.load.atlas('sprites', 'Spritesheet/texture.png', 'Spritesheet/texture.json');
    }

    create()
    {
        this.bg = this.add.tileSprite(0, 0, this.cameras.main.width, this.cameras.main.height, "bg").setOrigin(0).setTileScale(2);

        const playerShipOffsetX = 64;
        this.playerShip = this.add.image(this.cameras.main.centerX - playerShipOffsetX, this.cameras.main.centerY, 'sprites', 'ship.png').setAngle(-90);
        
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

        this.add.text(this.cameras.main.centerX, 256, 'Main Menu', {fontSize: '32px', color: 'white'}).setOrigin(0.5);
        this.add.text(this.cameras.main.centerX, this.cameras.main.height - 256, 'Press SPACE to start', {fontSize: '32px', color: 'white'}).setOrigin(0.5);

        this.input.keyboard?.once('keydown-SPACE', () => {
            this.scene.start(SceneNames.MAIN_GAME_SCENE);
        })
    }

    update(time: number, delta: number)
    {
        this.bg.tilePositionY -= 0.1 * delta;
    }
}