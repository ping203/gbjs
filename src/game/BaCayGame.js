this.TWIST = this.TWIST || {};

(function () {
  "use strict";

  var initOptions = {
    maxPlayers: 6,
    numberCardsInHand: 3,
    turnTime: 20000,
    numberCardsRender: 3,
    renderCardOptions: {
      showPlayerCard: true,
      sideDown: true,
      clickOpen: true
    }
  };
  function BaCayGame(wrapper, options) {
    this.wrapper = $(wrapper);
    this.options = $.extend(initOptions, options);
    this.initPhomGame();
  }

  var p = BaCayGame.prototype = new TWIST.InRoomGame();

  p.initPhomGame = function (wrapper) {
    TWIST.Card.RankMapIndex = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"];
    this.initInRoomGame();
    this.bindButton();
    this.pushBacayEvent();
  };

  p.pushBacayEvent = function () {

    this.on('playerOpen', function (data) {
      this.player(data);
    });
  };

  p.drawPlayingState = function (data) {
    var players = data.players || [];
    var _self = this;

    var playingPlayer = data.playingPlayer;
    var PlayingPlayer = this.getPlayerByUuid(playingPlayer.uuid);
    if (PlayingPlayer) {
      PlayingPlayer.setRemainingTime(playingPlayer.remainingTime, this.model.turningTime);
      if (PlayingPlayer.uuid === this.userInfo.uuid) {
        this.hitButton.show();
      }
    }
    this.desk.generateCards(52, TWIST.Card.userCard);

    players.forEach(function (item, index) {
      var handCards = [];
      var listPhom = [];

      if (item.uuid === _self.userInfo.uuid) {
        handCards = data.userListCard || [];
        handCards.sort(function (a, b) {
          return a - b;
        });
        if (handCards.length > 0) {
          _self.sortCardButton.show();
        } else {
          _self.showError({
            message: "Ván chơi đang diễn ra !"
          });
        }
        listPhom = data.listPhom;
      } else {
        handCards.length = item.numberCardsInHand || initOptions.numberCardsInHand;
      }
      var Player = _self.getPlayerByUuid(item.uuid);
      if (Player) {
        Player.handCards.cardList = handCards;
        Player.listPhom = listPhom;
        Player.renderCards(initOptions.renderCardOptions);
        if (Player.position != 0) {
          Player.reEatCards(item.eatedCards);
        }
        Player.rerenderDraftPhom(item.drarfCards);
        item.listPhom && item.listPhom.forEach(function (phom, _index) {
          Player.showSinglePhom(phom);
          (function (Player) {
            setTimeout(function () {
              Player.sortPhomArea();
            }, 550);
          })(Player);
        });
        if (item.eatedCards) {
          Player.hightLightEatCards(item.eatedCards);
        }
      }
    });
    this.desk.showRemainingDeckCard(data.deckCardRemain);
  };

  p.dealCards = function (data) {
    var cardList = data.cardList;
    var players = this.model.players;
    var numberCards = this.options.maxPlayers * this.options.numberCardsRender;
    var _self = this;

    this.desk.generateCards(numberCards, TWIST.Card.playerCard);

    players.forEach(function (item, index) {
      var handCards = [];
      if (item.status !== "STATUS_PLAYING")
        return;
      if (item.uuid === _self.userInfo.uuid && cardList) {
        handCards = cardList || [];
      }

      var Player = _self.getPlayerByUuid(item.uuid);
      if (Player) {
        handCards.length = handCards.length || _self.options.numberCardsInHand;
        Player.handCards.cardList = handCards;
        Player.renderCards(initOptions.renderCardOptions);
      }
    });
    this.desk.showRemainingDeckCard(data.deckCardRemain);
  };

  p.bindButton = function () {
    var _self = this;

    this.openCardButton = $(TWIST.HTMLTemplate['buttonBar/openCardButton']);
    this.buttonBar.append(this.openCardButton);
    this.openCardButton.unbind('click');
    this.openCardButton.click(function () {
      _self.emit("openCard");
      _self.openCardButton.hide();
    });
  };

  p.handCardSelected = function (card) {

  };

  p.STATUS_ENDING = function () {
    this.buttonBar.hide();
    this.errorPanel.empty();
  };

  p.STATUS_PLAYING = function () {
    TWIST.InRoomGame.prototype.STATUS_PLAYING.call(this);
    this.playersContainer.children.forEach(function (item, index) {
      if (!item)
        return;
      item.clearHand();
      item.setPlayerStatus("");
    });
  };

  p.endGame = function (data) {
    var _self = this;
    var listPlayers = data.listPlayers;
    listPlayers.forEach(function (item, index) {
      var player = _self.getPlayerByUuid(item);

      if (player) {
        player.setHandCardsValue(item.handCards);
        player.showThreeCards();
        player.setMoney(item.money);
        var resultText = _self.getResultTextThreeCards(item.handCards, item.rankOfHands);
        player.showMoneyExchageEffect(item.moneyExchange, parseInt(item.moneyExchange) > 0 ? "win" : "lose");
        player.setPlayerStatus(item.resultText, {x: 180, y: -70, color: "Greenyellow", font: 'bold 40px Roboto Condensed'});
      }
    });
  };


  TWIST.BaCayGame = BaCayGame;

})();