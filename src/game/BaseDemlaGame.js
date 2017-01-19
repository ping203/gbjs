this.TWIST = this.TWIST || {};

(function () {
  "use strict";

  function BaseDemlaGame(wrapper, options) {}

  var p = BaseDemlaGame.prototype = new TWIST.InRoomGame();

  p.initBaseDemlaGame = function (wrapper) {
    TWIST.Card.RankMapIndex = ["3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "1", "2"];
    this.initInRoomGame();
    this.pushTLMNDemlaEvent();
    this.bindButton();
    this.addCheater();
  };

  p.pushTLMNDemlaEvent = function () {

    this.on("endTurn", this.onEndTurn);

    this.on("foldTurn", this.foldTurn);
  };

  p.handCardSelected = function (card) {
    return;
    var lastDraftCard = this.desk.lastDraftCards;
    if (card && lastDraftCard && lastDraftCard.length) {
      var result = TWIST.TLMNLogic(lastDraftCard, card).getCards();
      if (result.length > 0)
        card.removeAllSelected();
      result.forEach(function (item, index) {
        item.setSelected(true);
      });
    }
  };

  p.drawPlayingState = function (data) {
    this._STATUS_PLAYING(); 
    var players = data.players || [];
    var _self = this;

    var playingPlayer = data.playingPlayer;
    var PlayingPlayer = this.getPlayerByUuid(playingPlayer.uuid);
    if (PlayingPlayer) {
      PlayingPlayer.setRemainingTime(playingPlayer.remainingTime, this.model.turningTime);
      if (PlayingPlayer.uuid === this.userInfo.uuid) {
        this.hitButton.show();
        this.foldTurnButton.show();
      }
    }

    if (data.lastDraftCards) {
      this.desk.lastDraftCards = data.lastDraftCards;
      this.desk.createLastDraftCards(data.lastDraftCards);
    }

    players.forEach(function (item, index) {
      var handCards = [];

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
      } else {
        handCards.length = item.numberCardsInHand;
      }
      var Player = _self.getPlayerByUuid(item.uuid);
      if (Player) {
        Player.handCards.cardList = handCards;
        Player.renderCards({
          dragable: true
        });
      }
    });

  };

  p.dealCards = function (data) {
    this._STATUS_PLAYING();
    var cardList = data.cardList;
    var players = this.model.players;
    var numberPlayer = 0;
    players.forEach(function (item, index) {
      if (item.status === "STATUS_PLAYING") {
        numberPlayer++;
      }
    });
    var numberCards = numberPlayer * this.options.numberCardsInHand;
    var _self = this;

    this.desk.generateCards(numberCards);

    players.forEach(function (item, index) {
      var handCards = [];
      if (item.status !== "STATUS_PLAYING")
        return;
      if (item.uuid === _self.userInfo.uuid) {
        handCards = cardList;
        handCards.sort(function (a, b) {
          return a - b;
        });
      }

      var Player = _self.getPlayerByUuid(item.uuid);
      if (Player) {
        handCards.length = handCards.length || _self.options.numberCardsInHand;
        Player.handCards.cardList = handCards;
        Player.renderCards({
          showPlayerCard: true,
          dragable: true
        });
      }

    });

  };

  p.STATUS_PLAYING = function () {};

  p._STATUS_PLAYING = function () {
    TWIST.InRoomGame.prototype.STATUS_PLAYING.call(this);
  };

  p.onHitTurn = function (data) {
    this._hasNewTurn = data._hasNewTurn;
    var currentUuid = data.uuid;
    var currentPlayer = this.getCurrentPlayer();
    if (currentPlayer.handCards.children.length > 0) {
      this.sortCardButton.show();
    }
    this.setPlayerTurn(data.uuid);

    if (data.uuid === this.userInfo.uuid) {
      this.hitButton.show();
      if (!data._hideFoldButton) {
        this.foldTurnButton.show();
      }
    } else {
      this.hitButton.hide();
      this.foldTurnButton.hide();
    }
  };

  p.onNotifyOne = function (data) {
    var player = this.getPlayerByUuid(data.uuid);
    player.setPlayerStatus("Báo 1 !", {
      default: "Báo 1 !"
    });
  };

  p.foldTurn = function (data) {
    var Player = this.getPlayerByUuid(data.uuid);
    if (Player) {
      Player.clearTimer();
      if (!this._hasNewTurn)
        Player.setPlayerStatus("Bỏ lượt !");
      if (data.uuid === this.userInfo.uuid) {
        this.hitButton.hide();
        this.foldTurnButton.hide();
      }
    }
  };

  p.onDraftCards = function (data) {
    TWIST.Sound.play('danh_bai');
    var cards = data.cardList;
    var userID = data.uuid;
    this.desk.lastDraftCards = data.cardList;
    var Player = this.getPlayerByUuid(userID);
    if (!Player) {
      this.showError({code: 0});
      return;
    }
    if (userID === this.userInfo.uuid) {
      this.hitButton.hide();
      this.foldTurnButton.hide();
    }
    this.desk.removeOverlayCards();
    this.desk.setZeroVetical();
    this.desk.overlayDraftCards();
    var cardType = TWIST.Card.demlaDraftCard;
    var position = {};
    position.x = (TWIST.Desk.width - cardType.seperator * cards.length) / 2 - TWIST.Desk.draftPosition.x;
    position.y = cardType.height * 0.8;
    Player.draftCardsInHand(cards, {
      cardType: TWIST.Card.demlaDraftCard,
      draftCards: this.desk.draftCards,
      position: position,
      rotateAble: true
    });
  };

  p.onEndTurn = function (data) {
    data._hasNewTurn = true;
    data._hideFoldButton = true;
    this.resetPlayerStatus();
    this.desk.lastDraftCards = undefined;
    this.desk.clear();
    this.hitButton.hide();
    this.foldTurnButton.hide();
    this.onHitTurn(data);
  };

  p.bindButton = function () {
    var _self = this;

    this.startButton.unbind('click');
    this.startButton.click(function () {
      var listCheatCard = _self.getListCheatCard();
      _self.emit("start", {
        listCheatCard : listCheatCard,
        showPlayerCards : $('#showPlayerCards').prop('checked')
      });
    });

    this.hitButton = $(TWIST.HTMLTemplate['buttonBar/hitButton']);
    this.buttonBar.append(this.hitButton);
    this.hitButton.unbind('click');
    this.hitButton.click(function () {
      var Player = _self.getCurrentPlayer();
      var cards = Player.getSelectedCards();
      if (cards.length === 0) {
        _self.showError({
          code: 1470
        });
        return;
      }
      _self.emit('hitCards', {
        cards: cards
      });
    });

    this.sortCardButton = $(TWIST.HTMLTemplate['buttonBar/sortCardButton']);
    this.buttonBar.append(this.sortCardButton);
    this.sortCardButton.unbind('click');
    this.sortCardButton.click(function () {
      var Player = _self.getCurrentPlayer();
      Player.sortTL();
    });

    this.foldTurnButton = $(TWIST.HTMLTemplate['buttonBar/foldTurnButton']);
    this.buttonBar.append(this.foldTurnButton);
    this.foldTurnButton.unbind('click');
    this.foldTurnButton.click(function () {
      _self.emit('userFold');
    });
  };
  
  p.STATUS_ENDING = function () {
    this.buttonBar.hide();
    this.errorPanel.empty();
    this.desk.lastDraftCards = undefined;
    this.setPlayerTurn();
  };

  p.endDemlaGame = function (data, winTypeMap, nomalWinType) {
    var _self = this;
    var resultData = {
      isWinner: false,
      listPlayers: []
    };
    resultData.listPlayers = data.listPlayers;
    for (var i = 0, length = resultData.listPlayers.length; i < length; i++) {
      var player = resultData.listPlayers[i];
      var cardList = player.remainCards;
      cardList.sort(function (a, b) {
        return a - b;
      });
      player.gameResultString = winTypeMap[player.winType];
      if (parseInt(player.changeMoney) < 0) {
        player.gameResultString = player.gameResultString || ("Thua " + (nomalWinType ? cardList.length + " lá!" : " !"));
      } else if (parseInt(player.changeMoney) > 0) {
        if (player.uuid === this.userInfo.uuid) {
          resultData.isWinner = true;
        }
        player.isWinner = true;
        player.gameResultString = player.gameResultString || winTypeMap[data.winType] || "Thắng";
      } else {
        player.gameResultString = player.gameResultString || "Hòa";
      }
      var Player = this.getPlayerByUuid(player.uuid);
      if (Player) {
        Player.clearTimer();
        Player.setMoney(player.money);
        Player.showMoneyExchageEffect(player.changeMoney, parseInt(player.changeMoney) > 0 ? "win" : "lose");
      }
    }
    setTimeout(function () {
      _self.showResult(resultData);
    }, 2000);
  };

  TWIST.BaseDemlaGame = BaseDemlaGame;

})();
