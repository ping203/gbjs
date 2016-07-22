this.TWIST = this.TWIST || {};

(function () {
    "use strict";

    var initOptions = {
        maxPlayers: 4,
        numberCardsInHand: 13,
        turnTime: 20000
    };

    function TLMNDemlaGame(wrapper, options) {
        this.options = options || {};
        $.extend(this.options, initOptions);
        this.wrapper = $(wrapper);
        this.initTLMNDemlaGame();
    }

    var p = TLMNDemlaGame.prototype = new TWIST.InRoomGame();

    p.initTLMNDemlaGame = function (wrapper) {
        TWIST.Card.RankMapIndex = ["3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "1", "2"];
        this.initInRoomGame();
        this.pushTLMNDemlaEvent();
        this.initResultPanel();
        this.initEvent();
        this.bindButton();
        this.observerEvent();
    };

    p.pushTLMNDemlaEvent = function () {
        this.on("gameInfo", this.drawGameInfo);
    };

    p.STATUS_WAITING_FOR_PLAYER = function () {
        this.buttonBar.hide();
    };

    p.STATUS_WAITING_FOR_START = function () {
        this.buttonBar.show();
        this.buttonBar.find('.button').hide();

        var playerData = this.getPlayerDataByUuid(this.userInfo.uuid);
        if (playerData && playerData.isRoomMaster) {
            this.startButton.show();
        }
    };

    p.initResultPanel = function () {
        this.resultPanel = this.wrapper.find('#result-panel');
        this.resultPanel.hide();
    };

    p.observerEvent = function () {
        var _self = this;
        TWIST.Observer.on("cardSelected", function (card) {
            _self.handCardSelected(card);
        });
    };

    p.handCardSelected = function (card) {
        var lastDraftCard = this.desk.lastDraftCards;
        if (card && lastDraftCard) {
            var result = TWIST.TLMNLogic(lastDraftCard, card).getCards();
            if (result.length > 0)
                card.removeAllSelected();
            result.forEach(function (item, index) {
                item.setSelected(true);
            });
        }
    };

    p.STATUS_PLAYING = function () {
        this.buttonBar.show();
        this.startButton.hide();
        var players = this.model.players || [];
        players.forEach(function (item, index) {
            item.status = "STATUS_PLAYING";
        });
    };

    p.drawPlayingState = function (data) {
        var players = data.players || [];
        var _self = this;

        var playingPlayer = data.playingPlayer;
        var PlayingPlayer = this.getPlayerByUuid(playingPlayer.uuid);
        if (PlayingPlayer) {
            PlayingPlayer.setRemainingTime(playingPlayer.remainingTime);
            if (PlayingPlayer.uuid === this.userInfo.uuid) {
                this.hitButton.show();
                this.foldTurnButton.show();
            }
        }
        
        if(data.lastDraftCards){
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

    p.onHitTurn = function (data) {
        var currentUuid = data.uuid;
        var currentPlayer = this.getCurrentPlayer();
        if (currentPlayer.handCards.children.length > 0) {
            this.sortCardButton.show();
        }
        this.setPlayerTurn(data.uuid);

        if (data.uuid === this.userInfo.uuid) {
            this.hitButton.show();
            this.foldTurnButton.show();
        }
    };

    p.setPlayerTurn = function (uuid, remainingTime) {
        var totalTime = this.model.turningTime;
        var players = this.playersContainer.children;
        for (var i = 0, length = players.length; i < length; i++) {
            var player = players[i];
            if (player) {
                if (player.uuid === uuid) {
                    player.setRemainingTime(remainingTime,totalTime);
                } else {
                    player.clearTimer();
                }
            }
        }
    };
    
    p.foldTurn = function (data){
        var Player = this.getPlayerByUuid(data.uuid);
        if(Player){
            Player.clearTimer();
        }
    };

    p.onDraftCards = function (data) {
        var cards = data.cardList;
        var userID = data.uuid;
        this.desk.lastDraftCards = data.cardList;
        var Player = this.getPlayerByUuid(userID);
        if (!Player) {
            this.showError({code: 1});
            return;
        }
        if (userID === this.userInfo.uuid) {
            this.hitButton.hide();
            this.foldTurnButton.hide();
        }
        this.desk.removeOverlayCards();
        this.desk.setZeroVetical();
        this.desk.overlayDraftCards();
        var cardType = TWIST.Card.userCard;
        var position = {};
        position.x = (TWIST.Desk.width - cardType.seperator * cards.length) / 2 - TWIST.Desk.draftPosition.x;
        position.y = cardType.height * 0.8;

        Player.draftCardsInHand(cards, {
            draftCards: this.desk.draftCards,
            position: position,
            rotateAble: true
        });
    };

    p.onEndTurn = function (data) {
        this.desk.lastDraftCard = undefined;
        this.desk.clear();
        this.onHitTurn(data);
    };

    p.bindButton = function () {
        var _self = this;
        this.startButton.unbind('click');
        this.startButton.click(function () {
            _self.emit("start");
        });

        this.hitButton = this.wrapper.find('#hit-card');
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

        this.sortCardButton = this.wrapper.find('#sort-card');
        this.sortCardButton.unbind('click');
        this.sortCardButton.click(function () {
            var Player = _self.getCurrentPlayer();
            Player.sortTL();
        });

        this.foldTurnButton = this.wrapper.find('#fold-turn');
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
    
    p.endGame = function (data) {
        var _self = this;
        var resultData = {};
        switch (data.winType) {
            case 0:
                resultData.winTypeString = "Tứ quý 3";
                break;
            case 1:
                resultData.winTypeString = "3 đôi thông chứa 3 bích";
                break;
            case 2:
                resultData.winTypeString = "Tứ quý 2";
                break;
            case 3:
                resultData.winTypeString = "6 Đôi";
                break;
            case 4:
                resultData.winTypeString = "5 Đôi thông";
                break;
            case 5:
                resultData.winTypeString = "Sảnh rồng";
                break;
            case 99:
                resultData.winTypeString = "Thắng !";
                break;
            default:
                resultData.winTypeString = "Thắng !";
                break;
        }

        resultData.listPlayers = data.listPlayers;
        for (var i = 0, length = resultData.listPlayers.length; i < length; i++) {
            var player = resultData.listPlayers[i]
            var cardList = player.remainCards;
            cardList.sort(function (a, b) {
                return a - b
            });
            if (parseInt(player.changeMoney) < 0) {
                if (data.winType == 99) {
                    if (cardList.length == this.options.numberCardsInHand) {
                        player.gameResultString = "Thua cóng";
                    } else
                        player.gameResultString = "Thua " + cardList.length + " lá!";
                } else {
                    player.gameResultString = "Thua !";
                }
            } else if (parseInt(player.changeMoney) > 0) {
                player.gameResultString = resultData.winTypeString;
            } else {
                player.gameResultString = "";
            }

            var Player = this.getPlayerByUuid(player.uuid);
            if (Player) {
                Player.setMoney(player.money);
                Player.showMoneyExchageEffect(player.changeMoney, parseInt(player.changeMoney) > 0 ? "win" : "lose");
            }
        }

        setTimeout(function () {
            _self.emit("showResult", resultData);
        }, 2000);
    };

    TWIST.TLMNDemlaGame = TLMNDemlaGame;

})();