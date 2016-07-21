/**
 * @module utils
 */
this.Global = this.Global || {};

(function () {
    "use strict";

    /**
     * Static class utils
     * the library.
     * @object utils
     **/

    Global = {
        autoFit: function () {
            var width = 1280, height = 720;
            _autoFit = function () {
                var windowWidth = window.innerWidth;
                var windowHeight = window.innerHeight;
                var wRatio = windowWidth / width;
                var hRatio = windowHeight / height;
                var zoom = (wRatio > hRatio) ? hRatio : wRatio;
                zoom = zoom > 1 ? 1 : zoom;
                var content = $("#main");
                var gameplayCanvas = $("#gameplayStage");
                var left = (windowWidth - 1000 * zoom) / 2;
                gameplayCanvas.css({"width": width * zoom, "height": height * zoom, left: left + "px"});
                content.css("zoom", zoom);
                return {"zoom": zoom};
            };
            _autoFit();
            window.removeEventListener("resize", _autoFit, true);
            window.addEventListener("resize", _autoFit, true);
        },
        getParameterByName: function (name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                    results = regex.exec(location.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        },
        numberWithDot: function (x) {
            if (isNaN(x))
                return 0;
            var parts = x.toString().split(".");
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            return parts.join(".");
        },
        _generateUniqueId: function () {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
            }
            return (function () {
                return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
            })();
        },
        getUniqueId: function () {
            var uniqueId = localStorage.getItem("___uniqueId___");
            if (!uniqueId) {
                uniqueId = this._generateUniqueId();
                localStorage.setItem("___uniqueId___", uniqueId);
            }
            return uniqueId;
        },
        converEsObject: function (EsObject) {
            var data = EsObject.data;
            if (!data)
                data = EsObject;
            if (!data)
                return;
            var dataJSON = '{';
            for (var proName in data) {
                if (dataJSON != '{') {
                    dataJSON += ',';
                }
                var propertier = data[proName];
                dataJSON = dataJSON + '"' + proName + '":' + JSON.stringify(propertier.value);
            }
            dataJSON += '}';
            return JSON.parse(dataJSON);
        },
        convertData: function (data) {
            var dataConverted = {};
            for (var key in data) {
                dataConverted[AppKeysConvert[key] ? AppKeysConvert[key] : key] = data[key];
            }
            return dataConverted;
        },
        convertBettingToChip: function (betting, unit) {
            if (isNaN(betting) || isNaN(unit))
                return [1];
            var multiples = Math.floor(betting / unit);
            var biggestChipIndex = ChipRatio.findIndex(function (item) {
                return multiples >= item;
            });
            if (biggestChipIndex < 0)
                biggestChipIndex = ChipRatio.length;
            var chipArray = [];
            for (var i = ChipRatio.length; i > 0; i--) {
                var numberChip = Math.floor(multiples / ChipRatio[i - 1]);
                if (numberChip > 0) {
                    chipArray.push({
                        type: i - 1,
                        number: numberChip
                    });
                }
            }
            return chipArray;
        }
    };
})();
/*
 * JavaScript MD5
 * https://github.com/blueimp/JavaScript-MD5
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 *
 * Based on
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */

/*global unescape, define, module */

;(function ($) {
  'use strict'

  /*
  * Add integers, wrapping at 2^32. This uses 16-bit operations internally
  * to work around bugs in some JS interpreters.
  */
  function safe_add (x, y) {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF)
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16)
    return (msw << 16) | (lsw & 0xFFFF)
  }

  /*
  * Bitwise rotate a 32-bit number to the left.
  */
  function bit_rol (num, cnt) {
    return (num << cnt) | (num >>> (32 - cnt))
  }

  /*
  * These functions implement the four basic operations the algorithm uses.
  */
  function md5_cmn (q, a, b, x, s, t) {
    return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b)
  }
  function md5_ff (a, b, c, d, x, s, t) {
    return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t)
  }
  function md5_gg (a, b, c, d, x, s, t) {
    return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t)
  }
  function md5_hh (a, b, c, d, x, s, t) {
    return md5_cmn(b ^ c ^ d, a, b, x, s, t)
  }
  function md5_ii (a, b, c, d, x, s, t) {
    return md5_cmn(c ^ (b | (~d)), a, b, x, s, t)
  }

  /*
  * Calculate the MD5 of an array of little-endian words, and a bit length.
  */
  function binl_md5 (x, len) {
    /* append padding */
    x[len >> 5] |= 0x80 << (len % 32)
    x[(((len + 64) >>> 9) << 4) + 14] = len

    var i
    var olda
    var oldb
    var oldc
    var oldd
    var a = 1732584193
    var b = -271733879
    var c = -1732584194
    var d = 271733878

    for (i = 0; i < x.length; i += 16) {
      olda = a
      oldb = b
      oldc = c
      oldd = d

      a = md5_ff(a, b, c, d, x[i], 7, -680876936)
      d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586)
      c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819)
      b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330)
      a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897)
      d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426)
      c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341)
      b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983)
      a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416)
      d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417)
      c = md5_ff(c, d, a, b, x[i + 10], 17, -42063)
      b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162)
      a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682)
      d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101)
      c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290)
      b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329)

      a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510)
      d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632)
      c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713)
      b = md5_gg(b, c, d, a, x[i], 20, -373897302)
      a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691)
      d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083)
      c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335)
      b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848)
      a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438)
      d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690)
      c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961)
      b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501)
      a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467)
      d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784)
      c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473)
      b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734)

      a = md5_hh(a, b, c, d, x[i + 5], 4, -378558)
      d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463)
      c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562)
      b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556)
      a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060)
      d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353)
      c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632)
      b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640)
      a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174)
      d = md5_hh(d, a, b, c, x[i], 11, -358537222)
      c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979)
      b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189)
      a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487)
      d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835)
      c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520)
      b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651)

      a = md5_ii(a, b, c, d, x[i], 6, -198630844)
      d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415)
      c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905)
      b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055)
      a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571)
      d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606)
      c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523)
      b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799)
      a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359)
      d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744)
      c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380)
      b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649)
      a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070)
      d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379)
      c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259)
      b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551)

      a = safe_add(a, olda)
      b = safe_add(b, oldb)
      c = safe_add(c, oldc)
      d = safe_add(d, oldd)
    }
    return [a, b, c, d]
  }

  /*
  * Convert an array of little-endian words to a string
  */
  function binl2rstr (input) {
    var i
    var output = ''
    for (i = 0; i < input.length * 32; i += 8) {
      output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xFF)
    }
    return output
  }

  /*
  * Convert a raw string to an array of little-endian words
  * Characters >255 have their high-byte silently ignored.
  */
  function rstr2binl (input) {
    var i
    var output = []
    output[(input.length >> 2) - 1] = undefined
    for (i = 0; i < output.length; i += 1) {
      output[i] = 0
    }
    for (i = 0; i < input.length * 8; i += 8) {
      output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (i % 32)
    }
    return output
  }

  /*
  * Calculate the MD5 of a raw string
  */
  function rstr_md5 (s) {
    return binl2rstr(binl_md5(rstr2binl(s), s.length * 8))
  }

  /*
  * Calculate the HMAC-MD5, of a key and some data (raw strings)
  */
  function rstr_hmac_md5 (key, data) {
    var i
    var bkey = rstr2binl(key)
    var ipad = []
    var opad = []
    var hash
    ipad[15] = opad[15] = undefined
    if (bkey.length > 16) {
      bkey = binl_md5(bkey, key.length * 8)
    }
    for (i = 0; i < 16; i += 1) {
      ipad[i] = bkey[i] ^ 0x36363636
      opad[i] = bkey[i] ^ 0x5C5C5C5C
    }
    hash = binl_md5(ipad.concat(rstr2binl(data)), 512 + data.length * 8)
    return binl2rstr(binl_md5(opad.concat(hash), 512 + 128))
  }

  /*
  * Convert a raw string to a hex string
  */
  function rstr2hex (input) {
    var hex_tab = '0123456789abcdef'
    var output = ''
    var x
    var i
    for (i = 0; i < input.length; i += 1) {
      x = input.charCodeAt(i)
      output += hex_tab.charAt((x >>> 4) & 0x0F) +
      hex_tab.charAt(x & 0x0F)
    }
    return output
  }

  /*
  * Encode a string as utf-8
  */
  function str2rstr_utf8 (input) {
    return unescape(encodeURIComponent(input))
  }

  /*
  * Take string arguments and return either raw or hex encoded strings
  */
  function raw_md5 (s) {
    return rstr_md5(str2rstr_utf8(s))
  }
  function hex_md5 (s) {
    return rstr2hex(raw_md5(s))
  }
  function raw_hmac_md5 (k, d) {
    return rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d))
  }
  function hex_hmac_md5 (k, d) {
    return rstr2hex(raw_hmac_md5(k, d))
  }

  function md5 (string, key, raw) {
    if (!key) {
      if (!raw) {
        return hex_md5(string)
      }
      return raw_md5(string)
    }
    if (!raw) {
      return hex_hmac_md5(key, string)
    }
    return raw_hmac_md5(key, string)
  }

  if (typeof define === 'function' && define.amd) {
    define(function () {
      return md5
    })
  } else if (typeof module === 'object' && module.exports) {
    module.exports = md5
  } else {
    $.md5 = md5;
  }
}(this))
this.TWIST = this.TWIST || {};

(function() {
	"use strict";
        
//        var instanceServer;
//        
//	function Observer(cardsFire, card) {
//              if(instanceServer) return instanceServer; 
//              this.init();
//	}
//        
//        var p = Observer.prototype = new EventEmitter();
//        
//        p.init = function(){
//            instanceServer = this;
//        };

        TWIST.Observer = new EventEmitter();
})();
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
        ;
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
            return (this.getRank(card.getValue()) == self.rank);
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
            for (var j = indexCard + i; j < this.handCards.length; j++) {
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
        return _.find(this.handCards, function (card) {
            return (this.getRank(card.getValue()) == rank);
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
                if (this.getRank(handCard.getValue()) == rankOfCardSelect) {
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
this.FATE = this.FATE || {};

(function() {
	"use strict";
        
        var instanceServer;
        
	function MockupServer(cardsFire, card) {
              if(instanceServer) return instanceServer; 
              this.init();
	}
        
        var p = MockupServer.prototype;
        
        p.init = function(){
            this.rooms = [];
        };

        FATE.MockupServer = MockupServer;
})();
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
                x: 90,
                y: 20,
                align: 'left'
            };
        }

        if (maxUser === 4) {
            playerPosition = Desk.playerPositions[maxUser];
            handPosition[0] = {x: 150, y: -50, align: 'center'};
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
        this.set({startTime: 0, totalTime: 0, remainingTime: 0, currentTimer: 0});
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
        this.startAngle = -Math.PI * 1 / 2;
        this.endAngle = -Math.PI * 1 / 2 + currentTimer * Math.PI * 2;
        this.timerLine.graphics.s("#fee802").ss(this.strokeThick).arc(this.radius, this.radius, this.radius, this.startAngle, this.endAngle, false);
    };

    p.setCounter = function (totalTime, remainingTime) {
        this.totalTime = totalTime || 20000;
        this.remainingTime = remainingTime || 20000;
        this.startTime = (new Date()).getTime() - (this.totalTime - this.remainingTime);
        this.currentTimer = (this.totalTime - this.remainingTime) / this.totalTime;
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
            delete this.callback;
        }
    };
    p.tick = function () {
        this.currentTimer = ((new Date()).getTime() - this.startTime) / this.totalTime;
        if (this.currentTimer >= 1) {
            this.clearTimer();
            return;
        }
        this.drawPercentRect(this.currentTimer);
    };

    p.startTimer = function (totalTime, remainingTime) {
        this.clearTimer();
        this.setCounter(totalTime, remainingTime);
        var _self = this;
        this.tween = createjs.Tween.get(this.timerLine)
                .to({}, remainingTime)
                .call(function () {
                    _self.clearTimer();
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

    var imagePath = location.origin + location.pathname + '../src/images/';
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

    Player.draftCardsConfig = {x: 100, y: 100, align: "left"};

    var p = Player.prototype = new createjs.Container();

    p.contructor_initialize = p.initialize;

    p.initialize = function (data) {
        this.contructor_initialize();
        $.extend(this, data);
        this.initCanvas();
    };

    p.initCanvas = function () {
        var self = this;
        var config = this.config || {};
        var avatarConfig = config.avartar || Player.avatarConfig;

        this.initUsername(config, self);
        this.initAvatar(config, self);
        this.initDraftCards(config, self);
        this.initHandCards(config, self);
        this.initChatMessage(config, self);
        this.initMoneyEffect(config, self);
        this.initStatus(config, self);
        this.timer = new TWIST.Timer({x: avatarConfig.x, y: avatarConfig.y, radius : avatarConfig.radius,strokeThick : 10 });

        this.addChild(this.timer, this.avatarContainer, this.usernameContainer, this.draftCards, this.hand, this.status, this.chat, this.moneyChangeEffect);
        this.render();
    };

    p.initUsername = function (config, self) {
        var usernameContainer = new createjs.Container();
        var usernameConfig = config.username || Player.usernameConfig;
        $.extend(usernameContainer, usernameConfig);

        var usernameText = new createjs.Text(this.username, '18px Roboto Condensed', 'white');
        usernameText.set({x: 50, y: 20, textAlign: 'center', textBaseline: 'bottom'});
        var moneyText = new createjs.Text(this.money, '14px Roboto Condensed', '#f3ba04');
        moneyText.set({x: 50, y: 40, textAlign: 'center', textBaseline: 'bottom'});
        var usernameBg = new createjs.Shape();
        usernameBg.graphics.beginFill("black").drawRoundRectComplex(0, 0, usernameConfig.width, usernameConfig.height, 10, 10, 10, 10);
        usernameBg.alpha = 0.2;
        usernameContainer.addChild(usernameBg, usernameText, moneyText);
        this.usernameContainer = usernameContainer;
    };

    p.initAvatar = function (config, self) {
        //        avatar container

        var avatarContainer = new createjs.Container();
        var avatarConfig = config.avartar || Player.avatarConfig;
        var avatarImageDiameter = avatarConfig.innerRadius * 2;
        $.extend(avatarContainer, avatarConfig);

        var avatarImage = new Image();
        var avatarHash = md5(this.username);
        var avatarNumber = parseInt((avatarHash.match(/\d+/)[0] || 1)[0]) || 10;
        avatarImage.src = (TWIST.imagePath || imagePath) + 'player/avatars/' + avatarNumber + '.png';
        var avatarBitmap = new createjs.Bitmap(avatarImage);
        avatarImage.onload = function () {
            avatarBitmap.set({
                width: avatarImageDiameter,
                height: avatarImageDiameter,
                scaleX: avatarImageDiameter / avatarImage.width,
                scaleY: avatarImageDiameter / avatarImage.height
            });
        };
        avatarBitmap.set({x : avatarConfig.radius - avatarConfig.innerRadius, y : avatarConfig.radius - avatarConfig.innerRadius})

        var maskShape = new createjs.Shape();
        maskShape.graphics.drawCircle(avatarConfig.radius, avatarConfig.radius, avatarConfig.innerRadius);
        avatarBitmap.mask = maskShape;

        var avatarBg = new createjs.Shape();
        avatarBg.graphics.beginFill('#000').drawCircle(avatarConfig.radius, avatarConfig.radius, avatarConfig.radius);
        avatarBg.set({alpha: 0.7});

        var roomMasterImage = new Image();
        roomMasterImage.src = (TWIST.imagePath || imagePath) + 'player/' + 'icon_chuphong.png';
        var roomMaster = new createjs.Bitmap(roomMasterImage);
        roomMaster.set({x: avatarImageDiameter * 0.7, y: avatarImageDiameter * 0.7,
            name: "roomMaster", visible: this.isRoomMaster
        });
        var roomMasterSize = avatarImageDiameter * 0.3;
        roomMasterImage.onload = function () {
            roomMaster.set({
                width: roomMasterSize,
                height: roomMasterSize,
                scaleX: roomMasterSize / roomMasterImage.width,
                scaleY: roomMasterSize / roomMasterImage.height
            });
        };

        var avatarHit = new createjs.Shape();
        avatarHit.graphics.beginFill('#fff').drawRect(0, 0, avatarImageDiameter, avatarImageDiameter);
        avatarContainer.hitArea = avatarHit;

        avatarContainer.addChild(avatarBg, avatarBitmap, roomMaster);
        this.avatarContainer = avatarContainer;
    };

    p.initDraftCards = function (config, self) {
        //        draft cards

        var draftCardsConfig = config.draftCards || Player.draftCardsConfig;
        this.draftCards = new createjs.Container();
        $.extend(this.draftCards, draftCardsConfig);
    };

    p.initHandCards = function (config, self) {
        //        hand container
        var handConfig = config.handPositions || Player.handConfig;
        this.hand = new createjs.Container();
        $.extend(this.hand, handConfig);
        var card = TWIST.Card.playerCard;
        var radius = (card.width - 3) / 2;

        this.handCards = new createjs.Container();
        this.numberOfCards = new createjs.Container();
        this.numberOfCards.set({x: 0, y: 0});
        var numberOfCardsBg = new createjs.Shape();
        numberOfCardsBg.graphics.beginFill('#000').drawCircle(card.width / 2, card.height / 2, radius);
        numberOfCardsBg.set({alpha: 0.3, visible: false});
        var numberOfCards = new createjs.Text("", (radius * 1.5) + 'px Roboto Condensed', '#7fc100');
        numberOfCards.set({x: card.width / 2, y: card.height / 2, textAlign: 'center', visible: false, name: "numberOfCard", textBaseline: 'middle'});
        this.numberOfCards.addChild(numberOfCardsBg, numberOfCards);

        this.hand.addChild(this.handCards, this.numberOfCards);
    };

    p.initChatMessage = function (config, self) {
        //show chat message
        this.chat = new createjs.Container();
        this.chat.set({name: 'chat'});
        var chatText = new createjs.Text('', '22px Roboto Condensed', '#000');
        chatText.set({textAlign: 'center', textBaseline: 'bottom'});
        var chatBg = new createjs.Shape();
        this.chat.addChild(chatBg, chatText);
    };

    p.initMoneyEffect = function (config, self) {
        //show change money effect
        this.moneyChangeEffect = new createjs.Container();
        this.moneyChangeEffect.set({name: 'moneyChangeEffect', x: 50, y: 50});
        var moneyChangeBg = new createjs.Text("", "30px Roboto Condensed", "black");
        moneyChangeBg.set({x: 1, y: 11, textAlign: 'center', textBaseline: 'bottom'});
        var moneyChangeText = new createjs.Text("", "30px Roboto Condensed");
        moneyChangeText.set({x: 0, y: 10, textAlign: 'center', textBaseline: 'bottom'});
        moneyChangeText.shadow = new createjs.Shadow("#000", 0, 0, 10);
        this.moneyChangeEffect.addChild(moneyChangeBg, moneyChangeText);
    };

    p.initStatus = function (config, self) {
        //player status
        this.status = new createjs.Container();
        this.status.set({x: 50, y: 50});
        var statusBg = new createjs.Text();
        var statusText = new createjs.Text();
        this.status.addChild(statusBg, statusText);
    };

    p.render = function () {
        this.setPlayerName(this.username);
        this.setMoney(this.money);
        this.setRoomMaster(this.isRoomMaster);
        return;
    };

    p.setRemainingTime = function (remainingTime, totalTime) {
        remainingTime = remainingTime || 20000;
        totalTime = totalTime || 20000;
        this.timer.startTimer(totalTime, remainingTime);
    };
    
    p.clearTimer = function (remainingTime, totalTime) {
        this.timer.clearTimer();
    };

    p.setPlayerName = function (name) {

        var usernameContainer = this.usernameContainer;
        var usernameText = usernameContainer.getChildAt(1);
        usernameText.text = name;
        var measuredWidth = usernameText.getMeasuredWidth();
        var usernameMaxWidth = Player.usernameConfig.width;
        if (measuredWidth > usernameMaxWidth) {
            var ratio = usernameMaxWidth / measuredWidth;
            var newLength = Math.round(usernameText.text.length * ratio) - 3;
            usernameText.text = usernameText.text.substring(0, newLength) + "...";
        }
    };

    p.setMoney = function (money) {
        var usernameContainer = this.usernameContainer;
        this.money = money;
        var moneyText = usernameContainer.getChildAt(2);
        moneyText.text = Global.numberWithDot(money);
    };

    p.setRoomMaster = function (roomMaster, oldRoomMasterPosition) {
        if (typeof roomMaster === undefined)
            roomMaster = this.isRoomMaster;
        else
            this.isRoomMaster = roomMaster;
        var roomMasterItem = this.avatarContainer.getChildByName("roomMaster");
        roomMasterItem.visible = roomMaster;
        if (roomMaster) {
            var oldScale = {
                scaleX: roomMasterItem.scaleX,
                scaleY: roomMasterItem.scaleY
            };
            roomMasterItem.set({scaleX: 1, scaleY: 1});
            var initGlobalPosition = roomMasterItem.globalPosition = roomMasterItem.globalToLocal(0, 0);
            roomMasterItem.set(oldScale);

            if (oldRoomMasterPosition) {
                var initPosition = {
                    x: roomMasterItem.x,
                    y: roomMasterItem.y
                };
                var currentPosition = {
                    x: initPosition.x + initGlobalPosition.x - oldRoomMasterPosition.x,
                    y: initPosition.y + initGlobalPosition.y - oldRoomMasterPosition.y
                };
                roomMasterItem.set(currentPosition);
                createjs.Tween.get(roomMasterItem)
                        .to({
                            x: initPosition.x,
                            y: initPosition.y
                        }, _animationTime).call(function () {

                });

            }
        }

        return roomMasterItem;
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
        hand.visible = true;

        this._renderHandCards(this.handCards.cardList, options);
        var _self = this;
        if (this.hideCardLength) {
            this.numberOfCards.visible = false;
        } else {
            setTimeout(function () {
                _self.setNumberCards(_self.handCards.cardList.length);
            }, 1000);
        }

    };

    p._renderHandCards = function (listCard, options) {
        var _self = this;
        options = options || {};

        this.handCards.removeAllChildren();

        var handCards = this.handCards,
                cardType = options.cardType || (this.position == 0 ? TWIST.Card.userCard : TWIST.Card.playerCard),
                numberCard = listCard.length,
                desk = this.parent.parent.getChildAt(1),
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
            this.addHandCards(cardImage, options);
        }
    };

    p.setNumberCards = function (numOfCards) {

        var cardNumberBg = this.numberOfCards.getChildAt(0);
        var cardNumber = this.numberOfCards.getChildAt(1);
        if (this.position !== 0 && numOfCards > 0) {
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
                cardType = options.cardType || (this.position === 0 ? TWIST.Card.userCard : TWIST.Card.playerCard);
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

    p.draftCardsInHand = function (cardList, options) {
        var options = options || {},
                cardsToDrash = [],
                bai = TWIST.Card.draftCard,
                cardsToDrash = this.getCardsInHand(cardList),
                draftCards = options.draftCards || this.draftCards;
        var newPosition = options.position || {
            x: draftCards.children.length * bai.seperator,
            y: 0
        };
        if (this.draftCards.align === "right" && !options.position) {
            newPosition.x = 300 - newPosition.x;
        }
        for (var i = 0, length = cardsToDrash.length; i < length; i++) {
            var card = cardsToDrash[i];
            card.cardValue = cardList[i];
            var newOptions = $.extend(options, {
                draftCards: draftCards,
                position: newPosition,
                reSort: i === length - 1
            });
            this.draftSingleCard(card, newOptions);
            if (this.draftCards.align == "right" && !options.position) {
                newPosition.x -= bai.seperator;
            } else {
                newPosition.x += bai.seperator;
            }
        }
        this.setNumberCards(this.handCards.children.length);
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
            if (_self.position !== 0) {
                this.openCard(this.cardValue,bai);
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
            var indexLeft = (TWIST.Desk.width - length * TWIST.Card.userCard.seperator - (_self.hand.x + _self.x) * 2) / 2;
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
        var chipContainerBg = new createjs.Bitmap((TWIST.imagePath || imagePath) + 'player/' + 'money-container.png');
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
        var absMoney = Global.numberWithDot(Math.abs(parseInt(money)));
        if (type === "lose") {
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
        '0': 'STATUS_WAITING_FOR_PLAYER',
        '1': 'STATUS_WAITING_FOR_START',
        '2': 'STATUS_PLAYING',
        '3': 'STATUS_ENDING',
        '4': 'STATUS_WAITING_FOR_READY',
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
        this.initErrotPanel();
        this.initButtonBar();
        this.userInfo = {};
        this.status = InRoomGame.statusList['0'];
        this.model = this.model || {};
    };

    p.initErrotPanel = function () {
        this.errorPanel = this.wrapper.find('.error-panel');
        this.errorList = this.errorList || {};
        $.extend(this.errorList, {
            0: "Lỗi hệ thống !",
            1470: "Chưa chọn cây bài !"
        });
    };

    p.initButtonBar = function () {
        this.buttonBar = this.wrapper.find('.button-bar');
        this.buttonBar.hide();
        this.startButton = this.buttonBar.find('#start-button');
    };

    p.drawRoom = function () {
        this.playersContainer = new createjs.Container();
        this.desk = new TWIST.Desk(this.options);
        this.canvas.addChild(this.playersContainer, this.desk);
    };

    p.pushInRoomGameEvent = function () {
        this.on("userInfo", this.setUserInfo);

        this.on("gameInfo", this.drawGameInfo);

        this.on("userJoin", this.addPlayer);

        this.on("userQuit", this.removePlayer);

        this.on("error", this.showError);

        this.on("changeMaster", this.changeRoomMaster);

        this.on("isolateUpdateMoney", this.isolateUpdateMoney);

        this.on("userChat", this.userChat);

        this.on("changeStatus", this.changeStatus);

        this.on("updateInfo", this.updateInfo);

//        gameplayer Event

        this.on("dealCards", this.dealCards);

        this.on("setDealCards", this.setDealCards);

        this.on("hitTurn", this.onHitTurn);

        this.on("draftCards", this.onDraftCards);

        this.on("endTurn", this.onEndTurn);

        this.on("foldTurn", this.foldTurn);

        this.on("endGame", this.endGame);

        this.on("reconnect", this.reconnect);

        this.on("updateUuid", this.updateUuid);
    };

    p.setUserInfo = function (data) {
        this.userInfo = data || {};
        this.userInfo.uuid = data.uuid || data.id;
    };

    p.drawGameInfo = function (data) {
        var model = this.model || {};
        this.model = model;
        $.extend(model, data);

        this.drawPlayers();

        if (this.status === 'STATUS_PLAYING') {
            this.drawPlayingState(data);
        }
    };

    p.addPlayer = function (data) {

        var userPosition =  this.userInfo.position;
        var playerIndex = data.position - userPosition;
        if(playerIndex < 0) playerIndex += this.options.maxPlayers;
        var config = this.desk.config;

        var currenConfig = {};
        for (var pro in config) {
            currenConfig[pro] = config[pro][playerIndex];
        }
        data.config = currenConfig;

        var playerPositions = this.desk.config.playerPositions;
        var playerIndex = data.position - this.userInfo.position;
        if (playerIndex < 0)
            playerIndex += this.options.maxPlayers;
        $.extend(data, playerPositions[playerIndex]);
        this.model.players.push(data);
        if (this.playersContainer.children.length < this.options.maxPlayers) {
            this.drawPlayer(data);
        }
    };

    p.removePlayer = function (data) {
        var player = this.getPlayerByUuid(data.uuid);
        if (player) {
            this.playersContainer.removeChild(player);
        }
        var playerData = this.removePlayerData(data.uuid);
    };

    p.showError = function (data) {
        var message = this.errorList[data.code];
        message = message || data.message;
        var errorItem = $('<div class="error-item">' + message + '</div>');
        $(errorItem).css({margin: "0 auto", display: "inline-block"});
        this.errorPanel.empty();
        this.errorPanel.append(errorItem);
        var _self = this;
        errorItem.one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function () {
            $(errorItem).remove();
        });
    };

    p.changeRoomMaster = function (data) {
        var oldRoomMasterPosition = this.roomMasterIcon.globalPosition;
        var uuid = data.uuid;
        var players = this.model.players || [];
        for (var i = 0, length = players.length; i < length; i++) {
            var player = players[i];
            var Player = this.getPlayerByUuid(player.uuid);
            if (player.uuid === uuid) {
                player.isRoomMaster = true;
                if (Player) {
                    this.roomMasterIcon = Player.setRoomMaster(true, oldRoomMasterPosition);
                }
            } else {
                player.isRoomMaster = false;
                if (Player)
                    Player.setRoomMaster(false);
            }
        }
    };

    p.updateInfo = function (data) {
        var player = this.getPlayerDataByUuid(this.userInfo.uuid);
        $.extend(player, data);
        var Player = this.getPlayerByUuid(this.userInfo.uuid);
        var _self = this;
        if (Player) {
            $.extend(Player, data);
            Player.render();
        }
    };

    p.isolateUpdateMoney = function (data) {
        var players = data.players;
        var _self = this;
        players.forEach(function (item, index) {
            var playerData = _self.getPlayerDataByUuid(item.uuid);
            if (playerData) {
                playerData.money = parseInt(playerData.money) + item.changeMoney;
                var Player = _self.getPlayerByUuid(item.uuid);
                if (Player) {
                    Player.setMoney(playerData.money);
                    var type = item.changeMoney < 0 ? "lose" : "win";
                    Player.showMoneyExchageEffect(item.changeMoney, type);
                }
            }
        });
    };

    p.userChat = function (data) {

    };

    p.changeStatus = function (data) {
        this.status = InRoomGame.statusList[data.newStatus];
        var func = this[this.status];
        if (typeof func === "function") {
            func.call(this);
        }
        this.emit("ping");
    };

    p.endGame = function (data) {

    };

    p.reconnect = function (data) {

    };

    p.drawPlayers = function () {
        var players = this.model.players || [];
        var _self = this;
        var userPosition = 0;
        players.forEach(function (item, index) {
            if (item.uuid === _self.userInfo.uuid) {
                userPosition = item.position;
                $.extend(_self.userInfo, item);
            }
        });

        players.sort(function (a, b) {
            var fistPosition = a.position - userPosition;
            if (fistPosition < 0) {
                fistPosition += _self.options.maxPlayers;
            }
            var seconPosition = b.position - userPosition;
            if (seconPosition < 0) {
                seconPosition += _self.options.maxPlayers;
            }
            return fistPosition - seconPosition;
        });

        var config = this.desk.config;
        players.forEach(function (item, index) {
            $.extend(item, config.playerPositions[index]);
            var currenConfig = {};
            for (var pro in config) {
                currenConfig[pro] = config[pro][index];
            }
            item.config = currenConfig;
            _self.drawPlayer(item);
        });
    };

    p.drawPlayer = function (playerData) {
        playerData.config = playerData.config || {};
        playerData.index = playerData.index || 0;

        var newPlayer = new TWIST.Player(playerData);
        this.playersContainer.addChild(newPlayer);

        if (playerData.isRoomMaster) {
            this.roomMasterIcon = newPlayer.setRoomMaster(true);
        }
    };

    p.getPlayerByUuid = function (uuid) {
        var players = this.playersContainer.children || [];
        for (var i = 0, length = players.length; i < length; i++) {
            var player = players[i];
            if (player.uuid === uuid)
                return player;
        }
    };

    p.getPlayerDataByUuid = function (uuid) {
        var players = this.model.players || [];
        for (var i = 0, length = players.length; i < length; i++) {
            var player = players[i];
            if (player.uuid === uuid)
                return player;
        }
    };

    p.getCurrentPlayer = function (uuid) {
        var currentUuid = this.userInfo.uuid;
        return this.getPlayerByUuid(currentUuid);
    };

    p.removePlayerData = function (uuid) {
        var players = this.model.players || [];
        var index = players.length;
        for (var i = 0, length = players.length; i < length; i++) {
            var player = players[i];
            if (player.uuid === uuid) {
                index = i;
                break;
            }
        }
        players.splice(index, 1);
    };

    p.updateUuid = function (data) {
        var username = data.username;
        if (!this.model || !this.model.players)
            return;
        var playerList = this.model.players;
        for (var i = 0, length = playerList.length; i < length; i++) {
            if (playerList[i].username === username) {
                playerList[i].uuid = data.uuid;
            }
        }
        var PlayerList = this.playersContainer.children;
        for (var i = 0, length = PlayerList.length; i < length; i++) {
            if (PlayerList[i].username === username) {
                PlayerList[i].uuid = data.uuid;
            }
        }
        ;
    };

    TWIST.InRoomGame = InRoomGame;

})();
this.TWIST = this.TWIST || {};

(function () {
    "use strict";

    var initOptions = {
        maxPlayers: 4,
        numberCardsInHand: 13,
        turnTime: 20000
    };

    function TLMNDemlaGame(wrapper, options) {
        this.options = options || {};
        $.extend(this.options, initOptions);
        this.wrapper = $(wrapper);
        this.initTLMNDemlaGame();
    }

    var p = TLMNDemlaGame.prototype = new TWIST.InRoomGame();

    p.initTLMNDemlaGame = function (wrapper) {
        TWIST.Card.RankMapIndex = ["3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "1", "2"];
        this.initInRoomGame();
        this.pushTLMNDemlaEvent();
        this.initResultPanel();
        this.initEvent();
        this.bindButton();
        this.observerEvent();
    };

    p.pushTLMNDemlaEvent = function () {
        this.on("gameInfo", this.drawGameInfo);
    };

    p.STATUS_WAITING_FOR_PLAYER = function () {
        this.buttonBar.hide();
    };

    p.STATUS_WAITING_FOR_START = function () {
        this.buttonBar.show();
        this.buttonBar.find('.button').hide();

        var playerData = this.getPlayerDataByUuid(this.userInfo.uuid);
        if (playerData && playerData.isRoomMaster) {
            this.startButton.show();
        }
    };

    p.initResultPanel = function () {
        this.resultPanel = this.wrapper.find('#result-panel');
        this.resultPanel.hide();
    };

    p.observerEvent = function () {
        var _self = this;
        TWIST.Observer.on("cardSelected", function (card) {
            _self.handCardSelected(card);
        });
    };

    p.handCardSelected = function (card) {
        var lastDraftCard = this.desk.lastDraftCards;
        if (card && lastDraftCard) {
            var result = TWIST.TLMNLogic(lastDraftCard, card).getCards();
            if (result.length > 0)
                card.removeAllSelected();
            result.forEach(function (item, index) {
                item.setSelected(true);
            });
        }
    };

    p.STATUS_PLAYING = function () {
        this.buttonBar.show();
        this.startButton.hide();
        var players = this.model.players || [];
        players.forEach(function (item, index) {
            item.status = "STATUS_PLAYING";
        });
    };

    p.drawPlayingState = function (data) {
        var players = data.players || [];
        var _self = this;

        var playingPlayer = data.playingPlayer;
        var PlayingPlayer = this.getPlayerByUuid(playingPlayer.uuid);
        if (PlayingPlayer) {
            PlayingPlayer.setRemainingTime(playingPlayer.remainingTime);
            if (PlayingPlayer.uuid === this.userInfo.uuid) {
                this.hitButton.show();
                this.foldTurnButton.show();
            }
        }
        
        if(data.lastDraftCards){
            this.desk.createLastDraftCards(data.lastDraftCards);
        }
        
        players.forEach(function (item, index) {
            var handCards = [];
            
            if (item.uuid === _self.userInfo.uuid) {
                handCards = data.userListCard || [];
                handCards.sort(function (a, b) {
                    return a - b;
                });
                if (handCards.length > 0) {
                    _self.sortCardButton.show();
                }
            } else {
                handCards.length = item.numberCardsInHand;
            }
            var Player = _self.getPlayerByUuid(item.uuid);
            if (Player) {
                Player.handCards.cardList = handCards;
                Player.renderCards({
                    showPlayerCard: true,
                    dragable: true
                });
            }
        });

    };

    p.dealCards = function (data) {
        var cardList = data.cardList;
        var players = this.model.players;
        var numberPlayer = 0;
        players.forEach(function (item, index) {
            if (item.status === "STATUS_PLAYING") {
                numberPlayer++;
            }
        });
        var numberCards = numberPlayer * this.options.numberCardsInHand;
        var _self = this;

        this.desk.generateCards(numberCards);

        players.forEach(function (item, index) {
            var handCards = [];
            if (item.status !== "STATUS_PLAYING")
                return;
            if (item.uuid === _self.userInfo.uuid) {
                handCards = cardList;
                handCards.sort(function (a, b) {
                    return a - b;
                });
            }
            
            var Player = _self.getPlayerByUuid(item.uuid);
            if (Player) {
                handCards.length = handCards.length || _self.options.numberCardsInHand;
                Player.handCards.cardList = handCards;
                Player.renderCards({
                    showPlayerCard: true,
                    dragable: true
                });
            }

        });

    };

    p.onHitTurn = function (data) {
        var currentUuid = data.uuid;
        var currentPlayer = this.getCurrentPlayer();
        if (currentPlayer.handCards.children.length > 0) {
            this.sortCardButton.show();
        }
        this.setPlayerTurn(data.uuid);

        if (data.uuid === this.userInfo.uuid) {
            this.hitButton.show();
            this.foldTurnButton.show();
        }
    };

    p.setPlayerTurn = function (uuid, remainingTime) {
        var players = this.playersContainer.children;
        for (var i = 0, length = players.length; i < length; i++) {
            var player = players[i];
            if (player) {
                if (player.uuid === uuid) {
                    player.setRemainingTime(remainingTime);
                } else {
                    player.clearTimer();
                }
            }
        }
    };

    p.onDraftCards = function (data) {
        var cards = data.cardList;
        var userID = data.uuid;
        this.desk.lastDraftCards = data.cardList;
        var Player = this.getPlayerByUuid(userID);
        if (!Player) {
            this.showError({code: 1});
            return;
        }
        if (userID === this.userInfo.uuid) {
            this.hitButton.hide();
            this.foldTurnButton.hide();
        }
        this.desk.removeOverlayCards();
        this.desk.setZeroVetical();
        this.desk.overlayDraftCards();
        var cardType = TWIST.Card.userCard;
        var position = {};
        position.x = (TWIST.Desk.width - cardType.seperator * cards.length) / 2 - TWIST.Desk.draftPosition.x;
        position.y = cardType.height * 0.8;

        Player.draftCardsInHand(cards, {
            draftCards: this.desk.draftCards,
            position: position,
            rotateAble: true
        });
    };

    p.onEndTurn = function (data) {
        this.desk.lastDraftCard = undefined;
        this.desk.clear();
        this.onHitTurn(data);
    };

    p.bindButton = function () {
        var _self = this;
        this.startButton.unbind('click');
        this.startButton.click(function () {
            _self.emit("start");
        });

        this.hitButton = this.wrapper.find('#hit-card');
        this.hitButton.unbind('click');
        this.hitButton.click(function () {
            var Player = _self.getCurrentPlayer();
            var cards = Player.getSelectedCards();
            if (cards.length === 0) {
                _self.showError({
                    code: 1470
                });
                return;
            }
            _self.emit('hitCards', {
                cards: cards
            });
        });

        this.sortCardButton = this.wrapper.find('#sort-card');
        this.sortCardButton.unbind('click');
        this.sortCardButton.click(function () {
            var Player = _self.getCurrentPlayer();
            Player.sortTL();
        });

        this.foldTurnButton = this.wrapper.find('#fold-turn');
        this.foldTurnButton.unbind('click');
        this.foldTurnButton.click(function () {
            _self.emit('foldTurn');
        });
    };

    p.STATUS_ENDING = function () {
        this.buttonBar.hide();
        this.errorPanel.empty();
        this.desk.lastDraftCards = undefined;
        this.setPlayerTurn();
    };

    p.endGame = function (data) {
        var _self = this;
        var resultData = {};
        switch (data.winType) {
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
            case 99:
                resultData.winTypeString = "Thắng !";
                break;
            default:
                resultData.winTypeString = "Thắng !";
                break;
        }

        resultData.listPlayers = data.listPlayers;
        for (var i = 0, length = resultData.listPlayers.length; i < length; i++) {
            var player = resultData.listPlayers[i]
            var cardList = player.remainCards;
            cardList.sort(function (a, b) {
                return a - b
            });
            if (parseInt(player.changeMoney) < 0) {
                if (data.winType == 99) {
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