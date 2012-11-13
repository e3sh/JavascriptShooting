//**************************************************************
//deviceControl
//画面表示、入力関係（キーボード、マウス）、サウンド(予定)
//　を多重定義しないようにまとめて扱うクラス。
//  単純に使う場合、不要かもしれない。
//**************************************************************

function deviceControl(){

	//initialize

    //initialize

    var SCREEN_PAGES = 3;

    var dsp = [];

    for (var i = 0; i < SCREEN_PAGES; i++) {
        dsp[i] = new Screen("Layer" + i, 420, 480);
    }
    
    //dsp[0]:Layer0 背景用(Background用） 
    //dsp[1]:Layer1 中間面(Sprite用） 
    //dsp[2]:Layer2 最前面(Text/Status用） 
	//Public

	var inp = new inputControl( "Layer2" );
	var keys = new inputKeyboard();

	//canvas
	//this.graphics = dsp;

	this.canvas = dsp[1]; //使ってないと思うが互換性の為
	this.text = dsp[2]; //前にText面があったときの名残で互換性の為残っている。
	//Public

	//canvas
	this.graphics = dsp[1];
	this.graphics1 = dsp[1];
	this.graphics2 = dsp[0];

	this.text = dsp[2];

	this.canvas = dsp[1];
	this.canvas1 = dsp[1];
	this.canvas2 = dsp[0];
	
	this.mouse_state = inp;

	this.key_state = keys;

//	this.sound;

}