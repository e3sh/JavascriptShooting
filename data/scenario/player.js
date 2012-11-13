// シナリオ
//　scenario processor version Javascript
//　各オブジェクトの行動を指定するリスト。
//

// 自機の動作に関するシナリオ
function sce_player() {

    // 自機の移動　====
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {
        o.triger = 10;
        o.w_powup = -1;
        o.int_shot = 0;
        //	        o.mp = 1;
        o.custom_draw_enable = true;

        o.move_target_x = o.x;
        o.move_target_y = o.y;

    }

    this.draw = damage_gr1;

    this.move = function (scrn, o) {

        o.frame++;

        if (o.frame <= 90) {
            o.hp = 10; //出現して2秒間は無敵(60fpsだと1.5秒だな)
            o.damageflag = false;
        }
        //standard mouse move 
        //        o.vector = o.target_r(o.mouse_state.x, o.mouse_state.y);
        //        o.vset(8);

        //enhance mouse move

        if (o.mouse_state.distance > 0) {
            o.move_target_x += Math.cos((Math.PI / 180.0) * (o.mouse_state.deg - 90)) * o.mouse_state.distance * 1.0;
            o.move_target_y += Math.sin((Math.PI / 180.0) * (o.mouse_state.deg - 90)) * o.mouse_state.distance * 1.0;

            if (o.move_target_x < 0) { o.move_target_x = 0; }
            if (o.move_target_y < 0) { o.move_target_y = 0; }
            if (o.move_target_x > scrn.cw) { o.move_target_x = scrn.cw; }
            if (o.move_target_y > scrn.ch) { o.move_target_y = scrn.ch; }
        }

        if ((o.mouse_state.x >= 0) && (o.mouse_state.x <= scrn.cw) && (o.mouse_state.y >= 0) && (o.mouse_state.y <= scrn.ch)) {
            o.move_target_x = o.mouse_state.x;
            o.move_target_y = o.mouse_state.y;
        }

        o.vector = o.target_r(o.move_target_x, o.move_target_y);
        o.vset(8);
        //

        var v = o.vector;

        o.mp = 1;

        if ((v > 45) && (v < 135)) o.mp = 3;
        if ((v > 225) && (v < 315)) o.mp = 2;

        o.triger--;
        if (o.triger <= 0) {
            o.shot = 0;
            o.triger = 5;

            if (o.y < scrn.ch * 0.3) { o.collect(); }
        }

        var powup = 0;
        for (var i in o.item) {
            if (i == 7) {
                powup = o.item[i];
            }
        }

        if (powup != o.w_powup) {
            o.w_powup = powup;

            if (powup == 9) o.set_object_ex(10, o.x, o.y, 0, 16);

            if (powup > 10) {
                o.bomb2(); //弾回収モード
                o.set_object_ex(6, o.x, o.y, 0, 48); //bomb爆発演出(白)
                //    o.set_object_ex(10, o.x, o.y, 0, 16);
            }
        }

        if (eval(o.mouse_state.button) == 0) {
            if (o.shot == 0) {
                o.shot = 1;

                if (o.config.sideshot) {
                    o.int_shot = 1 - o.int_shot;
                    if (o.int_shot == 0) {
                        //支援機を弾として打ち出し（絵はシナリオで変更）(本当はCharactorで設定するほうが正解）
                        o.set_object_ex(10, o.x, o.y, o.vector, 40);
                    }
                }
                o.vector = 0;

                if ((powup <= 1) || (powup >= 4)) {
                    o.set_object(6);
                }

                if ((powup == 2) || (powup == 3) || (powup >= 6)) {
                    o.set_object_ex(6, o.x - 12, o.y + 2, 0, 13);
                    o.set_object_ex(6, o.x + 12, o.y + 2, 0, 13);
                }

                if (powup >= 4) {
                    o.set_object_ex(6, o.x - 16, o.y + 6, 355, 13);
                    o.set_object_ex(6, o.x + 16, o.y + 6, 5, 13);
                }


                o.triger = 10; //(15 - (powup > 10) ? 10 : powup);
                if (powup >= 1) o.triger = 5;
                //                o.triger = 5;
            }
            //	o.vset( 5 );
        }

        if (eval(o.mouse_state.button) == 1) {
            //	        if (o.shot == 0) {

            //	            o.shot = 1;
            //	            o.set_object(16);
            //	            o.bomb();
            //	            o.triger = 5;
            //          o.SIGNAL(1);

            if (powup >= 1) {
                o.bomb3();
                o.set_object_ex(6, o.x, o.y, 0, 47); //Bomb爆発演出(赤)
            }
            //	        }
        }
        /*
        if (eval(o.mouse_state.wheel) != 0) {
        if (o.shot == 0) {

        o.shot = 1;
        //	            o.set_object(16);
        o.bomb2();
        o.triger = 5;
        }
        }
        */
        if (o.x + o.vx - o.center_x < 0) { o.vx = 0; }
        if (o.y + o.vy - o.center_y < 0) { o.vy = 0; }
        if (o.x + o.vx + o.center_x > scrn.cw) { o.vx = 0; }
        if (o.y + o.vy + o.center_y > scrn.ch) { o.vy = 0; }


        //		var w = o.target_d( o.mouse_state.x, o.mouse_state.y );
        //        if (o.target_d(o.mouse_state.x, o.mouse_state.y) <= 8) {
        if (o.target_d(o.move_target_x, o.move_target_y) <= 8) {
            o.vx = 0;
            o.vy = 0;
        }


        //Damege表示
        if (o.damageflag) o.set_object_ex(20, o.x, o.y, 0, 42, "Damege!");
        o.damageflag = false;

        // 移動処理
        o.x += o.vx;
        o.y += o.vy;

        var f = 0;

        if (o.status == 2) {//状態が衝突の場合

            if (o.config.itemreset) {
                if (powup == 0) powup = 1;

                for (i = 1; i <= powup; i++) {
                    this.set_object_ex(7, o.x, o.y, Math.floor(Math.random() * 360), 38);
                }
            }
            o.display_size = 2.5;
            o.change_sce(7);
        }

        //        this.add_score(this.score);

        if (o.status == 0) f = 1; //未使用ステータスの場合は削除

        //		if (o.x < 0 || o.x > scrn.cw) { f = 1;}
        //		if (o.y < 0 || o.y > scrn.ch) { f = 1;}

        //		if ( f != 0 ) {
        //			return -1;　//-1返すと削除される。
        //		};
        return f;
    }

    //===以下表示用=============================================================================

    function damage_gr1(scrn, o) {
        //自機のダメージゲージ表示

        var cl = {};
        cl.x = o.move_target_x//o.mouse_state.x;
        cl.y = o.move_target_y//o.mouse_state.y;
        cl.sr = ((360 * ((o.maxhp - o.hp) / o.maxhp) - 90) * (Math.PI / 180));
        cl.df = o.damageflag;
        cl.r = (o.frame < 90)?(105 - o.frame):15;

        cl.draw = function (device) {

            device.beginPath();
            device.strokeStyle = "gray";
            device.lineWidth = "2";
            device.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
            device.stroke();

            device.beginPath();
            device.lineWidth = (this.df) ? "10" : "3";
            device.strokeStyle = (this.df) ? "red" : "white";
            device.arc(this.x, this.y, this.r, this.sr, 1.5 * Math.PI, false);
            device.stroke();

            device.lineWidth = "1";
        }
        scrn.putFunc(cl);

        //        o.damageflag = false;

        //		    scrn.putchr8(o.hp + "", o.x, o.y);
        //       scrn.putchr8("myShip", o.x, o.y);
    }
}

function sce_player_start() {
    //　自機の発進の動き
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {
        o.type = 98;
        //      o.mp = 1;
        o.vector = 0;
        o.vset(8);
    }

    this.move = function (scrn, o) {

        o.hp = 10;

        switch (o.frame) {
            case 30:
                o.vector = 180;
                o.vset(4);
                break;
            case 58:
                //	            o.type = 98;
            case 60:
                //			o.status = 1;
                o.vset(3);
                o.hp = 10;
                //	            o.bomb();
                o.change_sce(1);
                break;
            default:
                break;
        };
        o.frame++;
        return o.sc_move();
    }
}