//Scene
//
function sceneConfig(dev) {
    //dev deviceControlClass 

    //宣言部
    var work = dev.graphics1;
    var work2 = dev.graphics2;
    var text = dev.text;

    var inp = dev.mouse_state;
    var keys = dev.key_state;

    this.init = scene_init;
    this.reset = scene_reset;
    this.step = scene_step;
    this.draw = scene_draw;

    var keylock;

    this.score = 0;

    this.config = {};
    var w_config = [];
    var w_number = [];
    var before_wn = [];

    var wtxt;

    var save_on = false;
    var reset_on = false;

    var wipef;
    var wipecnt;

    //

    var menu = []
    var mttl = ["FullPower.", "SideShot.", "ItemReset.", "Option.", "---.", "Stage."];
    var w_message = ["パワーアップ最大で開始 : ", "弾消し弾[◎]を使用 : ",
	"死んだときにアイテム放出 : ", "支援機(オプション)使用 : ", "未使用 : ", "開始面の選択 : "];

    w_number[5] = 1; //開始面初期値

    //	var mjmp = [1,2,2,2,3,3];

    var menu_x = 60;
    var menu_y = 180;

    for (var i = 0; i < mttl.length - 1; i++) {
        m = {};
        m.title = mttl[i];
        m.x = menu_x;
        m.y = menu_y + i * 20;
        m.w = 120;
        m.h = 16;
        //	    m.jp = mjmp[i];
        m.msg = w_message[i];
        m.sel = false;
        m.lamp = false;
        m.func = function () {
            text.clear();
            text.reset();
            text.print(this.msg, 100, 320, "white");
            text.draw();
            return 0; //	        return this.jp; 
        };
        menu.push(m);

        for (var j = 0; j < 2; j++) {
            m = {};
            m.title = (j == 0) ? "  On" : "  Off";
            m.x = menu_x + 80 + 80 * (j + 1);
            m.y = menu_y + i * 20;
            m.w = 80;
            m.h = 16;
            //	        m.jp = mjmp[i];
            m.msg = w_message[i] + ((j == 0) ? "有効" : "無効");
            m.sel = false;
            m.lamp = false;
            m.num = i;
            m.sw = (j == 0) ? true : false;
            m.func = function () {
                text.clear();
                text.reset();
                text.print(this.msg, 100, 320, "white");
                text.draw();
                w_config[this.num] = this.sw; //	        return this.jp;
                return 0;
            };
            menu.push(m);
        }
    }

    //    w_number[mttl.length - 1] = 1;

    m = {};
    m.title = mttl[mttl.length - 1] + w_number[mttl.length - 1];
    m.x = menu_x;
    m.y = menu_y + (mttl.length - 1) * 20;
    m.w = 120;
    m.h = 16;
    //	    m.jp = mjmp[i];
    m.msg = w_message[i];
    m.sel = false;
    m.lamp = false;
    m.func = function () {
        text.clear();
        text.reset();
        text.print(this.msg, 100, 320, "white");
        text.draw();
        return 0; //	        return this.jp; 
    };

    wm = m;
    menu.push(m);

    for (var j = 0; j < 2; j++) {
        m = {};
        m.title = (j == 0) ? "  +1" : "  -1";
        m.x = menu_x + 80 + 80 * (j + 1);
        m.y = menu_y + i * 20;
        m.w = 80;
        m.h = 16;
        //	        m.jp = mjmp[i];
        m.msg = w_message[i]; // + ((j == 0) ? "有効" : "無効");
        m.sel = false;
        m.lamp = false;
        m.num = mttl.length - 1;
        m.sw = (j == 0) ? 1 : -1;
        m.func = function () {
            w_config[this.num] = (this.sw == 1) ? true : false;
            w_number[this.num] += this.sw; //	        return this.jp;

            if (w_number[this.num] < 1) w_number[this.num] = 1;
            if (w_number[this.num] > 3) w_number[this.num] = 2;

            wm.title = mttl[this.num] + w_number[this.num];

            text.clear();
            text.reset();
            text.print(this.msg + w_number[this.num] + "面"
            , 100, 320, "white");
            text.draw();

            return 0;
        };
        menu.push(m);
    }

    m = {};
    m.title = "Save."
    m.x = 100
    m.y = 360;
    m.w = 120;
    m.h = 16;
    m.jp = 2;
    m.msg = "Save.";
    m.sel = false;
    m.lamp = false;
    m.config = this.config;
    m.result = this.result;
    m.func = function () {
        save_on = true;
        keylock = true;
        return 0;
    };
    menu.push(m);

    m = {};
    m.title = "Reset."
    m.x = 100
    m.y = 380;
    m.w = 120;
    m.h = 16;
    m.jp = 2;
    m.msg = "Reset.";
    m.sel = false;
    m.lamp = false;
    m.func = function () {
        reset_on = true;
        keylock = true;
        return 0;
    }
    menu.push(m);

    m = {};
    m.title = "Exit."
    m.x = 100
    m.y = 400;
    m.w = 120;
    m.h = 16;
    m.jp = 2;
    m.msg = "Exit.";
    m.sel = false;
    m.lamp = false;
    m.func = function () {
        text.clear();
        text.reset();
        return this.jp;
    };
    menu.push(m);

    //

    var cur_cnt;

    var tsel = new Number(0.0);


    //処理部

    this.config_load = function () {

        if (Boolean(localStorage)) {

            var t = ["fullpower", "sideshot", "itemreset", "option", "dummy", "startstage"];

            var f = false;

            for (var i = 0; i <= 3; i++) {
                if (Boolean(localStorage.getItem(t[i]))) {
                    f = true;
                    w_config[i] = (localStorage.getItem(t[i]) == "on") ? true : false;
                    this.config[t[i]] = w_config[i];
                }
            }

            if (Boolean(localStorage.getItem(t[5]))) {
                f = true;
                w_number[5] = parseInt(localStorage.getItem(t[5]));
                this.config[t[5]] = w_number[5];

                wm.title = mttl[5] + w_number[5];
            }

//            alert(f ? "load" : "nondata");
        } else {
 //           alert("non localstorage");
        }
    }

    function scene_init() {

        this.config.fullpower = false;
        this.config.sideshot = true;
        this.config.itemreset = true;
        this.config.option = true;
        this.config.startstage = 1;

        this.config.cold = true;
        this.config.debug = false;

        w_config[0] = this.config.fullpower;
        w_config[1] = this.config.sideshot;
        w_config[2] = this.config.itemreset;
        w_config[3] = this.config.option;
        w_config[4] = false;
        w_config[5] = false;

        w_number[5] = this.config.startstage;

        //        tsel = 0.0;

        //初期化処理
    }

    function scene_reset() {

        for (var i in menu) {
            menu[i].sel = false;
            menu[i].lamp = false;
        }

        wipef = false;
        wipecnt = 0;
        cur_cnt = 0;

        work2.clear("darkblue");

        cl = {};
        cl.w = work.cw;
        cl.h = work.ch;
        cl.draw = function (device) {
            var max = this.h;
            if (max < this.w) max = this.w;

            device.beginPath();

            for (var i = 0; i < max; i += 16) {
                device.moveTo(i, 0);
                device.lineTo(i, this.h);
                device.moveTo(0, i);
                device.lineTo(this.w, i);
            }
            device.strokeStyle = "lightgray";
            device.stroke();
        }
        work2.putFunc(cl);
        work2.draw();

        work2.reset();

        for (i in w_number) {
            if (Boolean(w_number[i])) {
                before_wn[i] = w_number[i];
            }
        }

        keylock = true;
    }

    function scene_step() {

        wtxt = [];

        var mstate = inp.check_last();
        var kstate = keys.check();

        var x = mstate.x;
        var y = mstate.y;

        if ((mstate.button == 0) && (!keylock)) {
            for (var i in menu) {

                if (menu[i].sel) {

                    var n = menu[i].func();
                    if (n != 0) return n;
                }
            }
        } else {
            for (i in w_number) {
                if (Boolean(w_number[i])) {
                    before_wn[i] = w_number[i];
                }
            }
        }

        if (mstate.button == -1) keylock = false;

        if (wipef) {

            var o = {};

            o.cw = work2.cw;
            o.ch = work2.ch;
            o.y1 = work2.ch / 2 - wipecnt
            o.y2 = work2.ch / 2 + wipecnt

            o.draw = function (device) {

                device.strokeStyle = "black";

                device.beginPath();
                device.moveTo(0, this.y1);
                device.lineTo(this.cw, this.y1);
                device.stroke();

                device.beginPath();
                device.moveTo(0, this.y2);
                device.lineTo(this.cw, this.y2);
                device.stroke();
            }
            work2.putFunc(o);

            work2.draw();
            work2.reset();

            wipecnt += 4;

            if (work2.ch / 2 - wipecnt < 0) { return 1; }

        }

        var wi = -1;
        for (i in menu) {
            if ((mstate.x >= menu[i].x) && (mstate.x <= menu[i].x + menu[i].w)
                && (mstate.y >= menu[i].y) && (mstate.y <= menu[i].y + menu[i].h)) {

                menu[i].sel = true;
                wi = i;
            } else {
                menu[i].sel = false;
            }
        }

        wtxt.push("== Configration ==");
        wtxt.push("-----------------");
        //        wtxt.push("menu:" + wi);

        //        wtxt.push("Push rMouse Button to Start");

        for (i in w_config) {
            if (w_config[i]) {
                menu[i * 3 + 1].lamp = true;
                menu[i * 3 + 2].lamp = false;
            } else {
                menu[i * 3 + 1].lamp = false;
                menu[i * 3 + 2].lamp = true;
            }
        }

        for (i in w_number) {
            if (Boolean(w_number[i])) {
                if (w_number[i] != before_wn[i]) {
                    menu[i * 3 + 1].lamp = false;
                    menu[i * 3 + 2].lamp = false;
                    menu[i * 3 + 1].sel = false;
                    menu[i * 3 + 2].sel = false;
                }
            }
        }

        this.config.fullpower = w_config[0];
        this.config.sideshot = w_config[1];
        this.config.itemreset = w_config[2];
        this.config.option = w_config[3];

        this.config.startstage = w_number[5];

        if (reset_on) {

            w_config[0] = false;
            w_config[1] = true;
            w_config[2] = true;
            w_config[3] = true;
            w_config[4] = false;
            w_config[5] = false;

            w_number[5] = 1;

            wm.title = mttl[5] + w_number[5];

            text.clear();
            text.reset();
            text.print("設定初期化しました。", 100, 320, "white");

            if (Boolean(localStorage)) {
                localStorage.clear();
                text.print("ローカルストレージクリア。", 100, 340, "white");
            } else {
                text.print("ローカルストレージが使用できない?"
                        , 100, 340, "white");
            }
            text.draw();

            reset_on = false;
        }

        if (save_on) {

            text.clear();
            text.reset();

            if (Boolean(localStorage)) {
                localStorage.setItem("fullpower", (this.config.fullpower) ? "on" : "off");
                localStorage.setItem("sideshot", (this.config.sideshot) ? "on" : "off");
                localStorage.setItem("itemreset", (this.config.itemreset) ? "on" : "off");
                localStorage.setItem("option", (this.config.option) ? "on" : "off");
                localStorage.setItem("startstage", new String(this.config.startstage));
  //              localStorage.setItem("highscore", new String(this.result.highscore));
                text.print("設定をセーブしました。"//this.msg + localStorage.length
                , 100, 320, "white");
            } else {
                text.print("ローカルストレージが使用できない?"
                        , 100, 320, "white");
            }
            text.draw();

            save_on = false;
        }
        return 0;
        //進行
    }

    function scene_draw() {
        /*
        work2.clear("blue");

        cur_cnt++; 
        cur_cnt	= cur_cnt%16;

        cl = {};
        cl.w = work.cw;
        cl.h = work.ch;
        cl.draw = function (device) {
        var max = this.h;
        if (max < this.w) max = this.w;

        device.beginPath();

        for (var i = 0; i < max; i += 16) {
        device.moveTo(i +cur_cnt, 0);
        device.lineTo(i +cur_cnt, this.h);
        device.moveTo(0, i+cur_cnt);
        device.lineTo(this.w, i+cur_cnt);
        }
        device.strokeStyle = "lightgray";
        device.stroke();
        }
        work2.putFunc(cl);
        work2.draw();

        work2.reset();
        */
        for (var s in wtxt) {
            work.putchr(wtxt[s], 0, 100 + 16 * s);
        }

        for (var i in menu) {
            if (menu[i].lamp) {
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

            if (menu[i].sel) {
                work.putchr(menu[i].title, menu[i].x - 4, menu[i].y - 1);
            } else {
                work.putchr(menu[i].title, menu[i].x, menu[i].y);

            }
        }

    }
}

