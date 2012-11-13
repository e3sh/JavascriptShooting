// シナリオ
//　scenario processor version Javascript
//　各オブジェクトの行動を指定するリスト。

//共通
function sce_common_vset(num) {
    // 移動開始で速さ num の移動量を与える
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {
        o.vset( num );
    }

    this.move = function (scrn, o) {

        return o.sc_move();
    }
}

function sce_common_signal(num) {
    //シグナル出力
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {

        o.vset(0);

        o.normal_draw_enable = false;
        o.custom_draw_enable = false;
    }

    this.move = function (scrn, o) {

        if (o.frame == 0) {
            o.SIGNAL( num ); 
        } else {
            o.SIGNAL(0);
            o.status = 0;
        }
        o.frame++;

        return o.sc_move();
    }
}
