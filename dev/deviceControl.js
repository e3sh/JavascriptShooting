//**************************************************************
//deviceControl
//��ʕ\���A���͊֌W�i�L�[�{�[�h�A�}�E�X�j�A�T�E���h(�\��)
//�@�𑽏d��`���Ȃ��悤�ɂ܂Ƃ߂Ĉ����N���X�B
//  �P���Ɏg���ꍇ�A�s�v��������Ȃ��B
//**************************************************************

function deviceControl(){

	//initialize

    //initialize

    var SCREEN_PAGES = 3;

    var dsp = [];

    for (var i = 0; i < SCREEN_PAGES; i++) {
        dsp[i] = new Screen("Layer" + i, 420, 480);
    }
    
    //dsp[0]:Layer0 �w�i�p(Background�p�j 
    //dsp[1]:Layer1 ���Ԗ�(Sprite�p�j 
    //dsp[2]:Layer2 �őO��(Text/Status�p�j 
	//Public

	var inp = new inputControl( "Layer2" );
	var keys = new inputKeyboard();

	//canvas
	//this.graphics = dsp;

	this.canvas = dsp[1]; //�g���ĂȂ��Ǝv�����݊����̈�
	this.text = dsp[2]; //�O��Text�ʂ��������Ƃ��̖��c�Ō݊����̈׎c���Ă���B
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