
this.TWIST = this.TWIST || {};

(function () {
    "use strict";

    function BaseGame() {}

    var p = BaseGame.prototype = new EventEmitter();

    p.initBaseGame = function () {

        //Event List
        this.events = {
            info: "drawInfo"
        };

        //Player List
        this.player = [];
        
        this.initCanvas();
    };

    p.initCanvas = function () {
        var canvas = this.wrapper.find('canvas')[0];
        if (!canvas)
            return;

        var _self = this;

        var stage = new createjs.Stage(canvas);
        stage.enableMouseOver(20);
        var context = stage.canvas.getContext("2d");
        context.mozImageSmoothingEnabled = true;
        createjs.Touch.enable(stage);
        createjs.Ticker.setFPS(60);
        stage.width = canvas.width;
        stage.height = canvas.height;
        createjs.Ticker.addEventListener("tick", onUpdateStage);
        this.on('destroy', function () {
            createjs.Ticker.removeEventListener("tick", onUpdateStage);
            _self.removeAllListeners();
        });
        this.canvas = stage;

        function onUpdateStage() {
            stage.update();
        }
    };

    p.initEvent = function () {
        var events = this.events;
        for (var pro in events) {
            this.on(pro, this[events[pro]]);
        }
    };

    TWIST.BaseGame = BaseGame;

})();