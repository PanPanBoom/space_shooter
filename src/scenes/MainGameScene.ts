import { Game, GameObjects, Physics, Scene } from 'phaser';
import { Bullet } from '../entities/Bullet';
import { GroupUtils } from '../utils/GroupUtils';
import { Player } from '../entities/Player';
import { Enemy } from '../entities/Enemy';
import { GameDataKeys } from '../GameDataKey';
import { SceneNames } from './SceneNames';

export class MainGameScene extends Scene
{
    private player: Player;
    private bullets: Physics.Arcade.Group;
    private enemies: Physics.Arcade.Group;
    private enemiesBullets: Physics.Arcade.Group;
    private bg: Phaser.GameObjects.TileSprite;
    private planet: Phaser.GameObjects.Image;
    private scoreText: Phaser.GameObjects.Text;

    constructor ()
    {
        super(SceneNames.MAIN_GAME_SCENE);
    }

    preload ()
    {
        this.load.setPath('assets');
        
        this.load.image('bg', 'Backgrounds/blue.png');
        this.load.image('planet', 'Planets/planet06.png');
        this.load.atlas('sprites', 'Spritesheet/texture.png', 'Spritesheet/texture.json');
        this.load.audio("sfx_laser1", "Sounds/sfx_laser1.ogg");
        this.load.audio("sfx_laser2", "Sounds/sfx_laser2.ogg");

        this.load.json("playerShips", "Data/playerShips.json");
    }

    create ()
    {
        const colorPalette: string[] = ["8A95A5", "3A1772", "9990D35", "F2CD5D", "61E86"];
        this.cameras.main.setBackgroundColor(0x50514f);

        this.bg = this.add.tileSprite(0, 0, this.cameras.main.width, this.cameras.main.height, "bg").setOrigin(0).setTileScale(2);
        this.planet = this.add.image(0, -512, 'planet').setOrigin(0);

        const bulletConfig = {
            classType: Bullet,
            runChildUpdate: true,
            createCallback: (bullet) => {
                (bullet as Bullet).init();
            },
            maxSize: 1024
        };
        this.bullets = this.physics.add.group(bulletConfig);
        GroupUtils.preallocateGroup(this.bullets, 5);

        this.enemiesBullets = this.physics.add.group(bulletConfig);
        GroupUtils.preallocateGroup(this.enemiesBullets, 5);

        this.enemies = this.physics.add.group({
            classType: Enemy,
            runChildUpdate: true,
            createCallback: (enemy) => {
                (enemy as Enemy).init(this, "sprites", "enemy.png", this.enemiesBullets);
            },
            maxSize: 7
        });
        GroupUtils.preallocateGroup(this.enemies, 5);

        this.player = new Player(this, this.cameras.main.centerX, this.cameras.main.height - 128, 'sprites', 'ship.png', this.bullets);
        this.add.existing(this.player);

        this.physics.add.collider(this.bullets, this.enemies, (bullet, enemy) => {
            bullet.destroy();
            (enemy as Enemy).disable();
            this.registry.inc(GameDataKeys.PLAYER_SCORE, 1);
        }, undefined, this);

        this.physics.add.collider(this.enemiesBullets, this.player, () => {
            this.scene.start(SceneNames.GAME_OVER_SCENE);
        });

        this.time.addEvent({
            delay: 1500,
            callback: this.spawnEnemy,
            callbackScope: this,
            loop: true
        });
        this.add.text(this.cameras.main.centerX, 16, "SCORE", { fontSize: '40px', align: 'center'}).setOrigin(0.5);
        this.scoreText = this.add.text(this.cameras.main.centerX, 48, "0", { fontSize: '40px', align: 'center'}).setOrigin(0.5);

        this.registry.set<number>(GameDataKeys.PLAYER_SCORE, 0);
        this.registry.events.on("changedata-" + GameDataKeys.PLAYER_SCORE, (_: any, value: number) => {
            console.log(value);
            this.scoreText.setText(value.toString());
        });

    }

    private spawnEnemy()
    {
        const enemy = this.enemies.get() as Enemy;
        if(enemy)
            enemy.enable(Phaser.Math.Between(0, this.cameras.main.width), 0, "sprites", "enemy.png");
    }

    update(time: number, delta: number)
    {
        this.bg.tilePositionY -= 0.1 * delta;
        this.planet.y += 0.4 * delta;
        this.player.update(time, delta);
    }
}
