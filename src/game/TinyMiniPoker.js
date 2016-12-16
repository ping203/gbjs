this.TWIST = this.TWIST || {};

(function () {
  "use strict";

  var gameSize, columnSize, itemSize, distance, columns, speed, effectArray,
          statusList, endingPhase, numberCard, time, stepValue, spinAreaConf, colorList,
          lineList9, lineList20, isLine9, line9Left, line9Right, line20Left, line20Right,
          line9Coordinate, activeLines, bets, effectQueue, moneyFallingEffectTime, currentEffectTurn, numberEffectCompleted,
          timeOutList, fistLog, cardRankList, repeatEffectQueue;

  var initOptions = {
    resultTab: [{
        name: "Sảnh rồng(Nỗ hũ)",
        value: -1,
        code: '1'
      }, {
        name: "Thùng phá sảnh",
        value: 1000,
        code: '2'
      }, {
        name: "Tứ quý",
        value: 150,
        code: '3'
      }, {
        name: "Cù lũ",
        value: 50,
        code: '4'
      }, {
        name: "Thùng",
        value: 20,
        code: '5'
      }, {
        name: "Sảnh",
        value: 13,
        code: '6'
      }, {
        name: "Ba lá",
        value: 8,
        code: '7'
      }, {
        name: "Hai đôi",
        value: 5,
        code: '8'
      }, {
        name: "Đôi J hoặc cao hơn",
        value: 2.5,
        code: '9'
      }, {
        name: "Không ăn !",
        value: 0,
        code: '10'
      }]
    ,
    cardSize : {
      width : 115,
      height : 153
    }
  };

  function TinyMiniPoker(wrapper, options) {
    this.wrapper = $(wrapper);
    this.options = $.extend(initOptions, options);
    this.initTinyMiniPoker();
  }

  var p = TinyMiniPoker.prototype = new TWIST.BaseGame();

  p.initTinyMiniPoker = function () {
    this.initVariable();
    $.extend(this.options, gameSize);
    this.info = {
      betting: 1000,
      potData: {
        1000: 0,
        10000: 0,
        100000: 0
      }
    };
    TWIST.Card.RankMapIndex = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"];
    this.userInfo = {};
    this.initCanvas();
    this.initEvent();
    this.initTemplate();
    this.initButton();
    this.draw();
    this.pushEventListener();
    this.status = 'pause';
  };

  p.initVariable = function () {


    statusList = ["pause", "running", "ending", "effecting"];

    cardRankList = [
      {value: 0, name: "2"}
      , {value: 1, name: "3"}
      , {value: 2, name: "4"}
      , {value: 3, name: "5"}
      , {value: 4, name: "6"}
      , {value: 5, name: "7"}
      , {value: 6, name: "8"}
      , {value: 7, name: "9"}
      , {value: 8, name: "10"}
      , {value: 9, name: "J"}
      , {value: 10, name: "Q"}
      , {value: 11, name: "K"}
      , {value: 12, name: "A"}
    ];

    endingPhase = -1;

    stepValue = 1;

    itemSize = {width: 130, height: 270, padding: 10};

    gameSize = {width: itemSize.width * 5, height: itemSize.height, x: 5, y: 1};

    distance = itemSize.height;

    columns = [];

    speed = 2.5;//default 2

    numberCard = 52;

    spinAreaConf = {x: 166, y: 233};

    effectQueue = [];

    bets = [1000, 10000, 100000];

    moneyFallingEffectTime = 2000;

    currentEffectTurn = 0;

    numberEffectCompleted = 0;

    timeOutList = [];

    repeatEffectQueue = false;
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
    var _self = this;
    this.wrapperTemplate = $(TWIST.HTMLTemplate['tinyMiniPoker/wrapper']);
    this.wrapper.append(this.wrapperTemplate);

    this.canvasWrapper = $(TWIST.HTMLTemplate['tinyMiniPoker/canvasWrapper']);
    this.wrapperTemplate.append(this.canvasWrapper);

    this.canvasWrapper.append(this.canvas);
    this.initStage();

    this.resultText = $(TWIST.HTMLTemplate['tinyMiniPoker/resultText']);
    this.wrapperTemplate.append(this.resultText);

    this.wrapperTemplate.append($(TWIST.HTMLTemplate['tinyMiniPoker/pot']));
    this.pot = this.wrapperTemplate.find('.pot-value');

    this.buttonSpin = $(TWIST.HTMLTemplate['tinyMiniPoker/buttonSpin']);
    this.wrapperTemplate.append(this.buttonSpin);

    this.buttonClose = $(TWIST.HTMLTemplate['tinyMiniPoker/buttonClose']);
    this.wrapperTemplate.append(this.buttonClose);

    this.buttonHelp = $(TWIST.HTMLTemplate['tinyMiniPoker/buttonHelp']);
    this.wrapperTemplate.append(this.buttonHelp);

    this.buttonHistory = $(TWIST.HTMLTemplate['tinyMiniPoker/buttonHistory']);
    this.wrapperTemplate.append(this.buttonHistory);

    var autoSpin = $(TWIST.HTMLTemplate['tinyMiniPoker/autospin']);
    this.wrapperTemplate.append(autoSpin);
    this.autoSpin = autoSpin.find('input[type="checkbox"]');

    this.chipWrapper = $(TWIST.HTMLTemplate['tinyMiniPoker/chips']);
    this.wrapperTemplate.append(this.chipWrapper);

    this.chipButtons = [{
        value: 1000,
        template: this.chipWrapper.find('.chip:first-child')
      }, {
        value: 10000,
        template: this.chipWrapper.find('.chip:nth-child(2)')
      }, {
        value: 100000,
        template: this.chipWrapper.find('.chip:nth-child(3)')
      }];

    this.errorPanel = $(TWIST.HTMLTemplate['tinyMiniPoker/errorPanel']);
    this.wrapperTemplate.append(this.errorPanel);
    this.errorPanel.hide();

    this.resultTab = $(TWIST.HTMLTemplate['tinyMiniPoker/resultTab']);
    this.wrapperTemplate.append(this.resultTab);

    this.resultItemList = [];
    this.resultItem = _.template(TWIST.HTMLTemplate['tinyMiniPoker/resultItem']);
    this.options.resultTab.forEach(function (item, index) {
      if (item.code === '10')
        return;
      var resultItem = {
        code: item.code,
        template: $(_self.resultItem({
          name: item.name,
          value: (item.value <= 0) ? "" : "X" + item.value
        }))
      };
      _self.resultTab.append(resultItem.template);
      _self.resultItemList.push(resultItem);
    });

    this.user = $(TWIST.HTMLTemplate['tinyMiniPoker/user']);
    this.wrapperTemplate.append(this.user);

    this.sessionId = $(TWIST.HTMLTemplate['tinyMiniPoker/sessionId']);
    this.wrapperTemplate.append(this.sessionId);

    this.effectWrapper = $(TWIST.HTMLTemplate['effect/wrapper']);
    this.wrapperTemplate.append(this.effectWrapper);
    this.explodePot = $(TWIST.HTMLTemplate['effect/explodePot']);
    this.effectWrapper.append(this.explodePot);

    this.money = this.user.find('.money');

    this.setBetting(this.chipButtons[0]);
  };

  p.initButton = function () {
    var _self = this;

    this.chipButtons.forEach(function (item, index) {
      item.template.on('click', function (event) {
        if (_self.status !== 'pause' && _self.status !== 'effecting')
          return;
        TWIST.Sound.play("minigame/Common_Click");
        _self.setBetting(item);
      });
    });

    this.autoSpin.on('change', function (event) {
      _self.isAutoSpin = event.target.checked;
      if (_self.status == 'pause' || _self.status == 'effecting') {
        _self.checkStart();
      }
    });

    this.buttonSpin.on('click', function (event) {
      if (_self.buttonSpin.hasClass('disabled'))
        return;
      _self.checkStart();
    });
    

    this.buttonClose.on('click', function (event) {
      _self.emit('closePopup');
    });

    this.buttonHelp.on('click', function (event) {
      _self.emit('showHelp');
    }); 

    this.buttonHistory.on('click', function (event) {
      _self.emit('showHistory');
    }); 
 };

  p.setBetting = function (item) {
    this.chipWrapper.find('.chip').removeClass('active');
    item.template.addClass("active");
    this.info.betting = item.value;
    this.changeNumberEffect(this.pot, this.info.potData[this.info.betting], {duration: 200}).runEffect();
  };

  p.pushEventListener = function () {
    var _self = this;

    this.on("endSpin", function (data) {
      _self.endSpin(data);
    });

    this.on("userInfo", function () {
      _self.renderUserInfo(arguments[0]);
    });

    this.on("spin", function () {
      _self.startSpin();
    });

    this.on("spinCompleted", function () {
      _self.effecting();
    });

    this.on("endEffect", function () {
//            _self.endEffect();
    });

    this.on("updateMoney", function (data) {
      _self.updateMoney(data);
    });

    this.on("updatePots", function (data) {
      _self.bindPots(data);
    });

    this.on("error", function (message) {
      _self.showError(message);
    });
  };

  p.showError = function (message) {
    var errorItem = $('<div class="error-item-mini">' + message + '</div>');
    var _self = this;
    this.errorPanel.empty();
    this.errorPanel.show();
    this.errorPanel.append(errorItem);
    var _self = this;
    errorItem.one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function () {
      $(errorItem).remove();
      _self.errorPanel.hide();
    });
  };

  p.checkStart = function () {
    var _self = this;
    if (_self.status !== 'pause' && _self.status !== 'effecting')
      return;
    var _self = this;
    var flag = false;
    if (this.userInfo.money < this.info.betting) {
      this.emit("error", "Bạn không đủ tiền !");
    } else {
      if (_self.status !== "pause")
        _self.changeStatus("pause");
      this.startSound = TWIST.Sound.play("minigame/bonus_spin");
      _self.emit("spin", this.info.betting);
      _self.changeNumberEffect(_self.money, _self.userInfo.money - _self.info.betting, {duration: 200}).runEffect();
    }
  };

  p.renderUserInfo = function (data) {
    $.extend(this.userInfo, data);
    var avatarContainer = this.user.find('.avatar');
    var usernameContainer = this.user.find('.username');
    var moneyContainer = this.user.find('.money');
    var avatar = Global.md5Avatar(data.avatar);
    avatarContainer.addClass('avatar' + avatar);
    usernameContainer.text(data.username);
    var money = Global.numberWithDot(data.money);
    moneyContainer.text(money);
  };

  p.bindPots = function (data) {
    $.extend(this.info.potData, data.pots)
    this.changeNumberEffect(this.pot, this.info.potData[this.info.betting], {duration: 200}).runEffect();
  };

  p.changeStatus = function (status) {
    var _self = this;
    this.status = status;
    this.timeOutList.forEach(function (item) {
      clearTimeout(item);
    });
    this.timeOutList = [];
    if (status == 'pause') {
      this.result = {};
      if (currentEffectTurn >= effectQueue.length)
        currentEffectTurn = 0;
      var effectArray = effectQueue[currentEffectTurn];
      if (effectArray && effectArray.length) {
        for (var i = 0; i < effectArray.length; i++) {
          if (!effectArray[i].isDone)
            effectArray[i].endEffect();
        }
      }
      effectQueue = [];
      currentEffectTurn = 0;
      if (this.isAutoSpin) {
        var newSpinTimeOut = setTimeout(function () {
          _self.status = "pause";
          _self.checkStart();
        }, 500);
        this.timeOutList.push(newSpinTimeOut);
      }
    }

    if (status == "running") {
      this.resultSound && this.resultSound.stop();
      this.buttonSpin.addClass('disabled');
      this.autoSpin.find('input').attr('disabled', true);
      this.resultText.text("");
    }

    if (status == "effecting") {
      this.startSound && this.startSound.stop();
      if (this.isAutoSpin) {
        this.buttonSpin.addClass('disabled');
      } else {
        this.buttonSpin.removeClass('disabled');
      }
      this.autoSpin.find('input').attr('disabled', false);
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
    var currentSpeed = this.options.speed || speed;
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
      newItem = this.createSlotItem(Math.floor(Math.random() * 4) + 52, -1);
    }
    itemsContainer.addChild(newItem);
    var easeType = beforeLastRow ? createjs.Ease.getBackOut(5) : createjs.Ease.linear;
    var timeAnimation = beforeLastRow ? 2 * distance / currentSpeed : distance / currentSpeed;
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
    if (this.status !== 'running')
      return;
    this.changeStatus("ending");
    this.result = this.result || {};
    $.extend(this.result, data);
    this.mapData = data.map;
    this.showSessionId(data.sessionId);
    endingPhase = -0.8;
    stepValue = 0.2;
  };

  p.updateMoney = function (data) {
    this.result = this.result || {};
    $.extend(this.result, data);
    this.userInfo.money = data.newMoney;
  };

  p.effecting = function () {
    var _self = this;
    _self.emit("endSpinTinyPoker");
    this.changeStatus("effecting");
    var result = this.result;
    effectQueue = [];

    var effectArray = [];


    var hightLightWinCards = this.hightLightWinCards(result.hightLightCards);
    effectArray.push(hightLightWinCards);
    this.showResultText(result.cardListRank, result.rankOfVerticalGroup);

    if (result.cardListRank == 1) {
      var explodePotEffect = this.explodePotEffect();
      effectArray.push(explodePotEffect);
    }

    if (parseInt(result.winMoney) > 0) {
      var changeWinMoneyEffect = this.winMoneyEffect(result.winMoney);
      var changeTotalMoneyEffect = this.changeNumberEffect(this.money, result.newMoney, {duration: moneyFallingEffectTime});
      var hightlightWinRank = this.hightlightWinRank(result.cardListRank);
      effectArray.push(changeWinMoneyEffect, changeTotalMoneyEffect, hightlightWinRank);
      this.resultSound = TWIST.Sound.play("minigame/NormalWin");
    } else {
      this.resultSound = TWIST.Sound.play("minigame/slot_result");
    }
    effectArray.oneTime = true;
    effectArray.forEach(function (item, index) {
      item.isTracking = true;
    });
    effectQueue.push(effectArray);
    if (this.isAutoSpin) {
      var timeOut = setTimeout(function () {
        _self.checkStart();
      }, 2000);

      this.timeOutList.push(timeOut);
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
        if (currentEffectTurn == effectQueue.length) {
          if (repeatEffectQueue) {
            currentEffectTurn = 0;
          } else {
//                    this.status = "pause";
            this.changeStatus("pause");
          }
        }
        if (this.status === "effecting") {
//                    this.runNextEffect();
        }
      } else {
        _runEffect();
      }
    } else {
      var timeOut = setTimeout(_runEffect, 300);
      this.timeOutList.push(timeOut);
    }
  };

  p.endEffect = function () {
    var _self = this;
    numberEffectCompleted++;
    if (numberEffectCompleted == (effectQueue[currentEffectTurn] && effectQueue[currentEffectTurn].length)) {
      if (effectQueue[currentEffectTurn].oneTime)
        effectQueue[currentEffectTurn].done = true;
      currentEffectTurn++;
      if (currentEffectTurn == effectQueue.length) {
        if (repeatEffectQueue) {
          currentEffectTurn = 0;
        } else {
//                    this.status = "pause";

          if (this.isAutoSpin) {
            var newSpinTimeOut = setTimeout(function () {
              _self.status = "pause";
              _self.checkStart();
            }, 500);
            this.timeOutList.push(newSpinTimeOut);
          } else {
            _self.status = "pause";
          }
        }
      }
      if (this.status === "effecting") {
//                this.runNextEffect();
      }
    }
  };

  p.createSlotItem = function (value, state) {
    var _self = this;
    var slotItem = new createjs.Container();

    var bg = new TWIST.Card(value);
    if (value > 51) {
      value -= 52;
      bg.bg.sourceRect = {
        width: TWIST.Card.size.width,
        height: 152,
        x: TWIST.Card.size.width * (9 + value),
        y: TWIST.Card.size.height * 4
      };
    }

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
      jElement.finish();
      jElement.isDone = true;
      var oldValue = this.text();
      var newOptions = {
        duration: 1000,
        step: function (now) {
          jElement.text(Global.numberWithDot(Math.ceil(now)));
        },
        done: function () {
          jElement.endEffect();
        }
      };
      $.extend(newOptions, jElement.options);
      oldValue = parseInt(oldValue.replace(/\,/g, ""));
      if (isNaN(oldValue))
        oldValue = 0;
      this.prop('Counter', oldValue).animate({
        Counter: jElement.newValue
      }, newOptions);
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

  p.explodePotEffect = function () {
    var _self = this;
    var jElement = $('#effect .explorer-pot');
    var firstTime = new Date();
    jElement.runEffect = function () {
      this.show();
    };
    jElement.click(function () {
      jElement.isDone = false;
      jElement.endEffect();
    });
    jElement.endEffect = function () {
      this.hide();
      this.isDone = true;
      if (this.isTracking) {
        this.isTracking = false;
        _self.emit("endEffect");
      }
    };

    return jElement;
  };

  p.winMoneyEffect = function (value) {
    var _self = this;

    var jElement = $(TWIST.HTMLTemplate['tinyMiniPoker/winMoney']);
    jElement.text(Global.numberWithDot(value));

    jElement.one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function () {
      jElement.endEffect();
    });

    jElement.runEffect = function () {
      jElement.isDone = false;
      if (value > 0) {
        _self.user.append(jElement);
      }
    };

    jElement.endEffect = function () {
      jElement.remove();
      jElement.isDone = true;
      if (this.isTracking) {
        this.isTracking = false;
        _self.emit("endEffect");
      }
    };

    return jElement;
  };

  p.hightlightWinRank = function (code) {
    var _self = this;

    var rankItem = this.resultItemList.find(function (item, index) {
      return item.code == code;
    });

    var jElement = rankItem ? rankItem.template : $('<div></div>');

    jElement.one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function () {
      jElement.endEffect();
    });

    jElement.runEffect = function () {
      jElement.isDone = false;
      jElement.addClass('active');
      if (this.isTracking) {
        this.isTracking = false;
        _self.emit("endEffect");
      }
    };

    jElement.endEffect = function () {
      jElement.removeClass('active');
      jElement.isDone = true;
    };

    return jElement;
  };

  p.hightLightWinCards = function (cardList) {
    var _self = this;

    var cardListTemlate = [];

    for (var i = 0; i < gameSize.x; i++) {
      var card = columns[i].children[0].children[0].children[0];
      card.active = cardList[i];
      card.border.sourceRect.x = TWIST.Card.size.width * 4;
      cardListTemlate.push(card);
    }

    cardListTemlate.runEffect = function () {
      cardListTemlate.isDone = true;
      cardListTemlate.forEach(function (item, index) {
        if (parseInt(item.active)) {
          item.hightLight();
        } else {
          item.Overlay();
        }
      });
      if (this.isTracking) {
        this.isTracking = false;
        _self.emit("endEffect");
      }
    };

    cardListTemlate.endEffect = function () {
      cardListTemlate.isDone = true;
    };

    return cardListTemlate;
  };

  p.showResultText = function (cardListRank, rankOfVerticalGroup) {
    var _self = this;

    var resultItem = this.options.resultTab.find(function (item, index) {
      return item.code == cardListRank;
    });
    var rankItem = cardRankList.find(function (item, index) {
      return item.value == rankOfVerticalGroup;
    });
    var resultText = resultItem.name;
    if ((resultItem.code == 3 || resultItem.code == 7 || resultItem.code == 9) && rankItem) {
      resultText = resultText + " " + rankItem.name;
      if (resultItem.code == 9) {
        resultText = "Đôi " + rankItem.name;
      }
    }
    this.resultText.text(resultText);

    var showResultText = {};

    showResultText.runEffect = function () {
      showResultText.isDone = false;
      _self.resultText.text(resultText);
      if (this.isTracking) {
        this.isTracking = false;
        _self.emit("endEffect");
      }
    };

    showResultText.endEffect = function () {
      _self.resultText.text("");
      showResultText.isDone = true;
    };

    return showResultText;
  };

  p.explodePotEffect = function () {
    var _self = this;
    var jElement = this.explodePot;
    var firstTime = new Date();
    jElement.runEffect = function () {
      this.isDone = false;
      this.show();
    };
    jElement.click(function () {
      jElement.endEffect();
    });
    jElement.endEffect = function () {
      this.hide();
      this.isDone = true;
      if (this.isTracking) {
        this.isTracking = false;
        _self.emit("endEffect");
      }
    };

    return jElement;
  };

  p.showSessionId = function (sessionId) {
    this.sessionId.text(sessionId);
  };

  TWIST.TinyMiniPoker = TinyMiniPoker;

})();