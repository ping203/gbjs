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
        md5Avatar: function (username) {
            var avatarHash = md5(username);
            return parseInt((avatarHash.match(/\d+/)[0] || 1)[0]);
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

(function () {
    "use strict";

    TWIST.Observer = new EventEmitter();
    TWIST.imagePath = '../src/themes/gb-web/images/';
    
})();
this.TWIST = this.TWIST || {};

(function () {
    "use strict";

    function Sound() {
        this._sounds = [
            {id: "bellopen", src: 'bellopen.ogg'},
            {id: "call2", src: 'call2.ogg'},
            {id: "chia_bai", src: 'chia_bai.ogg'},
            {id: "chuyen_view", src: 'chuyen_view.ogg'},
            {id: "danh_bai", src: "danh_bai.ogg"},
            {id: "end_vongquay", src: "end_vongquay.ogg"},
            {id: "join_room", src: "join_room.ogg"},
            {id: "losing", src: "losing.ogg"},
            {id: "lucky_wheel", src: "lucky_wheel.ogg"},
            {id: "multichip", src: "multichip.ogg"},
            {id: "open_card", src: "open_card.ogg"},
            {id: "singlechip", src: "singlechip.ogg"},
            {id: "winning", src: "winning.ogg"},
        ];

        this.init = function () {
            createjs.Sound.registerPlugins([createjs.WebAudioPlugin]);
            createjs.Sound.alternateExtensions = ["mp3"];
            createjs.Sound.registerSounds(this._sounds, './sound/ogg/');
        };

        this.play = function (src, timeoutInteger) {
            // This is fired for each sound that is registered.
            var instance = createjs.Sound.play(src);  // play using id.  Could also use full source path or event.src.
            instance.volume = settings.volume;
            if (timeoutInteger) {
                $timeout(function () {
                    instance.stop();
                }, timeoutInteger);
            }
            return instance;
        };
    }
    
    TWIST.Sound = Sound;
})()



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

    Card.size = {width: 90, height: 123};
    Card.userCard = {width: 53, height: 69, cardDraggable: true, selectedHeight: 20, scale: 0.6};
    Card.userCard.scale = Card.userCard.width / Card.size.width;

    Card.playerCard = {width: 29, height: 37, seperator: 0, cardDraggable: false, scale: 0.33};
    Card.playerCard.scale = Card.playerCard.width / Card.size.width;

    Card.draftCard = {width: 53, height: 69, seperator: 55, scale: 0.5};
    Card.draftCard.scale = Card.draftCard.width / Card.size.width;

    Card.threeCards = {width: 54, height: 73.8, seperator: 55, scale: 0.6};
    Card.threeCards.scale = Card.threeCards.width / Card.size.width;

    Card.threeCardsBanker = {width: 63, height: 86.1, seperator: 64, scale: 0.7};
    Card.threeCardsBanker.scale = Card.threeCardsBanker.width / Card.size.width;

    Card.miniPoker = {width: 130, height: 180, scale: 1.6};
    Card.miniPoker.scale = Card.miniPoker.width / Card.size.width;

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
        this.bg = bg;
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
            width: Card.size.width + 4,
            height: Card.size.height + 3,
            x: Card.size.width * 2,
            y: Card.size.height * Card.SuitNameMap.length
        };
        this.border.set({
            x: -2,
            y: -1.5
        });
        this.border.visible = this.showBorder;
        this.addChild(bg, this.border);
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
    };

    p.openCard = function (cardValue, cardType) {
        var oldX = this.x;
        var _self = this;
        cardType = cardType || Card.userCard;
        return createjs.Tween.get(this)
                .to({scaleX: 0.1, x: oldX + cardType.width / 2}, 150)
//                        .set({sourceRect: Card.cropImage(cardValue)})
                .call(function () {
                    this.setValue(cardValue);
                    this.cardValue = cardValue;
                    try {
                        this.updateCache();
                    } catch (e) {

                    }
                })
                .to({scaleX: cardType.scale, scaleY: cardType.scale, x: oldX}, 150).call(function () {
            if (this.isTracking) {
                TWIST.Observer.emit('cardOpened', this);
            }
            this.setInPhom(this.isInPhom);
            //this.updateCache();
        });
    };

    p.upSideDown = function (cardType) {
        var oldX = this.x;
        var _self = this;
        cardType = cardType || Card.userCard;
        return createjs.Tween.get(this)
                .to({scaleX: 0.1, x: oldX + cardType.width / 2}, 150)
                .call(function () {
                    this.cardValue = -1;
                    this.setValue(-1);
                    try {
                        this.updateCache();
                    } catch (e) {

                    }
                })
                .to({scaleX: cardType.scale, scaleY: cardType.scale, x: oldX}, 150).call(function () {


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
        this.cache(0, 0, Card.size.width, Card.size.height);
        console.log("isOverlay",this.isOverlay)
        try {
            this.updateCache();
        } catch (e) {

        }
    };

    p.UnOverlay = function () {
        this.isOverlay = false;
        this.filters = [new createjs.ColorMatrixFilter(new createjs.ColorMatrix(0, 0, 0, 0))];
        try {
            this.updateCache();
        } catch (e) {

        }
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

    p.unHightLight = function () {
//                this.shadow = new createjs.Shadow('#0ff', 0, 0, 15);
        this.showBorder = false;
        this.border.visible = false;
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
            this.tween.pause();
            this.tween.removeAllEventListeners();
        }
        createjs.Tween.get(this.timerLine, {override : true});
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
        if(remainingTime > totalTime) remainingTime = totalTime;
        this.clearTimer();
        this.setCounter(totalTime, remainingTime);
        var _self = this;
        this.tween = createjs.Tween.get(this.timerLine, {override : true})
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
//        var avatarHash = md5(this.username);
//        var avatarNumber = parseInt((avatarHash.match(/\d+/)[0] || 1)[0]) || 10;
        var avatarNumber = Global.md5Avatar(this.username) || 10;
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
        if(remainingTime < 50) remainingTime *= 1000;
        totalTime = totalTime || 20000;
        if(totalTime < 50) totalTime *= 1000;
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
        this.money = parseInt(money);
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

    var initOptions = {
        width: 1000,
        height: 580
    };
    var p = BaseGame.prototype = new EventEmitter();

    p.initBaseGame = function () {

        //Event List
//        this.events = {
////            info: "drawInfo"
//        };

        this.initEvent();
        this.initCanvas();
        this.wrapper.append(this.canvas);
        this.initStage();
    };

    p.initCanvas = function () {
        var canvas = $(TWIST.HTMLTemplate.canvas);
        canvas.attr({
            width: this.options.width || initOptions.width,
            height: this.options.height || initOptions.height
        });
        canvas.addClass('twist');
        this.canvas = canvas;
        return canvas;
    };

    p.initStage = function () {
        var _self = this;
        var stage = new createjs.Stage(this.canvas[0]);
        stage.enableMouseOver(20);
        var context = stage.canvas.getContext("2d");
        context.mozImageSmoothingEnabled = true;
        createjs.Touch.enable(stage);
        createjs.Ticker.setFPS(60);
        stage.width = this.canvas.width;
        stage.height = this.canvas.height;
        createjs.Ticker.addEventListener("tick", onUpdateStage);
        this.on('destroy', function () {
            createjs.Ticker.removeEventListener("tick", onUpdateStage);
            _self.removeAllListeners();
        });
        this.stage = stage;

        function onUpdateStage() {
            stage.update();
        }
    }

    p.initEvent = function () {
        var events = this.events;
        for (var pro in events) {
            this.on(pro, this[events[pro]]);
        }
    };

    p.addNumberEffect = function (el) {

        var jElement = el;
        var _self = this;

        var oldValue = jElement.text();
        oldValue = parseInt(oldValue.replace(/\./g, ""));
        if (isNaN(oldValue))
            oldValue = 0;
        jElement.prop('_counter', oldValue);

        jElement.runEffect = function (newValue, options) {
            jElement.finish();
            jElement.isDone = true;
            var initOptions = {
                duration: 1000,
                step: function (now) {
                    jElement.text(Global.numberWithDot(Math.ceil(now)));
                },
                done: function () {
                    jElement.endEffect();
                }
            };
            $.extend(initOptions, options);
            this.animate({
                _counter: newValue
            }, initOptions);
        };

        jElement.endEffect = function () {
            jElement.finish();
            if (this.isTracking) {
                this.isTracking = false;
                _self.emit("endEffect");
            }
        };

        return jElement;
    };

    p.addRemainTimeEffect = function (el, options) {

        var jElement = el;
        var _self = this;
        var remainInterval;
        var endRemainTime = 0;

        jElement.options = options;
        function setRemainTime() {
            var now = endRemainTime - new Date().getTime();
            if (now > 0) {
                var minutes = Math.floor(now / 60000);
                if (minutes < 10)
                    minutes = "0" + minutes;
                var secons = Math.floor((now % 60000) / 1000);
                if (secons < 10)
                    secons = "0" + secons;
                jElement.text(minutes + " : " + secons);
            } else {
                jElement.endEffect();
            }
        }

        jElement.runEffect = function (remainTime) {
            clearInterval(remainInterval);
            remainTime = isNaN(parseInt(remainTime)) ? 0 : parseInt(remainTime);
            endRemainTime = new Date().getTime() + remainTime;
            setRemainTime();
            remainInterval = setInterval(setRemainTime, 100);
        };

        jElement.endEffect = function () {
            clearInterval(remainInterval);
            jElement.text("");
            if (this.isTracking) {
                this.isTracking = false;
                _self.emit("timeOut", jElement);
            }
        };

        return jElement;
    };

    p.addDisbaleEffect = function (el, options) {

        var jElement = el;
        var _self = this;

        jElement.setDisabled = function (flag) {
            jElement.disabled = flag;
            if (flag) {
                jElement.addClass('disabled');
            } else {
                jElement.removeClass('disabled');
            }
        };

        jElement.runEffect = function () {
            jElement.setDisabled(true);
        }

        jElement.endEffect = function () {
            jElement.setDisabled(false);
            if (this.isTracking) {
                this.isTracking = false;
                _self.emit("timeOut", jElement);
            }
        };

        return jElement;
    };

    p.addChipEffect = function (el) {
        var _self = this;
        var jElement = el;

        jElement.runEffect = function (plus) {
            this.isDone = true;
            this.removeClass('plus decrease');
            var className = plus ? "plus" : "decrease";
            this.show();
            var length = jElement.find('i').length;
            var count = 0;
            jElement.find('i').show();
            this.addClass(className);
            jElement.find('i').each(function (index) {
                var item = this;
                $(this).one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function () {
                    $(this).hide();
                    count ++;
                    if(count == length) jElement.endEffect();
                });
            });
        };

        jElement.endEffect = function () {
            if (this.isTracking) {
                this.isTracking = false;
            }
        };

        return jElement;
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
        this.initResultPanel();
        this.observerEvent();
        this.userInfo = {};
        this.status = InRoomGame.statusList['0'];
        this.model = this.model || {};
    };

    p.initErrotPanel = function () {
        this.errorPanel = $(TWIST.HTMLTemplate.errorPanel);
        this.wrapper.append(this.errorPanel);
        this.errorList = this.errorList || {};
        $.extend(this.errorList, {
            0: "Lỗi hệ thống !",
            //sam Error
            34: "Không được để 2 cuối !",
            1470: "Chưa chọn cây bài !"
        });
    };

    p.initButtonBar = function () {
        this.buttonBar = $(TWIST.HTMLTemplate.buttonBar.wrapper);
        this.wrapper.append(this.buttonBar);
        this.startButton = $(TWIST.HTMLTemplate.buttonBar.startButton);
        this.buttonBar.append(this.startButton);
        this.buttonBar.hide();
    };

    p.drawRoom = function () {
        var canvas = this.wrapper.find('canvas');
        canvas.css("background", "url(" + TWIST.imagePath + "Desk-bg.png) 143px 55px no-repeat");
        this.playersContainer = new createjs.Container();
        this.desk = new TWIST.Desk(this.options);
        this.stage.addChild(this.playersContainer, this.desk);
        this.wrapper.css({
            width: canvas.width(),
            height: canvas.height()
        });
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

        this.on("notifyOne", this.onNotifyOne);
    };

    p.setUserInfo = function (data) {
        this.userInfo = data || {};
        this.userInfo.uuid = data.uuid || data.id;
    };

    p.observerEvent = function () {
        var _self = this;
        TWIST.Observer.on("cardSelected", function (card) {
            _self.handCardSelected(card);
        });
    };

    p.drawGameInfo = function (data) {
        this.model = this.model || {};
        $.extend(this.model, data);
        var playerList = this.model.players;
        for (var i = 0, length = playerList.length; i < length; i++) {
            if (playerList[i].username === this.userInfo.username) {
                this.userInfo.uuid = playerList[i].uuid;
            }
        }

        this.drawPlayers();

        if (this.status === 'STATUS_PLAYING') {
            this.drawPlayingState(data);
        } else if (this.status === 'STATUS_WAITING_FOR_START') {
            var playerData = this.getPlayerDataByUuid(this.userInfo.uuid);
            if (playerData && playerData.isRoomMaster) {
                this.startButton.show();
            }
        }
        if (data.remainingTime) {
            this.desk.setRemainingTime(data.remainingTime);
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
                playerData.money = parseInt(item.money);
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
        this.desk.setRemainingTime(parseInt(data.remainingTime));
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

    p.addPlayer = function (data) {

        var userPosition = this.userInfo.indexPosition;
        var playerPosition = data.indexPosition - userPosition;
        if (playerPosition < 0)
            playerPosition += this.options.maxPlayers;
        var config = this.desk.config;

        var currenConfig = {};
        for (var pro in config) {
            currenConfig[pro] = config[pro][playerPosition];
        }
        data.config = currenConfig;

        var playerPositions = this.desk.config.playerPositions;

        $.extend(data, playerPositions[playerPosition]);
        data.position = playerPosition;
        this.model.players.push(data);
        if (this.playersContainer.children.length < this.options.maxPlayers) {
            this.drawPlayer(data);
        }
    };

    p.drawPlayers = function () {
        var players = this.model.players || [];
        var _self = this;
        var userPosition = 0;
        players.forEach(function (item, index) {
            if (item.uuid === _self.userInfo.uuid) {
                userPosition = item.indexPosition;
                $.extend(_self.userInfo, item);
            }
        });
        players.sort(function (a, b) {
            var fistPosition = a.indexPosition - userPosition;
            if (fistPosition < 0) {
                fistPosition += _self.options.maxPlayers;
            }
            var seconPosition = b.indexPosition - userPosition;
            if (seconPosition < 0) {
                seconPosition += _self.options.maxPlayers;
            }
            return fistPosition - seconPosition;
        });

        var config = this.desk.config;
        players.forEach(function (item, index) {
            var currenConfig = {};
            item.position = item.indexPosition - userPosition;
            if (item.position < 0) {
                item.position += _self.options.maxPlayers;
            }
            for (var pro in config) {
                currenConfig[pro] = config[pro][item.position];
            }
            item.config = currenConfig;
            $.extend(item, config.playerPositions[item.position]);
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

    p.initResultPanel = function () {
        var _self = this;
        
        this.resultPanel = $(TWIST.HTMLTemplate.resultPanel.wrapper);
        this.wrapper.append(this.resultPanel);

        var resultPanelCotainer = this.resultPanel.find('.container')[0];
        this.resultPanel.find('.container').css("height", "320px");
        this.resultPanel.hide();
        this.resultPanelScroll = new IScroll(resultPanelCotainer, {scrollX: true, freeScroll: true});
        this.resultPanelScroll.refresh();
        
        var closeButton = this.resultPanel.find('.close-popup');
        var popupMask = this.resultPanel.find('.global-mask');
        closeButton.on('click', function(){
            _self.resultPanel.hide();
        });
        popupMask.on('click', function(){
            _self.resultPanel.hide();
        });
    };

    p.showResult = function (resultData) {
        var _self = this;
        this.resultPanel.show();
        var resultIcon = this.resultPanel.find('.popup-icon');
        if (resultData.isWinner) {
            resultIcon.removeClass('lose');
        } else {
            resultIcon.addClass('lose');
        }
        
        var container = this.resultPanel.find('.container>div');
        
        resultData.listPlayers.forEach(function (item, index) {
            var cardList = "";
            var cardListIndex = item.remainCards;
            cardListIndex.forEach(function(item,index){
                var template = _.template(TWIST.HTMLTemplate.resultPanel.card);
                var resultTemplate = template({
                    id : item
                });
                cardList += resultTemplate;
            });
            
            var compiled = _.template(TWIST.HTMLTemplate.resultPanel.user);
            var resultText = compiled({
                username : item.username,
                moneyChange : Global.numberWithDot(item.changeMoney),
                resultText : item.gameResultString,
                cardList : cardList,
                isWinnerClass : item.isWinner ? "winner" : ""
            });
            
            container.append($(resultText));
        });
        this.resultPanelScroll.refresh();
    };
    
    p.endIngameEvent = function (){
        this.desk.setRemainingTime(0);
        this.buttonBar.hide();
        this.errorPanel.empty();
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
    };

    TWIST.InRoomGame = InRoomGame;

})();
this.TWIST = this.TWIST || {};

(function () {
    "use strict";

    function BaseDemlaGame(wrapper, options) {}

    var p = BaseDemlaGame.prototype = new TWIST.InRoomGame();

    p.initBaseDemlaGame = function (wrapper) {
        TWIST.Card.RankMapIndex = ["3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "1", "2"];
        this.initInRoomGame();
        this.pushTLMNDemlaEvent();
        this.bindButton();
    };

    p.pushTLMNDemlaEvent = function () {

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
        this.buttonBar.find('.button').hide();
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
            PlayingPlayer.setRemainingTime(playingPlayer.remainingTime, this.model.turningTime);
            if (PlayingPlayer.uuid === this.userInfo.uuid) {
                this.hitButton.show();
                this.foldTurnButton.show();
            }
        }

        if (data.lastDraftCards) {
            this.desk.lastDraftCards = data.lastDraftCards;
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

    p.onNotifyOne = function (data) {
        var currentUuid = data.uuid;
        var currentPlayer = this.getCurrentPlayer();
        currentPlayer.setPlayerStatus("Báo 1 !");
    };

    p.setPlayerTurn = function (uuid, remainingTime) {
        var totalTime = this.model.turningTime;
        var players = this.playersContainer.children;
        for (var i = 0, length = players.length; i < length; i++) {
            var player = players[i];
            if (player) {
                if (player.uuid === uuid) {
                    player.setRemainingTime(remainingTime, totalTime);
                } else {
                    player.clearTimer();
                }
            }
        }
    };

    p.foldTurn = function (data) {
        var Player = this.getPlayerByUuid(data.uuid);
        if (Player) {
            Player.clearTimer();
            if (data.uuid === this.userInfo.uuid) {
                this.hitButton.hide();
                this.foldTurnButton.hide();
            }
        }
    };

    p.onDraftCards = function (data) {
        var cards = data.cardList;
        var userID = data.uuid;
        this.desk.lastDraftCards = data.cardList;
        var Player = this.getPlayerByUuid(userID);
        if (!Player) {
            this.showError({code: 0});
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
        this.desk.lastDraftCards = undefined;
        this.desk.clear();
        this.hitButton.hide();
        this.foldTurnButton.hide();
        this.onHitTurn(data);
    };

    p.bindButton = function () {
        var _self = this;

        this.startButton.unbind('click');
        this.startButton.click(function () {
            _self.emit("start", _self.model.players);
        });

        this.hitButton = $(TWIST.HTMLTemplate.buttonBar.hitButton);
        this.buttonBar.append(this.hitButton);
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

        this.sortCardButton = $(TWIST.HTMLTemplate.buttonBar.sortCardButton);
        this.buttonBar.append(this.sortCardButton);
        this.sortCardButton.unbind('click');
        this.sortCardButton.click(function () {
            var Player = _self.getCurrentPlayer();
            Player.sortTL();
        });

        this.foldTurnButton = $(TWIST.HTMLTemplate.buttonBar.foldTurnButton);
        this.buttonBar.append(this.foldTurnButton);
        this.foldTurnButton.unbind('click');
        this.foldTurnButton.click(function () {
            _self.emit('userFold');
        });
    };

    p.STATUS_ENDING = function () {
        this.buttonBar.hide();
        this.errorPanel.empty();
        this.desk.lastDraftCards = undefined;
        this.setPlayerTurn();
    };

    p.endDemlaGame = function (data, winTypeMap, nomalWinType) {
        var _self = this;
        var resultData = {
            isWinner: false,
            listPlayers: []
        };
        resultData.listPlayers = data.listPlayers;
        for (var i = 0, length = resultData.listPlayers.length; i < length; i++) {
            var player = resultData.listPlayers[i];
            var cardList = player.remainCards;
            cardList.sort(function (a, b) {
                return a - b;
            });
            if (parseInt(player.changeMoney) < 0) {
                if (data.winType === nomalWinType) {
                    if (cardList.length === this.options.numberCardsInHand) {
                        player.gameResultString = "Thua cóng";
                    } else
                        player.gameResultString = "Thua " + cardList.length + " lá!";
                } else {
                    player.gameResultString = "Thua !";
                }
            } else if (parseInt(player.changeMoney) > 0) {
                player.gameResultString = winTypeMap[data.winType];
                player.isWinner = true;
                if (player.uuid === this.userInfo.uuid) {
                    resultData.isWinner = true;
                }
            } else {
                player.gameResultString = "Hòa";
            }

            var Player = this.getPlayerByUuid(player.uuid);
            if (Player) {
                Player.clearTimer();
                Player.setMoney(player.money);
                Player.showMoneyExchageEffect(player.changeMoney, parseInt(player.changeMoney) > 0 ? "win" : "lose");
            }
        }
        setTimeout(function () {
            _self.showResult(resultData);
        }, 2000);
    };

    TWIST.BaseDemlaGame = BaseDemlaGame;

})();
this.TWIST = this.TWIST || {};

(function () {
    "use strict";

    var statusList, cardRankList, speed, numberCard, effectQueue, bets, moneyFallingEffectTime, gameState, gameStates,
            currentEffectTurn, numberEffectCompleted, timeOutList, canvasSize, mainCardSize, winCardSize, newCard, winCardContainer, currentBetting;

    statusList = ["pause", "endding", "running"];

    gameStates = ["getCards", "selectHightLow"];

    cardRankList = [
        {value: 0, name: "2"}
        , {value: 1, name: "3"}
        , {value: 2, name: "4"}
        , {value: 3, name: "5"}
        , {value: 4, name: "6"}
        , {value: 5, name: "7"}
        , {value: 6, name: "8"}
        , {value: 7, name: "9"}
        , {value: 8, name: "10"}
        , {value: 9, name: "J"}
        , {value: 10, name: "Q"}
        , {value: 11, name: "K"}
        , {value: 12, name: "A"}
    ];

    speed = 2.5;//default 2

    numberCard = 52;

    effectQueue = [];

    canvasSize = {width: 800, height: 400};

    mainCardSize = {width: 190, height: 244};

    winCardSize = {width: 39, height: 48};

    bets = [1000, 10000, 100000];

    moneyFallingEffectTime = 2000;

    timeOutList = [];

    gameState = 0;

    newCard = {};

    winCardContainer = {width: 740, height: 70, top: 340, left: 50};

    currentBetting = 0;

    var repeatEffectQueue = false;

    var initOptions = {
        resultTab: []
    };

    function HightLowGame(wrapper, options) {
        this.wrapper = $(wrapper);
        this.options = $.extend(initOptions, options);
        this.initHightLowGame();
    }

    var p = HightLowGame.prototype = new TWIST.BaseGame();

    p.initHightLowGame = function () {

        $.extend(this.options, canvasSize);
        this.info = {
            betting: 1000,
            potData: {
                1000: 0,
                10000: 0,
                100000: 0
            }
        };
        this.userInfo = {};
        this.initCanvas();
        this.initTemplate();
        this.draw();
        this.pushEventListener();
        this.status = 'pause';
    };

    p.initTemplate = function () {
        var _self = this;

        this.wrapperTemplate = $(TWIST.HTMLTemplate['hightLow/wrapper']);
        this.wrapper.append(this.wrapperTemplate);

        this.centerTempalte = $(TWIST.HTMLTemplate['hightLow/center']);
        this.wrapperTemplate.append(this.centerTempalte);

        this.centerTempalte.find('.canvas-wrapper').append(this.canvas);
        this.initStage();

        this.topTempalte = $(TWIST.HTMLTemplate['hightLow/top']);
        this.wrapperTemplate.append(this.topTempalte);

        this.bottomTempalte = $(TWIST.HTMLTemplate['hightLow/bottom']);
        this.wrapperTemplate.append(this.bottomTempalte);

        this._initExplodePot();

        this._initPot();

        this._initCurrentBetting();

        this._initPotCards();

        this._initSupportText();

        this._initRemainTime();

        this._initHightLowButton();

        this._initHightLowBettingText();

        this._initNewTurnText();

        this._initVirtualCard();

        this._initProfile();

        this._initChipsButton();

        this._initNewTurnButton();
    };

    p._initExplodePot = function () {
        var _self = this;
        this.effect = $('<div class="effect">' + TWIST.HTMLTemplate['effect/explodePot'] + '</div>');
        this.wrapperTemplate.append(this.effect);

        this.effect.explorerPot = _self.effect.find('.explorer-pot');
        this.effect.moneyFalling = _self.effect.find('.money-falling');
        this.effect.showEffect = function () {
            _self.effect.explorerPot.show();
            _self.effect.moneyFalling.show();
        };
        this.effect.hideEffect = function () {
            _self.effect.explorerPot.hide();
            _self.effect.moneyFalling.hide();
        };
        this.effect.on('click', _self.effect.hideEffect);
    };

    p._initPot = function () {
        var _self = this;
        this.pot = this.topTempalte.find('.pot-value');
        this.addNumberEffect(this.pot);
    };

    p._initCurrentBetting = function () {
        var _self = this;
        this.currentBetting = this.topTempalte.find('.bank-value');
        this.addNumberEffect(this.currentBetting);
    };

    p._initPotCards = function () {
        var _self = this;
        this.potCards = [];
        var potCards = this.topTempalte.find('.pot-card');
        potCards.each(function (index, item) {
            _self.potCards.push($(item));
        });
        this.potCards.addActiveCard = function () {
            var potCard = _self.potCards.find(function (item, index) {
                return !item.active;
            });
            if (potCard) {
                potCard.active = true;
                potCard.addClass('active');
            }
        };
        this.potCards.removeActiveCard = function () {
            potCards.removeClass('active');
        };
    };

    p._initSupportText = function () {
        var _self = this;
        this.supportText = this.centerTempalte.find('.text-support');
        this.supportText.text("");
    };

    p._initRemainTime = function () {
        var _self = this;
        this.remainTime = this.centerTempalte.find('.remain-time');
        this.addRemainTimeEffect(this.remainTime);
    };

    p._initHightLowButton = function () {
        var _self = this;
        this.lowButton = this.centerTempalte.find('.low-button');
        this.addDisbaleEffect(this.lowButton);
        this.lowButton.runEffect();

        this.hightButton = this.centerTempalte.find('.hight-button');
        this.addDisbaleEffect(this.hightButton);
        this.hightButton.runEffect();

        this.lowButton.on('click', function (event) {
            if (_self.lowButton.disabled)
                return;
            _self.emitHightLow(false);
        });

        this.hightButton.on('click', function (event) {
            if (_self.hightButton.disabled)
                return;
            _self.emitHightLow(true);
        });
    };

    p._initHightLowBettingText = function () {
        var _self = this;
        this.lowBetting = this.centerTempalte.find('.low-value');
        this.addNumberEffect(this.lowBetting);

        this.hightBetting = this.centerTempalte.find('.hight-value');
        this.addNumberEffect(this.hightBetting);
    };

    p._initVirtualCard = function () {
        var _self = this;
        this.virtualCard = this.centerTempalte.find('.virtual-card');

        this.virtualCard.on('click', function (event) {
            _self.checkStart();
        });

    };

    p.checkStart = function () {
        var _self = this;
        if (_self.status !== 'pause' || gameState !== 0)
            return;
        if (this.userInfo.money < this.info.betting) {
            this.emit("error", "Bạn không đủ tiền !");
        } else {
            _self.emit("start", this.info.betting);
            this.newTurnText.hide();
            this.changeStatus("running");
            _self.moneyContainer.runEffect(this.userInfo.money - this.info.betting, {duration: 500});
            this.moveChip.runEffect(true);
        }
    };

    p.emitHightLow = function (isHight) {
        var _self = this;
        if (_self.status !== 'pause' || gameState !== 1)
            return;
        this.emit("choose", isHight);
    };

    p._initNewTurnText = function () {
        var _self = this;
        this.newTurnText = this.centerTempalte.find('.new-turn-text');
    };

    p._initProfile = function () {
        var _self = this;
        this.user = $(TWIST.HTMLTemplate['miniPoker/user']);
        this.bottomTempalte.find('.profile-hight-low').append(this.user);

        this.moneyContainer = this.user.find('.money');
        this.addNumberEffect(this.moneyContainer);

        this.user.renderUserInfo = function (data) {
            $.extend(_self.userInfo, data);
            var avatarContainer = _self.user.find('.avatar');
            var usernameContainer = _self.user.find('.username');
            var moneyContainer = _self.user.find('.money');
            var avatar = Global.md5Avatar(data.avatar);
            avatarContainer.addClass('avatar' + avatar);
            usernameContainer.text(data.username);
            _self.moneyContainer.runEffect(data.money, {duration: 10});
        };

        this.moveChip = $(TWIST.HTMLTemplate['videoPoker/moveChip']);
        this.user.append(this.moveChip);
        this.addChipEffect(this.moveChip);
        this.moveChip.hide();
    };

    p._initChipsButton = function () {
        var _self = this;
        this.chipWrapper = $(TWIST.HTMLTemplate['miniPoker/chips']);
        this.bottomTempalte.find('.chips-hight-low').append(this.chipWrapper);

        this.chipButtons = [{
                value: 1000,
                template: this.chipWrapper.find('.chip.violet')
            }, {
                value: 10000,
                template: this.chipWrapper.find('.chip.green')
            }, {
                value: 100000,
                template: this.chipWrapper.find('.chip.blue')
            }];

        this.chipButtons.forEach(function (item, index) {
            item.template.on('click', function (event) {
                if (_self.status !== 'pause' || gameState !== 0)
                    return;
                _self.setBetting(item);
            });
        });

        this.setBetting(this.chipButtons[0]);
    };

    p.setBetting = function (item) {
        this.chipWrapper.find('.chip').removeClass('active');
        item.template.addClass("active");
        this.info.betting = item.value;
        this.pot.runEffect(this.info.potData[this.info.betting], {duration: 200});
    };

    p._initNewTurnButton = function () {
        var _self = this;
        this.newTurnButton = this.bottomTempalte.find('.new-turn-button');
        this.addDisbaleEffect(this.newTurnButton);
        this.newTurnButton.hide();

        this.newTurnButton.on('click', function (event) {
            if (_self.newTurnButton.disabled)
                return;
            _self.emit("newTurn");
        });

    };

    p.draw = function () {
        var _self = this;
        this.mainContainer = new createjs.Container();
        this.mainContainer.set({
            x: (canvasSize.width - mainCardSize.width) / 2,
            y: 0
        });
        this.winCardContainer = new createjs.Container();
        this.winCardContainer.set({
            x: winCardContainer.left,
            y: winCardContainer.top
        });

        this.stage.addChild(this.mainContainer, this.winCardContainer);
        this.addMainCard(-1);
    };

    p.addMainCard = function (value) {
        var _self = this;
        this.mainContainer.removeAllChildren();
        var card, scale;
        if (value > -1) {
            scale = mainCardSize.width / TWIST.Card.size.width;
            card = new TWIST.Card(value);
            card.set({
                scaleX: scale,
                scaleY: scale
            });
        } else {
            var img = new Image();
            img.src = TWIST.imagePath + 'hightLow/card-back.png';
            var card = new createjs.Bitmap(img);
        }
        this.mainContainer.addChild(card);
    };

    p.storeMainCard = function () {
        var _self = this;
        var card = this.mainContainer.children[0];
        var index = this.winCardContainer.children.length;
        this.winCardContainer.addChild(card);
        card.set({
            x: card.x + this.mainContainer.x - this.winCardContainer.x,
            y: card.y + this.mainContainer.y - this.winCardContainer.y
        })
        createjs.Tween.get(card).to({
            x: 10 + (winCardSize.width + 10) * index,
            y: 10,
            scaleX: winCardSize.width / TWIST.Card.size.width,
            scaleY: winCardSize.height / TWIST.Card.size.height
        }, 500).call(function () {
            _self.emit("_storeComplete");
        });
    };

    p.drawListCard = function (listCard) {
        var _self = this;

        this.winCardContainer.removeAllChildren();
        listCard.forEach(drawSingleCard);

        function drawSingleCard(id, index) {
            var card = new TWIST.Card(id);
            _self.winCardContainer.addChild(card);
            card.set({
                x: 10 + (winCardSize.width + 10) * index,
                y: 10,
                scaleX: winCardSize.width / TWIST.Card.size.width,
                scaleY: winCardSize.height / TWIST.Card.size.height
            })
        };
    };


    p.changeStatus = function (status) {
        var _self = this;
        this.clear();
        if (status === 'pause') {
            this.newTurnButton.setDisabled(false);
        }

        if (status === "running") {
            this.playingInterval = setInterval(function () {
                _self.addMainCard(parseInt(Math.random() * 52));
            }, 100);
            timeOutList.push(this.playingInterval);
            this.hightButton.setDisabled(true);
            this.lowButton.setDisabled(true);
            this.newTurnButton.setDisabled(true);
        }
    };

    p.changeGameState = function (state) {
        gameState = state;
        this.clearGameState();
        if (gameState == 0) {
            this.changeStatus('pause');
            this.addMainCard(-1);
            this.virtualCard.show();
            this.newTurnText.show();
            this.newTurnButton.hide();
            this.effect.hide();
        } else if (gameState == 1) {
            this.newTurnText.hide();
            this.virtualCard.hide();
            this.newTurnButton.show();
        }
    };

    p.clear = function () {
        this.supportText.text("");
        this.remainTime.endEffect();
        timeOutList.forEach(function (item) {
            clearTimeout(item);
        });
    };

    p.clearGameState = function () {
        this.clear();
        this.potCards.removeActiveCard();
        this.winCardContainer.removeAllChildren();
        this.currentBetting.runEffect(0);
    };

    p.setNewCard = function (data) {
        this.addMainCard(data.cardId);
        this.hightButton.setDisabled(false);
        this.lowButton.setDisabled(false);
        this.hightBetting.runEffect(data.hightMoney, {duration: 300});
        this.lowBetting.runEffect(data.lowMoney, {duration: 300});
        if (data.isPotCard) {
            this.potCards.addActiveCard();
        }
        currentBetting = data.currentBetting;
        this.currentBetting.runEffect(data.currentBetting || this.info.betting, {duration: 300});
        if (data.currentBetting > 0) {
            this.supportText.text("Quân bài tiếp theo là cao hay thấp hơn ?!");
            this.remainTime.runEffect(data.remainTime || 120000);
            this.hightButton.setDisabled(false);
            this.lowButton.setDisabled(false);
            if (data.hightMoney == 0) {
                this.hightButton.setDisabled(true);
            }
            if (data.lowMoney == 0) {
                this.lowButton.setDisabled(true);
            }
            if (data.explorerPot) {
                this.effect.showEffect()
            }
        } else {
            this.supportText.text("Bạn chọn sai, chúc bạn may mắn lần sau !");
            this.hightButton.setDisabled(true);
            this.lowButton.setDisabled(true);
        }
    };

    p.pushEventListener = function () {
        var _self = this;

        this.on("userInfo", function () {
            _self.user.renderUserInfo(arguments[0]);
        });

        this.on("getFirstCard", function (data) {
            _self.getFirstCard(data);
        });

        this.on("updatePots", function (data) {
            _self.bindPots(data);
        });

        this.on("newCard", function (data) {
            _self.newCard(data);
        });

        this.on("getWin", function (data) {
            _self.getWin(data);
        });

        this.on("updateMoney", function (data) {
            _self.updateMoney(data);
        });

        this.on("error", function (message) {
            _self.showError(message);
        });

        this.on("reconnect", function (data) {
            _self.reconnect(data);
        });

        this.on("_storeComplete", function () {
            console.log("_on _storeComplete");
        });

    };

    p.getFirstCard = function (data) {
        this.changeGameState(1);
        this.changeStatus('pause');
        data.currentBetting = data.currentBetting || this.info.betting;
        this.setNewCard(data);
        this.newTurnButton.setDisabled(true);
    };

    p.bindPots = function (data) {
        $.extend(this.info.potData, data.pots);
        this.pot.runEffect(this.info.potData[this.info.betting], {duration: 500});
    };

    p.newCard = function (data) {
        var _self = this;
        this.storeMainCard();
        this.changeStatus('running');

        this.once("_storeComplete", function () {
            console.log("_once _storeComplete");
            _self.changeStatus('pause');
            _self.setNewCard(data);
        });
    };

    p.getWin = function (data) {
        var _self = this;
        if (currentBetting > 0) {
            this.moveChip.isTracking = true;
            this.moveChip.runEffect();
            this.moneyContainer.runEffect(this.userInfo.money, {duration: 500});
            this.once('endEffect', function () {
                _self.changeGameState(0);
            });
        } else {
            this.changeGameState(0);
        }
    };

    p.updateMoney = function (data) {
        this.userInfo.money = data.newMoney;
    };

    p.showError = function (message) {
        this.supportText.text(message);
    };

    p.reconnect = function (data) {

        var _self = this;

        this.setBetting(data.betting);
        this.addMainCard(data.cardId);
        this.currentBetting.runEffect(data.currentBetting, {duration: 0});
        this.hightBetting.runEffect(data.hightMoney, {duration: 0});
        this.lowBetting.runEffect(data.lowMoney, {duration: 0});
        this.remainTime.runEffect(data.remainTime);
        this.drawListCard(data.listCard);
    };

    TWIST.HightLowGame = HightLowGame;

})();
this.TWIST = this.TWIST || {};

(function () {
    "use strict";

    var gameSize, columnSize, itemSize, distance, columns, speed, effectArray,
            statusList, endingPhase, numberCard, time, stepValue, spinAreaConf, colorList,
            lineList9, lineList20, isLine9, line9Left, line9Right, line20Left, line20Right,
            line9Coordinate, activeLines, bets, effectQueue, moneyFallingEffectTime, currentEffectTurn, numberEffectCompleted,
            timeOutList, fistLog, cardRankList;

    statusList = ["pause", "running", "ending", "effecting"];

    cardRankList = [
        {value: 0, name: "2"}
        , {value: 1, name: "3"}
        , {value: 2, name: "4"}
        , {value: 3, name: "5"}
        , {value: 4, name: "6"}
        , {value: 5, name: "7"}
        , {value: 6, name: "8"}
        , {value: 7, name: "9"}
        , {value: 8, name: "10"}
        , {value: 9, name: "J"}
        , {value: 10, name: "Q"}
        , {value: 11, name: "K"}
        , {value: 12, name: "A"}
    ];

    endingPhase = -1;

    stepValue = 1;

    itemSize = {width: 160, height: 205, padding: 10};

    gameSize = {width: itemSize.width * 5, height: itemSize.height, x: 5, y: 1};

    distance = itemSize.height;

    columns = [];

    speed = 2.5;//default 2

    numberCard = 52;

    spinAreaConf = {x: 100, y: 100};

    effectQueue = [];

    bets = [1000, 10000, 100000];

    moneyFallingEffectTime = 2000;

    currentEffectTurn = 0;

    numberEffectCompleted = 0;

    timeOutList = [];

    var repeatEffectQueue = false;

    var initOptions = {
        resultTab: [{
                name: "Sảnh rồng(Nỗ hũ)",
                value: -1,
                code: '1'
            }, {
                name: "Thùng phá sảnh",
                value: 1000,
                code: '2'
            }, {
                name: "Tứ quý",
                value: 150,
                code: '3'
            }, {
                name: "Cù lũ",
                value: 50,
                code: '4'
            }, {
                name: "Thùng",
                value: 20,
                code: '5'
            }, {
                name: "Sảnh",
                value: 13,
                code: '6'
            }, {
                name: "Ba lá",
                value: 8,
                code: '7'
            }, {
                name: "Hai đôi",
                value: 5,
                code: '8'
            }, {
                name: "Đôi J hoặc cao hơn",
                value: 2.5,
                code: '9'
            }, {
                name: "Không ăn !",
                value: 0,
                code: '10'
            }]
    };

    function MiniPoker(wrapper, options) {
        this.wrapper = $(wrapper);
        this.options = $.extend(initOptions, options);
        this.initMiniPoker();
    }

    var p = MiniPoker.prototype = new TWIST.BaseGame();

    p.initMiniPoker = function () {
        $.extend(this.options, gameSize);
        this.info = {
            betting: 1000,
            potData: {
                1000: 0,
                10000: 0,
                100000: 0
            }
        };
        this.userInfo = {};
        this.initCanvas();
        this.initTemplate();
        this.initButton();
        this.draw();
        this.pushEventListener();
        this.status = 'pause';
    };

    p.draw = function () {
        var _self = this;
        this.mapData = TWIST.MiniPokerLogic.generateMap();
        var spinArea = new createjs.Container();
        this.spinArea = spinArea;

        for (var i = 0; i < gameSize.x; i++) {
            columns[i] = new createjs.Container();
            columns[i].set({x: i * itemSize.width, y: 0});
            var columnItems = new createjs.Container();
            columns[i].addChild(columnItems);

            var value = this.mapData[i];
            var item = this.createSlotItem(this.mapData[i], 0);
            columnItems.addChild(item);

            spinArea.addChild(columns[i]);
        }

        this.stage.addChild(spinArea);
    };

    p.initTemplate = function () {
        var _self = this;
        this.wrapperTemplate = $(TWIST.HTMLTemplate['miniPoker/wrapper']);
        this.wrapper.append(this.wrapperTemplate);

        this.wrapperTemplate.append(this.canvas);
        this.initStage();

        this.resultText = $(TWIST.HTMLTemplate['miniPoker/resultText']);
        this.wrapperTemplate.append(this.resultText);

        this.wrapperTemplate.append($(TWIST.HTMLTemplate['miniPoker/pot']));
        this.pot = this.wrapperTemplate.find('.pot-value');

        this.buttonSpin = $(TWIST.HTMLTemplate['miniPoker/button']);
        this.wrapperTemplate.append(this.buttonSpin);

        var autoSpin = $(TWIST.HTMLTemplate['miniPoker/autospin']);
        this.wrapperTemplate.append(autoSpin);
        this.autoSpin = autoSpin.find('input[type="checkbox"]');

        this.chipWrapper = $(TWIST.HTMLTemplate['miniPoker/chips']);
        this.wrapperTemplate.append(this.chipWrapper);

        this.chipButtons = [{
                value: 1000,
                template: this.chipWrapper.find('.chip.violet')
            }, {
                value: 10000,
                template: this.chipWrapper.find('.chip.green')
            }, {
                value: 100000,
                template: this.chipWrapper.find('.chip.blue')
            }];

        this.errorPanel = $(TWIST.HTMLTemplate['miniPoker/errorPanel']);
        this.wrapperTemplate.append(this.errorPanel);
        this.errorPanel.hide();

        this.resultTab = $(TWIST.HTMLTemplate['miniPoker/resultTab']);
        this.wrapperTemplate.append(this.resultTab);

        this.resultItemList = [];
        this.resultItem = _.template(TWIST.HTMLTemplate['miniPoker/resultItem']);
        this.options.resultTab.forEach(function (item, index) {
            if (item.code === '10')
                return;
            var resultItem = {
                code: item.code,
                template: $(_self.resultItem({
                    name: item.name,
                    value: (item.value <= 0) ? "" : "X" + item.value
                }))
            };
            _self.resultTab.append(resultItem.template);
            _self.resultItemList.push(resultItem);
        });

        this.user = $(TWIST.HTMLTemplate['miniPoker/user']);
        this.wrapperTemplate.append(this.user);

        this.sessionId = $(TWIST.HTMLTemplate['miniPoker/sessionId']);
        this.wrapperTemplate.append(this.sessionId);

        this.effectWrapper = $(TWIST.HTMLTemplate['effect/wrapper']);
        this.wrapperTemplate.append(this.effectWrapper);
        this.explodePot = $(TWIST.HTMLTemplate['effect/explodePot']);
        this.effectWrapper.append(this.explodePot);

        this.money = this.user.find('.money');

        this.setBetting(this.chipButtons[0]);
    };

    p.initButton = function () {
        var _self = this;

        this.chipButtons.forEach(function (item, index) {
            item.template.on('click', function (event) {
                if (_self.status !== 'pause' && _self.status !== 'effecting')
                    return;
                _self.setBetting(item);
            });
        });

        this.autoSpin.on('change', function (event) {
            _self.isAutoSpin = event.target.checked;
            if (_self.status == 'pause' || _self.status == 'effecting') {
                _self.checkStart();
            }
        });

        this.buttonSpin.on('click', function (event) {
            _self.checkStart();
        });
    };

    p.setBetting = function (item) {
        this.chipWrapper.find('.chip').removeClass('active');
        item.template.addClass("active");
        this.info.betting = item.value;
        this.changeNumberEffect(this.pot, this.info.potData[this.info.betting], {duration: 200}).runEffect();
    };

    p.pushEventListener = function () {
        var _self = this;

        this.on("endSpin", function (data) {
            _self.endSpin(data);
        });

        this.on("userInfo", function () {
            _self.renderUserInfo(arguments[0]);
        });

        this.on("spin", function () {
            _self.startSpin();
        });

        this.on("spinCompleted", function () {
            _self.effecting();
        });

        this.on("endEffect", function () {
            _self.endEffect();
        });

        this.on("updateMoney", function (data) {
            _self.updateMoney(data);
        });

        this.on("updatePots", function (data) {
            _self.bindPots(data);
        });

        this.on("error", function (message) {
            _self.showError(message);
        });
    };

    p.showError = function (message) {
        var errorItem = $('<div class="error-item-mini">' + message + '</div>');
        var _self = this;
        this.errorPanel.empty();
        this.errorPanel.show();
        this.errorPanel.append(errorItem);
        var _self = this;
        errorItem.one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function () {
            $(errorItem).remove();
            _self.errorPanel.hide();
        });
    };

    p.checkStart = function () {
        console.log("checkStart1");
        var _self = this;
        if (_self.status !== 'pause' && _self.status !== 'effecting')
            return;
        var _self = this;
        var flag = false;
        if (this.userInfo.money < this.info.betting) {
            this.emit("error", "Bạn không đủ tiền !");
        } else {
            if (_self.status !== "pause")
                _self.changeStatus("pause");
            _self.emit("spin", this.info.betting);
            _self.changeNumberEffect(_self.money, _self.userInfo.money - _self.info.betting, {duration: 200}).runEffect();
        }
    };

    p.renderUserInfo = function (data) {
        $.extend(this.userInfo, data);
        var avatarContainer = this.user.find('.avatar');
        var usernameContainer = this.user.find('.username');
        var moneyContainer = this.user.find('.money');
        var avatar = Global.md5Avatar(data.avatar);
        avatarContainer.addClass('avatar' + avatar);
        usernameContainer.text(data.username);
        var money = Global.numberWithDot(data.money);
        moneyContainer.text(money);
    };

    p.bindPots = function (data) {
        $.extend(this.info.potData, data.pots)
        this.changeNumberEffect(this.pot, this.info.potData[this.info.betting], {duration: 200}).runEffect();
    };

    p.changeStatus = function (status) {
        var _self = this;
        this.status = status;
        timeOutList.forEach(function (item) {
            clearTimeout(item);
        });
        timeOutList = [];
        if (status == 'pause') {
            this.result = {};
            if (currentEffectTurn >= effectQueue.length)
                currentEffectTurn = 0;
            var effectArray = effectQueue[currentEffectTurn];
            if (effectArray && effectArray.length) {
                for (var i = 0; i < effectArray.length; i++) {
                    if (!effectArray[i].isDone)
                        effectArray[i].endEffect();
                }
            }
            effectQueue = [];
            currentEffectTurn = 0;
            if (this.isAutoSpin) {
                var newSpinTimeOut = setTimeout(function () {
                    _self.status = "pause";
                    _self.checkStart();
                }, 500);
                timeOutList.push(newSpinTimeOut);
            }
        }

        if (status == "running") {
            this.buttonSpin.addClass('disabled');
            this.autoSpin.find('input').attr('disabled', true);
            this.resultText.text("");
        }

        if (status == "effecting") {
            this.buttonSpin.removeClass('disabled');
            this.autoSpin.find('input').attr('disabled', false);
        }
    };

    p.startSpin = function () {
        endingPhase = -1;
        var _self = this;
        var firstColumn = columns[0].getChildAt(0);
        this.changeStatus("running");
        createjs.Tween.get(firstColumn)
                .to({y: -50}, 150)
                .call(function () {})
                .to({y: 0}, 150)
                .call(function () {
                    _self.spinAllColumns();
                });

    };

    p.spinAllColumns = function () {
        var _self = this;
        for (var i = 0; i < gameSize.x; i++) {
            _self.spinColumn(i);
        }
    };

    p.spinColumn = function (columnIndex) {
        var currentSpeed = this.options.speed || speed;
        var isNewEndingPhase = false;
        var beforeLastRow = false;
        if (endingPhase > -1 && (columnIndex == Math.floor(((endingPhase * 10 + 0.9 * 10) / 10) / gameSize.y))) {
            if (endingPhase % 1 == 0) {
                isNewEndingPhase = true;
                beforeLastRow = (endingPhase % gameSize.y) == (gameSize.y);
            }
        }
        var _self = this;
        var newItem;
        var itemsContainer = columns[columnIndex].getChildAt(0);
        if (isNewEndingPhase) {
            newItem = this.createSlotItem(this.mapData[columnIndex], -1);
        } else {
            newItem = this.createSlotItem(Math.floor(Math.random() * 4) + 52, -1);
        }
        itemsContainer.addChild(newItem);
        var easeType = beforeLastRow ? createjs.Ease.getBackOut(5) : createjs.Ease.linear;
        var timeAnimation = beforeLastRow ? 2 * distance / currentSpeed : distance / currentSpeed;
        createjs.Tween.get(itemsContainer)
                .to({y: distance}, timeAnimation, easeType)
                .call(function () {
                    var columnIndex = this.parent.parent.getChildIndex(this.parent);
                    this.set({y: 0});
                    var slotItems = this.children;
                    slotItems.forEach(function (item, index) {
                        item.state++;
                        item.goNextStep();
                    });
                    this.removeChild(slotItems.find(function (item) {
                        return item.state == gameSize.y
                    }));

                    if (endingPhase > -1) {

                        var newValue = Math.floor(Math.floor((endingPhase + 0.9) / gameSize.y));
                        if (columnIndex == Math.floor(((endingPhase * 10 + 0.9 * 10) / 10) / gameSize.y)) {
                            var isLastRow = (endingPhase % gameSize.y) == (gameSize.y - 1);
                            if (isLastRow) {
                                stepValue = 1 / 5;
                            } else if ((endingPhase % gameSize.y) == 0) {
                                stepValue = 1;
                            }
                            endingPhase = (endingPhase * 10 + stepValue * 10) / 10;
                            if (!isLastRow) {
                                _self.spinColumn(columnIndex);
                            } else {
                                endingPhase = (endingPhase * 10 + stepValue * 10) / 10;
                            }
                        } else {
                            _self.spinColumn(columnIndex);
                        }
                        if (endingPhase > (gameSize.x * gameSize.y) - 1) {
                            _self.emit("spinCompleted");
                        }
                    } else {
                        _self.spinColumn(columnIndex);
                    }

                });
    };

    p.endSpin = function (data) {
        if (this.status !== 'running')
            return;
        this.changeStatus("ending");
        this.result = this.result || {};
        $.extend(this.result, data);
        this.mapData = data.map;
        this.showSessionId(data.sessionId);
        endingPhase = -0.8;
        stepValue = 0.2;
    };

    p.updateMoney = function (data) {
        this.result = this.result || {};
        $.extend(this.result, data);
        this.userInfo.money = data.newMoney;
    };

    p.effecting = function () {
        var _self = this;
        this.changeStatus("effecting");
        var result = this.result;
        effectQueue = [];

        var effectArray = [];


        var hightLightWinCards = this.hightLightWinCards(result.hightLightCards);
        effectArray.push(hightLightWinCards);
        this.showResultText(result.cardListRank, result.rankOfVerticalGroup);

        if (result.cardListRank == 1) {
            var explodePotEffect = this.explodePotEffect();
            effectArray.push(explodePotEffect);
        }

        if (parseInt(result.winMoney) > 0) {
            var changeWinMoneyEffect = this.winMoneyEffect(result.winMoney);
            var changeTotalMoneyEffect = this.changeNumberEffect(this.money, result.newMoney, {duration: moneyFallingEffectTime});
            var hightlightWinRank = this.hightlightWinRank(result.cardListRank);
            effectArray.push(changeWinMoneyEffect, changeTotalMoneyEffect, hightlightWinRank);
        }
        effectArray.oneTime = true;
        effectArray.forEach(function (item, index) {
            item.isTracking = true;
        });
        effectQueue.push(effectArray);
        if (this.isAutoSpin) {
            var timeOut = setTimeout(3000, function () {
                _self.status = "pause";
                _self.checkStart();
            });

            timeOutList.push(timeOut);
        }

        this.runNextEffect();
    };

    p.runNextEffect = function () {
        var effectArray = effectQueue[currentEffectTurn];
        if (!effectArray || !effectArray.length)
            return;
        function _runEffect() {
            numberEffectCompleted = 0;
            for (var i = 0; i < effectArray.length; i++) {
                effectArray[i].runEffect();
            }
        }
        if (effectArray.oneTime) {
            if (effectArray.done) {
                currentEffectTurn++;
                if (currentEffectTurn == effectQueue.length) {
                    if (repeatEffectQueue) {
                        currentEffectTurn = 0;
                    } else {
//                    this.status = "pause";
                        this.changeStatus("pause");
                    }
                }
                if (this.status === "effecting") {
//                    this.runNextEffect();
                }
            } else {
                _runEffect();
            }
        } else {
            var timeOut = setTimeout(_runEffect, 300);
            timeOutList.push(timeOut);
        }
    };

    p.endEffect = function () {
        numberEffectCompleted++;
        if (numberEffectCompleted == (effectQueue[currentEffectTurn] && effectQueue[currentEffectTurn].length)) {
            if (effectQueue[currentEffectTurn].oneTime)
                effectQueue[currentEffectTurn].done = true;
            currentEffectTurn++;
            if (currentEffectTurn == effectQueue.length) {
                if (repeatEffectQueue) {
                    currentEffectTurn = 0;
                } else {
//                    this.status = "pause";
                    this.changeStatus("pause");
                }
            }
            if (this.status === "effecting") {
//                this.runNextEffect();
            }
        }
    };

    p.createSlotItem = function (value, state) {
        var _self = this;
        var slotItem = new createjs.Container();

        var bg = new TWIST.Card(value);
        if (value > 51) {
            value -= 52;
            bg.bg.sourceRect = {
                width: TWIST.Card.size.width,
                height: 152,
                x: TWIST.Card.size.width * (9 + value),
                y: TWIST.Card.size.height * 4
            };
        }

        bg.set({
            scaleX: TWIST.Card.miniPoker.scale,
            scaleY: TWIST.Card.miniPoker.scale,
            x: (itemSize.width - TWIST.Card.miniPoker.width) / 2,
            y: (itemSize.height - TWIST.Card.miniPoker.scale * TWIST.Card.size.height) / 2
        });
        slotItem.addChild(bg);
        slotItem.set({
            x: 0,
            y: itemSize.height * state,
            state: state
        });

        slotItem.goNextStep = function () {
            var newY = itemSize.height * this.state;
            this.set({y: newY});
        };
        return slotItem;
    };

    p.changeNumberEffect = function (el, newValue, options) {

        var jElement = $(el);
        var _self = this;

        jElement.newValue = newValue;
        jElement.options = options;

        jElement.runEffect = function () {
            jElement.finish();
            jElement.isDone = true;
            var oldValue = this.text();
            var newOptions = {
                duration: 1000,
                step: function (now) {
                    jElement.text(Global.numberWithDot(Math.ceil(now)));
                },
                done: function () {
                    jElement.endEffect();
                }
            };
            $.extend(newOptions, jElement.options);
            oldValue = parseInt(oldValue.replace(/\./g, ""));
            if (isNaN(oldValue))
                oldValue = 0;
            this.prop('Counter', oldValue).animate({
                Counter: jElement.newValue
            }, newOptions);
        };

        jElement.endEffect = function () {
            jElement.finish();
            if (this.isTracking) {
                this.isTracking = false;
                _self.emit("endEffect");
            }
        };

        return jElement;
    };

    p.explodePotEffect = function () {
        var _self = this;
        var jElement = $('#effect .explorer-pot');
        var firstTime = new Date();
        jElement.runEffect = function () {
            this.show();
        };
        jElement.click(function () {
            jElement.isDone = false;
            jElement.endEffect();
        });
        jElement.endEffect = function () {
            this.hide();
            this.isDone = true;
            if (this.isTracking) {
                this.isTracking = false;
                _self.emit("endEffect");
            }
        };

        return jElement;
    };

    p.winMoneyEffect = function (value) {
        var _self = this;

        var jElement = $(TWIST.HTMLTemplate['miniPoker/winMoney']);
        jElement.text(Global.numberWithDot(value));

        jElement.one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function () {
            jElement.endEffect();
        });

        jElement.runEffect = function () {
            jElement.isDone = false;
            if (value > 0) {
                _self.user.append(jElement);
            }
        };

        jElement.endEffect = function () {
            jElement.remove();
            jElement.isDone = true;
            if (this.isTracking) {
                this.isTracking = false;
                _self.emit("endEffect");
            }
        };

        return jElement;
    };

    p.hightlightWinRank = function (code) {
        var _self = this;

        var rankItem = this.resultItemList.find(function (item, index) {
            return item.code == code;
        });

        var jElement = rankItem ? rankItem.template : $('<div></div>');

        jElement.one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function () {
            jElement.endEffect();
        });

        jElement.runEffect = function () {
            jElement.isDone = false;
            jElement.addClass('active');
            if (this.isTracking) {
                this.isTracking = false;
                _self.emit("endEffect");
            }
        };

        jElement.endEffect = function () {
            jElement.removeClass('active');
            jElement.isDone = true;
        };

        return jElement;
    };

    p.hightLightWinCards = function (cardList) {
        var _self = this;

        var cardListTemlate = [];

        for (var i = 0; i < gameSize.x; i++) {
            var card = columns[i].children[0].children[0].children[0];
            card.active = cardList[i];
            card.border.sourceRect.x = TWIST.Card.size.width * 4;
            cardListTemlate.push(card);
        }

        cardListTemlate.runEffect = function () {
            cardListTemlate.isDone = true;
            cardListTemlate.forEach(function (item, index) {
                if (parseInt(item.active)) {
                    item.hightLight();
                } else {
                    item.Overlay();
                }
            });
            if (this.isTracking) {
                this.isTracking = false;
                _self.emit("endEffect");
            }
        };

        cardListTemlate.endEffect = function () {
            cardListTemlate.isDone = true;
        };

        return cardListTemlate;
    };

    p.showResultText = function (cardListRank, rankOfVerticalGroup) {
        var _self = this;

        var resultItem = this.options.resultTab.find(function (item, index) {
            return item.code == cardListRank;
        });
        var rankItem = cardRankList.find(function (item, index) {
            return item.value == rankOfVerticalGroup;
        });
        var resultText = resultItem.name;
        if ((resultItem.code == 3 || resultItem.code == 7 || resultItem.code == 9) && rankItem) {
            resultText = resultText + " " + rankItem.name;
            if (resultItem.code == 9) {
                resultText = "Đôi " + rankItem.name;
            }
        }
        this.resultText.text(resultText);

        var showResultText = {};

        showResultText.runEffect = function () {
            showResultText.isDone = false;
            _self.resultText.text(resultText);
            if (this.isTracking) {
                this.isTracking = false;
                _self.emit("endEffect");
            }
        };

        showResultText.endEffect = function () {
            _self.resultText.text("");
            showResultText.isDone = true;
        };

        return showResultText;
    };

    p.explodePotEffect = function () {
        var _self = this;
        var jElement = this.explodePot;
        var firstTime = new Date();
        jElement.runEffect = function () {
            this.isDone = false;
            this.show();
        };
        jElement.click(function () {
            jElement.endEffect();
        });
        jElement.endEffect = function () {
            this.hide();
            this.isDone = true;
            if (this.isTracking) {
                this.isTracking = false;
                _self.emit("endEffect");
            }
        };

        return jElement;
    };

    p.showSessionId = function (sessionId) {
        this.sessionId.text(sessionId);
    };

    TWIST.MiniPoker = MiniPoker;

})();
this.TWIST = this.TWIST || {};

(function () {
    "use strict";

    var initOptions = {
        maxPlayers: 5,
        numberCardsInHand: 10,
        turnTime: 20000
    };
    function SamGame(wrapper, options) {
        this.wrapper = $(wrapper);
        this.options = $.extend(initOptions, options);
        this.initSamGame();
    }
    var p = SamGame.prototype = new TWIST.BaseDemlaGame();

    p.initSamGame = function (wrapper) {
        this.initBaseDemlaGame();
        this.pushSamGameEvent();
        this.bindSamButton();
    };

    p.pushSamGameEvent = function () {
        this.on("inviteSam", this.onInviteSam);
        this.on("endInviteSam", this.onEndInviteSam);
        this.on("foldSam", this.onFoldSam);
        this.on("callSam", this.onCallSam);
    };

    p.bindSamButton = function () {
        var _self = this;

        this.callSamButton = $(TWIST.HTMLTemplate.buttonBar.callSamButton);
        this.buttonBar.append(this.callSamButton);
        this.callSamButton.unbind('click');
        this.callSamButton.click(function () {
            _self.emit("call-sam");
        });

        this.foldSamButton = $(TWIST.HTMLTemplate.buttonBar.foldSamButton);
        this.buttonBar.append(this.foldSamButton);
        this.foldSamButton.unbind('click');
        this.foldSamButton.click(function () {
            _self.emit("fold-sam");
        });
    };

    p.onInviteSam = function (data) {
        this.desk.setRemainingTime(parseInt(data.remainingTime));
        this.callSamButton.show();
        this.foldSamButton.show();
        this.userCallSam = null;
    };

    p.onEndInviteSam = function () {
        this.desk.setRemainingTime(0);
        this.callSamButton.hide();
        this.foldSamButton.hide();
        var players = this.playersContainer.children;
        for (var i = 0, length = players.length; i < length; i++) {
            var player = players[i];
            if (player && player.uuid !== this.userCallSam) {
                player.setPlayerStatus("");
            }
        }
    };

    p.onFoldSam = function (data) {
        var player = this.getPlayerByUuid(data.uuid);
        player.setPlayerStatus("Hủy sâm !");
    };

    p.onCallSam = function (data) {
        var player = this.getPlayerByUuid(data.uuid);
        player.setPlayerStatus("Báo sâm !", {
            color: "red"
        });
        this.userCallSam = data.uuid;
    };

    p.endGame = function (data) {
        this.endIngameEvent();
        var winTypeMap = {
           0 : "Năm đôi",
           1 : "3 sám cô",
           2 : "Đồng màu",
           3 : "Tứ 2",
           4 : "Sảnh rồng",
           15 : "Hòa",
           16 : "Bị ăn sâm",
           17 : "Bị bắt sâm",
           18 : "Phạt báo 1",
           19 : "Bị thua trắng",
           20 : "Thua",
           21 : "Bắt sâm"
        };
        
        var _self = this;
        var resultData = {
            isWinner: false,
            listPlayers: []
        };
        resultData.listPlayers = data.listPlayers;
        for (var i = 0, length = resultData.listPlayers.length; i < length; i++) {
            var player = resultData.listPlayers[i];
            var cardList = player.remainCards;
            cardList.sort(function (a, b) {
                return a - b;
            });
            player.gameResultString = winTypeMap[data.winType];
            if (parseInt(player.changeMoney) > 0) {
                player.isWinner = true;
                if (player.uuid === this.userInfo.uuid) {
                    resultData.isWinner = true;
                }
            } 

            var Player = this.getPlayerByUuid(player.uuid);
            if (Player) {
                Player.clearTimer();
                Player.setMoney(player.money);
                Player.showMoneyExchageEffect(player.changeMoney, parseInt(player.changeMoney) > 0 ? "win" : "lose");
            }
        }
        setTimeout(function () {
            _self.showResult(resultData);
        }, 2000);
    };

    TWIST.SamGame = SamGame;

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
        this.endDemlaGame(data,winTypeMap,16);
    };

    TWIST.TLMNDemlaGame = TLMNDemlaGame;

})();
this.TWIST = this.TWIST || {};

(function () {
    "use strict";

    var gameSize, columnSize, itemSize, distance, columns, speed, effectArray,
            statusList, endingPhase, numberCard, time, stepValue, spinAreaConf, colorList,
            lineList9, lineList20, isLine9, line9Left, line9Right, line20Left, line20Right,
            line9Coordinate, activeLines, bets, effectQueue, moneyFallingEffectTime, currentEffectTurn, numberEffectCompleted,
            timeOutList, fistLog, cardRankList, gameTurn, currentCardList, gameTurnList, activeColumnIndex, currentWin, doubleList,
            holdCard;

    statusList = ["pause", "running", "ending", "effecting"];

    cardRankList = [
        {value: 0, name: "2"}
        , {value: 1, name: "3"}
        , {value: 2, name: "4"}
        , {value: 3, name: "5"}
        , {value: 4, name: "6"}
        , {value: 5, name: "7"}
        , {value: 6, name: "8"}
        , {value: 7, name: "9"}
        , {value: 8, name: "10"}
        , {value: 9, name: "J"}
        , {value: 10, name: "Q"}
        , {value: 11, name: "K"}
        , {value: 12, name: "A"}
    ];

    endingPhase = -1;

    stepValue = 1;

    itemSize = {width: 160, height: 205, padding: 10};

    gameSize = {width: itemSize.width * 5, height: itemSize.height, x: 5, y: 1};

    distance = itemSize.height;

    columns = [];

    speed = 2.5;//default 2

    numberCard = 52;

    spinAreaConf = {x: 100, y: 100};

    effectQueue = [];

    bets = [1000, 10000, 100000];

    moneyFallingEffectTime = 2000;

    currentEffectTurn = 0;

    numberEffectCompleted = 0;

    timeOutList = [];

    gameTurn = 0;

    gameTurnList = ["selectCard", "selectDouble", "getWin"];

    currentCardList = [];

    activeColumnIndex = [];

    currentWin = 0;

    doubleList = [0, 1, 2, 3, 4];

    var holdList = [];

    var repeatEffectQueue = false;

    var initOptions = {
        resultTab: [{
                name: "Sảnh rồng(Nỗ hũ)",
                value: -1,
                code: '0'
            }, {
                name: "Thùng phá sảnh",
                value: 50,
                code: '1'
            }, {
                name: "Tứ quý",
                value: 25,
                code: '2'
            }, {
                name: "Cù lũ",
                value: 9,
                code: '3'
            }, {
                name: "Thùng",
                value: 6,
                code: '4'
            }, {
                name: "Sảnh",
                value: 4,
                code: '5'
            }, {
                name: "Ba lá",
                value: 3,
                code: '6'
            }, {
                name: "Hai đôi",
                value: 2,
                code: '7'
            }, {
                name: "Đôi J hoặc cao hơn",
                value: 1,
                code: '8'
            }, {
                name: "Không ăn !",
                value: 0,
                code: '9'
            }]
    };

    function VideoPoker(wrapper, options) {
        this.wrapper = $(wrapper);
        this.options = $.extend(initOptions, options);
        this.initVideoPoker();
    }

    var p = VideoPoker.prototype = new TWIST.BaseGame();

    p.initVideoPoker = function () {
        $.extend(this.options, gameSize);
        this.info = {
            betting: 1000,
            potData: {
                1000: 0,
                10000: 0,
                100000: 0
            }
        };
        this.userInfo = {};
        this.initCanvas();
        this.initTemplate();
        this.initButton();
        this.draw();
        this.pushEventListener();
        this.status = 'pause';
    };

    p.draw = function () {
        var _self = this;
        this.mapData = TWIST.MiniPokerLogic.generateMap();
        var spinArea = new createjs.Container();
        this.spinArea = spinArea;

        for (var i = 0; i < gameSize.x; i++) {
            columns[i] = new createjs.Container();
            columns[i].set({x: i * itemSize.width, y: 0});
            var columnItems = new createjs.Container();
            columns[i].addChild(columnItems);

            var value = this.mapData[i];
            var item = this.createSlotItem(this.mapData[i], 0);
            columnItems.addChild(item);

            spinArea.addChild(columns[i]);
        }

        this.stage.addChild(spinArea);
    };

    p.initTemplate = function () {
        var _self = this;
        this.wrapperTemplate = $(TWIST.HTMLTemplate['videoPoker/wrapper']);
        this.wrapper.append(this.wrapperTemplate);

        this.wrapperTemplate.append(this.canvas);
        this.initStage();

        this.resultText = $(TWIST.HTMLTemplate['miniPoker/resultText']);
        this.wrapperTemplate.append(this.resultText);

        this.wrapperTemplate.append($(TWIST.HTMLTemplate['miniPoker/pot']));
        this.pot = this.wrapperTemplate.find('.pot-value');

        this.buttonSpin = $(TWIST.HTMLTemplate['miniPoker/button']);
        this.wrapperTemplate.append(this.buttonSpin);

        this.doubleButton = $(TWIST.HTMLTemplate['videoPoker/doubleButton']);
        this.wrapperTemplate.append(this.doubleButton);
        this.doubleButton._disabled = true;
        this.doubleButton.hide();

        this.getWinButton = $(TWIST.HTMLTemplate['videoPoker/getWinButton']);
        this.wrapperTemplate.append(this.getWinButton);
        this.getWinButton._disabled = true;

        this.chipWrapper = $(TWIST.HTMLTemplate['miniPoker/chips']);
        this.wrapperTemplate.append(this.chipWrapper);

        this.chipButtons = [{
                value: 1000,
                template: this.chipWrapper.find('.chip.violet')
            }, {
                value: 10000,
                template: this.chipWrapper.find('.chip.green')
            }, {
                value: 100000,
                template: this.chipWrapper.find('.chip.blue')
            }];

        this.errorPanel = $(TWIST.HTMLTemplate['miniPoker/errorPanel']);
        this.wrapperTemplate.append(this.errorPanel);
        this.errorPanel.hide();

        this.resultTab = $(TWIST.HTMLTemplate['miniPoker/resultTab']);
        this.wrapperTemplate.append(this.resultTab);

        this.virtualCardsList = [];
        this.virtualCards = $(TWIST.HTMLTemplate['videoPoker/virtualCards']);
        this.wrapperTemplate.append(this.virtualCards);
        for (var i = 0; i < 5; i++) {
            this.virtualCardsList.push(this.virtualCards.find('.vitualCard' + (i + 1)));
        }

        this.resultItemList = [];
        this.resultItem = _.template(TWIST.HTMLTemplate['miniPoker/resultItem']);
        this.options.resultTab.forEach(function (item, index) {
            if (item.code === _self.options.resultTab[_self.options.resultTab.length - 1].code)
                return;
            var resultItem = {
                code: item.code,
                template: $(_self.resultItem({
                    name: item.name,
                    value: (item.value <= 0) ? "" : "X" + item.value
                }))
            };
            _self.resultTab.append(resultItem.template);
            _self.resultItemList.push(resultItem);
        });

        this.user = $(TWIST.HTMLTemplate['miniPoker/user']);
        this.wrapperTemplate.append(this.user);

        this.sessionId = $(TWIST.HTMLTemplate['miniPoker/sessionId']);
        this.wrapperTemplate.append(this.sessionId);

        this.effectWrapper = $(TWIST.HTMLTemplate['effect/wrapper']);
        this.wrapperTemplate.append(this.effectWrapper);

        this.explodePot = $(TWIST.HTMLTemplate['effect/explodePot']);
        this.effectWrapper.append(this.explodePot);

        this.supportText = $(TWIST.HTMLTemplate['videoPoker/supportText']);
        this.wrapperTemplate.append(this.supportText);

        this.moveChip = $(TWIST.HTMLTemplate['videoPoker/moveChip']);
        this.user.append(this.moveChip);
        this.moveChip.hide();

        this.money = this.user.find('.money');

        this.setBetting(this.chipButtons[0]);
    };

    p.initButton = function () {
        var _self = this;

        this.chipButtons.forEach(function (item, index) {
            item.template.on('click', function (event) {
                if ((_self.status !== 'pause' && _self.status !== 'effecting') || gameTurn != 0)
                    return;
                _self.setBetting(item);
            });
        });

        this.virtualCardsList.forEach(function (item, index) {
            item.on('click', function (event) {
                console.log(gameTurn, _self.status);
                if (_self.status == 'effecting' && gameTurn == 1) {
                    item._active = !item._active;
                    item.toggleClass("active");
                } else if (gameTurn == 3) {
                    if (!currentCardList[index].isOpened) {
                        _self.emit("cardSelect", index);
                        gameTurn = -1;
                    }
                }
            });
        });

        this.getWinButton.on('click', function (event) {
            if (gameTurn != 2 && gameTurn != 3)
                return;
            if (_self.getWinButton._disabled)
                return;
            _self.emit("getWin");
        });

        this.doubleButton.on('click', function (event) {
            if (gameTurn != 2 && gameTurn != 3)
                return;
            if (_self.doubleButton._disabled)
                return;
            console.log("double");
            _self.emit("double");
        });

        this.buttonSpin.on('click', function (event) {
            _self.checkStart();
        });
    };

    p.setBetting = function (item) {
        this.chipWrapper.find('.chip').removeClass('active');
        item.template.addClass("active");
        this.info.betting = item.value;
        this.changeNumberEffect(this.pot, this.info.potData[this.info.betting], {duration: 200}).runEffect();
    };

    p.pushEventListener = function () {
        var _self = this;

        this.on("endSpin", function (data) {
            _self.endSpin(data);
        });

        this.on("userInfo", function () {
            _self.renderUserInfo(arguments[0]);
        });

        this.on("spin", function () {
            _self.startSpin();
        });

        this.on("seconSpin", function () {
            _self.startSpin();
        });

        this.on("spinCompleted", function () {
            _self.effecting();
        });

        this.on("endEffect", function () {
            _self.endEffect();
        });

        this.on("updateMoney", function (data) {
            _self.updateMoney(data);
        });

        this.on("updatePots", function (data) {
            _self.bindPots(data);
        });

        this.on("error", function (message) {
            _self.showError(message);
        });

        this.on("getWinResult", function (data) {
            _self.getWin(data);
        });

        this.on("doubleResult", function (data) {
            _self.doubleTurn(data);
        });

        this.on("updateDoubleList", function (data) {
            doubleList = data.doubleList;
        });

        this.on("cardSelectResult", function (data) {
            _self.setCardSelected(data);
        });
    };

    p.setCardSelected = function (data) {
        var _self = this;
        var card = currentCardList[data.selectedIndex];
        card.isTracking = true;
        doubleList = data.map;

        card.openCard(doubleList[data.selectedIndex], TWIST.Card.miniPoker);

        TWIST.Observer.once('cardOpened', openOtherCard);

        function openOtherCard(cardOpen) {
            var delay = 0;
            var item = _self.virtualCardsList[data.selectedIndex]
            item._active = true;
            item.addClass('active');
            currentCardList.forEach(function (item, index) {
                if (index == 0 || index == data.selectedIndex)
                    return;
                createjs.Tween.get(item).wait(delay * 200).to({}, 10).call(function () {
                    this.Overlay();
                    this.openCard(doubleList[index], TWIST.Card.miniPoker);
                });
                delay++;
            });

            if (data.isNext) {
                var changeWinMoneyEffect = _self.changeNumberEffect(_self.resultText, data.winMoney, {duration: 700}).runEffect();
                var supportTextEffect = _self.setTextEffect(_self.supportText, "Nhân đôi " + data.winMoney + " thành " + (parseInt(data.winMoney) * 2) + "!").runEffect();
                _self.buttonSpin.hide();
                _self.doubleButton._disabled = false;
                _self.doubleButton.removeClass('disabled');
                _self.doubleButton.show();
                _self.getWinButton._disabled = false;
                _self.getWinButton.addClass('active');
                currentWin = parseInt(data.winMoney);
                gameTurn = 2;
            } else {
                currentWin = 0;
                var supportTextEffect = _self.setTextEffect(_self.supportText, "Không ăn !").runEffect();
                var changeWinMoneyEffect = _self.changeNumberEffect(_self.resultText, 0, {duration: 700}).runEffect();
                gameTurn = 0;
                _self.buttonSpin.show();
                _self.doubleButton.hide();
                _self.doubleButton._disabled = false;
                _self.doubleButton.addClass('disabled');
                _self.getWinButton._disabled = true;
                _self.getWinButton.removeClass('active');
                _self.virtualCardsList.forEach(function (item, index) {
                    item._active = false;
                    item.removeClass("active");
                });
            }
        }
    };

    p.showError = function (message) {
        var errorItem = $('<div class="error-item-mini">' + message + '</div>');
        var _self = this;
        this.errorPanel.empty();
        this.errorPanel.show();
        this.errorPanel.append(errorItem);
        var _self = this;
        errorItem.one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function () {
            $(errorItem).remove();
            _self.errorPanel.hide();
        });
    };

    p.checkStart = function () {
        var _self = this;
        if (_self.status !== 'pause' && _self.status !== 'effecting')
            return;
        var _self = this;
        if (gameTurn == 0) {
            if (this.userInfo.money < this.info.betting) {
                this.emit("error", "Bạn không đủ tiền !");
            } else {
                if (_self.status !== "pause")
                    _self.changeStatus("pause");
                _self.emit("spin", this.info.betting);
                _self.changeNumberEffect(_self.money, _self.userInfo.money - _self.info.betting, {duration: 800}).runEffect();
                _self.changeNumberEffect(_self.resultText, _self.info.betting, {duration: 800}).runEffect();
                _self.moveChipEffect(1).runEffect();
            }
        } else if (gameTurn == 1) {
            holdList = [];
            this.virtualCardsList.forEach(function (item, index) {
                holdList.push(item._active);
            });
            _self.emit("seconSpin", holdList);
        }
    };

    p.renderUserInfo = function (data) {
        $.extend(this.userInfo, data);
        var avatarContainer = this.user.find('.avatar');
        var usernameContainer = this.user.find('.username');
        var moneyContainer = this.user.find('.money');
        var avatar = Global.md5Avatar(data.avatar);
        avatarContainer.addClass('avatar' + avatar);
        usernameContainer.text(data.username);
        var money = Global.numberWithDot(data.money);
        moneyContainer.text(money);
    };

    p.bindPots = function (data) {
        $.extend(this.info.potData, data.pots)
        this.changeNumberEffect(this.pot, this.info.potData[this.info.betting], {duration: 200}).runEffect();
    };

    p.changeStatus = function (status) {
        console.log("changeStatus", status);
        var _self = this;
        this.status = status;
        timeOutList.forEach(function (item) {
            clearTimeout(item);
        });
        timeOutList = [];
        if (status == 'pause') {
            this.result = {};
            if (currentEffectTurn >= effectQueue.length)
                currentEffectTurn = 0;
            var effectArray = effectQueue[currentEffectTurn];
            if (effectArray && effectArray.length) {
                for (var i = 0; i < effectArray.length; i++) {
                    if (!effectArray[i].isDone)
                        effectArray[i].endEffect();
                }
            }
            effectQueue = [];
            currentEffectTurn = 0;
        }

        if (status == "running") {
            this.buttonSpin.addClass('disabled');
            if (gameTurn == 0) {
                this.resultText.text("");
            }
        }

        if (status == "effecting") {
            this.buttonSpin.removeClass('disabled');
        }
    };

    p.startSpin = function () {
        endingPhase = -1;
        var firstColumn;
        var _self = this;
        var index = this.virtualCardsList.findIndex(function (item, index) {
            return !item._active;
        });
        if (index > -1) {
            firstColumn = columns[index].getChildAt(0);
            this.changeStatus("running");
            createjs.Tween.get(firstColumn)
                    .to({y: -50}, 150)
                    .call(function () {})
                    .to({y: 0}, 150)
                    .call(function () {
                        _self.spinAllColumns();
                    });
        } else {
            _self.changeStatus("effecting");
        }
    };

    p.spinAllColumns = function () {
        var _self = this;
        activeColumnIndex = [];
        this.virtualCardsList.forEach(function (item, index) {
            if (!_self.virtualCardsList[index]._active) {
                activeColumnIndex.push(index);
            }
        });
        activeColumnIndex.forEach(function (item, index) {
            _self.spinColumn(item, index);
        });
    };

    p.spinColumn = function (columnIndex, activeIndex) {
        var currentSpeed = this.options.speed || speed;
        var isNewEndingPhase = false;
        var beforeLastRow = false;
        if (endingPhase > -1 && (activeIndex == Math.floor(((endingPhase * 10 + 0.9 * 10) / 10) / gameSize.y))) {
            if (endingPhase % 1 == 0) {
                isNewEndingPhase = true;
                beforeLastRow = (endingPhase % gameSize.y) == (gameSize.y);
            }
        }
        var _self = this;
        var newItem;
        var itemsContainer = columns[columnIndex].getChildAt(0);
        if (isNewEndingPhase) {
            newItem = this.createSlotItem(this.mapData[columnIndex], -1);
        } else {
            newItem = this.createSlotItem(Math.floor(Math.random() * 4) + 52, -1);
        }
        itemsContainer.addChild(newItem);
        currentCardList[columnIndex] = newItem.children[0];

        var easeType = beforeLastRow ? createjs.Ease.getBackOut(5) : createjs.Ease.linear;
        var timeAnimation = beforeLastRow ? 2 * distance / currentSpeed : distance / currentSpeed;
        createjs.Tween.get(itemsContainer)
                .to({y: distance}, timeAnimation, easeType)
                .call(function () {
                    this.set({y: 0});
                    var slotItems = this.children;
                    slotItems.forEach(function (item, index) {
                        item.state++;
                        item.goNextStep();
                    });
                    this.removeChild(slotItems.find(function (item) {
                        return item.state == gameSize.y
                    }));

                    if (endingPhase > -1) {

                        var newValue = Math.floor(Math.floor((endingPhase + 0.9) / gameSize.y));
                        if (activeIndex == Math.floor(((endingPhase * 10 + 0.9 * 10) / 10) / gameSize.y)) {
                            var isLastRow = (endingPhase % gameSize.y) == (gameSize.y - 1);
                            if (isLastRow) {
                                stepValue = 1 / 5;
                            } else if ((endingPhase % gameSize.y) == 0) {
                                stepValue = 1;
                            }
                            endingPhase = (endingPhase * 10 + stepValue * 10) / 10;
                            if (!isLastRow) {
                                _self.spinColumn(columnIndex, activeIndex);
                            } else {
                                endingPhase = (endingPhase * 10 + stepValue * 10) / 10;
                            }
                        } else {
                            _self.spinColumn(columnIndex, activeIndex);
                        }
                        if (endingPhase > activeColumnIndex.length - 1) {
                            _self.emit("spinCompleted");
                        }
                    } else {
                        _self.spinColumn(columnIndex, activeIndex);
                    }

                });
    };

    p.endSpin = function (data) {
        if (this.status == 'running') {
            this.changeStatus("ending");
            this.result = this.result || {};
            $.extend(this.result, data);
            this.mapData = data.map;
            this.showSessionId(data.sessionId);
            endingPhase = -0.8;
            stepValue = 0.2;
        } else {
            this.result = this.result || {};
            $.extend(this.result, data);
            this.mapData = data.map;
            this.effecting();
        }
    };

    p.updateMoney = function (data) {
        this.result = this.result || {};
        $.extend(this.result, data);
        this.userInfo.money = data.newMoney;
    };

    p.effecting = function () {
        this.changeStatus("effecting");
        var result = this.result;
        effectQueue = [];

        var effectArray = [];

        if (gameTurn == 0) {
            effectArray = this.getFistEffectTurn();
        } else {
            effectArray = this.getSeconEffectTurn();
        }

        effectArray.oneTime = true;
        effectArray.forEach(function (item, index) {
            item.isTracking = true;
        });
        effectQueue.push(effectArray);
        this.runNextEffect();
    };

    p.getFistEffectTurn = function () {
        var result = this.result;
        var effectArray = [];

        var supportTextEffect = this.setTextEffect(this.supportText, "Chọn quân bài muốn giữ lại");
        var hightlightHoldCards = this.hightlightHoldCards(result.holdCards);
        effectArray.push(supportTextEffect, hightlightHoldCards);

        gameTurn = 1;
        return effectArray;
    };

    p.getSeconEffectTurn = function () {
        var result = this.result;
        var effectArray = [];

        if (parseInt(result.winMoney) > 0) {
            var changeWinMoneyEffect = this.changeNumberEffect(this.resultText, result.winMoney, {duration: 700});
            var supportTextEffect = this.setTextEffect(this.supportText, "Nhân đôi " + result.winMoney + " thành " + (parseInt(result.winMoney) * 2) + "!");
            var hightLightWinCards = this.hightLightWinCards(result.hightLightCards);
            var hightlightWinRank = this.hightlightWinRank(result.cardListRank);
            effectArray.push(changeWinMoneyEffect, supportTextEffect, hightLightWinCards, hightlightWinRank);
            this.buttonSpin.hide();
            this.doubleButton._disabled = false;
            this.doubleButton.removeClass('disabled');
            this.doubleButton.show();
            this.getWinButton._disabled = false;
            this.getWinButton.addClass('active');
            currentWin = parseInt(result.winMoney);
            gameTurn = 2;
        } else {
            currentWin = 0;
            var supportTextEffect = this.setTextEffect(this.supportText, "Không ăn !");
            var changeWinMoneyEffect = this.changeNumberEffect(this.resultText, 0, {duration: 700});
            var hightLightWinCards = this.hightLightWinCards([]);
            var hightlightHoldCards = this.hightlightHoldCards([]);
            effectArray.push(changeWinMoneyEffect, supportTextEffect, hightLightWinCards, hightlightHoldCards);
            gameTurn = 0;
            this.virtualCardsList.forEach(function (item, index) {
                item._active = false;
                item.removeClass("active");
            });
        }

        return effectArray;
    };

    p.hightlightHoldCards = function (holdCards) {

        var jElement = this.virtualCardsList;
        var _self = this;

        jElement.runEffect = function () {
            this.isDone = false;
            this.forEach(function (item, index) {
                if (holdCards[index]) {
                    item._active = true;
                    item.addClass('active');
                } else {
                    item._active = false;
                    item.removeClass('active');
                }
            });
        };

        jElement.endEffect = function () {
            this.forEach(function (item, index) {
                item.removeClass('active');
            });
            this.isDone = true;
            if (this.isTracking) {
                this.isTracking = false;
                _self.emit("endEffect");
            }
        };

        return jElement;
    };

    p.getWin = function (data) {
        var _self = this;
        _self.changeStatus("effecting");
        _self.changeNumberEffect(_self.money, _self.userInfo.money, {duration: 800}).runEffect();
        _self.changeNumberEffect(_self.resultText, 0, {duration: 800}).runEffect();
        _self.setTextEffect(_self.supportText, "").runEffect();
        _self.moveChipEffect(0).runEffect();
        currentWin = 0;
        gameTurn = 0;
        this.buttonSpin.show();
        this.doubleButton.hide();
        this.doubleButton._disabled = false;
        this.doubleButton.addClass('disabled');
        this.getWinButton._disabled = true;
        this.getWinButton.removeClass('active');
        this.virtualCardsList.forEach(function (item, index) {
            item._active = false;
            item.removeClass("active");
        });
    };

    p.doubleTurn = function (data) {
        var _self = this;
        if (_self.status !== "pause")
            _self.changeStatus("pause");
        gameTurn = 3;
        var supportTextEffect = this.setTextEffect(this.supportText, "Chọn quân bài cao hơn").runEffect();
        var hightlightHoldCards = this.hightlightHoldCards([]).runEffect();
        this.doubleButton._disabled = true;
        this.doubleButton.addClass('disabled');
        this.getWinButton._disabled = true;
        this.getWinButton.removeClass('active');
        currentCardList.forEach(function (item, index) {
            item.unHightLight();
            item.UnOverlay();
            if (index == 0) {
                item.isOpened = true;
                item.openCard(data.cardId, TWIST.Card.miniPoker);
            } else {
                item.upSideDown(TWIST.Card.miniPoker);
            }
        });

    };

    p.runNextEffect = function () {
        var effectArray = effectQueue[currentEffectTurn];
        if (!effectArray || !effectArray.length)
            return;
        function _runEffect() {
            numberEffectCompleted = 0;
            for (var i = 0; i < effectArray.length; i++) {
                effectArray[i].runEffect();
            }
        }
        if (effectArray.oneTime) {
            if (effectArray.done) {
                currentEffectTurn++;
                if (currentEffectTurn == effectQueue.length) {
                    if (repeatEffectQueue) {
                        currentEffectTurn = 0;
                    } else {
                        this.changeStatus("pause");
                    }
                }
                if (this.status === "effecting") {
                    this.runNextEffect();
                }
            } else {
                _runEffect();
            }
        } else {
            var timeOut = setTimeout(_runEffect, 300);
            timeOutList.push(timeOut);
        }
    };

    p.endEffect = function () {
        numberEffectCompleted++;
        if (numberEffectCompleted == (effectQueue[currentEffectTurn] && effectQueue[currentEffectTurn].length)) {
            if (effectQueue[currentEffectTurn].oneTime)
                effectQueue[currentEffectTurn].done = true;
            currentEffectTurn++;
            if (currentEffectTurn == effectQueue.length) {
                if (repeatEffectQueue) {
                    currentEffectTurn = 0;
                } else {
                    this.changeStatus("pause");
                }
            }
            if (this.status === "effecting") {
                this.runNextEffect();
            }
        }
    };

    p.createSlotItem = function (value, state) {
        var _self = this;
        var slotItem = new createjs.Container();

        var bg = new TWIST.Card(value);
        if (value > 51) {
            value -= 52;
            bg.bg.sourceRect = {
                width: TWIST.Card.size.width,
                height: 152,
                x: TWIST.Card.size.width * (9 + value),
                y: TWIST.Card.size.height * 4
            };
        }

        bg.set({
            scaleX: TWIST.Card.miniPoker.scale,
            scaleY: TWIST.Card.miniPoker.scale,
            x: (itemSize.width - TWIST.Card.miniPoker.width) / 2,
            y: (itemSize.height - TWIST.Card.miniPoker.scale * TWIST.Card.size.height) / 2
        });
        slotItem.addChild(bg);
        slotItem.set({
            x: 0,
            y: itemSize.height * state,
            state: state
        });

        slotItem.goNextStep = function () {
            var newY = itemSize.height * this.state;
            this.set({y: newY});
        };
        return slotItem;
    };

    p.changeNumberEffect = function (el, newValue, options) {
        var jElement = $(el);
        var _self = this;

        jElement.newValue = newValue;
        jElement.options = options;

        jElement.runEffect = function () {
            jElement.finish();
            jElement.isDone = true;
            var oldValue = this.text();
            var newOptions = {
                duration: 1000,
                step: function (now) {
                    jElement.text(Global.numberWithDot(Math.ceil(now)));
                },
                done: function () {
                    jElement.endEffect();
                }
            };
            $.extend(newOptions, jElement.options);
            oldValue = parseInt(oldValue.replace(/\./g, ""));
            if (isNaN(oldValue))
                oldValue = 0;
            this.prop('Counter', oldValue).animate({
                Counter: jElement.newValue
            }, newOptions);
        };

        jElement.endEffect = function () {
            jElement.finish();
            if (this.isTracking) {
                this.isTracking = false;
                _self.emit("endEffect");
            }
        };

        return jElement;
    };

    p.setTextEffect = function (el, newValue) {
        var jElement = $(el);
        var _self = this;

        jElement.newValue = newValue;

        jElement.runEffect = function () {
            jElement.isDone = false;
            jElement.text(newValue);
        };

        jElement.endEffect = function () {
            jElement.text("");
            jElement.isDone = true;
            if (this.isTracking) {
                this.isTracking = false;
                _self.emit("endEffect");
            }
        };

        return jElement;
    };

    p.explodePotEffect = function () {
        var _self = this;
        var jElement = $('#effect .explorer-pot');
        var firstTime = new Date();
        jElement.runEffect = function () {
            jElement.isDone = false;
            this.show();
        };
        jElement.click(function () {
            jElement.endEffect();
        });
        jElement.endEffect = function () {
            this.hide();
            this.isDone = true;
            if (this.isTracking) {
                this.isTracking = false;
                _self.emit("endEffect");
            }
        };

        return jElement;
    };

    p.hightlightWinRank = function (code) {
        var _self = this;

        var rankItem = this.resultItemList.find(function (item, index) {
            return item.code == code;
        });

        var jElement = rankItem ? rankItem.template : $('<div></div>');

        jElement.runEffect = function () {
            jElement.isDone = false;
            jElement.addClass('active');
            if (this.isTracking) {
                this.isTracking = false;
                _self.emit("endEffect");
            }
        };

        jElement.endEffect = function () {
            jElement.removeClass('active');
            jElement.isDone = true;
        };

        return jElement;
    };

    p.hightLightWinCards = function (cardList) {
        var _self = this;

        var cardListTemlate = [];

        for (var i = 0; i < gameSize.x; i++) {
            var card = currentCardList[i];
            card.active = cardList[i];
            card.border.sourceRect.x = TWIST.Card.size.width * 4;
            cardListTemlate.push(card);
        }

        cardListTemlate.runEffect = function () {
            cardListTemlate.isDone = false;
            cardListTemlate.forEach(function (item, index) {
                if (parseInt(item.active)) {
                    item.hightLight();
                } else {
                    item.Overlay();
                }
            });
            if (this.isTracking) {
                this.isTracking = false;
                _self.emit("endEffect");
            }
        };

        cardListTemlate.endEffect = function () {
            cardListTemlate.forEach(function (item, index) {
                if (parseInt(item.active)) {
                    item.unHightLight();
                } else {
                    item.UnOverlay();
                }
            });
            cardListTemlate.isDone = true;
        };

        return cardListTemlate;
    };

    p.showResultText = function (cardListRank, rankOfVerticalGroup) {
        var _self = this;

        var resultItem = this.options.resultTab.find(function (item, index) {
            return item.code == cardListRank;
        });
        var rankItem = cardRankList.find(function (item, index) {
            return item.value == rankOfVerticalGroup;
        });
        var resultText = resultItem.name;
        if ((resultItem.code == 3 || resultItem.code == 7 || resultItem.code == 9) && rankItem) {
            resultText = resultText + " " + rankItem.name;
            if (resultItem.code == 9) {
                resultText = "Đôi " + rankItem.name;
            }
        }
        this.resultText.text(resultText);

        var showResultText = {};

        showResultText.runEffect = function () {
            showResultText.isDone = false;
            _self.resultText.text(resultText);
            if (this.isTracking) {
                this.isTracking = false;
                _self.emit("endEffect");
            }
        };

        showResultText.endEffect = function () {
            _self.resultText.text("");
            showResultText.isDone = true;
        };

        return showResultText;
    };

    p.explodePotEffect = function () {
        var _self = this;
        var jElement = this.explodePot;
        var firstTime = new Date();
        jElement.runEffect = function () {
            this.isDone = false;
            this.show();
        };
        jElement.click(function () {
            jElement.endEffect();
        });
        jElement.endEffect = function () {
            this.hide();
            this.isDone = true;
            if (this.isTracking) {
                this.isTracking = false;
                _self.emit("endEffect");
            }
        };

        return jElement;
    };

    p.moveChipEffect = function (plus) {
        var _self = this;
        var jElement = this.moveChip;
        var firstTime = new Date();
        jElement.runEffect = function () {
            this.isDone = true;
            this.removeClass('plus decrease');
            var className = plus ? "plus" : "decrease";
            this.removeClass('plus decrease');
            this.show();
            jElement.find('i').show();
            this.addClass(className);
            jElement.find('i').each(function (index) {
                var item = this;
                $(this).one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function () {
                    $(this).hide();
                });
            });
        };

        jElement.endEffect = function () {
            if (this.isTracking) {
                this.isTracking = false;
                _self.emit("endEffect");
            }
        };

        return jElement;
    };

    p.showSessionId = function (sessionId) {
        this.sessionId.text(sessionId);
    };

    TWIST.VideoPoker = VideoPoker;

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