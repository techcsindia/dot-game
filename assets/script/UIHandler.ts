
import { _decorator, Button, log, Component, director, instantiate, Label, Node, Prefab, Sprite, SpriteFrame, UIOpacity, UITransform } from 'cc';
import { GameController } from './GameController';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = UIHandler
 * DateTime = Thu Sep 14 2023 15:10:12 GMT+0530 (India Standard Time)
 * Author = ankitemk
 * FileBasename = UIHandler.ts
 * FileBasenameNoExtension = UIHandler
 * URL = db://assets/script/UIHandler.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/en/
 *
 */

@ccclass('UIHandler')
export class UIHandler extends Component {

    @property(Node)
    dot_layout: Node = null;

    @property(Node)
    player: Node = null;

    @property(Prefab)
    bar_prefab: Node = null;

    @property(Prefab)
    cell_prefab: Node = null;

    @property(Node)
    block_path_container: Node = null;

    @property(Node)
    menu: Node = null;

    @property(Node)
    game: Node = null;

    @property(Node)
    result: Node = null;

    @property(SpriteFrame)
    default_icon: SpriteFrame = null;

    @property(SpriteFrame)
    end_icon: SpriteFrame = null;

    @property(SpriteFrame)
    player_icon: SpriteFrame = null;

    @property(Node)
    replayButton: Node = null
    @property(Node)
    restartButton: Node = null
    @property(Node)
    nextButton: Node = null

    gameController: GameController = null;

    protected onEnable(): void {
        this.gameController = GameController.getInstance();
        this.menu.active = true;
        this.game.active = false;
        this.result.active = false;
    }
    updateData(data: any): void {
        this.createGrid();   
        this.scheduleOnce(() => {
            this.initUI(data);
        }, 0.001)
    }
    createGrid() {
        this.dot_layout.destroyAllChildren();
        for (let index = 0; index < Math.pow(this.gameController.GRID_LENGTH, 2); index++) {
            let cell = instantiate(this.cell_prefab);
            cell.getChildByName("dot").getComponent(Sprite).spriteFrame = this.default_icon
            cell.getChildByName("text").getComponent(Label).string = (index + 1).toString();
            cell.name = (index + 1).toString();
            cell.setParent(this.dot_layout);
        }
    }
    initUI(data): void {
        this.dot_layout.getChildByName(data.end_index.toString()).getChildByName("dot").getComponent(Sprite).spriteFrame = this.end_icon;
        this.player.setWorldPosition(this.dot_layout.getChildByName(data.start_index.toString()).worldPosition);
        this.dot_layout.getChildByName(data.start_index.toString()).getComponent(UIOpacity).opacity = 100
        this.dot_layout.getChildByName(data.start_index.toString()).getComponent(Button).interactable = false;
        this.createBlockPairUI(data.block_pairs);
    }
    createBlockPairUI(block_pairs): void {
        this.block_path_container.destroyAllChildren();
        block_pairs.forEach(element => {
            let points = element.split("-");
            let point0 = parseInt(points[0]);
            let point1 = parseInt(points[1]);
            let start = this.dot_layout.getChildByName(point0.toString());
            let end = this.dot_layout.getChildByName(point1.toString());
            let bar = instantiate(this.bar_prefab);
            bar.setWorldPosition(start.position);
            const bar_height = 30;
            let x1 = start.position.x;
            let y1 = start.position.y;
            let x2 = end.position.x;
            let y2 = end.position.y;
            let width = Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2))
            if (x1 == x2) {
                // log("Up - DOWN");
                bar.getComponent(UITransform).anchorY = 1
                bar.getComponent(UITransform).setContentSize(bar_height, width);
            }
            else if (y1 == y2) {
                // log("Right - Left");
                bar.getComponent(UITransform).anchorX = 0
                bar.getComponent(UITransform).setContentSize(width, bar_height);
            }
            else {
                if (x1 > x2) {
                    // log("Left Tilt", element)
                    bar.setRotationFromEuler(0, 0, 45)
                }
                else {
                    // log("right Titt", element)
                    bar.setRotationFromEuler(0, 0, 135)
                }
                bar.getComponent(UITransform).anchorX = 1
                bar.getComponent(UITransform).setContentSize(width, bar_height);
            }
            bar.setParent(this.block_path_container);
        });
    }

    startGame() {
        this.menu.active = false;
        this.game.active = true;
        this.gameController.gamePlay();
    }
    gameComplete(isLast: boolean) {
        this.game.active = false;
        this.result.active = true;

        if (isLast) {
            this.result.getChildByName("Title").getComponent(Label).string = "Congratulations You win"
            this.restartButton.active = true;
            this.nextButton.active = false;
        }
        else {
            this.result.getChildByName("Title").getComponent(Label).string = "Level Complete"
            this.restartButton.active = false;
            this.nextButton.active = true;
        }
    }
    NextLevel() {
        this.result.active = false;
        this.game.active = true;
        this.gameController.updateData();
    }
    Restart() {
        this.result.active = false;
        this.game.active = true;
        this.gameController.level = 0;
        this.gameController.updateData();
    }
    Replay() {
        this.result.active = false;
        this.game.active = true;
        this.gameController.level -= 1;
        this.gameController.updateData();
    }
    ReplayFromGame() {
        this.gameController.updateData();
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
