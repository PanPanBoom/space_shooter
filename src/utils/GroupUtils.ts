import { GameObjects, Physics } from "phaser";
export class GroupUtils
{
    public static preallocateGroup(group: GameObjects.Group, size: number)
    {
        if(group.getLength() >= size)
            return;

        const canBeDisabled = group.classType && typeof group.classType.prototype.disable === 'function'; 
        for(let i = 0; i < size; i++)
        {
            let groupItem = group.create();
            if(canBeDisabled)
                groupItem.disable();
        }
    }
}