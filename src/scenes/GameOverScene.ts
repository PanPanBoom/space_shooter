import { Scene } from "phaser";
import { GameDataKeys } from "../GameDataKey";
import { SceneNames } from "./SceneNames";
import { PlayerState } from "../states/PlayerState";

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
        this.add.text(400, 350, 'Score : ' + this.registry.get(GameDataKeys.PLAYER_STATE).getScore(), {fontSize: '32px', color: 'white'}).setOrigin(0.5);

        this.add.text(400, 800, 'Press SPACE to play again', {fontSize: '32px', color: 'white'}).setOrigin(0.5);

        this.input.keyboard?.once('keydown-SPACE', () => {
            this.registry.set<PlayerState>(GameDataKeys.PLAYER_STATE, new PlayerState());
            this.registry.set<number>(GameDataKeys.ROUND_NUMBER, 1);
            this.scene.start(SceneNames.MAIN_GAME_SCENE);
        })
    }
}