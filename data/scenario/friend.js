// シナリオ
//　scenario processor version Javascript
//　各オブジェクトの行動を指定するリスト。
//
//支援機（オプション）の動作に関するシナリオ
function sce_friend_rotate() {
    //　味方（支援機）の動作(rotation)
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {
        o.vector = Math.floor(Math.random() * 360);
        o.vset(0);
        o.get_target(98);
        o.startflag = true;
        o.shot = 0;
        o.triger = 0;
    }

    this.move = function (scrn, o) {

        if (!o.config.option) o.status = 0;

        var f = 0;

        if (o.startflag) {
            o.get_target(98);
            o.startflag = false;
            return 0;
        }

        if (o.target.type != 98) {//ターゲットが自機じゃなくなった場合
            if (o.startflag) {
                o.get_target(98);
                o.startflag = false;
            } else {
                o.change_sce(7);
            }
        }

        var powup = 0;
        for (var i in o.item) {
            if (i == 7) {
                powup = o.item[i];
            }
        }

        if (powup != 9) o.status = 0; //パワーアップ段階が9以下のときは消える

        o.triger--;
        if (o.triger <= 0) {
            o.shot = 0;
            o.triger = 0;
        }

        if (eval(o.mouse_state.button) == 0) {
            if (o.shot == 0) {
                o.shot = 1;
                if (o.config.sideshot) o.set_object_ex(10, o.x, o.y, o.vector, 41);
                //               o.set_object(13);
                o.triger = 10;
            }
        }

        if (this.status == 0) f = 1; //未使用ステータスの場合は削除

        o.x = o.target.x + Math.cos((o.vector - 90) * (Math.PI / 180.0)) * 25;
        o.y = o.target.y + Math.sin((o.vector - 90) * (Math.PI / 180.0)) * 25;

        o.vector = (o.vector + 12 + 360) % 360;
        return f;
    }
}

function sce_friend_start() {
    //　味方（支援機）の発進
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {
        o.vset(8);
    }

    this.move = function (scrn, o) {

        if (!o.config.option) o.status = 0;

        o.hp = 10;

        switch (o.frame) {
            case 30:
                o.vector = 180;
                o.vset(4);
                o.get_target(98);
                break;
            case 58:
                //				o.get_target( 98 );
            case 59:
                //	o.status = 0;
                o.vector = o.target_v(); //o.vector = o.target_r(o.target.x, o.target.y);
                //	        	o.vset( 1 );
            case 60:
                o.vset(0);
                o.change_sce(21);
                break;
            default:
                break;
        };
        o.frame++;

        return o.sc_move();
    }

}

function sce_friend_sidearm() {
    //支援機の動作２
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {
        //		o.vector = Math.floor(Math.random() * 360 );
        o.vset(0);
        o.triger = 15;
        //		o.get_target( 98 );
        o.m_trig = 0;

        o.frame = 60;
    }

    this.move = function (scrn, o) {

        if (!o.config.option) o.status = 0;

        var wr = o.vector;
        wr = (wr > 180) ? wr + 70 : wr - 70;
        o.triger--;
        if (o.triger <= 0) {
            o.shot = 0;
            o.triger = 0;
        }

        var powup = 0;
        for (var i in o.item) {
            if (i == 7) {
                powup = o.item[i];
            }
        }

        if (powup < 10) { o.mp = 15; } else { o.mp = 24; }  

        if (eval(o.mouse_state.button) == 0) {
            if (o.shot == 0) {
                o.shot = 1;

                if (((powup >= 3) && (powup <= 4)) || (powup >= 8)) {
                    o.set_object_ex(6, o.x, o.y, (o.vector > 180) ? o.vector + 87 : o.vector - 87, 13);
                }

                o.m_trig = 1 - o.m_trig;
                //                o.set_object_ex(20, o.x, o.y, 0, 42, "test:"+o.m_trig);
                if (powup >= 5) {
                    if (o.m_trig == 0) o.set_object(13);
                }

                if (o.frame > 45) {
                    if (powup >= 10) {
                        o.set_object(23);
                        o.frame = 0;
                    }
                }

                //                o.set_object(13);
                //   o.triger = 20 - ((powup > 15) ? 15 : powup);
                //               o.triger = (powup > 3) ? 5 : (3 - powup) * 5;
                //               o.vector = (o.vector > 180) ? o.vector + 80 : o.vector - 80;

                o.triger = 15;
                if (powup >= 7) o.triger = 5;
            }
            //	        wr = (wr > 180) ? wr + 60 : wr - 60;
            //	o.vset( 5 );
            wr = o.vector
        }

        var f = 0;

        if (o.target.type != 98) {//ターゲットが自機じゃなくなった場合
            o.change_sce(7);
        }

        //        this.add_score(this.score);

        if (this.status == 0) f = 1; //未使用ステータスの場合は削除
        /*
        if (powup <= 3) {
        o.x = o.target.x + Math.cos((wr - 90) * (Math.PI / 180.0)) * 32;
        o.y = o.target.y + Math.sin((wr - 90) * (Math.PI / 180.0)) * 32;

        o.vector = (o.vector + 12 + 360) % 360;
        } else {
        o.x = o.target.x + Math.cos((wr - 90) * (Math.PI / 180.0)) * 32;
        o.y = o.target.y + Math.sin((wr - 90) * (Math.PI / 180.0)) * 32;
        }
        //	    o.x = o.target.x + Math.cos((o.vector - 90) * (Math.PI / 180.0)) * 32;
        //	    o.y = o.target.y + Math.sin((o.vector - 90) * (Math.PI / 180.0)) * 32;
        */
        o.x = o.target.x + Math.cos((wr - 90) * (Math.PI / 180.0)) * 32;
        o.y = o.target.y + Math.sin((wr - 90) * (Math.PI / 180.0)) * 32;

        //		o.vector = (o.vector + 12 + 360) % 360;

        o.frame++;

        return f;
    }
}