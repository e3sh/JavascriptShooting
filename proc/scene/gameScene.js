//gameScene
//ゲーム本体部分のループや画面推移を管理する予定
//タイトルなどは別シーンとして管理すればいいかも
//（デバッグ表示やカーソル表示、FPS表示などのゲーム部分と
//別になる部分と分離して管理しやすくするのが目的。
//
function gameScene(dev){
//dev deviceControlClass 

//宣言部
    var work = dev.graphics1;
    var work2 = dev.graphics2;

	this.init = game_init;
	this.reset = game_reset;
	this.step = game_step;
	this.draw = game_draw;

	this.score = 0;
	this.result;
	this.config;

	var obCtrl;// = new gObjectControl(dev.graphics1, dev);
	var mapsc;//  = new mapSceControl();

	var escore;

	var scr_cnt = 0;
	var dead_cnt = 0;

	var tex_bg = new Image();
//	tex_bg.src = "pict/sky.jpg";

	var ldflg = false;

	var bg_scroll = true;
	var scroll_y = 0;
	var scrollsw = 0;

	var scenechange = false;

	var enemy_combo = 0;
	var item_combo = 0;
	var ec_draw_count = 0;
	//処理部

	this.score_load = function () {

	    if (Boolean(localStorage)) {

            var f = false;

	        if (Boolean(localStorage.getItem("highscore"))) {
	            f = true;
	            this.result.highscore = parseInt(localStorage.getItem("highscore"));
	        }
//	        alert(f ? "gload" : "gnondata");
	    } else {
//	        alert("gnon localstorage");
	    }
	}

	function game_init(){

		obCtrl = new gObjectControl(work, dev);
		mapsc = new mapSceControl();

//		mapsc.change();
		mapsc.init();

		this.result = {};

		this.result.highscore = 0;
		this.result.score = 0;
		this.result.item = obCtrl.item;
		this.result.combo = obCtrl.combo;

		scenechange = false;
	}

	function game_reset(contflg) {

	    obCtrl.config = this.config;

	    if (!Boolean(contflg)) { contflg = false; }
	    scenechange = false;

	    if (contflg) {
	        obCtrl.reset(true);
	        if (this.config.cold) dead_cnt = -1;
	    } else {
	        obCtrl.reset(false);
	        mapsc.change(this.config.startstage);
	    //    mapsc.init();
	        mapsc.reset();
	        dead_cnt = 0;

	        bg_scroll = true;
	        scroll_y = 0;
	        scrollsw = 0;
	    }

//	    enemy_combo = 0;
//	    item_combo = 0;
	    ec_draw_count = 0;

        if ((contflg = true)&&(!this.config.cold)){　//result画面から戻ってきた場合
            //stage推移
            w = mapsc.stage;
            w++;
            if ( w > 3 ) w = 1;//ステージ最終面だった場合最初に戻る。エンディングがある場合は変更
            mapsc.change(w);

            scroll_y = 0;
            scrollsw = 0;
        }

//		obCtrl = new gObjectControl(work, dev);
	    //		mapsc = new mapSceControl();

        tex_bg = mapsc.bgImage();

 //       work2.transform(1, 0, 0, 0.5);

	    work2.clear("darkgreen");
//	    if (!ldflg) work2.putchr("Loading...", 0, 0);

	    work2.putImage(tex_bg, 0, scroll_y);
		work2.draw();

		tex_bg.onload = function () {
		    work2.putImage(tex_bg, 0, scroll_y);
		    work2.draw();

		    var ldflg = true;

//            tex_bg.onload = function(){};
		}

		work2.reset();

		escore = new gs_score_effect(obCtrl.score);
		ehighscore = new gs_score_effect(this.result.highscore);
/*
		if (contflg) {
		    obCtrl.reset(true);
		    if (this.config.cold) dead_cnt = -1;
		} else {
		    obCtrl.reset(false);
		    mapsc.init();
		    mapsc.reset();
		}
    */
		//reset処理を記述予定
	}

	function game_step(){
	    //ゲームの進行
	    if (obCtrl.interrapt) {
	        if (obCtrl.SIGNAL == 1) {
	            mapsc.enable = false;
	            mapsc.counter_runnning = false;
	        }

	        if (obCtrl.SIGNAL == 6055) {//boss戦に入ったのでマップシナリオカウント停止
	            if (scroll_y == 0) bg_scroll = false;
	            mapsc.enable = true;
	            mapsc.counter_runnning = false;
	        }

	        if (obCtrl.SIGNAL == 835) {//リザルト画面要求(面クリアー処理予定

	                this.result.score = obCtrl.score; ;
	                this.result.item = obCtrl.item;
	                this.result.combo = obCtrl.combo;
	                this.result.combomax = obCtrl.combomax;
	                this.result.obCount = obCtrl.obCount;
	                this.result.total = obCtrl.total;
	                this.result.hidan = obCtrl.hidan;

	                this.config.cold = false;

	                obCtrl.interrapt = false;
	                obCtrl.SIGNAL = 0;

	                obCtrl.draw(work2);

	                scenechange = true;

	                return 5; //result
	        }

	        if (obCtrl.SIGNAL == 4649) {//リスターとシグナルが来た(自機が死んで1.5sec位あと）
	            dead_cnt++;
	            if (dead_cnt < 3) {
	                if (this.config.itemreset) obCtrl.item = []; //取得アイテムカウント消す(パワーアップだけでもよいがとりあえず）
	                obCtrl.combo = [];
	                obCtrl.restart();
	            } else {

	                this.result.score = obCtrl.score; ;
	                this.result.item = obCtrl.item;
                    this.result.combo = obCtrl.combo;
                    this.result.combomax = obCtrl.combomax;
                    this.result.obCount = obCtrl.obCount;
                    this.result.total = obCtrl.total;
                    this.result.hidan = obCtrl.hidan;

//	                this.score = obCtrl.score;
                    obCtrl.draw(work2);

                    scenechange = true;

                    if (Boolean(localStorage)) { //ローカルストレージ使えたらハイスコア記録しとく
                        localStorage.setItem("highscore", new String(this.result.highscore));
                    }
	                return 3; //gover
	            }
	        }
	    } else {
	        bg_scroll = true;
	        mapsc.enable = true;
	        mapsc.counter_runnning = true;
	        //			demo_mode = false;
	    }


	    var w = 0;
	    var w2 = 1;
        for (i in obCtrl.combo){
            if (i == 2) w = obCtrl.combo[i];
            if (i == 4) w2 = obCtrl.combo[i];
        }
        if (enemy_combo != w) {
            enemy_combo = w;

            if (enemy_combo >= 2) {
                //                var st = "" + enemy_combo;
                //                mapsc.add(80 + st.length * 6, 40, 0, 1, "message_normal_60", st);
                ec_draw_count = 60;
            }
        }   

        if (item_combo != w2) {
            item_combo = w2;
/*
            if (item_combo >= 2) {
                mapsc.add(100, 120, 0, 1, "message_small_g", "score x" + item_combo);
            
            }
        */
        } 

	    if (!obCtrl.interrapt) {
	        obCtrl.move(mapsc);
	        mapsc.step(obCtrl);
	    } else {
	        if (obCtrl.SIGNAL != 1) {
	            obCtrl.move(mapsc);
	            mapsc.step(obCtrl);
	        } else {
	            var mstate = dev.mouse_state.check_last();

	            //if (mstate.button == 1) obCtrl.interrapt = false;
	        }
	    }
/*
		if (demo_mode){
			demosub.step();
		}
*/
	    if (bg_scroll) scroll_y++;
	    if (scroll_y > 480) {
	        scroll_y = 0;
	        scrollsw = 1 - scrollsw;
	    }

	    if (this.result.highscore < obCtrl.score) this.result.highscore = obCtrl.score;

	    return 0;
	}

	function game_draw() {
	    //	   work2.putImageTransform(tex_bg, 0, scroll_y - (480 * (1 - scrollsw)), 1, 0, 0, -1);

	    if (!scenechange) {
	        work2.putImage(tex_bg, 0, scroll_y - 480);
	        work2.putImage(tex_bg, 0, scroll_y);

	        work2.draw();
	        work2.reset();
	    }
	    /*
	    cl = {};
	    cl.draw = function( device ){
	    device.rotate(3.6*(Math.PI/180)*Math.random()*100);
	    }
	    work2.reset();
	    work2.putFunc( cl );
	    work2.draw()
	    */
	    //画面の反映後の表示処理ステップ

	    /*
	    scr_cnt++;
	    if (scr_cnt > 15) scr_cnt = 0;

	    cl = {};
	    cl.w = work.cw;
	    cl.h = work.ch;
	    cl.draw = function( device ){
	    var max = this.h;
	    if (max < this.w ) max = this.w;

	    device.beginPath();

	    for (var i = 0; i < max ; i+=16 ){
	    device.moveTo(i, 0);
	    device.lineTo(i, this.h);
	    device.moveTo(0, i + scr_cnt);
	    device.lineTo(this.w, i + scr_cnt);
	    }
	    device.strokeStyle = "lightgray";
	    device.stroke(); 		
	    }
	    work.putFunc( cl );
	    */
	    obCtrl.draw();

	    var wtxt = [];
/*
	    var wsc = obCtrl.score;

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
    */
	    wt = ehighscore.read(this.result.highscore);
	    work.putchr("Hi-Sc:" + wt, 240, 0);

	    wt = escore.read(obCtrl.score);
	    work.putchr("Score:" + wt, 240, 16);

	    if (enemy_combo >= 2) {
	        var z = 0.0;
	        if (ec_draw_count > 0) {
	            ec_draw_count--;
	            z = ((ec_draw_count) / 60);
	            //	                    work.putchr("" + w, 0, 32, 1.0 + z);

	            //   if (obCtrl.combo[i] >= 2) work.putchr("" + obCtrl.combo[i], 100, 32, 1.0 + z);
	        }

	        var st = "Combo:";
	     //   work.putchr("Combo:", 0, 32);
         //   work.putchr("" + enemy_combo, 12*6, 32, 1.0 + z);
              work.putchr(st + enemy_combo, 0, 32, 1.0 + z);

	    }

        if (item_combo >= 2) work.putchr8("item x" + item_combo, 0, 24);

	    if (this.config.debug) {
	        //		wtxt.push("score:" + wt );//obCtrl.score);
	        wtxt.push("o:" + obCtrl.cnt() + "/" + obCtrl.num());
	        wtxt.push("f:" + mapsc.flame);

	        if (obCtrl.interrapt) {
	            wtxt.push("interrapt:" + obCtrl.SIGNAL);
	        } else {
	            wtxt.push("running:" + obCtrl.SIGNAL);
	        }
	    }

	    wtxt.push("dead:" + dead_cnt);

	    if (Boolean(obCtrl.item[7])) {
	        var st = obCtrl.item[7];
	        if (st >= 10) st = "max";

	        wtxt.push("powerup:" + st);
	    }

	    if (this.config.debug) {
	        for (i in obCtrl.item) {
	            wtxt.push("item[" + i + "]:" + obCtrl.item[i]);
	        }
	        for (i in obCtrl.combo) {
	            wtxt.push("combo[" + i + "]:" + obCtrl.combo[i]);
	        }

	        for (i in obCtrl.combomax) {
	            wtxt.push("combomax[" + i + "]:" + obCtrl.combomax[i]);
	        }

	        var n1 = 0;
	        for (i in obCtrl.total) {
	            if (i == 2) n1 = obCtrl.total[i];
	            //    wtxt.push("total[" + i + "]:" + obCtrl.total[i]);
	        }

	        var n2 = 1;
	        for (i in obCtrl.obCount) {
	            if (i == 2) n2 = obCtrl.obCount[i];
	            //    wtxt.push("ob[" + i + "]:" + obCtrl.obCount[i]);
	        }
	        wtxt.push("rate:" + Math.floor((n1 / n2) * 100) + "par");

	        wtxt.push("hidan:" + obCtrl.hidan);
	    }

	    for (var s in wtxt) {
	        //			work.putchr(wtxt[s],0,0 + 16*s);
	        work.putchr8(wtxt[s], 300, 32 + 8 * s);
	    }
	}
}

function gs_score_effect( sc ){

    var wscore = sc;

    this.read = function (score) {

        if (score <= wscore) {
            wscore = score;
        } else {

            if (score - wscore > 100) {
                num = 1;
                ws_work = wscore;
                ts_work = score;

                for (var i = 0; i < 7; i++) {

                    //           var w = ws_work % 10;
                    //           var s = ts_work % 10;

                    if (ws_work < ts_work) {
                        wscore += num;
                    }

                    num *= 10;

                    ws_work = Math.floor(ws_work / 10);
                    ts_work = Math.floor(ts_work / 10);
                }
            } else {
                wscore++;
            }
        }

        var sc = wscore;

        var wd = [];
        var wt = "";

        for (i = 0; i < 7; i++) {
            var num = sc % 10;
            wd[7 - i] = num;
            sc = (sc - num) / 10;
        }

        for (i in wd) {
            wt = wt + "" + wd[i];
        }

//        wt = wscore + ":" + score;

        return wt;
    }
}

