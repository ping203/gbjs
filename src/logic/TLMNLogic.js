/**
 * @module Info
 */
this.TWIST = this.TWIST || {};

(function () {
    "use strict";

    /**
     * TLMN Logic
     *
     * @example
     * gbjs.TLMNLogic([1, 2, 3])
     *
     * @param {Array<gbjs.Card>} handCards
     * @param {Array<Number>} cardsFire
     * @param {gbjs.Card<Object>} cardSelect
     * 
     * @return {Array<gbjs.Card>}
     */
    function TLMNLogic(cardsFire, card) {
        if (!(this instanceof TLMNLogic)) {
            return new TLMNLogic(cardsFire, card);
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
        this.rank = this.getRank(this.value);

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
    var p = TLMNLogic.prototype;

    p.getCards = function () {
        var spec;
        var self = this;
        var cardsFire = self.cardsFire;
        if (self.value > self._getMinPush()
                && cardsFire.length != 2
                && cardsFire.length != 1) {
            return [];
        }


        cardsFire.sort(function (a, b) {
            return (a > b);
        });

        if (cardsFire.length === 1) {
            // nguoi choi danh 2
            if (cardsFire[0] >= 48) {
                return self._getCardsChat2();
            }
        } else {
            // phom 33 doi thong, 4 doi thong tu quy
            if (this.getRank(cardsFire[0]) == this.getRank(cardsFire[1])) {
                //get phom dac biet 3doi thong, 4 doi thong
                spec = this.getPhomSpecial(cardsFire);
                if (spec > 0) {
                    return self._getArrSpecialSuit(spec);
                } else {
                    //doi 2
                    if (cardsFire.length == 2 && cardsFire[0] > 47) {
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
    p._getCardsChat2 = function () {
        var cards = this._getTuQuy();
        if (cards.length == 0) {
            cards = this._getDoithong(4);
        }
        if (cards.length == 0) {
            cards = this._getDoithong(3);
        }
        return cards;
    }

    /**
     * @return {Array<gbjs.Card>}
     */
    p._getChatDoi2 = function () {
        var cards = this._getTuQuy();
        if (cards.length == 0) {
            cards = this._getDoithong(4);
        }
        return cards;
    }

    /**
     * @return {Array<gbjs.Card>}
     */
    p._getTuQuyTohon = function () {
        var self = this;
        var cardFire = this.cardsFire[0];
        var i = 0;
        if (this.getRank(cardFire) > this.rank) {
            return [];
        }
        return this._getTuQuy();
    }

    /**
     * @return {String}
     */
    p._getMinPush = function () {
        return this.handCards[this.handCards.length - 1].getValue();
    }

    /**
     * @param  {gbjs.Card} cardSelect
     * @param {Number} sodoithong
     * @return {Array}
     */
    p._getSodoithongChon = function (sodoithong) {
        if (this.getRank(this.cardsFire[0]) > this.rank) {
            return;
        }
        return this._getDoithong(sodoithong);
    }


    /**
     * @param  {Number} cardSelect
     * @return {Array}
     */
    p._getTuQuy = function () {
        var self = this;
        var results = _.filter(self.handCards, function (card) {
            return (self.getRank(card.getValue()) == self.rank);
        });
        if (results.length < 4) {
            results = [];
        }
        return results;
    }

    /**
     * @param  {Number} cardSelect
     * @param {Number} sodoithong
     */
    p._getDoithong = function (sodoithong) {
        var results = [];
        var rank = this.rank;
        var indexCard = this.index;
        for (var i = 0; i < sodoithong; i++) {
            var dudoi = 0;
            for (var j = 0; j < this.handCards.length; j++) {
                if (this.getRank(this.handCards[j].getValue()) == rank) {
                    dudoi++;
                    results.push(this.handCards[j]);
                    if (dudoi == 2) {
                        break;
                    }
                }
            }

            if (dudoi < 2) {
                results = [];
                break;
            }
            rank++;

        }
        if (results.length / 2 != sodoithong) {
            results = [];
        }
        return results;
    }

    /**
     * @method _getArrSpecialSuit
     * @param {Number} sodoithong
     * @return {Number}
     */
    p._getArrSpecialSuit = function (sodoithong) {
        var results = [];
        switch (sodoithong) {
            case 3:
                // tim 3 doi thong to hon or bang
                results = this._getDoithong(sodoithong);
                if (results.length == 0) {
                    //tim them tu quy
                    results = this._getTuQuy();
                }
                break;
            case 4:
                results = this._getDoithong(sodoithong);
                break;
            case 5:
                results = this._getTuQuyTohon();
                if (results.length == 0) {
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
    p._getSelectNgang = function () {
        var self = this;
        var cards = [];
        var cfl = self.cardsFire.length;
        //cards
        cards = self.getCartsByRank(self.rank);

        if (cards.length < cfl.length) {
            return [];
        }
        if (cfl == 2 && this.getRank(self.cardsFire[0]) == self.rank) {
            var max1 = self.cardsFire[1] % 4;
            var max2 = cards[0].getValue() % 4;
            var max3 = cards[1].getValue() % 4;
            if (max2 < max3) {
                max2 = max3;
            }

            if (max1 > max2) {
                cards = [];
            }
        } else if (self.rank > this.getRank(self.cardsFire[0])) {
            cards = cards.slice(0, cfl - 1);
            if (cards.indexOf(self.card) == -1) {
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
    p.getCartByRank = function (rank) {
        var _self = this;
        return _.find(this.handCards, function (card) {
            return (_self.getRank(card.getValue()) == rank);
        });
    }

    /**
     * @method getCartByRank
     * 
     * @return {Number} rank
     * @return {<Array<gbjs.Card>}
     */
    p.getCartsByRank = function (rank) {
        var _self = this;
        return _.filter(this.handCards, function (card) {
            return (_self.getRank(card.getValue()) == rank);
        });
    }

    /**
     * @method isUndefined
     * 
     * @return {boolean}
     */
    p.isUndefined = function (fn) {
        return (typeof (fn) == 'undefined');
    }

    /**
     * @method _getDoc
     * 
     * @return {Array<Null, gbjs.Card<Object>>}
     */
    p._getDoc = function () {
        var self = this;
        var results = [];
        var card = self.card;
        var rankOfCardSelect = self.rank;
        var rankOfCardFire = this.getRank(self.cardsFire[0]);
        if (rankOfCardSelect < rankOfCardFire) {
            return [];
        }
        results.push(card);
        for (var i = 1; i < this.cardsFire.length; i++) {
            rankOfCardSelect++;

            card = _.find(self.handCards, function (handCard) {
                var currentRank = self.getRank(handCard.getValue());
                if(currentRank == 12) return false;
                if (self.getRank(handCard.getValue()) == rankOfCardSelect) {
                    if (i != (self.cardsFire.length - 1)) {
                        return true;
                    }
                    if (handCard.getValue() > self.cardsFire[i]) {
                        return true;
                    }
                }
                return false;
            })
            if (!this.isUndefined(card)) {
                results.push(card);
            } else {
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
    p.getRank = function (card) {
        return Math.floor(card / 4);
    }

    /**
     * @method getPhomSpecial
     * 
     * @return {Array} cards
     * @return {Number}
     */
    p.getPhomSpecial = function (cards) {
        var result = 0, rank1, rank2;
        switch (cards.length) {
            // check tu quy
            case 4:
                rank1 = this.getRank(cards[0]);
                rank2 = this.getRank(cards[1]);
                if (rank1 == rank2) {
                    result = 5;
                }
                break;
                // check đôi thông
            case 6:
                rank1 = this.getRank(cards[0]);
                rank2 = this.getRank(cards[2]);
                if (rank1 == (rank2 - 1)) {
                    result = 3; //"3 ĐÔI THÔNG";
                }
                break;
            case 8:
                rank1 = this.getRank(cards[0]);
                ;
                rank2 = this.getRank(cards[2]);
                ;
                if (rank1 == (rank2 - 1)) {
                    result = 4; //"4 ĐÔI THÔNG";
                }
                break;
        }

        return result;
    }

    TWIST.TLMNLogic = TLMNLogic;
})();