import { SceneNames } from "./SceneNames";
import { BaseScene } from "./BaseScene";
import { ShopButton } from "../ui/ShopButton";

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
    }
}