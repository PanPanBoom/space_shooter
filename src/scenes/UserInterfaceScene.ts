import { GameObjects, Scene } from "phaser";
import { GameDataKeys } from "../GameDataKey";
import { SceneNames } from "./SceneNames";

export class UserInterfaceScene extends Scene
{
    private scoreText: GameObjects.Text;

    constructor()
    {
        super(SceneNames.USER_INTERFACE_SCENE);
    }

    create()
    {
        console.log("creating user interface");
        this.add.text(this.cameras.main.centerX, 16, "SCORE", { fontSize: '40px', align: 'center'}).setOrigin(0.5);
        this.scoreText = this.add.text(this.cameras.main.centerX, 48, this.registry.get(GameDataKeys.PLAYER_SCORE), { fontSize: '40px', align: 'center'}).setOrigin(0.5);

        this.registry.events.on("changedata-" + GameDataKeys.PLAYER_SCORE, (_: any, value: number) => {
            this.scoreText.setText(value.toString());
        });
    }
}