import Utils from './Utils.js';

export class UIKitSlider extends PIXI.Container {
    /**
     * 
     * @param {PIXI.Application} app - PIXIアプリのインスタンス
     * @param {number} sliderWidth - 作成するSliderの幅
     * @param {object} targetObject - 対象オブジェクト
     * @param {string} keyString - 対象パラメータ名
     * @param {number} minVal - スライダー最小時の値
     * @param {number} maxVal - スライダー最大時の値
     * @param {number} [defaultVal=valFrom] - デフォルトの値、指定がなければ最小値
     * @param {string} label - ラベルを付ける場合
     */

    constructor(app, sliderWidth, valFrom, valTo, defaultVal = valFrom, label = false) {
        super();

        this.val = defaultVal;

        const baseSize = 64;
        const offset = 2;

        const relativeValTo = valTo - valFrom;
        const relativeValFrom = valFrom - (valTo - relativeValTo);

        /**
         * @todo これがなんなのか調べる（不要かも）
         */
        app.stage.hitArea = app.screen;

        const sliderBackground = new PIXI.Graphics().lineStyle(2, 0xFFFFFF).beginFill(0xD9D9D9).drawRoundedRect(0, 0, sliderWidth, baseSize / 2, baseSize / 2);
        sliderBackground.y = baseSize / 4;
        this.addChild(sliderBackground);

        const handle = new PIXI.Graphics().lineStyle(4, 0x666666).beginFill(0xffffff).drawCircle(0, 0, baseSize / 2 - offset * 2);
        const halfHandleWidth = handle.width / 2;
        handle.x = defaultVal / valTo * (sliderWidth - handle.width) + halfHandleWidth;
        handle.y = baseSize / 2;
        handle.eventMode = 'static';

        /**
         * @todo これがなんなのか調べる
         */
        handle.cursor = 'pointer';
        this.addChild(handle);

        const valText = this.addChild(new PIXI.Text('', {
            fontSize: 25, fill: 0x000000,
        }));
        valText.x = sliderBackground.x + sliderBackground.width / 2;
        valText.y = baseSize / 2;
        valText.anchor.set(0.5, 0.5);

        const onDragStart = () => {
            app.stage.eventMode = 'static';
            app.stage.addEventListener('pointermove', onDrag);
        }

        const onDragEnd = (e) => {
            app.stage.eventMode = 'auto';
            app.stage.removeEventListener('pointermove', onDrag);
        }

        const onDrag = (e) => {
            update(e);
            this.emit("customEvent", { 
                value  : this.val,
                message: "イベントが発火されました！"
            });
        }
        
        const update = (e = undefined) => {
            if(e){
                const maxSlide = sliderWidth - handle.width;
                const handleNext = Math.max(halfHandleWidth, Math.min(sliderBackground.toLocal(e.global).x, sliderWidth - halfHandleWidth));
                const relative = handleNext - halfHandleWidth;
                handle.x = handleNext;
                
                const hundredized = relative / maxSlide * 100;
                this.val = hundredized / 100 * relativeValTo + valFrom;
            }
            if(label !== false){
                valText.text = label !== false ? `${label} = ` : '';
                valText.text += `${Utils.roundTo(this.val, 1)} (${Utils.roundTo(this.val / valTo * 100, 0)}%)`;
            }
        }

        update();
        handle.on('pointerdown', onDragStart).on('pointerup', onDragEnd).on('pointerupoutside', onDragEnd);
    }
}