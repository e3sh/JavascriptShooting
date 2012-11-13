// sceneControl
function sceneControl(dev) {
//sceneが増えてきてmainがすっきりとしなくなったので分離の為作成。2011/05/04

    var sceneList = [];

    sceneList[1] = new gameScene(dev); 
    sceneList[2] = new sceneTitle(dev);
    sceneList[3] = new sceneGover(dev);
    sceneList[4] = new sceneConfig(dev);
    sceneList[5] = new sceneResult(dev);

    for (var i in sceneList) {
        sceneList[i].init();
    }

    var result = sceneList[1].result; 
    var conf = sceneList[4].config;

    sceneList[1].score_load();
    sceneList[4].config_load();

    for (var i in sceneList) {
        sceneList[i].result = result;
        sceneList[i].config = conf;
    }

    var scene = sceneList[2];

    var rc = 2; // 最初のSceneはTitle
    var runscene = rc;

    this.step = function() {

        if (rc != 0) {
            //Sceneの切り替えが発生している。

            var res = sceneList[ runscene ].result;
            var conf = sceneList[ runscene ].config;

            var fg = false; // continue flag
            if (rc >= 10) {
                rc = rc % 10;
                fg = true;
            }

            runscene = rc;

            sceneList[runscene].reset( fg );

            sceneList[runscene].result = res;
            sceneList[runscene].config = conf;

            //        rc = 0;
        }

        rc = sceneList[runscene].step();
    }

    this.draw = function(){

        sceneList[runscene].draw();

    }
}
