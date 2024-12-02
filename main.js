import Utils from "./Utils.js";
import { dataProvider, dp } from "./dataProvider.js";

import { ApplicationRoot } from "./ApplicationRoot.js";

console.log(PIXI.VERSION)
/* ------------------------------------------------------------
    変数定義
------------------------------------------------------------ */

/* ------------------------------------------------------------
    アセット読み込み
------------------------------------------------------------ */
WebFont.load({
    google: {
        families: ['Inter:300,500,700'],
    },
    
    active: () => {
        console.log('OK: Font');
        init();
    },

    // フォント読み込み失敗時
    inactive: () => {
        console.log("ER: Font");
    },
});

function init(){
    //  app instance
    let app = new PIXI.Application({
        background: '#FFFFFF',
        resizeTo  : window,
        /**
         * @todo 高解像度端末の対応について調べる
         */
        // resolution: window.devicePixelRatio || 1,
        // autoDensity: true,
        
    });
    
    dataProvider.app = app;
    dataProvider.isMobile = Utils.isMobileDevice();
    if(dataProvider.isMobile){
        dataProvider.spRect = new PIXI.Rectangle(0, 0, app.screen.width, app.screen.height);
    }else{
        // ここでSP画面のRectangleを指定する
        dataProvider.spRect = new PIXI.Rectangle(0, 0, 980, 1668);
    }
    dataProvider.limitedScreen = {
        width             : dataProvider.spRect.width,
        height            : dataProvider.spRect.height,
        halfWidth         : dataProvider.spRect.width / 2,
        halfHeight        : dataProvider.spRect.height / 2,
        negativeWidth     : 0 - dataProvider.spRect.width,
        negativeHeight    : 0 - dataProvider.spRect.height,
        negativeHalfWidth : 0 - dataProvider.spRect.width / 2,
        negativeHalfHeight: 0 - dataProvider.spRect.height / 2,
    };

    document.body.appendChild(app.view);
    let appRoot = app.stage.addChild(new ApplicationRoot());
/* ------------------------------------------------------------
    resize Event
------------------------------------------------------------ */
    app.renderer.on('resize', (width, height) => {
        let w = width == undefined ? window.innerWidth : width;
        let h = height == undefined ? window.innerHeight : height;
        // 中央揃え
        appRoot.x = w / 2;
        appRoot.y = h / 2;
        // PC環境ではSPRect範囲内のリサイズ
        if(!Utils.isMobileDevice()){
            appRoot.resizeHandler(w, h);
        }
    });
    app.renderer.emit('resize');    
}