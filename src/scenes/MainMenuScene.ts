import { GameObjects, Types } from "phaser";
import { SceneNames } from "./SceneNames";
import { GameDataKeys } from "../GameDataKey";
import { BaseScene } from "./BaseScene";
import { PlayerState } from "../states/PlayerState";

export class MainMenuScene extends BaseScene
{
    private playerShip: GameObjects.Sprite;

    constructor()
    {
        super(SceneNames.MAIN_MENU_SCENE);
    }

    preload()
    {
        super.preload();
        const width = this.cameras.main.width;

        const x: number = 0;
        const y: number = this.cameras.main.centerY;
        
        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(x, y, width, 64);

        this.load.on('progress', (value: number) => {
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(x, y, width * value, 64);
        });

        this.load.on('complete', () => {
            console.log('complete');
            progressBar.destroy();
            progressBox.destroy();
        });

        this.load.image('planet', 'Planets/planet06.png');
        this.load.atlas('sprites', 'Spritesheet/texture.png', 'Spritesheet/texture.json');
        this.load.audio("sfx_laser1", "Sounds/sfx_laser1.ogg");
        this.load.audio("sfx_laser2", "Sounds/sfx_laser2.ogg");

        this.load.json("playerShips", "Data/playerShips.json");
        this.load.font('future', 'Fonts/kenvector_future.ttf');
    }

    create()
    {
        super.create();
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

        const shipFlyingTween = this.tweens.add({
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

        const textStyle: Types.GameObjects.Text.TextStyle = {
            fontSize: '64px',
            color: 'white',
            fontFamily: 'future'
        }

        this.add.text(this.cameras.main.centerX, 256, 'Main Menu', textStyle).setOrigin(0.5);
        const spaceKeyImage = this.add.image(this.cameras.main.centerX, this.cameras.main.height - 256, 'sprites', "space.png").setOrigin(0.5).setScale(2).setAlpha(0.2);
        this.add.tween({
            targets: spaceKeyImage,
            alpha: 1,
            ease: 'Quad.easeInOut',
            repeat: -1,
            yoyo: true,
            duration: 1000
        });

        const shipLeavingTween = this.tweens.add({
            targets: this.playerShip,
            y: -this.playerShip.displayHeight,
            duration: 1500,
            ease: 'Quart.easeIn'
        }).pause();
        
        this.input.keyboard?.once('keydown-SPACE', () => {
            shipFlyingTween.stop();
            shipLeavingTween.resume();
        });

        shipLeavingTween.once('complete', () => this.launchGame());
    }

    private launchGame()
    {
        this.registry.set(GameDataKeys.PLAYER_STATE, new PlayerState());
        this.registry.set(GameDataKeys.ROUND_NUMBER, 1);

        this.scene.start(SceneNames.MAIN_GAME_SCENE);
    }
}