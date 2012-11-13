//=============================================================
// GeometoryTrancerateクラス
// 画面表示とゲームワールドの座標変換用(簡易だから別にするまでもないか？
//=============================================================
function geometoryTrance() {

this.worldwidth = 1920;//とりあえず
this.worldheight = 1080;

this.stagewidth = 840;
this.stageheight = 960;

this.viewwidth = 420;
this.viewheight = 480;

this.world_x = 0;
this.world_y = 0;

var ww = this.worldwidth;
var wh = this.worldheight;

var sw = this.stagewidth;
var sh = this.stageheight;

var vw = this.viewwidth;
var vh = this.viewheight;

//用途はほぼマウス位置からの座標変換で移動とかのフォロー用
this.viewtoWorld = function (x, y) {

    var w = {}

    w.x = this.world_x + x;
    w.y = this.world_y + y;

    return w;
}
//ゲームオブジェクトは基本的にこちらで変換してから表示
this.worldtoView = function (x, y) {

    var w = {}

    w.x = x - this.world_x;
    w.y = y - this.world_y;

    return w;
}
//ワールド座標におけるビューポートの位置(初期値など）設定
this.viewpos = function (x, y) {
    //左端の座標を指定とする。

    if (x < 0) x = 0;
    if (y < 0) y = 0;
    if (x > ww - vw) x = ww - vw;
    if (y > wh - vh) y = wh - vh;

    this.world_x = x;
    this.world_y = y;
}

this.nowstagepos = function () {

    var w = {}

    //stagelefttop
    w.ltx = this.world_x + (vw / 2) - (sw / 2);
    w.lty = this.world_y + (vh / 2) - (sh / 2);

    //stagerighttop
    w.rtx = this.world_x + (vw / 2) + (sw / 2);
    w.rty = this.world_y + (vh / 2) - (sh / 2);

    //stageleftbottm
    w.lbx = this.world_x + (vw / 2) - (sw / 2);
    w.lby = this.world_y + (vh / 2) + (sh / 2);

    //stagerightbottom
    w.rbx = this.world_x + (vw / 2) + (sw / 2);
    w.rby = this.world_y + (vh / 2) + (sh / 2);

    //stagelefttop(alias)
    w.x = w.ltx;
    w.y = w.lty;

    w.w = sw;
    w.h = sh;

    return w;
}

//this//.setWorldsize = function(){}

//this.setStagesize = function(){}

//this.setViewsize = function(){}



    //-------------------------------------------------------------
    //-------------------------------------------------------------







}



