// シナリオ
//　scenario processor version Javascript
//　各オブジェクトの行動を指定するリスト。

//画面効果用シナリオ
function sce_effect_vanish() {
    // 爆発表示せずに消える（STATUSを0に）
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {
        o.type = 5; //　その他
        o.status = 5; //廃棄処理中　
    }
    this.move = function (scrn, o) {

        return -1;
    }
}

function sce_effect_bomb() {
    //BOMB　移動停止させて、表示を爆発にし1.5秒後に消える。
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {
        o.vset(1);
        o.mp = 10;
        o.type = 5; //　その他
        o.status = 5; //廃棄処理中　
        o.frame = 0;

        o.alpha = 254;
    }

    this.move = function (scrn, o) {

        switch (o.frame) {
            case 5:
                //
                break;
            case 90:
                //            return -1;
                o.status = 0;
                break;
            default:
                break;
        };
        o.frame++;

        if (o.frame > 30) o.alpha -= 3;
        //    if (o.frame >= 30) o.status = 0; //return -1;

        return o.sc_move();
    }
}

function sce_effect_billboard( num ) {
    //看板の動き(だんだん消えていくパターン）
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {
        o.vector = num;
        o.vset(2);
    }

    this.move = function (scrn, o) {

        if (o.alpha > 10) {
            o.alpha -= 5;
        } else {
            return -1; //o.alpha = 0;
        }

        return o.sc_move();
    };
}

function sce_effect_bombcircle(col) {

    //Bomb演出テスト用
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {

        o.vset(0);
        o.circle_r = 20;
        o.type = 5;

        o.normal_draw_enable = false;
        o.custom_draw_enable = true;
    }

    this.move = function (scrn, o) {

        if (o.frame > 10) o.status = 0; //時間が来たら消す。

        o.circle_r += ((o.frame + 1) * 10);

        o.frame++;

        return o.sc_move();
    }
    this.draw = function (scrn, o) {

        var cl = {};
        cl.x = o.x;
        cl.y = o.y;
        cl.r = o.circle_r;
        cl.draw = function (device) {
            device.beginPath();

            device.globalCompositeOperation = "lighter";

            device.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
            device.fillStyle = col;
            device.fill();

            device.globalCompositeOperation = "source-over";
        }
        scrn.putFunc(cl);
    }
}

    function sce_effect_warnning_mark(col) {

        //warning mark 表示
        //-----------------------------------------------------------------------
        this.init = function (scrn, o) {

            o.vset(0);
            o.type = 5;
            o.mp = 28;
        }

        this.move = function (scrn, o) {

            if (o.frame > 30) o.status = 0; //時間が来たら消す。

            o.frame++;

            return o.sc_move();
        }

    }
