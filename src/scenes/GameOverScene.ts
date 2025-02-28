import { Scene } from "phaser";
import { GameDataKeys } from "../GameDataKey";
import { SceneNames } from "./SceneNames";

export class GameOverScene extends Scene
{
    constructor()
    {
        super(SceneNames.GAME_OVER_SCENE);
    }

    create()
    {
        this.cameras.main.setBackgroundColor(0x00000);
        this.add.text(400, 300, 'GAME OVER', {fontSize: '32px', color: 'white'}).setOrigin(0.5);
        this.add.text(400, 350, 'Score : ' + this.registry.get(GameDataKeys.PLAYER_SCORE), {fontSize: '32px', color: 'white'}).setOrigin(0.5);

        this.add.text(400, 800, 'Press SPACE to play again', {fontSize: '32px', color: 'white'}).setOrigin(0.5);

        this.input.keyboard?.once('keydown-SPACE', () => {
            this.registry.set<number>(GameDataKeys.PLAYER_SCORE, 0);
            this.scene.start(SceneNames.MAIN_GAME_SCENE, {round: 1});
        })
    }
}