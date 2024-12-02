class GraphicsHelper {

    /* ------------------------------------------------------------
        drawRect + line, fill
    ------------------------------------------------------------ */
    static exDrawRect(x, y, width, height, line, fill) {
        const graphics = new PIXI.Graphics();
        if(line){
            let lineWidth = line.width ? line.width : 1;
            let lineColor = line.color != undefined ? line.color : 0xFFFFFF;
            let lineAlpha = line.alpha != undefined ? line.alpha : 1;
            graphics.lineStyle(lineWidth, lineColor, lineAlpha, 0);
            /*
            2024/10/08 4つ目のパラメータ　alignment追加
            The alignment of any lines drawn (0.5 = middle, 1 = outer, 0 = inner). WebGL only.
            Default Value:
            0.5
*/
        }

        if(fill){
            let fillColor = fill.color != undefined ? fill.color : 0xFFFFFF;
            let fillAlpha = fill.alpha != undefined ? fill.alpha : 1;
            graphics.beginFill(fillColor, fillAlpha);
        }
        graphics.drawRect(x, y, width, height, 0);
        if(fill){
            graphics.endFill();
        }
        return graphics;
    }

    /* ------------------------------------------------------------
        drawRoundedRect + line, fill
    ------------------------------------------------------------ */
    static exDrawRoundedRect(x, y, width, height, radius, line, fill) {
        const graphics = new PIXI.Graphics();
        if(line){
            let lineWidth = line.width ? line.width : 1;
            let lineColor = line.color != undefined ? line.color : 0xFFFFFF;
            let lineAlpha = line.alpha != undefined ? line.alpha : 1;
            graphics.lineStyle(lineWidth, lineColor, lineAlpha);
        }

        if(fill){
            let fillColor = fill.color != undefined ? fill.color : 0xFFFFFF;
            let fillAlpha = fill.alpha != undefined ? fill.alpha : 1;
            graphics.beginFill(fillColor, fillAlpha);   
        }
        graphics.drawRoundedRect(x, y, width, height, radius);
        if(fill){
            graphics.endFill();
        }
        return graphics;
    }

    /* ------------------------------------------------------------
        drawCircle + line, fill
    ------------------------------------------------------------ */
    static exDrawCircle(x, y, radius, line, fill){
        const graphics = new PIXI.Graphics();
        
        if(line){
            let lineWidth = line.width ? line.width : 1;
            let lineColor = line.color != undefined ? line.color : 0xFFFFFF;
            let lineAlpha = line.alpha != undefined ? line.alpha : 1;
            graphics.lineStyle(lineWidth, lineColor, lineAlpha);
        }
        
        if(fill){
            let fillColor = fill.color != undefined ? fill.color : 0xFFFFFF;
            let fillAlpha = fill.alpha != undefined ? fill.alpha : 1;
            graphics.beginFill(fillColor, fillAlpha);   
        }
        
        graphics.drawCircle(x, y, radius);
        
        if(fill){
            graphics.endFill();
        }
        return graphics;
    }
    /* ============================================================
        TEMPORARY
    ============================================================ */
    static addCross(size = 100, lineWidth = 2, color = 0xFF0000, alpha = 1){
        const graphics = new PIXI.Graphics();
        const half = size / 2;
        graphics.lineStyle(lineWidth, color, alpha);
        graphics.moveTo(0 - half, 0);
        graphics.lineTo(half, 0);
        graphics.moveTo(0, 0 - half);
        graphics.lineTo(0, half);
        return graphics;
    }
}
    
export default GraphicsHelper;