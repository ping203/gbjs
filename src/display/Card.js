this.TWIST = this.TWIST || {};

(function () {
    "use strict";

    var imagePath = location.origin + location.pathname + '../src/images/';

    function Card(position) {
        if (typeof position !== 'number' || position < 0 || position > 51)
            position = -1;
        this.initialize(position);
    }

    Card.size = {width: 88, height: 115};
    Card.userCard = {width: 53, height: 69, seperator: 59, cardDraggable: true, selectedHeight: 20, scale: 0.6};
    Card.playerCard = {width: 29, height: 37, seperator: 0, cardDraggable: false, scale: 0.33};
    Card.draftCard = {width: 53, height: 69, seperator: 55, scale: 0.5};
    Card.threeCards = {width: 54, height: 73.8, seperator: 55, scale: 0.6};
    Card.threeCardsBanker = {width: 63, height: 86.1, seperator: 64, scale: 0.7};

    Card.image = {width: 67 * 1.2, height: 91 * 1.2};
    Card.bai = {width: 67, height: 91, seperator: 70, baiDraggable: true, selectedHeight: 30};
    Card.bacay = {width: 67, height: 91, seperator: 72, baiDraggable: true, selectedHeight: 30};
    Card.bacayOther = {width: 35, height: 45, seperator: 39, baiDraggable: false};
    Card.chinesePoker = {width: 67 * 0.8, height: 91 * 0.8, seperator: 60, baiDraggable: true, selectedHeight: 30};
    Card.chinesePokerOther = {width: 35, height: 45, seperator: 39, baiDraggable: false};
    Card.baiOther = {width: 35, height: 45, seperator: 0, baiDraggable: false};
    Card.baiLoc = {width: 18, height: 24, seperator: 0.2, baiDraggable: false, defaultValue: 52};
    Card.baiDraft = {width: 35, height: 45, seperator: 21, baiDraggable: false};
    Card.baiDown = {width: 54, height: 72, seperator: 21, baiDraggable: false, selectedHeight: 30};
    Card.newImage = {width: 43.2 * 0.7, height: 57.6 * 0.7, seperator: 21, baiDraggable: false, selectedHeight: 30};

    Card.shadow = new createjs.Shadow('#0ff', 0, 0, 10);

    Card.Suite = {
        3: 0, //co = 39/13
        2: 1, // ro = 26/13
        1: 3, //nhep = 13/13
        0: 2, //bich = 0/13
        4: 4
    };

    Card.NumberCardInHand = 13;
    Card.SuitMap = ["♠", "♣", "♦", "♥"];
    Card.SuitNameMap = ["b", "t", "r", "c"];
    Card.SuitImageIndex = ["♠", "♣", "♦", "♥"];

    var p = Card.prototype = new createjs.Container();
    p.container_initialize = p.initialize;


    function getRankSuite(cardValue) {
        var cardRank = Math.floor(cardValue / 4);
        var cardSuite = Math.floor(cardValue % 4);

        if (cardValue < 0 || cardValue >= 52) {
            cardRank = -1;
            cardSuite = 4;
        }
        return {
            rank: cardRank,
            suite: cardSuite
        };
    }

    p.initialize = function (value) {
        this.container_initialize();
        this.setValue(value);
    };

    p.setValue = function (value) {
        var rankSuite = getRankSuite(value);
        this.cardValue = value;
        this.rank = rankSuite.rank;
        this.suite = rankSuite.suite;


        var cards = new Image();
        cards.src = (TWIST.imagePath || imagePath) + 'card/cards.png';
        var bg = new createjs.Bitmap(cards);
        bg.sourceRect = $.extend({}, Card.size);
        if (value !== -1) {
            Card.RankMapIndex = Card.RankMapIndex || ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"];
            var rankName = Card.RankMapIndex[rankSuite.rank];
            var suidName = Card.SuitMap[rankSuite.suite];
            bg.sourceRect.x = (rankName - 1) * Card.size.width;
            bg.sourceRect.y = rankSuite.suite * Card.size.height;
        } else {
            bg.sourceRect.x = 0;
            bg.sourceRect.y = Card.size.height * Card.SuitNameMap.length;
        }

        this.inPhom = new createjs.Bitmap(cards);
        this.inPhom.sourceRect = {
            width: 25,
            height: 25,
            x: Card.size.width * 1,
            y: Card.size.height * Card.SuitNameMap.length
        };
        this.inPhom.set({
            x: 55,
            y: 10
        });
        this.inPhom.visible = false;

        this.border = new createjs.Bitmap(cards);
        this.border.sourceRect = {
            width: Card.size.width,
            height: Card.size.height,
            x: Card.size.width * 2,
            y: Card.size.height * Card.SuitNameMap.length
        };
        this.border.set({
            x: -2,
            y: -1.5
        });
        this.border.visible = this.showBorder;

        this.addChild(bg);
    };

    p.getValue = function () {
        return this.cardValue;
    };

    p.removeAllSelected = function () {
        this.parent.children.forEach(function (item, index) {
            item.setSelected(false);
        })
    }

    p.baiTrenTay = function (card, handCards, isCurrent) {
        if (!handCards)
            return;

        var cardValue = (card.cardValue ? card.cardValue : Card.baiLoc.defaultValue),
                position = this.pos || handCards.children.length,
                cardName = 'card' + cardValue;
        if (isCurrent) {
            var newX = 0 + position * Card.bai.seperator,
                    newY = this.selected ? -Card.bai.selectedHeight : 0;

            if (handCards.multiSelectCard) {
                card.IsDraggable = true;
                this.multiSelect = true;
            }
            ;
            this.set({
                name: cardName,
                cardValue: cardValue,
                x: newX,
                y: newY,
                width: Card.baiOther.width,
                height: Card.baiOther.height,
                scaleX: Card.baiOther.width / Card.image.width,
                scaleY: Card.baiOther.height / Card.image.height
            });

//                if (card.IsInPhom || card.IsBaiAn) {
//                    if (card.IsBaiAn)
//                        this.shadow = Card.shadowBold;
//                    else
//                        this.shadow = Card.shadow;
//                }
//                console.log("log before this is clicj function"); 
//                this.addEventListener("click", function (){
//                   console.log("this is clicj function"); 
//                });
            this.bindEventListener();
//                this.updateCache();
        } else {
            if (card && card.IsFlip) {
                this.name = cardName;
                this.setValue(cardValue);
            } else {
                this.name = position;
            }

            var new_X = 0 + position * Card.baiOther.seperator;
            this.set({
                x: new_X,
                y: 0,
                cardValue: cardValue,
                width: Card.baiOther.width,
                height: Card.baiOther.height,
                scaleX: Card.baiOther.width / Card.image.width,
                scaleY: Card.baiOther.height / Card.image.height
            });
            //this.updateCache();
        }
        this.pos = position;
        handCards.addChildAt(this, position);
    };

    p.danhBai = function (cardValue, draftCards, isCurrent) {
        if (!draftCards)
            return;

//            if (typeof cardValue == 'undefined' || cardValue < 0)
//                cardValue = Card.baiLoc.defaultValue;

        var dropCards = draftCards.children,
                count = dropCards.length;

        this.removeAllEventListeners();
        this.set({
//                name: 'card' + cardValue,
//                sourceRect: Card.cropImage(cardValue),
            x: count * Card.baiDraft.seperator,
            y: 0,
            width: Card.baiDraft.width,
            height: Card.baiDraft.height,
            scaleX: Card.baiDraft.width / Card.image.width,
            scaleY: Card.baiDraft.height / Card.image.height
        });
        //this.updateCache();
        draftCards.addChild(this);
//            console.log(draftCards);
    }

    p.openCard = function (cardValue, cardType) {
        var oldX = this.x;
        var _self = this;
        cardType = cardType || Card.userCard;
        return createjs.Tween.get(this)
                .to({scaleX: 0.1, x: oldX + this.width / 2}, 150)
//                        .set({sourceRect: Card.cropImage(cardValue)})
                .call(function () {
                    this.setValue(cardValue);
                    this.cardValue = cardValue;
                    //this.updateCache();
                })
                .to({scaleX: cardType.scale,scaleY: cardType.scale, x: oldX}, 150).call(function () {
            this.setInPhom(this.isInPhom);
            //this.updateCache();
        });
    };

    p.tipOff = function () {
        if (this.IsFlip === false)
            return;

        var newX = this.x;

        this.removeAllEventListeners();

        return createjs.Tween.get(this)
                .to({scaleX: 0.1, x: newX + this.width / 2}, 150)
                .call(function () {
                    this.setValue(-1);
                })
                .to({scaleX: Card.draftCard.scale, x: newX}, 150)
                .call(function () {
                    this.filters = [new createjs.ColorMatrixFilter(new createjs.ColorMatrix(0, 0, 0, 0))];
                    try {
                        this.updateCache();
                    } catch (e) {
                        console.log(e);
                    }
                });
    };

    p.movePosition = function (newPosition) {
        if (!this.parent)
            return;

        createjs.Tween.get(this).to({x: newPosition.x, y: newPosition.y}, 150).call(function () {});
    }

    p.setSelected = function (isSelect) {
        if (isSelect) {
            var newY = -Card.userCard.selectedHeight;
            createjs.Tween.get(this).to({y: newY}, 100).call(function () {
                this.selected = true;
            });
        } else {
            this.selected = false;
            this.y = 0;
        }
    };

    p.toggedSelected = function () {
        var _self = this;
        if (this.isSelected) {
            this.isSelected = false;
            this.y = this.y + 15;
            _self.parent.swapCardX = undefined;
            _self.parent.swapCardY = undefined;
            _self.parent.selectedCard = undefined;
        } else {
            var newY = this.y - 15;
            _self.parent.setChildIndex(_self, 12);
            _self.isSelected = true;
            createjs.Tween.get(this).to({y: newY}, 100).call(function () {
                _self.parent.selectedCard = _self;
            });

        }
    };

    p.setDraggable = function (draggable) {
        var _self = this;
        this.removeAllEventListeners("mousedown");
        this.removeAllEventListeners("pressmove");
        this.removeAllEventListeners("pressup");

//                this.parent.
        if (draggable) {
            this.addEventListener('mousedown', function (evt) {
                _self.startPositionX = _self.x;
                _self.startPositionY = _self.y;
                _self.startMousePositionX = evt.stageX;
                _self.startMousePositionY = evt.stageY;
                _self.parent.addChild(_self);
            });
            this.addEventListener('pressmove', function (evt) {
                _self.parent.addChild(_self);
                var distanceX = (evt.stageX - _self.startMousePositionX);
                var distanceY = (evt.stageY - _self.startMousePositionY);
                if ((Math.abs(distanceX) + Math.abs(distanceY)) <= 10)
                    return;
                _self.isDragging = true;
                _self.x = _self.startPositionX + distanceX;
                _self.y = _self.startPositionY + distanceY;
                var handCards = _self.parent;
                var indexLeft = handCards.indexLeft;
                var pointerPosition = handCards.globalToLocal(evt.stageX - indexLeft, evt.stageY);
                if (pointerPosition.y > 0 && pointerPosition.y <= _self.height) {
                    var curPosition = Math.floor(pointerPosition.x / _self.seperator);
                    curPosition = (curPosition < 0) ? 0 : ((curPosition >= handCards.children.length - 1) ? handCards.children.length - 1 : curPosition);
                    if (curPosition != _self.position) {
                        var length = Math.abs(curPosition - _self.position);
                        var direction = (curPosition - _self.position) / Math.abs(curPosition - _self.position);

                        var cardPositions = handCards.children.forEach(function (item, index) {
                            if ((item.position - curPosition) * (item.position - _self.position) <= 0 && (item.position != _self.position)) {
                                item.position -= direction;
                                item.moveToPosition(item.position);
                            }
                        });
                    }
                    ;
                    _self.position = curPosition;
                }
            });
            this.addEventListener('pressup', function (evt) {
                if (_self.isDragging) {
                    _self.selected = false;
                    _self.moveToPosition(_self.position);
                    _self.parent.children.sort(function (a, b) {
                        return a.position - b.position
                    });
                }
                _self.isDragging = false;
            });
        }
    };

    p.moveTo = function (x, y, options) {
        createjs.Tween.get(this).to({
            x: x,
            y: y
        }, 100, createjs.Ease.sineOut()).call(function () {
//                    this.tween = undefined;
//                    this.parent.setChildIndex(this, this.position);
        });
    };

    p.moveToPosition = function (position, options) {
        position = position || this.position || 0;
        var indexLeft = this.parent.indexLeft || 0;
        var seperator = this.seperator || Card.userCard.seperator;
        var newX = indexLeft + seperator * position;
        this.moveTo(newX, 0, options);
    };

    p.setInPhom = function (value) {
        if (value) {
            this.inPhom.visible = true;
        } else {
            this.inPhom.visible = false;
        }
    };

    p.setClick = function (clickable) {
        var _self = this;

        this.removeAllEventListeners("click");
        if (clickable) {
            this.addEventListener('click', function (e) {
                var card = e.target.parent;
                if (!card.isDragging) {
                    if (card.parent.selectedCard && card.parent.selectedCard.cardValue != card.cardValue) {
                        $rootScope.playerEvent = {evt: "swapSelected", data: [card.parent.selectedCard.cardValue, card.cardValue]};
                        $rootScope.digest();
                    } else {
                        card.toggedSelected();
                    }
                }
            });
        }
    };

    p.bindMouseOver = function (mouseOver) {
        var _self = this;

        this.removeAllEventListeners("mouseover");
        this.removeAllEventListeners("mouseout");

        if (mouseOver) {
            this.addEventListener('mouseover', function (evt) {
                console.log("moserOver ", _self.cardValue);
                return;
                _self.cursor = "pointer";
                _self.Overlay();
            });
            return;
            this.addEventListener('mouseout', function (evt) {
                _self.cursor = undefined;
                _self.UnOverlay()
            });
        }
    };

    p.bindEventListener = function () {
        this.removeAllEventListeners("click");
        var _self = this;
        this.addEventListener('click', function (e) {
            if (!_self.isDragging) {
                if (!_self.selected) {
                    TWIST.Observer.emit("cardSelected", _self);
                }
                _self.setSelected(!_self.selected);

            }
        });
    };

    p.bindOpenCard = function () {
        this.removeAllEventListeners("click");
        var _self = this;
        this.addEventListener('click', function (e) {
            try {
                if (!_self.isDragging) {
                    _self.openCard(_self.cardValue);
                }
            } catch (e) {
                console.warn(e);
            }
        });
    }

    p.Overlay = function () {
        this.isOverlay = true;
        this.filters = [new createjs.ColorMatrixFilter(new createjs.ColorMatrix(0, -60, 0, 0))];
        this.cache(0, 0, 90, 122);
        //this.updateCache();
    };

    p.UnOverlay = function () {
        this.isOverlay = false;
        this.filters = [new createjs.ColorMatrixFilter(new createjs.ColorMatrix(0, 0, 0, 0))];
        this.updateCache();
    };

    p.addMouseMoveEvent = function () {
        if (this.card.IsDraggable && !this.card.IsInPhom) {
            this.addEventListener('mouseover', function (evt) {
//                    evt.target.shadow = Card.shadowHover;
            });

            this.addEventListener('mouseout', function (evt) {
//                    evt.target.shadow = null;
            });
        }
    };

    p.hightLight = function () {
//                this.shadow = new createjs.Shadow('#0ff', 0, 0, 15);
        this.showBorder = true;
        this.border.visible = true;
    }

    TWIST.Card = Card;
})();