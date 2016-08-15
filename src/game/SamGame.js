this.TWIST = this.TWIST || {};

(function () {
    "use strict";

    var initOptions = {
        maxPlayers: 5,
        numberCardsInHand: 10,
        turnTime: 20000
    };
    function SamGame(wrapper, options) {
        this.wrapper = $(wrapper);
        this.options = $.extend(initOptions, options);
        this.initSamGame();
    }
    var p = SamGame.prototype = new TWIST.BaseDemlaGame();

    p.initSamGame = function (wrapper) {
        this.initBaseDemlaGame();
        this.pushSamGameEvent();
        this.bindSamButton();
    };

    p.pushSamGameEvent = function () {
        this.on("inviteSam", this.onInviteSam);
        this.on("endInviteSam", this.onEndInviteSam);
        this.on("foldSam", this.onFoldSam);
        this.on("callSam", this.onCallSam);
    };

    p.bindSamButton = function () {
        var _self = this;

        this.callSamButton = $(TWIST.HTMLTemplate.buttonBar.callSamButton);
        this.buttonBar.append(this.callSamButton);
        this.callSamButton.unbind('click');
        this.callSamButton.click(function () {
            _self.emit("call-sam");
        });

        this.foldSamButton = $(TWIST.HTMLTemplate.buttonBar.foldSamButton);
        this.buttonBar.append(this.foldSamButton);
        this.foldSamButton.unbind('click');
        this.foldSamButton.click(function () {
            _self.emit("fold-sam");
        });
    };

    p.onInviteSam = function (data) {
        this.desk.setRemainingTime(parseInt(data.remainingTime));
        this.callSamButton.show();
        this.foldSamButton.show();
        this.userCallSam = null;
    };

    p.onEndInviteSam = function () {
        this.desk.setRemainingTime(0);
        this.callSamButton.hide();
        this.foldSamButton.hide();
        var players = this.playersContainer.children;
        for (var i = 0, length = players.length; i < length; i++) {
            var player = players[i];
            if (player && player.uuid !== this.userCallSam) {
                player.setPlayerStatus("");
            }
        }
    };

    p.onFoldSam = function (data) {
        var player = this.getPlayerByUuid(data.uuid);
        player.setPlayerStatus("Hủy sâm !");
    };

    p.onCallSam = function (data) {
        var player = this.getPlayerByUuid(data.uuid);
        player.setPlayerStatus("Báo sâm !", {
            color: "red"
        });
        this.userCallSam = data.uuid;
    };

    p.endGame = function (data) {
        this.desk.setRemainingTime(0);
        this.buttonBar.hide();
        this.errorPanel.empty();
        var _self = this;
        var resultData = {};
        switch (parseInt(data.winType)) {
            case 2:
                resultData.winTypeString = "Ăn Sâm";
                break;
            case 3:
                resultData.winTypeString = "Bắt Sâm";
                break;
            case 4:
                resultData.winTypeString = "Thắng !";
                break;
            case 9:
                resultData.winTypeString = "Bị bắt Sâm";
                break;
            case 11:
                resultData.winTypeString = "Phạt Báo 1";
                break;
            default:
                resultData.winTypeString = "Thắng !";
                break;
        }

        resultData.listPlayers = data.listPlayers;
        for (var i = 0, length = resultData.listPlayers.length; i < length; i++) {
            var player = resultData.listPlayers[i];
            var cardList = player.remainCards;
            cardList.sort(function (a, b) {
                return a - b;
            });
            if (parseInt(player.changeMoney) < 0) {
                if (data.winType === 4) {
                    if (cardList.length === this.options.numberCardsInHand) {
                        player.gameResultString = "Thua cóng";
                    } else
                        player.gameResultString = "Thua " + cardList.length + " lá!";
                } else {
                    player.gameResultString = "Thua !";
                }
            } else if (parseInt(player.changeMoney) > 0) {
                player.gameResultString = resultData.winTypeString;
                player.isWinner = true;
                if(player.uuid === this.userInfo.uuid){
                    resultData.isWinner = true;
                }
            } else {
                player.gameResultString = "Hòa";
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
//            _self.emit("showResult", resultData);
        }, 2000);
    };

    TWIST.SamGame = SamGame;

})();