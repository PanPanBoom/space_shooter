import { Scene } from "phaser";
import { SceneNames } from "./SceneNames";

export class MainMenuScene extends Scene
{
    constructor()
    {
        super(SceneNames.MAIN_MENU_SCENE);
    }

    create()
    {
        this.cameras.main.setBackgroundColor(0x00000);
        this.add.text(400, 300, 'Main Menu', {fontSize: '32px', color: 'white'}).setOrigin(0.5);
        this.add.text(400, 350, 'Press SPACE to start', {fontSize: '32px', color: 'white'}).setOrigin(0.5);

        this.input.keyboard?.once('keydown-SPACE', () => {
            this.scene.start(SceneNames.MAIN_GAME_SCENE);
        })
    }
}