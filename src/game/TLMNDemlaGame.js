this.TWIST = this.TWIST || {};

(function () {
    "use strict";

    var initOptions = {
        maxPlayers: 4,
        numberCardsInHand: 13,
        turnTime: 20000,
        playerConfig : {
          showCardLength : true,
          showPlayerCard : true
        }
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
        this.endIngameEvent();
        var winTypeMap = {
           0 : "Tứ quý 3",
           1 : "3 đôi thông chứa 3 bích",
           2 : "Tứ quý 2",
           3 : "6 Đôi",
           4 : "5 Đôi thông",
           5 : "Sảnh rồng",
           16 : "Thắng !"
        };
        this.endDemlaGame(data,winTypeMap,(data.winType == 16));
    };

    TWIST.TLMNDemlaGame = TLMNDemlaGame;

})();