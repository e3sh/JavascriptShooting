//**************************************************************
//InputKeyboard
//キーボード入力。別にファイルを別にする必要は無し
//**************************************************************

function inputKeyboard(){

// 特殊キー処理については別途検討。通常キーコードを返すのみ。

	var now_key = "NaN";
	
	
	window.onkeypress = function(event){

		now_key = event.keyCode; // + String.fromCharCode(event.keyCode);

	}

	window.onkeyup = function(event){

		now_key = "NaN";

	}	

	this.check = function(){
		
		return now_key;
	
	}
}


