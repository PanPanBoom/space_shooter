import { SceneNames } from "./SceneNames";
import { BaseScene } from "./BaseScene";
import { ShopButton } from "../ui/ShopButton";
import { Item } from "../items/Item";
import { GameDataKeys } from "../GameDataKey";
import { Actions } from "phaser";

export class ShopScene extends BaseScene
{
    constructor()
    {
        super(SceneNames.SHOP_SCENE);
    }

    create()
    {
        super.create();

        const buttons = [];
        for(let i = 0; i < 3; i++)
        {
            buttons.push(new ShopButton(this, 0, 0));
            buttons[buttons.length - 1].on('click', (item: Item) => this.buyItem(item));
        }

        Actions.GridAlign(buttons, {
                width: 3,
                height: 1,
                cellWidth: this.cameras.main.width / 3,
                cellHeight: this.cameras.main.height,
                x: 0,
                y: this.cameras.main.centerY - 200

        })
        // const button = new ShopButton(this, 100, 100);

        // button.on('click', (item: Item) => this.buyItem(item));
    }

    private buyItem(item: Item)
    {
        const playerState = this.registry.get(GameDataKeys.PLAYER_STATE);
            if(playerState.getCoins() > item.getPrice())
            {
                playerState.addItem(item);
                playerState.incCoins(-item.getPrice());
                this.scene.start(SceneNames.MAIN_GAME_SCENE);
            }

            else
                console.log("not enough coins");
    }
}