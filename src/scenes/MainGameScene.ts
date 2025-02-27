import { Game, GameObjects, Math, Physics, Scene } from 'phaser';
import { Bullet } from '../entities/Bullet';
import { GroupUtils } from '../utils/GroupUtils';
import { Player } from '../entities/Player';
import { Enemy } from '../entities/Enemy';
import { GameDataKeys } from '../GameDataKey';
import { SceneNames } from './SceneNames';
import { HealthComponent } from '../components/HealthComponent';

export class MainGameScene extends Scene
{
    private player: Player;
    private bullets: Physics.Arcade.Group;
    private enemies: Physics.Arcade.Group;
    private enemiesBullets: Physics.Arcade.Group;
    private bg: Phaser.GameObjects.TileSprite;
    private planet: Phaser.GameObjects.Image;
    private scoreText: Phaser.GameObjects.Text;
    private enemiesCount: number;
    private enemiesMax: number;
    private roundNumber: number;

    constructor ()
    {
        super(SceneNames.MAIN_GAME_SCENE);
    }

    preload ()
    {
        const width = this.cameras.main.width;

        const x: number = 0;
        const y: number = this.cameras.main.centerY;
        
        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(x, y, width, 64);

        this.load.on('progress', (value: number) => {
            console.log(value);
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(x, y, width * value, 64);
            // value.toFixed(0);
        });

        this.load.on('complete', () => {
            console.log('complete');
            progressBar.destroy();
            progressBox.destroy();
        });

        this.load.setPath('assets');
        
        // this.load.image('bg', 'Backgrounds/blue.png');
        this.load.image('planet', 'Planets/planet06.png');
        this.load.atlas('sprites', 'Spritesheet/texture.png', 'Spritesheet/texture.json');
        this.load.audio("sfx_laser1", "Sounds/sfx_laser1.ogg");
        this.load.audio("sfx_laser2", "Sounds/sfx_laser2.ogg");

        this.load.json("playerShips", "Data/playerShips.json");
    }

    create (data: RoundInitData)
    {
        const colorPalette: string[] = ["8A95A5", "3A1772", "9990D35", "F2CD5D", "61E86"];
        this.cameras.main.setBackgroundColor(0x50514f);

        this.bg = this.add.tileSprite(0, 0, this.cameras.main.width, this.cameras.main.height, "bg").setOrigin(0).setTileScale(2);
        this.planet = this.add.image(0, -512, 'planet').setOrigin(0);

        this.roundNumber = data.round;

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
            maxSize: 6
        });
        GroupUtils.preallocateGroup(this.enemies, 5);

        this.enemiesCount = 0;
        this.enemiesMax = parseInt((data.round * 2).toFixed(0));

        this.player = new Player(this, this.cameras.main.centerX, this.cameras.main.height - 128, 'sprites', 'ship1_frame1.png', this.bullets);
        this.add.existing(this.player);
        this.player.getComponent(HealthComponent)?.once('death', () => this.endGame());

        this.initCollisions();

        this.time.addEvent({
            delay: 1500,
            callback: this.spawnEnemy,
            callbackScope: this,
            loop: true
        });

        this.scene.launch(SceneNames.USER_INTERFACE_SCENE);
    }

    private initCollisions()
    {
        this.physics.add.collider(this.bullets, this.enemies, (bullet, enemy) => {
            (bullet as Bullet).disable();
            (enemy as Enemy).getComponent(HealthComponent)?.inc(-1);

            this.registry.inc(GameDataKeys.PLAYER_SCORE, 1);
        });

        this.physics.add.collider(this.player, this.enemiesBullets, (player, bullet) => {
            (player as Player).getComponent(HealthComponent)?.inc(-1);
            (bullet as Bullet).disable();
        });

        this.physics.add.collider(this.enemies, this.player, (enemy, player) => {
            const enemyHealth = (enemy as Enemy).getComponent(HealthComponent);
            enemyHealth?.inc(-enemyHealth.getMax());
            
            (player as Player).getComponent(HealthComponent)?.inc(-1);
        });
    }

    private endGame()
    {
        this.scene.start(SceneNames.GAME_OVER_SCENE);
    }

    private spawnEnemy()
    {
        if(this.enemies.countActive() >= 5 || this.enemiesCount >= this.enemiesMax)
            return;

        const enemy = this.enemies.get() as Enemy;
        enemy.enable(Phaser.Math.Between(0, this.cameras.main.width), 0, "sprites", "enemy.png");
        this.enemiesCount++;
    }

    update(time: number, delta: number)
    {
        this.bg.tilePositionY -= 0.1 * delta;
        this.planet.y += 0.4 * delta;

        if(this.enemies.countActive() == 0 && this.enemiesCount >= this.enemiesMax)
            this.scene.start(SceneNames.MAIN_GAME_SCENE, {round: this.roundNumber + 1});
    }
}
