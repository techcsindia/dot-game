
import { _decorator, Component, JsonAsset, Node } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = DataController
 * DateTime = Thu Sep 14 2023 15:10:04 GMT+0530 (India Standard Time)
 * Author = ankitemk
 * FileBasename = DataController.ts
 * FileBasenameNoExtension = DataController
 * URL = db://assets/script/DataController.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/en/
 *
 */

@ccclass('DataController')
export class DataController extends Component {
    @property(JsonAsset)
    json_data: JsonAsset = null;
    data: any = null;
    current_level: number = 0;
    protected onLoad(): void {
        this.data = this.json_data.json;
    }
    getLevelData(level_number: number) {
        if (this.data["level"].length > level_number) {
            this.current_level = level_number;
            return this.data["level"][level_number]
        }
        else {
            console.log("Game Complete");
            return null;
        }
    }
    isLastLevel(): boolean {
        console.log(this.data["level"].length + "::::" + (this.current_level + 1))
        return this.data["level"].length == (this.current_level + 1) ? true : false
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
