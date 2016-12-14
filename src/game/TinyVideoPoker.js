this.TWIST = this.TWIST || {};

(function () {
  "use strict";

  var gameSize, columnSize, itemSize, distance, columns, speed, effectArray,
          statusList, endingPhase, numberCard, time, stepValue, spinAreaConf, colorList,
          lineList9, lineList20, isLine9, line9Left, line9Right, line20Left, line20Right,
          line9Coordinate, activeLines, bets, effectQueue, moneyFallingEffectTime, currentEffectTurn, numberEffectCompleted,
          timeOutList, fistLog, cardRankList, gameTurn, currentCardList, gameTurnList, activeColumnIndex, currentWin, doubleList,
          holdCard, holdList, repeatEffectQueue, initOptions;

  initOptions = {
    resultTab: [{
        name: "Sảnh rồng(Nỗ hũ)",
        value: -1,
        code: '0'
      }, {
        name: "Thùng phá sảnh",
        value: 50,
        code: '1'
      }, {
        name: "Tứ quý",
        value: 25,
        code: '2'
      }, {
        name: "Cù lũ",
        value: 9,
        code: '3'
      }, {
        name: "Thùng",
        value: 6,
        code: '4'
      }, {
        name: "Sảnh",
        value: 4,
        code: '5'
      }, {
        name: "Ba lá",
        value: 3,
        code: '6'
      }, {
        name: "Hai đôi",
        value: 2,
        code: '7'
      }, {
        name: "Đôi J hoặc cao hơn",
        value: 1,
        code: '8'
      }, {
        name: "Không ăn !",
        value: 0,
        code: '9'
      }]
  };

  function TinyVideoPoker(wrapper, options) {
    this.wrapper = $(wrapper);
    this.options = $.extend(initOptions, options);
    this.initTinyVideoPoker();
  }

  var p = TinyVideoPoker.prototype = new TWIST.BaseGame();

  p.initTinyVideoPoker = function () {
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
    this.initTemplate();
    this.initEvent();
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

    gameTurn = 0;

    gameTurnList = ["selectCard", "selectDouble", "getWin"];

    currentCardList = [];

    activeColumnIndex = [];

    currentWin = 0;

    doubleList = [0, 1, 2, 3, 4];

    holdList = [];

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
      currentCardList[i] = item.bg;

      spinArea.addChild(columns[i]);
    }

    this.stage.addChild(spinArea);
  };

  p.initTemplate = function () {
    var _self = this;
    this.wrapperTemplate = $(TWIST.HTMLTemplate['tinyVideoPoker/wrapper']);
    this.wrapper.append(this.wrapperTemplate);

    this.canvasWrapper = $(TWIST.HTMLTemplate['tinyVideoPoker/canvasWrapper']);
    this.wrapperTemplate.append(this.canvasWrapper);

    this.canvasWrapper.append(this.canvas);
    this.initStage();

    this.resultText = $(TWIST.HTMLTemplate['tinyVideoPoker/resultText']);
    this.wrapperTemplate.append(this.resultText);

    this.wrapperTemplate.append($(TWIST.HTMLTemplate['tinyVideoPoker/pot']));
    this.pot = this.wrapperTemplate.find('.pot-value');

    this.buttonSpin = $(TWIST.HTMLTemplate['tinyVideoPoker/button']);
    this.wrapperTemplate.append(this.buttonSpin);

    this.buttonClose = $(TWIST.HTMLTemplate['tinyMiniPoker/buttonClose']);
    this.wrapperTemplate.append(this.buttonClose);

    this.buttonHelp = $(TWIST.HTMLTemplate['tinyMiniPoker/buttonHelp']);
    this.wrapperTemplate.append(this.buttonHelp);

    this.buttonHistory = $(TWIST.HTMLTemplate['tinyMiniPoker/buttonHistory']);
    this.wrapperTemplate.append(this.buttonHistory);

    this.doubleButton = $(TWIST.HTMLTemplate['tinyVideoPoker/doubleButton']);
    this.wrapperTemplate.append(this.doubleButton);
    this.doubleButton._disabled = true;
    this.doubleButton.hide();

    this.getWinButton = $(TWIST.HTMLTemplate['tinyVideoPoker/getWinButton']);
    this.wrapperTemplate.append(this.getWinButton);
    this.getWinButton._disabled = true;

    this.chipWrapper = $(TWIST.HTMLTemplate['tinyVideoPoker/chips']);
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

    this.errorPanel = $(TWIST.HTMLTemplate['tinyVideoPoker/errorPanel']);
    this.wrapperTemplate.append(this.errorPanel);
    this.errorPanel.hide();

    this.resultTab = $(TWIST.HTMLTemplate['tinyVideoPoker/resultTab']);
    this.wrapperTemplate.append(this.resultTab);

    this.virtualCardsList = [];
    this.virtualCards = $(TWIST.HTMLTemplate['tinyVideoPoker/virtualCards']);
    this.wrapperTemplate.append(this.virtualCards);
    for (var i = 0; i < 5; i++) {
      this.virtualCardsList.push(this.virtualCards.find('.vitualCard' + (i + 1)));
    }

    this.resultItemList = [];
    this.resultItem = _.template(TWIST.HTMLTemplate['tinyVideoPoker/resultItem']);
    this.options.resultTab.forEach(function (item, index) {
      if (item.code === _self.options.resultTab[_self.options.resultTab.length - 1].code)
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

    this.user = $(TWIST.HTMLTemplate['tinyVideoPoker/user']);
    this.wrapperTemplate.append(this.user);

    this.sessionId = $(TWIST.HTMLTemplate['tinyVideoPoker/sessionId']);
    this.wrapperTemplate.append(this.sessionId);

    this.effectWrapper = $(TWIST.HTMLTemplate['effect/wrapper']);
    this.wrapperTemplate.append(this.effectWrapper);

    this.explodePot = $(TWIST.HTMLTemplate['effect/explodePot']);
    this.effectWrapper.append(this.explodePot);

    this.supportText = $(TWIST.HTMLTemplate['tinyVideoPoker/supportText']);
    this.wrapperTemplate.append(this.supportText);

    this.moveChip = $(TWIST.HTMLTemplate['tinyVideoPoker/moveChip']);
    this.user.append(this.moveChip);
    this.moveChip.hide();

    this.money = this.user.find('.money');

    this.setBetting(this.chipButtons[0]);
  };

  p.initButton = function () {
    var _self = this;

    this.chipButtons.forEach(function (item, index) {
      item.template.on('click', function (event) {
        if ((_self.status !== 'pause' && _self.status !== 'effecting') || gameTurn != 0)
          return;
        TWIST.Sound.play("minigame/Common_Click");
        _self.setBetting(item);
      });
    });

    this.virtualCardsList.forEach(function (item, index) {
      item.on('click', function (event) {
        if (_self.status == 'effecting' && gameTurn == 1) {
          TWIST.Sound.play("minigame/Common_Click");
          item._active = !item._active;
          item.toggleClass("active");
        } else if (gameTurn == 3) {
          if (!currentCardList[index].isOpened) {
            TWIST.Sound.play("minigame/Common_Click");
            _self.emit("cardSelect", index);
            gameTurn = -1;
          }
        }
      });
    });

    this.getWinButton.on('click', function (event) {
      if (gameTurn != 2 && gameTurn != 3)
        return;
      if (_self.getWinButton._disabled)
        return;
      TWIST.Sound.play("minigame/Common_Click");
      _self.emit("getWin");
    });

    this.doubleButton.on('click', function (event) {
      if (gameTurn != 2 && gameTurn != 3)
        return;
      if (_self.doubleButton._disabled)
        return;
      TWIST.Sound.play("minigame/Common_Click");
      _self.emit("double");
    });

    this.buttonSpin.on('click', function (event) {
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

    this.on("reconnect", function (data) {
      _self.reconnect(data);
    });

    this.on("endSpin", function (data) {
      _self.endSpin(data);
    });

    this.on("userInfo", function () {
      _self.renderUserInfo(arguments[0]);
    });

    this.on("spin", function () {
      _self.startSpin();
    });

    this.on("seconSpin", function () {
      _self.startSpin();
    });

    this.on("spinCompleted", function () {
      _self.effecting();
    });

    this.on("endEffect", function () {
      _self.endEffect();
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

    this.on("getWinResult", function (data) {
      _self.getWin(data);
    });

    this.on("doubleResult", function (data) {
      _self.doubleTurn(data);
    });

    this.on("updateDoubleList", function (data) {
      doubleList = data.doubleList;
    });

    this.on("cardSelectResult", function (data) {
      _self.setCardSelected(data);
    });
  };

  p.reconnect = function (data) {
    var _self = this;
    this.showSessionId(data.sessionId);

    var bettingItem = this.chipButtons.find(function (item, index) {
      return item.value == data.betting;
    });
    _self.changeNumberEffect(_self.resultText, data.currentMoney, {duration: 100}).runEffect();
    this.setBetting(bettingItem);

    var functionList = {
      1: _self.reDrawFirstTurn,
      2: _self.reDrawSeconTurn,
      3: _self.reDrawDoubleTurn,
    };
    var fun = functionList[data.status];
    if (typeof fun == 'function') {
      fun.call(_self, data);
    }
  };

  p.reDrawFirstTurn = function (data) {
    var _self = this;
    currentCardList.forEach(function (item, index) {
      item.setValue(data.map[index]);
    });
    this.endSpin(data);
  };

  p.reDrawSeconTurn = function (data) {
    var _self = this;
    currentCardList.forEach(function (item, index) {
      item.setValue(data.map[index]);
    });

    this.virtualCardsList.forEach(function (item, index) {
      data.holdCards[index] && item.toggleClass("active");
    });
    gameTurn = 1;
    this.endSpin(data);
  };

  p.reDrawDoubleTurn = function (data) {
    this.buttonSpin.hide();
    this.doubleButton.show();
    this.doubleButton._disabled = true;
    this.doubleButton.addClass('disabled');
    if (data.doubleStatus == 1) {
      this.reDrawDoubleTurnPhase1(data);
    } else if (data.doubleStatus == 2) {
      this.reDrawDoubleTurnPhase2(data);
    }
  };

  p.reDrawDoubleTurnPhase1 = function (data) {
    gameTurn = 2;
    this.doubleTurn(data);
  };

  p.reDrawDoubleTurnPhase2 = function (data) {
    gameTurn = 3;
    currentCardList[0].openCard(data.cardId, TWIST.Card.miniPoker);
    this.setCardSelected(data);
  };

  p.setCardSelected = function (data) {
    var _self = this;
    var card = currentCardList[data.selectedIndex];
    card.isTracking = true;
    doubleList = data.map;

    card.openCard(doubleList[data.selectedIndex], TWIST.Card.miniPoker);

    TWIST.Observer.once('cardOpened', openOtherCard);

    function openOtherCard(cardOpen) {
      var delay = 0;
      var item = _self.virtualCardsList[data.selectedIndex];
      currentCardList.forEach(function (item, index) {
        if (index == 0 || index == data.selectedIndex)
          return;
        createjs.Tween.get(item).wait(delay * 200).to({}, 10).call(function () {
          this.Overlay();
          this.openCard(doubleList[index], TWIST.Card.miniPoker);
        });
        delay++;
      });

      if (data.isNext) {
        var changeWinMoneyEffect = _self.changeNumberEffect(_self.resultText, data.winMoney, {duration: 700}).runEffect();
        var supportTextEffect = _self.setTextEffect(_self.supportText, "Nhân đôi " + data.winMoney + " thành " + (parseInt(data.winMoney) * 2) + "!").runEffect();
        _self.buttonSpin.hide();
        _self.doubleButton._disabled = false;
        _self.doubleButton.removeClass('disabled');
        _self.doubleButton.show();
        _self.getWinButton._disabled = false;
        _self.getWinButton.addClass('active');
        currentWin = parseInt(data.winMoney);
        gameTurn = 2;
      } else {
        currentWin = 0;
        var supportTextEffect = _self.setTextEffect(_self.supportText, "Không ăn !").runEffect();
        var changeWinMoneyEffect = _self.changeNumberEffect(_self.resultText, 0, {duration: 700}).runEffect();
        gameTurn = 0;
        _self.buttonSpin.show();
        _self.doubleButton.hide();
        _self.doubleButton._disabled = false;
        _self.doubleButton.addClass('disabled');
        _self.getWinButton._disabled = true;
        _self.getWinButton.removeClass('active');
        _self.virtualCardsList.forEach(function (item, index) {
          item._active = false;
          item.removeClass("active");
        });
      }
    }
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
    if (gameTurn == 0) {
      if (this.userInfo.money < this.info.betting) {
        this.emit("error", "Bạn không đủ tiền !");
      } else {
        if (_self.status !== "pause")
          _self.changeStatus("pause");
        this.startSound = TWIST.Sound.play("minigame/bonus_spin");
        _self.emit("spin", this.info.betting);
        _self.changeNumberEffect(_self.money, _self.userInfo.money - _self.info.betting, {duration: 800}).runEffect();
        _self.changeNumberEffect(_self.resultText, _self.info.betting, {duration: 800}).runEffect();
//        _self.moveChipEffect(1).runEffect();
      }
    } else if (gameTurn == 1) {
      this.startSound = TWIST.Sound.play("minigame/bonus_spin");
      holdList = [];
      this.virtualCardsList.forEach(function (item, index) {
        holdList.push(item._active);
      });
      _self.emit("seconSpin", holdList);
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
    timeOutList.forEach(function (item) {
      clearTimeout(item);
    });
    timeOutList = [];
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
    }

    if (status == "running") {
      this.resultSound && this.resultSound.stop();
      this.buttonSpin.addClass('disabled');
      if (gameTurn == 0) {
        this.resultText.text("");
      }
    }

    if (status == "effecting") {
      this.startSound && this.startSound.stop();
      this.buttonSpin.removeClass('disabled');
    }
  };

  p.startSpin = function () {
    endingPhase = -1;
    var firstColumn;
    var _self = this;
    var index = this.virtualCardsList.findIndex(function (item, index) {
      return !item._active;
    });
    if (index > -1) {
      firstColumn = columns[index].getChildAt(0);
      this.changeStatus("running");
      createjs.Tween.get(firstColumn)
              .to({y: -50}, 150)
              .call(function () {})
              .to({y: 0}, 150)
              .call(function () {
                _self.spinAllColumns();
              });
    } else {
      _self.changeStatus("effecting");
    }
  };

  p.spinAllColumns = function () {
    var _self = this;
    activeColumnIndex = [];
    this.virtualCardsList.forEach(function (item, index) {
      if (!_self.virtualCardsList[index]._active) {
        activeColumnIndex.push(index);
      }
    });
    activeColumnIndex.forEach(function (item, index) {
      _self.spinColumn(item, index);
    });
  };

  p.spinColumn = function (columnIndex, activeIndex) {
    var currentSpeed = this.options.speed || speed;
    var isNewEndingPhase = false;
    var beforeLastRow = false;
    if (endingPhase > -1 && (activeIndex == Math.floor(((endingPhase * 10 + 0.9 * 10) / 10) / gameSize.y))) {
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
    currentCardList[columnIndex] = newItem.children[0];

    var easeType = beforeLastRow ? createjs.Ease.getBackOut(5) : createjs.Ease.linear;
    var timeAnimation = beforeLastRow ? 2 * distance / currentSpeed : distance / currentSpeed;
    createjs.Tween.get(itemsContainer)
            .to({y: distance}, timeAnimation, easeType)
            .call(function () {
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
                if (activeIndex == Math.floor(((endingPhase * 10 + 0.9 * 10) / 10) / gameSize.y)) {
                  var isLastRow = (endingPhase % gameSize.y) == (gameSize.y - 1);
                  if (isLastRow) {
                    stepValue = 1 / 5;
                  } else if ((endingPhase % gameSize.y) == 0) {
                    stepValue = 1;
                  }
                  endingPhase = (endingPhase * 10 + stepValue * 10) / 10;
                  if (!isLastRow) {
                    _self.spinColumn(columnIndex, activeIndex);
                  } else {
                    endingPhase = (endingPhase * 10 + stepValue * 10) / 10;
                  }
                } else {
                  _self.spinColumn(columnIndex, activeIndex);
                }
                if (endingPhase > activeColumnIndex.length - 1) {
                  _self.emit("spinCompleted");
                }
              } else {
                _self.spinColumn(columnIndex, activeIndex);
              }

            });
  };

  p.endSpin = function (data) {
    var _self = this;
    if (this.status == 'running') {
      this.changeStatus("ending");
      _temp();
      endingPhase = -0.8;
      stepValue = 0.2;
    } else {
      _temp();
      this.effecting();
    }
    function _temp() {
      _self.result = _self.result || {};
      $.extend(_self.result, data);
      _self.mapData = data.map;
      _self.showSessionId(data.sessionId);
    }
  };

  p.updateMoney = function (data) {
    this.result = this.result || {};
    $.extend(this.result, data);
    this.userInfo.money = data.newMoney;
  };

  p.effecting = function () {
    this.changeStatus("effecting");
    var result = this.result;
    effectQueue = [];

    var effectArray = [];

    if (gameTurn == 0) {
      effectArray = this.getFistEffectTurn();
    } else {
      effectArray = this.getSeconEffectTurn();
    }

    effectArray.oneTime = true;
    effectArray.forEach(function (item, index) {
      item.isTracking = true;
    });
    effectQueue.push(effectArray);
    this.runNextEffect();
  };

  p.getFistEffectTurn = function () {
    var result = this.result;
    var effectArray = [];

    var supportTextEffect = this.setTextEffect(this.supportText, "Chọn quân bài muốn giữ lại");
    var hightlightHoldCards = this.hightlightHoldCards(result.holdCards);
    effectArray.push(supportTextEffect, hightlightHoldCards);

    gameTurn = 1;
    return effectArray;
  };

  p.getSeconEffectTurn = function () {
    var result = this.result;
    var effectArray = [];

    if (parseInt(result.winMoney) > 0) {
      this.resultSound = TWIST.Sound.play("minigame/NormalWin");
      var changeWinMoneyEffect = this.changeNumberEffect(this.resultText, result.winMoney, {duration: 700});
      var supportTextEffect = this.setTextEffect(this.supportText, "Nhân đôi " + result.winMoney + " thành " + (parseInt(result.winMoney) * 2) + "!");
      var hightLightWinCards = this.hightLightWinCards(result.hightLightCards);
      var hightlightWinRank = this.hightlightWinRank(result.cardListRank);
      effectArray.push(changeWinMoneyEffect, supportTextEffect, hightLightWinCards, hightlightWinRank);
      this.buttonSpin.hide();
      this.doubleButton._disabled = false;
      this.doubleButton.removeClass('disabled');
      this.doubleButton.show();
      this.getWinButton._disabled = false;
      this.getWinButton.addClass('active');
      currentWin = parseInt(result.winMoney);
      gameTurn = 2;
    } else {
      this.resultSound = TWIST.Sound.play("minigame/slot_result");
      currentWin = 0;
      var supportTextEffect = this.setTextEffect(this.supportText, "Không ăn !");
      var changeWinMoneyEffect = this.changeNumberEffect(this.resultText, 0, {duration: 700});
      var hightLightWinCards = this.hightLightWinCards([]);
      var hightlightHoldCards = this.hightlightHoldCards([]);
      effectArray.push(changeWinMoneyEffect, supportTextEffect, hightLightWinCards, hightlightHoldCards);
      gameTurn = 0;
      this.virtualCardsList.forEach(function (item, index) {
        item._active = false;
        item.removeClass("active");
      });
    }

    return effectArray;
  };

  p.hightlightHoldCards = function (holdCards) {

    var jElement = this.virtualCardsList;
    var _self = this;

    jElement.runEffect = function () {
      this.isDone = false;
      this.forEach(function (item, index) {
        if (holdCards[index]) {
          item._active = true;
          item.addClass('active');
        } else {
          item._active = false;
          item.removeClass('active');
        }
      });
    };

    jElement.endEffect = function () {
      this.forEach(function (item, index) {
        item.removeClass('active');
      });
      this.isDone = true;
      if (this.isTracking) {
        this.isTracking = false;
        _self.emit("endEffect");
      }
    };

    return jElement;
  };

  p.getWin = function (data) {
    var _self = this;
    TWIST.Sound.play("minigame/coin_spin");
    _self.changeStatus("effecting");
    _self.changeNumberEffect(_self.money, _self.userInfo.money, {duration: 800}).runEffect();
    _self.changeNumberEffect(_self.resultText, 0, {duration: 800}).runEffect();
    _self.setTextEffect(_self.supportText, "").runEffect();
//    _self.moveChipEffect(0).runEffect();
    currentWin = 0;
    gameTurn = 0;
    this.buttonSpin.show();
    this.doubleButton.hide();
    this.doubleButton._disabled = false;
    this.doubleButton.addClass('disabled');
    this.getWinButton._disabled = true;
    this.getWinButton.removeClass('active');
    this.virtualCardsList.forEach(function (item, index) {
      item._active = false;
      item.removeClass("active");
    });
  };

  p.doubleTurn = function (data) {
    var _self = this;
    if (_self.status !== "pause")
      _self.changeStatus("pause");
    gameTurn = 3;
    var supportTextEffect = this.setTextEffect(this.supportText, "Chọn quân bài cao hơn").runEffect();
    var hightlightHoldCards = this.hightlightHoldCards([]).runEffect();
    this.doubleButton._disabled = true;
    this.doubleButton.addClass('disabled');
    this.getWinButton._disabled = true;
    this.getWinButton.removeClass('active');
    this.virtualCardsList.forEach(function (item, index) {
      item.removeClass("active");
    });
    currentCardList.forEach(function (item, index) {
      item.unHightLight();
      item.UnOverlay();
      if (index == 0) {
        item.isOpened = true;
        item.openCard(data.cardId, TWIST.Card.miniPoker);
      } else {
        item.upSideDown(TWIST.Card.miniPoker);
      }
    });

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
            this.changeStatus("pause");
          }
        }
        if (this.status === "effecting") {
          this.runNextEffect();
        }
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
      if (currentEffectTurn == effectQueue.length) {
        if (repeatEffectQueue) {
          currentEffectTurn = 0;
        } else {
          this.changeStatus("pause");
        }
      }
      if (this.status === "effecting") {
        this.runNextEffect();
      }
    }
  };

  p.createSlotItem = function (value, state) {
    var _self = this;
    var slotItem = new createjs.Container();

    var bg = new TWIST.Card(value);
    slotItem.bg = bg;
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

  p.setTextEffect = function (el, newValue) {
    var jElement = $(el);
    var _self = this;

    jElement.newValue = newValue;

    jElement.runEffect = function () {
      jElement.isDone = false;
      jElement.text(newValue);
    };

    jElement.endEffect = function () {
      jElement.text("");
      jElement.isDone = true;
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
      jElement.isDone = false;
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

  p.hightlightWinRank = function (code) {
    var _self = this;

    var rankItem = this.resultItemList.find(function (item, index) {
      return item.code == code;
    });

    var jElement = rankItem ? rankItem.template : $('<div></div>');

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
      var card = currentCardList[i];
      card.active = cardList[i];
      card.border.sourceRect.x = TWIST.Card.size.width * 4;
      cardListTemlate.push(card);
    }

    cardListTemlate.runEffect = function () {
      cardListTemlate.isDone = false;
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
      cardListTemlate.forEach(function (item, index) {
        if (parseInt(item.active)) {
          item.unHightLight();
        } else {
          item.UnOverlay();
        }
      });
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

  p.moveChipEffect = function (plus) {
    var _self = this;
    var jElement = this.moveChip;
    var firstTime = new Date();
    jElement.runEffect = function () {
      this.isDone = true;
      this.removeClass('plus decrease');
      var className = plus ? "plus" : "decrease";
      this.removeClass('plus decrease');
      this.show();
      jElement.find('i').show();
      this.addClass(className);
      jElement.find('i').each(function (index) {
        var item = this;
        $(this).one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function () {
          $(this).hide();
        });
      });
    };

    jElement.endEffect = function () {
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

  TWIST.TinyVideoPoker = TinyVideoPoker;

})();