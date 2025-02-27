import { GameObjects, Scene, Types } from "phaser";
import { GameDataKeys } from "../GameDataKey";
import { SceneNames } from "./SceneNames";
import { Enemy } from "../entities/Enemy";
import { HealthComponent } from "../components/HealthComponent";
import { UserInterfaceData } from "../gameData/RoundInitData";

export class UserInterfaceScene extends Scene
{
    private playerScoreText: GameObjects.Text;
    private enemiesLeftCounter: number;
    private enemiesLeftCounterText: GameObjects.Text;
    private playerLivesText: GameObjects.Text;

    constructor()
    {
        super(SceneNames.USER_INTERFACE_SCENE);
    }

    create(data: UserInterfaceData)
    {
        const offset = 16;
        const textStyle: Types.GameObjects.Text.TextStyle = {
            fontSize: '40px',
            fontFamily: 'future',
            align: 'center'
        };

        const scoreText = this.add.text(this.cameras.main.width - offset, offset, "SCORE", textStyle).setOrigin(1, 0);
        this.playerScoreText = this.add.text(scoreText.x - scoreText.displayWidth / 2, offset + scoreText.displayHeight, this.registry.get(GameDataKeys.PLAYER_SCORE), textStyle).setOrigin(0.5, 0);

        this.registry.events.on("changedata-" + GameDataKeys.PLAYER_SCORE, (_: any, value: number) => {
            this.playerScoreText.setText(value.toString());
        });

        this.enemiesLeftCounter = data.enemiesLeft;
        const skullImage = this.add.image(offset, offset, "sprites", "skull.png").setOrigin(0);
        this.enemiesLeftCounterText = this.add.text(skullImage.x + skullImage.displayWidth, skullImage.y + skullImage.displayHeight / 2, this.enemiesLeftCounter.toString(), textStyle).setOrigin(0, 0.5);

        data.enemies.getChildren().forEach(enemy => {
            (enemy as Enemy).getComponent(HealthComponent)?.on('death', () => this.incEnemiesLeftCount(-1));
        });

        const shieldImage = this.add.image(this.cameras.main.width - offset, this.cameras.main.height - offset, "sprites", "shield.png").setOrigin(1);
        const playerHealth = data.player.getComponent(HealthComponent);
        this.playerLivesText = this.add.text(shieldImage.x - shieldImage.width, shieldImage.y - shieldImage.displayHeight / 2, playerHealth ? playerHealth?.getValue().toString() : "?", textStyle).setOrigin(1, 0.5);
    }

    private incEnemiesLeftCount(inc: number)
    {
        this.enemiesLeftCounter += inc;
        this.enemiesLeftCounterText.setText(this.enemiesLeftCounter.toString());
    }
}