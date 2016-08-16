
this.TWIST = this.TWIST || {};

(function () {
    "use strict";

    function BaseGame() {}

    var initOptions = {
        width: 1000,
        height: 580
    };
    var p = BaseGame.prototype = new EventEmitter();

    p.initBaseGame = function () {

        //Event List
//        this.events = {
////            info: "drawInfo"
//        };

        this.initEvent();
        this.initCanvas();
        this.initStage();
    };

    p.initCanvas = function () {
        var canvas = $(TWIST.HTMLTemplate.canvas);
        canvas.attr({
            width: this.options.width || initOptions.width,
            height: this.options.height || initOptions.height
        });
        this.canvas = canvas;
        return canvas;
    };
    
    p.initStage = function() {
        this.wrapper.append(this.canvas);

        var _self = this;

        var stage = new createjs.Stage(this.canvas[0]);
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
        this.stage = stage;

        function onUpdateStage() {
            stage.update();
        }
    }

    p.initEvent = function () {
        var events = this.events;
        for (var pro in events) {
            this.on(pro, this[events[pro]]);
        }
    };

    TWIST.BaseGame = BaseGame;

})();