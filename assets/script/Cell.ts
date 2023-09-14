
import { _decorator, Component, Node } from 'cc';
import { GameController } from './GameController';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = Cell
 * DateTime = Thu Sep 14 2023 15:10:30 GMT+0530 (India Standard Time)
 * Author = ankitemk
 * FileBasename = Cell.ts
 * FileBasenameNoExtension = Cell
 * URL = db://assets/script/Cell.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/en/
 *
 */

@ccclass('Cell')
export class Cell extends Component {
    gameController : GameController = null
    protected onEnable(): void {
        this.gameController = GameController.getInstance();
    }

    onClick(event) {
        let index = parseInt(event.target.name);
        console.log("Click On :", index)
        this.gameController.dotOnClick(index);
    }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.4/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.4/manual/en/scripting/decorator.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.4/manual/en/scripting/life-cycle-callbacks.html
 */
