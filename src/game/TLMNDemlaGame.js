this.TWIST = this.TWIST || {};

(function () {
    "use strict";

    var initOptions = {
        maxPlayers: 4,
        numberCardsInHand: 13,
        turnTime: 20000
    };

    function TLMNDemlaGame(wrapper, options) {
        this.wrapper = $(wrapper);
        this.options = $.extend(initOptions, options);
        this.initTLMNDemlaGame();
    }
    var p = TLMNDemlaGame.prototype = new TWIST.BaseDemlaGame();

    p.initTLMNDemlaGame = function (wrapper) { 
        this.initBaseDemlaGame();
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

    TWIST.TLMNDemlaGame = TLMNDemlaGame;

})();