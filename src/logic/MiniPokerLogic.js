this.TWIST = this.TWIST || {};

(function () {

    var numberCard, lineList20, lineList9, prizeList, cardList, bets, potPercent;

    numberCard = 52;

    bets = [100, 1000, 10000, 100000];

    var MiniPokerLogic = new EventEmitter();

    var p = MiniPokerLogic;

    p.generateMap = function (options) {
        var map = [];
        for (var x = 0; x < 5; x++) {
            map[x] = options ? options[x] : Math.floor(Math.random() * numberCard);
        }
        return map;
    };
    
    TWIST.MiniPokerLogic = MiniPokerLogic;
})();


