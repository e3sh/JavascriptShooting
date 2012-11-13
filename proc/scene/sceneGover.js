//Scene(gameover)
//
function sceneGover(dev) {
    //dev deviceControlClass 

    //宣言部
    var work = dev.graphics1;
    var work2 = dev.graphics2;

    var inp = dev.mouse_state;
    var keys = dev.key_state;


    this.init = scene_init;
    this.reset = scene_reset;
    this.step = scene_step;
    this.draw = scene_draw;

    var keylock;

    var wtxt;

    var wipef;
    var wipecnt;

    var ret_code;


    var menu = []
    
    var m = {};
    m.title = "Continue.";
    m.x = 100;
    m.y = 160;
    m.w = 120;
    m.h = 16;
    m.sel = false;
    m.func = function () { return 11; };

    menu.push(m);

    m = {};
    m.title = "End.";
    m.x = 100;
    m.y = 180;
    m.w = 120;
    m.h = 16
    m.sel = false;
    m.func = function () { return 2; };

    menu.push(m);

    //処理部

    function scene_init() {

        //初期化処理
    }

    function scene_reset() {

        for (var i in menu) {
            menu[i].sel = false;
        }

        wipef = false;
        wipecnt = 2;
        ret_code = 0;

//        work2.clear();

        var o = {};

        o.cw = work2.cw;
        o.ch = work2.ch;

        o.draw = function (device) {
            /*
            var imgdt = device.getImageData(0, 0, this.cw, this.ch);
            convert_image_to_gray_scale(imgdt.data);

            device.putImageData(imgdt, 0, 0);
            */

            for (var i = 0; i < this.ch; i += 4) {
                device.beginPath();

                device.moveTo(0, i);
                device.lineTo(this.cw, i);

//                device.strokeStyle = "lightgray";
                device.strokeStyle = "black";

                device.stroke(); 
            }
        }
        work2.putFunc(o);

        var wsc = this.result.score;
        var wd = [];
        var wt = "";

        for (i = 0; i < 7; i++) {
            var num = wsc % 10;
            wd[7 - i] = num;
            wsc = (wsc - num) / 10;
        }

        for (i in wd) {
            wt = wt + "" + wd[i];
        }
        work2.putchr("Score:" + wt, 240, 16);

        wsc = this.result.highscore;
        wd = [];
        wt = "";

        for (i = 0; i < 7; i++) {
            var num = wsc % 10;
            wd[7 - i] = num;
            wsc = (wsc - num) / 10;
        }

        for (i in wd) {
            wt = wt + "" + wd[i];
        }
        work2.putchr("Hi-Sc:" + wt, 240, 0);

/*
        var wtxt = [];

        for (i in this.result.item) {
            wtxt.push("item[" + i + "]:" + this.result.item[i]);
        }

        for (i in this.result.combo) {
            wtxt.push("combo[" + i + "]:" + this.result.combo[i]);
        }
        for (var s in wtxt) {
            work2.putchr8(wtxt[s], 300, 16 + 8 * s);
        }
*/
        work2.draw();
        work2.reset();

        this.config.cold = true;

        keylock = true;

        //reset処理を記述予定
    }

    function scene_step() {
        //進行
        wtxt = [];

        var mstate = inp.check_last();
        if ((mstate.button == 0) && (!keylock)) {
            for (var i in menu) {

                if (menu[i].sel) {
                    var n = menu[i].func();
                    if (n != 0) {
 //                       wipef = true;
 //                       ret_code = n;
                        return n;
                    }
                }
                //            return 2;
            }
        }

        if (mstate.button == -1) keylock = false;

        if (wipef) {

            var o = {};

            o.cw = work2.cw;
            o.ch = work2.ch;
            o.y1 = work2.ch/2 - wipecnt
            o.y2 = work2.ch / 2 + wipecnt

            o.draw = function (device) {

                device.strokeStyle = "black";
//                device.fillStyle = "black";

                device.beginPath();
                device.moveTo(0, this.y1);
                device.lineTo(this.cw, this.y1);
                device.stroke();

                device.beginPath();
                device.moveTo(0, this.y2);
                device.lineTo(this.cw, this.y2);
                //    device.stroke();
                device.stroke();
            }
            work2.putFunc(o);

            work2.draw();
            work2.reset();

            wipecnt += 8;

            if (work2.ch / 2 - wipecnt < 0) { return ret_code; }

        }

        for (i in menu) {

            if ((mstate.x >= menu[i].x) && (mstate.x <= menu[i].x + menu[i].w)
                && (mstate.y >= menu[i].y) && (mstate.y <= menu[i].y + menu[i].h)) {

                menu[i].sel = true;
            } else {
                menu[i].sel = false;
            }                
        }
/*
        var wsc = this.score;
        var wd = [];
        var wt = "";

        for (i = 0; i < 7; i++) {
            var num = wsc % 10;
            wd[7 - i] = num;
            wsc = (wsc - num) / 10;
        }

        for (i in wd) {
            wt = wt + "" + wd[i];
        }
        work.putchr("Score:" + wt, 240, 0);
*/
        wtxt.push("== Game Over ==");
        wtxt.push("---------------");
//        wtxt.push("Push rMouse Button to Start");

        return 0; //戻すコードで推移する画面を選ぶようにするか？
    }

    function scene_draw() {

        for (var i in menu) {

            if (menu[i].sel) {
                var o = {}
                o.x = menu[i].x;
                o.y = menu[i].y;
                o.w = menu[i].w;
                o.h = menu[i].h;
                o.draw = function (device) {
                    device.beginPath();
                    device.fillStyle = "orange";
                    device.fillRect(this.x, this.y, this.w, this.h);
                }
                work.putFunc(o);
            }

            work.putchr(menu[i].title, menu[i].x, menu[i].y);

        }

        for (var s in wtxt) {
            work.putchr(wtxt[s], 0, 132 + 16 * s);
            //			work.putchr8(wtxt[s],0,0 + 8*s);
            //		        work.print(wtxt[s],0,0 + 16*s +200);	
        }

        //表示

    }

    /* -------------------------------------------------------------------
    * グレースケールに変換
    * ----------------------------------------------------------------- */
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
}