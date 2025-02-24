import { Game, GameObjects, Physics, Scene } from 'phaser';

export class MainGameScene extends Scene
{
    private player: Phaser.GameObjects.Image;
    private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
    private playerRateOfFire: number = 0.5;
    private lastShotTime: number = 0;
    private bullets: Physics.Arcade.Group;
    private enemies: Physics.Arcade.Group;
    private enemiesBullets: Physics.Arcade.Group;
    private playerPhysic: Physics.Arcade.Group;
    private score: number = 0;
    private bg: Phaser.GameObjects.TileSprite;
    private planet: Phaser.GameObjects.Image;
    private playerShipData: PlayerShipData;
    private enemiesTimerMap: Map<GameObjects.GameObject, Phaser.Time.TimerEvent>

    constructor ()
    {
        super('MainGameScene');
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

        const playersShipsData = this.cache.json.get('playerShips') as PlayerShipsData;
        this.playerShipData = playersShipsData[1];

        this.player = this.add.image(this.cameras.main.centerX, this.cameras.main.height - 128, 'sprites', this.playerShipData.texture).setAngle(-90).setOrigin(0.5);

        if(this.input.keyboard)
        {
            this.cursorKeys = this.input.keyboard.createCursorKeys();
            this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE).on('down', () => this.selectShip(1));
            this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO).on('down', () => this.selectShip(2));
        }

        else
            console.error("No keyboard input");

        this.enemiesTimerMap = new Map();

        this.bullets = this.physics.add.group();
        this.enemies = this.physics.add.group();
        this.enemiesBullets = this.physics.add.group();
        this.playerPhysic = this.physics.add.group();
        this.playerPhysic.add(this.player);

        let playerBody: Physics.Arcade.Body = this.player.body as Physics.Arcade.Body;
        playerBody.setFriction(0, 0);
        playerBody.allowGravity = false;

        this.physics.add.collider(this.bullets, this.enemies, (bullet, enemy) => {
            bullet.destroy();
            this.enemiesTimerMap.get(enemy as GameObjects.GameObject)?.destroy();
            enemy.destroy();
            this.score += 1;
            console.log("score : " + this.score);
        }, undefined, this);

        this.physics.add.collider(this.enemiesBullets, this.playerPhysic, () => {
            this.scene.restart();
        });

        this.anims.create({
            key: 'enemyShoot',
            frames: [
                { key: 'sprites', frame: 'enemy.png' },
                { key: 'sprites', frame: 'shoot1.png' },
                { key: 'sprites', frame: 'shoot2.png'}
            ],
            frameRate: 4,
        });

        this.time.addEvent({
            delay: 1500,
            callback: this.spawnEnemy,
            callbackScope: this,
            loop: true
        });

        this.score = 0;
        this.lastShotTime = 0;
    }

    private spawnEnemy()
    {
        if(this.enemies.getLength() >= 5)
            return;

        const enemySize: number = 32;
        let enemy: GameObjects.Sprite = this.add.sprite(Phaser.Math.Between(enemySize, this.cameras.main.width - enemySize), -enemySize / 2, "sprites", "enemy.png").setAngle(90).setDepth(100);
        this.enemies.add(enemy);
        let enemyBody: Physics.Arcade.Body = enemy.body as Physics.Arcade.Body;
        enemyBody.allowGravity = false;
        enemyBody.setFriction(0, 0);
        enemyBody.setVelocityY(256);

        this.enemiesTimerMap.set(enemy, this.time.addEvent({
            delay: 1500,
            callback: this.enemyShoot,
            args: [enemy],
            callbackScope: this,
            loop: true
        }));
    }

    private selectShip(index: number)
    {
        const playerShips = this.cache.json.get("playerShips") as PlayerShipsData;
        this.playerShipData = playerShips[index];

        this.player.setTexture("sprites", this.playerShipData.texture);
    }
    
    private enemyShoot(enemy: GameObjects.Sprite)
    {
        enemy.play('enemyShoot');
        enemy.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
            let bullet: GameObjects.Rectangle = this.add.rectangle((enemy as GameObjects.Sprite).x, (enemy as GameObjects.Sprite).y - (enemy as GameObjects.Sprite).displayHeight / 2, 4, 12, 0xffe066).setOrigin(0.5);
            this.enemiesBullets.add(bullet);
            let bulletBody: Physics.Arcade.Body = bullet.body as Physics.Arcade.Body;
            bulletBody.allowGravity = false;
            bulletBody.setFriction(0, 0);
            bulletBody.setVelocityY(1024);
        });
    }

    update(time: number, delta: number)
    {
        this.bg.tilePositionY -= 0.1 * delta;
        this.planet.y += 0.4 * delta;

        if(this.player && this.playerShipData)
        {
            if(this.cursorKeys.left.isDown)
                this.player.x -= this.playerShipData.movementSpeed * delta;
        
            else if(this.cursorKeys.right.isDown)
                this.player.x += this.playerShipData.movementSpeed * delta
        }
        
        
        if(this.cursorKeys.space.isDown && time - this.lastShotTime > this.playerRateOfFire * 1000)
        {
            let bullet: GameObjects.Rectangle = this.add.rectangle(this.player.x, this.player.y - this.player.displayHeight / 2, 4, 12, 0xffe066).setOrigin(0.5);
            this.bullets.add(bullet);
            let bulletBody: Physics.Arcade.Body = bullet.body as Physics.Arcade.Body;
            bulletBody.allowGravity = false;
            bulletBody.setFriction(0, 0);
            bulletBody.setVelocityY(-1024);
                
            this.lastShotTime = time;

            this.sound.play("sfx_laser1");
        }

        this.player.x = Phaser.Math.Clamp(this.player.x, this.player.displayWidth / 2, this.cameras.main.width - this.player.displayWidth / 2);
    
        this.bullets.getChildren().forEach(bullet => {
            if((bullet as GameObjects.Rectangle).y < -(bullet as GameObjects.Rectangle).displayHeight)
                bullet.destroy();
        });

        this.enemies.getChildren().forEach((enemy, i) => {
            if((enemy as GameObjects.Sprite).y >= this.cameras.main.height + (enemy as GameObjects.Sprite).displayHeight)
            {
                enemy.destroy();
                this.enemiesTimerMap.get(enemy)?.destroy();
            }
        });

        this.enemiesBullets.getChildren().forEach((bullet) => {
            if((bullet as GameObjects.Arc).y >= this.cameras.main.height + (bullet as GameObjects.Arc).displayHeight)
                bullet.destroy();
        });
    }
}
