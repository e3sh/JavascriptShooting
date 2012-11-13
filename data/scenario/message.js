// シナリオ
//　scenario processor version Javascript
//　各オブジェクトの行動を指定するリスト。

//プレイ中、画面効果（演出）として文字等を表示する部分
function sce_message_billboard( msg, wait) {

    //メッセージ表示（ひとまとまりの文章など）
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {
        o.vset(0);
        o.type = 5; //当たり判定の無い状態にする
        this.normal_draw_enable = false; //visible = false;だと↓も表示されない。
        this.custom_draw_enable = true;

        o.p_count = 0;
        o.mes_col = 0;
        o.mes_line = 0;
        o.p_wait = wait; //一文字表示させるのに何フレームか？
        o.p_endflag = false;

        o.p_st = msg;
    }

    this.move = function (scrn, o) {
        //      o.status = 0;

        o.p_count--;

        if (o.p_count <= 0) {

            if (o.p_endflag) o.status = 0; //endingで消す

            o.mes_col++;
            if (o.mes_col > o.p_st[o.mes_line].length) {
                o.mes_col = 0;
                o.mes_line++;
                if (o.mes_line > o.p_st.length - 1) {
                    o.mes_line = o.p_st.length - 1;
                    o.mes_col = o.p_st[o.mes_line].length;
                    o.p_endflag = true;
                }
            }

            o.p_count = o.p_wait + ((o.p_endflag) ? 40 : 0);
        }

        return o.sc_move();
    }

    this.draw = function (scrn, o) {

        for (var i = 0; i <= o.mes_line; i++) {
            if (i < o.mes_line) {
                scrn.putchr(o.p_st[i], 95, 150 + 16 * i);
            } else {
                var wst = o.p_st[i].slice(0, o.mes_col + 1);
                scrn.putchr(wst, 95, 150 + 16 * i);
            }
        }
    }
}

function sce_message_small(colno) {
    //メッセージ表示(得点などの細かい奴用）colno 0 白/1 赤/2 緑/3 青
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {
        o.vset(1);
        o.type = 5; //当たり判定の無い状態にする
        this.normal_draw_enable = false; //visible = false;だと↓も表示されない。
        this.custom_draw_enable = true;

        o.w_st = o.id;

        o.x -= (o.w_st.length * 8) / 2;

        o.display_size = 1.0;

    }

    this.move = function (scrn, o) {

        if (o.frame > 50) o.status = 0; //時間が来たら消す。

        o.display_size = 1.0 + (o.frame / 150);

        o.frame++;

        return o.sc_move();
    }

    this.draw = function (scrn, o) {

        scrn.putchr8c(o.w_st, o.x, o.y, colno, o.display_size);
    }
}

function sce_message_normal( wait ) {
    //メッセージ表示(普通の文字サイズから拡大(実験用)）
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {
        o.vset(0);
        o.type = 5; //当たり判定の無い状態にする
        this.normal_draw_enable = false; //visible = false;だと↓も表示されない。
        this.custom_draw_enable = true;

        o.w_st = o.id;

        o.x -= (o.w_st.length * 12) / 2;
        o.wait = wait;
        o.display_size = 1.0;

    }

    this.move = function (scrn, o) {

        if (o.frame > wait) o.status = 0; //時間が来たら消す。

        o.display_size = 1.0 + (o.frame / 60);

        o.frame++;

        return o.sc_move();
    }

    this.draw = function (scrn, o) {

        scrn.putchr(o.w_st, o.x, o.y, o.display_size);
    }
}