import { GameObjects, Physics, Scene, Types } from "phaser";
import { GameDataKeys } from "../GameDataKey";
import { SceneNames } from "./SceneNames";
import { Enemy } from "../entities/Enemy";
import { HealthComponent } from "../components/HealthComponent";

export class UserInterfaceScene extends Scene
{
    private playerScoreText: GameObjects.Text;
    private enemiesLeftCounter: number;
    private enemiesLeftCounterText: GameObjects.Text;

    constructor()
    {
        super(SceneNames.USER_INTERFACE_SCENE);
    }

    preload()
    {
        this.load.setPath('assets');

        this.load.font('future', 'Fonts/kenvector_future.ttf');
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
        const enemiesLeftText = this.add.text(offset, offset, "ENEMIES LEFT", textStyle);
        this.enemiesLeftCounterText = this.add.text(enemiesLeftText.x + enemiesLeftText.displayWidth / 2, offset + enemiesLeftText.displayHeight, this.enemiesLeftCounter.toString(), textStyle).setOrigin(0.5, 0);

        data.enemies.getChildren().forEach(enemy => {
            (enemy as Enemy).getComponent(HealthComponent)?.on('death', () => this.incEnemiesLeftCount(-1));
        });
    }

    private incEnemiesLeftCount(inc: number)
    {
        this.enemiesLeftCounter += inc;
        this.enemiesLeftCounterText.setText(this.enemiesLeftCounter.toString());
    }
}