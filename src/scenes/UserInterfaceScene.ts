import { GameObjects, Scene, Types } from "phaser";
import { GameDataKeys } from "../GameDataKey";
import { SceneNames } from "./SceneNames";
import { Enemy } from "../entities/Enemy";
import { HealthComponent } from "../components/HealthComponent";
import { UserInterfaceData } from "../gameData/RoundInitData";

export class UserInterfaceScene extends Scene
{
    private generalTextStyle: Types.GameObjects.Text.TextStyle;
    private playerScoreText: GameObjects.Text;
    private enemiesLeftCounter: number;
    private enemiesLeftCounterText: GameObjects.Text;
    private playerLivesText: GameObjects.Text;
    private playerCoinsText: GameObjects.Text;

    constructor()
    {
        super(SceneNames.USER_INTERFACE_SCENE);
    }

    create(data: UserInterfaceData)
    {
        const offset = 16;
        this.generalTextStyle = {
            fontFamily: 'future',
            align: 'center'
        };

        const textStyle: Types.GameObjects.Text.TextStyle = {
            ...this.generalTextStyle,
            fontSize: '40px'
        };

        const scoreText = this.add.text(this.cameras.main.width - offset, offset, "SCORE", textStyle).setOrigin(1, 0);
        this.playerScoreText = this.add.text(scoreText.x - scoreText.displayWidth / 2, offset + scoreText.displayHeight, this.registry.get(GameDataKeys.PLAYER_SCORE), textStyle).setOrigin(0.5, 0);

        this.registry.events.on("changedata-" + GameDataKeys.PLAYER_SCORE, (_: any, value: number) => this.playerScoreText.setText(value.toString()));

        this.enemiesLeftCounter = data.enemiesLeft;
        const skullImage = this.add.image(offset, offset, "sprites", "skull.png").setOrigin(0);
        this.enemiesLeftCounterText = this.add.text(skullImage.x + skullImage.displayWidth, skullImage.y + skullImage.displayHeight / 2, this.enemiesLeftCounter.toString(), textStyle).setOrigin(0, 0.5);

        data.enemies.getChildren().forEach(enemy => {
            (enemy as Enemy).getComponent(HealthComponent)?.on('death', () => this.incEnemiesLeftCount(-1));
        });

        data.enemies.once('dead', () => this.launchRoundEndText());

        const shieldImage = this.add.image(this.cameras.main.width - offset, this.cameras.main.height - offset, "sprites", "shield.png").setOrigin(1);
        const playerHealth = data.player.getComponent(HealthComponent);
        this.playerLivesText = this.add.text(shieldImage.x - shieldImage.width, shieldImage.y - shieldImage.displayHeight / 2, playerHealth ? playerHealth?.getValue().toString() : "?", textStyle).setOrigin(1, 0.5);
        playerHealth?.on('change', () => this.playerLivesText.setText(playerHealth.getValue().toString()));
    
        const coinImage = this.add.image(shieldImage.x, shieldImage.y - shieldImage.displayHeight - offset, "sprites", "tokens.png").setOrigin(1);
        this.playerCoinsText = this.add.text(this.playerLivesText.x, coinImage.y, this.registry.get(GameDataKeys.PLAYER_COINS).toString(), textStyle).setOrigin(1);
        this.registry.events.on("changedata-" + GameDataKeys.PLAYER_COINS, (_: any, value: number) => this.playerCoinsText.setText(value.toString()));

        this.launchRoundBeginText(data.round);
    }

    private launchRoundBeginText(round: number)
    {
        const roundText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, "ROUND " + round, {...this.generalTextStyle, fontSize: "128px"}).setOrigin(0.5);
        const goText = this.add.text(roundText.x, roundText.y + 64, "GO !", {...this.generalTextStyle, fontSize: "64px"}).setOrigin(0.5, 0).setAlpha(0);
    
        this.time.addEvent({
            delay: 1000,
            callback: () => goText.setAlpha(1),
            callbackScope: this
        });

        this.time.addEvent({
            delay: 2000,
            callback: () => {
                roundText.destroy();
                goText.destroy();
            },
            callbackScope: this
        });
    }

    private launchRoundEndText()
    {
        const roundText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, "ROUND", {...this.generalTextStyle, fontSize: "128px"}).setOrigin(0.5);
        this.add.text(roundText.x, roundText.y + 64, "CLEARED", {...this.generalTextStyle, fontSize: "64px"}).setOrigin(0.5, 0);

        const spaceKeyImage = this.add.image(this.cameras.main.centerX, this.cameras.main.height - 32, "sprites", "space.png").setScale(2).setOrigin(0.5, 1).setAlpha(0.2);
        this.add.tween({
            targets: spaceKeyImage,
            alpha: 1,
            ease: 'Quad.easeInOut',
            repeat: -1,
            yoyo: true,
            duration: 1000
        });
    }

    private incEnemiesLeftCount(inc: number)
    {
        this.enemiesLeftCounter += inc;
        this.enemiesLeftCounterText.setText(this.enemiesLeftCounter.toString());
    }
}