//=============================================================
// TextScreenクラス
//
//=============================================================
function TextScreen( div_id )
{

	var maxdiv = 30;

    var ef_item = []; // クラスを登録して表示用

	for (var i = 0; i < maxdiv ; i++){

		var element = document.createElement('div');
		element.id = "div"+i;
		element.style.position = "absolute";
		element.style.display = "inline";
//	  	element.style.backgroundColor = "white"; "transparent
//		element.style.border = "1px solid DimGray"; 
	//	element.style.textAlign = "center";
	//	element.style.fontWeight = "bolder"; 
		element.style.top = i + "px";
		element.style.left = i + "px";
	   	element.style.width = "24px";
	   	element.style.height = "20px";

		var objBody = document.getElementsByTagName("body").item(0);   
		objBody.appendChild(element);
	}

	var count = 0;

    //-------------------------------------------------------------
    ///文字列の表示
    ///引数 S:文字列 X,Y:座標 c:Color
    //-------------------------------------------------------------
	this.print = function( str ,x ,y ,c ){

		if (!Boolean(c)) { c = "green";}

		var o = {};

		o.text = str;
		o.x = x;
		o.y = y;
		o.color = c;
		o.draw = sp_print2;

		ef_item.push( o );

	}
    	function sp_print2( device ){
		
		//	devive.style.border = "1px solid black";
			device.style.color = this.color;
			device.style.backgroundColor = "transparent"; 
			device.style.left = this.x  + "px";;
			device.style.top = this.y  + "px";
		   	device.style.width = 16 * this.text.length  + "px";
//		   	device.style.height = 24;
			device.style.visibility = "visible";
			device.style.display = "inline";

			device.innerHTML = this.text;
    	}

    	function sp_print( device ){

  //  		device.fillStyle = this.color;
//			device.fillText( this.text , this.x, this.y );

			device.innerHTML += this.str+"<br>";
    	}
	//------------------------------------------------------------
	// クラスで表示コマンドを登録して表示させる。
	// 引数 cl:class
	//------------------------------------------------------------
	this.putFunc = function( cl ){

	//ここで登録するクラスには表示の為に"draw( device )" functionを必ず登録
		ef_item.push( cl );
	}

    //---------------------------------------------------------
    ///画面消去(クリア）
    //---------------------------------------------------------
	this.clear = function(){

		for (var i = 0; i<maxdiv ; i++){
			var element = document.getElementById("div"+i);
			element.style.visibility = "hidden";
			element.style.display = "none";
		}

	}

    //----------------------------------------------------------
    //描画バッファ配列のリセット
    //----------------------------------------------------------
	this.reset = function(){

		ef_item = [];
		//
	}

    //----------------------------------------------------------
    //描画
    //----------------------------------------------------------
	this.draw = function(){

//		alert("in_draw");

		// ef draw
		for ( var i in ef_item ){

			if (i>=maxdiv) break;

			ef_item[ i ].draw( document.getElementById( "div"+i ) );

		}
/*
		for (var i = 0; i<300 ; i++){
			var element = document.getElementById("sp"+i);
			element.style.display = "inline";
		}
*/
	
	};

};
