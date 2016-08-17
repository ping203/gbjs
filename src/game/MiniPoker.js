this.TWIST = this.TWIST || {};

(function () {
    "use strict";

    var gameSize, columnSize, itemSize, distance, columns, speed, effectArray,
            statusList, endingPhase, numberCard, time, stepValue, spinAreaConf, colorList,
            lineList9, lineList20, isLine9, line9Left, line9Right, line20Left, line20Right,
            line9Coordinate, activeLines, bets, effectQueue, moneyFallingEffectTime, currentEffectTurn, numberEffectCompleted,
            timeOutList, fistLog;

    statusList = ["pause", "running", "ending", "effecting"];

    endingPhase = -1;

    stepValue = 1;

    itemSize = {width: 160, height: 205, padding: 10};

    gameSize = {width: itemSize.width * 5, height: itemSize.height, x: 5, y: 1};

    distance = itemSize.height;

    columns = [];

    speed = 1;//default 2

    numberCard = 52;

    spinAreaConf = {x: 100, y: 100};

    effectQueue = [];

    bets = [100, 1000, 10000, 100000];

    moneyFallingEffectTime = 3000;

    currentEffectTurn = 0;

    numberEffectCompleted = 0;

    timeOutList = [];

    var initOptions = {
    };

    function MiniPoker(wrapper, options) {
        this.wrapper = $(wrapper);
        this.options = $.extend(initOptions, options);
        this.initMiniPoker();
    }

    var p = MiniPoker.prototype = new TWIST.BaseGame();

    p.initMiniPoker = function () {
        $.extend(this.options, gameSize);
        this.info = {};
        this.initCanvas();
        this.initTemplate();
        this.initButton();
        this.draw();
        this.pushEventListener();
    };

    p.draw = function () {
        var _self = this;
        this.mapData = TWIST.MiniPokerLogic.generateMap();
        var spinArea = new createjs.Container();
        this.spinArea = spinArea;

        for (var i = 0; i < gameSize.x; i++) {
            columns[i] = new createjs.Container();
            columns[i].set({x: i * itemSize.width, y: 0});
            var columnItems = new createjs.Container();
            columns[i].addChild(columnItems);

            var value = this.mapData[i];
            var item = this.createSlotItem(this.mapData[i], 0);
            columnItems.addChild(item);

            spinArea.addChild(columns[i]);
        }

        this.stage.addChild(spinArea);
    };

    p.initTemplate = function () {
        this.wrapperTemplate = $(TWIST.HTMLTemplate['miniPoker/wrapper']);
        this.wrapper.append(this.wrapperTemplate);

        this.wrapperTemplate.append(this.canvas);
        this.initStage();

        this.resultText = $(TWIST.HTMLTemplate['miniPoker/resultText']);
        this.wrapperTemplate.append(this.resultText);

        this.pot = _.template(TWIST.HTMLTemplate['miniPoker/pot']);
        this.wrapperTemplate.append(this.pot({value: 0}));

        this.buttonSpin = $(TWIST.HTMLTemplate['miniPoker/button']);
        this.wrapperTemplate.append(this.buttonSpin);

        this.autoSpin = $(TWIST.HTMLTemplate['miniPoker/autospin']);
        this.wrapperTemplate.append(this.autoSpin);

        this.chipWrapper = $(TWIST.HTMLTemplate['miniPoker/chips']);
        this.wrapperTemplate.append(this.chipWrapper);

        this.chipButtons = this.chipWrapper.find('.chip');

        this.errorPanel = $(TWIST.HTMLTemplate['errorPanel']);
        this.wrapperTemplate.append(this.errorPanel);
        this.errorPanel.hide();
    };

    p.initButton = function () {
        var _self = this;
        this.chipButtons.on('click', function (event) {
            _self.chipButtons.removeClass('active');
            $(event.target).addClass("active");
        });

        this.buttonSpin.on('click', function (event) {
            _self.emit("start");
        });

        $('.button.plus-bet:not(.disabled)').on("click", function () {
            if (_self.status !== 'pause' && _self.status !== 'effecting')
                return;
            _self.changeStatus("pause");
            _self.emit("plusBet");
        });

        $('.button.decrease-bet:not(.disabled)').on("click", function () {
            if (_self.status !== 'pause' && _self.status !== 'effecting')
                return;
            _self.changeStatus("pause");
            _self.emit("decreaseBet");
        });

        $('#spinButton').click(function () {
            if (_self.status !== 'pause' && _self.status !== 'effecting')
                return;
            _self.changeStatus("pause");
            _self.emit("spin");
        });
    };

    p.pushEventListener = function () {
        var _self = this;

        this.on("start", function () {
            console.log("start");
            if (this.checkStart()) {
                _self.changeStatus("pause");
                _self.emit("spin");
            }
        });

        this.on("endSpin", function (data) {
            _self.endSpin(data);
        });

        this.on("info", function () {
            _self.renderData(arguments[0]);
        });

        this.on("spin", function () {
            _self.startSpin();
        });

        this.on("bindBet", function (newBet) {
            _self.bindBet(newBet);
        });

        this.on("spinCompleted", function () {
            _self.effecting();
        });

        this.on("endEffect", function () {
            _self.endEffect();
        });
    };

    p.checkStart = function () {
        return true;
    };

    p.plusBet = function () {
        var index = this.info.bets.indexOf(this.info.betting);
        var newValue = this.info.bets[index + 1];
        if (newValue) {
            this.emit("bindBet", newValue);
        }
    };

    p.decreaseBet = function () {
        var index = this.info.bets.indexOf(this.info.betting);
        var newValue = this.info.bets[index - 1];
        if (newValue) {
            this.emit("bindBet", newValue);
        }
    };

    p.renderData = function (data) {
        $.extend(this.info, data);
    };

    p.bindLine = function (lineName, active) {
        if (activeLines.length == 1 && !active)
            return;
        var linesContainer = this.wrapper.getChildByName("linesContainer");
        var lineItem = linesContainer.getChildByName("line" + (lineName + 1));
        if (!lineItem)
            return;
        lineItem.visible = active;
        var className = '.line-button.button' + (lineName + 1);
        if (active) {
            $(className).addClass("active");
        } else {
            $(className).removeClass("active");
        }

        var indexLine = activeLines.indexOf(lineName);
        if (active && indexLine == -1) {
            activeLines.push(lineName);
        } else if (!active && indexLine > -1) {
            activeLines.splice(indexLine, 1);
        }
        $('.number.lines').text(activeLines.length);
        this.emit("toggleLines", true);
        this.changeNumberEffect('.number.total-bet', this.info.betting * activeLines.length, {duration: 200}).runEffect();
    };

    p.toggleLines = function (show) {
        var lines = this.wrapper.getChildByName("linesContainer").children;
        lines.forEach(function (item, index) {
            if (activeLines.indexOf(line9Left[index] - 1) > -1 && show) {
                item.visible = true;
            } else {
                item.visible = false;
            }
        });
    };

    p.bindBet = function (newBet) {
        this.info.betting = newBet;
//        $('.number.bet').text(newBet);
//        $('.number.total-bet').text(this.info.betting * activeLines.length);

        this.changeNumberEffect('#top .jack-pot', this.info.potData[bets.indexOf(newBet)], {duration: 200}).runEffect();
        this.changeNumberEffect('.number.bet', newBet, {duration: 200}).runEffect();
        this.changeNumberEffect('.number.total-bet', this.info.betting * activeLines.length, {duration: 200}).runEffect();
    };

    p.changeStatus = function (status) {
        this.status = status;
        timeOutList.forEach(function (item) {
            clearTimeout(item);
        });
        timeOutList = [];
        if (status == 'pause') {
            var effectArray = effectQueue[currentEffectTurn];
            if (!effectArray || !effectArray.length)
                return;
            for (var i = 0; i < effectArray.length; i++) {
                effectArray[i].endEffect();
            }
            ;
            effectQueue = [];
            currentEffectTurn = 0;
        }
        if (status == "running") {
//            $('.number.win').text(0);
//            this.effectContainer.removeAllChildren();
        }
    };

    p.startSpin = function () {
        endingPhase = -1;
        var _self = this;
        var firstColumn = columns[0].getChildAt(0);
        this.changeStatus("running");
        createjs.Tween.get(firstColumn)
                .to({y: -50}, 150)
                .call(function () {})
                .to({y: 0}, 150)
                .call(function () {
                    _self.spinAllColumns();
                });

    };

    p.spinAllColumns = function () {
        var _self = this;
        for (var i = 0; i < gameSize.x; i++) {
            _self.spinColumn(i);
        }
    };

    p.spinColumn = function (columnIndex) {
        var isNewEndingPhase = false;
        var beforeLastRow = false;
        if (endingPhase > -1 && (columnIndex == Math.floor(((endingPhase * 10 + 0.9 * 10) / 10) / gameSize.y))) {
            if (endingPhase % 1 == 0) {
                isNewEndingPhase = true;
                beforeLastRow = (endingPhase % gameSize.y) == (gameSize.y);
            }
        }
        var _self = this;
        var newItem;
        var itemsContainer = columns[columnIndex].getChildAt(0);
        if (isNewEndingPhase) {
            newItem = this.createSlotItem(this.mapData[columnIndex], -1);
        } else {
            newItem = this.createSlotItem(Math.floor(Math.random() * numberCard), -1);
        }
        itemsContainer.addChild(newItem);
        var easeType = beforeLastRow ? createjs.Ease.getBackOut(5) : createjs.Ease.linear;
        var timeAnimation = beforeLastRow ? 2 * distance / speed : distance / speed;
        createjs.Tween.get(itemsContainer)
                .to({y: distance}, timeAnimation, easeType)
                .call(function () {
                    var columnIndex = this.parent.parent.getChildIndex(this.parent);
                    this.set({y: 0});
                    var slotItems = this.children;
                    slotItems.forEach(function (item, index) {
                        item.state++;
                        item.goNextStep();
                    });
                    this.removeChild(slotItems.find(function (item) {
                        return item.state == gameSize.y
                    }));

                    if (endingPhase > -1) {

                        var newValue = Math.floor(Math.floor((endingPhase + 0.9) / gameSize.y));
                        if (columnIndex == Math.floor(((endingPhase * 10 + 0.9 * 10) / 10) / gameSize.y)) {
                            var isLastRow = (endingPhase % gameSize.y) == (gameSize.y - 1);
                            if (isLastRow) {
                                stepValue = 1 / 5;
                            } else if ((endingPhase % gameSize.y) == 0) {
                                stepValue = 1;
                            }
                            endingPhase = (endingPhase * 10 + stepValue * 10) / 10;
                            if (!isLastRow) {
                                _self.spinColumn(columnIndex);
                            } else {
                                endingPhase = (endingPhase * 10 + stepValue * 10) / 10;
                            }
                        } else {
                            _self.spinColumn(columnIndex);
                        }
                        if (endingPhase > (gameSize.x * gameSize.y) - 1) {
                            _self.emit("spinCompleted");
                        }
                    } else {
                        _self.spinColumn(columnIndex);
                    }

                });
    };

    p.endSpin = function (data) {
        this.status = "ending";
        this.result = data;
        this.mapData = data.map;
        endingPhase = -0.8;
        stepValue = 0.2;
    };

    p.effecting = function () {
        this.status = "effecting";
        var result = this.result;
        effectQueue = [];
        if (result.totalWin > 0) {
            var effectArray = [];
            var changeWinMoneyEffect = this.changeNumberEffect('.number.win', result.totalWin, {duration: moneyFallingEffectTime});
            var changeTotalMoneyEffect = this.changeNumberEffect('#top .money', result.newMoney, {duration: moneyFallingEffectTime});
            var moneyFallingEffect = this.moneyFallingEffect();
            effectArray.push(changeWinMoneyEffect, moneyFallingEffect, changeTotalMoneyEffect);
            if (result.explodePot) {
                var explodePotEffect = this.explodePotEffect();
                effectArray.push(explodePotEffect);
            }
            effectArray.oneTime = true;
            effectQueue.push(effectArray);

            for (var i = 0; i < result.pzires.length; i++) {
                var pzire = result.pzires[i]
                var effectArray = [];
                var hightLightItemEffect = this.hightLightEffect(pzire.line, pzire.prize.length);
                effectArray.push(hightLightItemEffect);
                effectQueue.push(effectArray);
            }

        }
        this.runNextEffect();
    };

    p.runNextEffect = function () {
        var effectArray = effectQueue[currentEffectTurn];
        if (!effectArray || !effectArray.length)
            return;
        function _runEffect() {
            numberEffectCompleted = 0;
            for (var i = 0; i < effectArray.length; i++) {
                effectArray[i].runEffect();
            }
        }
        if (effectArray.oneTime) {
            if (effectArray.done) {
                currentEffectTurn++;
                if (currentEffectTurn == effectQueue.length)
                    currentEffectTurn = 0;
                this.runNextEffect();
            } else {
                _runEffect();
            }
        } else {
            var timeOut = setTimeout(_runEffect, 300);
            timeOutList.push(timeOut);
        }
    };

    p.endEffect = function () {
        numberEffectCompleted++;
        if (numberEffectCompleted == (effectQueue[currentEffectTurn] && effectQueue[currentEffectTurn].length)) {
            if (effectQueue[currentEffectTurn].oneTime)
                effectQueue[currentEffectTurn].done = true;
            currentEffectTurn++;
            if (currentEffectTurn == effectQueue.length)
                currentEffectTurn = 0;
            if (this.status == "effecting") {
                this.runNextEffect();
            }
        }
    };

    p.createSlotItem = function (value, state) {
        var _self = this;
        var slotItem = new createjs.Container();

        var bg = new TWIST.Card(value);
        bg.set({
            scaleX: TWIST.Card.miniPoker.scale,
            scaleY: TWIST.Card.miniPoker.scale,
            x: (itemSize.width - TWIST.Card.miniPoker.width) / 2,
            y: (itemSize.height - TWIST.Card.miniPoker.scale * TWIST.Card.size.height) / 2
        });
        slotItem.addChild(bg);
        slotItem.set({
            x: 0,
            y: itemSize.height * state,
            state: state
        });

        slotItem.goNextStep = function () {
            var newY = itemSize.height * this.state;
            this.set({y: newY});
        };
        return slotItem;
    };

    p.changeNumberEffect = function (el, newValue, options) {

        var jElement = $(el);
        var _self = this;

        jElement.newValue = newValue;
        jElement.options = options;

        jElement.runEffect = function () {
            var oldValue = this.text();
            var _jElement = this;
            var newOptions = {
                duration: 1000,
                step: function (now) {
                    _jElement.text(Math.ceil(now));
                },
                done: function () {
                    _jElement.endEffect();
                }
            };
            $.extend(newOptions, this.options);
            if (isNaN(parseInt(oldValue)))
                oldValue = 0;
            this.prop('Counter', oldValue).animate({
                Counter: this.newValue
            }, newOptions);
        };

        jElement.endEffect = function () {
            this.stop(true, true);
            _self.emit("endEffect");
        };

        return jElement;
    };

    p.hightLightEffect = function (line, length) {
        var _self = this;
        var item = new createjs.Container();
        var linesContainer = this.wrapper.getChildByName("linesContainer");
        var lineItem = linesContainer.getChildByName("line" + (line + 1));
        var lineList = lineList9[line];

        var starBg = new Image();
        starBg.src = "images/star-mini.png";

        item.runEffect = function () {
            clearTimeout(this.timeOut);
            if (this.isInited) {
                this.set({visible: true});
            } else {
                this.init();
            }

            lineItem.set({visible: true});
            this.timeOut = setTimeout(function () {
                item.endEffect();
            }, 3000);
        };

        item.init = function () {
            for (var i = 0; i < length; i++) {
                this.createItemEffect(i, lineList[i]);
            }
            _self.effectContainer.addChild(this);
            this.isInited = true;
        };

        item.createItemEffect = function (x, y) {
            var itemEffect = new createjs.Container();
            var itemWidth = itemSize.width,
                    itemHeight = itemSize.height,
                    oldX = x * itemSize.width + 15 + spinAreaConf.x,
                    oldY = y * itemSize.height + 8 + spinAreaConf.y
            itemEffect.set({x: oldX, y: oldY, name: "itemEffect", counter: 0});
            this.addChild(itemEffect);
            createjs.Tween.get(itemEffect, {loop: true, onChange: this.productStar})
                    .to({x: oldX + itemWidth - 30}, 300)
                    .to({y: oldY + itemHeight - 16}, 300)
                    .to({x: oldX}, 300)
                    .to({y: oldY}, 300)
                    .call(function () {

                    });
        };

        item.productStar = function (event) {
            var container = event.target.target;
            container.counter++;
            if (container.counter % 1 != 0)
                return;
            var start = new createjs.Bitmap(starBg);
            var startX = container.x, startY = container.y;
            container.parent.addChild(start);
            start.set({x: startX, y: startY, scaleX: 0.01, scaleY: 0.01, width: 35, height: 35});
            var scale = start.width / 18;
            createjs.Tween.get(start)
                    .to({
                        x: startX - scale * 9 + (Math.random() - 0.5) * 2,
                        y: startY - scale * 9 + (Math.random() - 0.5) * 2,
                        scaleX: scale,
                        scaleY: scale
                    }, 100, createjs.Ease.getElasticOut(5, 5))
                    .to({
                        x: startX - scale * 4.5,
                        y: startY - scale * 4.5,
                        scaleX: scale / 2,
                        scaleY: scale / 2
                    }, 100, createjs.Ease.getElasticIn(5, 5))
                    .to({
                        x: startX,
                        y: startY,
                        scaleX: 0.01,
                        scaleY: 0.01
                    }, 700)
                    .call(function () {
                        this.parent.removeChild(this);
                    });
        };

        item.endEffect = function () {
            clearTimeout(this.timeOut);
            _self.emit('toggleLines', false);
            this.set({visible: false});
            _self.emit("endEffect");
        };

        return item;
    };

    p.moneyFallingEffect = function (time) {
        var _self = this;
        var jElement = $('#effect .money-falling');
        var firstTime = new Date();
        jElement.runEffect = function () {
            clearTimeout(this.timeOut);
            this.show();
            this.timeOut = setTimeout(function () {
                jElement.endEffect();
            }, moneyFallingEffectTime);
        };
        jElement.endEffect = function () {
            clearTimeout(this.timeOut);
            this.hide();
            _self.emit("endEffect");
        };

        return jElement;
    };

    p.explodePotEffect = function () {
        var _self = this;
        var jElement = $('#effect .explorer-pot');
        var firstTime = new Date();
        jElement.runEffect = function () {
            this.show();
        };
        jElement.click(function () {
            jElement.endEffect();
        });
        jElement.endEffect = function () {
            this.hide();
            _self.emit("endEffect");
        };

        return jElement;
    };

    TWIST.MiniPoker = MiniPoker;

})();