//Scene
//
function sceneBase(dev){
//dev deviceControlClass 

//宣言部
    var work = dev.graphics1;
    var work2 = dev.graphics2;

	this.init = scene_init;
	this.reset = scene_reset;
	this.step = scene_step;
	this.draw = scene_draw;

//処理部

	function scene_init(){

		//初期化処理
	}

	function scene_reset(){

		//reset処理を記述予定
	}

	function scene_step(){
	//進行

		return 0; //戻すコードで推移する画面を選ぶようにするか？
	}

	function scene_draw(){
	
	//表示
	}
}
