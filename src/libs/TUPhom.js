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
	function TUPhom(handCards, cardsFire, cardSelect) {
		if(!(this instanceof TUPhom)) {
			return new TUPhom(cards);
		}

		/**
		 * @protected
		 * @type {Array<gbjs.Card>}
		 */
		this.handCards = handCards;
		/**
		 * @protected
		 * @type {Array<Number>}
		 */
		this.cardsFire = cardsFire;
		/**
		 * @protected
		 * @type {gbjs.Card<Object>}
		 */
		this.cardSelect = cardSelect;


		return this.getCards();

	}

	/**
	 * @return {Array<gbjs.Card>}
	 */
	TUPhom.prototype.getCards = function() {
		var spec;
		var cardSelect = this.cardSelect;
		var cardsFire = this.cardsFire;
		var cardSelectValue = this.cardSelect.getValue();
		if (cardSelect > this._getMinPush() 
			&& cardsFire.length != 2 
			&& cardsFire.size() != 1){
			return;
		}


		var cardsFire = cardsFire.sort(function(a, b) {
			return (a < b);
		});


		if(cardsFire.length === 0) {
			// nguoi choi danh 2
			if(cardsFire[0] >=48) {
				return this._getCardsChat2();
			}
		} else {
			// phom 33 doi thong, 4 doi thong tu quy
			if(cardsFire[0] / 4 == cardsFire[1] / 4) {
				//get phom dac biet 3doi thong, 4 doi thong
				spec = TUPhom.getPhomSpecial(cardsFire);
				if(spec > 0) {
					return this._getArrSpecialSuit(spec);
				} else {
					//doi 2
					if(cardsFire.length ==2 && cardsFire[0] > 47) {
						return this._getChatDoi2();
					}
					// truong hop 2 con con minh chon
					if(cardsFire.length ==2 && cardSelectValue/4 == cardsFire[0]/4) {
						var cards = this._getSelectNgang();
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
					} else if(cardSelectValue/4 > cardsFire[0]/4) {
						//truong hop 2 con tro len thuong
						var cards = this._getSelectNgang();
						return _.filter(cards, function(obj) {
							return (obj.getValue() >= cardSelectValue);
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
		var cardFire0 = this.cardsFire[0];
		var cardSelect = this.cardSelect;
		var iCardSelect = cardSelect.parent.getChildIndex(cardSelect);
		if(cardFire0/4 > cardSelect.getValue()) { return; }
		return this.findArr34thoithong(cardSelect, sodoithong);
	}


	/**
	 * @param  {Number} cardSelect
	 * @return {Array}
	 */
	TUPhom.prototype._getTuQuy = function() {
		cardSelect = this.cardSelect;
		var results = _.filter(this.handCards, function(card) {
			return (card.getValue()/4 == cardSelect.getValue()/4);
		});
		if(results.length < 4) {
			results = [];
		}
		if(results && (results[0].getValue() != cardSelect.getValue())) {
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
		var cardSelect = this.cardSelect;
		var rank = cardSelect.getValue() / 4;
		var indexCard = cardSelect.parent.getChildIndex(cardSelect);
		for(var i = 0; i < sodoithong; i++) {
			var dudoi = 0;
			for(var j  = indexCard + i; j < this.handCards.length; i++) {
				if(this.handCards[j].getValue()/4 == rank) {
					dudoi++;
					results.push(this.handCards[j]);
					if(dudoi == 2) {
						break;
					}
				}
			}
			if(dudoi < 2) {
				results = [];
			}
		}
		return results;
	}

	/**
	 * @param  {Number} cardSelect
	 * @param {Number} sodoithong
	 * @return {Number}
	 */
	TUPhom.prototype._getArrSpecialSuit = function(sodoithong) {
		var results = [];
		var cardSelect = this.cardSelect;
		var cardSelectValue = this.cardSelect.getValue();
		var firstCardFire = this.cardsFire[0];
		var rank = cardSelectValue/2;

		switch(sodoithong) {
			case 3:
				// tim 3 doi thong to hon or bang
				results = this._getDoithong(sodoithong);
				if(results.length ==0) {
					//tim them tu quy
					results = this._getTuQuy();
				}
				if(results,length == 0) {
					results = this._getDoithong(sodoithong);
				}
			break;
			case 4:
				results = this._getDoithong(sodoithong);
			break;
			case 5:
				results = this._getTuQuyTohon();
				if(results,length == 0) {
					results = this._getDoithong(sodoithong);
				}
			break;
		}
		return results;
	}

	/**
	 * @param  {Number} rank
	 * @return {Array}
	 */
	TUPhom.prototype._getSelectNgang = function (rank) {
		return _.filter(this.handCards, function(card) {
			return (card.getValue()/4 == rank/4);
		})
	}


	/**
	 * @param  {Number} iCardFire
	 * @return {Number} iCardSelect
	 * @return {Array}
	 */
	TUPhom.prototype._getDoc = function() {
		var rankCardFire = this.cardsFire[0]/4;
		var rankCardSelect = this.cardSelect.parent.getChildIndex(this.cardSelect)/4;
		if(rankSelect < rank) { return; }
	}

	/**
	 * @return {Array} cards
	 * @return {Number}
	 */
	TUPhom.getPhomSpecial = function(cards) {
		var result, rank1, rank2;
		switch(cards.length) {
			// check tu quy
			case 4:
				rank1 = cards[0]/4;
				rank2 = cards[1]/4;
				if(rank1 == rank2) {
					result = 5;
				}
			break;
			// check đôi thông
			case 6:
				rank1 = cards[0]/4;
				rank2 = cards[2]/4;
				if (ranhk1 == (ranhk2 - 1)){
					return strResuft = 3; //"3 ĐÔI THÔNG";
				}
			break;
			case 8:
				rank1 = cards[0]/4;
				rank2 = cards[2]/4;
				if (ranhk1 == (ranhk2 - 1)){
					return strResuft = 4; //"4 ĐÔI THÔNG";
				}
			break;
		}

		return result;
	}

	this.gbjs.TUPhom = TUPhom;
})();