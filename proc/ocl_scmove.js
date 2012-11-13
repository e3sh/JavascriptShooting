//=============================================================
// GameObjectClass の外部funtion
// ゲームオブジェクトクラスで一部長くなったので外に出した
//=============================================================
function ocl_scMove()
{

    var f = 0;

    if (this.status == 2) {//状態が衝突の場合

        switch (this.type) {//自身のタイプが...
            case 1: //自弾
            case 3: //敵弾
                this.change_sce(7); //弾が煙出さない場合は6
                break;
            case 2: //敵
                this.display_size *= 2; //爆発を大きくする
                this.change_sce(7);
                var wc = (this.chr == 14) ? 7 : 20; //ボスならばアイテムでも出してみる。その他は得点など
                this.set_object_ex(wc, this.x, this.y, 180, 36);
                this.add_score(this.score);
                break;
            case 4: //アイテム(敵がアイテムを取得する場合の事は考えていない。/その場合は別typeにする等判断が必要）
                this.change_sce(6); //ただ消えるのみ
                //                    this.add_score(this.score);
                this.get_item(this.chr);
                break;
            default:
                break;
        }
        /*
        if ((this.type == 1) || (this.type == 3)) {
        this.change_sce(7); //弾が煙出さない場合は6
        } else {
        this.change_sce(7);
        var wc = (this.chr == 14) ? 7 : 20; //ボスならばアイテムでも出してみる。
        this.set_object_ex(wc, this.x, this.y, 180, 4);
        this.add_score(this.score);
        }

        /*
        switch (this.type) {
        case 1: //自弾
        case 3: //敵弾
        this.change_sce(6);
        break;
        default://その他
        this.change_sce(7);
        break;
        }
        */
    }

    //        this.add_score(this.score);

    if (this.status == 0) f = 1; //未使用ステータスの場合は削除

    // 移動処理
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > this.scrn.cw) { f = 2; }
    if (this.y < 0 || this.y > this.scrn.ch) { f = 2; }

    if (f != 0) {
        if (f == 2) this.reset_combo(this.type);
        //            if ((this.type == 4) && (f == 2)) this.reset_combo(4); //アイテム逃がすとカウントリセット

        return -1; //0以外を返すと削除される。
    };

    this.damageflag = false;

    return 0;
    }
