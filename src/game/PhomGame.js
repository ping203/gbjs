this.TWIST = this.TWIST || {};

(function () {
    "use strict";

    var initOptions = {
        maxPlayers: 4,
        numberCardsInHand: 9,
        turnTime: 20000,
        numberCardsRender: 13
    };

    function PhomGame(wrapper, options) {
        this.wrapper = $(wrapper);
        this.options = $.extend(initOptions, options);
        this.initPhomGame();
    }

    var p = PhomGame.prototype = new TWIST.InRoomGame();

    p.initPhomGame = function (wrapper) {
        TWIST.Card.RankMapIndex = ["3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "1", "2"];
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
        this.setPlayerTurn(data.uuid);
    };

    p.onHitTurn = function (data) {
        var currentUuid = data.uuid;
        var currentPlayer = this.getCurrentPlayer();
        if (currentPlayer.handCards.children.length > 0) {
            this.sortCardButton.show();
        }
        this.getCardButton.hide();
        if (data.uuid === this.userInfo.uuid) {
            this.hitButton.show();
        }
        this.setPlayerTurn(data.uuid);
    };

    p.getCardComplete = function (data) {
        this.getCardButton.hide();
        var card = data.cardIndex;
        var userID = data.uuid;
        var listPhom = data.listPhom;
        var player = this.getPlayerByUuid(userID);
        player.listPhom = listPhom;
        player.getDeckCard(card, listPhom);
    };

    p.enableEatCard = function () {
        this.eatCardButton.show();
    };

    p.enableU = function () {
        this.entiretyButton.show();
    };

    p.enableShowPhom = function () {
        this.showPhomButton.show();
    };

    p.enableSendCard = function () {
        this.sendCardButton.show();
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
                card = hitPlayer.getLastDraftCards([data.cardIndex])[0];
            }
            eatPlayer.listPhom = data.listPhom;
            eatPlayer.eatCard(card);
            this.desk.affterEatCard = true;
        }
    };

    p.moveDraftCard = function (data) {
        var fromPlayer = this.getPlayerByUuid(data.fromPlayer);
        var toPlayer = this.getPlayerByUuid(data.toPlayer);
        if (fromPlayer && toPlayer) {
            var cards = fromPlayer.getLastDraftCards([data.cardIndex]);
            toPlayer.moveDraftCard(cards, fromPlayer);
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
        player.draftCardsInHand(cards);
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
                }
            } else {
                handCards.length = item.numberCardsInHand;
            }
            var Player = _self.getPlayerByUuid(item.uuid);
            if (Player) {
                Player.handCards.cardList = handCards;
                Player.renderCards({
                    showPlayerCard: true,
                    dragable: true
                });
            }
        });

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
                Player.handCards.cardList = handCards;
                Player.renderCards({
                    showPlayerCard: false,
                    dragable: true
                });
            }
        });

        this.desk.showRemainingDeckCard();

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
            _self.emit('showPhom');
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
    
    p.drawPlayer = function(playerData){
        var newPlayer = TWIST.InRoomGame.prototype.drawPlayer.call(this, playerData);
        newPlayer.addShowPhomArea();
    };

    p.sendCard = function (data) {
        var cardsSend = data.cardsSend;
        var sendPlayer = this.getPlayerByUuid(data.cardsSend[0].transFrom);
        for (var i = 0; i < cardsSend.length; i++) {
            var dataItem = cardsSend[i];
            var receivePlayer = this.getPlayerByUuid(dataItem.transTo);
            if (receivePlayer && sendPlayer) {
                var card = sendPlayer.getCardsInHand([dataItem.cardIndex])[0];
                card.set({
                    x : card.x + sendPlayer.x + sendPlayer.hand.x,
                    y : card.y + sendPlayer.y + sendPlayer.hand.y
                });
                card.cardValue = dataItem.cardIndex;
                receivePlayer.addCardInShowPhom(card);
            }
        }
        for (var i = 0; i < this.playersContainer.children.length; i++) {
            var player = this.playersContainer.children[i];
            if (player) {
                (function (player) {
                    setTimeout(function () {
                        player.sortPhomArea();
                    }, 700);
                })(player);
            }
        }
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
    };

    TWIST.PhomGame = PhomGame;

})();