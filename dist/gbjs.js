/**
 * @module utils
 */
this.gbjs = this.gbjs || {};

(function() {
	"use strict";

	/**
	 * Static class utils
	 * the library.
	 * @object utils
	 **/
	var utils = gbjs.utils = gbjs.utils || {};
})();
/**
 * @module Info
 */
this.gbjs = this.gbjs || {};

(function() {
	"use strict";

	/**
	 * TUPhom
	 *
	 * @example
	 * gbjs.TUPhom([1, 2, 3])
	 *
	 * @param {Array<gbjs.Card>} handCards
	 * @param {Array<Number>} cardsFire
	 * @param {gbjs.Card<Object>} cardSelect
	 * 
	 * @return {Array<gbjs.Card>}
	 */
	function TUPhom(cardsFire, card) {
		if(!(this instanceof TUPhom)) {
			return new TUPhom(cardsFire, card);
		}

		/**
		 * @protected
		 * @type {gbjs.Card<Object>}
		 */
		this.card = card;

		/**
		 * @protected
		 * @type {gbjs.HandContainer<Object>}
		 */
		this.parent = this.card.parent;
		/**
		 * @protected
		 * @type {String}
		 */
		this.value = this.card.getValue();
		/**
		 * @protected
		 * @type {Number}
		 */
		this.index = this.parent.getChildIndex(this.card);

		/**
		 * @protected
		 * @type {Number}
		 */
		this.rank = TUPhom.getRank(this.value);

		/**
		 * @protected
		 * @type {Array<gbjs.Card>}
		 */
		this.handCards = this.parent.children;
		/**
		 * @protected
		 * @type {Array<Number>}
		 */
		this.cardsFire = cardsFire;
	}


	/**
	 * @return {Array<gbjs.Card>}
	 */
	TUPhom.prototype.getCards = function() {
		var spec;
		var self = this;
		var cardsFire = self.cardsFire;
		if (self.value > self._getMinPush() 
			&& cardsFire.length != 2 
			&& cardsFire.length != 1){
			return [];
		}


		cardsFire.sort(function(a, b) {
			return (a > b);
		});

		if(cardsFire.length === 1) {
			// nguoi choi danh 2
			if(cardsFire[0] >=48) {
				return self._getCardsChat2();
			}
		} else {
			// phom 33 doi thong, 4 doi thong tu quy
			if(TUPhom.getRank(cardsFire[0]) == TUPhom.getRank(cardsFire[1])) {
				//get phom dac biet 3doi thong, 4 doi thong
				spec = TUPhom.getPhomSpecial(cardsFire);
				if(spec > 0) {
					return self._getArrSpecialSuit(spec);
				} else {
					//doi 2
					if(cardsFire.length ==2 && cardsFire[0] > 47) {
						return self._getChatDoi2();
					}
					//truong hop 2 con tro len thuong
					return self._getSelectNgang();
				}
			} else {
				return this._getDoc();
			}
		}

		return [];
	}

	/**
	 * @return {Array<gbjs.Card>}
	 */
	TUPhom.prototype._getCardsChat2 = function() {
		var cards = this._getTuQuy();
		if(cards.length == 0) {
			cards = this._getDoithong(4);
		}
		if(cards.length == 0) {
			cards = this._getDoithong(3);
		}
		return cards;
	}

	/**
	 * @return {Array<gbjs.Card>}
	 */
	TUPhom.prototype._getChatDoi2 = function() {
		var cards = this._getTuQuy();
		if(cards.length == 0) {
			cards = this._getDoithong(4);
		}
		return cards;
	}

	/**
	 * @return {Array<gbjs.Card>}
	 */
	TUPhom.prototype._getTuQuyTohon = function() {
		var self = this;
		var cardFire = this.cardsFire[0];
		var i = 0;
		if(TUPhom.getRank(cardFire) > this.rank) {
			return [];
		};
		return this._getTuQuy();
	}

	/**
	 * @return {String}
	 */
	TUPhom.prototype._getMinPush = function() {
		return this.handCards[this.handCards.length -1].getValue();
	}

	/**
	 * @param  {gbjs.Card} cardSelect
	 * @param {Number} sodoithong
	 * @return {Array}
	 */
	TUPhom.prototype._getSodoithongChon = function(sodoithong) {
		if(TUPhom.getRank(this.cardsFire[0]) > this.rank) {
			return;
		}
		return this._getDoithong(sodoithong);
	}


	/**
	 * @param  {Number} cardSelect
	 * @return {Array}
	 */
	TUPhom.prototype._getTuQuy = function() {
		var self = this;
		var results = _.filter(self.handCards, function(card) {
			return (TUPhom.getRank(card.getValue()) == self.rank);
		});
		if(results.length < 4) {
			results = [];
		}
		return results;
	}

	/**
	 * @param  {Number} cardSelect
	 * @param {Number} sodoithong
	 */
	TUPhom.prototype._getDoithong = function(sodoithong) {
		var results = [];
		var rank = this.rank;
		var indexCard = this.index;
		for(var i = 0; i < sodoithong; i++) {
			var dudoi = 0;
			for(var j  = indexCard + i; j < this.handCards.length; j++) {
				if(TUPhom.getRank(this.handCards[j].getValue()) == rank) {
					dudoi++;
					results.push(this.handCards[j]);
					if(dudoi == 2) {
						break;
					}
				}
			}

			if (dudoi<2){
				results = [];
				break;
			}
			rank++;
			
		}
		if(results.length/2 !=sodoithong) {
			results = [];
		}
		return results;
	}

	/**
	 * @method _getArrSpecialSuit
	 * @param {Number} sodoithong
	 * @return {Number}
	 */
	TUPhom.prototype._getArrSpecialSuit = function(sodoithong) {
		var results = [];
		switch(sodoithong) {
			case 3:
				// tim 3 doi thong to hon or bang
				results = this._getDoithong(sodoithong);
				if(results.length ==0) {
					//tim them tu quy
					results = this._getTuQuy();
				}
			break;
			case 4:
				results = this._getDoithong(sodoithong);
			break;
			case 5:
				results = this._getTuQuyTohon();
				if(results.length == 0) {
					results = this._getDoithong(3);
				}
			break;
		}
		return results;
	}

	/**
	 * @method _getSelectNgang
	 * @return {Array}
	 */
	TUPhom.prototype._getSelectNgang = function () {
		var self = this;
		var cards = [];
		var cfl = self.cardsFire.length;
		//cards
		cards = self.getCartsByRank(self.rank);

		if(cards.length < cfl.length) {
			return [];
		}
		if(cfl == 2 && TUPhom.getRank(self.cardsFire[0]) == self.rank) {
			var max1 = self.cardsFire[1] % 4;
			var max2 = cards[0].getValue() % 4;
			var max3 = cards[1].getValue() % 4;
			if(max2 < max3) {
				max2 = max3;
			}

			if(max1 > max2) {
				cards = [];
			}
		} else if(self.rank > TUPhom.getRank(self.cardsFire[0])){
			cards = cards.slice(0, cfl - 1);
			if(cards.indexOf(self.card) == -1) {
				cards.push(self.card);
			}
		} else {
			cards = [];
		}
		return cards;
	}


	/**
	 * @method getCartByRank
	 * 
	 * @return {Number} rank
	 * @return {gbjs.Card}
	 */
	TUPhom.prototype.getCartByRank = function(rank) {
		return _.find(this.handCards, function(card) {
			return (TUPhom.getRank(card.getValue()) == rank);
		});
	}

	/**
	 * @method getCartByRank
	 * 
	 * @return {Number} rank
	 * @return {<Array<gbjs.Card>}
	 */
	TUPhom.prototype.getCartsByRank = function(rank) {
		return _.filter(this.handCards, function(card) {
			return (TUPhom.getRank(card.getValue()) == rank);
		});
	}

	/**
	 * @method isUndefined
	 * 
	 * @return {boolean}
	 */
	TUPhom.isUndefined = function(fn) {
		return (typeof(fn) == 'undefined');
	}

	/**
	 * @method _getDoc
	 * 
	 * @return {Array<Null, gbjs.Card<Object>>}
	 */
	TUPhom.prototype._getDoc = function() {
		var self = this;
		var results = [];
		var card = self.card;
		var rankOfCardSelect = self.rank;
		var rankOfCardFire = TUPhom.getRank(self.cardsFire[0]);
		if(rankOfCardSelect < rankOfCardFire) {
			return [];
		}
		results.push(card);
		for(var i = 1; i < this.cardsFire.length; i++) {
			rankOfCardSelect++;

			card = _.find(self.handCards, function(handCard) {
				if(TUPhom.getRank(handCard.getValue()) == rankOfCardSelect) {
					if(i != (self.cardsFire.length - 1)) {
						return true;
					}
					if(handCard.getValue() > self.cardsFire[i]) {
						return true;
					}
				}
				return false;
			})
			if(!TUPhom.isUndefined(card)) {
				results.push(card);
			}  else {
				return [];
			}
			
		}
		return results;
	}

	/**
	 * @method getRank
	 * 
	 * @param  {Card<Object>} card
	 * @return {Number}
	 */
	TUPhom.getRank = function(card) {
		return Math.floor(card/4);
	}

	/**
	 * @method getPhomSpecial
	 * 
	 * @return {Array} cards
	 * @return {Number}
	 */
	TUPhom.getPhomSpecial = function(cards) {
		var result = 0, rank1, rank2;
		switch(cards.length) {
			// check tu quy
			case 4:
				rank1 = TUPhom.getRank(cards[0]);
				rank2 = TUPhom.getRank(cards[1]);
				if(rank1 == rank2) {
					result = 5;
				}
			break;
			// check đôi thông
			case 6:
				rank1 = TUPhom.getRank(cards[0]);
				rank2 = TUPhom.getRank(cards[2]);
				if (rank1 == (rank2 - 1)){
					result = 3; //"3 ĐÔI THÔNG";
				}
			break;
			case 8:
				rank1 = TUPhom.getRank(cards[0]);;
				rank2 = TUPhom.getRank(cards[2]);;
				if (rank1 == (rank2 - 1)){
					result = 4; //"4 ĐÔI THÔNG";
				}
			break;
		}

		return result;
	}

	gbjs.TUPhom = TUPhom;
})();
this.FATE = this.FATE || {};

(function() {
	"use strict";
        
	function MockupServer(cardsFire, card) {

		/**
		 * @protected
		 * @type {gbjs.Card<Object>}
		 */
		this.card = card;

		/**
		 * @protected
		 * @type {gbjs.HandContainer<Object>}
		 */
		this.parent = this.card.parent;
		/**
		 * @protected
		 * @type {String}
		 */
		this.value = this.card.getValue();
		/**
		 * @protected
		 * @type {Number}
		 */
		this.index = this.parent.getChildIndex(this.card);

		/**
		 * @protected
		 * @type {Number}
		 */
		this.rank = TUPhom.getRank(this.value);

		/**
		 * @protected
		 * @type {Array<gbjs.Card>}
		 */
		this.handCards = this.parent.children;
		/**
		 * @protected
		 * @type {Array<Number>}
		 */
		this.cardsFire = cardsFire;
	}


	FATE.MockupServer = MockupServer;
})();
this.TWIST = this.TWIST || {};

(function () {
    "use strict";
    
    function Card(position) {
        if (typeof position !== 'number' || position < 0 || position > 51)
            position = -1;
        this.initialize(position);
    }

    Card.userCard = {width: 90, height: 123, seperator: 91, cardDraggable: true, selectedHeight: 30, scale: 1};
    Card.playerCard = {width: 45, height: 61.5, seperator: 0, cardDraggable: false, scale: 0.5};
    Card.draftCard = {width: 45, height: 61.5, seperator: 46, scale: 0.5};
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
    Card.size = {  width: 88,height: 115};

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
        cards.src = "img/gamePlay/canvas/cards.png";
        var bg = new createjs.Bitmap(cards);
        bg.sourceRect = $.extend({},Card.size);

        if (value !== -1) {
            Card.RankMapIndex = Card.CardIndexType || ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"];
            var rankName = Card.RankMapIndex[rankSuite.rank];
            var suidName = Card.SuitMap[rankSuite.suite];
            bg.sourceRect.x = (rankName - 1) * Card.size.width;
            bg.sourceRect.y = rankSuite.suite * Card.size.height;
        } else {
            bg.sourceRect.x = 0;
            bg.sourceRect.y = Card.size.height * Card.SuitNameMap.length;
        }

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

    p.openCard = function (cardValue, callback) {
        var oldX = this.x;
        var _self = this;
        return createjs.Tween.get(this)
                .to({scaleX: 0.1, x: oldX + this.width / 2}, 150)
//                        .set({sourceRect: Card.cropImage(cardValue)})
                .call(function () {
                    this.setValue(cardValue);
                    this.cardValue = cardValue;
                    //this.updateCache();
                })
                .to({scaleX: this.width / Card.userCard.width, x: oldX}, 150).call(function () {
            this.setInPhom(this.isInPhom);
            if (typeof callback == "function") {
                callback();
            }
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
                try {
//                            console.log(_self.position);
                    if (!_self.selected) {
                        $rootScope.playerEvent = {evt: "cardSelected", data: _self};
                        $rootScope.digest();
                    }
                    _self.setSelected(!_self.selected);
                } catch (e) {
                    console.warn(e);
                }
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
this.TWIST = this.TWIST || {};

(function () {
    "use strict";
    var imagePath, CONFIG;
    var imagePath = location.origin + location.pathname + 'images/';

    function Desk(gameType) {
        this.initialize(gameType);
    }

    Desk.playerPositions = {
        4: [{x: 12, y: 410}, {x: 1110, y: 184}, {x: 583, y: 17}, {x: 71, y: 193}],
        2: [{x: 12, y: 410}, {x: 583, y: 17}],
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


    Desk.width = 1280;
    Desk.height = 720;

    // vi tri gua ban
    Desk.position = {x: 640, y: 360};

    Desk.draftPosition = {x: 500, y: 280, rotateDeg: 0};

    p.initialize = function (gameType) {
        this.container_initialize();
        var _self = this;
        gameType = gameType || {};

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
            x: Desk.position.x - 10,
            y: Desk.position.y + 40,
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
        var maxUser = gameType.maxUser || 4;

        var playerPosition = new Array(maxUser);
        var handPosition = new Array(maxUser);
        var draftPosition = new Array(maxUser);

        for (var i = 0; i < maxUser; i++) {
            playerPosition[i] = {x: 0, y: 0};
            draftPosition[i] = {x: 50, y: 50};
            handPosition[i] = {
                x: 110,
                y: 10,
                align: 'right'
            };
        }

        if (maxUser === 4) {
            playerPosition = Desk.playerPositions[maxUser];
            handPosition[0] = {x: 150, y: -110, align: 'center'};
            handPosition[1] = {x: -50, y: 20, align: 'left'};
        }

        this.playerPosition = playerPosition;
        this.handPosition = handPosition;
        this.draftPosition = draftPosition;
        this.NumberCardInHand = gameType.NumberCardInHand;
    };

    p.generateCards = function (numberPlayer) {
        if (typeof numberPlayer === 'undefined')
            numberPlayer = 4;
        var numberCard = this.NumberCardInHand * numberPlayer;
        for (var i = 0; i < numberCard; i++) {
            var cardImage = new TWIST.Card();
            cardImage.set({
                scaleX: 0.8,
                scaleY: 0.8
            });
            this.deckCard.addChild(cardImage);
        }
        this.deckCard.visible = true;
    };

    p.generateDealCards = function (numberPlayer) {
        if (typeof numberPlayer === 'undefined')
            numberPlayer = 4;
        var numberCard = numberPlayer;
        for (var i = 0; i < numberCard; i++) {
            var cardImage = new TWIST.Card();
            cardImage.set({
                scaleX: 0.5,
                scaleY: 0.5
            });
            this.deckCard.addChild(cardImage);
        }
        this.deckCard.visible = true;
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
                miliseconTimeText.text = Math.floor((miliseconTime - (currentTime - startTime)) / 1000);
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
this.TWIST = this.TWIST || {};

(function () {
    "use strict";

    function Timer(params) {
        this.set({x: 50, y: 50, radius: 43, startTime: 0, totalTime: 0, remainingTime: 0, currentTimer: 0, delayTime: 100});
        this.initialize(params)
    }
    
    var p = Timer.prototype = new createjs.Container();
    p.Container_initialize = p.initialize;
    p.initialize = function (params) {
        this.Container_initialize();
        $.extend(this, params);
        this.timerLine = new createjs.Shape();
        this.addChild(this.timerLine);

        this.startAngle = 0;
        this.endAngle = 0;

    };
    p.drawPercentRect = function (currentTimer) {
        this.timerLine.graphics.clear();
        this.startAngle = Math.PI * 3 / 2 - currentTimer * Math.PI * 2;
        this.endAngle = Math.PI * 2 - Math.PI * 1 / 2;
        this.timerLine.graphics.s("#fee802").ss(14).arc(this.x, this.y, this.radius, this.startAngle, this.endAngle, false);
    };
    p.setCounter = function (totalTime, remainingTime, callback) {
        if (typeof totalTime == 'undefined' || totalTime <= 0)
            return;
        if (typeof remainingTime == 'undefined' || remainingTime < 0 || remainingTime > totalTime)
            remainingTime = totalTime;
        if (typeof callback == 'function')
            this.callback = callback;
        this.totalTime = totalTime;
        this.remainingTime = remainingTime;
        this.startTime = (new Date()).getTime() - (totalTime - remainingTime);
        this.currentTimer = (this.totalTime - remainingTime) / this.totalTime
    };
    p.clearTimer = function () {
        if (this.tween) {
            this.tween.removeAllEventListeners();
        }
        this.timerLine.graphics.clear();
        this.totalTime = 0;
        this.remainingTime = 0;
        this.currentTimer = 0;
        if (this.callback) {
            this.callback = null;
            delete this.callback
        }
    };
    p.tick = function () {
        if (this.currentTimer >= 1 || this.totalTime == 0 || !this.totalTime) {
            if (this.callback)
                this.callback();
            this.clearTimer();
            return
        }
        ;
        this.currentTimer = ((new Date()).getTime() - this.startTime) / this.totalTime;
        this.drawPercentRect(this.currentTimer);
    };

    p.startTimer = function (totalTime, remainingTime, callback) {
        this.timerLine.graphics.clear();
        this.setCounter(totalTime, remainingTime, callback);
        this.tween = createjs.Tween.get(this.timerLine)
                .to({endAngle: 2 * Math.PI}, remainingTime, createjs.Ease.linear)
                .call(function () {
                    this.graphics.clear();
                });
        var _self = this;
        this.tween.addEventListener("change", function () {
            _self.tick();
        });
    };

    TWIST.Timer = Timer;
})();
this.TWIST = this.TWIST || {};

(function () {
    "use strict";
    console.log(location);

    var imagePath = location.origin + location.pathname + '../src/images/player/';
    var _animationTime = 300;


    function Player(playerData) {
        this.initialize(playerData);
    }

    Player.Defaults = {
        UserName: 'username',
        Position: 0
    };

    Player.usernameConfig = {x: 0, y: 70, width: 100, height: 40};

    Player.avatarConfig = {x: 15, y: 0, radius: 35, innerRadius: 33, AvatarDefault: imagePath + 'avatars/1.png'};

    Player.handConfig = {x: 100, y: 100};

    Player.draftCardsConfig = {x: 100, y: 100, align : "left"};

    var p = Player.prototype = new createjs.Container();

    p.contructor_initialize = p.initialize;

    p.initialize = function (data) {
        console.log(data);
        this.contructor_initialize();
        $.extend(this, data);
        this.initCanvas();
    };

    p.initCanvas = function () {
        var self = this;
        var config = this.config || {};

//        username container
        
        var usernameContainer = new createjs.Container();
        var usernameConfig = config.username || Player.usernameConfig;
        $.extend(usernameContainer,usernameConfig);

        var usernameText = new createjs.Text(Player.Defaults.UserName + ' ' + this.position, '18px Roboto Condensed', 'white');
        usernameText.set({x: 50, y: 20, textAlign: 'center', textBaseline: 'bottom'});
        var moneyText = new createjs.Text('1000', '14px Roboto Condensed', '#f3ba04');
        moneyText.set({x: 50, y: 40, textAlign: 'center', textBaseline: 'bottom'});
        var usernameBg = new createjs.Shape();
        usernameBg.graphics.beginFill("black").drawRoundRectComplex(0, 0, usernameConfig.width, usernameConfig.height, 10, 10, 10, 10);
        usernameBg.alpha = 0.4;
        usernameContainer.addChild(usernameBg, usernameText, moneyText);
        this.usernameContainer = usernameContainer;

//        avatar container

        var avatarContainer = new createjs.Container();
        var avatarConfig = config.avartar || Player.avatarConfig;
        var avatarImageDiameter = avatarConfig.innerRadius * 2;
        $.extend(avatarContainer,avatarConfig);

        var avatarImage = new Image();
        avatarImage.src = this.avatar || avatarConfig.AvatarDefault;
        var avatarBitmap = new createjs.Bitmap(avatarImage);
        avatarImage.onLoad = function () {
            avatarBitmap.set({
                width: avatarImageDiameter,
                height: avatarImageDiameter,
                scaleX: avatarImageDiameter / avatarImage.width,
                scaleY: avatarImageDiameter / avatarImage.height
            });
        };
        
        var maskShape = new createjs.Shape();
        maskShape.graphics.drawCircle(avatarConfig.radius, avatarConfig.radius, avatarConfig.innerRadius);
        avatarBitmap.mask = maskShape;

        var avatarBg = new createjs.Shape();
        avatarBg.graphics.beginFill('#000').drawCircle(avatarConfig.radius, avatarConfig.radius, avatarConfig.radius);
        avatarBg.set({alpha: 0.7});

        var roomMaster = new createjs.Bitmap(imagePath + 'icon_chuphong.png');
        roomMaster.set({x: avatarImageDiameter * 0.7, y: avatarImageDiameter * 0.7,
            name: "roomMaster", visible: true
        });
        var avatarHit = new createjs.Shape();
        avatarHit.graphics.beginFill('#fff').drawRect(0, 0, avatarImageDiameter, avatarImageDiameter);
        avatarContainer.hitArea = avatarHit;

        avatarContainer.addChild(avatarBg, avatarBitmap, roomMaster);
        this.avatarContainer = avatarContainer;

//        draft cards

        var draftCardsConfig = config.draftCards || Player.draftCardsConfig;
        this.draftCards = new createjs.Container();
        $.extend(this.draftCards,draftCardsConfig);

//        hand container

        var handConfig = config.hand || Player.handConfig;
        this.hand = new createjs.Container();
        $.extend(this.hand,handConfig);
        
        this.handCards = new createjs.Container();
        this.numberOfCards = new createjs.Container();
        this.numberOfCards.set({x: 10, y: 10});
        var numberOfCardsBg = new createjs.Shape();
        numberOfCardsBg.graphics.beginFill('#000').drawCircle(22.5, 31, 17);
        numberOfCardsBg.set({alpha: 0.7, x: 0, y: 0, visible: false});
        var numberOfCards = new createjs.Text("", '24px Roboto Condensed', '#7fc100');
        numberOfCards.set({x: 22.5, y: 31, textAlign: 'center', visible: false, name: "numberOfCard", textBaseline: 'middle'});
        this.numberOfCards.addChild(numberOfCardsBg, numberOfCards);
        
        this.hand.addChild(this.handCards, this.numberOfCards);

        //show chat message
        this.chat = new createjs.Container();
        this.chat.set({name: 'chat'});
        var chatText = new createjs.Text('', '22px Roboto Condensed', '#000');
        chatText.set({textAlign: 'center', textBaseline: 'bottom'});
        var chatBg = new createjs.Shape();
        this.chat.addChild(chatBg, chatText);

        //show change money effect
        this.moneyChangeEffect = new createjs.Container();
        this.moneyChangeEffect.set({name: 'moneyChangeEffect', x: 50, y: 50});
        var moneyChangeBg = new createjs.Text("", "30px Roboto Condensed", "black");
        moneyChangeBg.set({x: 1, y: 11, textAlign: 'center', textBaseline: 'bottom'});
        var moneyChangeText = new createjs.Text("", "30px Roboto Condensed");
        moneyChangeText.set({x: 0, y: 10, textAlign: 'center', textBaseline: 'bottom'});
        moneyChangeText.shadow = new createjs.Shadow("#000", 0, 0, 10);
        this.moneyChangeEffect.addChild(moneyChangeBg, moneyChangeText);

        //player status
        this.status = new createjs.Container();
        this.status.set({x: 50, y: 50});
        var statusBg = new createjs.Text();
        var statusText = new createjs.Text();
        this.status.addChild(statusBg, statusText);


        this.timer = new TWIST.Timer({x: avatarConfig.x, y: avatarConfig.y});

        this.addChild(this.timer, this.avatarContainer, this.usernameContainer, this.draftCards, this.hand, this.status, this.chat, this.moneyChangeEffect);
    };

    p.render = function (player) {
        this.setPlayerName(this.playerModel.userName);
        this.setMoney(this.playerModel.money);
        this.setRoomMaster(this.playerModel.isMaster);
        return;
    };


    p.setPlayerName = function (name) {

        var usernameContainer = this.usernameContainer;
        if (!usernameContainer)
            return;
        usernameContainer.visible = true;
        var usernameText = usernameContainer.getChildAt(1);
        usernameText.text = name;
        var measuredWidth = usernameText.getMeasuredWidth();
        if (measuredWidth > 140) {
            var ratio = 140 / measuredWidth;
            var newLength = Math.round(usernameText.text.length * ratio) - 3;
            usernameText.text = usernameText.text.substring(0, newLength) + "...";
        }
    };


    p.setMoney = function (money) {
        var usernameContainer = this.usernameContainer;
        this.playerModel.money = money;
        if (!usernameContainer)
            return;
        usernameContainer.visible = true;
        var moneyText = usernameContainer.getChildAt(2);
        moneyText.text = Global.numberWithDot(money);
        return;
    };

    p.setRoomMaster = function (roomMaster) {
        var avatarContainer = this.avatarContainer;
        if (!avatarContainer)
            return;
        var roomMasterImage = avatarContainer.getChildByName("roomMaster");
        if (roomMaster)
            roomMasterImage.visible = true;
        else
            roomMasterImage.visible = false;
    };

    p.clearHand = function () {
        this.handCards.removeAllChildren();
        var cardNumberBg = this.hand.getChildAt(1);
        var cardNumber = this.hand.getChildAt(2);
        cardNumberBg.visible = false;
        cardNumber.visible = false;
    };

    p.clearDraftCards = function () {
        if (this.draftCards) {
            this.draftCards.removeAllChildren();
        }
    };

    p.clearShowPhomArea = function () {
        if (this.showPhomArea) {
            this.showPhomArea.removeAllChildren();
        }
    };


    p.setPlayerStatus = function (status, options) {
        var statusContainer = this.status;
        var statusText = statusContainer.getChildAt(1);
        var statusBg = statusContainer.getChildAt(0);

        if (!status || !status.length) {
            statusContainer.visible = false;
            return;
        }
        if (!options)
            options = {};
        options.color = options.color || "yellowgreen";
        options.font = options.font || 'bold 20px Roboto Condensed';
        options.x = options.x || 0;
        options.y = options.y || 10;
        options.textAlign = options.textAlign || 'center';
        options.textBaseline = options.textBaselinex || 'bottom';
        $.extend(statusText, options);
        $.extend(statusBg, options);
        statusContainer.visible = true;
        statusText.text = statusBg.text = status;
        statusText.shadow = new createjs.Shadow('black', 0, 0, 10);
        statusBg.x = options.x + 1;
        statusBg.y = options.y + 1;
        statusBg.color = "black";
    };


    p.renderCards = function (options) {
        var hand = this.hand;
        if (!hand)
            return;

        hand.visible = true;

        this._renderHandCards(this.playerModel.handCards, options);
        var _self = this;
        if (this.hideCardLength) {
            var cardNumberBg = hand.getChildAt(1);
            cardNumberBg.visible = false;
            var cardNumber = hand.getChildAt(2);
            cardNumber.visible = false;
        } else {
            setTimeout(function () {
                _self.setNumberCards(_self.playerModel.handCards.length);
            }, 1000);
        }

    };

    p._renderHandCards = function (listCard, options) {
        var _self = this;
        if (!listCard || listCard.length == 0)
            return;

        options = options || {};

        this.handCards.removeAllChildren();

        var handCards = this.handCards,
                cardType = options.cardType || (this.position == 0 ? TWIST.Card.userCard : TWIST.Card.playerCard),
                numberCard = listCard.length,
                desk = this.parent.parent.getChildByName('desk'),
                dealTimeAnimation = 150,
                eachCardDelay = 30,
                animationTime,
                setReSort = !(typeof (options.reSort) == "undefined");
        for (var i = 0; i < numberCard; i++) {
            var card = listCard[i], cardImage;
            cardImage = desk.getCard();
            if (!cardImage)
                cardImage = new TWIST.Card();
            cardImage.cardValue = listCard[i];
            cardImage.position = i;
            animationTime = dealTimeAnimation + i * eachCardDelay;
            $.extend(options, {
                animationTime: animationTime
            });
            if ((i == numberCard - 1) && !setReSort) {
                options.reSort = true
            }
            ;
            this.addHandCards(cardImage, options);
        }
    };

    p.setNumberCards = function (numOfCards) {

        var cardNumberBg = this.hand.getChildAt(1);
        var cardNumber = this.hand.getChildAt(2);

        if (this.position != 0 && numOfCards > 0) {
            cardNumberBg.visible = true;
            cardNumber.visible = true;
            cardNumber.text = numOfCards;

        } else {
            cardNumberBg.visible = false;
            cardNumber.visible = false;
        }
    };

    p.addHandCards = function (card, options) {
        var animationTime = options.animationTime || _animationTime;
        var reSort = options.reSort || false;
        var handCards = this.handCards;
        var _self = this;
        var bai = TWIST.Card.draftCard;

        var position = card.pos || handCards.children.length,
                oldX = card.x,
                oldY = card.y,
                cardType = options.cardType || (this.position == 0 ? TWIST.Card.userCard : TWIST.Card.playerCard);
        card.set({
            x: card.x - this.x - this.hand.x,
            y: card.y - this.y - this.hand.y,
            scaleX: bai.scale,
            scaleY: bai.scale
        });
        if (this.listPhom && this.listPhom.length && card.cardValue && this.position == 0) {
            var cardsInPhom = [];
            this.listPhom.forEach(function (item, index) {
                cardsInPhom = cardsInPhom.concat(item.meldItem);
            });
            card.isInPhom = cardsInPhom.indexOf(card.cardValue) > -1;
        }
        handCards.addChild(card);
        createjs.Tween.get(card).to({
            x: isNaN(options.x) ? cardType.seperator * handCards.getNumChildren() : options.x,
            y: isNaN(options.y) ? 0 : options.y,
            width: cardType.width,
            height: cardType.height,
            position: handCards.getNumChildren() - 1,
            seperator: cardType.seperator,
            scaleX: cardType.scale,
            scaleY: cardType.scale
        }, animationTime, createjs.Ease.sineOut()).call(function () {
            if (_self.position == 0) {
                if (!options.sideDown) {
                    this.bindEventListener();
                    if (options.dragable) {
                        this.setDraggable(true);
                    }
                } else {
                    this.bindOpenCard();
                }
                if (!options.sideDown) {
                    this.openCard(this.cardValue);
                }
                if (options.sortPhom) {
                    _self.sortPhom();
                }
                if (reSort) {
                    _self.sortCard();
                }
            } else {
                this.visible = options.showPlayerCard;
                if (options.openCard) {
                    this.openCard(this.cardValue);
                }
            }
        });
    };

    p.showThreeCards = function () {
        var cards = this.handCards.children;
        for (var i = 0; i < cards.length; i++) {
            var card = cards[i];
            card.openCard(card.cardValue);
            card.removeAllEventListeners();
        }
    };


    p.getDeckCard = function (cardValue, options) {
        options = options || {};
        var desk = this.parent.parent.getChildByName('desk'),
                cardImage = desk.getCard();
        cardImage.cardValue = cardValue;
        $.extend(options, {
            animationTime: 200,
            reSort: true,
            dragable: true
        });
        this.addHandCards(cardImage, options);
        this.markEatedCard();
    };

    p.getChuong = function (options) {
        var _self = this;
        options = options || {};
        var avatarContainer = this.avatarContainer;
        var chuongIcon = avatarContainer.getChildByName("chuongIcon");

        if (options.isChuong) {
            var newX = chuongIcon.x, newY = chuongIcon.y;
            var oldGlobalX = options.x || 640;
            var oldGlobalY = options.y || 360;
            var oldX = oldGlobalX - this.x - this.avatarContainer.x;
            var oldY = oldGlobalY - this.y - this.avatarContainer.y;
            chuongIcon.set({
                x: oldX,
                y: oldY,
                visible: true
            });
            createjs.Tween.get(chuongIcon).to({
                x: newX,
                y: newY
            }, _animationTime).call(function () {
                _self.playerModel.isBanker = true;
            });
        } else {
            _self.playerModel.isBanker = false;
            chuongIcon.set({visible: false});
        }
    };

    p.draftCardsInHand = function (data, options) {
        var options = options || {},
                cardsToDrash = [],
                bai = TWIST.Card.draftCard,
                cardsToDrash = this.getCardsInHand(data),
                draftCards = options.draftCards || this.draftCards;
        var newPosition = options.position || {
            x: draftCards.children.length * bai.seperator,
            y: 0
        };
        if (this.draftCards.align == "right" && !options.position) {
            newPosition.x = 300 - newPosition.x
        }
        for (var i = 0, length = cardsToDrash.length; i < length; i++) {
            var card = cardsToDrash[i];
            card.cardValue = data[i];
            var newOptions = $.extend(options, {
                draftCards: draftCards,
                position: newPosition,
                reSort: i == length - 1
            });
            this.draftSingleCard(card, newOptions);
            if (this.draftCards.align == "right" && !options.position) {
                newPosition.x -= bai.seperator;
            } else {
                newPosition.x += bai.seperator;
            }
        }
        this.numberOfCards.text = this.handCards.children.length;
    };

    p.draftSingleCard = function (card, options) {
        card.visible = true;
        card.removeAllEventListeners();
        var _self = this,
                bai = TWIST.Card.draftCard,
                draftCards = options.draftCards || this.draftCards;

        var draftPosition = draftCards.localToGlobal(0, 0);
        card.set({
            x: card.x + this.hand.x + this.x - draftPosition.x,
            y: card.y + this.hand.y + this.y - draftPosition.y,
            rotation: options.rotateAble ? (Math.random() - 0.5) * 30 : 0
        });
        draftCards.addChild(card);
        createjs.Tween.get(card).to({
            scaleX: card.scaleX * 1.2,
            scaleY: card.scaleY * 1.2
        }, _animationTime * 1 / 2).to({
            x: options.position.x, y: options.position.y,
            width: bai.width,
            height: bai.height,
            scaleX: bai.scale,
            scaleY: bai.scale
        }, _animationTime * 1 / 2).call(function () {
            if (_self.position != 0) {
                this.openCard(this.cardValue);
            } else if (options.reSort) {
                this.setInPhom(false);
                _self.sortCard();
            }
        });
    };
    p.sortDraftCards = function () {

        var cards = this.draftCards.children;
        var _self = this;

        var length = cards.length;
        var indexLeft = (1280 - length * TWIST.Card.draftCard.seperator - (this.draftCards.x + this.x) * 2) / 2;

        for (var i = 0; i < cards.length; i++) {
            var card = cards[i];
            var newX = indexLeft + i * TWIST.Card.draftCard.seperator;

            createjs.Tween.get(card).to({
                x: newX
            }, _animationTime, createjs.Ease.sineOut()).call(function () {});
        }
    };
    p.getCardsInHand = function (cardList) {
        if (!cardList)
            return;
        var cards = [];
        var handCards = this.handCards.children;
        var handCardValue = handCards.map(function (item) {
            return item.cardValue
        });
        if (this.position != 0) {
            for (var i = 0; i < cardList.length; i++) {
                var cardIndex = cardList[i];
                var handCardValue = handCards.map(function (item) {
                    return item.cardValue
                });
                if (handCardValue.indexOf(cardIndex) > -1) {
                    var sliceCards = handCards.splice(handCardValue.indexOf(cardIndex), 1);
                } else {
                    var sliceCards = handCards.splice(handCardValue.indexOf(undefined), 1);
                }
                if (!sliceCards[0]) {
                    sliceCards[0] = new TWIST.Card();
                }
                cards = cards.concat(sliceCards);
            }
//                    cards = handCards.slice(0, cardList.length);
        } else {
            for (var i = 0; i < cardList.length; i++) {
                for (var j = 0; j < handCards.length; j++) {
                    if (cardList[i] == handCards[j].cardValue) {
                        cards = cards.concat(handCards.splice(j, 1));
                        j--;
                    }
                }
            }
        }
        handCards.sort(function (a, b) {
            return a.position - b.position;
        });
        handCards.forEach(function (item, index) {
            item.position = index;
        });
        cards.sort(function (a, b) {
            return a.cardValue - b.cardValue;
        });
        return cards;
    };

    p.getSelectedCards = function () {
        var selectedCards = [];
        var cards = this.handCards.children;

        for (var i in cards) {
            if (cards[i] && cards[i].selected == true)
                selectedCards.push(cards[i].cardValue);
        }
        return selectedCards;
    };

    p.sortPhom = function (phomList) {
        if (!phomList)
            phomList = this.listPhom;
        if (!phomList)
            phomList = [];
        phomList = phomList;
        var cards = this.handCards.children;
        var cardsInPhom = [];
        for (var i = 0; i < phomList.length; i++) {
            var phom = phomList[i].meldItem;
            phom.sort(function (a, b) {
                return a - b
            });
            for (var j = 0; j < phom.length; j++) {
                cardsInPhom.push(phom[j]);
            }
        }
        if (!this.handCards.sortType) {
            this.handCards.sortType = ""
        }
        if (this.handCards.sortType == "rankSort") {
            this.handCards.sortType = "suiteSort"
        } else
            this.handCards.sortType = "rankSort";
        var _self = this;

        cards.forEach(function (item, index) {
            item.setInPhom(cardsInPhom.indexOf(item.cardValue) > -1);
        });
//                this.sortCard();

        cards.sort(function (a, b) {
            if (cardsInPhom.indexOf(a.cardValue) > -1 && !(cardsInPhom.indexOf(b.cardValue) > -1)) {
                return false
            } else if (cardsInPhom.indexOf(b.cardValue) > -1 && !(cardsInPhom.indexOf(a.cardValue) > -1)) {
                return true;
            } else if (cardsInPhom.indexOf(a.cardValue) > -1 && cardsInPhom.indexOf(b.cardValue) > -1) {
                return cardsInPhom.indexOf(a.cardValue) - cardsInPhom.indexOf(b.cardValue);
            }
            if (_self.handCards.sortType == "rankSort") {
                return a.cardValue - b.cardValue;
            } else {
                if (a.suite == b.suite) {
                    return a.rank - b.rank
                }
                return a.suite - b.suite
            }

        });
    };

    p.sortTL = function () {
        var cards = this.handCards.children;
        this.handCards.sortType = (this.handCards.sortType == "rankSort") ? "suiteSort" : "rankSort";
        var _self = this;
        cards.sort(function (a, b) {
            if (_self.handCards.sortType == "rankSort") {
                return a.cardValue - b.cardValue;
            } else {
                return a.suite - b.suite || a.cardValue - b.cardValue
            }

        });
        this.sortCard();
    };

    p.sortCard = function () {
        var cards = this.handCards.children;
        var _self = this;
        setTimeout(_sortCard, 100);
        function _sortCard() {
            var length = cards.length;
//                    cards.sort(function(a,b){
//                        return a.position - b.position
//                    });
            var indexLeft = (1280 - length * TWIST.Card.userCard.seperator - (_self.hand.x + _self.x) * 2) / 2;
            _self.handCards.indexLeft = indexLeft;

            for (var i = 0; i < cards.length; i++) {
                var card = cards[i];
                if (card.isDragging) {
                    card.isDragging = false;
                }
                card.selected = false;
                var newX = indexLeft + i * TWIST.Card.userCard.seperator;
                card.position = i;
                createjs.Tween.get(card).to({
                    y: 0,
                    x: newX
                }, _animationTime, createjs.Ease.sineOut()).call(function () {
                });
            }
        }
    };

    p.preparedShowPhom = function () {
        var phomList = this.listPhom;
        var cardsInPhom = [];
        phomList = phomList;
        for (var i = 0; i < phomList.length; i++) {
            var phom = phomList[i].meldItem;
            phom.sort(function (a, b) {
                return a - b
            });
            for (var j = 0; j < phom.length; j++) {
                cardsInPhom.push(phom[j]);
            }
        }

        var cards = this.handCards.children;

        for (var i = 0; i < cards.length; i++) {
            if (i < cardsInPhom.length) {
                (function (card) {
                    setTimeout(function () {
                        card.setSelected(true);
                    }, 500);
                })(cards[i])
            } else {
                cards[i].setSelected(false);
            }
        }
    };

    p.preparedSendCard = function (sendList) {
        var cards = this.handCards.children;
        for (var i = 0; i < cards.length; i++) {
            cards[i].setSelected(false);
            for (var j = 0; j < sendList.length; j++) {
                if (cards[i].cardValue == sendList[j]) {
                    (function (card) {
                        setTimeout(function () {
                            card.setSelected(true);
                        }, 500);
                    })(cards[i])
                }
            }
        }
    };

    p.getLastDraftCards = function (cardList) {
        if (!cardList)
            return;
        var cards = [];
        var _self = this;
        var draftCards = this.draftCards.children;
        for (var i = 0; i < cardList.length; i++) {
            for (var j = 0; j < draftCards.length; j++) {
                if (cardList[i] == draftCards[j].cardValue) {
                    var position = draftCards[j].localToGlobal(0, 0);
                    draftCards[j].x = position.x;
                    draftCards[j].y = position.y;
                    cards = cards.concat(draftCards.splice(j, 1));
                    j--;
                }
            }
        }
        return cards;
    };

    p.getDraftCardsAbsolutePosition = function () {
        return {
            x: this.x + this.draftCards.x,
            y: this.y + this.draftCards.y
        };
    };

    p.eatCard = function (card, position, cardSordList) {
        var _self = this;
        this.playerModel.numberEatedCard++;
        var bai = (this.position == 0 ? TWIST.Card.userCard : TWIST.Card.draftCard);

        card.hightLight();
        if (this.position == 0) {
            this.addHandCards(card, {
                animationTime: 200,
                reSort: true,
                sortPhom: true,
                dragable: true
            });
            this.markEatedCard();
        } else {
            var newX = bai.seperator * this.draftCards.children.length,
                    newY = 0;
            this.handCards.addChild(card);
            card.set({x: card.x - this.hand.x - this.x, y: card.y - this.hand.y - this.y});
            newY = 0;
            if (this.draftCards.align == "right") {
                newX = 0 - this.hand.x + this.draftCards.x + 300 - (this.playerModel.numberEatedCard - 1) * bai.seperator;
            } else {
                newX = 0 - this.hand.x + this.draftCards.x + bai.seperator * (this.playerModel.numberEatedCard - 1);
            }
            createjs.Tween.get(card).to({
                x: newX, y: newY,
                width: bai.width,
                height: bai.height,
                scaleX: bai.scale,
                scaleY: bai.scale
            }, _animationTime, createjs.Ease.sineOut()).call(function () {});
        }
    };

    p.markEatedCard = function () {
        var cardsInPhom = [];
        if (!this.listPhom)
            return;
        this.listPhom.forEach(function (item, index) {
            cardsInPhom = cardsInPhom.concat(item.meldItem);
        });

        var cards = this.handCards.children;
        for (var i = 0; i < cards.length; i++) {
            cards[i].isInPhom = cardsInPhom.indexOf(cards[i].cardValue) > -1;
            cards[i].setInPhom(cards[i].isInPhom);
        }
    }

    p.moveDraftCard = function (cards, position) {
        this.cardsEated++;
        var bai = TWIST.Card.draftCard;

        for (var i = 0; i < cards.length; i++) {
            var card = cards[i];
            var oldX = card.x,
                    oldY = card.y,
                    newX = bai.seperator * this.draftCards.children.length,
                    newY = 0;
            this.draftCards.addChild(card);
            card.set({x: card.x + position.x - this.draftCards.x - this.x, y: card.y + position.y - this.draftCards.y - this.y});

            if (this.draftCards.align == "right") {
                newX = 300 - bai.seperator * (this.draftCards.children.length - 1)
            }
            var _self = this;
            createjs.Tween.get(card).to({
                x: newX, y: newY,
                width: bai.width,
                height: bai.height,
                scaleX: bai.scale,
                scaleY: bai.scale
            }, _animationTime, createjs.Ease.sineOut()).call(function () {

            });
        }
    };

    p.showPhom = function (phoms) {
        var cardsToDrash = [];
        for (var i = 0; i < phoms.length; i++) {
            var phom = phoms[i].meldItem;
            this.showSinglePhom(phom, i);
        }
        ;
        var _self = this;
        setTimeout(function () {
            _self.sortPhomArea();
        }, 550);
    };

    p.addShowPhomArea = function (player) {
        var desk = this.parent.parent.getChildByName('desk'),
                draftPosition = desk.draftPosition[this.position];
        var newY = 0;
        if (this.position == 0) {
            newY = draftPosition.y - TWIST.Card.draftCard.height - 10;
        }
        this.showPhomArea = new createjs.Container();
        this.showPhomArea.set({
            name: "showPhomArea",
            x: draftPosition.x,
            y: newY
        });
        this.addChild(this.showPhomArea);
    };

    p.addChipContainer = function (player) {
        var desk = this.parent.parent.getChildByName('desk');
        var chipPosition = desk.chipPosition[this.position];
        this.chipContainer = new createjs.Container();
        this.chipContainer.set({
            name: "chipContainer",
            x: chipPosition.x,
            y: chipPosition.y,
            width: 117,
            height: 42,
            visible: true
        });
        var chipContainerBg = new createjs.Bitmap(imagePath + 'money-container.png');
        var chipContainerValue = new createjs.Text("0", '20px Roboto Condensed', 'white');
        chipContainerValue.set({x: 45, y: 30, textAlign: 'center', textBaseline: 'bottom'});
        this.chipContainer.addChild(chipContainerBg, chipContainerValue);
        this.addChild(this.chipContainer);
    };

    p.pushChip = function (type, number, options) {
        var _self = this;
        for (var i = 0; i < number; i++) {
            var chipIcon = new TWIST.Chip(type);
            this.chipContainer.addChild(chipIcon);
            var newX = this.chipContainer.width - chipIcon.width;
            chipIcon.set({
                x: 50 - this.chipContainer.x,
                y: 10 - this.chipContainer.y
            })
            createjs.Tween.get(chipIcon)
                    .wait(100 * i)
                    .to({x: newX, y: 0}, 200)
                    .call(function () {
                        var textObject = _self.chipContainer.getChildAt(1);
                        var current = isNaN(parseInt(textObject.text)) ? 0 : parseInt(textObject.text);
                        textObject.text = current + ChipValues[type];
                    });
        }
    };


    p.pushChicken = function (chipArray, options) {
        var _self = this;
        var desk = this.parent.parent.getChildByName('desk');
        var waitTime = 0;
        desk.chickenTotal.visible = true;
        console.log("chipArray", chipArray);
        for (var j = 0; j < chipArray.length; j++) {
            _pushChicken(chipArray[j].number, chipArray[j].type)
        }
        function _pushChicken(number, type) {
            for (var i = 0; i < number; i++) {
                var chipIcon = new TWIST.Chip(type);
                desk.chickenTotal.addChild(chipIcon);
                var chickenTotalPosition = desk.chickenTotal.localToGlobal(0, 0);
                var userPosition = _self.localToGlobal(50, 10);
                chipIcon.set({
                    x: userPosition.x - chickenTotalPosition.x,
                    y: userPosition.y - chickenTotalPosition.y
                });
                createjs.Tween.get(chipIcon)
                        .wait(waitTime += 100)
                        .to({x: 140, y: 50}, 200)
                        .call(function () {
                            desk.chickenTotal.removeChild(this);
                            var textObject = desk.chickenTotal.getChildAt(1);
                            var current = isNaN(parseInt(textObject.value)) ? 0 : parseInt(textObject.value);
                            textObject.value = current + ChipValues[type];
                            textObject.text = "Tổng gà : " + textObject.value;
                        });
            }
        }
    };

    p.showSinglePhom = function (cardList, position) {
        if (!cardList)
            return;
        var cards = this.getCardsInHand(cardList);
        for (var i = 0; i < cards.length; i++) {
            var card = cards[i];
            card.visible = true;
            card.cardValue = cardList[i];
            var _self = this;
            var bai = TWIST.Card.draftCard,
                    draftCards = this.showPhomArea;

            var newX = bai.seperator * draftCards.children.length,
                    newY = 0;
            if (this.draftCards.align == "right") {
                newX = 300 - bai.seperator * draftCards.children.length
            }
            this.showPhomArea.addChild(card);

            card.set({x: card.x + this.hand.x - draftCards.x, y: card.y + this.hand.y - draftCards.y});
            card.removeAllEventListeners();

            createjs.Tween.get(card).to({
                x: newX, y: newY,
                width: bai.width,
                height: bai.height,
                scaleX: bai.scale,
                scaleY: bai.scale
            }, _animationTime, createjs.Ease.sineOut()).call(function () {
                this.setInPhom(false);
                if (_self.position != 0) {
                    this.openCard(this.cardValue);
                }
            });
        }
        return cards;
    };

    p.addCardInShowPhom = function (card, position) {
        var bai = TWIST.Card.draftCard,
                _self = this,
                oldX = card.x,
                oldY = card.y,
                newX = bai.seperator * this.showPhomArea.children.length,
                newY = 0,
                draftCards = this.showPhomArea;

        this.showPhomArea.addChild(card);
        card.set({x: oldX + position.x - this.showPhomArea.x - this.x, y: oldY + position.y - this.showPhomArea.y - this.y, visible: true});

        if (this.draftCards.align == "right") {
            newX = 300 - bai.seperator * (draftCards.children.length - 1)
        }
        card.removeAllEventListeners();
        createjs.Tween.get(card).to({
            x: newX, y: newY,
            width: bai.width,
            height: bai.height,
            scaleX: bai.scale,
            scaleY: bai.scale
        }, _animationTime, createjs.Ease.sineOut()).call(function () {
            this.openCard(this.cardValue);
        });
    };

    p.sortPhomArea = function () {
        var cards = this.showPhomArea.children;
        var _self = this;

        var length = cards.length;
        var bai = TWIST.Card.draftCard;
        var seperator = bai.seperator;
        var width = length * seperator;
        var isCurrent = this.isCurrent;
        if (width > 300)
            width = 300;
        var indexLeft = 0;
        if (this.position == 0) {
            indexLeft = (1280 - width - (this.showPhomArea.x + this.x) * 2) / 2;
        }

        for (var i = 0; i < cards.length; i++) {
            var card = cards[i];
            var newX = indexLeft + i * width / length;

            if (this.draftCards.align == "right") {
                newX = 300 - width / length * i;
            }

            createjs.Tween.get(card).to({
                x: newX
            }, 100, createjs.Ease.sineOut()).call(function () {});
        }
        ;
    }

    p.showMoneyExchageEffect = function (money, type, options) {
        var moneyChangeContainer = this.getChildByName('moneyChangeEffect');
        moneyChangeContainer.set({visible: true, y: 50});
        var moneyChangeBg = moneyChangeContainer.getChildAt(0);
        var moneyChangeText = moneyChangeContainer.getChildAt(1);
        var absMoney = Math.abs(parseInt(money));
        if (type == "lose") {
            moneyChangeText.color = "red";
            moneyChangeBg.text = moneyChangeText.text = "- " + absMoney;
        } else {
            moneyChangeText.color = "yellow";
            moneyChangeBg.text = moneyChangeText.text = "+ " + absMoney;
        }
        createjs.Tween.get(moneyChangeContainer).to({y: (options && options.y) ? options.y : -20}, _animationTime).call(function () {
            setTimeout(function () {
                moneyChangeContainer.visible = false;
                moneyChangeText.text = '';
            }, 2000);
        });
    };

    p.setHandCardsValue = function (cardList) {
        var cards = this.handCards.children;
        for (var i = 0; i < cardList.length; i++) {
            var card = cards[i];
            if (card) {
                card.cardValue = cardList[i];
            }
        }
        ;
    };

    p.getHandCardAbsolutePosition = function () {
        return {
            x: this.x + this.hand.x + this.handCards.x,
            y: this.y + this.hand.y + this.handCards.y
        };
    };

    p.rerenderDraftPhom = function (cardList) {
        if (!cardList)
            return;
        console.log(cardList);
        var cards = [], bai = TWIST.Card.draftCard;

        for (var i = 0; i < cardList.length; i++) {
            var card = new TWIST.Card(cardList[i]);

            var newX = bai.seperator * i, newY = 0;
            if (this.draftCards.align == "right") {
                newX = 300 - bai.seperator * i
            }
            card.set({
                x: newX,
                y: newY,
                scaleX: bai.scale,
                scaleY: bai.scale
            });
            this.draftCards.addChild(card);
        }
        return cards;
    };

    p.hightLightEatCards = function (cardList) {
        var cards = this.handCards.children;
        for (var i = 0; i < cards.length; i++) {
            if (cardList.indexOf(cards[i].cardValue) > -1)
                cards[i].hightLight();
        }
        var cards = this.showPhomArea.children;
        for (var i = 0; i < cards.length; i++) {
            if (cardList.indexOf(cards[i].cardValue) > -1)
                cards[i].hightLight();
        }
    };

    p.reEatCards = function (cardList) {
        if (!cardList)
            return;
        var cards = [], bai = TWIST.Card.draftCard;

        for (var i = 0; i < cardList.length; i++) {
            var card = new TWIST.Card(cardList[i]);

            var newX = bai.seperator * i, newY = 0;
            if (this.draftCards.align == "right") {
                newX = -0 - this.handCards.x - this.hand.x + this.draftCards.x + 300 - i * bai.seperator;
            } else {
                newX = 0 - this.handCards.x - this.hand.x + this.draftCards.x + i * bai.seperator
            }
            card.set({
                x: newX,
                y: newY,
                scaleX: bai.scale,
                scaleY: bai.scale
            });
            this.handCards.addChild(card);
        }
        return cards;
    };

    p.showMessage = function (msg) {
        var chat = this.getChildByName('chat'),
//                        textColor = 'rgba(23, 2, 37, 1)',
//                        bgColor = 'rgba(190, 190, 190, 1)',
//                        borderColor = 'rgba(23, 2, 37, 1)',
                textColor = 'rgba(255, 255, 0, 1)',
                bgColor = 'rgba(0, 0, 0, 1)',
                borderColor = 'rgba(0, 0, 0, 1)',
                chatText,
                chatBg,
                textPosition = {};

        chatBg = chat.getChildAt(0);
        chatText = chat.getChildAt(1);

        chatBg.graphics.c();
        chatText.set({color: textColor, text: msg});

        textPosition.x = chatText.getMeasuredWidth();
        textPosition.y = chatText.getMeasuredHeight();

        if (msg && msg.length > 28) {
            var positionSplit = msg.indexOf(' ', 25);
            if (positionSplit < 25 || positionSplit > 35)
                positionSplit = 28;
            msg = msg.substring(0, positionSplit) + '\n' + msg.substring(positionSplit);
            chatText.text = msg;

            var tempText = chatText.clone();
            tempText.text = msg.substring(0, positionSplit);
            textPosition.x = tempText.getMeasuredWidth();
            textPosition.y = chatText.getMeasuredHeight();
        }

        chatText.set({x: textPosition.x / 2, y: (textPosition.y + 10) / 5 + 18});
        chatBg.graphics.beginFill(bgColor).beginStroke(borderColor).setStrokeStyle(1).drawRoundRect(-10, -10, textPosition.x + 20, textPosition.y + 20, 20);

        var x = this.hand.x < 0 ? -(textPosition.x + 20) : 120,
                y = 0;
        chat.set({x: x, y: y, visible: true});

        createjs.Tween.get(chat).to({alpha: 1}, _animationTime)
                .to({x: x + 1, y: y + 1}, 100).to({x: x - 1, y: y - 2}, 100)
                .to({x: x + 1, y: y + 1}, 100).to({x: x - 1, y: y - 2}, 100)
                .to({x: x + 1, y: y + 1}, 100).to({x: x - 1, y: y - 2}, 100)
                .wait(3500).to({alpha: 0, visible: false}, 500);
    }

    TWIST.Player = Player;

})();
/**
 * @module Container
 */
this.gbjs = this.gbjs || {};

(function() {
	"use strict";


	/**
	 * @class BitmapAvatar
	 * @extends Bitmap
	 * @constructor
	 * @param {HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | String} imageOrUri The source object or URI to an image to
	 * display. This can be either an Image, Canvas, or Video object, or a string URI to an image file to load and use.
	 * If it is a URI, a new Image object will be constructed and assigned to the .image property.
	 **/
	function BitmapAvatar(imageOrUri) {
		this.Bitmap_constructor(imageOrUri);
	}


	var p = createjs.extend(BitmapAvatar, createjs.Bitmap);

	gbjs.BitmapAvatar = createjs.promote(BitmapAvatar, "Bitmap");

})();
/**
 * @module Container
 */
this.gbjs = this.gbjs || {};

(function() {
	"use strict";

	/**
	 * @class BitmapCard
	 * @extends Bitmap
	 * @constructor
	 * @param {HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | String} imageOrUri The source object or URI to an image to
	 * display. This can be either an Image, Canvas, or Video object, or a string URI to an image file to load and use.
	 * If it is a URI, a new Image object will be constructed and assigned to the .image property.
	 **/
	function BitmapCard(imageOrUri, value, cursor) {
		this.Bitmap_constructor(imageOrUri);
		/**
		 * @protected
		 * @type {Number}
		 */
		this.value = value;
		/**
		 * @protected
		 * @type {Boolean}
		 */
		this.selected = false;
		/**
		 * @protected
		 * @type {String}
		 */
		this.cursor = cursor;
		/**
		 * @protected
		 * @type {createjs.Shadow<Object>}
		 */
		this.shadow = createjs.Shadow.identity;


		//enable pointer
		if(this.cursor) {
			this.addEventListener('click', this.handleEventClick.bind(this));
			this.addEventListener("rollover", this);
			this.addEventListener("rollout", this);
		}
	}


	


	var p = createjs.extend(BitmapCard, createjs.Bitmap);



	/**
	 * Draws the display object into the specified context ignoring its visible, alpha, shadow, and transform.
	 * Returns true if the draw was handled (useful for overriding functionality).
	 *
	 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	 * @method draw
	 * @param {CanvasRenderingContext2D} ctx The canvas 2D context object to draw into.
	 * @param {Boolean} [ignoreCache=false] Indicates whether the draw operation should ignore any current cache.
	 * For example, used for drawing the cache (to prevent it from simply drawing an existing cache back
	 * into itself).
	 **/
	p.draw = function(ctx, ignoreCache) {
		this.shadow = this._shadow;
		// call Text's drawing method to do the real work of drawing to the canvas:
		// this super class method reference is automatically created by createjs.extends for methods overridden in the subclass:
		this.Bitmap_draw(ctx, ignoreCache);
		if(this.hover) {
			this.shadow = this._hoverShadow;
		}
		
	}

	/**
	 * @method setValue
	 * @return {Number}
	 */
	p.getValue = function() {
		return this.value;
	}

	/**
	 * @method setHoverShadow
	 * @constructor
	 * @param {String} color The color of the shadow. This can be any valid CSS color value.
	 * @param {Number} offsetX The x offset of the shadow in pixels.
	 * @param {Number} offsetY The y offset of the shadow in pixels.
	 * @param {Number} blur The size of the blurring effect.
	 */
	p.setHoverShadow = function( color,  offsetX,  offsetY,  blur ) {
		this._hoverShadow = new createjs.Shadow(color,  offsetX,  offsetY,  blur);
	}

	/**
	 * @method setShadow
	 * @constructor
	 * @param {String} color The color of the shadow. This can be any valid CSS color value.
	 * @param {Number} offsetX The x offset of the shadow in pixels.
	 * @param {Number} offsetY The y offset of the shadow in pixels.
	 * @param {Number} blur The size of the blurring effect.
	 */
	p.setShadow = function(color,  offsetX,  offsetY,  blur) {
		this._shadow = new createjs.Shadow(color,  offsetX,  offsetY,  blur);
	}

	/**
	 * set up the handlers for click
	 */
	p.handleEventClick = function(evt) {
		if(this.draggable) return;
		this.select();
	}

	/**
	 * @protected select
	 * set up the handlers for click
	 */
	p.select = function() {
		var y = this.y;
		if(this.selected === true) {
			y +=30;
		} else {
			y -=30;
		}

		createjs.Tween.get(this).to({y:y}, 100);
		this.selected = !this.selected;
	}

	/**
	 * @method unSelect
	 * set up the handlers for click
	 */
	p.unSelect = function() {
		if(this.selected === true) {
			y = this.y + 30;
			createjs.Tween.get(this).to({y:y}, 100);
			this.selected = false;
		}
	}


	/**
	 * @description 
	 * set up the handlers for mouseover / out
	 */
	p.handleEvent = function (evt) {
		this.hover = (evt.type == "rollover");
	};

	gbjs.BitmapCard = createjs.promote(BitmapCard, "Bitmap");

})();
/**
 * @module Container
 */
this.gbjs = this.gbjs || {};

(function() {
	"use strict";


	function BitmapDesk() {
		this.Container_constructor();
	}


	var p = createjs.extend(BitmapDesk, createjs.Bitmap);

	gbjs.BitmapDesk = createjs.promote(BitmapDesk, "Bitmap");

})();
/**
 * @module CardContainer
 */
this.gbjs = this.gbjs || {};

(function() {
	"use strict";


	function CardContainer(imageOrUri) {
		this.Container_constructor();
	}


	var p = createjs.extend(CardContainer, createjs.Container);

	gbjs.CardContainer = createjs.promote(CardContainer, "Container");

})();
/**
 * @module ChairContainer
 */
this.gbjs = this.gbjs || {};

(function() {
	"use strict";

	/*
	 * @class ChairContainer
	 * @extends Container
	 * @constructor
	 **/
	function ChairContainer() {
		this.Container_constructor();

	}


	var p = createjs.extend(ChairContainer, createjs.Container);


	gbjs.ChairContainer = createjs.promote(ChairContainer, "Container");

})();
/**
 * @module Container
 */
this.gbjs = this.gbjs || {};

(function() {
	"use strict";

	/*
	 * @class Container
	 * @extends Container
	 * @constructor
	 **/
	function Container() {
		this.Container_constructor();
	}


	var p = createjs.extend(Container, createjs.Container);

	gbjs.Container = createjs.promote(Container, "Container");

})();
/**
 * @module Container
 */
this.gbjs = this.gbjs || {};

(function() {
	"use strict";


	function HandContainer() {
		this.Container_constructor();

		/**
		 * @protected
		 * @type {gbjs.Sortable}
		 */
		this.sortable = new gbjs.Sortable(this);
	}


	var p = createjs.extend(HandContainer, createjs.Container);

	/**
	 * Deal card
	 * @return {[type]} [description]
	 */
	p.dealCard = function() {
		// body...
	}

	gbjs.HandContainer = createjs.promote(HandContainer, "Container");

})();
/**
 * @module Sortable
 */
this.gbjs = this.gbjs || {};

(function() {
	"use strict";



	function Sortable(parent) {
		/**
		 * @protected
		 * @type {createjs.Container}
		 */
		this.parent = parent;

		/**
		 * @protected
		 * @type {String}
		 */
		this.oldIndex;

		/**
		 * @protected
		 * @type {String}
		 */
		this.oldOffset;

		/**
		 * @protected
		 * @type {String}
		 */
		this.dragObj;

		/**
		 * @protected
		 * @type {Number}
		 */
		this.dragIndex;

		/**
		 * @protected
		 * @type {String}
		 */
		this.newIndex;

		/**
		 * @protected
		 * @type {Number}
		 */
		this.nextIndex;

		/**
		 * @protected
		 * @type {Object}
		 */
		this.nextObj;

		/**
		 * @protected
		 * @type {Object}
		 */
		this.cloneObj;

		/**
		 * @protected
		 * @type {Number}
		 */
		this.space;

		/**
		 * Setup event
		 */
		parent.on('mousedown', this._onDragStart, this);
		parent.on('pressmove', this._onTouchMove, this);
		parent.on('pressup', this._onDragOver, this);


	}

	/**
	 * @protected
	 * @type {Boolean}
	 */
	Sortable.active = false;

	/**
	 * @method _onDragStart
	 * 
	 * @param  {Event} evt
	 */
	Sortable.prototype._onDragStart = function(evt) {
		var o = evt.target;
		this.dragObj = o;
		if(this.space) {
			return true;
		}
		var o1 = o.parent.getChildAt(0);
		var o2 = o.parent.getChildAt(1);
		if(o1 && o2) {
			this.space = o2.x - o1.x;
		}
	}

	Sortable.prototype._dragStarted = function(evt) {
		// bump the target in front of its siblings:
		var o = evt.target;
		o.offset = {x: o.x - evt.stageX, y: o.y - evt.stageY};
		o.draggable = true;
		Sortable.active = this;
		this.updateDragIndex();
		this.cloneObj = o.clone();
	}


	Sortable.prototype.updateDragIndex = function() {
		var lastChild = this.parent.getChildAt(this.parent.numChildren - 1);
		if(lastChild != this.dragObj) {
			this.parent.addChild(this.dragObj);
		}
	}

	/**
	 * @method _onTouchMove
	 * 
	 * @param  {Event|TouchEvent} evt
	 *
	 */
	Sortable.prototype._onTouchMove = function(evt) {
		if(!this.dragObj) return;

		// only set the status to dragging, when we are actually dragging
		if (!Sortable.active) {
			this._dragStarted(evt);
		}
		var child, cloneChild;
		var o = evt.target;
		var children = this.parent.children;
		var x = evt.stageX + o.offset.x;
		var y = evt.stageY + o.offset.y;

		this.updateDragIndex();


		o.x = x;
		o.y = y;

		if(x < 0) {
			x = 0;
		}
		var newIndex = Math.round(x/this.space);

		if(newIndex >= children.length) {
			newIndex = children.length - 1;
		}

		if(newIndex == this.newIndex) {
			return;
		}
		this.newIndex = newIndex;
		this._sort();
	}

	/**
	 * @method _sort
	 */
	Sortable.prototype._sort = function() {
		var index = this.newIndex;
		var children = this.parent.children;
		var space = this.space;
		//update before item
		for(var i = 0; i < index; i++) {
			var child = children[i];
			createjs.Tween.get(child).to({x:i * space}, 100);
		}

		//update before item
		for(var i =index; i < children.length -1; i++) {
			var child = children[i];
			createjs.Tween.get(child).to({x:(i + 1) * space}, 100);
		}
	}



	/**
	 * @method handleEvent
	 * 
	 * @param  {Event} evt
	 */
	Sortable.prototype.handleEvent =function (evt) {

	}

	/**
	 * @method _onDragOver
	 * 
	 * @param  {Event} evt
	 */
	Sortable.prototype._onDragOver = function(evt) {
		if(!Sortable.active) return;
		Sortable.active = false;
		var o = evt.target;
		o.parent.addChildAt(o, this.newIndex);
		o.x = this.newIndex * this.space;
		o.y = this.cloneObj.y;
		o.draggable = false;
	}

	/**
	 * @method _onDrop
	 * 
	 * @param  {Event} evt
	 */
	Sortable.prototype._onDrop = function(evt) {
		// body...
	}


	Sortable.prototype.destroy = function() {
		parent.on('pressmove', this._onTouchMove, this);
		parent.on('pressup', this._onDragOver, this);
	}


	function _onMove(argument) {
		// body...
	}

	gbjs.Sortable = Sortable;

})();
/**
 * @module Text Money
 */
this.gbjs = this.gbjs || {};

(function() {
	"use strict";


	/**
	 * @class TextMoney
	 * @extends Text
	 * @constructor
	 * @param {String} [text] The text to display.
	 * @param {String} [font] The font style to use. Any valid value for the CSS font attribute is acceptable (ex. "bold
	 * 36px Arial").
	 * @param {String} [color] The color to draw the text in. Any valid value for the CSS color attribute is acceptable (ex.
	 * "#F00", "red", or "#FF0000").
	 */
	function TextMoney(text, font, color) {
		// this super class constructor reference is automatically created by createjs.extends:
		this.Text_constructor(text, font, color);
	}


	var p = createjs.extend(TextMoney, createjs.Text);
	
	// set up the inheritance relationship: TextMoney extends Text.
	gbjs.TextMoney = createjs.promote(TextMoney, "Text");

})();
/**
 * @module Text Username
 */
this.gbjs = this.gbjs || {};

(function() {
	"use strict";


	/**
	 * @class TextUsername
	 * @extends Text
	 * @constructor
	 * @param {String} [text] The text to display.
	 * @param {String} [font] The font style to use. Any valid value for the CSS font attribute is acceptable (ex. "bold
	 * 36px Arial").
	 * @param {String} [color] The color to draw the text in. Any valid value for the CSS color attribute is acceptable (ex.
	 * "#F00", "red", or "#FF0000").
	 */
	function TextUsername(text, font, color) {
		// this super class constructor reference is automatically created by createjs.extends:
		this.Text_constructor(text, font, color);
	}


	var p = createjs.extend(TextUsername, createjs.Text);
	
	// set up the inheritance relationship: TextUsername extends Text.
	gbjs.TextUsername = createjs.promote(TextUsername, "Text");

})();

this.TWIST = this.TWIST || {};

(function () {
    "use strict";

    function BaseGame() {}

    var p = BaseGame.prototype = new EventEmitter();

    p.initBaseGame = function () {

        //Event List
        this.events = {
            info: "drawInfo"
        };

        //Player List
        this.player = [];
        
        this.initCanvas();
    };

    p.initCanvas = function () {
        var canvas = this.wrapper.find('canvas')[0];
        if (!canvas)
            return;

        var _self = this;

        var stage = new createjs.Stage(canvas);
        stage.enableMouseOver(20);
        var context = stage.canvas.getContext("2d");
        context.mozImageSmoothingEnabled = true;
        createjs.Touch.enable(stage);
        createjs.Ticker.setFPS(60);
        stage.width = canvas.width;
        stage.height = canvas.height;
        createjs.Ticker.addEventListener("tick", onUpdateStage);
        this.on('destroy', function () {
            createjs.Ticker.removeEventListener("tick", onUpdateStage);
            _self.removeAllListeners();
        });
        this.canvas = stage;

        function onUpdateStage() {
            stage.update();
        }
    };

    p.initEvent = function () {
        var events = this.events;
        for (var pro in events) {
            this.on(pro, this[events[pro]]);
        }
    };

    TWIST.BaseGame = BaseGame;

})();

this.TWIST = this.TWIST || {};

(function () {
    "use strict";

    function InRoomGame() {}

    InRoomGame.statusList = {
        '1': 'STATUS_WAITING_FOR_PLAYER',
        '2': 'STATUS_WAITING_FOR_READY',
        '3': 'STATUS_WAITING_FOR_START',
        '4': 'STATUS_PLAYING',
        '5': 'STATUS_ENDING',
        '6': 'STATUS_WAITING_FOR_DEALING',
        '7': 'STATUS_DEALING',
        '8': 'STATUS_SHAKE_DISK',
        '9': 'STATUS_BETTING',
        '10': 'STATUS_END_BETTING',
        '11': 'STATUS_OPEN_DISK',
        '12': 'STATUS_CLOSE_DISK',
        '13': 'STATUS_ARRANGING',
        '14': 'STATUS_NOTIFY_SAM',
        '15': 'STATUS_DEAL_MASTER'
    };


    var p = InRoomGame.prototype = new TWIST.BaseGame();

    p.initInRoomGame = function () {
        this.initBaseGame();
        this.drawRoom();
        this.pushInRoomGameEvent();
    };

    p.drawRoom = function () {
        this.playersContainer = new createjs.Container();
        this.desk = new TWIST.Desk(this.options);
        this.canvas.addChild(this.playersContainer, this.desk);
    };

    p.pushInRoomGameEvent = function () {
        this.on("gameInfo", this.drawGameInfo);

        this.on("userJoin", this.addPlayer);

        this.on("userQuit", this.removePlayer);

        this.on("error", this.showError);

        this.on("change-master", this.changeRoomMaster);

        this.on("isolate-update-money", this.isolateUpdateMoney);

        this.on("game:user-chat", this.userChat);

        this.on("changeState", this.changeStatus);

        this.on("endGame", this.endGame);

        this.on("reconnect", this.reconnect);
    };

    p.drawGameInfo = function (data) {
        console.log(data);
        var model = this.model || {};
        this.model = model;
        $.extend(model, data);

        this.drawPlayers();

        if (data.gameState === 'STATUS_PLAYING') {
            this.drawPlayingState(data);
        }
    };

    p.addPlayer = function (data) {

    };

    p.removePlayer = function (data) {

    };

    p.showError = function (data) {

    };

    p.changeRoomMaster = function (data) {

    };

    p.isolateUpdateMoney = function (data) {

    };

    p.userChat = function (data) {

    };

    p.changeStatus = function (data) {

    };

    p.endGame = function (data) {

    };

    p.reconnect = function (data) {

    };

    p.drawPlayers = function () {
        var players = this.model.players || [];
        var _self = this;
        
        players.sort(function (a, b) {
            return a.position - b.position;
        });
        
        var options = this.options;
        var playerPositions = this.desk.playerPosition;
        
        players.forEach(function (item, index) {
//            item 
            console.log(playerPositions,index);
            $.extend(item,playerPositions[index]);
            var config = {
                
            };
            item.config = config;
            item.position = index;
            _self.drawPlayer(item);
        });
    };

    p.drawPlayer = function (playerData) {
        var newPlayer = new TWIST.Player(playerData);
        this.playersContainer.addChild(newPlayer);
    };

    TWIST.InRoomGame = InRoomGame;

})();

this.TWIST = this.TWIST || {};

(function () {
    "use strict";
    
    var initOptions = {
        maxPlayer : 4
    };

    function TLMNDemlaGame(wrapper, options) {
        this.options = options || initOptions;
        this.wrapper = $(wrapper);
        this.initTLMNDemlaGame();
    }
    var p = TLMNDemlaGame.prototype = new TWIST.InRoomGame();

    p.initTLMNDemlaGame = function (wrapper) {
        this.initInRoomGame();
        this.pushTLMNDemlaEvent();
        this.initEvent();
    };

    p.pushTLMNDemlaEvent = function () {
        
    };

    TWIST.TLMNDemlaGame = TLMNDemlaGame;

})();
/**
 * @module Info
 */
this.gbjs = this.gbjs || {};

(function() {
	"use strict";

	/**
	 * Static class holding library specific information such as the version and buildDate of
	 * the library.
	 * @class Info
	 **/
	var i = gbjs.Info = gbjs.Info || {};

	/**
	 * The version string for this release.
	 * @property version
	 * @type String
	 * @static
	 **/
	i.version = /*=version*/""; // injected by build process

	/**
	 * The build date for this release in UTC format.
	 * @property buildDate
	 * @type String
	 * @static
	 **/
	i.buildDate = /*=date*/""; // injected by build process

})();

