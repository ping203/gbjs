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
        this.addChild(this.timerLine);

        this.startAngle = 0;
        this.endAngle = 0;

    };

    p.drawPercentRect = function (currentTimer) {
        this.timerLine.graphics.clear();
        this.startAngle = -Math.PI * 1 / 2;
        this.endAngle = -Math.PI * 1 / 2 + currentTimer * Math.PI * 2;
        this.timerLine.graphics.s("#fee802").ss(this.strokeThick).arc(this.radius, this.radius, this.radius, this.startAngle, this.endAngle, false);
    };

    p.setCounter = function (totalTime, remainingTime) {
        this.totalTime = totalTime || 20000;
        this.remainingTime = remainingTime || 20000;
        this.startTime = (new Date()).getTime() - (this.totalTime - this.remainingTime);
        this.currentTimer = (this.totalTime - this.remainingTime) / this.totalTime;
    };
    p.clearTimer = function () {
        if (this.tween) {
            this.tween.removeAllEventListeners();
        }
        this.timerLine.graphics.clear();
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
        if(remainingTime > totalTime) remainingTime = totalTime;
        this.clearTimer();
        this.setCounter(totalTime, remainingTime);
        var _self = this;
        this.tween = createjs.Tween.get(this.timerLine)
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