import GraphicsHelper from './helper/GraphicsHelper.js';
import Utils from './Utils.js';

export class UIKitToggleButton extends PIXI.Container {
    /**
     * 
     * @param {PIXI.Application} app - PIXIアプリのインスタンス
     * @param {bool} bool - デフォルトの値
     */

    constructor(app, bool = true, label = false) {
        super();

        app.stage.hitArea = app.screen;

        this.val = bool;

        const baseSize = 64;
        const offset = 2;

        const black = new PIXI.Graphics().beginFill(0x000000).drawRoundedRect(0, 0, baseSize * 2, baseSize, baseSize / 2);
        this.addChild(black);

        const background = new PIXI.Graphics().lineStyle(2, 0xFFFFFF).beginFill(0xD9D9D9).drawRoundedRect(0, 0, baseSize * 2, baseSize, baseSize / 2);
        this.addChild(background);
        background.cursor = 'pointer';
        background.eventMode = 'static';

        const button = new PIXI.Graphics().lineStyle(4, 0x666666).beginFill(0xFFFFFF).drawCircle(0, 0, baseSize / 2 - offset * 2);
        button.x = baseSize / 2;
        button.y = baseSize / 2;
        this.addChild(button);

        if(label !== false){
            const valText = this.addChild(new PIXI.Text(label, {
                fontSize: 25, fill: 0x000000,
            }));
            valText.anchor.set(0.5, 0.5);
            valText.x = baseSize;
            // valText.x = baseSize * 2.2;
            valText.y = baseSize / 2;
        }
        
        const onToggle = (e) => {
            this.val = this.val ? false : true;
            update();
            this.emit("customEvent", { 
                value  : this.val,
                message: "イベントが発火されました！"
            });
        }
        
        const update = () => {
            background.alpha = this.val ? 1 : 0.7;
            button.alpha = this.val ? 1 : 0.8;
            button.x = this.val ? Math.round(baseSize * 1.5) : baseSize / 2;
        }
        
        update();
        background.on('pointerdown', onToggle);
    }
}