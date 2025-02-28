import { Physics } from 'phaser';
import { Bullet } from '../entities/Bullet';
import { GroupUtils } from '../utils/GroupUtils';
import { Player } from '../entities/Player';
import { Enemy } from '../entities/Enemy';
import { GameDataKeys } from '../GameDataKey';
import { SceneNames } from './SceneNames';
import { HealthComponent } from '../components/HealthComponent';
import { UserInterfaceScene } from './UserInterfaceScene';
import { RoundInitData } from '../gameData/RoundInitData';
import { BaseScene } from './BaseScene';
import { PlayerState } from '../states/PlayerState';

export class MainGameScene extends BaseScene
{
    private player: Player;
    private enemies: Physics.Arcade.Group;
    private enemiesBullets: Physics.Arcade.Group;
    private planet: Phaser.GameObjects.Image;
    private enemiesCount: number;
    private enemiesMax: number;
    private enemiesLeft: number;
    private roundNumber: number;
    private isRoundCleared: boolean;

    constructor ()
    {
        super(SceneNames.MAIN_GAME_SCENE);
    }

    create (data: RoundInitData)
    {
        super.create();
        const colorPalette: string[] = ["8A95A5", "3A1772", "9990D35", "F2CD5D", "61E86"];
        this.cameras.main.setBackgroundColor(0x50514f);

        this.planet = this.add.image(0, -512, 'planet').setOrigin(0);

        this.roundNumber = data.round;

        this.enemiesBullets = this.physics.add.group({
            classType: Bullet,
            runChildUpdate: true,
            createCallback: (bullet) => {
                (bullet as Bullet).init();
            },
            maxSize: 1024
        });
        GroupUtils.preallocateGroup(this.enemiesBullets, 5);

        this.player = new Player(this, this.cameras.main.centerX, this.cameras.main.height + 200, 'sprites', 'ship1_frame1.png');
        this.add.existing(this.player);
        this.player.getComponent(HealthComponent)?.once('death', () => this.endGame());

        this.add.tween({
            targets: this.player,
            ease: 'Linear',
            duration: 1500,
            y: this.cameras.main.height - 128
        });

        this.enemies = this.physics.add.group({
            classType: Enemy,
            runChildUpdate: true,
            createCallback: (enemy) => {
                (enemy as Enemy).init(this, "sprites", "enemy.png", this.enemiesBullets);
                (enemy as Enemy).on('outscreen', () => this.player.getComponent(HealthComponent)?.inc(-1));
            },
            maxSize: 6
        });
        GroupUtils.preallocateGroup(this.enemies, 5);

        this.enemiesCount = 0;
        this.enemiesMax = parseInt((data.round * 2).toFixed(0));
        this.enemiesLeft = this.enemiesMax;

        this.initCollisions();

        this.time.addEvent({
            delay: 1500,
            callback: this.spawnEnemy,
            callbackScope: this,
            loop: true
        });

        this.scene.launch(SceneNames.USER_INTERFACE_SCENE, {round: this.roundNumber, enemiesLeft: this.enemiesLeft, enemies: this.enemies, player: this.player});
        this.isRoundCleared = false;
    }

    private initCollisions()
    {
        const playerState = this.registry.get(GameDataKeys.PLAYER_STATE);

        this.physics.add.collider(this.player.getBullets(), this.enemies, (bullet, enemy) => {
            (bullet as Bullet).disable();
            (enemy as Enemy).getComponent(HealthComponent)?.inc(-1);

            playerState.incScore(1);
            playerState.incCoins(1);
            // this.registry.inc(GameDataKeys.PLAYER_SCORE, 1);
            // this.registry.inc(GameDataKeys.PLAYER_COINS, 1);
        });

        this.physics.add.overlap(this.player, this.enemiesBullets, (player, bullet) => {
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

    private roundCleared()
    {
        this.isRoundCleared = true;
        this.enemies.emit('dead');
        this.player.roundCleared();

        if(this.input.keyboard)
            this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE).on('down', () => this.scene.start(SceneNames.MAIN_GAME_SCENE, {round: this.roundNumber + 1}));
        else
            console.error("No keyboard input");
    }

    private spawnEnemy()
    {
        if(this.enemies.countActive() >= 5 || this.enemiesCount >= this.enemiesMax)
            return;

        const enemy = this.enemies.get() as Enemy;
        enemy.enable(Phaser.Math.Between(0, this.cameras.main.width), 0, "sprites", "enemy.png", (this.scene.get(SceneNames.USER_INTERFACE_SCENE) as UserInterfaceScene));
        this.enemiesCount++;
    }

    update(time: number, delta: number)
    {
        super.update(time, delta);
        this.planet.y += 0.4 * delta;

        if(this.enemies.countActive() == 0 && this.enemiesCount >= this.enemiesMax && !this.isRoundCleared)
            this.roundCleared();
    }
}
