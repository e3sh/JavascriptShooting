// main
function main_r() {

    //	document.oncontextmenu = function(){ return false; };
    var fps = 60; //fps

    var use_reqAF = true; 
    //requestAnimationFrameが使用できるブラウザでは有効/使用できない場合はsetTimeoutを呼び出し間隔固定で使用します。
    //false の場合、setTimeoutを使用し、呼び出し間隔可変で60fpsとなるように呼び出します。
    //requestAnimationFrameでフレームレートが上がらない場合(Firefoxで稀に発生する）や
    //呼び出し間隔固定のsetTimeotでフレームレートが上がらない場合(OperaやSafari）の場合はfalseがよいでしょう。
    //今のところ、requestAnimationFrameが使用できない場合は自動で呼び出し可変setTimeoutとなります。

    // 各ブラウザ対応
    var oldtime = Date.now();
    var fnum = 0;
    
    window.requestAnimationFrame = (function () {
        return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function (callback, element) {
		    fnum++;
		    if (fnum > fps) {
		        fnum = 1;
		        oldtime = Date.now();
		    }

		    var targettime = oldtime + Math.round(fnum * (1000.0 / fps));
		    var newtime = Date.now();
		    var waittime = targettime - newtime;

		    if (waittime <= 0) waittime = 1;

		    setTimeout(callback, waittime);
		};
    })();

    //ロード順が確定しなくてエラーになるから、ここでプロトタイプ宣言してます。
    gObjectClass.prototype.sc_move = ocl_scMove;

    var dev = new deviceControl();
    var work = dev.graphics1;
    var work2 = dev.graphics2;

    var scene = new sceneControl(dev);

    var inp = dev.mouse_state;
    var keys = dev.key_state;

    var tsel = new Number(0.0);

    var oldtime = Date.now();
    var fnum = 0;

    var cur_cnt = 0;

    var startf = false;
    var lc = false;

    var tc = new bench();

    var hf = true;

    main_routine();

    function main_routine() {

        tc.start();

        //hf = (hf) ? false : true;
        if (hf) {

            if (!startf) {
                waittime = 16;
                lc = load_check();
                //lc = false;
            }

            if (lc) {
                startf = true;
                var mstate = inp.check();
                var kstate = keys.check();

                var wtxt = [];
                //debug display
                wtxt.push("mousemove x:" + mstate.x + " y:" + mstate.y + " t:" + tsel);
                wtxt.push("b:" + mstate.button + " w:" + mstate.wheel + " r:" + Math.floor(mstate.deg) + " d:" + Math.ceil(mstate.distance));
                wtxt.push("key:" + kstate);
                //---
                if (mstate.wheel != 0) {
                    tsel += (mstate.wheel > 0) ? 1 : -1;
                }
                var x = mstate.x;
                var y = mstate.y;

                var trig = false;

                if (mstate.button == 0) {
                    trig = true;
                }

                if (mstate.button == 1) {
                    //			var ao = new Audio("sound/shot.wav");
                    //			ao.play();
                }

                /*
                for (var i = 0, loopend = dev.graphics.length; i < loopend; i++) {
                    wtxt.push("work" + i + ":" + dev.graphics[i].count());
                }
                */
                wtxt.push("work :" + work.count());
                wtxt.push("work2:" + work2.count());

                for (var s in wtxt) {
                    work.putchr8(wtxt[s], 0, 0 + 8 * s);
                }

                scene.step();

                //Cursur Draw
                if (trig) {
                    cl = {};
                    cl.x = x; //- inp.o_Left;
                    cl.y = y; //- inp.o_Top;
                    cur_cnt++;
                    cl.mode = cur_cnt % 100;
                    cl.draw = cursur_draw;
                    work.putFunc(cl);
                }
                //		
                //画面全消去
                work.clear();
                //画面表示実施(バッファを画面に反映
                work.draw();
                //バッファをクリア
                work.reset();
                //
                scene.draw();
            }
        }
        tc.end();
        tc.draw(work);

        //work.putchr8("t:" + oldtime + ":" + fnum, 100, 100);
        //work.putchr8("t:" + (oldtime + Math.round(fnum * (1000.0 / fps))) + ":" + fnum, 100, 116);

        requestAnimationFrame(main_routine);
    }

    function load_check() {
        work.readystate_check();
        work2.readystate_check();

        var w1s = work.sprite_texture_ready;
        var w1t = work.character_texture_ready;
        var w2s = work2.sprite_texture_ready;
        var w2t = work2.character_texture_ready;

        work2.print("Load_check", 0, 20);

        st = "w1s_" + (w1s ? "ready" : ".");
        work2.print(st, 0, 40);
        st = "w1t_" + (w1t ? "ready" : ".");
        work2.print(st, 0, 60);
        st = "w2s_" + (w2s ? "ready" : ".");
        work2.print(st, 0, 80);
        st = "w2t_" + (w2t ? "ready" : ".");
        work2.print(st, 0, 100);
        //st = "sndt_" + dev.sound.loadCheck();
        //work2.print(st, 0, 120);

        work2.clear("black");
        work2.draw();
        work2.reset();

        if ((w1s) && (w1t) && (w2s) && (w2t)){
            return true;
        } else {
            return false;
        }
    }
}

function cursur_draw( device ){

		device.save();

		device.setTransform( 1, 0, 0, 1, this.x, this.y );

		device.rotate(3.6*(Math.PI/180)*this.mode);
		
		for (var i=0 ; i<4 ; i++){
			device.beginPath();
			device.moveTo( 0, 8);
			device.lineTo( 0, 24);

			var st = String(255 - this.mode%25 *5)

			device.strokeStyle = "rgb(" + st + ", 128, 255)";

			device.rotate(45*(Math.PI/180));

			device.moveTo( 0, 16);
			device.lineTo( 0, 21);

			device.stroke();
			
			device.rotate(45*(Math.PI/180));
			
		}

		device.beginPath();
		device.arc( 0, 0, 20, 0, 2*Math.PI,true);
		device.stroke();

		device.restore();		
}
