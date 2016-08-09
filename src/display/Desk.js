this.TWIST = this.TWIST || {};

(function () {
    "use strict";
    var imagePath, CONFIG;
    var imagePath = location.origin + location.pathname + '../src/images/';

    function Desk(gameType) {
        this.initialize(gameType);
    }

    Desk.playerPositions = {
        4: [{x: 12, y: 410}, {x: 790, y: 160}, {x: 450, y: 17}, {x: 110, y: 160}],
        2: [{x: 12, y: 410}, {x: 450, y: 17}],
        5: [{x: 12, y: 410}, {x: 1110, y: 184}, {x: 783, y: 17}, {x: 383, y: 17}, {x: 71, y: 193}],
        9: [{x: 380, y: 410}, {x: 970, y: 540}, {x: 1090, y: 320}, {x: 1000, y: 140}, {x: 783, y: 67}, {x: 383, y: 67}, {x: 170, y: 140}, {x: 70, y: 320}, {x: 160, y: 540}],
        6: [{x: 550, y: 410}, {x: 1080, y: 400}, {x: 1080, y: 170}, {x: 550, y: 70}, {x: 130, y: 170}, {x: 130, y: 400}]
    };

    Desk.handPositions = {
        center: {x: 150, y: -110, align: 'center'},
        left: {x: -50, y: 20, align: 'left'},
        right: {x: 150, y: -110, align: 'center'}
    };

    Desk.draftPositions = {
        
    };

    var p = Desk.prototype = new createjs.Container();
    p.container_initialize = p.initialize;


    Desk.width = 1000;
    Desk.height = 580;

    // vi tri gua ban
    Desk.position = {x: (Desk.width - TWIST.Card.playerCard.width) / 2, y: (Desk.height - TWIST.Card.playerCard.height) / 2};

    Desk.draftPosition = {x: Desk.width / 2, y: Desk.height / 4, rotateDeg: 0};

    p.initialize = function (gameType) {
        this.container_initialize();
        var _self = this;
        this.gameType = gameType || {};
        this.config = {};
        this.initPosition(gameType);

        var deckCard = this.createDeckCard();
        var remainingTime = this.createRemainingTime();
        var remainingCard = this.createRemainingCard();
        var draftCards = this.createDraftCards();
        this.addChild(deckCard, draftCards, remainingTime, remainingCard);

    };

    p.createDeckCard = function () {
        this.deckCard = new createjs.Container();
        this.deckCard.set({
            x: Desk.position.x - 20,
            y: Desk.position.y - 60,
            visible: false
        });
        return this.deckCard;
    };

    p.createRemainingTime = function () {
        this.remainingTime = new createjs.Text('', 'bold 50px Roboto Condensed', 'white');
        this.remainingTime.set({
            x: Desk.width /2,
            y: Desk.height/2,
            visible: false,
            textAlign: "center"
        });
        return this.remainingTime;
    };

    p.createRemainingCard = function () {
        this.remainingCard = new createjs.Text('', 'bold 30px Roboto Condensed', 'greenyellow');
        this.remainingCard.set({
            x: this.deckCard.x + 35,
            y: this.deckCard.y + 65,
            textAlign: "center",
            textBaseline: 'bottom'
        });
        return this.remainingCard;
    };

    p.createDraftCards = function () {
        this.draftCards = new createjs.Container();
        this.draftCards.set({
            x: Desk.draftPosition.x,
            y: Desk.draftPosition.y
        });
        return this.draftCards;
    };

    p.initPosition = function (gameType) {
        var maxPlayers = gameType.maxPlayers || 4;

        var playerPosition = new Array(maxPlayers);
        var handPosition = new Array(maxPlayers);
        var draftPosition = new Array(maxPlayers);

        for (var i = 0; i < maxPlayers; i++) {
            playerPosition[i] = {x: 0, y: 0};
            draftPosition[i] = {x: 50, y: 50};
            handPosition[i] = {
                x: 90,
                y: 20,
                align: 'left'
            };
        }

        playerPosition = Desk.playerPositions[maxPlayers];
        handPosition[0] = {x: 150, y: -50, align: 'center'};
        
        if (maxPlayers === 4) {
            handPosition[1] = {x: -30, y: 20, align: 'right'};
        }
        

        this.config.playerPositions = playerPosition;
        this.config.handPositions = handPosition;
        this.config.draftPositions = draftPosition;
    };

    p.generateCards = function (numberCards) {
        numberCards = numberCards || 0;
        for (var i = 0; i < numberCards; i++) {
            var cardImage = new TWIST.Card();
            var scale = TWIST.Card.playerCard.scale;
            cardImage.set({
                scaleX: scale,
                scaleY: scale
            });
            this.deckCard.addChild(cardImage);
        }
        this.deckCard.visible = true;
    };


    p.createLastDraftCards = function (cardList) {
        var draftCards = this.draftCards;
        var cardType = TWIST.Card.draftCard;
        cardList.forEach(function (item, index) {
            var card = new TWIST.Card(item);
            card.set({
                x: (index - cardList.length * 0.5) * cardType.seperator,
                rotation: (Math.random() - 0.5) * 30,
                scaleX: cardType.scale,
                scaleY: cardType.scale
            });
            draftCards.addChild(card);
        });
    };

    p.scaleDeckCard = function (numberPlayer) {
        var deckCardList = this.deckCard.children;
        for (var i = 0; i < deckCardList.length; i++) {
            var card = deckCardList[i];
            card.set({
                scaleX: 0.3,
                scaleY: 0.3
            });
        }
        ;
    };

    p.renderDraftCards = function (cards) {
        for (var i = 0; i < cards.length; i++) {
            var cardImage = new TWIST.Card(cards[i]);

            var newX = TWIST.Card.baiDraft.seperator * i,
                    newY = 0;
            cardImage.set({
                x: newX,
                y: newY,
                scaleX: TWIST.Card.baiDraft.width / TWIST.Card.image.width,
                scaleY: TWIST.Card.baiDraft.height / TWIST.Card.image.height
            });
            TWIST.Card.addChild(cardImage);
        }
    };

    p.getCard = function () {
        var card;
        card = this.deckCard.children.pop();
        if (card)
            card.set({x: this.deckCard.x, y: this.deckCard.y});

        return card;
    };

    p.setRemainingTime = function (time) {
        var miliseconTime = time > 1000 ? time : time * 1000;
        var startTime = new Date().getTime();
        var miliseconTimeText = this.remainingTime;
        miliseconTimeText.visible = true;
        if (miliseconTime > 0) {
            if (this.remainingTimeTween) {
                this.remainingTimeTween.removeAllEventListeners();
                miliseconTimeText.text = "";
            }
            this.remainingTimeTween = createjs.Tween.get(miliseconTimeText)
                    .to({}, miliseconTime, createjs.Ease.linear)
                    .call(function () {
                        miliseconTimeText.text = "";
                    });
            this.remainingTimeTween.addEventListener("change", function () {
                var currentTime = new Date().getTime();
                var text = Math.floor((miliseconTime - (currentTime - startTime)) / 1000);
                miliseconTimeText.text = text > 0 ? text : "";
            });
        } else if (this.remainingTimeTween) {
            this.remainingTimeTween.removeAllEventListeners();
            miliseconTimeText.text = "";
        }
        var _self = this;
    };


    p.clearRemainingTime = function () {
        if (this.remainingTimeTween) {
            this.remainingTimeTween.removeAllEventListeners();
        }
        this.remainingTime.text = "";
    };

    p.clear = function () {
        this.deckCard.removeAllChildren();
        this.draftCards.removeAllChildren();
        this.deckCard.visible = false;
        this.remainingCard.text = '';
    };

    p.tipOff = function () {
        var draftCardList = this.draftCards.children;
        for (var i = 0; i < draftCardList.length; i++) {
            if (draftCardList[i].cardValue > -1) {
                draftCardList[i].tipOff();
            }
        }
    };

    p.overlayDraftCards = function () {
        var draftCardList = this.draftCards.children;
        for (var i = 0; i < draftCardList.length; i++) {
            if (draftCardList[i].cardValue > -1) {
                draftCardList[i].Overlay();
            }
        }
    };

    p.removeOverlayCards = function () {
        var draftCardList = this.draftCards.children;

        for (var i = 0, length = draftCardList.length; i < length; i++) {
            if (draftCardList[i] && draftCardList[i].isOverlay) {
                draftCardList.splice(i, 1)
                i--;
            }
        }
    };

    p.setZeroVetical = function () {
        var draftCard = this.draftCard;
        var draftCardList = this.draftCards.children;
        draftCardList.forEach(function (item, index) {
            item.moveTo(item.x, 0);
        });
    };

    TWIST.Desk = Desk;
})();