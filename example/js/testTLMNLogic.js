

(function () {
    "use strict";
    var game = new TWIST.TLMNDemlaGame('.wrapper');
    TWIST.Sound.init();


    var hand = new createjs.Container();
    game.stage.addChild(hand);


    /**
     * Utils
     * @param {Array} cards
     */
    function addCards(cards) {
        hand.removeAllChildren();
        for (var i in cards) {
            var card = new TWIST.Card(cards[i]);
            hand.addChild(card);
        }
    }
    function map(card) {
        return card.getValue();
    }

    (function () {
        var cardList = [12, 15, 16, 21, 22, 18, 10 ,11];
        var newList = cardList.map(function(value,index){
            return parseInt(value);
        });
        addCards(newList);
        var cards = TWIST.TLMNLogic([49], hand.getChildAt(0)).getCards();
        console.log("return List",cards.map(map));
    })();

})();