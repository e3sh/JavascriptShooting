function mapSceControl(){

    var MAPSCBUFMAX = 1000;

    var buffer = [];
    for (var i = 0; i < MAPSCBUFMAX; i++) {
        buffer[i] = new mapSceSubClass();
    }
    var buf_count = 0;
	var event; //= [];
	var map_sc; // = mapScenro();
	
	var f_cnt = -5;
//	var msc_cnt = 0;

	this.enable = true; //外から操作用。trueで追加動作可。falseで不可(受入停止)
	this.counter_runnning = true;//カウンターを進めるかどうか

	this.flame = f_cnt;

	this.stage = 1;

	var stage_msc = [];
	var stage_bg = [];

	stage_msc[1] = mapScenro();
	stage_bg[1] = mapBgImage();

	stage_msc[2] = mapSce_stage2();
	stage_bg[2] = mapBgImage_stage2();

	stage_msc[3] = mapSce_stage3();
	stage_bg[3] = mapBgImage_stage3();
    
	this.change = function (stage) {

	    this.stage = stage;

	    event = [];
	    map_sc = stage_msc[this.stage];
    }

    this.bgImage = function () {
        return stage_bg[this.stage];
    }

    this.init = function () {
        this.stage = 1;

        event = [];
        map_sc = stage_msc[this.stage];
    }

	this.reset = function () {

	    this.enable = true;
	    this.counter_runnning = true;

        f_cnt = -5;
	}

	this.step = function (objc) {

	    if (!this.enable) return;

	    if (this.counter_runnning) f_cnt++;

	    f_cnt = (f_cnt > 2000) ? 0 : f_cnt;
	    for (var i = 0, loopend = map_sc.length; i < loopend; i++) {
	        var w = map_sc[i];

	        if (w.count < f_cnt) continue;

	        if (w.count == f_cnt) {

	            if ((w.x < 0) && (w.y < 0)) {
	                f_cnt = 0;
	                break;
	            }

	            this.add(w.x, w.y, w.r, w.ch, w.sc);

	        }

	        if (w.count > f_cnt) break;
	    }

	    for (var i = 0, loopend = event.length; i < loopend; i++) {
	        var e = event[i];

	        objc.set_s(e.x, e.y, e.r, e.ch, e.sce, e.id);
	    }


	    event = [];

	    this.flame = f_cnt;

	}

	this.add = function (x, y, r, ch, sce, id) {

	    if (!this.enable) return;

	    ev = buffer[buf_count]; // { };
	    buf_count++;
	    if (buf_count >= MAPSCBUFMAX) buf_count = 0;

	    ev.set(x, y, r, ch, sce, id);

	    event[event.length] = ev;
	}

	this.start = function (objc) {
	    for (var i = 0, loopend = map_sc.length; i < loopend; i++) {
	        var w = map_sc[i];

	        if (w.count < 0) {
	            this.add(w.x, w.y, w.r, w.ch, w.sc);
	        }
	    }

	}

	function mapSceSubClass() {
	    this.x;
	    this.y;
	    this.r;
	    this.ch;
	    this.sce;
	    this.id;

	    this.set = function (x, y, r, ch, sce, id) {

	        this.x = x;
	        this.y = y;
	        this.r = r;
	        this.ch = ch;
	        this.sce = sce;
	        this.id = id;
	    }
	}


}
