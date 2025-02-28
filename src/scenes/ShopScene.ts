import { SceneNames } from "./SceneNames";
import { BaseScene } from "./BaseScene";
import { ShopButton } from "../ui/ShopButton";
import { Item } from "../items/Item";
import { GameDataKeys } from "../GameDataKey";

export class ShopScene extends BaseScene
{
    constructor()
    {
        super(SceneNames.SHOP_SCENE);
    }

    create()
    {
        super.create();

        const button = new ShopButton(this, 100, 100);

        button.on('click', (item: Item) => this.buyItem(item));
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