this.TWIST = this.TWIST || {};

(function () {
  "use strict";

  var imagePath = location.origin + location.pathname + '../src/images/';
  var _animationTime = 300;
  var DESK = TWIST.Desk;

  function Player(playerData) {
    this.initialize(playerData);
  }

  Player.Defaults = {
    UserName: 'username',
    Position: 0
  };

  Player.usernameConfig = {x: 0, y: 100, width: 120, height: 50};

  Player.avatarConfig = {x: 15, y: 0, radius: 45, innerRadius: 43, AvatarDefault: imagePath + 'avatars/1.png'};

  Player.handConfig = {x: 100, y: 100};

  Player.draftCardsConfig = {x: 100, y: 100, align: "left"};

  var p = Player.prototype = new createjs.Container();

  p.contructor_initialize = p.initialize;

  p.initialize = function (data) {
    this.contructor_initialize();
    $.extend(this, data);
    this.initCanvas();
  };

  p.initCanvas = function () {
    var self = this;
    var config = this.config || {};
    var avatarConfig = $.extend(Player.avatarConfig, config.avartar);

    this.initUsername(config, self);
    this.initAvatar(config, self);
    this.initDraftCards(config, self);
    this.initHandCards(config, self);
    this.initChatMessage(config, self);
    this.initMoneyEffect(config, self);
    this.initStatus(config, self);
    this.timer = new TWIST.Timer({x: avatarConfig.x, y: avatarConfig.y, radius: avatarConfig.radius, strokeThick: 10});

    this.addChild(this.timer, this.avatarContainer, this.usernameContainer, this.draftCards, this.hand, this.status, this.chat, this.moneyChangeEffect);
    this.render();
  };

  p.initUsername = function (config, self) {
    var usernameContainer = new createjs.Container();
    var usernameConfig = config.username || Player.usernameConfig;
    $.extend(usernameContainer, usernameConfig);

    var usernameText = new createjs.Text(this.username, '18px Roboto Condensed', 'white');
    usernameText.set({x: 60, y: 25, textAlign: 'center', textBaseline: 'bottom'});
    var moneyText = new createjs.Text(this.money, '14px Roboto Condensed', '#f3ba04');
    moneyText.set({x: 60, y: 45, textAlign: 'center', textBaseline: 'bottom'});
    var usernameBg = new createjs.Shape();
    usernameBg.graphics.beginFill("black").drawRoundRectComplex(0, 0, usernameConfig.width, usernameConfig.height, 10, 10, 10, 10);
    usernameBg.alpha = 0.2;
    usernameContainer.addChild(usernameBg, usernameText, moneyText);
    this.usernameContainer = usernameContainer;
  };

  p.initAvatar = function (config, self) {
    //        avatar container

    var avatarContainer = new createjs.Container();
    var avatarConfig = $.extend(Player.avatarConfig, config.avartar);
    var avatarImageDiameter = avatarConfig.innerRadius * 2;
    $.extend(avatarContainer, avatarConfig);

    var avatarImage = new Image();
    var avatarNumber = Global.md5Avatar(this.username) || 10;
    avatarImage.src = this.avatarSrc || ((TWIST.imagePath || imagePath) + 'player/avatars/' + avatarNumber + '.png');
    var avatarBitmap = new createjs.Bitmap(avatarImage);
    avatarImage.onload = function () {
      avatarBitmap.set({
        width: avatarImageDiameter,
        height: avatarImageDiameter,
        scaleX: avatarImageDiameter / avatarImage.width,
        scaleY: avatarImageDiameter / avatarImage.height
      });
    };
    avatarBitmap.set({x: avatarConfig.radius - avatarConfig.innerRadius, y: avatarConfig.radius - avatarConfig.innerRadius})

    var maskShape = new createjs.Shape();
    maskShape.graphics.drawCircle(avatarConfig.radius, avatarConfig.radius, avatarConfig.innerRadius);
    avatarBitmap.mask = maskShape;

    var avatarBg = new createjs.Shape();
    avatarBg.graphics.beginFill('#000').drawCircle(avatarConfig.radius, avatarConfig.radius, avatarConfig.radius);
    avatarBg.set({alpha: 0.7});

    var roomMasterImage = new Image();
    roomMasterImage.src = (TWIST.imagePath || imagePath) + 'player/' + 'icon_chuphong.png';
    var roomMaster = new createjs.Bitmap(roomMasterImage);
    roomMaster.set({x: avatarImageDiameter * 0.7, y: avatarImageDiameter * 0.7,
      name: "roomMaster", visible: this.isRoomMaster
    });
    var roomMasterSize = avatarImageDiameter * 0.3;
    roomMasterImage.onload = function () {
      roomMaster.set({
        width: roomMasterSize,
        height: roomMasterSize,
        scaleX: roomMasterSize / roomMasterImage.width,
        scaleY: roomMasterSize / roomMasterImage.height
      });
    };

    var avatarHit = new createjs.Shape();
    avatarHit.graphics.beginFill('#fff').drawRect(0, 0, avatarImageDiameter, avatarImageDiameter);
    avatarContainer.hitArea = avatarHit;

    avatarContainer.addChild(avatarBg, avatarBitmap, roomMaster);
    this.avatarContainer = avatarContainer;
  };

  p.initDraftCards = function (config, self) {
    //        draft cards

    var draftCardsConfig = config.draftPositions || Player.draftCardsConfig;
    this.draftCards = new createjs.Container();
    $.extend(this.draftCards, draftCardsConfig);
  };

  p.initHandCards = function (config, self) {
    //        hand container
    var handConfig = config.handPositions || Player.handConfig;
    this.hand = new createjs.Container();
    $.extend(this.hand, handConfig);
    var card = TWIST.Card.playerCard;
    var radius = (card.width - 3) / 2;

    this.handCards = new createjs.Container();
    this.numberOfCards = new createjs.Container();
    this.numberOfCards.set({x: 0, y: 0});
    var numberOfCardsBg = new createjs.Shape();
    numberOfCardsBg.graphics.beginFill('#000').drawCircle(card.width / 2, card.height / 2, radius);
    numberOfCardsBg.set({alpha: 0.3, visible: false});
    var numberOfCards = new createjs.Text("", (radius * 1.5) + 'px Roboto Condensed', '#7fc100');
    numberOfCards.set({x: card.width / 2, y: card.height / 2, textAlign: 'center', visible: false, name: "numberOfCard", textBaseline: 'middle'});
    this.numberOfCards.addChild(numberOfCardsBg, numberOfCards);

    this.hand.addChild(this.handCards, this.numberOfCards);
  };

  p.initChatMessage = function (config, self) {
    //show chat message
    this.chat = new createjs.Container();
    this.chat.set({name: 'chat'});
    var chatText = new createjs.Text('', '22px Roboto Condensed', '#000');
    chatText.set({textAlign: 'center', textBaseline: 'bottom'});
    var chatBg = new createjs.Shape();
    this.chat.addChild(chatBg, chatText);
  };

  p.initMoneyEffect = function (config, self) {
    //show change money effect
    this.moneyChangeEffect = new createjs.Container();
    this.moneyChangeEffect.set({name: 'moneyChangeEffect', x: 50, y: 50});
    var moneyChangeBg = new createjs.Text("", "bold 24px Roboto Condensed", "black");
    moneyChangeBg.set({x: 1, y: 11, textAlign: 'center', textBaseline: 'bottom'});
    var moneyChangeText = new createjs.Text("", "bold 24px Roboto Condensed");
    moneyChangeText.set({x: 0, y: 10, textAlign: 'center', textBaseline: 'bottom'});
    moneyChangeText.shadow = new createjs.Shadow("#000", 0, 0, 10);
    this.moneyChangeEffect.addChild(moneyChangeBg, moneyChangeText);
  };

  p.initStatus = function (config, self) {
    //player status
    this.status = new createjs.Container();
    var configAvatar = config.avartar || Player.avatarConfig;
    var radius = configAvatar.radius;
    this.status.set({x: configAvatar.x + radius, y: configAvatar.y + radius});
    var statusBg = new createjs.Text();
    var statusText = new createjs.Text();
    this.status.addChild(statusBg, statusText);
  };

  p.render = function () {
    this.setPlayerName(this.username);
    this.setMoney(this.money);
    this.setRoomMaster(this.isRoomMaster);
    return;
  };

  p.setRemainingTime = function (remainingTime, totalTime) {
    remainingTime = remainingTime || 20000;
    if (remainingTime < 50)
      remainingTime *= 1000;
    totalTime = totalTime || 20000;
    if (totalTime < 50)
      totalTime *= 1000;
    this.timer.startTimer(totalTime, remainingTime);
  };

  p.clearTimer = function (remainingTime, totalTime) {
    this.timer.clearTimer();
  };

  p.setPlayerName = function (name) {

    var usernameContainer = this.usernameContainer;
    var usernameText = usernameContainer.getChildAt(1);
    usernameText.text = name;
    var measuredWidth = usernameText.getMeasuredWidth();
    var usernameMaxWidth = Player.usernameConfig.width;
    if (measuredWidth > usernameMaxWidth) {
      var ratio = usernameMaxWidth / measuredWidth;
      var newLength = Math.round(usernameText.text.length * ratio) - 3;
      usernameText.text = usernameText.text.substring(0, newLength) + "...";
    }
  };

  p.setMoney = function (money) {
    var usernameContainer = this.usernameContainer;
    this.money = parseInt(money);
    var moneyText = usernameContainer.getChildAt(2);
    moneyText.text = Global.numberWithDot(money);
  };

  p.setRoomMaster = function (roomMaster, oldRoomMasterPosition) {
    if (typeof roomMaster === undefined)
      roomMaster = this.isRoomMaster;
    else
      this.isRoomMaster = roomMaster;
    var roomMasterItem = this.avatarContainer.getChildByName("roomMaster");
    roomMasterItem.visible = roomMaster;
    if (roomMaster) {
      var oldScale = {
        scaleX: roomMasterItem.scaleX,
        scaleY: roomMasterItem.scaleY
      };
      roomMasterItem.set({scaleX: 1, scaleY: 1});
      var initGlobalPosition = roomMasterItem.globalPosition = roomMasterItem.globalToLocal(0, 0);
      roomMasterItem.set(oldScale);

      if (oldRoomMasterPosition) {
        var initPosition = {
          x: roomMasterItem.x,
          y: roomMasterItem.y
        };
        var currentPosition = {
          x: initPosition.x + initGlobalPosition.x - oldRoomMasterPosition.x,
          y: initPosition.y + initGlobalPosition.y - oldRoomMasterPosition.y
        };
        roomMasterItem.set(currentPosition);
        createjs.Tween.get(roomMasterItem)
                .to({
                  x: initPosition.x,
                  y: initPosition.y
                }, _animationTime).call(function () {
        });

      }
    }

    return roomMasterItem;
  };

  p.clearHand = function () {
    this.handCards.removeAllChildren();
    var cardNumberBg = this.numberOfCards.getChildAt(0);
    var cardNumber = this.numberOfCards.getChildAt(1);
    cardNumberBg.visible = false;
    cardNumber.visible = false;
  };

  p.clearDraftCards = function () {
    if (this.draftCards) {
      this.draftCards.removeAllChildren();
    }
  };

  p.clearShowPhomArea = function () {
    if (this.showPhomArea) {
      this.showPhomArea.removeAllChildren();
    }
  };


  p.setPlayerStatus = function (status, options) {
    var statusContainer = this.status;
    var statusText = statusContainer.getChildAt(1);
    var statusBg = statusContainer.getChildAt(0);
    options = options || {};
    statusContainer.default = (typeof options.default === "undefined") ? statusContainer.default : options.default;
    status = status || statusContainer.default;
    statusContainer.visible = status ? true : false;

    options.color = options.color || "yellowgreen";
    options.font = options.font || 'bold 20px Roboto Condensed';
    options.x = options.x || 0;
    options.y = options.y || 10;
    options.textAlign = options.textAlign || 'center';
    options.textBaseline = options.textBaseline || 'bottom';
    $.extend(statusText, options);
    $.extend(statusBg, options);
    statusText.text = statusBg.text = status;
    statusText.shadow = new createjs.Shadow('black', 0, 0, 10);
    statusBg.x = options.x + 1;
    statusBg.y = options.y + 1;
    statusBg.color = "black";
  };


  p.renderCards = function (options) {
    var hand = this.hand;
    hand.visible = true;

    this._renderHandCards(this.handCards.cardList, options);
    var _self = this;
    if (this.showCardLength) {
      setTimeout(function () {
        _self.setNumberCards(_self.handCards.cardList.length);
      }, 1000);
    } else {
      this.numberOfCards.visible = false;
    }

  };

  p._renderHandCards = function (listCard, options) {
    var _self = this;
    options = options || {};

    this.handCards.removeAllChildren();

    var handCards = this.handCards,
            cardType = options.cardType || (this.position == 0 ? TWIST.Card.userCard : TWIST.Card.playerCard),
            numberCard = listCard.length,
            desk = this.parent.parent.getChildByName('desk'),
            dealTimeAnimation = 150,
            eachCardDelay = 30,
            animationTime,
            setReSort = !(typeof (options.reSort) == "undefined");
    for (var i = 0; i < numberCard; i++) {
      var card = listCard[i], cardImage;
      cardImage = desk.getCard();
      if (!cardImage)
        cardImage = new TWIST.Card();
      cardImage.cardValue = listCard[i];
      cardImage.position = i;
      animationTime = dealTimeAnimation + i * eachCardDelay;
      $.extend(options, {
        animationTime: animationTime
      });
      if ((i == numberCard - 1) && !setReSort) {
        options.reSort = true
      }
      this.addHandCards(cardImage, options);
    }
  };

  p.setNumberCards = function (numOfCards) {

    var cardNumberBg = this.numberOfCards.getChildAt(0);
    var cardNumber = this.numberOfCards.getChildAt(1);
    if (this.position !== 0 && numOfCards > 0) {
      cardNumberBg.visible = false;
      cardNumber.visible = false;
      cardNumber.text = numOfCards;

    } else {
      cardNumberBg.visible = false;
      cardNumber.visible = false;
    }
  };

  p.addHandCards = function (card, options) {
    var animationTime = options.animationTime || _animationTime;
    var reSort = options.reSort || false;
    var handCards = this.handCards;
    var _self = this;
    var bai = TWIST.Card.draftCard;

    var position = card.pos || handCards.children.length,
            oldX = card.x,
            oldY = card.y,
            cardType = options.cardType || (this.position === 0 ? TWIST.Card.userCard : TWIST.Card.playerCard);
    card.set({
      x: card.x - this.x - this.hand.x,
      y: card.y - this.y - this.hand.y,
      scaleX: bai.scale,
      scaleY: bai.scale
    });
    if (this.listPhom && this.listPhom.length && !isNaN(card.cardValue) && this.position == 0) {
      var cardsInPhom = [];
      this.listPhom.forEach(function (item, index) {
        cardsInPhom = cardsInPhom.concat(item);
      });
      card.isInPhom = cardsInPhom.indexOf(card.cardValue) > -1;
    }
    handCards.addChild(card);
    createjs.Tween.get(card).to({
      x: isNaN(options.x) ? cardType.seperator * handCards.getNumChildren() : options.x,
      y: isNaN(options.y) ? 0 : options.y,
      width: cardType.width,
      height: cardType.height,
      position: handCards.getNumChildren() - 1,
      seperator: cardType.seperator,
      scaleX: cardType.scale,
      scaleY: cardType.scale
    }, animationTime, createjs.Ease.sineOut()).call(function () {
      if (_self.position == 0) {
        if (!options.sideDown) {
          this.bindEventListener();
          if (options.dragable) {
            this.setDraggable(true);
          }
        } else {
          this.bindOpenCard();
        }
        if (!options.sideDown) {
          this.openCard(this.cardValue);
        }
        if (options.sortPhom) {
          _self.sortPhom();
        }
        if (reSort) {
          _self.sortCard();
        }
      } else {
        this.visible = _self.showPlayerCard;
        if (options.openCard) {
          this.openCard(this.cardValue);
        }
      }
    });
  };

  p.showThreeCards = function () {
    var cards = this.handCards.children;
    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      card.openCard(card.cardValue);
      card.removeAllEventListeners();
    }
  };


  p.getDeckCard = function (cardValue, options) {
    options = options || {};
    var desk = this.parent.parent.getChildByName('desk');
    var cardImage = desk.getCard();
    cardImage.cardValue = cardValue;
    $.extend(options, {
      animationTime: 200,
      reSort: true,
      dragable: true
    });
    this.addHandCards(cardImage, options);
    this.markEatedCard();
  };

  p.getChuong = function (options) {
    var _self = this;
    options = options || {};
    var avatarContainer = this.avatarContainer;
    var chuongIcon = avatarContainer.getChildByName("chuongIcon");

    if (options.isChuong) {
      var newX = chuongIcon.x, newY = chuongIcon.y;
      var oldGlobalX = options.x || 640;
      var oldGlobalY = options.y || 360;
      var oldX = oldGlobalX - this.x - this.avatarContainer.x;
      var oldY = oldGlobalY - this.y - this.avatarContainer.y;
      chuongIcon.set({
        x: oldX,
        y: oldY,
        visible: true
      });
      createjs.Tween.get(chuongIcon).to({
        x: newX,
        y: newY
      }, _animationTime).call(function () {
        _self.playerModel.isBanker = true;
      });
    } else {
      _self.playerModel.isBanker = false;
      chuongIcon.set({visible: false});
    }
  };

  p.draftCardsInHand = function (cardList, options) {
    var options = options || {},
            cardsToDrash = [],
            bai = options.cardType || TWIST.Card.draftCard,
            cardsToDrash = this.getCardsInHand(cardList),
            draftCards = options.draftCards || this.draftCards;
    var newPosition = options.position || {
      x: draftCards.children.length * bai.seperator,
      y: 0
    };
    if (this.draftCards.align === "right" && !options.position) {
      newPosition.x = 300 - newPosition.x;
    }
    for (var i = 0, length = cardsToDrash.length; i < length; i++) {
      var card = cardsToDrash[i];
      card.cardValue = cardList[i];
      var newOptions = $.extend(options, {
        draftCards: draftCards,
        position: newPosition,
        reSort: i === length - 1
      });
      this.draftSingleCard(card, newOptions);
      if (this.draftCards.align == "right" && !options.position) {
        newPosition.x -= bai.seperator;
      } else {
        newPosition.x += bai.seperator;
      }
    }
    this.setNumberCards(this.handCards.children.length);
  };

  p.draftSingleCard = function (card, options) {
    card.visible = true;
    card.removeAllEventListeners();
    var _self = this,
            bai = options.cardType || TWIST.Card.draftCard,
            draftCards = options.draftCards || this.draftCards;

    var draftPosition = draftCards.localToGlobal(0, 0);
    card.set({
      x: card.x + this.hand.x + this.x - draftPosition.x,
      y: card.y + this.hand.y + this.y - draftPosition.y,
      rotation: options.rotateAble ? (Math.random() - 0.5) * 30 : 0,
      scaleX: bai.scale,
      scaleY: bai.scale
    });
    draftCards.addChild(card);
    createjs.Tween.get(card).to({
      scaleX: card.scaleX * 1.2,
      scaleY: card.scaleY * 1.2
    }, _animationTime * 1 / 2).to({
      x: options.position.x, y: options.position.y,
      width: bai.width,
      height: bai.height,
      scaleX: bai.scale,
      scaleY: bai.scale
    }, _animationTime * 1 / 2).call(function () {
      if (_self.position !== 0) {
        this.openCard(this.cardValue, bai);
      } else if (options.reSort) {
        this.setInPhom(false);
        _self.sortCard();
      }
    });
  };
  p.sortDraftCards = function () {

    var cards = this.draftCards.children;
    var _self = this;

    var length = cards.length;
    var indexLeft = (DESK.width - length * TWIST.Card.draftCard.seperator - (this.draftCards.x + this.x) * 2) / 2;

    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      var newX = indexLeft + i * TWIST.Card.draftCard.seperator;

      createjs.Tween.get(card).to({
        x: newX
      }, _animationTime, createjs.Ease.sineOut()).call(function () {});
    }
  };
  p.getCardsInHand = function (cardList) {
    if (!cardList)
      return;
    var cards = [];
    var handCards = this.handCards.children;
    var handCardValue = handCards.map(function (item) {
      return item.cardValue
    });
    if (this.position != 0) {
      for (var i = 0; i < cardList.length; i++) {
        var cardValue = cardList[i];
        var handCardValue = handCards.map(function (item) {
          return item.cardValue
        });
        var cardIndex = handCardValue.indexOf(cardValue);
        if (cardIndex > -1) {
          var sliceCards = handCards.splice(cardIndex, 1);
        } else {
          var sliceCards = handCards.splice(handCardValue.indexOf(undefined), 1);
        }
        if (!sliceCards[0]) {
          sliceCards[0] = new TWIST.Card();
        }
        cards = cards.concat(sliceCards);
      }
//                    cards = handCards.slice(0, cardList.length);
    } else {
      for (var i = 0; i < cardList.length; i++) {
        for (var j = 0; j < handCards.length; j++) {
          if (cardList[i] == handCards[j].cardValue) {
            cards = cards.concat(handCards.splice(j, 1));
            j--;
          }
        }
      }
    }
    handCards.sort(function (a, b) {
      return a.position - b.position;
    });
    handCards.forEach(function (item, index) {
      item.position = index;
    });
    cards.sort(function (a, b) {
      return a.cardValue - b.cardValue;
    });
    return cards;
  };

  p.getSelectedCards = function () {
    var selectedCards = [];
    var cards = this.handCards.children;

    for (var i in cards) {
      if (cards[i] && cards[i].selected == true)
        selectedCards.push(cards[i].cardValue);
    }
    return selectedCards;
  };

  p.sortPhom = function (listCard) {
    var cards = this.handCards.children;
    var cardsInPhom = [];
    if (listCard) {
      cardsInPhom = listCard.sort(function (a, b) {
        return a - b;
      });
    } else {
      var listPhom = this.listPhom || [];
      for (var i = 0; i < listPhom.length; i++) {
        var phom = listPhom[i];
        phom.sort(function (a, b) {
          return a - b;
        });
        for (var j = 0; j < phom.length; j++) {
          cardsInPhom.push(phom[j]);
        }
      }
    }
    this.handCards.sortType = this.handCards.sortType ? "" : "rankSort";
    var _self = this;

    cards.forEach(function (item, index) {
      item.setInPhom(cardsInPhom.indexOf(item.cardValue) > -1);
    });

    cards.sort(function (a, b) {
      if (cardsInPhom.indexOf(a.cardValue) > -1 && !(cardsInPhom.indexOf(b.cardValue) > -1)) {
        return false;
      } else if (cardsInPhom.indexOf(b.cardValue) > -1 && !(cardsInPhom.indexOf(a.cardValue) > -1)) {
        return true;
      } else if (cardsInPhom.indexOf(a.cardValue) > -1 && cardsInPhom.indexOf(b.cardValue) > -1) {
        return cardsInPhom.indexOf(a.cardValue) - cardsInPhom.indexOf(b.cardValue);
      }
      if (_self.handCards.sortType == "rankSort") {
        return a.cardValue - b.cardValue;
      } else {
        if (a.suite == b.suite) {
          return a.rank - b.rank;
        }
        return a.suite - b.suite;
      }

    });
  };

  p.sortTL = function () {
    var cards = this.handCards.children;
    this.handCards.sortType = this.handCards.sortType ? "" : "rankSort";
    var _self = this;
    cards.sort(function (a, b) {
      if (_self.handCards.sortType == "rankSort") {
        return a.cardValue - b.cardValue;
      } else {
        return a.suite - b.suite || a.cardValue - b.cardValue
      }

    });
    this.sortCard();
  };

  p.sortCard = function () {
    var cards = this.handCards.children;
    var _self = this;
    setTimeout(_sortCard, 100);
    function _sortCard() {
      var length = cards.length;
      var indexLeft = (TWIST.Desk.width - length * TWIST.Card.userCard.seperator - (_self.hand.x + _self.x) * 2) / 2;
      _self.handCards.indexLeft = indexLeft;

      for (var i = 0; i < cards.length; i++) {
        var card = cards[i];
        if (card.isDragging) {
          card.isDragging = false;
        }
        card.selected = false;
        var newX = indexLeft + i * TWIST.Card.userCard.seperator;
        card.position = i;
        createjs.Tween.get(card).to({
          y: 0,
          x: newX
        }, _animationTime, createjs.Ease.sineOut()).call(function () {
        });
      }
    }
  };

  p.preparedShowPhom = function (cardsInPhom) {

    var cards = this.handCards.children;

    for (var i = 0; i < cards.length; i++) {
      if (i < cardsInPhom.length) {
        (function (card) {
          setTimeout(function () {
            card.setSelected(true);
          }, 500);
        })(cards[i])
      } else {
        cards[i].setSelected(false);
      }
    }
  };

  p.preparedSendCard = function (sendList) {
    var cards = this.handCards.children;
    for (var i = 0; i < cards.length; i++) {
      cards[i].setSelected(false);
      for (var j = 0; j < sendList.length; j++) {
        if (cards[i].cardValue == sendList[j]) {
          (function (card) {
            setTimeout(function () {
              card.setSelected(true);
            }, 500);
          })(cards[i])
        }
      }
    }
  };

  p.getLastDraftCards = function (cardIndex) {
    var _self = this;
    var draftCards = this.draftCards.children;
    for (var j = 0; j < draftCards.length; j++) {
      if (cardIndex == draftCards[j].cardValue) {
        var position = draftCards[j].localToGlobal(0, 0);
        this.rePositionDraftCards(j);
        draftCards[j].x = position.x;
        draftCards[j].y = position.y;
        var card = draftCards.splice(j, 1)[0];
        return card;
      }
    }
  };

  p.rePositionDraftCards = function (indexPosition) {
    var listCard = this.draftCards.children;
    listCard.forEach(function (item, index) {
      if (index > indexPosition) {
        item.set({
          x: listCard[index - 1].x
        });
      }
    });
  };

  p.getDraftCardsAbsolutePosition = function () {
    return {
      x: this.x + this.draftCards.x,
      y: this.y + this.draftCards.y
    };
  };

  p.eatCard = function (card, position, cardSordList) {
    var _self = this;
    this.numberEatedCard = this.numberEatedCard || 0;
    this.numberEatedCard++;
    var bai = (this.position == 0 ? TWIST.Card.userCard : TWIST.Card.draftCard);
    card.hightLight();
    if (this.position == 0) {
      this.addHandCards(card, {
        animationTime: 200,
        reSort: true,
        sortPhom: true,
        dragable: true
      });
    } else {
      var newX = bai.seperator * this.draftCards.children.length,
              newY = 0;
      this.handCards.addChild(card);
      card.set({x: card.x - this.hand.x - this.x, y: card.y - this.hand.y - this.y});
      if (this.position == 2) {
        newX = 0 - this.hand.x + 100 + bai.seperator * (this.numberEatedCard - 1);
        newY = 0;
      } else {
        newY = -TWIST.Card.draftCard.height - 10;
        if (this.draftCards.align == "right") {
          newX = 0 - this.hand.x + this.draftCards.x + 300 - (this.numberEatedCard - 1) * bai.seperator;
        } else {
          newX = 0 - this.hand.x + this.draftCards.x + bai.seperator * (this.numberEatedCard - 1);
        }
      }
      console.log("newY", newY);
      createjs.Tween.get(card).to({
        x: newX, y: newY,
        width: bai.width,
        height: bai.height,
        scaleX: bai.scale,
        scaleY: bai.scale
      }, _animationTime, createjs.Ease.sineOut()).call(function () {});
    }
  };

  p.markEatedCard = function () {
    var cardsInPhom = [];
    if (!this.listPhom)
      return;
    this.listPhom.forEach(function (item, index) {
      cardsInPhom = cardsInPhom.concat(item);
    });

    var cards = this.handCards.children;
    for (var i = 0; i < cards.length; i++) {
      cards[i].isInPhom = cardsInPhom.indexOf(cards[i].cardValue) > -1;
      cards[i].setInPhom(cards[i].isInPhom);
    }
  }

  p.moveDraftCard = function (card, fromPlayer) {
    var bai = TWIST.Card.draftCard;
    var self = this;
    var draftCardsPosition = this.draftCards.localToGlobal(0, 0);
    var newX = bai.seperator * this.draftCards.children.length, newY = 0;
    if (this.draftCards.align == "right") {
      newX = 300 - bai.seperator * (this.draftCards.children.length)
    }
    card.set({
      x: card.x - draftCardsPosition.x,
      y: card.y - draftCardsPosition.y
    });
    self.draftCards.addChild(card);

    createjs.Tween.get(card).to({
      x: newX,
      y: newY,
      width: bai.width,
      height: bai.height,
      scaleX: bai.scale,
      scaleY: bai.scale
    }, _animationTime, createjs.Ease.sineOut());
  };

  p.showPhom = function (phoms) {
    var cardsToDrash = [];
    for (var i = 0; i < phoms.length; i++) {
      var phom = phoms[i];
      this.showSinglePhom(phom, i);
    }
    var _self = this;
    setTimeout(function () {
      _self.sortPhomArea();
    }, 550);
  };

  p.addShowPhomArea = function (player) {
    var desk = this.parent.parent.getChildByName('desk');
    var draftPosition = desk.config.draftPositions[this.position];

    var newY = 0;
    var newX = 0;
    if (this.position == 0) {
      newY = draftPosition.y - TWIST.Card.draftCard.height - 10;
      newX = draftPosition.x;
    } else if (this.position == 2) {
      newX = this.hand.x + 37;
      newY = this.hand.y;
    } else {
      newY = draftPosition.y - TWIST.Card.draftCard.height - 10;
      if (this.draftCards.align == "right") {
        newX = this.draftCards.x;
      } else {
        newX = this.draftCards.x;
      }
    }
    this.showPhomArea = new createjs.Container();
    this.showPhomArea.set({
      name: "showPhomArea",
      x: newX,
      y: newY
    });
    this.addChild(this.showPhomArea);
  };

  p.addChipContainer = function (player) {
    var desk = this.parent.parent.getChildByName('desk');
    var chipPosition = desk.chipPosition[this.position];
    this.chipContainer = new createjs.Container();
    this.chipContainer.set({
      name: "chipContainer",
      x: chipPosition.x,
      y: chipPosition.y,
      width: 117,
      height: 42,
      visible: true
    });
    var chipContainerBg = new createjs.Bitmap((TWIST.imagePath || imagePath) + 'player/' + 'money-container.png');
    var chipContainerValue = new createjs.Text("0", '20px Roboto Condensed', 'white');
    chipContainerValue.set({x: 45, y: 30, textAlign: 'center', textBaseline: 'bottom'});
    this.chipContainer.addChild(chipContainerBg, chipContainerValue);
    this.addChild(this.chipContainer);
  };

  p.pushChip = function (type, number, options) {
    var _self = this;
    for (var i = 0; i < number; i++) {
      var chipIcon = new TWIST.Chip(type);
      this.chipContainer.addChild(chipIcon);
      var newX = this.chipContainer.width - chipIcon.width;
      chipIcon.set({
        x: 50 - this.chipContainer.x,
        y: 10 - this.chipContainer.y
      })
      createjs.Tween.get(chipIcon)
              .wait(100 * i)
              .to({x: newX, y: 0}, 200)
              .call(function () {
                var textObject = _self.chipContainer.getChildAt(1);
                var current = isNaN(parseInt(textObject.text)) ? 0 : parseInt(textObject.text);
                textObject.text = current + ChipValues[type];
              });
    }
  };


  p.pushChicken = function (chipArray, options) {
    var _self = this;
    var desk = this.parent.parent.getChildByName('desk');
    var waitTime = 0;
    desk.chickenTotal.visible = true;
    for (var j = 0; j < chipArray.length; j++) {
      _pushChicken(chipArray[j].number, chipArray[j].type)
    }
    function _pushChicken(number, type) {
      for (var i = 0; i < number; i++) {
        var chipIcon = new TWIST.Chip(type);
        desk.chickenTotal.addChild(chipIcon);
        var chickenTotalPosition = desk.chickenTotal.localToGlobal(0, 0);
        var userPosition = _self.localToGlobal(50, 10);
        chipIcon.set({
          x: userPosition.x - chickenTotalPosition.x,
          y: userPosition.y - chickenTotalPosition.y
        });
        createjs.Tween.get(chipIcon)
                .wait(waitTime += 100)
                .to({x: 140, y: 50}, 200)
                .call(function () {
                  desk.chickenTotal.removeChild(this);
                  var textObject = desk.chickenTotal.getChildAt(1);
                  var current = isNaN(parseInt(textObject.value)) ? 0 : parseInt(textObject.value);
                  textObject.value = current + ChipValues[type];
                  textObject.text = "Tổng gà : " + textObject.value;
                });
      }
    }
  };

  p.showSinglePhom = function (cardList, position) {
    var cards = this.getCardsInHand(cardList);
    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      card.visible = true;
      card.cardValue = cardList[i];
      var _self = this;
      var bai = TWIST.Card.draftCard,
              draftCards = this.showPhomArea;

      var newX = bai.seperator * draftCards.children.length,
              newY = 0;
      if (this.draftCards.align == "right") {
        newX = 300 - bai.seperator * draftCards.children.length
      }
      this.showPhomArea.addChild(card);

      card.set({x: card.x + this.hand.x - draftCards.x, y: card.y + this.hand.y - draftCards.y});
      card.removeAllEventListeners();

      createjs.Tween.get(card, {override: true}).to({
        x: newX, y: newY,
        width: bai.width,
        height: bai.height,
        scaleX: bai.scale,
        scaleY: bai.scale
      }, _animationTime, createjs.Ease.sineOut()).call(function () {
        this.isInPhom = false;
        if (_self.position != 0) {
          this.openCard(this.cardValue, bai);
        } else {
          this.setInPhom(false);
        }
      });
    }
    return cards;
  };

  p.addCardInShowPhom = function (card, otherPlayerSend) {
    var _self = this;
    var bai = TWIST.Card.draftCard,
            _self = this,
            oldX = card.x,
            oldY = card.y,
            newX = bai.seperator * this.showPhomArea.children.length,
            newY = 0,
            draftCards = this.showPhomArea;

    if (this.draftCards.align == "right") {
      newX = 300 - bai.seperator * (draftCards.children.length - 1)
    }
    var showPhomGlobal = _self.showPhomArea.localToGlobal(0, 0);
    card.set({
      x: card.x - showPhomGlobal.x,
      y: card.y - showPhomGlobal.y
    });
    _self.showPhomArea.addChild(card);
    card.removeAllEventListeners();
    card.setInPhom(false);
    createjs.Tween.get(card).to({
      x: newX,
      y: newY,
      width: bai.width,
      height: bai.height,
      scaleX: bai.scale,
      scaleY: bai.scale
    }, _animationTime).call(function () {
      if (otherPlayerSend) {
        this.openCard(this.cardValue, bai);
      }
    });
  };

  p.sortPhomArea = function () {
    var cards = this.showPhomArea.children;
    var _self = this;

    var length = cards.length;
    var bai = TWIST.Card.draftCard;
    var seperator = bai.seperator;
    var width = length * seperator;
    var isCurrent = this.isCurrent;
    if (width > 300)
      width = 300;
    var indexLeft = 0;
    if (this.position == 0) {
      indexLeft = (DESK.width - width - (this.showPhomArea.x + this.x) * 2) / 2;
    }

    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      var newX = indexLeft + i * width / length;

      if (this.draftCards.align == "right") {
        newX = 300 - width / length * i;
      }

      createjs.Tween.get(card).to({
        x: newX
      }, 100, createjs.Ease.sineOut()).call(function () {});
    }
    ;
  }

  p.showMoneyExchageEffect = function (money, type, options) {
    var moneyChangeContainer = this.getChildByName('moneyChangeEffect');
    var startY = (options && options.startY) || ((type === "lose") ? 100 : 0);
    var endY = (options && options.endY) || ((type === "lose") ? 0 : 100);
    moneyChangeContainer.set({visible: true, y: startY, alpha: 0.3});
    var moneyChangeBg = moneyChangeContainer.getChildAt(0);
    var moneyChangeText = moneyChangeContainer.getChildAt(1);
    var absMoney = Global.numberWithDot(Math.abs(parseInt(money)));
    if (type === "lose") {
      moneyChangeText.color = "red";
      moneyChangeBg.text = moneyChangeText.text = "- " + absMoney;
    } else {
      moneyChangeText.color = "yellow";
      moneyChangeBg.text = moneyChangeText.text = "+ " + absMoney;
    }
    createjs.Tween.get(moneyChangeContainer).to({y: endY, alpha: 1}, _animationTime + 200).call(function () {
      setTimeout(function () {
        moneyChangeContainer.visible = false;
        moneyChangeText.text = '';
      }, 2000);
    });
  };

  p.setHandCardsValue = function (cardList) {
    var cards = this.handCards.children;
    for (var i = 0; i < cardList.length; i++) {
      var card = cards[i];
      if (card) {
        card.cardValue = cardList[i];
      }
    }
    ;
  };

  p.getHandCardAbsolutePosition = function () {
    return {
      x: this.x + this.hand.x + this.handCards.x,
      y: this.y + this.hand.y + this.handCards.y
    };
  };

  p.rerenderDraftPhom = function (cardList) {
    if (!cardList)
      return;
    var cards = [], bai = TWIST.Card.draftCard;

    for (var i = 0; i < cardList.length; i++) {
      var card = new TWIST.Card(cardList[i]);

      var newX = bai.seperator * i, newY = 0;
      if (this.draftCards.align == "right") {
        newX = 300 - bai.seperator * i
      }
      card.set({
        x: newX,
        y: newY,
        scaleX: bai.scale,
        scaleY: bai.scale
      });
      this.draftCards.addChild(card);
    }
    return cards;
  };

  p.hightLightEatCards = function (cardList) {
    var cards = this.handCards.children;
    for (var i = 0; i < cards.length; i++) {
      if (cardList.indexOf(cards[i].cardValue) > -1)
        cards[i].hightLight();
    }
    var cards = this.showPhomArea.children;
    for (var i = 0; i < cards.length; i++) {
      if (cardList.indexOf(cards[i].cardValue) > -1)
        cards[i].hightLight();
    }
  };

  p.reEatCards = function (cardList) {
    if (!cardList)
      return;
    this.numberEatedCard = 0;
    var cards = [], bai = TWIST.Card.draftCard;

    for (var i = 0; i < cardList.length; i++) {
      var card = new TWIST.Card(cardList[i]);
      var newX = bai.seperator * i, newY = 0;
      if (this.position == 2) {
        newX = 0 - this.hand.x + 100 + bai.seperator * this.numberEatedCard;
        newY = 0;
      } else {
        newY = -TWIST.Card.draftCard.height - 10;
        if (this.draftCards.align == "right") {
          newX = 0 - this.hand.x + this.draftCards.x + 300 - this.numberEatedCard * bai.seperator;
        } else {
          newX = 0 - this.hand.x + this.draftCards.x + bai.seperator * this.numberEatedCard;
        }
      }
      card.set({
        x: newX,
        y: newY,
        scaleX: bai.scale,
        scaleY: bai.scale
      });
      this.numberEatedCard++;
      this.handCards.addChild(card);
    }
    return cards;
  };

  p.showMessage = function (msg) {
    var chat = this.getChildByName('chat'),
//                        textColor = 'rgba(23, 2, 37, 1)',
//                        bgColor = 'rgba(190, 190, 190, 1)',
//                        borderColor = 'rgba(23, 2, 37, 1)',
            textColor = 'rgba(255, 255, 0, 1)',
            bgColor = 'rgba(0, 0, 0, 1)',
            borderColor = 'rgba(0, 0, 0, 1)',
            chatText,
            chatBg,
            textPosition = {};

    chatBg = chat.getChildAt(0);
    chatText = chat.getChildAt(1);

    chatBg.graphics.c();
    chatText.set({color: textColor, text: msg});

    textPosition.x = chatText.getMeasuredWidth();
    textPosition.y = chatText.getMeasuredHeight();

    if (msg && msg.length > 28) {
      var positionSplit = msg.indexOf(' ', 25);
      if (positionSplit < 25 || positionSplit > 35)
        positionSplit = 28;
      msg = msg.substring(0, positionSplit) + '\n' + msg.substring(positionSplit);
      chatText.text = msg;

      var tempText = chatText.clone();
      tempText.text = msg.substring(0, positionSplit);
      textPosition.x = tempText.getMeasuredWidth();
      textPosition.y = chatText.getMeasuredHeight();
    }

    chatText.set({x: textPosition.x / 2, y: (textPosition.y + 10) / 5 + 18});
    chatBg.graphics.beginFill(bgColor).beginStroke(borderColor).setStrokeStyle(1).drawRoundRect(-10, -10, textPosition.x + 20, textPosition.y + 20, 20);

    var x = this.hand.x < 0 ? -(textPosition.x + 20) : 120,
            y = 0;
    chat.set({x: x, y: y, visible: true});

    createjs.Tween.get(chat).to({alpha: 1}, _animationTime)
            .to({x: x + 1, y: y + 1}, 100).to({x: x - 1, y: y - 2}, 100)
            .to({x: x + 1, y: y + 1}, 100).to({x: x - 1, y: y - 2}, 100)
            .to({x: x + 1, y: y + 1}, 100).to({x: x - 1, y: y - 2}, 100)
            .wait(3500).to({alpha: 0, visible: false}, 500);
  }

  TWIST.Player = Player;

})();