import { Scene } from "phaser";
import { SceneNames } from "./SceneNames";
import { BaseScene } from "./BaseScene";
import { ShopButton } from "../ui/ShopButton";
import { Potion } from "../items/Potion";

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