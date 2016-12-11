this.TWIST = this.TWIST || {};

(function () {
  "use strict";

  function Timer(params) {
    this.set({startTime: 0, totalTime: 0, remainingTime: 0, currentTimer: 0});
    this.initialize(params)
  }

  var p = Timer.prototype = new createjs.Container();
  p.Container_initialize = p.initialize;
  p.initialize = function (params) {
    this.Container_initialize();
    $.extend(this, params);
    this.timerLine = new createjs.Shape();
    this.timerBg = new createjs.Shape();
    this.initBg();
    this.addChild(this.timerBg, this.timerLine);
    this.startAngle = 0;
    this.endAngle = 0;

  };

  p.initBg = function () {
    if (this.__type) {
      this.startAngle = -0.5 * Math.PI;
      this.endAngle = 1.5 * Math.PI;
      this.timerBg.graphics.s("#000000").ss(this.strokeThick)
              .arc(this.radius, this.radius, this.radius, this.startAngle, this.endAngle, false);
      this.timerBg.alpha = 0.18;
      this.timerBg.visible = false;
    }
  };

  p.drawPercentRect = function (currentTimer) {
    this.timerLine.graphics.clear();
    this.startAngle = Math.PI * 3 / 2 - currentTimer * Math.PI * 2;
    this.endAngle = Math.PI * 3 / 2;
    this.timerLine.graphics.s("#fee802").ss(this.strokeThick)
            .arc(this.radius, this.radius, this.radius, this.startAngle, this.endAngle, false);
  };

  p.setCounter = function (totalTime, remainingTime) {
    this.timerBg.visible = true;
    this.timerLine.visible = true;
    this.totalTime = totalTime || 20000;
    this.remainingTime = remainingTime || 20000;
    this.startTime = (new Date()).getTime() - (this.totalTime - this.remainingTime);
    this.currentTimer = (this.totalTime - this.remainingTime) / this.totalTime;
  };
  p.clearTimer = function () {
    if (this.tween) {
      this.tween.pause();
      this.tween.removeAllEventListeners();
    }
    createjs.Tween.get(this.timerLine, {override: true});
    this.timerLine.graphics.clear();
    this.timerLine.visible = false;
    this.timerBg.visible = false;
    this.totalTime = 0;
    this.remainingTime = 0;
    this.currentTimer = 0;
    if (this.callback) {
      delete this.callback;
    }
  };
  p.tick = function () {
    this.currentTimer = ((new Date()).getTime() - this.startTime) / this.totalTime;
    if (this.currentTimer >= 1) {
      this.clearTimer();
      return;
    }
    this.drawPercentRect(this.currentTimer);
  };

  p.startTimer = function (totalTime, remainingTime) {
    if (remainingTime > totalTime)
      remainingTime = totalTime;
    this.clearTimer();
    this.setCounter(totalTime, remainingTime);
    var _self = this;
    this.tween = createjs.Tween.get(this.timerLine, {override: true})
            .to({}, remainingTime)
            .call(function () {
              _self.clearTimer();
            });
    var _self = this;
    this.tween.addEventListener("change", function () {
      _self.tick();
    });
  };

  TWIST.Timer = Timer;
})();