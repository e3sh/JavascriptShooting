// シナリオ
//　scenario processor version Javascript
//　各オブジェクトの行動を指定するリスト。

//敵の動作シナリオ（ボスは別ファイル）
function sce_ememy_move_n(num1, num2) {
    //　出現後、まっすぐ進んだ後向き変更してしばらく後にさらに向き変更する
    //　途中でいろいろ弾打ったりするパターン　　
    //-----------------------------------------------------------------------

    this.init = function (scrn, o) {
        o.vset(4);
    }

    this.move = function (scrn, o) {

        switch (o.frame) {
            case 80:
                o.get_target(98);
                break;
            case 90:
                //				o.vector = o.target_r( o.target.x, o.target.y );
                break;
            case 100:
                o.vector = o.target_v(); //o.vector = o.target_r( o.target.x, o.target.y );
                o.set_object(103);
                break;
            case 110:
                o.set_object(3);
                break;
            case 120:
                o.set_object(4);
                o.vector = num1;
                o.vset(4);
                break;
            case 140:
                //    o.set_object(103);
                break;
            case 160:
                o.vector = num2;
                o.vset(4);
                break;
            default:
                break;
        }
        o.frame++;
        o.frame++; //frame rate *2

        return o.sc_move();
    }
}

function sce_ememy_turn( num ){
    //　回りながら移動する敵の動き、途中弾撃つ
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {
        o.vset(4);
    }

    this.move = function (scrn, o) {

        switch (o.frame) {
            case 5:
//                o.set_object(3);
                o.set_object_ex(3, o.x, o.y, o.vector + Math.floor(Math.random() * 40) - 20, "exev_5expansion");
                break;
            case 15:
                o.vector += num;
                o.vset(4);
                break;
            case 25:
                o.vector += num;
                o.vset(4);
                break;
            case 35:
                o.vector += num;
                o.vset(4);
                break;
            case 45:
                o.frame = 9;
                break;
            default:
                break;
        }
        o.frame++;

        return o.sc_move();
    }
}

function sce_ememy_change_s() {
    //　まっすぐ下に降りて来ながらExevent1番実行した後、0.5秒後シナリオを9に変更
    //　ほぼ動作テスト用
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {
        o.vset(4);
        o.vector = 180;
    }

    this.move = function (scrn, o) {

        if (o.frame == 15) {
            o.set_object(102);
            o.change_sce(9);
        }
        o.frame++;

        return o.sc_move();

    }
}

function sce_ememy_moveshot() {

    //移動しながら定期的に弾をばら撒いていく（その１）
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {
        o.vset(8);
    }

    this.move = function (scrn, o) {

        if (o.frame % 10 == 5) {
            //            o.set_object(12);
            o.set_object_ex(5, o.x, o.y, o.vector, 52);
        }
        o.frame++;

        return o.sc_move();
    }
}

function sce_ememy_randomshot() {
    // ランダム弾用母機
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {
        o.vset(4);
        o.w_cnt = 0;

        o.display_size = 1.5;
    }

    this.move = function (scrn, o) {

        switch (o.frame) {
            case 10:
                o.vset(0);
                break;
            case 13:
                o.set_object(12);
                break;
            case 15:
                o.frame = 12;
                o.w_cnt++;
                break;
            default:
                break;
        };
        o.frame++;

        if (o.w_cnt > 50) {
            o.w_cnt = 0;
            //			o.vector = 170 + Math.floor( Math.random() * 20 );
            o.vset(1);
            o.frame = 0;
        }

        return o.sc_move();

    }
}
