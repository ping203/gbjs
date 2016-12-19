
this.TWIST = this.TWIST || {};

(function () {
  "use strict";

  function BaseGame() {}

  var initOptions = {
    width: 1280,
    height: 720
  };
  var p = BaseGame.prototype = new EventEmitter();

  p.initBaseGame = function (options) {

    //Event List
//        this.events = {
////            info: "drawInfo"
//        };

    this.initEvent();
    this.initCanvas();
    this.wrapper.append(this.canvas);
    this.initStage(options);
  };

  p.initCanvas = function () {
    var canvas = $(TWIST.HTMLTemplate.canvas);
    canvas.attr({
      width: this.options.width || initOptions.width,
      height: this.options.height || initOptions.height
    });
//        canvas.addClass('twist');
    this.canvas = canvas;
    return canvas;
  };

  p.initStage = function (options) {
    var _self = this;
    var stage = new createjs.Stage(this.canvas[0]);
    $.extend(stage,options);
    TWIST.Observer._canvasList.push(stage);
    stage.enableMouseOver(20);
    var context = stage.canvas.getContext("2d");
    context.mozImageSmoothingEnabled = true;
    createjs.Touch.enable(stage);
    createjs.Ticker.setFPS(60);
    stage.width = this.canvas.width;
    stage.height = this.canvas.height;
    createjs.Ticker.addEventListener("tick", onUpdateStage);
    this.on('destroy', function () {
      var _stageIndex = TWIST.Observer._canvasList.findIndex(function(item,index){
        return item == stage;
      });
      if(_stageIndex > -1 ){
        TWIST.Observer._canvasList.splice( _stageIndex, 1 );
      }
      createjs.Ticker.removeEventListener("tick", onUpdateStage);
      _self.removeAllListeners();
      _self.timeOutList.forEach(function (item, index) {
        clearTimeout(item);
      });
    });
    this.stage = stage;

    function onUpdateStage() {
      stage.update();
    }
  };

  p.initEvent = function () {
    this.timeOutList = [];
    this.on('destroy', function () {
      TWIST.Sound.stop();
    });
  };

  p.addNumberEffect = function (el, type) {

    var jElement = el;
    var _self = this;
    var numberWithDotType = "numberWithDot" + (type || "");

    var oldValue = jElement.text();
    oldValue = parseInt(oldValue.replace(/\./g, ""));
    if (isNaN(oldValue))
      oldValue = 0;
    jElement.prop('_counter', oldValue);

    jElement.runEffect = function (newValue, options) {
      jElement.finish();
      jElement.isDone = true;
      var initOptions = {
        duration: 1000,
        step: function (now) {
          jElement.text(Global[numberWithDotType](Math.ceil(now)));
        },
        done: function () {
          jElement.endEffect();
        }
      };
      $.extend(initOptions, options);
      this.animate({
        _counter: newValue
      }, initOptions);
    };

    jElement.endEffect = function () {
      jElement.finish();
      if (this.isTracking) {
        this.isTracking = false;
        _self.emit("endEffect");
      }
    };

    return jElement;
  };

  p.addRemainTimeEffect = function (el, options) {

    var jElement = el;
    var _self = this;
    var remainInterval;
    var endRemainTime = 0;

    jElement.options = options;
    function setRemainTime() {
      var now = endRemainTime - new Date().getTime();
      if (now > 0) {
        var minutes = Math.floor(now / 60000);
        if (minutes < 10)
          minutes = "0" + minutes;
        var secons = Math.floor((now % 60000) / 1000);
        if (secons < 10)
          secons = "0" + secons;
        jElement.text(minutes + " : " + secons);
      } else {
        jElement.endEffect();
      }
    }

    jElement.runEffect = function (remainTime) {
      clearInterval(remainInterval);
      remainTime = isNaN(parseInt(remainTime)) ? 0 : parseInt(remainTime);
      endRemainTime = new Date().getTime() + remainTime;
      setRemainTime();
      remainInterval = setInterval(setRemainTime, 100);
    };

    jElement.endEffect = function () {
      clearInterval(remainInterval);
      jElement.text("");
      if (this.isTracking) {
        this.isTracking = false;
        _self.emit("timeOut", jElement);
      }
    };

    return jElement;
  };

  p.addDisbaleEffect = function (el, options) {

    var jElement = el;
    var _self = this;

    jElement.setDisabled = function (flag) {
      jElement.disabled = flag;
      if (flag) {
        jElement.addClass('disabled');
      } else {
        jElement.removeClass('disabled');
      }
    };

    jElement.runEffect = function () {
      jElement.setDisabled(true);
    };

    jElement.endEffect = function () {
      jElement.setDisabled(false);
      if (this.isTracking) {
        this.isTracking = false;
        _self.emit("timeOut", jElement);
      }
    };

    return jElement;
  };

  p.addChipEffect = function (el) {
    var _self = this;
    var jElement = el;

    jElement.runEffect = function (plus) {
      this.isDone = true;
      this.removeClass('plus decrease');
      var className = plus ? "plus" : "decrease";
      this.show();
      var length = jElement.find('i').length;
      var count = 0;
      jElement.find('i').show();
      this.addClass(className);
      jElement.find('i').each(function (index) {
        var item = this;
        $(this).one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function () {
          $(this).hide();
          count++;
          if (count == length)
            jElement.endEffect();
        });
      });
    };

    jElement.endEffect = function () {
      if (this.isTracking) {
        this.isTracking = false;
        _self.emit("_moveChipComplete", jElement);
      }
    };

    return jElement;
  };

  TWIST.BaseGame = BaseGame;

})();