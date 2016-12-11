this.TWIST = this.TWIST || {};

(function () {
  "use strict";
  var imagePath, CONFIG;
  var imagePath = location.origin + location.pathname + '../src/images/';

  function Desk(gameType) {
    this.initialize(gameType);
  }

  Desk.playerPositions = {
    4: [{x: 12, y: 560}, {x: 1110, y: 275}, {x: 590, y: 54}, {x: 71, y: 275}],
    2: [{x: 12, y: 560}, {x: 590, y: 54}],
    5: [{x: 12, y: 560}, {x: 1110, y: 275}, {x: 783, y: 54}, {x: 383, y: 54}, {x: 71, y: 275}],
    9: [{x: 380, y: 550}, {x: 970, y: 540}, {x: 1090, y: 320}, {x: 1000, y: 140}, {x: 783, y: 67}, {x: 383, y: 67}, {x: 170, y: 140}, {x: 70, y: 320}, {x: 160, y: 540}],
    6: [{x: 550, y: 550}, {x: 970, y: 540}, {x: 1090, y: 320}, {x: 783, y: 67}, {x: 70, y: 320}, {x: 160, y: 540}]
  };

  Desk.handPositions = {
    center: {x: 150, y: -110, align: 'center'},
    left: {x: -50, y: 20, align: 'left'},
    right: {x: 150, y: -110, align: 'center'}
  };

  Desk.draftPositionList = {
//        4: [{x: 300, y: -70}, {x: -350, y: TWIST.Card.draftCard.height},
//            {x: 50, y: TWIST.Card.draftCard.height}, {x: 50, y: TWIST.Card.draftCard.height}]
  };

  var p = Desk.prototype = new createjs.Container();
  p.container_initialize = p.initialize;


  Desk.width = 1280;
  Desk.height = 720;

  // vi tri gua ban
  Desk.position = {x: Desk.width / 2, y: Desk.height / 2};

  Desk.draftPosition = {x: Desk.width / 2, y: Desk.height / 4, rotateDeg: 0};

  p.initialize = function (gameType) {
    this.container_initialize();
    var _self = this;
    this.gameType = gameType || {};
    this.config = {};
    this.initPosition(gameType);

    var deckCard = this.createDeckCard();
    var remainingTime = this.createRemainingTime();
    var remainingCard = this.createRemainingCard();
    var draftCards = this.createDraftCards();
    this.addChild(deckCard, draftCards, remainingTime, remainingCard);

  };

  p.createDeckCard = function () {
    this.deckCard = new createjs.Container();
    this.deckCard.set({
      x: Desk.position.x,
      y: Desk.position.y,
      visible: false
    });
    return this.deckCard;
  };

  p.createRemainingTime = function () {
    this.remainingTimeText = new createjs.Text('', 'bold 50px Roboto Condensed', 'white');
    this.remainingTimeText.set({
      x: Desk.position.x,
      y: Desk.position.y,
      visible: false,
      textAlign: "center",
      textBaseLine: "top"
    });
    return this.remainingTimeText;
  };

  p.createRemainingCard = function () {
    this.remainingCard = new createjs.Text('', 'bold 30px Roboto Condensed', 'greenyellow');
    this.remainingCard.set({
      x: Desk.position.x,
      y: Desk.position.y,
      textAlign: "center",
      textBaseline: 'middle'
    });
    return this.remainingCard;
  };

  p.showRemainingDeckCard = function (value) {
    var _value;
    if (typeof value === "undefined") {
      var _value = this.deckCard.children.length;
    } else {
      this.deckCard.children.length = _value = value;
    }
    this.remainingCard.text = _value || "";
  };

  p.createDraftCards = function () {
    this.draftCards = new createjs.Container();
    this.draftCards.set({
      x: Desk.draftPosition.x,
      y: Desk.draftPosition.y
    });
    return this.draftCards;
  };

  p.initPosition = function (gameType) {
    var maxPlayers = gameType.maxPlayers || 4;

    var playerPosition = new Array(maxPlayers);
    var handPosition = new Array(maxPlayers);
    var draftPosition = new Array(maxPlayers);

    for (var i = 0; i < maxPlayers; i++) {
      handPosition[i] = {
        x: 63,
        y: 30,
        align: 'left'
      };
      draftPosition[i] = {x: handPosition[i].x + TWIST.Card.draftCard.width * 1.5, y: handPosition[i].y};
    }

    playerPosition = Desk.playerPositions[maxPlayers];
//        draftPosition = Desk.draftPosition[maxPlayers] || [];
    handPosition[0] = {x: 150, y: -50, align: 'center'};

    if (maxPlayers === 4) {
      handPosition[1] = {x: 6, y: 30, align: 'center'};
      draftPosition[0] = {
        x: (Desk.width / 2 - TWIST.Card.draftCard.width * 2) - playerPosition[0].x,
        y: -100,
        align: 'left'
      };
      draftPosition[1].x = -340;
      draftPosition[1].align = 'right';
      draftPosition[2] = {
        x: (Desk.width / 2 - TWIST.Card.draftCard.width * 2) - playerPosition[2].x,
        y: 120,
        align: 'left'
      };
    }


    this.config.playerPositions = playerPosition;
    this.config.handPositions = handPosition;
    this.config.draftPositions = draftPosition;
  };

  p.generateCards = function (numberCards, cardType) {
    var currentCards = this.deckCard.children.length;
    var numberCardAdd = numberCards - currentCards;
    cardType = cardType || TWIST.Card.playerCard;
    var scale = cardType.scale;
    console.log("cardType", cardType, this.deckCard);
    if (numberCardAdd > 0) {
      for (var i = 0; i < numberCardAdd; i++) {
        var cardImage = new TWIST.Card();
        cardImage.set({
          scaleX: scale,
          scaleY: scale,
          x: -cardType.width / 2,
          y: -cardType.height / 2
        });
        this.deckCard.addChild(cardImage);
      }
    } else {
      this.deckCard.children.splice(0, -numberCardAdd);
    }
    this.deckCard.visible = true;
  };


  p.createLastDraftCards = function (cardList, cardType) {
    var draftCards = this.draftCards;
    var cardType = cardType || TWIST.Card.demlaDraftCard;
    cardList.forEach(function (item, index) {
      var card = new TWIST.Card(item);
      card.set({
        x: (index - cardList.length * 0.5) * cardType.seperator,
        y: cardType.height * 0.8,
        rotation: (Math.random() - 0.5) * 30,
        scaleX: cardType.scale,
        scaleY: cardType.scale
      });
      draftCards.addChild(card);
    });
  };

  p.scaleDeckCard = function (numberPlayer) {
    var deckCardList = this.deckCard.children;
    for (var i = 0; i < deckCardList.length; i++) {
      var card = deckCardList[i];
      card.set({
        scaleX: 0.3,
        scaleY: 0.3
      });
    }
  };

  p.renderDraftCards = function (cards) {
    for (var i = 0; i < cards.length; i++) {
      var cardImage = new TWIST.Card(cards[i]);

      var newX = TWIST.Card.baiDraft.seperator * i,
              newY = 0;
      cardImage.set({
        x: newX,
        y: newY,
        scaleX: TWIST.Card.baiDraft.width / TWIST.Card.image.width,
        scaleY: TWIST.Card.baiDraft.height / TWIST.Card.image.height
      });
      TWIST.Card.addChild(cardImage);
    }
  };

  p.getCard = function () {
    var card;
    card = this.deckCard.children.pop();
    if (card)
      card.set({x: this.deckCard.x, y: this.deckCard.y});

    return card;
  };

  p.setRemainingTime = function (time, options) {
    var _self = this;
    var miliseconTime = time > 100 ? time : time * 1000;
    var startTime = new Date().getTime();
    var miliseconTimeText = this.remainingTimeText;
    $.extend(miliseconTimeText, options);
    miliseconTimeText.visible = true;
    if (miliseconTime >= 0) {
      this.remainingTimeTween && this.remainingTimeTween.removeAllEventListeners();
      miliseconTimeText.text = "";

      this.remainingTimeTween = createjs.Tween.get(miliseconTimeText, {override: true})
              .to({}, miliseconTime, createjs.Ease.linear)
              .call(function () {
                _self.remainingTimeTween.removeAllEventListeners();
                miliseconTimeText.text = "";
              });
      this.remainingTimeTween.addEventListener("change", function () {
        var currentTime = new Date().getTime();
        var text = "";
        var deviationTime = miliseconTime - (currentTime - startTime);
        if (deviationTime > 0) {
          text = Math.floor(deviationTime / 1000);
        }
        miliseconTimeText.text = text;
      });
    } else {
      this.remainingTimeTween && this.remainingTimeTween.removeAllEventListeners();
      miliseconTimeText.text = "";
    }
    var _self = this;
  };


  p.clearRemainingTime = function () {
    if (this.remainingTimeTween) {
      this.remainingTimeTween.removeAllEventListeners();
    }
    this.remainingTime.text = "";
  };

  p.clear = function () {
    this.deckCard.removeAllChildren();
    this.draftCards.removeAllChildren();
    this.deckCard.visible = false;
    this.remainingCard.text = '';
  };

  p.tipOff = function () {
    var draftCardList = this.draftCards.children;
    for (var i = 0; i < draftCardList.length; i++) {
      if (draftCardList[i].cardValue > -1) {
        draftCardList[i].tipOff();
      }
    }
  };

  p.overlayDraftCards = function () {
    var draftCardList = this.draftCards.children;
    for (var i = 0; i < draftCardList.length; i++) {
      if (draftCardList[i].cardValue > -1) {
        draftCardList[i].Overlay();
      }
    }
  };

  p.removeOverlayCards = function () {
    var draftCardList = this.draftCards.children;

    for (var i = 0, length = draftCardList.length; i < length; i++) {
      if (draftCardList[i] && draftCardList[i].isOverlay) {
        draftCardList.splice(i, 1)
        i--;
      }
    }
  };

  p.setZeroVetical = function () {
    var draftCard = this.draftCard;
    var draftCardList = this.draftCards.children;
    draftCardList.forEach(function (item, index) {
      item.moveTo(item.x, 0);
    });
  };

  p.createTimer = function (config) {
    this.timer = new TWIST.Timer(config);
    this.addChild(this.timer);
  };

  p.setCicleTime = function (remainingTime, totalTime) {
    remainingTime = remainingTime || 30000;
    if (remainingTime < 50)
      remainingTime *= 1000;
    totalTime = totalTime || 30000;
    if (totalTime < 50)
      totalTime *= 1000;
    this.timer.startTimer(totalTime, remainingTime);
  };

  p.clearTimer = function (remainingTime, totalTime) {
    this.timer.clearTimer();
  };

  TWIST.Desk = Desk;
})();
