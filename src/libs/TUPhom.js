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

		this.parent.sortChildren(function(a, b) {
			return (a.getValue() > b.getValue());
		});

		this.index = this.parent.getChildIndex(this.card);


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
					// truong hop 2 con con minh chon
					if(cardsFire.length ==2 && this.rank== TUPhom.getRank(cardsFire[0])) {
						var cards = self._getSelectNgang();
						if(cards.length ==2) {
							var maxChat1 = cardsFire[1] % 4;
							var maxChat2 = cards[0].getValue() % 4;
							var maxChat3 = cards[1].getValue() % 4;
							if(maxChat2  < maxChat3) {
								maxChat2 = maxChat3;
							}
							if(maxChat1 < maxChat2) {
								return  cards;
							}
						}
					} else if(self.rank > TUPhom.getRank(cardsFire[0])) {
						//truong hop 2 con tro len thuong
						var cards = self._getSelectNgang();
						return _.filter(cards, function(obj) {
							return (obj.getValue() >= self.value);
						});
					}
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
		if(results.length > 0 && (results[0].getValue() != self.value)) {
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
		return _.filter(this.handCards, function(card) {
			return (TUPhom.getRank(card.getValue()) == self.rank);
		})
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
		var card;
		var rankOfCardSelect = self.rank;
		var rankOfCardFile = TUPhom.getRank(self.cardsFire[0]);
		if(rankOfCardFile > rankOfCardSelect) {
			return [];
		}
		results.push(self.card);
		for(var i = 0; i < this.cardsFire.length - 1; i++) {
			rankOfCardSelect++;
			card = this.getCartByRank(rankOfCardSelect);
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