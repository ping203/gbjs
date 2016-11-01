this.TWIST = this.TWIST || {};

(function () {
  "use strict";

  var initOptions = {
    maxPlayers: 4,
    numberCardsInHand: 9,
    turnTime: 20000,
    numberCardsRender: 13,
    renderCardOptions: {
      showPlayerCard: true,
      dragable: true
    }
  };
  function PhomGame(wrapper, options) {
    this.wrapper = $(wrapper);
    this.options = $.extend(initOptions, options);
    this.initPhomGame();
  }

  var p = PhomGame.prototype = new TWIST.InRoomGame();

  p.initPhomGame = function (wrapper) {
    TWIST.Card.RankMapIndex = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"];
    this.initInRoomGame();
    this.bindButton();
    this.pushPhomEvent();
  };

  p.pushPhomEvent = function () {

    this.on('getTurn', function (data) {
      this.onGetTurn(data);
    });

    this.on('getCardComplete', function (data) {
      this.getCardComplete(data);
    });

    this.on('enableEatCard', function (data) {
      this.enableEatCard(data);
    });

    this.on('enableU', function (data) {
      this.enableU(data);
    });

    this.on('enableShowPhom', function (data) {
      this.enableShowPhom(data);
    });

    this.on('enableSendCard', function (data) {
      this.enableSendCard(data);
    });

    this.on('eatCardSuccess', function (data) {
      this.eatCardSuccess(data);
    });

    this.on('moveDraftCard', function (data) {
      this.moveDraftCard(data);
    });

    this.on('showPhomComplete', function (data) {
      this.showPhom(data);
    });

    this.on('sendCardComplete', function (data) {
      this.sendCard(data);
    });

    this.on('entiretyCard', function (data) {
      this.entiretyCard(data);
    });

    this.on('setRemainCards', function (data) {
      this.setRemainCards(data);
    });
  };

  p.onGetTurn = function (data) {
    var currentUuid = data.uuid;
    var currentPlayer = this.getCurrentPlayer();
    if (currentPlayer.handCards.children.length > 0) {
      this.sortCardButton.show();
    }
    this.hitButton.hide();
    if (data.uuid === this.userInfo.uuid) {
      this.getCardButton.show();
    }
    this.setPlayerTurn(data.uuid, data.remainingTime);
  };

  p.onHitTurn = function (data) {
    var currentUuid = data.uuid;
    var currentPlayer = this.getCurrentPlayer();
    if (currentPlayer.handCards.children.length > 0) {
      this.sortCardButton.show();
    }
    this.getCardButton.hide();
    this.eatCardButton.hide();
    if (data.uuid === this.userInfo.uuid) {
      this.hitButton.show();
    }else{
      this.hitButton.hide();
    }
    this.setPlayerTurn(data.uuid, data.remainingTime);
  };

  p.getCardComplete = function (data) {
    this.getCardButton.hide();
    var card = data.cardIndex;
    var userID = data.uuid;
    var listPhom = data.listPhom;
    var player = this.getPlayerByUuid(userID);
    player.listPhom = listPhom;
    player.getDeckCard(card, listPhom);
    this.desk.showRemainingDeckCard(data.deckCardRemain);
  };

  p.enableEatCard = function () {
    this.eatCardButton.show();
  };

  p.enableU = function () {
    this.entiretyButton.show();
  };

  p.enableShowPhom = function (data) {
    var _self = this;
    var player = this.getCurrentPlayer();
    player.handCards.sortType = "suiteSort";
    player.sortPhom(data['listCard']);
    setTimeout(function () {
      player.preparedShowPhom(data['listCard']);
      _self.showPhomButton.show();
    }, 500);
  };

  p.enableSendCard = function (data) {
    var _self = this;
    var player = this.getCurrentPlayer();
    player.preparedSendCard(data['listCard']);
    setTimeout(function () {
      _self.sendCardButton.show();
    }, 500);
  };

  p.eatCardSuccess = function (data) {
    this.eatCardButton.hide();
    var hitPlayer = this.getPlayerByUuid(data.hitPlayer);
    var eatPlayer = this.getPlayerByUuid(data.eatPlayer);
    var player = this.getCurrentPlayer()
    if (eatPlayer) {
      var card;
      if (!hitPlayer) {
        card = new TWIST.Card(parseInt(data.cardIndex));
      } else {
        card = hitPlayer.getLastDraftCards(data.cardIndex);
      }
      eatPlayer.listPhom = data.listPhom;
      eatPlayer.eatCard(card);
      //this.desk.affterEatCard = true; // ????
    }
  };

  p.moveDraftCard = function (data) {
    var fromPlayer = this.getPlayerByUuid(data.fromPlayer);
    var toPlayer = this.getPlayerByUuid(data.toPlayer);
    if (fromPlayer && toPlayer) {
      var card = fromPlayer.getLastDraftCards(data.cardIndex);
      toPlayer.moveDraftCard(card, fromPlayer);
    }
  };

  p.onDraftCards = function (data) {
    TWIST.Sound.play('danh_bai');
    this.hitButton.hide();
    this.sendCardButton.hide();
    this.showPhomButton.hide();
    this.entiretyButton.hide();
    var cards = [data.cardIndex];
    var userID = data.uuid;
    var player = this.getPlayerByUuid(userID);
    player.listPhom = data.listPhom || player.listPhom;
    player.draftCardsInHand(cards);
    player.markEatedCard();
    this.desk.lastActivePlayer = data.uuid;
    this.desk.lastDraftCard = cards;
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

    this.desk.generateCards(numberCards, TWIST.Card.userCard);

    players.forEach(function (item, index) {
      var handCards = [];
      if (item.status !== "STATUS_PLAYING")
        return;
      if (item.uuid === _self.userInfo.uuid && cardList) {
        handCards = cardList || [];
        handCards.sort(function (a, b) {
          return a - b;
        });
      }

      if (data.firstPlayer && data.firstPlayer.uuid && item.uuid == data.firstPlayer.uuid) {
        handCards.length = _self.options.numberCardsInHand + 1;
      }

      var Player = _self.getPlayerByUuid(item.uuid);
      if (Player) {
        handCards.length = handCards.length || _self.options.numberCardsInHand;
        if (Player.position == 0) {
          Player.listPhom = data.listPhom
        }
        Player.handCards.cardList = handCards;
        Player.renderCards(initOptions.renderCardOptions);
      }
    });
    this.desk.showRemainingDeckCard(data.deckCardRemain);
  };

  p.setPlayerTurn = function (uuid, remainingTime) {
    var totalTime = this.model.turningTime;
    var players = this.playersContainer.children;
    for (var i = 0, length = players.length; i < length; i++) {
      var player = players[i];
      if (player) {
        if (player.uuid === uuid) {
          player.setRemainingTime(remainingTime, totalTime);
        } else {
          player.clearTimer();
        }
      }
    }
  };

  p.bindButton = function () {
    var _self = this;

    this.startButton.unbind('click');
    this.startButton.click(function () {
      _self.emit("start", _self.model.players);
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
      Player.sortPhom();
      Player.sortCard();
    });

    this.getCardButton = $(TWIST.HTMLTemplate['buttonBar/getCardButton']);
    this.buttonBar.append(this.getCardButton);
    this.getCardButton.unbind('click');
    this.getCardButton.click(function () {
      _self.emit('getCard');
    });

    this.eatCardButton = $(TWIST.HTMLTemplate['buttonBar/eatCardButton']);
    this.buttonBar.append(this.eatCardButton);
    this.eatCardButton.unbind('click');
    this.eatCardButton.click(function () {
      _self.emit('eatCard');
    });

    this.entiretyButton = $(TWIST.HTMLTemplate['buttonBar/entiretyButton']);
    this.buttonBar.append(this.entiretyButton);
    this.entiretyButton.unbind('click');
    this.entiretyButton.click(function () {
      _self.emit('entirety');
    });

    this.sendCardButton = $(TWIST.HTMLTemplate['buttonBar/sendCardButton']);
    this.buttonBar.append(this.sendCardButton);
    this.sendCardButton.unbind('click');
    this.sendCardButton.click(function () {
      var Player = _self.getCurrentPlayer();
      var cards = Player.getSelectedCards();
      if (cards.length === 0) {
        _self.showError({
          code: 1470
        });
        return;
      }
      _self.emit('sendCard', {
        cards: cards
      });
    });

    this.showPhomButton = $(TWIST.HTMLTemplate['buttonBar/showPhomButton']);
    this.buttonBar.append(this.showPhomButton);
    this.showPhomButton.unbind('click');
    this.showPhomButton.click(function () {
      var Player = _self.getCurrentPlayer();
      var cards = Player.getSelectedCards();
      if (cards.length === 0) {
        _self.showError({
          code: 1470
        });
        return;
      }
      _self.emit('showPhom', {
        cards: cards
      });
    });

  };

  p.handCardSelected = function (card) {

  };

  p.STATUS_ENDING = function () {
    this.buttonBar.hide();
    this.errorPanel.empty();
    this.desk.lastDraftCards = undefined;
    this.setPlayerTurn();
  };

  p.showPhom = function (data) {
    var phoms = data.phoms;
    var userID = data.uuid;
    var player = this.getPlayerByUuid(userID);
    player.showPhom(phoms);
    if (player.position == 0) {
      player.sortCard();
    }
    this.showPhomButton.hide();
  };

  p.drawPlayer = function (playerData) {
    var newPlayer = TWIST.InRoomGame.prototype.drawPlayer.call(this, playerData);
    newPlayer.addShowPhomArea();
  };

  p.sendCard = function (data) {
    var cardsSend = data.cardsSend;
    var sendPlayer = this.getPlayerByUuid(data.cardsSend[0].transFrom);
    var otherPlayerSend = (sendPlayer.position != 0);
    for (var i = 0; i < cardsSend.length; i++) {
      var dataItem = cardsSend[i];
      var receivePlayer = this.getPlayerByUuid(dataItem.transTo);
      if (receivePlayer && sendPlayer) {
        var cardList = sendPlayer.getCardsInHand(dataItem.cardList);
        cardList.forEach(function (card, index) {
          card.set({
            x: card.x + sendPlayer.x + sendPlayer.hand.x,
            y: card.y + sendPlayer.y + sendPlayer.hand.y
          });
          card.cardValue = dataItem.cardList[index];
          receivePlayer.addCardInShowPhom(card, otherPlayerSend);
        });
      }
    }
    this.playersContainer.children.forEach(function (item, index) {
      setTimeout(function () {
        item.sortPhomArea();
      }, 700);
    });
    if (sendPlayer.position == 0) {
      sendPlayer.sortCard();
    }
    this.sendCardButton.hide();
  };

  p.entiretyCard = function (data) {
    var phoms = data.phoms;
    var userID = data.uuid;
    var player = this.getPlayerByUuid(userID);
    player.showPhom(phoms);
    player.setPlayerStatus("Ù");
    this.buttonBar.children().hide();
    var _self = this;
    setTimeout(function () {
      player.sortPhomArea();
    }, 550);
  };

  p.setRemainCards = function (data) {
    var remainCards = data.remainCards;
    this.desk.showRemainingDeckCard(data.remainCards);
  };

  p.STATUS_PLAYING = function () {
    TWIST.InRoomGame.prototype.STATUS_PLAYING.call(this);
    this.playersContainer.children.forEach(function (item, index) {
      if (!item)
        return;
      item.clearDraftCards();
      item.clearHand();
      item.clearShowPhomArea();
      item.setPlayerStatus("");
      item.numberEatedCard = 0;
    });
  };

  p.endGame = function (data, result, nomalWinType) {

    function convertRemainCards(item) {
      return item > 7 ? item - 8 : item + 44;
    }

    var winTypeMap = {
      0: "Nhất",
      1: "Nhì",
      2: "Ba",
      3: "Bét",
      4: "Móm"
    };
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
      player.remainCards = cardList.map(convertRemainCards);
      if (parseInt(player.changeMoney) < 0) {
        player.gameResultString = player.playerResult;
      } else if (parseInt(player.changeMoney) > 0) {
        player.gameResultString = player.playerResult;
        player.isWinner = true;
        if (player.uuid === this.userInfo.uuid) {
          resultData.isWinner = true;
        }
      } else {
        player.gameResultString = "Hòa";
      }

      if (player.showPoint && player.totalPoint) {
        player.gameResultString = player.gameResultString + " " + player.totalPoint + " điểm !";
      }

      var Player = this.getPlayerByUuid(player.uuid);
      if (Player) {
        Player.setPlayerStatus(player.playerResult);
        Player.clearTimer();
        Player.setMoney(player.money);
        Player.showMoneyExchageEffect(player.changeMoney, parseInt(player.changeMoney) > 0 ? "win" : "lose");
      }
    }
    setTimeout(function () {
      _self.showResult(resultData);
    }, 2000);
  };

  TWIST.PhomGame = PhomGame;

})();