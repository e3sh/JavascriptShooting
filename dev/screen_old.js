//=============================================================
// Screenクラス
//
// 2011/01/10 revup　あとはタイムスタンプで判断する事。
//=============================================================
function Screen(canvas_id) {
    //    alert("!");
    //キャラクタパターンテクスチャー
    var tex_p = new Image();
    tex_p.src = "pict/cha.png";

    var tex_c = new Image();
    tex_c.src = "pict/aschr.png"
    //tex_c.src = "pict/atarifont.png"

    var ef_item = []; // クラスを登録して表示用

    //    var sp_ptn = []; // スプライトパターン
    var sp_ch_ptn = []; //スプライトキャラクタパターン

    //表示用のバッファ(canvas)
    //    var canvas = document.getElementById(canvas_id);
    //    var device = canvas.getContext("2d");
    var element = document.createElement("canvas");
    element.id = canvas_id; //"cvs";
    element.width = "420"; //  "640";
    element.height = "480"; // "480";
	element.style.margin = "0";
	element.style.padding = "0";
	element.style.position ="absolute";

//    element.style.position = "fixed"; //"absolute";//fixed
    //    element.style.top = "0";
    //    element.style.height = "0";
    //   element.style.visibility = "visible";//"hidden";
    //    element.width = "480";//  "640";
    //    element.height = "640";// "480";
    //    element.style.width = "1280px";
    //    element.style.height = "960px";
    //    element.style.width = "240px";
    //    element.style.height = "320px";
       element.style.top = 0;
       element.style.left = 0;

    var objBody = document.getElementsByTagName("body").item(0);
    objBody.appendChild(element);

    var canvas = document.getElementById(canvas_id);
    var device = canvas.getContext("2d");

    this.cw = canvas.width;
    this.ch = canvas.height;

    var spReady = false;
    var chReady = false;

    this.sprite_texture_ready = spReady;
    this.character_texture_ready = chReady;

    device.font = "16px 'Arial'";

    tex_p.onload = function(){
    //device.drawImage(tex_p,0,0);
        spReady = true;
    }

    tex_c.onload = function(){
    //device.drawImage(tex_c,400,0);
        chReady = true;
    }

    this.readystate_check = function () {
        this.sprite_texture_ready = spReady;
        this.character_texture_ready = chReady;
    }

    var sp_ptn = spdata();

    var bg_ptn = [];

    /*
    for (var j in sp){
    var w = sp[j];

    var ptn = {};

    ptn.x = w[1];
    ptn.y = w[2];
    ptn.w = w[3];
    ptn.h = w[4];

    sp_ptn[ w[0] ] = ptn;
    }
    */
    for (i = 0; i < 7; i++) {
        for (j = 0; j < 16; j++) {
            ptn = {};

            ptn.x = 12 * j;
            ptn.y = 16 * i;
 
            ptn.w = 12;
            ptn.h = 16;

            sp_ch_ptn.push(ptn);
        }
    }

    var sp_ch_ptn8 = []; //スプライトキャラクタパターン(8x8)

    for (i = 0; i < 7; i++) {
        for (j = 0; j < 16; j++) {
            ptn = {};

            ptn.x = 8 * j;
            ptn.y = 8 * i + 128;
            ptn.w = 8;
            ptn.h = 8;

            sp_ch_ptn8.push(ptn);
        }
    }

    var sp8 = [];//spchrptn8(color)

    for (var t = 0; t <= 3; t++) {

        var ch = [];

        for (i = 0; i < 7; i++) {
            for (j = 0; j < 16; j++) {
                ptn = {};

                ptn.x = 8 * j + ((t % 2 == 0) ? 0 : 128);
                ptn.y = 8 * i + 128 + ((t >= 2) ? 64 : 0);
                ptn.w = 8;
                ptn.h = 8;

                ch.push(ptn);
            }
        }
        sp8[t] = ch;
    }

    //World => View変換を使用
    //this.view_tr_enable = false;

    //加算合成を使用する。
    this.lighter_enable = true;

    //-------------------------------------------------------------
    ///スプライト描画
    ///引数（m,r,alpha,zは省略するとデフォルト使用）
    ///	Sp : スプライト番号	X,Y : 表示位置
    ///	M : 上下左右反転 ( 0 NORMAL 1:上下反転 2 :左右反転 )
    ///	R : 回転角度 (0 - 359 )
    ///	alpha: アルファ値（透明度）0:透明～255:不透明）
    ///	z: Zoom（拡大率）
    //-------------------------------------------------------------
    //表示位置はx,yが表示中心となるように表示されます。
    this.put = function (sp, x, y, m, r, alpha, z) {

        if (!Boolean(m)) { m = 0; }
        if (!Boolean(r)) { r = 0; }
        if (!Boolean(alpha)) { alpha = 255; }
        if (!Boolean(z)) { z = 1.0; }


        var o = {};

        o.sp = sp;
        o.x = x;
        o.y = y;
        o.m = m;
        o.r = r;
        o.alpha = alpha;
        o.z = z;
        o.draw = sp_put;

        o.le = this.lighter_enable;

        ef_item.push(o);
    }

    function sp_put(device) {

        device.save();

        var FlipV = 1.0;
        var FlipH = 1.0;

        switch (this.m) {
            case 0:
                break;
            case 1:
                FlipV = -1.0;
                break;
            case 2:
                FlipH = -1.0;
                break;
            case 3:
                FlipV = -1.0;
                FlipH = -1.0;
                break;
            default:
                break;
        }

        var d = sp_ptn[this.sp];

        device.setTransform(FlipH, 0, 0, FlipV, this.x, this.y);
        if (this.r != 0) { device.rotate(Math.PI / 180 * this.r); }

        if (this.alpha == 255) {
            device.globalCompositeOperation = "source-over"; 
        }else{
            if (this.le) device.globalCompositeOperation = "lighter"; //source-over 
        }
        device.globalAlpha = this.alpha * (1.0 / 255);
        device.drawImage(tex_p, d.x, d.y, d.w, d.h, (-d.w / 2.0) * this.z, (-d.h / 2.0) * this.z, (0.0 +d.w ) * this.z, (0.0 + d.h) * this.z);

        device.restore();
//        device.globalAlpha = 1.0;
    }

    //-------------------------------------------------------------
    ///マップチップ用パターン描画
    ///引数（省略不可
    /// gr:Image()
    ///	ptn : パターン番号（またはx,y,w,hの入ったオブジェクト）
    /// X,Y : 表示位置
    ///	w,h: 表示幅/高さ
    //-------------------------------------------------------------

    this.putPattern = function (gr, ptn, x, y, w, h) {

        var o = {};

        o.gr = gr;
        o.x = x;
        o.y = y;
        o.w = w;
        o.h = h;
        o.no = ptn;
        o.draw = bg_put;
        //o.draw = function(){};

        ef_item.push(o);
    }

    function bg_put(device) {

        //var d = bg_ptn[this.no];
        var d = this.no;
        device.drawImage(this.gr, d.x, d.y, d.w, d.h, this.x, this.y , this.w, this.h);


//        device.drawImage(this.gr, this.x, this.y, this.w, this.h);
    }
/*
    //-------------------------------------------------------------
    ///マップチップ用パターン切り取り配列の登録
    ///引数（省略不可
    ///	bgptn : パターン配列（x,y,w,hの入ったオブジェクト）
    //-------------------------------------------------------------
    this.setBgPattern = function (bgptn) {

        bg_ptn = bgptn;

    }
*/
    //-------------------------------------------------------------
    ///文字列の表示
    ///引数 S:文字列 X,Y:座標 c:Color
    //-------------------------------------------------------------
    this.print = function (str, x, y, c) {

        if (!Boolean(c)) { c = "limegreen"; }

        var o = {};

        o.text = str;
        o.x = x;
        o.y = y;
        o.color = c;
        o.draw = sp_print;

        ef_item.push(o);

    }

    function sp_print(device) {

        device.fillStyle = this.color;
        device.fillText(this.text, this.x, this.y);

    }
    //-------------------------------------------------------------
    /// スプライトを文字として表示(パターン配置をSpace～[~]のASCII配列と仮定で)
    /// 引数 S : 文字列 X,Y : 座標 z:zoom
    //-------------------------------------------------------------
    //表示位置はx,yが左上となるように表示されます。

//    this.putchr = chr8x8put;
    this.putchr = function (str, x, y, z) {
//    dummy = function (str, x, y, z) {

        var zflag = false;
        if (!Boolean(z)) {
            z = 1.0;

        } else {
            if (z != 1.0) zflag = true;
        }

        for (i = 0; i < str.length; i++) {
            var n = str.charCodeAt(i);

            if ((n >= 32) && (n < 128)) { // space ～ "~" まで
                var o = {};

                o.chrno = n - 32; //0番をspace
                o.x = x + i * (12 * z); //12はPixel幅
                o.y = y;

                if (!zflag) {
                    o.draw = sp_putchr;
                } else {
                    o.z = z;
                    o.draw = sp_putchrZ;
                }

                ef_item.push(o);
            }
        }
        //
    }

    function sp_putchr(device) {

        var d = sp_ch_ptn[this.chrno];

        device.drawImage(tex_c, d.x, d.y, d.w, d.h, this.x, this.y, d.w, d.h);
    }

    function sp_putchrZ(device) {

        var d = sp_ch_ptn[this.chrno];

        device.drawImage(tex_c, d.x, d.y, d.w, d.h, this.x, this.y, d.w * this.z, d.h * this.z);
//        device.drawImage(tex_c, d.x, d.y, d.w, d.h, this.x + (-d.w / 2.0) * this.z, this.y + (-d.h / 2.0) * this.z, d.w * this.z, d.h * this.z);

    }

    //-------------------------------------------------------------
    /// スプライトを文字として表示(パターン配置をSpace～[~]のASCII配列と仮定で)
    /// 引数 S : 文字列 X,Y : 座標
    //-------------------------------------------------------------
    //表示位置はx,yが左上となるように表示されます。
    this.putchr8 = chr8x8put;

    function chr8x8put(str, x, y) {

        for (i = 0; i < str.length; i++) {
            var n = str.charCodeAt(i);

            if ((n >= 32) && (n < 128)) { // space ～ "~" まで
                var o = {};

                o.chrno = n - 32; //0番をspace
                o.x = x + i * 8; //8はPixel幅
                o.y = y;

                o.draw = sp_putchr8;

                ef_item.push(o);
            }
        }
        //
    }

    function sp_putchr8(device) {

        var d = sp_ch_ptn8[this.chrno];

        device.drawImage(tex_c, d.x, d.y, d.w, d.h, this.x, this.y, d.w, d.h);
    }

    //-------------------------------------------------------------
    /// スプライトを文字として表示(パターン配置をSpace～[~]のASCII配列と仮定で)
    /// 引数 S : 文字列 X,Y : 座標 c:color (0:white 1:red 2:green 3:blue) z:zoom
    //-------------------------------------------------------------
    //表示位置はx,yが左上となるように表示されます。
    this.putchr8c = function (str, x, y, c, z) {

        if (!Boolean(z)) { z = 1.0; }

        for (i = 0; i < str.length; i++) {
            var n = str.charCodeAt(i);

            if ((n >= 32) && (n < 128)) { // space ～ "~" まで
                var o = {};

                o.chrno = n - 32; //0番をspace
                o.x = x + i * (8 * z); //8はPixel幅
                o.y = y;
                o.c = c;
                o.z = z;

                o.draw = sp_putchr8c;

                ef_item.push(o);
            }
        }
        //
    }

    function sp_putchr8c(device) {

        var d = sp8[this.c][this.chrno]; //sp_ch_ptn8[this.chrno];

 //       device.drawImage(tex_c, d.x, d.y, d.w, d.h, this.x, this.y, d.w, d.h);
        device.drawImage(tex_c, d.x, d.y, d.w, d.h, this.x + (-d.w / 2.0) * this.z, this.y + (-d.h / 2.0) * this.z, d.w * this.z, d.h * this.z);
    }

    //------------------------------------------------------------
    // 画像イメージを直接取得して表示させる。
    // 引数 G :画像(イメージデータ X,Y: 座標
    //------------------------------------------------------------
    this.putImage = function (gr, x, y) {

        var o = {};

        o.g = gr;
        o.x = x;
        o.y = y;
        o.draw = sp_putimage

        ef_item.push(o);
    }

    function sp_putimage(device) {

        device.drawImage(this.g, this.x, this.y);

    }
    //------------------------------------------------------------
    // 画像イメージを直接取得して表示させる。（ほぼテスト用）
    // 引数 G :画像(イメージデータ X,Y: 座標 w,h表示サイズ指定
    //------------------------------------------------------------
    this.putImage2 = function (gr, x, y, w, h) {

        var o = {};

        o.g = gr;
        o.x = x;
        o.y = y;
        o.w = w;
        o.h = h;

        o.draw = sp_putimage2

        ef_item.push(o);
    }

    function sp_putimage2(device) {

        device.drawImage(this.g, this.x, this.y, this.w, this.h);

    }

    //------------------------------------------------------------
    // 画像イメージを直接取得して表示させる。（Transform付き）
    // 引数 G :画像(イメージデータ) X,Y: 座標 m11,m12,m21,m22 変換座標
    //------------------------------------------------------------
    this.putImageTransform = function (gr, x, y, m11, m12, m21, m22) {

        var o = {};

        o.g = gr;
        o.x = x;
        o.y = y;

        o.m11 = m11;
        o.m12 = m12;
        o.m21 = m21;
        o.m22 = m22;

        o.draw = sp_putimageTr

        ef_item.push(o);
    }

    function sp_putimageTr(device) {

        device.save();

        device.setTransform(this.m11, this.m12, this.m21, this.m22, this.x, this.y);
        device.drawImage(this.g, 0, 0);

        device.restore();

    }

    //---------------------------------------------------------
    ///Transform
    //---------------------------------------------------------
    this.transform = function (m11, m12, m21, m22) {

        device.setTransform(m11, m12, m21, m22, 0, 0);
    }

    //------------------------------------------------------------
    // クラスで表示コマンドを登録して表示させる。
    // 引数 cl:class
    //------------------------------------------------------------
    this.putFunc = function (cl) {

        //ここで登録するクラスには表示の為に"draw( device )" functionを必ず登録
        ef_item.push(cl);
    }

    //---------------------------------------------------------
    ///画面消去(クリア）
    //---------------------------------------------------------
    this.clear = function (c_str) {

        device.save();
        device.setTransform(1, 0, 0, 1, 0, 0);
        device.clearRect(0, 0, canvas.width, canvas.height);
        device.restore();

        if (Boolean(c_str)) {
            device.fillStyle = c_str;
            device.fillRect(0, 0, canvas.width, canvas.height);
        }
    }

    //-----------------------------------------------------
    //部分クリア(色指定で部分塗りつぶし）ただし遅延実行されない
    //----------------------------------------------------
    this.fill = function (x, y, w, h, c_str) {

        if (Boolean(c_str)) {
            device.fillStyle = c_str;
            device.fillRect(x, y, w, h);
        } else {
            device.clearRect(x, y, w, h);
        }
    }

    //----------------------------------------------------------
    //描画バッファ配列のリセット
    //----------------------------------------------------------
    this.reset = function () {

        ef_item = [];
        //
    }

    //----------------------------------------------------------
    //描画
    //----------------------------------------------------------
    this.draw = function () {

        //		alert("in_draw");

        // ef draw
        for (var i in ef_item) {

            ef_item[i].draw(device);

            //if (i>1999) break;

        }

    }


    /* -------------------------------------------------------------------
    * グレースケールに変換(つかえないｗ）
    * ----------------------------------------------------------------- */
    /*
    function convert_image_to_gray_scale(data) {
        var len = data.length;
        var pixels = len / 4;
        for (var i = 0; i < pixels; i += 2) {
            // R, G, Bそれぞれのコンポーネント値を取り出す
            var r = data[i * 4];
            var g = data[i * 4 + 1];
            var b = data[i * 4 + 2];
            // グレースケールに変換
            g = parseInt((11 * r + 16 * g + 5 * b) / 32);
            // 変換したピクセルデータをセット
            data[i * 4] = g;
            data[i * 4 + 1] = g;
            data[i * 4 + 2] = g;
        }
    }
    */
    /* -------------------------------------------------------------------
    * spPtn表示テスト用
    * ----------------------------------------------------------------- */
    /*
    this.spptn_test = function () {

        var x = 0;
        var y = 16;

        for (var i in sp_ptn) {

            this.put(i, x + sp_ptn[i].w/2, y);

            x += sp_ptn[i].w;
            if (x + sp_ptn[i].w > canvas.width) {
                x = 0;
                y += 32;
                if (y > canvas.height) y = 0;
            }
        }

    }
    */


}

