function gObjectControl(scrn, dev) {

    //メイン
    var cdt = new CLinear4TreeManager();
    if (!cdt.init(3, 0, 0, scrn.cw, scrn.ch)) { alert("!"); }//1画面なのでこれで

    var debug_colnum;

    delobj = 0;

    this.score = 0;

    this.config = {};

    this.interrapt = false;

    this.SIGNAL = 0;

    //	this.restart = 0;


    //以下はコンティニューでもリセット
    this.item = []; //現在取得しているアイテム(リセットオンだとやられると0）(消す処理自体はgameSceneで処理）

    this.combo = []; //連続して敵を倒したり、アイテム[20]を取った数。逃げられたり取りそこなうと0

    this.obCount = []; //出現したキャラクタの総数

    this.combomax = []; //comboが続いた内の最大値

    this.total = []; //種類別の倒した総数(主に敵）　倒した総数/出現した数で撃墜率などを算出で使用予定

    this.hidan = 0;

    var restart_count = 0;
    var map_sc;

    var before_int;
    var before_SIG;
    //  var map_sc = mapScenro();
    var ch_ptn = character();
    var motion_ptn = motionPattern();

    var sce = scenario()

    // オブジェクトの情報をArrayで管理
    var obj = [];

    //当たり判定用マップ

    var csmap = []; //collisonmap
    //         自･弾･敵･弾･物･他
    csmap[0] = [0, 0, 1, 1, 1, 0]; //自機味方
    csmap[1] = [0, 0, 1, 0, 0, 0]; //自弾
    csmap[2] = [1, 1, 0, 0, 0, 0]; //敵
    csmap[3] = [1, 0, 0, 0, 0, 0]; //敵弾
    csmap[4] = [2, 0, 0, 0, 0, 0]; //アイテム
    csmap[5] = [0, 0, 0, 0, 0, 0]; //その他

    //再読み込み無しの再起動
    this.reset = function (cont_flag) {
        
        cdt = new CLinear4TreeManager();
        if (!cdt.init(3, 0, 0, scrn.cw, scrn.ch)) { alert("!"); }

        delobj = 0; //不要かも

        restart_count = 0;

        if (this.config.cold) {
            this.score = 0;

            this.obCount = []; //出現したキャラクタの総数
            this.combomax = []; //comboが続いた内の最大値
            this.total = []; //種類別の倒した総数(主に敵）　倒した総数/出現した数で撃墜率などを算出で使用予定
            this.hidan = 0;
            this.combo = [];
            this.item = [];

        }

        if (!cont_flag) {
            this.interrapt = false;
            this.SIGNAL = 0;

            obj = [];

            this.config.cold = true;
            //    this.item = [];
        }

        if (this.config.fullpower) {
            this.item[7] = 10;
        }
    }

    //move ======================================
    //オブジェクトの移動/各処理のループ

    this.move = function (mapsc) {

        map_sc = mapsc;

        //    var mstate = dev.mouse_state.check();
        var mstate = dev.mouse_state.check_last();
        //	var kstate = dev.key_state.check();

        // 移動などの処理
        for (var i in obj) {
            var o = obj[i];

            o.mouse_state = mstate;
            //		o.key_state = kstate;

            o.colitem && o.colitem.remove();

            if (o.move(scrn, o, mapsc) != 0) {
                delete obj[i];
                delobj++;
            } else {

                if (o.type != 5) {//その他は当たり判定リストに載せない

                    if (!o.colitem) {
                        o.colitem = cdt.createObjectForTree();
                        o.colitem.obj = o;
                    }

                    cdt.register(o.x - o.hit_x / 2, o.y - o.hit_y / 2,
                    o.x + o.hit_x / 2, o.y + o.hit_y / 2,
		            o.colitem);

                    o.crash = null;
                }
            }
            //messageの処理

            for (var mcnt in o.message) {
                var ms = o.message[mcnt];

                if (ms.cmd == "add_score") this.score += ms.src;

                if (ms.cmd == "get_item") {

                    if (Boolean(this.item[ms.src])) {
                        this.item[ms.src]++;
                    } else {
                        this.item[ms.src] = 1;
                    }


                    var c_rate = 1;
                    if (ms.src == 20) {
                        c_rate = this.combo_sub(4);
                    }

                    this.score += o.score * c_rate;
                    var wid = (ms.src == 7) ? "Powerup!" : (o.score * c_rate) + "pts.";

                    map_sc.add(o.x, o.y, 0, 20, 43 + ((ms.src == 7) ? 1 : 0), wid);
                    //   o.set_object_ex(20, this.x, this.y, 0, 39, wid);メッセージ処理部の終了でメッセージキューはリセットされるので直接処理する事
                }

                if (ms.cmd == "reset_combo") {

                    for (var cb in this.combo) {
                        if (ms.src == cb) {
                            this.combo[cb] = 0;
                        }
                    }
                }

                if (ms.cmd == "SIGNAL") {

                    if (this.interrapt) {
                        this.interrapt = false;
                        this.SIGNAL = 0;
                    } else {
                        this.interrapt = true;
                        this.SIGNAL = ms.src;

                        if (ms.src == 0) this.interrapt = false;
                    }
                }

                if ((ms.cmd == "bomb2") || (ms.cmd == "bomb3")) {

                    if (Boolean(this.item[7])) { //PowerUpを減らす。

                        if (this.item[7] > 0) this.item[7]--;
                    }
                }

                command[ms.cmd](o, ms.src, ms.dst);

            }
            o.message = [];
        }

        //Hit

        var res = cdt.getAllCollisionList();

        debug_colnum = res.length;
        /*
        if (!res) { dummy = "none"; } else { dummy = cnt + ":" + res.length + ":" + cdt.objectNum; }
        */

        for (var i = 0; i < res.length; i += 2) {

            var o = res[i];
            var e = res[i + 1];

            var type_w1 = (o.type == 98) ? 0 : o.type;
            var type_w2 = (e.type == 98) ? 0 : e.type;

            var flag = csmap[type_w1][type_w2];

            if (flag == 0) continue;

            if ((Math.abs(o.x - e.x) < (o.hit_x + e.hit_x) / 2) && (Math.abs(o.y - e.y) < (o.hit_y + e.hit_y) / 2)) {

                o.status = 2;
                e.status = 2;
                o.crash = e;
                e.crash = o;
            }
        }

        /*
        var crash = [];
        for (i in obj) {
        crash[i] = 0;
        o = obj[i];
        var type_w1 = (o.type == 98) ? 0 : o.type;

        for (var j in obj) {
        var e = obj[j]

        if (crash[j] != 0) continue;
        if (i == j) continue;

        var type_w2 = (e.type == 98) ? 0 : e.type;

        var flag = csmap[type_w1][type_w2];

        if (flag == 0) continue;

        if ((Math.abs(o.x - e.x) < (o.hit_x + e.hit_x) / 2) && (Math.abs(o.y - e.y) < (o.hit_y + e.hit_y) / 2)) {

        o.status = 2;
        e.status = 2;
        o.crash = e;
        e.crash = o;
        crash[j] = 1;
        crash[i] = 1;
        }

        }
        }
        */

        for (i in obj) {
            o = obj[i];

            if (o.crash) {
                if ((o.type == 1) || (o.type == 3)) {
                    //弾の場合はそのまま消滅
                } else {
                    var whp = o.hp;
                    if (o.type == 4) o.hp = 0;
                    if (o.crash.type != 4) o.hp -= (o.crash.hp > 0) ? o.crash.hp : 1;
                    if (o.hp > 0) {
                        o.status = 1;
                        if (whp != o.hp) {
                            if (o.type == 98) this.hidan++;
                            o.damageflag = true;
                        }
                        o.crash = null;
                    } else {
                        if (o.type == 2) {
                            this.combo_sub(2);
                        }
                    }
                }
                //if crash !=0
            }
            //for loop
        }


        //    if (delobj > 10){obj.sort(); delobj = 0;}//消した配列が10個超えたらソート
        //    if (!obj[obj.length-1]) {obj.pop();}//空の配列を削除します。

        var f = 0;
        for (i in obj) {
            if (obj[i].type == 98) f++;
        }

        if (f == 0) {
            restart_count++;

            if (restart_count > 90) {
                before_int = this.interrapt;
                before_SIG = this.SIGNAL;
                this.interrapt = true;
                this.SIGNAL = 4649;
                //画面から自機がいなくなったらリスタートシグナルを上げる(数字は適当で仮）  
            }
        }
    }

    this.combo_sub = function (num) {
        if (!Boolean(this.combo[num])) {
            this.combo[num] = 1;
        } else {
            this.combo[num]++;
        }

        if (!Boolean(this.combomax[num])) {
            this.combomax[num] = this.combo[num];
        } else {
            if (this.combo[num] > this.combomax[num]) this.combomax[num] = this.combo[num];
        }

        if (!Boolean(this.total[num])) {
            this.total[num] = 1
        } else {
            this.total[num]++;
        }

        return this.combo[num];
    }


    //外部からリスタート指示の為のコマンド  
    this.restart = function () {

        map_sc.start();
        restart_count = 0;

        this.interrapt = before_int;
        this.SIGNAL = before_SIG;
    }

    var command = [];

    command["set_object"] = function (o, src, dst) {

        //		set_sce( o.x,  o.y , o.vector , src );

        map_sc.add(o.x, o.y, o.vector, src);

    }

    command["set_object_ex"] = function (o, src, dst) {
        // dst.x dst.y dst.vector src dst.sce

        //		set_sce( o.x,  o.y , o.vector , src, dst );

        map_sc.add(dst.x, dst.y, dst.vector, src, dst.sce, dst.id);

    }

    command["get_target"] = function (o, src, dst) {

        var tgt_no = 1;
        var wdist = 99999;

        o.target = null; //o; //{}; 見つからなかった場合

        for (var i in obj) {
            var wo = obj[i];
            if (wo.type != src) continue;

            var d = wo.target_d(o.x, o.y);
            if (d < wdist) {
                o.target = wo;
                wdist = d;
            }

        }

    }

    command["change_sce"] = function (o, src, dst) {
        //バグの温床になる危険を秘めています。要注意。

        o.init = sce.init[src];
        o.move = sce.move[src];
        o.custom_draw = sce.draw[src];

        o.init(scrn, o);
    }


    command["add_score"] = function (o, src, dst) {

        return src;
    }

    command["get_item"] = function (o, src, dst) {

        return src;
    }

    command["bomb"] = function (o, src, dst) {

        for (i in obj) {
            if (obj[i].type == 3) {//敵の弾を消滅

                obj[i].change_sce(7);
            }
        }
    }

    command["bomb2"] = function (o, src, dst) {

        for (i in obj) {
            o = obj[i];

            if (o.type == 3) {//敵の弾を回収状態に
                o.type = 4;
                o.mp = 18;
                o.score = 8;
//test用
                if (o.chr != 7) {
                    var witem = [18, 22, 26, 27, 29, 30];

                    o.mp = witem[Math.floor(Math.random() * witem.length)];
                }

                o.change_sce(30);
            }
        }
    }

    command["bomb3"] = function (o, src, dst) {

        for (i in obj) {
            if (obj[i].type == 2) {//敵には一律10のダメージ
                obj[i].hp -= 10;
                if (obj[i].hp <= 0) obj[i].status = 2;
            }

            if (obj[i].type == 3) {//敵の弾を消滅

                obj[i].change_sce(7);
            }
        }
    }

    command["collect"] = function (o, src, dst) {

        for (i in obj) {
            o = obj[i];

            if (o.type == 4) {//アイテムを回収モードに変更（上のほうに行ったときに）

                if (!Boolean(o.collection_mode)) {
                    o.collection_mode = true;
                    o.change_sce(30);
                }
            }
        }
    }

    command["SIGNAL"] = function (o, src, dst) {

        //		this.pause = true;

        //		this.SIGNAL = src;
    }

    command["reset_combo"] = function (o, src, dst) {

        //		this.pause = true;

        //		this.SIGNAL = src;
    }


    // draw ======================================
    // オブジェクトの描画

    this.draw = function (wscreen) {

        if (!Boolean(wscreen)) wscreen = scrn;

        for (var i in obj) {
            var o = obj[i];

            //	o.wn = i;

            if (o.visible) {

                if (o.normal_draw_enable) {
                    o.draw(wscreen, o);
                }

                if (o.custom_draw_enable) {
                    //	                if (Boolean(o.custom_draw)) {
                    o.custom_draw(wscreen, o);
                    //	                }
                }
            }
        }

        wscreen.putchr8("obj:" + cdt.objectNum, 0, 32);

        wscreen.putchr8("col:" + debug_colnum/2, 0, 40);

    }


    this.set_s = set_sce;

    function set_sce(x, y, r, ch, sc, id) {

        var o = new gObjectClass();

        o.reset();

        o.scrn = scrn;
        o.mouse_state = dev.mouse_state.check_last();
        o.item = this.item;
        o.config = this.config;

        o.x = x;
        o.y = y;
        o.vector = r;
        o.chr = ch;
        o.visible = true;

        o.mp = ch_ptn[ch].mp;
        o.hp = ch_ptn[ch].hp;
        o.maxhp = o.hp;
        o.type = ch_ptn[ch].type;
        o.center_x = ch_ptn[ch].center_x;
        o.center_y = ch_ptn[ch].center_y;
        o.hit_x = ch_ptn[ch].size_x;
        o.hit_y = ch_ptn[ch].size_y;

        if (!Boolean(id)) id = ch_ptn[ch].id;
        o.id = id;

        o.score = ch_ptn[ch].score;
        o.status = 1; //StatusValue.Normal ;

        if (!Boolean(sc)) sc = ch_ptn[ch].senario[0];

        o.init = sce.init[sc];
        o.move = sce.move[sc];
        o.draw = cntl_draw;
        o.custom_draw = sce.draw[sc];

        o.init(scrn, o);

        var epty = -1;

        for (var i = 0; i < obj.length; i++) {
            if (!obj[i]) {//空の配列を探す。
                epty = i;
                break;
            }
        }

        if (epty == -1) {
            obj.push(o);
        } else {
            obj[epty] = o;
        }

        //		obj.push(o);

        if (Boolean(this.obCount[o.type])) {
            this.obCount[o.type]++;
        } else {
            this.obCount[o.type] = 1;
        }
    };

    this.num = function () {

        return obj.length;

    }

    this.cnt = function () {

        var c = 0;

        for (var i in obj) {
            c++;
        }

        return c;

    }

    function cntl_draw(scrn, o) {

        //表示
        if (Boolean(motion_ptn[o.mp].wait)) {
            o.mp_cnt_frm++;
            if (o.mp_cnt_frm > motion_ptn[o.mp].wait / 2) {
                o.mp_cnt_anm++;
                o.mp_cnt_frm = 0;
                if (o.mp_cnt_anm >= motion_ptn[o.mp].pattern.length) o.mp_cnt_anm = 0;
            }
        }
        try {
            var ptn = motion_ptn[o.mp].pattern[o.mp_cnt_anm][0];
        }
        catch (e) {
            //            alert("error" + e + "..");
            //            alert("mp:" + o.mp + " cnt_anm:" + o.mp_cnt_anm);

            o.mp_cnt_anm = 0;
            ptn = motion_ptn[o.mp].pattern[o.mp_cnt_anm][0];
        }

        var wvh = motion_ptn[o.mp].pattern[o.mp_cnt_anm][1];
        var wr = motion_ptn[o.mp].pattern[o.mp_cnt_anm][2];

        if ((wvh == -1) && (wr == -1)) {
            wvh = 0;
            wr = o.vector;
        };
        scrn.put(ptn, o.x, o.y, wvh, wr, o.alpha, o.display_size);

 //scrn.put(ptn,((o.x-180)*(o.y/480))+180 ,120+(o.y/2),wvh,wr,o.alpha,(o.y/100)*o.display_size);
        //		scrn.putchr8(o.wn + "",o.x, o.y );
    }

}
