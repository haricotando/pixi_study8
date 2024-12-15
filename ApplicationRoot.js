import { dataProvider, dp } from "./dataProvider.js";
import GraphicsHelper from "./helper/GraphicsHelper.js";
import Utils from "./Utils.js";

export class ApplicationRoot extends PIXI.Container {
    
    constructor(debug = false) {
        super();

        this._debug = debug;
        this.loadAssets();
        
        
        if(this._debug){
            this.debugAssets = this.addChild(new PIXI.Container());
            this.debugAssets.zIndex = 1000;
            this.debugAssets.addChild(GraphicsHelper.addCross(100, 10));
            this.initSPFrame();
        }
    }
    
    /** ------------------------------------------------------------
     * アセット読み込み等完了後スタート
    */
   init(){
        this.sortableChildren = true;
        /**
         * @todo ここはdataProviderとかに連れて行く
         */
        this.deviceFacingDown = false;
        this.sensorData = {
            granted: false,
            gyro:{
                oldAlpha:0,
                oldBeta:0,
                oldGamme:0,
                alpha: 0,
                beta : 0,
                gamma: 0,
            },
            acceleration:{
                x: 0,
                y: 0,
                z: 0,
            }
        };

        this.background = this.addChild(GraphicsHelper.exDrawRect(0, 0, dp.limitedScreen.width, dp.limitedScreen.height, false, {color:0xEFEFEF}))
        Utils.pivotCenter(this.background);

        this.facingDownBlack = this.addChild(GraphicsHelper.exDrawRect(0, 0, dp.limitedScreen.width, dp.limitedScreen.height, false, {color:0x333333, alpha:0.9}))
        Utils.pivotCenter(this.facingDownBlack);
        this.facingDownBlack.zIndex = 20;
        this.facingDownBlack.visible = false;

        this.requestDeviceOrientationPermission();
    }

    /** ------------------------------------------------------------
     *  OSごとの加速度／ジャイロ取得分岐
     */
    requestDeviceOrientationPermission(){
        const button = this.addChild(new PIXI.Container());
        const background = button.addChild(GraphicsHelper.exDrawRect(0, 0, 200, 200, false, {color:0xFF0000}));
        const label = button.addChild(new PIXI.Text('> Request Permission ', {fontFamily:'Inter', fontSize: 60, fontWeight: 500, fill:0xFFFFFF}));
        background.width = label.width;
        background.height = label.height;
        button.interactive = true;
        button.buttonMode = true;
        Utils.pivotCenter(button);

        button.on("pointertap", () => {
            if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
            // iOS 13以降でのアクセス許可リクエスト
                DeviceOrientationEvent.requestPermission()
                .then((response) => {
                    if (response === "granted") {
                        /**
                         * @todo このbindでよかったんだろうか？
                         */
                        window.addEventListener('deviceorientation', this.handleOrientation.bind(this), true);
                        window.addEventListener('devicemotion', this.handleMotion.bind(this), true);
                        this.requestGranted();
                        console.log('許可が付与されました');
                    } else {
                        console.log('許可が拒否されました');
                    }
                })
                .catch((error) => {
                    console.error("Permission request error:", error);
                    console.log('エラーが発生しました');
                });
            } else {
                // AndroidやPCなど、許可リクエストが不要なブラウザの場合
                window.addEventListener("deviceorientation", this.handleOrientation.bind(this), true);
                window.addEventListener('devicemotion', this.handleMotion.bind(this), true);
                this.requestGranted();
                console.log('許可が不要です');
            }
            button.interactive = false;
            this.removeChild(button);
        });

    }

/** ------------------------------------------------------------
 *  加速度／ジャイロの取得が許可された時
 */
requestGranted(){
    this.sensorData.granted = true;
    this.studyAround();
}

handleOrientation(event) {
    /**
     * ここはオイラー角の制約対応する
     */
    if (event.alpha === undefined) return false;
    this.sensorData.gyro = {
        alpha: event.alpha,
        beta : event.beta,
        gamma: event.gamma,
        // beta : event.beta > 30 ? 30 : event.beta,
        // gamma: event.gamma > 30 ? 30 : event.gamma,
    };

    if (Math.abs(this.sensorData.gyro.beta) > 85) {
        this.deviceFacingDown = true;
        
        // alphaやgammaの補正
        // this.sensorData.gyro.alpha = (this.sensorData.gyro.alpha + 180) % 360; // 180度反転
        // this.sensorData.gyro.gamma = -this.sensorData.gyro.gamma; // 左右のロールを反転
    }else{
        this.deviceFacingDown = false;

    }
}

handleMotion(event){
    if (event.accelerationIncludingGravity.x === undefined) return false;
    this.sensorData.acceleration = {
        x: event.accelerationIncludingGravity.x,
        y: event.accelerationIncludingGravity.y,
        z: event.accelerationIncludingGravity.z,
    }
}

    /** ------------------------------------------------------------
     * 
     */
    studyAround(){
        this.circleContainer = this.addChild(new PIXI.Container());
        this.lineContainer = this.addChild(new PIXI.Container());
        this.lineGraphics = this.lineContainer.addChild(new PIXI.Graphics());

        this.betaContainer = this.addChild(new PIXI.Container());
        const betaLine = this.betaContainer.addChild(new PIXI.Graphics());
        betaLine.lineStyle(4, 0x00FFFF);
        betaLine.moveTo(0, dp.limitedScreen.negativeHalfHeight);
        betaLine.lineTo(0, dp.limitedScreen.halfHeight);
        this.tfBeta = this.betaContainer.addChild(new PIXI.Text(0));
        this.tfBeta.anchor.set(0.5, 0);

        this.gammaContainer = this.addChild(new PIXI.Container());
        const gammaLine = this.gammaContainer.addChild(new PIXI.Graphics());
        gammaLine.lineStyle(4, 0xFF00FF);
        gammaLine.moveTo(dp.limitedScreen.negativeHalfWidth, 0);
        gammaLine.lineTo(dp.limitedScreen.halfWidth, 0);
        this.tfGamma = this.betaContainer.addChild(new PIXI.Text(0));
        this.tfGamma.anchor.set(0.5, 0);

        this.tfAngle = this.lineContainer.addChild(new PIXI.Text(0));
        this.tfAngle.position.set(80, 80);

        this.tfAcceleration = this.addChild(new PIXI.Text(0));
        this.tfAcceleration.x = dp.limitedScreen.negativeHalfWidth + 40;
        this.tfAcceleration.y = dp.limitedScreen.negativeHalfHeight + 40;

        this.ball = this.addChild(new PIXI.Container());
        this.ball.addChild(GraphicsHelper.exDrawCircle(0, 0, 50, 0, true));

        this.tfDistance = this.ball.addChild(new PIXI.Text(0));
        this.tfDistance.anchor.set(0.5, 0.5);


        const circle = this.circleContainer.addChild(GraphicsHelper.exDrawCircle(0, 0, 450, {width:10}));
        this.circleText = this.circleContainer.addChild(new PIXI.Text(0));
        this.circleText.anchor.set(0.5, 0);
        this.circleText.y = -350;
        circle.beginFill(0x999999);
        circle.drawCircle(0, -400, 40);
        circle.endFill();

        dp.app.ticker.add(() => {
            // センサー情報の出力
            this.circleText.text = `${Utils.roundTo(this.sensorData.gyro.alpha, 1)}`;
            this.tfBeta.text = `beta: ${Utils.roundTo(this.sensorData.gyro.beta, 1)}`;
            this.tfGamma.text = `gamma: ${Utils.roundTo(this.sensorData.gyro.gamma, 1)}`;
            
            this.tfAcceleration.text = 'Acceleration:';
            this.tfAcceleration.text += `\nx: ${Utils.roundTo(this.sensorData.acceleration.x, 1)}`;
            this.tfAcceleration.text += `\ny: ${Utils.roundTo(this.sensorData.acceleration.y, 1)}`;
            this.tfAcceleration.text += `\nz: ${Utils.roundTo(this.sensorData.acceleration.z, 1)}`;

            
            if(this.sensorData.granted){
                this.circleContainer.rotation = Utils.degreesToRadians(this.sensorData.gyro.alpha);


                const scaleFactor = 100;

                let beta = Math.max(-90, Math.min(90, this.sensorData.gyro.beta)) * scaleFactor;
                let gamma = Math.max(-90, Math.min(90, this.sensorData.gyro.gamma)) * scaleFactor;
                
                const x = (gamma / 90) * 20; // 左右の傾き → 水平方向
                const y = (beta / 90) * 20;  // 前後の傾き → 垂直方向
                
                this.ball.x = x;
                this.ball.y = y;

                const distance = Math.sqrt(x ** 2 + y ** 2); // ピクセル単位
                const angle = Math.atan2(y, x) * (180 / Math.PI); // 角度（度単位）

                this.tfBeta.y = 0 - this.sensorData.gyro.beta / 90 * dp.limitedScreen.halfHeight;
                this.tfGamma.x = 0 - this.sensorData.gyro.gamma / 90 * dp.limitedScreen.halfWidth;

                /**
                 * 線を描く
                 */
                this.lineGraphics.clear();
                this.lineGraphics.lineStyle(8, 0xFFFFFF);
                this.lineGraphics.moveTo(0, 0).lineTo(x, y);
                this.lineGraphics.moveTo(0, 0).lineTo(450, 0);
                this.lineGraphics.moveTo(0, 0).beginFill(0xFFFF00, 0.5);
                this.lineGraphics.arc(0, 0, 100, 0, Utils.degreesToRadians(angle)); 
                this.lineGraphics.endFill();

                this.tfAngle.text = Utils.roundTo(angle, 1);
                this.tfDistance.text = Utils.roundTo(distance, 1);
                

                const oppositeAngle = (angle + 180) % 360;

                if(this.deviceFacingDown){
                    this.facingDownBlack.visible = true;
                }else{
                    this.facingDownBlack.visible = false;

                }
            }
        });
    }




    
    /** ------------------------------------------------------------
        * アセットをまとめてロード
        * 公式の画像でテスト読み込み
     */
    loadAssets(){
        const assetsPromise = PIXI.Assets.load([
        ]);
        
        assetsPromise.then((items) => {
            dataProvider.assets = items;
            this.init();
        });
    }
    /** ------------------------------------------------------------
         * resizeHandler
         * 
     */
    resizeHandler(width, height){
        // PCの場合のみAppRootをいい感じにリサイズする
        let paddingFactorW = 0.95
        let paddingFactorH = 0.95;

        let maxW = dataProvider.spRect.width;
        let maxH = dataProvider.spRect.height;

        // 最大表示幅と高さを決める
        let containerMaxWidth = paddingFactorW * window.innerWidth; 
        let containerMaxHeight = paddingFactorH * window.innerHeight;
        
        let resizeRatio = Math.min(containerMaxWidth/maxW, containerMaxHeight/maxH);
        if(containerMaxWidth < maxW || containerMaxHeight < maxH) {
            if(resizeRatio > 0.5){
                resizeRatio = 0.5;
            }
            this.scale.x = resizeRatio;
            this.scale.y = resizeRatio;
        }

        if(this._debug){
            this.updateSPFrame(resizeRatio);
        }
    }

    /** ============================================================
        * Debug時要素
     */
        initSPFrame(){
            let lineColor = 0x00FFFF;
            let lineWidth = 10;
    
            const debugFrame = GraphicsHelper.exDrawRect(
                0, 0, 
                dataProvider.spRect.width,
                dataProvider.spRect.height,
                {
                    color: lineColor,
                    width: lineWidth,
                }, false
            );
    
            debugFrame.pivot.x = debugFrame.width/2;
            debugFrame.pivot.y = debugFrame.height/2;
            this.debugAssets.addChild(debugFrame);
    
            this._labelBackground = GraphicsHelper.exDrawRect(0, 0, 100, 30, false, 0xFFFFFF);
            this._labelBackground.x = 0 - debugFrame.width / 2 + 20;
            this._labelBackground.y = 0 - debugFrame.height / 2 + 20;
    
            this.debugAssets.addChild(this._labelBackground);
            
            this._label = new PIXI.Text('Label');
            this._label.x = 0 - debugFrame.width / 2 + 30;
            this._label.y = 0 - debugFrame.height / 2 + 20;
            this.debugAssets.addChild(this._label);
            this.updateSPFrame();
        }
    
        updateSPFrame(resizeRatio = 1){
            this._label.text = `${Utils.roundTo(this.width, 1)} : ${Utils.roundTo(this.height, 1) } - ${Utils.roundTo(resizeRatio, 1)}`;
            this._labelBackground.width = this._label.width + 20;
        }
}