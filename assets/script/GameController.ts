
import { _decorator, Button, Component, log, tween, UIOpacity } from 'cc';
import { DataController } from './DataController';
import { UIHandler } from './UIHandler';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = GameController
 * DateTime = Wed Sep 13 2023 21:18:53 GMT+0530 (India Standard Time)
 * Author = ankitemk
 * FileBasename = GameController.ts
 * FileBasenameNoExtension = GameController
 * URL = db://assets/script/GameController.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/en/
 *
 */
enum MOVE_TYPE { HV, Diagonal, Cross }
@ccclass('GameController')
export class GameController extends Component {


    GRID_LENGTH = 3
    start_index: number = 0;
    end_index: number = 0;
    block_pairs = [];

    level_data: any = null;
    level: number = 0;
    player_index: number = 0;
    visited_index: Array<number> = [];

    dataController: DataController = null;
    uiHandler: UIHandler = null;
    static _instance: GameController = null;

    public static getInstance(): GameController {
        if (GameController._instance) {
            return GameController._instance
        } else {
            return GameController._instance = new GameController();
        }
    }
    protected onLoad(): void {
        GameController._instance = this;
        this.dataController = this.node.getComponent(DataController);
        this.uiHandler = this.node.getComponent(UIHandler);
    }
    gamePlay() {
        this.updateData();
    }
    updateData() {
        this.resetLevel();
        this.level_data = this.dataController.getLevelData(this.level);
        this.initData();
        this.uiHandler.updateData(this.level_data);
        this.initLevel();
    }
    resetLevel() {
        this.start_index = 0;
        this.end_index = 0;
        this.block_pairs = [];
        this.player_index = 0;
        this.visited_index = [];
    }
    initData() {
        if (!this.level_data) return;
        this.start_index = this.level_data.start_index;
        this.end_index = this.level_data.end_index;
        this.block_pairs = this.level_data.block_pairs;
    }
    initLevel() {
        this.visited_index.push(this.start_index);
        this.player_index = this.start_index;

    }
    dotOnClick(index) {
        // log("Tap on Index : ", index);
        if (this.checkEndNode(index)) {
            if (this.isActiveEndNode()) {
                this.playerMove(index);
            }
            else {
                // log("Visit All Node Before Visit End Index");
            }

        } else {
            this.playerMove(index)
        }
    }
    playerMove(index: number) {
        if (this.isPlayerMoveToIndex(index)) {
            tween(this.uiHandler.player).to(0.5, {
                worldPosition: this.uiHandler.dot_layout.getChildByName(index.toString()).worldPosition
            }, { easing: "sineInOut" })
                .call(() => {
                    this.visited_index.push(index);
                    this.player_index = index;
                    this.uiHandler.dot_layout.getChildByName(index.toString()).getComponent(UIOpacity).opacity = 150
                    this.uiHandler.dot_layout.getChildByName(index.toString()).getComponent(Button).interactable = false;
                    if (this.checkLevelComplete()) {
                        // log("Level Complete")
                        this.levelComplete();
                    }
                })
                .start()
        }
        else {
            // log("Movement Not Possible")
        }
    }
    levelComplete() {
        this.scheduleOnce(() => {
            this.level += 1;
            if (this.dataController.isLastLevel()) {
                this.uiHandler.gameComplete(true);
            }
            else {
                this.uiHandler.gameComplete(false);
            }

        }, 1)

    }
    checkBlockPairCollide(index: number): boolean {
        let move_type: MOVE_TYPE = null;
        let start = 0;
        let end = 0;
        let combination_path_arr = [];
        if (this.player_index < index) {
            start = this.player_index;
            end = index;
        }
        else {
            start = index;
            end = this.player_index;
        }
        let start_cordinate = this.getRowCol(start);
        let end_cordinate = this.getRowCol(end);
        let r1 = start_cordinate["row"];
        let r2 = end_cordinate["row"];
        let c1 = start_cordinate["col"];
        let c2 = end_cordinate["col"];
        let path = start + "-" + end
        combination_path_arr.push(path)
        // log(r1, r2, c1, c2)
        if (r1 == r2 || c1 == c2) {
            move_type = MOVE_TYPE.HV
        }
        else if (r1 - 1 == r2 && c1 - 1 == c2) {
            move_type = MOVE_TYPE.Diagonal
        }
        else if (r1 + 1 == r2 && c1 + 1 == c2) {
            move_type = MOVE_TYPE.Diagonal
        }
        else if (r1 - 1 == r2 && c1 + 1 == c2) {
            move_type = MOVE_TYPE.Diagonal
        }
        else if (r1 + 1 == r2 && c1 - 1 == c2) {
            move_type = MOVE_TYPE.Diagonal
        }
        else if (r1 + 1 == r2 && c1 + 2 == c2) {
            move_type = MOVE_TYPE.Cross
        }
        else if (r1 + 2 == r2 && c1 + 1 == c2) {
            move_type = MOVE_TYPE.Cross
        }
        else if (r1 + 1 == r2 && c1 - 2 == c2) {
            move_type = MOVE_TYPE.Cross
        }
        else if (r1 + 2 == r2 && c1 - 1 == c2) {
            move_type = MOVE_TYPE.Cross
        }


        switch (move_type) {
            case MOVE_TYPE.HV:
                // log("Horizontal Move");
                if (r1 == r2) {
                    let distance = Math.abs(c1 - c2);
                    if (distance == 2) {
                        // log("2 Block Movement Col")
                        let path_diagonal_1 = this.getIndex(r1, c1) + "-" + this.getIndex(r1, c1 + 1);
                        let path_diagonal_2 = this.getIndex(r1, c1 + 1) + "-" + this.getIndex(r1, c1 + 2);
                        combination_path_arr.push(path_diagonal_1)
                        combination_path_arr.push(path_diagonal_2)
                    }
                }
                else if (c1 == c2) {
                    let distance = Math.abs(r1 - r2);
                    if (distance == 2) {
                        // log("2 Block Movement Row")
                        let path_diagonal_1 = this.getIndex(r1, c1) + "-" + this.getIndex(r1 + 1, c1);
                        let path_diagonal_2 = this.getIndex(r1 + 1, c1) + "-" + this.getIndex(r1 + 2, c1);
                        combination_path_arr.push(path_diagonal_1)
                        combination_path_arr.push(path_diagonal_2)
                    }
                }
                break;
            case MOVE_TYPE.Diagonal:
                // log("Diagonal Move")
                let path_diagonal_1 = (start - 1) + "-" + (end + 1)
                let path_diagonal_2 = (start + 1) + "-" + (end - 1)
                combination_path_arr.push(path_diagonal_1)
                combination_path_arr.push(path_diagonal_2)
                break;
            case MOVE_TYPE.Cross:
                if (Math.abs(r1 - r2) == 1) {
                    // log("Next Row")
                    let path_diagonal_1 = this.getIndex(r1, c1 + 1) + "-" + this.getIndex(r1 + 1, c1);
                    let path_diagonal_2 = this.getIndex(r1, c1 + 1) + "-" + this.getIndex(r1 + 1, c1 + 1);
                    let path_diagonal_3 = this.getIndex(r1, c1 + 2) + "-" + this.getIndex(r1 + 2, c1 + 1);
                    let path_diagonal_4 = this.getIndex(r1, c1 - 1) + "-" + this.getIndex(r1 + 1, c1);
                    let path_diagonal_5 = this.getIndex(r1, c1 - 1) + "-" + this.getIndex(r1 + 1, c1 - 1);
                    let path_diagonal_6 = this.getIndex(r1, c1 - 2) + "-" + this.getIndex(r1 + 1, c1 - 1);

                    combination_path_arr.push(path_diagonal_1)
                    combination_path_arr.push(path_diagonal_2)
                    combination_path_arr.push(path_diagonal_3)
                    combination_path_arr.push(path_diagonal_4)
                    combination_path_arr.push(path_diagonal_5)
                    combination_path_arr.push(path_diagonal_6)
                }
                else {
                    // log("2 Next Row")
                    let path_diagonal_1 = this.getIndex(r1, c1 + 1) + "-" + this.getIndex(r1 + 1, c1)
                    let path_diagonal_2 = this.getIndex(r1 + 1, c1) + "-" + this.getIndex(r1 + 1, c1 + 1)
                    let path_diagonal_3 = this.getIndex(r1 + 1, c1 + 1) + "-" + this.getIndex(r1 + 2, c1)
                    let path_diagonal_4 = this.getIndex(r1, c1 - 1) + "-" + this.getIndex(r1 + 1, c1 + 1)
                    let path_diagonal_5 = this.getIndex(r1 + 1, c1 - 1) + "-" + this.getIndex(r1 + 1, c1)
                    let path_diagonal_6 = this.getIndex(r1 - 1, c1 + 1) + "-" + this.getIndex(r1 + 2, c1 + 1)

                    combination_path_arr.push(path_diagonal_1)
                    combination_path_arr.push(path_diagonal_2)
                    combination_path_arr.push(path_diagonal_3)
                    combination_path_arr.push(path_diagonal_4)
                    combination_path_arr.push(path_diagonal_5)
                    combination_path_arr.push(path_diagonal_6)
                }
                break;
            default:
                break;
        }
        let flag = 1;

        combination_path_arr.forEach(element => {

            if (this.block_pairs.indexOf(element) >= 0) {
                flag = 0
                return false;
            }
        });
        return flag == 1 ? true : false
    }
    getRowCol(index: number): { "row": number; "col": number } {
        let row = Math.floor((index - 1) / this.GRID_LENGTH);
        let col = (index - 1) % this.GRID_LENGTH;
        return { "row": row, "col": col }
    }
    checkLevelComplete(): boolean {
        return this.visited_index.length == this.uiHandler.dot_layout.children.length
    }
    isPlayerMoveToIndex(index: number): boolean {
        return this.visited_index.indexOf(index) == -1 && this.checkBlockPairCollide(index) ? true : false;
    }
    getIndex(row: number, col: number): number {
        return ((row * this.GRID_LENGTH) + col) + 1
    }
    checkEndNode(index: number): boolean {
        return index == this.end_index ? true : false
    }
    isActiveEndNode(): boolean {
        return this.visited_index.length == this.uiHandler.dot_layout.children.length - 1 ? true : false
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
