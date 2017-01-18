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
    this.addCheater();
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
    } else {
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
    player.draftCardsInHand(cards, {
      cardType: TWIST.Card.draftCard
    });
    player.markEatedCard();
    this.desk.lastActivePlayer = data.uuid;
    this.desk.lastDraftCard = cards;
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
      }
    }
    this.desk.generateCards(52, TWIST.Card.deckCard);

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
    this._STATUS_PLAYING();
    var cardList = data.cardList;
    var players = this.model.players;
    var numberCards = this.options.maxPlayers * this.options.numberCardsRender;
    var _self = this;

    this.desk.generateCards(numberCards, TWIST.Card.deckCard);

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
      var listCheatCard = _self.getListCheatCard();
      _self.emit("start", {
        listCheatCard: listCheatCard,
        showPlayerCards: $('#showPlayerCards').prop('checked')
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

  p.getListCheatCard = function (element) {
    var _self = this;
    this.createTotalCheatCardList();
    var listCardToSet = [];
    if ($('#whiteVictory').prop('checked')) {
      listCardToSet = this.createWhiteVictoryList();
    } else if ($('#hasGun').prop('checked')) {
      listCardToSet = this.createGunList();
    } else if ($('#hightCards').prop('checked')) {
      listCardToSet = this.createHightCardsList();
    } else {
      listCardToSet = [];
    }
    if ($('#hasFixedCards').prop('checked')) {
      _self.totalCheatCardList.cardList.forEach(function (item, index) {
        if ((listCardToSet.indexOf(item) === -1) && listCardToSet.length < _self.options.numberCardsInHand) {
          listCardToSet.push(item);
        }
      });
    }

//    listCardToSet = [];

    var listPlayer = this.playersContainer.children.map(function (item, index) {
      return {
        uuid: item.uuid,
        username: item.username,
        isRoomMaster: item.isRoomMaster,
        indexPosition: item.indexPosition
      };
    });
    listPlayer.sort(function (a, b) {
      return a.indexPosition - b.indexPosition
    });

    var listFullCard = [];
    for (var i = 0; i < 52; i++) {
      listFullCard.push({
        value: i,
        disabled: false
      });
    }

    listFullCard.forEach(function (item, index) {
      if (listCardToSet.indexOf(item.value) > -1) {
        item.disabled = true;
      }
    });

    listPlayer.forEach(function (item, index) {
      item.cardList = item.isRoomMaster ? listCardToSet : [];
      if (!listCardToSet.length)
        return;
      var addCardsLength = _self.options.numberCardsInHand - item.cardList.length;
      if ((_self.lastWinner && (_self.lastWinner == item.uuid)) || (!_self.lastWinner && item.isRoomMaster)) {
        addCardsLength ++;
      };
      if (addCardsLength > 0) {
        for (var i = 0; i < addCardsLength; i++) {
          addCardToPlayer(item.cardList);
        }
      }
    });

    function addCardToPlayer(cardList) {
      var remainingCards = listFullCard.filter(function (item) {
        return !item.disabled;
      });
      var cardItem = remainingCards[parseInt(Math.random() * remainingCards.length)];
      cardList.push(cardItem.value);
      var disabledCard = listFullCard.find(function (item) {
        return item.value == (cardItem && cardItem.value);
      });
      disabledCard && (disabledCard.disabled = true);
    }
    return listPlayer;
  };

  p.createWhiteVictoryList = function () {
    var whiteVictoryList = [
      "3s4c5h6d7s8c9h0djdqdkskdac", "3d3h4d5s6c7c8s9s0hjsqskcad", "3c4d5h6h7d8c9s0djcqskdas2d",
      "3s4d5d6d7c8d9d0sjcqckhac2s", "3h4s5s6d7s8c9h0h0sjcqdkdad", "3h4h5h6c6s7s8s9d0cjdqskdas",
      // 5 doi thong
      "4s4d5d5c6h6d7c7s8h8sjcjdkh", "6c6d7s7h8d8s9h9s0c0dadah2h", "3h5d8d8c9s9h0c0djsjdqcqd2s",
      "3d3s4s4d5d5c6h6d7c7sjdqckc", "6d6h7s7c8c8d9d9s0s0hacasad", "8s8c8h9s9h0s0cjsjcqdqhac2d",
      // 6 doi
      "4s4d5c5s7d7c8c8h9s9dkdkcas", "3c3h8s8h9s9c0s0dkhkcjdjh2s", "6s6h4c4d7s9s9dkckhasah2d2h",
      // Tu 2
      "3h4s5d6c8h9djhjcks2h2c2d2s", "4s4h6h8s8c9s0hjckd2s2c2h2d", "5s6c7c7h0h0cqdqckd2d2c2s2h",
      "3s4d6d6c7h9s0cjhqc2h2c2d2s", "3c3h4d5d6s0c0hkdks2s2c2h2d"];
    var randomString = whiteVictoryList[parseInt(Math.random() * whiteVictoryList.length)];
    var cardStringList = randomString.match(/.{1,2}/g);
    var rankMap = ["3", "4", "5", "6", "7", "8", "9", "0", "j", "q", "k", "a", "2"];
    var suitMap = ['s', 'c', 'd', 'h'];
    var idList = cardStringList.map(function (item, index) {
      return rankMap.indexOf(item[0]) * 4 + suitMap.indexOf(item[1]);
    });
    return idList;
  };

  p.createGunList = function () {
    var idList = [];
    var startId = 0;
    if (Math.random() < 0.5) {
      startId = parseInt(Math.random() * 11);
      for (var i = 0; i < 3; i++) {
        idList.push(startId * 4 + i)
      }
    } else {
      startId = parseInt(Math.random() * 9);
      var suilt = parseInt(Math.random() * 4);
      for (var i = 0; i < 3; i++) {
        idList.push((startId + i) * 4 + suilt);
      }
    }
    return idList;
  };


  p.reSortDraftCards = function (data) {
    var userID = data.uuid;
    var Player = this.getPlayerByUuid(userID);
    var cardType = TWIST.Card.draftCard;
    if (!Player) {
      this.showError({code: 0});
      return;
    }
    if (Player.position == 0)
      return;
    if (Player.x < 100) {
      Player.showCardsDirection = "horizontal";
      Player.indexShowCardX = 0;
    } else {
      Player.showCardsDirection = "horizontal";
      Player.indexShowCardX = -300;
    }
    Player.handCards.children.sort(function (a, b) {
      return a.cardValue - b.cardValue;
    });
    Player.handCards.children.forEach(function (item, index) {
      item.set({
        scaleX: cardType.scale * 3 / 4,
        scaleY: cardType.scale * 3 / 4,
        x: Player.indexShowCardX + index * cardType.seperator * 3 / 4,
        y: 100
      })
    });
  };

  p.showPlayersCards = function (data) {
    var _self = this;
    var cardType = TWIST.Card.draftCard;
    var currentPlayer = this.getCurrentPlayer();
    currentPlayer.showPlayersCards = true;

    data.forEach(openPlayerCards);
    function openPlayerCards(itemData) {
      var player = _self.getPlayerByUuid(itemData.uuid);
      if (player.position == 0)
        return;
      player.clearHand();
//      if (player.x < 100 || player.x > 1000) {
//        player.showCardsDirection = "vertical";
//        player.indexShowCardY = -250;
//      } else {
//        player.showCardsDirection = "horizontal";
//        player.indexShowCardX = -300;
//      }

      if (player.x < 100) {
        player.showCardsDirection = "horizontal";
        player.indexShowCardX = 0;
      } else {
        player.showCardsDirection = "horizontal";
        player.indexShowCardX = -300;
      }
      itemData.cardList.sort(function (a, b) {
        return a - b;
      });
      itemData.cardList.forEach(function (item, index) {
        var card = new TWIST.Card(item);
        player.handCards.addChild(card);
        card.set({
          scaleX: cardType.scale * 3 / 4,
          scaleY: cardType.scale * 3 / 4,
          x: player.showCardsDirection == "vertical" ? 0 : (player.indexShowCardX + index * cardType.seperator * 3 / 4),
//          y: player.showCardsDirection == "vertical" ? (player.indexShowCardY + index * cardType.height * 2 / 3) : 0,
          y: player.position == 2 ? 0 : 100
        })
      });
    }
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

  };

  p._STATUS_PLAYING = function () {
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
    var _self = this;

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
        _self.lastWinner = player.uuid;
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