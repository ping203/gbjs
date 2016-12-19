this.TWIST = this.TWIST || {};

(function () {
  "use strict";

  var statusList, cardRankList, speed, numberCard, effectQueue, bets, moneyFallingEffectTime, gameState, gameStates,
          currentEffectTurn, numberEffectCompleted, timeOutList, canvasSize, mainCardSize, winCardSize, newCard, winCardContainer, currentBetting;

  var initOptions = {
    resultTab: []
  };

  function TinyHightLowGame(wrapper, options) {
    this.wrapper = $(wrapper);
    this.options = $.extend(initOptions, options);
    this.initTinyHightLowGame();
  }

  var p = TinyHightLowGame.prototype = new TWIST.BaseGame();

  p.initTinyHightLowGame = function () {
    this.initVariable();
    $.extend(this.options, canvasSize);
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
    this.draw();
    this.pushEventListener();
    this.status = 'pause';
  };

  p.initVariable = function () {
    statusList = ["pause", "endding", "running"];

    gameStates = ["getCards", "selectHightLow"];

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

    speed = 2.5;//default 2

    numberCard = 52;

    effectQueue = [];

    canvasSize = {width: 630, height: 340};

    mainCardSize = {width: 188, height: 245};

    winCardSize = {width: 38, height: 46};

    bets = [1000, 10000, 100000];

    moneyFallingEffectTime = 2000;

    timeOutList = [];

    gameState = 0;

    newCard = {};

    winCardContainer = {width: 360, height: 62, top: 260, left: 0};

    currentBetting = 0;
  };

  p.initTemplate = function () {
    var _self = this;

    this.wrapperTemplate = $(TWIST.HTMLTemplate['tinyHightLow/wrapper']);
    this.wrapper.append(this.wrapperTemplate);

    this.centerTempalte = $(TWIST.HTMLTemplate['tinyHightLow/center']);
    this.wrapperTemplate.append(this.centerTempalte);

    this.centerTempalte.find('.canvas-wrapper').append(this.canvas);
    this.initStage();

    this.topTempalte = $(TWIST.HTMLTemplate['tinyHightLow/top']);
    this.wrapperTemplate.append(this.topTempalte);

    this.bottomTempalte = $(TWIST.HTMLTemplate['tinyHightLow/bottom']);
    this.wrapperTemplate.append(this.bottomTempalte);

    this._initExplodePot();

    this._initPot();

    this._initCurrentBetting();

    this._initPotCards();

    this._initSupportText();

    this._initRemainTime();

    this._initHightLowButton();

    this._initHightLowBettingText();

    this._initNewTurnText();

    this._initVirtualCard();

    this._initProfile();

    this._initChipsButton();

    this._initOtherButtons();

    this._initSessionId();

    this._initNewTurnButton();

    this._initErrorPanel();
  };

  p._initExplodePot = function () {
    var _self = this;
    this.effect = $('<div class="effect">' + TWIST.HTMLTemplate['effect/explodePot'] + '</div>');
    this.wrapperTemplate.append(this.effect);

    this.effect.explorerPot = _self.effect.find('.explorer-pot');
    this.effect.moneyFalling = _self.effect.find('.money-falling');
    this.effect.showEffect = function () {
      _self.effect.explorerPot.show();
      _self.effect.moneyFalling.show();
    };
    this.effect.hideEffect = function () {
      _self.effect.explorerPot.hide();
      _self.effect.moneyFalling.hide();
    };
    this.effect.on('click', _self.effect.hideEffect);
  };

  p._initPot = function () {
    var _self = this;
    this.pot = this.topTempalte.find('.pot-value');
    this.addNumberEffect(this.pot);
  };

  p._initCurrentBetting = function () {
    var _self = this;
    this.currentBetting = this.topTempalte.find('.bank-value');
    this.addNumberEffect(this.currentBetting);
  };

  p._initPotCards = function () {
    var _self = this;
    this.potCards = [];
    var potCards = this.topTempalte.find('.pot-card');
    potCards.each(function (index, item) {
      _self.potCards.push($(item));
    });
    this.potCards.addActiveCard = function () {
      var potCard = _self.potCards.find(function (item, index) {
        return !item.active;
      });
      if (potCard) {
        potCard.active = true;
        potCard.addClass('active');
      }
    };
    this.potCards.removeActiveCard = function () {
      potCards.removeClass('active');
      _self.potCards.forEach(function (item, index) {
        item.active = false;
        item.removeClass('active');
      });
    };
  };

  p._initSupportText = function () {
    var _self = this;
    this.supportText = this.centerTempalte.find('.text-support');
    this.supportText.text("");
  };

  p._initRemainTime = function () {
    var _self = this;
    this.remainTime = this.centerTempalte.find('.remain-time');
    this.addRemainTimeEffect(this.remainTime);
  };

  p._initHightLowButton = function () {
    var _self = this;
    this.lowButton = this.centerTempalte.find('.low-button');
    this.addDisbaleEffect(this.lowButton);
    this.lowButton.runEffect();

    this.hightButton = this.centerTempalte.find('.hight-button');
    this.addDisbaleEffect(this.hightButton);
    this.hightButton.runEffect();

    this.lowButton.on('click', function (event) {
      if (_self.lowButton.disabled)
        return;
      _self.emitHightLow(false);
    });

    this.hightButton.on('click', function (event) {
      if (_self.hightButton.disabled)
        return;
      _self.emitHightLow(true);
    });
  };

  p._initHightLowBettingText = function () {
    var _self = this;
    this.lowBetting = this.centerTempalte.find('.low-value');
    this.addNumberEffect(this.lowBetting);

    this.hightBetting = this.centerTempalte.find('.hight-value');
    this.addNumberEffect(this.hightBetting);
  };

  p._initVirtualCard = function () {
    var _self = this;
    this.virtualCard = this.centerTempalte.find('.virtual-card');
    this.getCardButton = this.bottomTempalte.find('.get-card');

    this.virtualCard.on('click', function (event) {
      _self.checkStart();
    });

    this.getCardButton.on('click', function (event) {
      _self.checkStart();
    });

  };

  p.checkStart = function () {
    var _self = this;
    if (_self.status !== 'pause' || gameState !== 0)
      return;
    if (this.userInfo.money < this.info.betting) {
      this.emit("error", "Bạn không đủ tiền !");
    } else {
      TWIST.Sound.play("minigame/ButtonClick");
      TWIST.Sound.play("minigame/coin_spin");
      _self.emit("start", this.info.betting);
      this.newTurnText.hide();
      this.changeStatus("running");
      _self.moneyContainer.runEffect(this.userInfo.money - this.info.betting, {duration: 500});
      this.moveChip.runEffect(true);
    }
  };

  p.emitHightLow = function (isHight) {
    var _self = this;
    if (_self.status !== 'pause' || gameState !== 1)
      return;
    TWIST.Sound.play("minigame/ButtonClick");
    this.emit("choose", isHight);
  };

  p._initNewTurnText = function () {
    var _self = this;
    this.newTurnText = this.centerTempalte.find('.new-turn-text');
  };

  p._initProfile = function () {
    var _self = this;
    this.user = $(TWIST.HTMLTemplate['tinyMiniPoker/user']);
    this.bottomTempalte.find('.profile-hight-low').append(this.user);

    this.moneyContainer = this.user.find('.money');
    this.addNumberEffect(this.moneyContainer);

    this.user.renderUserInfo = function (data) {
      $.extend(_self.userInfo, data);
      var avatarContainer = _self.user.find('.avatar');
      var usernameContainer = _self.user.find('.username');
      var moneyContainer = _self.user.find('.money');
      var avatar = Global.md5Avatar(data.avatar);
      avatarContainer.addClass('avatar' + avatar);
      usernameContainer.text(data.username);
      _self.moneyContainer.runEffect(data.money, {duration: 10});
    };

    this.moveChip = $(TWIST.HTMLTemplate['tinyVideoPoker/moveChip']);
    this.user.append(this.moveChip);
    this.addChipEffect(this.moveChip);
    this.moveChip.hide();
  };

  p._initChipsButton = function () {
    var _self = this;
    this.chipWrapper = $(TWIST.HTMLTemplate['tinyMiniPoker/chips']);
    this.bottomTempalte.find('.chips-hight-low').append(this.chipWrapper);

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

    this.chipButtons.forEach(function (item, index) {
      item.template.on('click', function (event) {
        if (_self.status !== 'pause' || gameState !== 0)
          return;
        this.resultSound = TWIST.Sound.play("minigame/Common_Click");
        _self.setBetting(item);
      });
    });

    this.setBetting(this.chipButtons[0]);
  };

  p._initErrorPanel = function () {
    this.errorPanel = $(TWIST.HTMLTemplate['tinyMiniPoker/errorPanel']);
    this.wrapperTemplate.append(this.errorPanel);
    this.errorPanel.hide();
  };

  p._initOtherButtons = function () {
    var _self = this;
    this.closeButton = this.bottomTempalte.find('.button-close');
    this.closeButton.on('click', function (event) {
      _self.emit('closePopup');
    });

    this.showHelp = this.bottomTempalte.find('.button-help');
    this.showHelp.on('click', function (event) {
      _self.emit('showHelp');
    });

    this.showHistory = this.bottomTempalte.find('.button-history');
    this.showHistory.on('click', function (event) {
      _self.emit('showHistory');
    });
  };

  p._initSessionId = function () {
    this.sessionId = $(TWIST.HTMLTemplate['tinyMiniPoker/sessionId']);
    this.wrapperTemplate.append(this.sessionId);
  };

  p.setBetting = function (item) {
    this.chipWrapper.find('.chip').removeClass('active');
    item.template.addClass("active");
    this.info.betting = item.value;
    this.pot.runEffect(this.info.potData[this.info.betting], {duration: 200});
  };

  p._initNewTurnButton = function () {
    var _self = this;
    this.newTurnButton = this.bottomTempalte.find('.new-turn-button');
    this.addDisbaleEffect(this.newTurnButton);
    this.newTurnButton.hide();

    this.newTurnButton.on('click', function (event) {
      if (_self.newTurnButton.disabled)
        return;
      _self.emit("newTurn");
    });

  };

  p.draw = function () {
    var _self = this;
    this.mainContainer = new createjs.Container();
    this.mainContainer.set({
      x: (canvasSize.width - mainCardSize.width) / 2,
      y: 0
    });
    this.winCardContainer = new createjs.Container();
    this.winCardContainer.set({
      x: winCardContainer.left,
      y: winCardContainer.top
    });

    this.stage.addChild(this.mainContainer, this.winCardContainer);
    this.addMainCard(-1);
  };

  p.addMainCard = function (value) {
    var _self = this;
    this.mainContainer.removeAllChildren();
    var card, scale;
    if (value > -1) {
      scale = mainCardSize.width / TWIST.Card.size.width;
      card = new TWIST.Card(value);
      card.set({
        scaleX: scale,
        scaleY: scale
      });
    } else {
      var img = new Image();
      img.src = TWIST.imagePath + 'tinyHightLow/card-back.png';
      var card = new createjs.Bitmap(img);
      card.set({
        scaleX: mainCardSize.width / 400,
        scaleY: mainCardSize.width / 400
      });
    }
    this.mainContainer.addChild(card);
  };

  p.storeMainCard = function () {
    var _self = this;
    var card = this.mainContainer.children[0];
    var index = this.winCardContainer.children.length;
    this.winCardContainer.addChild(card);
    card.set({
      x: card.x + this.mainContainer.x - this.winCardContainer.x,
      y: card.y + this.mainContainer.y - this.winCardContainer.y
    });
    var newX = 10 + (winCardSize.width + 10) * index;
    createjs.Tween.get(card).to({
      x: newX,
      y: 10,
      scaleX: winCardSize.width / TWIST.Card.size.width,
      scaleY: winCardSize.height / TWIST.Card.size.height
    }, 500).call(function () {
      _self.emit("_storeComplete");
    });
    if (newX + winCardSize.width > winCardContainer.width) {
      var newContainerX = winCardContainer.width - (newX + winCardSize.width);
      createjs.Tween.get(this.winCardContainer).to({
        x: newContainerX
      }, 500).call(function () {});
    }
  };

  p.drawListCard = function (listCard) {
    var _self = this;

    this.winCardContainer.removeAllChildren();
    listCard.forEach(drawSingleCard);

    function drawSingleCard(id, index) {
      var card = new TWIST.Card(id);
      _self.winCardContainer.addChild(card);
      card.set({
        x: 10 + (winCardSize.width + 10) * index,
        y: 10,
        scaleX: winCardSize.width / TWIST.Card.size.width,
        scaleY: winCardSize.height / TWIST.Card.size.height
      });
    }
    ;
  };


  p.changeStatus = function (status) {
    var _self = this;
    this.clear();
    if (status === 'pause') {
      this.newTurnButton.setDisabled(false);
    }

    if (status === "running") {
      this.playingInterval = setInterval(function () {
        _self.addMainCard(parseInt(Math.random() * 52));
      }, 100);
      timeOutList.push(this.playingInterval);
      this.hightButton.setDisabled(true);
      this.lowButton.setDisabled(true);
      this.newTurnButton.setDisabled(true);
    }
  };

  p.changeGameState = function (state) {
    gameState = state;
    this.clearGameState();
    if (gameState == 0) {
      this.changeStatus('pause');
      this.addMainCard(-1);
      this.getCardButton.show();
      this.virtualCard.show();
      this.newTurnText.show();
      this.newTurnButton.hide();
      this.hightButton.setDisabled(true);
      this.lowButton.setDisabled(true);
      this.lowBetting.runEffect(0, {duration: 10});
      this.hightBetting.runEffect(0, {duration: 10});
      this.effect.hide();
    } else if (gameState == 1) {
      this.newTurnText.hide();
      this.getCardButton.hide();
      this.virtualCard.hide();
      this.newTurnButton.show();
    }
  };

  p.clear = function () {
    this.supportText.text("");
    this.remainTime.endEffect();
    timeOutList.forEach(function (item) {
      clearTimeout(item);
    });
  };

  p.clearGameState = function () {
    this.clear();
    this.potCards.removeActiveCard();
    this.winCardContainer.set({x: 0});
    this.winCardContainer.removeAllChildren();
    this.currentBetting.runEffect(0);
  };

  p.setNewCard = function (data) {
    this.addMainCard(data.cardId);
    this.hightButton.setDisabled(false);
    this.lowButton.setDisabled(false);
    this.hightBetting.runEffect(data.hightMoney, {duration: 300});
    this.lowBetting.runEffect(data.lowMoney, {duration: 300});
    if (data.isPotCard) {
      this.potCards.addActiveCard();
    }
    currentBetting = data.currentBetting;
    this.currentBetting.runEffect(data.currentBetting || 0, {duration: 300});
    if (data.currentBetting > 0) {
      if (data.currentBetting != this.info.betting) {
        TWIST.Sound.play("minigame/NormalWin");
      }
      this.supportText.text("Quân bài tiếp theo là cao hay thấp hơn ?");
      this.remainTime.runEffect(data.remainTime || 120000);
      this.hightButton.setDisabled(false);
      this.lowButton.setDisabled(false);
      if (data.hightMoney == 0) {
        this.hightButton.setDisabled(true);
      }
      if (data.lowMoney == 0) {
        this.lowButton.setDisabled(true);
      }
      if (data.explorerPot) {
        this.effect.showEffect()
      }
    } else {
      TWIST.Sound.play("minigame/slot_result");
      this.supportText.text("Bạn chọn sai, chúc bạn may mắn lần sau !");
      this.hightButton.setDisabled(true);
      this.lowButton.setDisabled(true);
    }
  };

  p.pushEventListener = function () {
    var _self = this;

    this.on("userInfo", function () {
      _self.user.renderUserInfo(arguments[0]);
    });

    this.on("getFirstCard", function (data) {
      _self.getFirstCard(data);
    });

    this.on("updatePots", function (data) {
      _self.bindPots(data);
    });

    this.on("newCard", function (data) {
      _self.newCard(data);
    });

    this.on("getWin", function (data) {
      _self.getWin(data);
    });

    this.on("updateMoney", function (data) {
      _self.updateMoney(data);
    });

    this.on("error", function (message) {
      _self.showError(message);
    });

    this.on("reconnect", function (data) {
      _self.reconnect(data);
    });

  };

  p.getFirstCard = function (data) {
    this.changeGameState(1);
    this.changeStatus('pause');
    data.currentBetting = data.currentBetting || this.info.betting;
    this.setNewCard(data);
    this.newTurnButton.setDisabled(true);
    this.sessionId.text(data.sessionId);
  };

  p.bindPots = function (data) {
    $.extend(this.info.potData, data.pots);
    this.pot.runEffect(this.info.potData[this.info.betting], {duration: 500});
  };

  p.newCard = function (data) {
    var _self = this;
    this.storeMainCard();
    this.changeStatus('running');

    this.once("_storeComplete", function () {
      _self.changeStatus('pause');
      _self.setNewCard(data);
    });
  };

  p.getWin = function (data) {
    var _self = this;
    this.sessionId.text("");
    if (currentBetting > 0) {
      TWIST.Sound.play("minigame/coin_spin");
      this.moveChip.isTracking = true;
      this.moveChip.runEffect();
      this.moneyContainer.runEffect(parseInt(this.userInfo.money) + currentBetting, {duration: 500});
      this.currentBetting.runEffect(0, {duration: 500});
      _self.changeGameState(0);
      this.once('_moveChipComplete', function () {
        _self.changeGameState(0);
      });
    } else {
      this.changeGameState(0);
    }
  };

  p.updateMoney = function (data) {
    this.userInfo.money = data.newMoney;
  };

  p.showError = function (message) {
//    this.supportText.text(message);

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

  p.reconnect = function (data) {

    var _self = this;
    var button;
    this.chipButtons.forEach(function (item, index) {
      if (item.value == data.betting) {
        button = item
      }
    });

    this.changeGameState(1);
    this.setBetting(button);
    this.setNewCard(data);
    this.drawListCard(data.listCard);
    if (!data.listCard.length) {
      this.newTurnButton.setDisabled(true);
    }
    ;
    if (data.numberPotCards) {
      for (var i = 0; i < data.numberPotCards; i++) {
        this.potCards.addActiveCard()
      }
    }
  };

  TWIST.TinyHightLowGame = TinyHightLowGame;

})();