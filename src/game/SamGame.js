this.TWIST = this.TWIST || {};

(function () {
    "use strict";

    var initOptions = {
        maxPlayers: 4,
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
        this.callSamButton = this.wrapper.find('#call-sam');
        this.callSamButton.unbind('click');
        this.callSamButton.click(function () {
            _self.emit("call-sam");
        });

        this.foldSamButton = this.wrapper.find('#fold-sam');
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
            case 16:
                resultData.winTypeString = "Thắng !";
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
                return a - b
            });
            if (parseInt(player.changeMoney) < 0) {
                if (data.winType == 16) {
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
                Player.clearTimer();
                Player.setMoney(player.money);
                Player.showMoneyExchageEffect(player.changeMoney, parseInt(player.changeMoney) > 0 ? "win" : "lose");
            }
        }

        setTimeout(function () {
            _self.emit("showResult", resultData);
        }, 2000);
    };

    TWIST.SamGame = SamGame;

})();