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
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      if (parts[1])
        parts[1] = parts[1].substring(0, 3);
      var returnSting = parts.join(".");
      while ((returnSting.length > parts[0].length || parts[0].length <= 3) && returnSting.length > 3) {
        returnSting = returnSting.substring(0, returnSting.length - 1);
      }
      if (returnSting[returnSting.length - 1] == '.') {
        returnSting = returnSting.substring(0, returnSting.length - 1);
      }
      return returnSting;
    },
    numberWithDot2: function (number) {
      if (isNaN(number)) {
        return number;
      } else {
        var displayNumber, character;
        var numberAbs = Math.abs(number)
        if (numberAbs >= 100000000) {
          displayNumber = Global.numberWithDot(Math.floor(numberAbs / 1000000));
          character = "M";
        } else if (numberAbs >= 1000) {
          displayNumber = Global.numberWithDot(Math.floor(numberAbs / 1000));
          character = "K";
        } else {
          displayNumber = Global.numberWithDot(numberAbs);
          character = "";
        }
        if (number < 0) {
          displayNumber = "-" + displayNumber;
        }
        return displayNumber + character;
      }
    },
    numberWithDot3: function (number) {
      if (isNaN(number)) {
        return number;
      } else {
        var displayNumber, character;
        var numberAbs = Math.abs(number);
        if (numberAbs >= 1000000) {
          displayNumber = Global.numberWithDot(numberAbs / 1000000);
          character = "M";
        } else if (numberAbs >= 1000) {
          displayNumber = Global.numberWithDot(numberAbs / 1000);
          character = "K";
        } else {
          displayNumber = Global.numberWithDot(numberAbs);
          character = "";
        }
        if (number < 0) {
          displayNumber = "-" + displayNumber;
        }
        return displayNumber + character;
      }
    },
    shuffle: function (array) {
      var currentIndex = array.length, temporaryValue, randomIndex;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
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

  var initSettings = {
    volume: 1
  };

  function Sound() {
    this._isInited = false;
    this.settings;
    this._queue = [];
  }

  var p = Sound.prototype;

  p.init = function (options) {
    options = options || {};
    this.settings = options && options.settings || {};
    var src = ((options && options.assetPath) || TWIST.assetPath || '../src/themes/gb-web/') + 'sounds/';
    createjs.Sound.registerSounds(this._sounds, src);
    this._isInited = true;
  };


  p.play = function (src, options) {
    // This is fired for each sound that is registered.
    if (!this._isInited)
      return;
//    if(src instanceof Array){
//      this.playQueue(src, options);
//      return;
//    }
    var instance = createjs.Sound.play(src, options);  // play using id.  Could also use full source path or event.src.
    instance.volume = (typeof this.settings.volume === "undefined") ? 1 : this.settings.volume;
    return instance;
  };

  p.playQueue = function (srcs, options) {
    var _self = this;
    var playerIndex = 0;
    playIndexSrc(playerIndex);
        
    function playIndexSrc(index) {
      if(!srcs[playerIndex]) return;
      var instance = _self.play(srcs[playerIndex], options);
      instance.on("complete", function () {
        playerIndex++;
        playIndexSrc(playerIndex);
      });
    }
  };

  p.stop = function (src) {
    createjs.Sound.stop(src);  //
  };

  p._sounds = [{id: 'card/chia_bai', src: 'card/chia_bai.ogg'},
    {id: 'card/danh_bai', src: 'card/danh_bai.ogg'},
    {id: 'card/open_card', src: 'card/open_card.ogg'},
    {id: 'chip/call2', src: 'chip/call2.ogg'},
    {id: 'chip/multichip', src: 'chip/multichip.ogg'},
    {id: 'chip/singlechip', src: 'chip/singlechip.ogg'},
    {id: 'inroomgame/join_room', src: 'inroomgame/join_room.ogg'},
    {id: 'minigame/BetChips', src: 'minigame/BetChips.ogg'},
    {id: 'minigame/bonus_spin', src: 'minigame/bonus_spin.ogg'},
    {id: 'minigame/BoostWin', src: 'minigame/BoostWin.ogg'},
    {id: 'minigame/ButtonClick', src: 'minigame/ButtonClick.ogg'},
    {id: 'minigame/coin_spin', src: 'minigame/coin_spin.ogg'},
    {id: 'minigame/CollectChips', src: 'minigame/CollectChips.ogg'},
    {id: 'minigame/Common_Click', src: 'minigame/Common_Click.ogg'},
    {id: 'minigame/Common_Popup', src: 'minigame/Common_Popup.ogg'},
    {id: 'minigame/DoubleOrNothing', src: 'minigame/DoubleOrNothing.ogg'},
    {id: 'minigame/FlipCard', src: 'minigame/FlipCard.ogg'},
    {id: 'minigame/FlyingCard', src: 'minigame/FlyingCard.ogg'},
    {id: 'minigame/GotLevelUp', src: 'minigame/GotLevelUp.ogg'},
    {id: 'minigame/HoldCard', src: 'minigame/HoldCard.ogg'},
    {id: 'minigame/Nhac nen khi quay chiec non ky dieu 1 - CNKD', src: 'minigame/Nhac nen khi quay chiec non ky dieu 1 - CNKD.ogg'},
    {id: 'minigame/NormalWin', src: 'minigame/NormalWin.ogg'},
    {id: 'minigame/quay bai', src: 'minigame/quay bai.ogg'},
    {id: 'minigame/slot_result', src: 'minigame/slot_result.ogg'},
    {id: 'minigame/_GameTheme', src: 'minigame/_GameTheme.ogg'},
    {id: 'rotate/lucky_wheel', src: 'rotate/lucky_wheel.ogg'},
    {id: 'status/losing', src: 'status/losing.ogg'},
    {id: 'status/winning', src: 'status/winning.ogg'},
    {id: 'news/ahihi', src: 'news/ahihi.ogg'},
    {id: 'news/anhoidatcuoc', src: 'news/anhoidatcuoc.ogg'},
    {id: 'news/anroi', src: 'news/anroi.ogg'},
    {id: 'news/bat', src: 'news/bat.ogg'},
    {id: 'news/batdaudatcuoc', src: 'news/batdaudatcuoc.ogg'},
    {id: 'news/bellopen', src: 'news/bellopen.ogg'},
    {id: 'news/betS', src: 'news/betS.ogg'},
    {id: 'news/bich', src: 'news/bich.ogg'},
    {id: 'news/boba', src: 'news/boba.ogg'},
    {id: 'news/boi', src: 'news/boi.ogg'},
    {id: 'news/call2', src: 'news/call2.ogg'},
    {id: 'news/cao', src: 'news/cao.ogg'},
    {id: 'news/chan', src: 'news/chan.ogg'},
    {id: 'news/chia_bai', src: 'news/chia_bai.ogg'},
    {id: 'news/choithiepchu', src: 'news/choithiepchu.ogg'},
    {id: 'news/choitiepchu', src: 'news/choitiepchu.ogg'},
    {id: 'news/chuon', src: 'news/chuon.ogg'},
    {id: 'news/chuyen_view', src: 'news/chuyen_view.ogg'},
    {id: 'news/co', src: 'news/co.ogg'},
    {id: 'news/countDownS', src: 'news/countDownS.ogg'},
    {id: 'news/culu', src: 'news/culu.ogg'},
    {id: 'news/cuu', src: 'news/cuu.ogg'},
    {id: 'news/dam', src: 'news/dam.ogg'},
    {id: 'news/danh_bai', src: 'news/danh_bai.ogg'},
    {id: 'news/datcuocdianh', src: 'news/datcuocdianh.ogg'},
    {id: 'news/ddungdatcuoc', src: 'news/ddungdatcuoc.ogg'},
    {id: 'news/den', src: 'news/den.ogg'},
    {id: 'news/denthoidovanthe', src: 'news/denthoidovanthe.ogg'},
    {id: 'news/do', src: 'news/do.ogg'},
    {id: 'news/doi', src: 'news/doi.ogg'},
    {id: 'news/dong', src: 'news/dong.ogg'},
    {id: 'news/donghoa', src: 'news/donghoa.ogg'},
    {id: 'news/DoubleOrNothing', src: 'news/DoubleOrNothing.ogg'},
    {id: 'news/dungdatcuoc', src: 'news/dungdatcuoc.ogg'},
    {id: 'news/end_vongquay', src: 'news/end_vongquay.ogg'},
    {id: 'news/gia', src: 'news/gia.ogg'},
    {id: 'news/haidoi', src: 'news/haidoi.ogg'},
    {id: 'news/join_room', src: 'news/join_room.ogg'},
    {id: 'news/khongan', src: 'news/khongan.ogg'},
    {id: 'news/laithangroi', src: 'news/laithangroi.ogg'},
    {id: 'news/le', src: 'news/le.ogg'},
    {id: 'news/losing', src: 'news/losing.ogg'},
    {id: 'news/luc', src: 'news/luc.ogg'},
    {id: 'news/lucky_wheel', src: 'news/lucky_wheel.ogg'},
    {id: 'news/mini_betchip', src: 'news/mini_betchip.ogg'},
    {id: 'news/mini_caothapRoutate', src: 'news/mini_caothapRoutate.ogg'},
    {id: 'news/mini_clickButton', src: 'news/mini_clickButton.ogg'},
    {id: 'news/mini_flyCard', src: 'news/mini_flyCard.ogg'},
    {id: 'news/mini_holdCard', src: 'news/mini_holdCard.ogg'},
    {id: 'news/mini_nohu', src: 'news/mini_nohu.ogg'},
    {id: 'news/mini_route', src: 'news/mini_route.ogg'},
    {id: 'news/mini_slotLost', src: 'news/mini_slotLost.ogg'},
    {id: 'news/mobat', src: 'news/mobat.ogg'},
    {id: 'news/moidatcuoc', src: 'news/moidatcuoc.ogg'},
    {id: 'news/multichip', src: 'news/multichip.ogg'},
    {id: 'news/ngu', src: 'news/ngu.ogg'},
    {id: 'news/ngua4', src: 'news/ngua4.ogg'},
    {id: 'news/nhat', src: 'news/nhat.ogg'},
    {id: 'news/nhi', src: 'news/nhi.ogg'},
    {id: 'news/nohu', src: 'news/nohu.ogg'},
    {id: 'news/NormalWin', src: 'news/NormalWin.ogg'},
    {id: 'news/open_card', src: 'news/open_card.ogg'},
    {id: 'news/ro', src: 'news/ro.ogg'},
    {id: 'news/sanh', src: 'news/sanh.ogg'},
    {id: 'news/sanhrong', src: 'news/sanhrong.ogg'},
    {id: 'news/sanhtoi', src: 'news/sanhtoi.ogg'},
    {id: 'news/singlechip', src: 'news/singlechip.ogg'},
    {id: 'news/so_0', src: 'news/so_0.ogg'},
    {id: 'news/so_1', src: 'news/so_1.ogg'},
    {id: 'news/so_10', src: 'news/so_10.ogg'},
    {id: 'news/so_15', src: 'news/so_15.ogg'},
    {id: 'news/so_16', src: 'news/so_16.ogg'},
    {id: 'news/so_17', src: 'news/so_17.ogg'},
    {id: 'news/so_18', src: 'news/so_18.ogg'},
    {id: 'news/so_2', src: 'news/so_2.ogg'},
    {id: 'news/so_3', src: 'news/so_3.ogg'},
    {id: 'news/so_4', src: 'news/so_4.ogg'},
    {id: 'news/so_5', src: 'news/so_5.ogg'},
    {id: 'news/so_6', src: 'news/so_6.ogg'},
    {id: 'news/so_7', src: 'news/so_7.ogg'},
    {id: 'news/so_8', src: 'news/so_8.ogg'},
    {id: 'news/so_9', src: 'news/so_9.ogg'},
    {id: 'news/so_at', src: 'news/so_at.ogg'},
    {id: 'news/so_j', src: 'news/so_j.ogg'},
    {id: 'news/so_k', src: 'news/so_k.ogg'},
    {id: 'news/so_q', src: 'news/so_q.ogg'},
    {id: 'news/so_xi', src: 'news/so_xi.ogg'},
    {id: 'news/space', src: 'news/space.ogg'},
    {id: 'news/tai', src: 'news/tai.ogg'},
    {id: 'news/tam', src: 'news/tam.ogg'},
    {id: 'news/tattay', src: 'news/tattay.ogg'},
    {id: 'news/tep', src: 'news/tep.ogg'},
    {id: 'news/thang', src: 'news/thang.ogg'},
    {id: 'news/thapj', src: 'news/thapj.ogg'},
    {id: 'news/thaps', src: 'news/thaps.ogg'},
    {id: 'news/thats', src: 'news/thats.ogg'},
    {id: 'news/thu', src: 'news/thu.ogg'},
    {id: 'news/thua', src: 'news/thua.ogg'},
    {id: 'news/thuaroi', src: 'news/thuaroi.ogg'},
    {id: 'news/thung', src: 'news/thung.ogg'},
    {id: 'news/thungphasanh', src: 'news/thungphasanh.ogg'},
    {id: 'news/tong', src: 'news/tong.ogg'},
    {id: 'news/tu', src: 'news/tu.ogg'},
    {id: 'news/tuquy', src: 'news/tuquy.ogg'},
    {id: 'news/tyquy', src: 'news/tyquy.ogg'},
    {id: 'news/winning', src: 'news/winning.ogg'},
    {id: 'news/xam', src: 'news/xam.ogg'},
    {id: 'news/xamco', src: 'news/xamco.ogg'},
    {id: 'news/xap1', src: 'news/xap1.ogg'},
    {id: 'news/xap2', src: 'news/xap2.ogg'},
    {id: 'news/xap3', src: 'news/xap3.ogg'},
    {id: 'news/xap4', src: 'news/xap4.ogg'},
    {id: 'news/xiu', src: 'news/xiu.ogg'},
    {id: 'news/yeah', src: 'news/yeah.ogg'},
    {id: 'tone/bellopen', src: 'tone/bellopen.ogg'},
    {id: 'tone/chuyen_view', src: 'tone/chuyen_view.ogg'},
    {id: 'tone/end_vongquay', src: 'tone/end_vongquay.ogg'}, ]

  TWIST.Sound = new Sound();
})();



this.TWIST = this.TWIST || {};

(function () {
    "use strict";

    TWIST.Observer = new EventEmitter();
    TWIST.Observer._canvasList = [];
    TWIST.imagePath = '../src/themes/jarvanIV/images/';
    
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
;(function() { window.TWIST = window.TWIST || {}; TWIST.HTMLTemplate = {'canvas':'<canvas class="gameCanvas" width="1280" height="720" ></canvas>',
'errorPanel':'<div class="error-panel">\r\n    \r\n</div>',
'buttonBar/callSamButton':'<div class="button fourth blue" id="call-sam">B\xE1o s\xE2m</div>',
'buttonBar/eatCardButton':'<div class="button second yellow" id="eat-card">\u0102n</div>',
'buttonBar/entiretyButton':'<div class="button second yellow" id="entirety-card">\xD9</div>',
'buttonBar/foldSamButton':'<div class="button third white" id="fold-sam">B\u1ECF s\xE2m</div>',
'buttonBar/foldTurnButton':'<div class="button second white" id="fold-turn">B\u1ECF l\u01B0\u1EE3t</div>\r\n',
'buttonBar/getCardButton':'<div class="button first blue" id="get-card">B\u1ED1c b\xE0i</div>',
'buttonBar/hitButton':'<div class="button first yellow" id="hit-card">\u0110\xE1nh b\xE0i</div>',
'buttonBar/openCardButton':'<div class="button first blue" id="start-button">B\u1EAFt \u0111\u1EA7u</div>',
'buttonBar/sendCardButton':'<div class="button second blue" id="send-card">G\u1EEDi b\xE0i</div>',
'buttonBar/showPhomButton':'<div class="button second yellow" id="eat-card">H\u1EA1 b\xE0i</div>',
'buttonBar/sortCardButton':'<div class="button third blue" id="sort-card">X\u1EAFp x\u1EBFp</div>',
'buttonBar/startButton':'<div class="button first yellow" id="start-button">B\u1EAFt \u0111\u1EA7u</div>',
'buttonBar/wrapper':'<div class="button-bar"></div>',
'cheater/wrapper':'<div class="cheater">\r\n    <div class="cheat-backgound"></div>\r\n    <div class="cheat-options">\r\n        <label>\r\n            <input id="showPlayerCards" type="checkbox" checked="true"/>\r\n            Xem b\xE0i\r\n        </label>\r\n        <label>\r\n            <input id="hightCards" type="radio" name="cheatType"/>\r\n            B\xE0i cao\r\n        </label>\r\n        <label>\r\n            <input id="hasGun" type="radio" name="cheatType"/>\r\n            C\xF3 h\xE0ng\r\n        </label>\r\n        <label>\r\n            <input id="whiteVictory" type="radio" name="cheatType"/>\r\n            \u0102n tr\u1EAFng\r\n        </label>\r\n        <label>\r\n            <input id="noCheat" type="radio" name="cheatType"/>\r\n            Kh\xF4ng cheat\r\n        </label>\r\n        <label>\r\n            <input id="hasFixedCards" type="checkbox"/>\r\n            Ch\u1EE9a list b\xE0i c\u1ED1 \u0111\u1ECBnh\r\n        </label>\r\n    </div>\r\n    <div class="card-button-list" > \r\n        \r\n    </div>\r\n    <div class="random-card-list" > \r\n        \r\n    </div>\r\n    <div class="fix-card-list" > \r\n        \r\n    </div>\r\n    <div class="total-cheat-card-list" > \r\n        \r\n    </div>\r\n</div>',
'effect/explodePot':'<div class="explorer-pot">\r\n    <span class="effect"></span>\r\n    <span class="txt"></span>\r\n</div>\r\n<div class="money-falling">\r\n    <div class="text-light pos-1">\r\n        <i class="l-obj lobj-1"></i>\r\n        <i class="l-obj lobj-2"></i>\r\n        <i class="l-obj lobj-3"></i>\r\n        <i class="l-obj lobj-4"></i>\r\n        <i class="l-obj lobj-5"></i>\r\n        <i class="l-obj lobj-6"></i>\r\n        <i class="l-obj lobj-7"></i>\r\n        <i class="l-obj lobj-8"></i>\r\n    </div>\r\n    <div class="text-light pos-2">\r\n        <i class="l-obj lobj-1"></i>\r\n        <i class="l-obj lobj-2"></i>\r\n        <i class="l-obj lobj-3"></i>\r\n        <i class="l-obj lobj-4"></i>\r\n        <i class="l-obj lobj-5"></i>\r\n        <i class="l-obj lobj-6"></i>\r\n        <i class="l-obj lobj-7"></i>\r\n        <i class="l-obj lobj-8"></i>\r\n    </div>\r\n    <div class="text-light pos-3">\r\n        <i class="l-obj lobj-1"></i>\r\n        <i class="l-obj lobj-2"></i>\r\n        <i class="l-obj lobj-3"></i>\r\n        <i class="l-obj lobj-4"></i>\r\n        <i class="l-obj lobj-5"></i>\r\n        <i class="l-obj lobj-6"></i>\r\n        <i class="l-obj lobj-7"></i>\r\n        <i class="l-obj lobj-8"></i>\r\n    </div>\r\n    <div class="text-light pos-4">\r\n        <i class="l-obj lobj-1"></i>\r\n        <i class="l-obj lobj-2"></i>\r\n        <i class="l-obj lobj-3"></i>\r\n        <i class="l-obj lobj-4"></i>\r\n        <i class="l-obj lobj-5"></i>\r\n        <i class="l-obj lobj-6"></i>\r\n        <i class="l-obj lobj-7"></i>\r\n        <i class="l-obj lobj-8"></i>\r\n    </div>\r\n</div>',
'effect/wrapper':'<div class="effect"></div>',
'hightLow/bottom':'<div class="bottom">\r\n    <div class="profile-hight-low">\r\n\r\n    </div>\r\n    <div class="chips-hight-low">\r\n\r\n    </div>\r\n    <div class="new-turn-button">L\u01B0\u1EE3t m\u1EDBi</div>\r\n</div>\r\n',
'hightLow/center':'<div class="center">\r\n    <div class="text-support">Qu\xE2n b\xE0i ti\u1EBFp theo l\xE0 cao hay th\u1EA5p ?</div>\r\n    <div class="remain-time"></div>\r\n    <div class="canvas-wrapper">\r\n        <div class="game-button left-button">\r\n            <div class="low-button"></div>\r\n            <div class="low-value">0</div>\r\n        </div>\r\n        <div class="game-button right-button">\r\n            <div class="hight-button"></div>\r\n            <div class="hight-value">0</div>\r\n        </div>\r\n        <div class="virtual-card">\r\n            <div class="new-turn-text">\r\n                B\u1ED1c b\xE0i\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n',
'hightLow/top':'<div class="top">\r\n    <div class="pot">\r\n        <div class="title">H\u0169 th\u01B0\u1EDFng</div>\r\n        <div class="pot-value">0</div>\r\n    </div>\r\n    <div class="bank">\r\n        <div class="title">Bank</div>\r\n        <div class="bank-value">0</div>\r\n    </div>\r\n    <div class="pot-cards">\r\n        <div class="pot-card"></div>\r\n        <div class="pot-card"></div>\r\n        <div class="pot-card"></div>\r\n    </div>\r\n</div>\r\n',
'hightLow/wrapper':'<div class="hight-low"></div>\r\n',
'inviteList/inviteItem':'<div class="invite-item">\r\n    <div class="invite-item-inner"></div>\r\n</div>\r\n',
'inviteList/wrapper':'<div class="invite-wrapper">\r\n    \r\n</div>\r\n',
'resultPanel/card':'<div class="card card<%- id %>"></div>',
'resultPanel/user':'<div class="result-item <%- isWinnerClass %>">\r\n    <div class="result-item-info"> \r\n        <div class="result-item-username"><%- username %> </div>\r\n        <div class="result-item-result-info">\r\n            <span class="result-item-money"><%- moneyChange %></span>\r\n            <div class="user-result-string"x><%- resultText %></div>\r\n        </div>\r\n    </div>\r\n    <div class="result-card-list-container">\r\n        <%= cardList %>\r\n    </div>\r\n</div>',
'resultPanel/wrapper':'<div class="game-result">\r\n    <div class="global-mask"></div>\r\n    <div class="game-result-popup">\r\n        <div class="popup-header">\r\n            <div class="popup-icon"></div> \r\n            <div class="close-popup">X</div>\r\n        </div>\r\n        <div class="popup-content">\r\n            <div class="container">\r\n                <div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>',
'miniPoker/autospin':'<div class="autospin">\r\n    <input id="autospin" type="checkbox" />\r\n    <label for="autospin"></label>\r\n    <span>T\u1EF1 \u0111\u1ED9ng quay</span>\r\n</div>\r\n',
'miniPoker/button':'<div class="button-spin"></div>',
'miniPoker/chips':'<div class="chip-group">\r\n    <div class="chip violet">1K</div>\r\n    <div class="chip green">10k</div>\r\n    <div class="chip blue">100k</div>\r\n</div>\r\n',
'miniPoker/errorPanel':'<div class="error-panel-mini">\r\n    \r\n</div>',
'miniPoker/pot':'<div class="pot">\r\n    H\u0169 th\u01B0\u1EDFng\r\n    <div class="pot-value"></div>\r\n</div>',
'miniPoker/resultItem':'<div class="result-mini-item">\r\n    <span class="icon"></span>\r\n    <%- name %> \r\n    <div class="value"><%- value %> </div>\r\n</div>',
'miniPoker/resultTab':'<div class="result-mini-poker-tab"></div>',
'miniPoker/resultText':'<div class="result-text"></div>',
'miniPoker/sessionId':'<div class="session-id"></div>',
'miniPoker/user':'<div class="profile">\r\n    <div class="profile-left">\r\n        <div class="user avatar" ></div>\r\n    </div>\r\n    <div class="profile-right">\r\n        <div class="username "></div>\r\n        <div class="money "></div>\r\n    </div>\r\n</div>',
'miniPoker/winMoney':'<div class="win-money"></div>',
'miniPoker/wrapper':'<div class="mini-poker-bg"></div>\r\n',
'taiXiu/bettingPosition':'<div class="name"></div>\r\n<div class="ratio"></div>\r\n<div class="betting-number-wrapper">\r\n    <div class="betting-number-inner">\r\n        <div class="mine-betting">\r\n            0\r\n        </div><div class="total-betting">\r\n            0\r\n        </div>\r\n    </div>\r\n</div>\r\n',
'taiXiu/buttons':'<div class="button-bar taixiu-button-bar">\r\n    <div class="button blue  xocdia-button  button-bottom" id="cancelBetting">H\u1EE7y c\u01B0\u1EE3c</div>\r\n    <div class="button orange xocdia-button  button-bottom" id="sellOdd">B\xE1n c\u1EEDa</div>\r\n    <div class="button blue xocdia-button  button-bottom" id="resignation">H\u1EE7y c\xE1i</div>\r\n    <div class="button orange xocdia-button  button-bottom" id="reBetting">\u0110\u1EB7t l\u1EA1i</div>\r\n    <!--<div class="button blue button-top" id="sellEven">B\xE1n c\u1EEDa ch\u1EB5n</div>-->\r\n    <div class="button orange xocdia-button  button-top" id="getHost">Xin c\xE1i</div>\r\n</div>',
'taiXiu/changeMoney':'<div class="change-money"></div>\r\n',
'taiXiu/chips':'<div class="chip-group">\r\n    <div class="chip chip-1st">1</div>\r\n    <div class="chip chip-2nd">2</div>\r\n    <div class="chip chip-3rd">4</div>\r\n    <div class="chip chip-4th">10</div>\r\n</div>\r\n',
'taiXiu/coin-item':'<div class="coin-item"></div>',
'taiXiu/history-item':'<div class="history-item">\r\n    <div class="history-item-number"></div>\r\n    <div class="history-item-type"></div>\r\n    <div class="history-item-dices">\r\n        <div class="history-item-dice" id="dice-position0"></div>\r\n        <div class="history-item-dice" id="dice-position1"></div>\r\n        <div class="history-item-dice" id="dice-position2"></div>\r\n    </div>\r\n</div>\r\n',
'taiXiu/history-old':'<div class="taixiu-history">\r\n    <div class="taixiu-history-title">L\u1ECBch s\u1EED</div>\r\n    <div class="taixiu-history-content">\r\n        <div class="taixiu-history-content-inner"></div>\r\n    </div>\r\n</div> \r\n',
'taiXiu/history':'<div class="history-wrapper">\r\n<!--    <div class="history-odd"></div>\r\n    <div class="history-event"></div>-->\r\n    <div class="history">\r\n    </div>\r\n</div>\r\n',
'taiXiu/host':'<div class="host-wrapper">\r\n    <div class="host-background"></div>\r\n    <div class="host">\r\n        <div class="host-name">\r\n            Doreamon\r\n        </div>\r\n        <div class="chat-box">\r\n            <div class="chat-box-inner">\r\n                Th\u1EDDi gian c\xE1i th\u1EEBa  thi\u1EBFu.  \r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>',
'taiXiu/listPlayer':'<div class="list-player"></div>',
'taiXiu/resultChip':'<div class="result-chip">\r\n    <div class="inner-chip">\r\n        \r\n    </div>\r\n</div>',
'taiXiu/resultChipColumn':'<div class="result-chip-column">\r\n    \r\n</div>',
'taiXiu/sellPopup':'<div class="sell-popup">\r\n    <div class="sell-popup-background"></div>\r\n    <div class="sell-popup-center">\r\n        <div class="sell-popup-title"></div>\r\n        <div class="sell-popup-close"></div>\r\n        <div class="sell-popup-content">\r\n            <div class="sell-popup-minus"></div>\r\n            <div class="sell-popup-plus"></div>\r\n            <div class="sell-popup-dragbar" id="sell-popup-drag-container">\r\n                <div class="sell-popup-dragbar-inner"></div>\r\n                <div class="sell-popup-scroller" id="scroller"> \r\n                    <div class="sell-popup-scroller-content">\r\n                        0 V\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <div class="sell-popup-button-bar">\r\n                <div class="sell-popup-button" id="cancel">H\u1EE6Y B\u1ECE</div>\r\n                <div class="sell-popup-button" id="accept">\u0110\u1ED2NG \xDD</div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>',
'taiXiu/table':'<div class="table">\r\n    \r\n</div>',
'taiXiu/totalTable':'<div class="total-table">\r\n    <div class="total-table-betting">0</div>\r\n    <div class="total-table-win">0</div>\r\n</div>',
'taiXiu/user':'<div class="profile">\r\n    <div class="profile-left">\r\n        <div>\r\n            <div class="username "></div>\r\n            <div class="money "></div>\r\n        </div>\r\n    </div>\r\n    <div class="profile-right">\r\n        <div class="user avatar avatar1" ></div>\r\n    </div>\r\n</div>',
'taiXiu/vitualBetting':'<div class="vitual-betting-position">\r\n</div>\r\n',
'taiXiu/wrapper':'<div class="taixiu-wrapper"></div>',
'tinyHightLow/bottom':'<div class="bottom">\r\n    <div class="profile-hight-low">\r\n\r\n    </div>\r\n    <div class="chips-hight-low">\r\n\r\n    </div>\r\n    <div class="new-turn-button"></div>\r\n    <div class="get-card"></div>\r\n    <div class="button-close"></div>\r\n    <div class="button-history"></div>\r\n    <div class="button-help"></div>\r\n</div>\r\n',
'tinyHightLow/center':'<div class="center">\r\n    <div class="text-support">Qu\xE2n b\xE0i ti\u1EBFp theo l\xE0 cao hay th\u1EA5p ?</div>\r\n    <div class="remain-time"></div>\r\n    <div class="canvas-wrapper">\r\n        <div class="game-button left-button">\r\n            <div class="low-button"></div>\r\n            <div class="low-value">0</div>\r\n        </div>\r\n        <div class="game-button right-button">\r\n            <div class="hight-button"></div>\r\n            <div class="hight-value">0</div>\r\n        </div>\r\n        <div class="virtual-card">\r\n            <div class="new-turn-text">\r\n                B\u1ED1c b\xE0i\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n',
'tinyHightLow/top':'<div class="top">\r\n    <div class="pot">\r\n        <div class="pot-value">0</div>\r\n    </div>\r\n    <div class="bank">\r\n        <div class="bank-value">0</div>\r\n    </div>\r\n    <div class="pot-cards">\r\n        <div class="pot-card"></div>\r\n        <div class="pot-card"></div>\r\n        <div class="pot-card"></div>\r\n    </div>\r\n</div>\r\n',
'tinyHightLow/wrapper':'<div class="tiny-hight-low tiny-mini-poker-bg "></div>\r\n',
'tinyMiniPoker/autospin':'<div class="autospin">\r\n    <input id="autospin" type="checkbox" />\r\n    <label for="autospin"></label>\r\n    <span>T\u1EF1 \u0111\u1ED9ng quay</span>\r\n</div>\r\n',
'tinyMiniPoker/buttonClose':'<div class="button-close"></div>',
'tinyMiniPoker/buttonHelp':'<div class="button-help"></div>',
'tinyMiniPoker/buttonHistory':'<div class="button-history"></div>',
'tinyMiniPoker/buttonSpin':'<div class="button-spin"></div>',
'tinyMiniPoker/canvasWrapper':'<div class="tinyMiniPokerCanvasSVG">\r\n    <svg height="0" width="0">\r\n    <defs>\r\n    <clipPath id="tinyMiniPokerCanvasSVG">\r\n        <path d="M138.891,4.438H617.9A153.257,153.257,0,0,1,771.156,157.7V262.952a9.579,9.579,0,0,1-9.579,9.579H138.891A134.047,134.047,0,0,1,4.844,138.484v0A134.047,134.047,0,0,1,138.891,4.438Z"/>\r\n    </clipPath>\r\n    </defs>\r\n    </svg>\r\n\r\n</div> \r\n',
'tinyMiniPoker/chips':'<div class="chip-group">\r\n    <div class="chip">1K</div>\r\n    <div class="chip">10k</div>\r\n    <div class="chip">100k</div>\r\n\r\n    <svg height="0" width="0">\r\n    <defs>\r\n    <clipPath id="tinyMiniPokerChip1">\r\n        <path d="M92.082,135.187A124.371,124.371,0,0,1,111,101.092c12.027-15.371,13.184-36.546,2.291-52.735L82.239,2.21a212.043,212.043,0,0,0-79.72,99.054Z"/>\r\n    </clipPath>\r\n    <clipPath id="tinyMiniPokerChip2">\r\n        <path d="M98.6,75.669h0a123.988,123.988,0,0,1,6.228-38.849L15.155,2.856a210.943,210.943,0,0,0-2.21,139.306L102.9,108.091A124.187,124.187,0,0,1,98.6,75.669Z"/>\r\n    </clipPath>\r\n    <clipPath id="tinyMiniPokerChip3">\r\n        <path d="M91.954,2.8L2.173,36.8A211.869,211.869,0,0,0,80.741,139.733l31.685-45.111c11.184-15.924,11.2-37.348-.562-52.851A124.156,124.156,0,0,1,91.954,2.8Z" />\r\n    </clipPath>\r\n    </defs>\r\n    </svg>\r\n</div>',
'tinyMiniPoker/errorPanel':'<div class="error-panel-mini">\r\n    \r\n</div>',
'tinyMiniPoker/pot':'<div class="pot">\r\n    H\u0169 th\u01B0\u1EDFng\r\n    <div class="pot-value"></div>\r\n</div>',
'tinyMiniPoker/resultItem':'<div class="result-mini-item">\r\n    <span class="icon"></span>\r\n    <%- name %> \r\n    <div class="value"><%- value %> </div>\r\n</div>',
'tinyMiniPoker/resultTab':'<div class="result-mini-poker-tab"></div>',
'tinyMiniPoker/resultText':'<div class="result-text"></div>',
'tinyMiniPoker/sessionId':'<div class="session-id"></div>',
'tinyMiniPoker/user':'<div class="profile">\r\n    <div class="profile-left">\r\n        <div class="user avatar" ></div>\r\n    </div>\r\n    <div class="profile-right">\r\n        <div class="username "></div>\r\n        <div class="money "></div>\r\n    </div>\r\n</div>',
'tinyMiniPoker/winMoney':'<div class="win-money"></div>',
'tinyMiniPoker/wrapper':'<div class="tiny-mini-poker-bg"></div> \r\n',
'tinyVideoPoker/button':'<div class="button-spin"></div>',
'tinyVideoPoker/buttonClose':'<div class="button-close"></div>',
'tinyVideoPoker/buttonHelp':'<div class="button-help"></div>',
'tinyVideoPoker/buttonHistory':'<div class="button-history"></div>',
'tinyVideoPoker/canvasWrapper':'<div class="tinyVideoPokerCanvasSVG">\r\n    <svg height="0" width="0">\r\n    <defs>\r\n    <clipPath id="tinyVideoPokerCanvasSVG">\r\n        <path d="M138.891,4.438H617.9A153.257,153.257,0,0,1,771.156,157.7V262.952a9.579,9.579,0,0,1-9.579,9.579H138.891A134.047,134.047,0,0,1,4.844,138.484v0A134.047,134.047,0,0,1,138.891,4.438Z"/>\r\n    </clipPath>\r\n    </defs>\r\n    </svg>\r\n\r\n</div> \r\n',
'tinyVideoPoker/chips':'<div class="chip-group">\r\n    <div class="chip">1K</div>\r\n    <div class="chip">10k</div>\r\n    <div class="chip">100k</div>\r\n\r\n    <svg height="0" width="0">\r\n    <defs>\r\n    <clipPath id="tinyMiniPokerChip1">\r\n        <path d="M92.082,135.187A124.371,124.371,0,0,1,111,101.092c12.027-15.371,13.184-36.546,2.291-52.735L82.239,2.21a212.043,212.043,0,0,0-79.72,99.054Z"/>\r\n    </clipPath>\r\n    <clipPath id="tinyMiniPokerChip2">\r\n        <path d="M98.6,75.669h0a123.988,123.988,0,0,1,6.228-38.849L15.155,2.856a210.943,210.943,0,0,0-2.21,139.306L102.9,108.091A124.187,124.187,0,0,1,98.6,75.669Z"/>\r\n    </clipPath>\r\n    <clipPath id="tinyMiniPokerChip3">\r\n        <path d="M91.954,2.8L2.173,36.8A211.869,211.869,0,0,0,80.741,139.733l31.685-45.111c11.184-15.924,11.2-37.348-.562-52.851A124.156,124.156,0,0,1,91.954,2.8Z" />\r\n    </clipPath>\r\n    </defs>\r\n    </svg>\r\n</div>',
'tinyVideoPoker/doubleButton':'<div class="button-spin double-button"></div>',
'tinyVideoPoker/errorPanel':'<div class="error-panel-mini">\r\n    \r\n</div>',
'tinyVideoPoker/getWinButton':'<div class="get-win-button">\r\n    <!--Nh\u1EADn th\u01B0\u1EDFng-->\r\n</div>',
'tinyVideoPoker/moveChip':'<div class="move-chip">\r\n    <i class="chip1"></i>\r\n    <i class="chip2"></i>\r\n    <i class="chip3"></i>\r\n    <i class="chip4"></i>\r\n    <i class="chip5"></i>\r\n    <i class="chip6"></i>\r\n    <i class="chip7"></i>\r\n    <i class="chip8"></i>\r\n</div>',
'tinyVideoPoker/pot':'<div class="pot">\r\n    H\u0169 th\u01B0\u1EDFng\r\n    <div class="pot-value"></div>\r\n</div>',
'tinyVideoPoker/resultItem':'<div class="result-mini-item">\r\n    <span class="icon"></span>\r\n    <%- name %> \r\n    <div class="value"><%- value %> </div>\r\n</div>',
'tinyVideoPoker/resultTab':'<div class="result-mini-poker-tab"></div>',
'tinyVideoPoker/resultText':'<div class="result-text"></div>',
'tinyVideoPoker/sessionId':'<div class="session-id"></div>',
'tinyVideoPoker/supportText':'<div class="support-text"></div>',
'tinyVideoPoker/user':'<div class="profile">\r\n    <div class="profile-left">\r\n        <div class="user avatar" ></div>\r\n    </div>\r\n    <div class="profile-right">\r\n        <div class="username "></div>\r\n        <div class="money "></div>\r\n    </div>\r\n</div>',
'tinyVideoPoker/virtualCards':'<div class="virtualCards">\r\n    <div class="card vitualCard1">\r\n        \r\n    </div>\r\n    <div class="card vitualCard2">\r\n        \r\n    </div>\r\n    <div class="card vitualCard3">\r\n        \r\n    </div>\r\n    <div class="card vitualCard4">\r\n        \r\n    </div>\r\n    <div class="card vitualCard5">\r\n        \r\n    </div>\r\n</div>',
'tinyVideoPoker/wrapper':'<div class="tiny-mini-poker-bg tiny-video-poker"></div>\r\n',
'videoPoker/button':'<div class="button-spin"></div>',
'videoPoker/chips':'<div class="chip-group">\r\n    <div class="chip violet">1K</div>\r\n    <div class="chip green">10k</div>\r\n    <div class="chip blue">100k</div>\r\n</div>\r\n',
'videoPoker/doubleButton':'<div class="button-spin double-button"></div>',
'videoPoker/errorPanel':'<div class="error-panel-mini">\r\n    \r\n</div>',
'videoPoker/getWinButton':'<div class="get-win-button">\r\n    Nh\u1EADn th\u01B0\u1EDFng\r\n</div>',
'videoPoker/moveChip':'<div class="move-chip">\r\n    <i class="chip1"></i>\r\n    <i class="chip2"></i>\r\n    <i class="chip3"></i>\r\n    <i class="chip4"></i>\r\n    <i class="chip5"></i>\r\n    <i class="chip6"></i>\r\n    <i class="chip7"></i>\r\n    <i class="chip8"></i>\r\n</div>',
'videoPoker/pot':'<div class="pot">\r\n    H\u0169 th\u01B0\u1EDFng\r\n    <div class="pot-value"></div>\r\n</div>',
'videoPoker/resultItem':'<div class="result-mini-item">\r\n    <span class="icon"></span>\r\n    <%- name %> \r\n    <div class="value"><%- value %> </div>\r\n</div>',
'videoPoker/resultTab':'<div class="result-mini-poker-tab"></div>',
'videoPoker/resultText':'<div class="result-text"></div>',
'videoPoker/sessionId':'<div class="session-id"></div>',
'videoPoker/supportText':'<div class="support-text"></div>',
'videoPoker/user':'<div class="profile">\r\n    <div class="profile-left">\r\n        <div class="user avatar" ></div>\r\n    </div>\r\n    <div class="profile-right">\r\n        <div class="username "></div>\r\n        <div class="money "></div>\r\n    </div>\r\n</div>',
'videoPoker/virtualCards':'<div class="virtualCards">\r\n    <div class="card vitualCard1">\r\n        \r\n    </div>\r\n    <div class="card vitualCard2">\r\n        \r\n    </div>\r\n    <div class="card vitualCard3">\r\n        \r\n    </div>\r\n    <div class="card vitualCard4">\r\n        \r\n    </div>\r\n    <div class="card vitualCard5">\r\n        \r\n    </div>\r\n</div>',
'videoPoker/wrapper':'<div class="mini-poker-bg video-poker"></div>\r\n',
'xocDia/bettingPosition':'<div class="betting-position">\r\n    <div class="coin-tittle"></div>\r\n    <div class="name"></div>\r\n    <div class="mine-betting">\r\n        0\r\n    </div>\r\n    <div class="total-betting">\r\n        0\r\n    </div>\r\n</div>\r\n',
'xocDia/buttons':'<div class="button-bar xocdia-button-bar">\r\n    <div class="button blue xocdia-button button-bottom" id="cancelBetting">H\u1EE7y c\u01B0\u1EE3c</div>\r\n    <div class="button orange xocdia-button button-bottom" id="sellOdd">B\xE1n c\u1EEDa l\u1EBD</div>\r\n    <div class="button blue xocdia-button button-bottom" id="resignation">H\u1EE7y c\xE1i</div>\r\n    <div class="button orange xocdia-button button-top" id="reBetting">\u0110\u1EB7t l\u1EA1i</div>\r\n    <div class="button orange xocdia-button button-top" id="sellEven">B\xE1n c\u1EEDa ch\u1EB5n</div>\r\n    <div class="button orange xocdia-button button-top" id="getHost">Xin c\xE1i</div>\r\n</div>',
'xocDia/changeMoney':'<div class="change-money"></div>\r\n',
'xocDia/chips':'<div class="chip-group">\r\n    <div class="chip chip-1st">1</div>\r\n    <div class="chip chip-2nd">2</div>\r\n    <div class="chip chip-3rd">4</div>\r\n    <div class="chip chip-4th">10</div>\r\n</div>\r\n',
'xocDia/coin-item':'<div class="coin-item"></div>',
'xocDia/history':'<div class="history-wrapper">\r\n<!--    <div class="history-odd"></div>\r\n    <div class="history-event"></div>-->\r\n    <div class="history">\r\n    </div>\r\n</div>\r\n',
'xocDia/host':'<div class="host-wrapper">\r\n    <div class="host-background"></div>\r\n    <div class="host">\r\n        <div class="host-name">\r\n            Doreamon\r\n        </div>\r\n        <div class="chat-box">\r\n            <div class="chat-box-inner">\r\n                Th\u1EDDi gian c\xE1i th\u1EEBa  thi\u1EBFu.  \r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>',
'xocDia/listPlayer':'<div class="list-player">1</div>',
'xocDia/resultChip':'<div class="result-chip">\r\n    <div class="inner-chip">\r\n        \r\n    </div>\r\n</div>',
'xocDia/resultChipColumn':'<div class="result-chip-column">\r\n    \r\n</div>',
'xocDia/sellPopup':'<div class="sell-popup">\r\n    <div class="sell-popup-background"></div>\r\n    <div class="sell-popup-center">\r\n        <div class="sell-popup-title"></div>\r\n        <div class="sell-popup-close"></div>\r\n        <div class="sell-popup-content">\r\n            <div class="sell-popup-minus"></div>\r\n            <div class="sell-popup-plus"></div>\r\n            <div class="sell-popup-dragbar" id="sell-popup-drag-container">\r\n                <div class="sell-popup-dragbar-inner"></div>\r\n                <div class="sell-popup-scroller" id="scroller"> \r\n                    <div class="sell-popup-scroller-content">\r\n                        0 V\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <div class="sell-popup-button-bar">\r\n                <div class="sell-popup-button" id="cancel">H\u1EE6Y B\u1ECE</div>\r\n                <div class="sell-popup-button" id="accept">\u0110\u1ED2NG \xDD</div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>',
'xocDia/totalTable':'<div class="total-table">\r\n    <div class="total-table-betting">0</div>\r\n    <div class="total-table-win">0</div>\r\n</div>',
'xocDia/user':'<div class="profile">\r\n    <div class="profile-left">\r\n        <div>\r\n            <div class="username "></div>\r\n            <div class="money "></div>\r\n        </div>\r\n    </div>\r\n    <div class="profile-right">\r\n        <div class="user avatar avatar1" ></div>\r\n    </div>\r\n</div>',
'xocDia/vitualBetting':'<div class="vitual-betting-position">\r\n</div>\r\n',
'xocDia/wrapper':'<div class="xocdia-wrapper"></div>',}})();
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
  Card.userCard = {width: 90, height: 123, cardDraggable: true, selectedHeight: 20, scale: 0.6, seperator: 91};
  Card.userCard.scale = Card.userCard.width / Card.size.width;
  Card.playerCard = {width: 45, height: 61.5, seperator: 0, cardDraggable: false, scale: 0.33};
  Card.playerCard.scale = Card.playerCard.width / Card.size.width;
  Card.deckCard = {width: 45, height: 61.5, seperator: 0.1};
  Card.deckCard.scale = Card.deckCard.width / Card.size.width;
  Card.draftCard = {width: 45, height: 61.5, seperator: 46};
  Card.draftCard.scale = Card.draftCard.width / Card.size.width;
  Card.demlaDraftCard = {width: 70, height: 95, seperator: 72};
  Card.demlaDraftCard.scale = Card.demlaDraftCard.width / Card.size.width;
  Card.phomDraftCard = {width: 64, height: 82, seperator: 67};
  Card.phomDraftCard.scale = Card.phomDraftCard.width / Card.size.width;
  Card.threeCards = {width: 54, height: 73.8, seperator: 55, scale: 0.6};
  Card.threeCards.scale = Card.threeCards.width / Card.size.width;
  Card.threeCardsBanker = {width: 63, height: 86.1, seperator: 64, scale: 0.7};
  Card.threeCardsBanker.scale = Card.threeCardsBanker.width / Card.size.width;
  Card.miniPoker = {width: 115, height: 153};
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
    this._init();
    this.setValue(value);
  };
  p._init = function () {
    var cards = new Image();
    this.image = cards;
    cards.src = (TWIST.imagePath || imagePath) + 'card/cards.png';
    var bg = new createjs.Bitmap(cards);
    this.bg = bg;
    bg.sourceRect = $.extend({}, Card.size);
    bg.sourceRect.x = 0;
    bg.sourceRect.y = Card.size.height * Card.SuitNameMap.length;

    this.inPhom = new createjs.Bitmap(cards);
    this.inPhom.sourceRect = {
      width: 25,
      height: 25,
      x: 100,
      y: 524
    };
    this.inPhom.set({
      x: 55,
      y: 10
    });
    this.inPhom.visible = false;

    this.eatEffect = this.border = new createjs.Bitmap(cards);
    this.eatEffect.sourceRect = {
      width: Card.size.width + 4,
      height: Card.size.height + 3,
      x: Card.size.width * 2,
      y: Card.size.height * Card.SuitNameMap.length
    };
    this.eatEffect.set({
      x: -2,
      y: -1.5
    });
    this.eatEffect.visible = this.showEatEffect;

    this.addChild(bg, this.inPhom, this.eatEffect);
  };
  p.setValue = function (value) {
    var rankSuite = getRankSuite(value);
    this.cardValue = value;
    this.rank = rankSuite.rank;
    this.suite = rankSuite.suite;
    var bg = this.bg;
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
  };
  p.getValue = function () {
    return this.cardValue;
  };
  p.removeAllSelected = function () {
    this.parent.children.forEach(function (item, index) {
      item.setSelected(false);
    });
  };
  p.openCard = function (cardValue, cardType) {
    var oldX = this.x;
    var _self = this;
    cardType = cardType || Card.userCard;
    return createjs.Tween.get(this)
            .to({scaleX: 0.1, x: oldX + cardType.width / 2}, 150)
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
          _self.position = curPosition;
        }
      });
      this.addEventListener('pressup', function (evt) {
        if (_self.isDragging) {
          _self.selected = false;
          _self.moveToPosition(_self.position);
          _self.parent.children.sort(function (a, b) {
            return a.position - b.position;
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
    try {
      this.updateCache();
    } catch (e) {
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
    this.showEatEffect = true;
    this.eatEffect.visible = true;
  }
  p.unHightLight = function () {
    this.showEatEffect = false;
    this.eatEffect.visible = false;
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
    4: [{x: 12, y: 560}, {x: 1110, y: 275}, {x: 590, y: 54}, {x: 71, y: 275}],
    2: [{x: 12, y: 560}, {x: 590, y: 54}],
    5: [{x: 12, y: 560}, {x: 1110, y: 275}, {x: 783, y: 54}, {x: 383, y: 54}, {x: 71, y: 275}],
    9: [{x: 380, y: 550}, {x: 970, y: 540}, {x: 1090, y: 320}, {x: 1000, y: 140}, {x: 783, y: 67}, {x: 383, y: 67}, {x: 170, y: 140}, {x: 70, y: 320}, {x: 160, y: 540}],
    6: [{x: 550, y: 550}, {x: 970, y: 540}, {x: 1090, y: 320}, {x: 783, y: 67}, {x: 70, y: 320}, {x: 160, y: 540}]
  };

  Desk.handPositions = {
    center: {x: 150, y: -110, align: 'center'},
    left: {x: -50, y: 20, align: 'left'},
    right: {x: 150, y: -110, align: 'center'}
  };

  Desk.draftPositionList = {
//        4: [{x: 300, y: -70}, {x: -350, y: TWIST.Card.draftCard.height},
//            {x: 50, y: TWIST.Card.draftCard.height}, {x: 50, y: TWIST.Card.draftCard.height}]
  };

  var p = Desk.prototype = new createjs.Container();
  p.container_initialize = p.initialize;


  Desk.width = 1280;
  Desk.height = 720;

  // vi tri gua ban
  Desk.position = {x: Desk.width / 2, y: Desk.height / 2};

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
      x: Desk.position.x,
      y: Desk.position.y,
      visible: false
    });
    return this.deckCard;
  };

  p.createRemainingTime = function () {
    this.remainingTimeText = new createjs.Text('', 'bold 50px Roboto Condensed', 'white');
    this.remainingTimeText.set({
      x: Desk.position.x,
      y: Desk.position.y,
      visible: false,
      textAlign: "center",
      textBaseLine: "top"
    });
    return this.remainingTimeText;
  };

  p.createRemainingCard = function () {
    this.remainingCard = new createjs.Text('', 'bold 30px Roboto Condensed', 'greenyellow');
    this.remainingCard.set({
      x: Desk.position.x,
      y: Desk.position.y,
      textAlign: "center",
      textBaseline: 'middle'
    });
    return this.remainingCard;
  };

  p.showRemainingDeckCard = function (value) {
    var _value;
    if (typeof value === "undefined") {
      var _value = this.deckCard.children.length;
    } else {
      this.deckCard.children.length = _value = value;
    }
    this.remainingCard.text = _value || "";
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
      handPosition[i] = {
        x: 63,
        y: 30,
        align: 'left'
      };
      draftPosition[i] = {x: handPosition[i].x + TWIST.Card.draftCard.width * 1.5, y: handPosition[i].y};
    }

    playerPosition = Desk.playerPositions[maxPlayers];
//        draftPosition = Desk.draftPosition[maxPlayers] || [];
    handPosition[0] = {x: 150, y: -50, align: 'center'};

    if (maxPlayers === 4) {
      handPosition[1] = {x: 6, y: 30, align: 'center'};
      draftPosition[0] = {
        x: (Desk.width / 2 - TWIST.Card.draftCard.width * 2) - playerPosition[0].x,
        y: -100,
        align: 'left'
      };
      draftPosition[1].x = -340;
      draftPosition[1].align = 'right';
      draftPosition[2] = {
        x: (Desk.width / 2 - TWIST.Card.draftCard.width * 2) - playerPosition[2].x,
        y: 120,
        align: 'left'
      };
    }


    this.config.playerPositions = playerPosition;
    this.config.handPositions = handPosition;
    this.config.draftPositions = draftPosition;
  };

  p.generateCards = function (numberCards, cardType) {
    var currentCards = this.deckCard.children.length;
    var numberCardAdd = numberCards - currentCards;
    cardType = cardType || TWIST.Card.playerCard;
    var scale = cardType.scale;
    console.log("cardType", cardType, this.deckCard);
    if (numberCardAdd > 0) {
      for (var i = 0; i < numberCardAdd; i++) {
        var cardImage = new TWIST.Card();
        cardImage.set({
          scaleX: scale,
          scaleY: scale,
          x: -cardType.width / 2,
          y: -cardType.height / 2
        });
        this.deckCard.addChild(cardImage);
      }
    } else {
      this.deckCard.children.splice(0, -numberCardAdd);
    }
    this.deckCard.visible = true;
  };


  p.createLastDraftCards = function (cardList, cardType) {
    var draftCards = this.draftCards;
    var cardType = cardType || TWIST.Card.demlaDraftCard;
    cardList.forEach(function (item, index) {
      var card = new TWIST.Card(item);
      card.set({
        x: (index - cardList.length * 0.5) * cardType.seperator,
        y: cardType.height * 0.8,
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

  p.setRemainingTime = function (time, options) {
    var _self = this;
    var miliseconTime = time > 100 ? time : time * 1000;
    var startTime = new Date().getTime();
    var miliseconTimeText = this.remainingTimeText;
    $.extend(miliseconTimeText, options);
    miliseconTimeText.visible = true;
    if (miliseconTime >= 0) {
      this.remainingTimeTween && this.remainingTimeTween.removeAllEventListeners();
      miliseconTimeText.text = "";

      this.remainingTimeTween = createjs.Tween.get(miliseconTimeText, {override: true})
              .to({}, miliseconTime, createjs.Ease.linear)
              .call(function () {
                _self.remainingTimeTween.removeAllEventListeners();
                miliseconTimeText.text = "";
              });
      this.remainingTimeTween.addEventListener("change", function () {
        var currentTime = new Date().getTime();
        var text = "";
        var deviationTime = miliseconTime - (currentTime - startTime);
        if (deviationTime > 0) {
          text = Math.floor(deviationTime / 1000);
        }
        miliseconTimeText.text = text;
      });
    } else {
      this.remainingTimeTween && this.remainingTimeTween.removeAllEventListeners();
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

  p.createTimer = function (config) {
    this.timer = new TWIST.Timer(config);
    this.addChild(this.timer);
  };

  p.setCicleTime = function (remainingTime, totalTime) {
    remainingTime = remainingTime || 30000;
    if (remainingTime < 50)
      remainingTime *= 1000;
    totalTime = totalTime || 30000;
    if (totalTime < 50)
      totalTime *= 1000;
    this.timer.startTimer(totalTime, remainingTime);
  };

  p.clearTimer = function (remainingTime, totalTime) {
    this.timer.clearTimer();
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
    this.timerBg = new createjs.Shape();
    this.initBg();
    this.addChild(this.timerBg, this.timerLine);
    this.startAngle = 0;
    this.endAngle = 0;

  };

  p.initBg = function () {
    if (this.__type) {
      this.startAngle = -0.5 * Math.PI;
      this.endAngle = 1.5 * Math.PI;
      this.timerBg.graphics.s("#000000").ss(this.strokeThick)
              .arc(this.radius, this.radius, this.radius, this.startAngle, this.endAngle, false);
      this.timerBg.alpha = 0.18;
      this.timerBg.visible = false;
    }
  };

  p.drawPercentRect = function (currentTimer) {
    this.timerLine.graphics.clear();
    this.startAngle = Math.PI * 3 / 2 - currentTimer * Math.PI * 2;
    this.endAngle = Math.PI * 3 / 2;
    this.timerLine.graphics.s("#fee802").ss(this.strokeThick)
            .arc(this.radius, this.radius, this.radius, this.startAngle, this.endAngle, false);
  };

  p.setCounter = function (totalTime, remainingTime) {
    this.timerBg.visible = true;
    this.timerLine.visible = true;
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
    createjs.Tween.get(this.timerLine, {override: true});
    this.timerLine.graphics.clear();
    this.timerLine.visible = false;
    this.timerBg.visible = false;
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
    if (remainingTime > totalTime)
      remainingTime = totalTime;
    this.clearTimer();
    this.setCounter(totalTime, remainingTime);
    var _self = this;
    this.tween = createjs.Tween.get(this.timerLine, {override: true})
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
  var DESK = TWIST.Desk;

  function Player(playerData) {
    this.initialize(playerData);
  }

  Player.Defaults = {
    UserName: 'username',
    Position: 0
  };

  Player.usernameConfig = {x: 0, y: 100, width: 120, height: 50};

  Player.avatarConfig = {x: 15, y: 0, radius: 45, innerRadius: 43, AvatarDefault: imagePath + 'avatars/1.png'};

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
    var avatarConfig = $.extend(Player.avatarConfig, config.avartar);

    this.initUsername(config, self);
    this.initAvatar(config, self);
    this.initDraftCards(config, self);
    this.initHandCards(config, self);
    this.initChatMessage(config, self);
    this.initMoneyEffect(config, self);
    this.initStatus(config, self);
    this.timer = new TWIST.Timer({x: avatarConfig.x, y: avatarConfig.y, radius: avatarConfig.radius, strokeThick: 10});

    this.addChild(this.timer, this.avatarContainer, this.usernameContainer, this.draftCards, this.hand, this.status, this.chat, this.moneyChangeEffect);
    this.render();
  };

  p.initUsername = function (config, self) {
    var usernameContainer = new createjs.Container();
    var usernameConfig = config.username || Player.usernameConfig;
    $.extend(usernameContainer, usernameConfig);

    var usernameText = new createjs.Text(this.username, '18px Roboto Condensed', 'white');
    usernameText.set({x: 60, y: 25, textAlign: 'center', textBaseline: 'bottom'});
    var moneyText = new createjs.Text(this.money, '14px Roboto Condensed', '#f3ba04');
    moneyText.set({x: 60, y: 45, textAlign: 'center', textBaseline: 'bottom'});
    var usernameBg = new createjs.Shape();
    usernameBg.graphics.beginFill("black").drawRoundRectComplex(0, 0, usernameConfig.width, usernameConfig.height, 10, 10, 10, 10);
    usernameBg.alpha = 0.2;
    usernameContainer.addChild(usernameBg, usernameText, moneyText);
    this.usernameContainer = usernameContainer;
  };

  p.initAvatar = function (config, self) {
    //        avatar container

    var avatarContainer = new createjs.Container();
    var avatarConfig = $.extend(Player.avatarConfig, config.avartar);
    var avatarImageDiameter = avatarConfig.innerRadius * 2;
    $.extend(avatarContainer, avatarConfig);

    var avatarImage = new Image();
    var avatarNumber = Global.md5Avatar(this.username) || 10;
    avatarImage.src = this.avatarSrc || ((TWIST.imagePath || imagePath) + 'player/avatars/' + avatarNumber + '.png');
    var avatarBitmap = new createjs.Bitmap(avatarImage);
    avatarImage.onload = function () {
      avatarBitmap.set({
        width: avatarImageDiameter,
        height: avatarImageDiameter,
        scaleX: avatarImageDiameter / avatarImage.width,
        scaleY: avatarImageDiameter / avatarImage.height
      });
    };
    avatarBitmap.set({x: avatarConfig.radius - avatarConfig.innerRadius, y: avatarConfig.radius - avatarConfig.innerRadius})

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

    var draftCardsConfig = config.draftPositions || Player.draftCardsConfig;
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
    var moneyChangeBg = new createjs.Text("", "bold 24px Roboto Condensed", "black");
    moneyChangeBg.set({x: 1, y: 11, textAlign: 'center', textBaseline: 'bottom'});
    var moneyChangeText = new createjs.Text("", "bold 24px Roboto Condensed");
    moneyChangeText.set({x: 0, y: 10, textAlign: 'center', textBaseline: 'bottom'});
    moneyChangeText.shadow = new createjs.Shadow("#000", 0, 0, 10);
    this.moneyChangeEffect.addChild(moneyChangeBg, moneyChangeText);
  };

  p.initStatus = function (config, self) {
    //player status
    this.status = new createjs.Container();
    var configAvatar = config.avartar || Player.avatarConfig;
    var radius = configAvatar.radius;
    this.status.set({x: configAvatar.x + radius, y: configAvatar.y + radius});
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
    if (remainingTime < 50)
      remainingTime *= 1000;
    totalTime = totalTime || 20000;
    if (totalTime < 50)
      totalTime *= 1000;
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
    var cardNumberBg = this.numberOfCards.getChildAt(0);
    var cardNumber = this.numberOfCards.getChildAt(1);
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
    options = options || {};
    statusContainer.default = (typeof options.default === "undefined") ? statusContainer.default : options.default;
    status = status || statusContainer.default;
    statusContainer.visible = status ? true : false;

    options.color = options.color || "yellowgreen";
    options.font = options.font || 'bold 20px Roboto Condensed';
    options.x = options.x || 0;
    options.y = options.y || 10;
    options.textAlign = options.textAlign || 'center';
    options.textBaseline = options.textBaseline || 'bottom';
    $.extend(statusText, options);
    $.extend(statusBg, options);
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
    if (this.showCardLength) {
      setTimeout(function () {
        _self.setNumberCards(_self.handCards.cardList.length);
      }, 1000);
    } else {
      this.numberOfCards.visible = false;
    }

  };

  p._renderHandCards = function (listCard, options) {
    var _self = this;
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
      this.addHandCards(cardImage, options);
    }
  };

  p.setNumberCards = function (numOfCards) {

    var cardNumberBg = this.numberOfCards.getChildAt(0);
    var cardNumber = this.numberOfCards.getChildAt(1);
    if (this.position !== 0 && numOfCards > 0) {
      cardNumberBg.visible = false;
      cardNumber.visible = false;
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
    if (this.listPhom && this.listPhom.length && !isNaN(card.cardValue) && this.position == 0) {
      var cardsInPhom = [];
      this.listPhom.forEach(function (item, index) {
        cardsInPhom = cardsInPhom.concat(item);
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
        this.visible = _self.showPlayerCard;
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
    var desk = this.parent.parent.getChildByName('desk');
    var cardImage = desk.getCard();
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
            bai = options.cardType || TWIST.Card.draftCard,
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
            bai = options.cardType || TWIST.Card.draftCard,
            draftCards = options.draftCards || this.draftCards;

    var draftPosition = draftCards.localToGlobal(0, 0);
    card.set({
      x: card.x + this.hand.x + this.x - draftPosition.x,
      y: card.y + this.hand.y + this.y - draftPosition.y,
      rotation: options.rotateAble ? (Math.random() - 0.5) * 30 : 0,
      scaleX: bai.scale,
      scaleY: bai.scale
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
        this.openCard(this.cardValue, bai);
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
    var indexLeft = (DESK.width - length * TWIST.Card.draftCard.seperator - (this.draftCards.x + this.x) * 2) / 2;

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
        var cardValue = cardList[i];
        var handCardValue = handCards.map(function (item) {
          return item.cardValue
        });
        var cardIndex = handCardValue.indexOf(cardValue);
        if (cardIndex > -1) {
          var sliceCards = handCards.splice(cardIndex, 1);
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

  p.sortPhom = function (listCard) {
    var cards = this.handCards.children;
    var cardsInPhom = [];
    if (listCard) {
      cardsInPhom = listCard.sort(function (a, b) {
        return a - b;
      });
    } else {
      var listPhom = this.listPhom || [];
      for (var i = 0; i < listPhom.length; i++) {
        var phom = listPhom[i];
        phom.sort(function (a, b) {
          return a - b;
        });
        for (var j = 0; j < phom.length; j++) {
          cardsInPhom.push(phom[j]);
        }
      }
    }
    this.handCards.sortType = this.handCards.sortType ? "" : "rankSort";
    var _self = this;

    cards.forEach(function (item, index) {
      item.setInPhom(cardsInPhom.indexOf(item.cardValue) > -1);
    });

    cards.sort(function (a, b) {
      if (cardsInPhom.indexOf(a.cardValue) > -1 && !(cardsInPhom.indexOf(b.cardValue) > -1)) {
        return false;
      } else if (cardsInPhom.indexOf(b.cardValue) > -1 && !(cardsInPhom.indexOf(a.cardValue) > -1)) {
        return true;
      } else if (cardsInPhom.indexOf(a.cardValue) > -1 && cardsInPhom.indexOf(b.cardValue) > -1) {
        return cardsInPhom.indexOf(a.cardValue) - cardsInPhom.indexOf(b.cardValue);
      }
      if (_self.handCards.sortType == "rankSort") {
        return a.cardValue - b.cardValue;
      } else {
        if (a.suite == b.suite) {
          return a.rank - b.rank;
        }
        return a.suite - b.suite;
      }

    });
  };

  p.sortTL = function () {
    var cards = this.handCards.children;
    this.handCards.sortType = this.handCards.sortType ? "" : "rankSort";
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

  p.preparedShowPhom = function (cardsInPhom) {

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

  p.getLastDraftCards = function (cardIndex) {
    var _self = this;
    var draftCards = this.draftCards.children;
    for (var j = 0; j < draftCards.length; j++) {
      if (cardIndex == draftCards[j].cardValue) {
        var position = draftCards[j].localToGlobal(0, 0);
        this.rePositionDraftCards(j);
        draftCards[j].x = position.x;
        draftCards[j].y = position.y;
        var card = draftCards.splice(j, 1)[0];
        return card;
      }
    }
  };

  p.rePositionDraftCards = function (indexPosition) {
    var listCard = this.draftCards.children;
    listCard.forEach(function (item, index) {
      if (index > indexPosition) {
        item.set({
          x: listCard[index - 1].x
        });
      }
    });
  };

  p.getDraftCardsAbsolutePosition = function () {
    return {
      x: this.x + this.draftCards.x,
      y: this.y + this.draftCards.y
    };
  };

  p.eatCard = function (card, position, cardSordList) {
    var _self = this;
    this.numberEatedCard = this.numberEatedCard || 0;
    this.numberEatedCard++;
    var bai = (this.position == 0 ? TWIST.Card.userCard : TWIST.Card.draftCard);
    card.hightLight();
    if (this.position == 0) {
      this.addHandCards(card, {
        animationTime: 200,
        reSort: true,
        sortPhom: true,
        dragable: true
      });
    } else {
      var newX = bai.seperator * this.draftCards.children.length,
              newY = 0;
      this.handCards.addChild(card);
      card.set({x: card.x - this.hand.x - this.x, y: card.y - this.hand.y - this.y});
      if (this.position == 2) {
        newX = 0 - this.hand.x + 100 + bai.seperator * (this.numberEatedCard - 1);
        newY = 0;
      } else {
        newY = -TWIST.Card.draftCard.height - 10;
        if (this.draftCards.align == "right") {
          newX = 0 - this.hand.x + this.draftCards.x + 300 - (this.numberEatedCard - 1) * bai.seperator;
        } else {
          newX = 0 - this.hand.x + this.draftCards.x + bai.seperator * (this.numberEatedCard - 1);
        }
      }
      console.log("newY", newY);
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
      cardsInPhom = cardsInPhom.concat(item);
    });

    var cards = this.handCards.children;
    for (var i = 0; i < cards.length; i++) {
      cards[i].isInPhom = cardsInPhom.indexOf(cards[i].cardValue) > -1;
      cards[i].setInPhom(cards[i].isInPhom);
    }
  }

  p.moveDraftCard = function (card, fromPlayer) {
    var bai = TWIST.Card.draftCard;
    var self = this;
    var draftCardsPosition = this.draftCards.localToGlobal(0, 0);
    var newX = bai.seperator * this.draftCards.children.length, newY = 0;
    if (this.draftCards.align == "right") {
      newX = 300 - bai.seperator * (this.draftCards.children.length)
    }
    card.set({
      x: card.x - draftCardsPosition.x,
      y: card.y - draftCardsPosition.y
    });
    self.draftCards.addChild(card);

    createjs.Tween.get(card).to({
      x: newX,
      y: newY,
      width: bai.width,
      height: bai.height,
      scaleX: bai.scale,
      scaleY: bai.scale
    }, _animationTime, createjs.Ease.sineOut());
  };

  p.showPhom = function (phoms) {
    var cardsToDrash = [];
    for (var i = 0; i < phoms.length; i++) {
      var phom = phoms[i];
      this.showSinglePhom(phom, i);
    }
    var _self = this;
    setTimeout(function () {
      _self.sortPhomArea();
    }, 550);
  };

  p.addShowPhomArea = function (player) {
    var desk = this.parent.parent.getChildByName('desk');
    var draftPosition = desk.config.draftPositions[this.position];

    var newY = 0;
    var newX = 0;
    if (this.position == 0) {
      newY = draftPosition.y - TWIST.Card.draftCard.height - 10;
      newX = draftPosition.x;
    } else if (this.position == 2) {
      newX = this.hand.x + 37;
      newY = this.hand.y;
    } else {
      newY = draftPosition.y - TWIST.Card.draftCard.height - 10;
      if (this.draftCards.align == "right") {
        newX = this.draftCards.x;
      } else {
        newX = this.draftCards.x;
      }
    }
    this.showPhomArea = new createjs.Container();
    this.showPhomArea.set({
      name: "showPhomArea",
      x: newX,
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

      createjs.Tween.get(card, {override: true}).to({
        x: newX, y: newY,
        width: bai.width,
        height: bai.height,
        scaleX: bai.scale,
        scaleY: bai.scale
      }, _animationTime, createjs.Ease.sineOut()).call(function () {
        this.isInPhom = false;
        if (_self.position != 0) {
          this.openCard(this.cardValue, bai);
        } else {
          this.setInPhom(false);
        }
      });
    }
    return cards;
  };

  p.addCardInShowPhom = function (card, otherPlayerSend) {
    var _self = this;
    var bai = TWIST.Card.draftCard,
            _self = this,
            oldX = card.x,
            oldY = card.y,
            newX = bai.seperator * this.showPhomArea.children.length,
            newY = 0,
            draftCards = this.showPhomArea;

    if (this.draftCards.align == "right") {
      newX = 300 - bai.seperator * (draftCards.children.length - 1)
    }
    var showPhomGlobal = _self.showPhomArea.localToGlobal(0, 0);
    card.set({
      x: card.x - showPhomGlobal.x,
      y: card.y - showPhomGlobal.y
    });
    _self.showPhomArea.addChild(card);
    card.removeAllEventListeners();
    card.setInPhom(false);
    createjs.Tween.get(card).to({
      x: newX,
      y: newY,
      width: bai.width,
      height: bai.height,
      scaleX: bai.scale,
      scaleY: bai.scale
    }, _animationTime).call(function () {
      if (otherPlayerSend) {
        this.openCard(this.cardValue, bai);
      }
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
      indexLeft = (DESK.width - width - (this.showPhomArea.x + this.x) * 2) / 2;
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
    var startY = (options && options.startY) || ((type === "lose") ? 100 : 0);
    var endY = (options && options.endY) || ((type === "lose") ? 0 : 100);
    moneyChangeContainer.set({visible: true, y: startY, alpha: 0.3});
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
    createjs.Tween.get(moneyChangeContainer).to({y: endY, alpha: 1}, _animationTime + 200).call(function () {
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
    this.numberEatedCard = 0;
    var cards = [], bai = TWIST.Card.draftCard;

    for (var i = 0; i < cardList.length; i++) {
      var card = new TWIST.Card(cardList[i]);
      var newX = bai.seperator * i, newY = 0;
      if (this.position == 2) {
        newX = 0 - this.hand.x + 100 + bai.seperator * this.numberEatedCard;
        newY = 0;
      } else {
        newY = -TWIST.Card.draftCard.height - 10;
        if (this.draftCards.align == "right") {
          newX = 0 - this.hand.x + this.draftCards.x + 300 - this.numberEatedCard * bai.seperator;
        } else {
          newX = 0 - this.hand.x + this.draftCards.x + bai.seperator * this.numberEatedCard;
        }
      }
      card.set({
        x: newX,
        y: newY,
        scaleX: bai.scale,
        scaleY: bai.scale
      });
      this.numberEatedCard++;
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
    width: 1280,
    height: 720
  };
  var p = BaseGame.prototype = new EventEmitter();

  p.initBaseGame = function (options) {

    //Event List
//        this.events = {
////            info: "drawInfo"
//        };

    this.initEvent();
    this.initCanvas();
    this.wrapper.append(this.canvas);
    this.initStage(options);
  };

  p.initCanvas = function () {
    var canvas = $(TWIST.HTMLTemplate.canvas);
    canvas.attr({
      width: this.options.width || initOptions.width,
      height: this.options.height || initOptions.height
    });
//        canvas.addClass('twist');
    this.canvas = canvas;
    return canvas;
  };

  p.initStage = function (options) {
    var _self = this;
    var stage = new createjs.Stage(this.canvas[0]);
    $.extend(stage,options);
    TWIST.Observer._canvasList.push(stage);
    stage.enableMouseOver(20);
    var context = stage.canvas.getContext("2d");
    context.mozImageSmoothingEnabled = true;
    createjs.Touch.enable(stage);
    createjs.Ticker.setFPS(60);
    stage.width = this.canvas.width;
    stage.height = this.canvas.height;
    createjs.Ticker.addEventListener("tick", onUpdateStage);
    this.on('destroy', function () {
      var _stageIndex = TWIST.Observer._canvasList.findIndex(function(item,index){
        return item == stage;
      });
      if(_stageIndex > -1 ){
        TWIST.Observer._canvasList.splice( _stageIndex, 1 );
      }
      createjs.Ticker.removeEventListener("tick", onUpdateStage);
      _self.removeAllListeners();
      _self.timeOutList.forEach(function (item, index) {
        clearTimeout(item);
      });
    });
    this.stage = stage;

    function onUpdateStage() {
      stage.update();
    }
  };

  p.initEvent = function () {
    this.timeOutList = [];
    this.on('destroy', function () {
      TWIST.Sound.stop();
    });
  };

  p.addNumberEffect = function (el, type) {

    var jElement = el;
    var _self = this;
    var numberWithDotType = "numberWithDot" + (type || "");

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
          jElement.text(Global[numberWithDotType](Math.ceil(now)));
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
    };

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
          count++;
          if (count == length)
            jElement.endEffect();
        });
      });
    };

    jElement.endEffect = function () {
      if (this.isTracking) {
        this.isTracking = false;
        _self.emit("_moveChipComplete", jElement);
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

  p.statusList = $.extend({}, InRoomGame.statusList);

  p.initInRoomGame = function () {
    this.initBaseGame({
      _transformAble: true
    });
    this.drawRoom();
    this.pushInRoomGameEvent();
    this.initInviteList();
    this.initErrotPanel();
    this.initButtonBar();
    this.initResultPanel();
    this.observerEvent();
    this.userInfo = this.userInfo || {};
    this.status = this.statusList['0'];
    this.model = this.model || {};
  };

  p.initInviteList = function () {
    var _self = this;

    this.inviteListTemplate = $(TWIST.HTMLTemplate['inviteList/wrapper']);
    this.wrapper.append(this.inviteListTemplate);

    var playerPositions = this.desk.config.playerPositions;

    this.inviteList = [];

    playerPositions.forEach(function (item, index) {
      drawInvitePosition(item, index);
    });

    function drawInvitePosition(positionData, index) {
      var invitePosition = $(TWIST.HTMLTemplate['inviteList/inviteItem']);
      _self.inviteList.push(invitePosition);
      _self.inviteListTemplate.append(invitePosition);
      invitePosition.css({
        top: positionData.y,
        left: positionData.x + 11
      });
      if (!index)
        invitePosition.hide();
      invitePosition.on('click', function () {
        _self.emit('invitePlayer');
      });
    }
  };

  p.initErrotPanel = function () {
    this.errorPanel = $(TWIST.HTMLTemplate.errorPanel);
    this.wrapper.append(this.errorPanel);
    this.errorList = this.errorList || {};
    $.extend(this.errorList, {
      0: "Lỗi hệ thống !",
      //sam Error
      34: "Không được để 2 cuối !",
      1470: "Chưa chọn cây bài !",
      //xocdia Error,
      91: "Cược vượt quá cho phép",
      92: "Cửa đặt không xác định",
      93: "Không đủ tiền để làm nhà cái",
      94: "User không phải nhà cái",
      95: "Nhà cái đã tồn tại",
      96: "Chưa sẵn sàng để đặt cược",
      97: "Bán chẵn/lẻ không thành công",
      98: "Bạn đã bán chẵn/lẻ rồi",
      99: "Số tiền bán chẵn/lẻ không hợp lệ",
      100: "Hủy cược không thành công",
      101: "Nhà cái không thể đặt cược",
      102: "Hủy cái không thành công."
    });
  };

  p.initButtonBar = function () {
    this.buttonBar = $(TWIST.HTMLTemplate['buttonBar/wrapper']);
    this.wrapper.append(this.buttonBar);
    this.startButton = $(TWIST.HTMLTemplate['buttonBar/startButton']);
    this.buttonBar.append(this.startButton);
    this.buttonBar.hide();
  };

  p.drawRoom = function () {
    var canvas = this.wrapper.find('canvas');
    this.wrapper.css("background", "url(" + TWIST.imagePath + "Desk-bg.png) center no-repeat");
    this.playersContainer = new createjs.Container();
    this.desk = new TWIST.Desk(this.options);
    this.desk.name = "desk";
    this.stage.addChild(this.desk, this.playersContainer);
    this.wrapper.css({
      width: canvas.width(),
      height: canvas.height(),
      position: "relative"
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

    this.on("endGame", this.endGame);

    this.on("draftCards", this.onDraftCards);

    this.on("hitTurn", this.onHitTurn);

    this.on("reconnect", this.reconnect);

    this.on("updateUuid", this.updateUuid);

    this.on("showPlayersCards", this.showPlayersCards);

    this.on("reSortDraftCards", this.reSortDraftCards);
  };

  p.setUserInfo = function (data) {
    this.userInfo = $.extend(this.userInfo, data);
    this.userInfo.uuid = this.userInfo.uuid || this.userInfo.id;
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

    if (data.status) {
      this.changeStatus({
        newStatus: data.status
      });
      if (this.status === 'STATUS_PLAYING') {
        this.drawPlayingState(data);
      }
    }
  };

  p.removePlayer = function (data) {
    var player = this.getPlayerByUuid(data.uuid);
    if (player) {
      var playerPosition = player.position;
      this.inviteList[playerPosition] && this.inviteList[playerPosition].show();
      this.playersContainer.removeChild(player);
    }
    var playerData = this.removePlayerData(data.uuid);
  };

  p.addCheater = function () {
    var _self = this;

    this.cheaterButton = $('<div class="button zero yellow">Cheater</div>');
    this.wrapper.append(this.cheaterButton);
    this.cheaterButton.unbind('click');
    this.cheaterButton.click(function () {
      console.log("click cheaterButton133");
      _self.renderCheater();
      $('.cheater').toggle();
    });

    this.cheater = $(TWIST.HTMLTemplate['cheater/wrapper']);
    this.cheater.find('.cheat-backgound').click(function () {
      $('.cheater').toggle();
    });
    this.cardButtonList = this.cheater.find('.card-button-list');
    this.randomCardList = this.cheater.find('.random-card-list');
    this.randomCardList.cardList = [];
    this.fixCardList = this.cheater.find('.fix-card-list');
    this.fixCardList.cardList = [];
    this.totalCheatCardList = this.cheater.find('.total-cheat-card-list');
    this.totalCheatCardList.cardList = [];
    this.listPlayerCards = $('<div class="list-player-cards"></div>');
    this.listPlayerCards.listPlayer = [];
    this.cheater.append(this.listPlayerCards);
    this.wrapper.append(this.cheater);

    this.addCheatCardButtons();
  };

  p.addCheatCardButtons = function () {
    var _self = this;
    for (var i = 0; i < 52; i++) {
      var elementStr = '<div class="card-cheat-button card card' + i + '"></div>';
      var element = $(elementStr);
      (function (element, i) {
        element.click(function () {
          _self.addCheatCard(i);
        });
      })(element, i);
      this.cardButtonList.append(element);
    }
  };

  p.addCheatCard = function (index) {
    var _self = this;
    var targetElement = $('input[name=selectedPlayer]:checked');
    if(targetElement.length != 1) return;
    
    var uuid = targetElement.val();
    
    var cheatPlayer = this.listPlayerCards.listPlayer.find(function (item, index) {
      return item.uuid ==  uuid;
    });
    
    if (cheatPlayer && cheatPlayer.cardContainer) {
      this.renderHtmlCardInElement(index, cheatPlayer.cardContainer);
      this.createTotalCheatCardList();
    }
//    if (this.fixCardList.cardList.indexOf(index) === -1) {
//      this.renderHtmlCardInElement(index, this.fixCardList);
//      this.createTotalCheatCardList();
//    }
  };

  p.renderHtmlCardInElement = function (index, container) {
    var _self = this;
    if (container.cardList.length >= this.options.numberCardsInHand)
      return;
    container.cardList.push(index);
    var card = $('<div class="card-cheat-button card card' + index + '"></div>');
    card.click(function () {
      var arrayIndex = container.cardList.indexOf(index);
      if (arrayIndex > -1) {
        container.cardList.splice(arrayIndex, 1);
      }
      $(this).remove();
      _self.createTotalCheatCardList();
    });
    container.append(card);
  };

  p.createTotalCheatCardList = function () {
    var _self = this;
    _self.totalCheatCardList.cardList = [];
    var totalList = [];
    this.fixCardList.cardList.forEach(function (item, index) {
      if (totalList.indexOf(item) === -1) {
        totalList.push(item);
      }
    });
    this.randomCardList.cardList.forEach(function (item, index) {
      if (totalList.indexOf(item) === -1) {
        totalList.push(item);
      }
    });
    totalList.sort(function (a, b) {
      return a - b;
    });
    this.clearCardListContainer(_self.totalCheatCardList);
    totalList.forEach(function (item, index) {
      _self.renderHtmlCardInElement(item, _self.totalCheatCardList);
    });
  };

  p.clearCardListContainer = function (element) {
    element.cardList = [];
    element.empty();
  };

  p.renderCheater = function (element) {
    var _self = this;

    var listPlayer = this.playersContainer.children.map(function (item, index) {
      return {
        uuid: item.uuid,
        username: item.username,
        isRoomMaster: item.isRoomMaster,
        indexPosition: item.indexPosition
      };
    });

    listPlayer.sort(function (a, b) {
      return a.indexPosition - b.indexPosition;
    });

    this.listPlayerCards.listPlayer = this.listPlayerCards.listPlayer || [];

    this.listPlayerCards.listPlayer.forEach(function (item, index) {
      var exitsPlayer = listPlayer.find(function (_item) {
        return _item.uuid == item.uuid;
      });
      if (!exitsPlayer) {
        item.remove();
      }
    });

    listPlayer.forEach(function (item, index) {
      var exitsPlayer = _self.listPlayerCards.listPlayer.find(function (_item) {
        return _item.uuid == item.uuid;
      });
      if (!exitsPlayer) {

        var playerCards = $('<div id="' + item.uuid + '"><label><input value="'+item.uuid+'" type="radio" name="selectedPlayer"/>'+ item.uuid +'</label></div>');
        playerCards.cardContainer = $('<div></div>');
        Object.assign(playerCards,item);
        playerCards.cardContainer.cardList = [];

        playerCards.append(playerCards.cardContainer);

        _self.listPlayerCards.listPlayer.push(playerCards);
        _self.listPlayerCards.append(playerCards);
      }
    });
  };

  p.getListCheatCard = function (element) {
    var _self = this;
    this.createTotalCheatCardList();
    var listCardToSet = [];
    if ($('#whiteVictory').prop('checked')) {
      listCardToSet = this.createWhiteVictoryList();
    } else if ($('#hasGun').prop('checked')) {
      listCardToSet = this.createGunList();
    } else if ($('#hightCards').prop('checked')) {
      listCardToSet = this.createHightCardsList();
    } else {
      listCardToSet = [];
    }
    if ($('#hasFixedCards').prop('checked')) {
      _self.totalCheatCardList.cardList.forEach(function (item, index) {
        if ((listCardToSet.indexOf(item) === -1) && listCardToSet.length < _self.options.numberCardsInHand) {
          listCardToSet.push(item);
        }
      });
    }

//    listCardToSet = [];

    var listPlayer = this.playersContainer.children.map(function (item, index) {
      return {
        uuid: item.uuid,
        username: item.username,
        isRoomMaster: item.isRoomMaster,
        indexPosition: item.indexPosition
      };
    });
    listPlayer.sort(function (a, b) {
      return a.indexPosition - b.indexPosition
    });

    var listFullCard = [];
    for (var i = 0; i < 52; i++) {
      listFullCard.push({
        value: i,
        disabled: false
      });
    }

    listFullCard.forEach(function (item, index) {
      if (listCardToSet.indexOf(item.value) > -1) {
        item.disabled = true;
      }
    });

    listPlayer.forEach(function (item, index) {
      var player =  _self.listPlayerCards.listPlayer.find(function (_item) {
        return _item.uuid == item.uuid;
      });
      item.cardList = player ? player.cardContainer.cardList : [];
//      item.cardList = item.isRoomMaster ? listCardToSet : [];
      if (isNaN(listCardToSet.length))
        return;
      var addCardsLength = _self.options.numberCardsInHand - item.cardList.length;
      if (addCardsLength > 0) {
        for (var i = 0; i < addCardsLength; i++) {
          addCardToPlayer(item.cardList);
        }
      }
    });

    function addCardToPlayer(cardList) {
      var remainingCards = listFullCard.filter(function (item) {
        return !item.disabled;
      });
      var cardItem = remainingCards[parseInt(Math.random() * remainingCards.length)];
      cardList.push(cardItem.value);
      var disabledCard = listFullCard.find(function (item) {
        return item.value == (cardItem && cardItem.value);
      });
      disabledCard && (disabledCard.disabled = true);
    }
    return listPlayer;
  };

  p.createWhiteVictoryList = function () {
    var whiteVictoryList = [
      "3s4c5h6d7s8c9h0djdqdkskdac", "3d3h4d5s6c7c8s9s0hjsqskcad", "3c4d5h6h7d8c9s0djcqskdas2d",
      "3s4d5d6d7c8d9d0sjcqckhac2s", "3h4s5s6d7s8c9h0h0sjcqdkdad", "3h4h5h6c6s7s8s9d0cjdqskdas",
      // 5 doi thong
      "4s4d5d5c6h6d7c7s8h8sjcjdkh", "6c6d7s7h8d8s9h9s0c0dadah2h", "3h5d8d8c9s9h0c0djsjdqcqd2s",
      "3d3s4s4d5d5c6h6d7c7sjdqckc", "6d6h7s7c8c8d9d9s0s0hacasad", "8s8c8h9s9h0s0cjsjcqdqhac2d",
      // 6 doi
      "4s4d5c5s7d7c8c8h9s9dkdkcas", "3c3h8s8h9s9c0s0dkhkcjdjh2s", "6s6h4c4d7s9s9dkckhasah2d2h",
      // Tu 2
      "3h4s5d6c8h9djhjcks2h2c2d2s", "4s4h6h8s8c9s0hjckd2s2c2h2d", "5s6c7c7h0h0cqdqckd2d2c2s2h",
      "3s4d6d6c7h9s0cjhqc2h2c2d2s", "3c3h4d5d6s0c0hkdks2s2c2h2d"];
    var randomString = whiteVictoryList[parseInt(Math.random() * whiteVictoryList.length)];
    var cardStringList = randomString.match(/.{1,2}/g);
    var rankMap = ["3", "4", "5", "6", "7", "8", "9", "0", "j", "q", "k", "a", "2"];
    var suitMap = ['s', 'c', 'd', 'h'];
    var idList = cardStringList.map(function (item, index) {
      return rankMap.indexOf(item[0]) * 4 + suitMap.indexOf(item[1]);
    });
    return idList;
  };

  p.createGunList = function () {
    var idList = [];
    var startId = 0;
    if (Math.random() < 0.5) {
      startId = parseInt(Math.random() * 11);
      for (var i = 0; i < 4; i++) {
        idList.push(startId * 4 + i)
      }
    } else {
      startId = parseInt(Math.random() * 9);
      for (var i = 0; i < 3; i++) {
        idList = idList.concat(getDoubleCards(startId + i))
      }
    }
    function getDoubleCards(id) {
      var returnArr = [];
      while (returnArr.length < 2) {
        var newItem = parseInt(Math.random() * 4) + id * 4;
        if (returnArr.indexOf(newItem) == -1) {
          returnArr.push(newItem)
        }
      }
      return returnArr;
    }
    return idList;
  };

  p.createHightCardsList = function () {
    var idList = [];
    var length = parseInt(this.options.numberCardsInHand * 2 / 3);

    while (idList.length < length) {
      var newItem = parseInt(36 + Math.random() * 16);
      if (idList.indexOf(newItem) == -1) {
        idList.push(newItem)
      }
    }
    return idList;
  };

  p.reSortDraftCards = function (data) {
    var userID = data.uuid;
    var Player = this.getPlayerByUuid(userID);
    var cardType = TWIST.Card.draftCard;
    if (!Player) {
      this.showError({code: 0});
      return;
    }
    if (Player.position == 0)
      return;
    if (Player.x < 100) {
      Player.showCardsDirection = "horizontal";
      Player.indexShowCardX = 0;
    } else {
      Player.showCardsDirection = "horizontal";
      Player.indexShowCardX = -300;
    }
    Player.handCards.children.sort(function (a, b) {
      return a.cardValue - b.cardValue;
    });
    Player.handCards.children.forEach(function (item, index) {
      item.set({
        scaleX: cardType.scale * 3 / 4,
        scaleY: cardType.scale * 3 / 4,
        x: Player.indexShowCardX + index * cardType.seperator * 3 / 4,
        y: 0
      })
    });
  };

  p.showPlayersCards = function (data) {
    var _self = this;
    var cardType = TWIST.Card.draftCard;
    var currentPlayer = this.getCurrentPlayer();
    currentPlayer.showPlayersCards = true;

    data.forEach(openPlayerCards);
    function openPlayerCards(itemData) {
      var player = _self.getPlayerByUuid(itemData.uuid);
      if (player.position == 0)
        return;
      player.clearHand();
//      if (player.x < 100 || player.x > 1000) {
//        player.showCardsDirection = "vertical";
//        player.indexShowCardY = -250;
//      } else {
//        player.showCardsDirection = "horizontal";
//        player.indexShowCardX = -300;
//      }

      if (player.x < 100) {
        player.showCardsDirection = "horizontal";
        player.indexShowCardX = 0;
      } else {
        player.showCardsDirection = "horizontal";
        player.indexShowCardX = -300;
      }
      itemData.cardList.sort(function (a, b) {
        return a - b;
      });
      itemData.cardList.forEach(function (item, index) {
        var card = new TWIST.Card(item);
        player.handCards.addChild(card);
        card.set({
          scaleX: cardType.scale * 3 / 4,
          scaleY: cardType.scale * 3 / 4,
          x: player.showCardsDirection == "vertical" ? 0 : (player.indexShowCardX + index * cardType.seperator * 3 / 4),
//          y: player.showCardsDirection == "vertical" ? (player.indexShowCardY + index * cardType.height * 2 / 3) : 0,
          y: 0
        })
      });
    }
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
        if ((Player.uuid == this.userInfo.uuid) && (this.status == "STATUS_WAITING_FOR_START")) {
          this.startButton.show();
        } else {
          this.startButton.hide();
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
    if (this._listenChangeMoney) {
      this._listenChangeMoney = false;
      this.userMoney.runEffect(data.money);
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
    var player = this.getPlayerByUuid(data.uuid);
    if (player) {
      player.showMessage(data.message);
    }
  };

  p.changeStatus = function (data) {
    this.desk.setRemainingTime(parseInt(data.remainingTime));
    this.status = this.statusList[data.newStatus];
    var func = this[this.status];
    if (typeof func === "function") {
      func.call(this);
    }
    this.emit("ping");
  };

  p.resetPlayerStatus = function (resetDefault) {
    var players = (this.playersContainer && this.playersContainer.children) || [];
    for (var i = 0, length = players.length; i < length; i++) {
      var player = players[i];
      var options = {};
      if (resetDefault)
        options.default = "";
      player.setPlayerStatus("", options);
    }
  };

  p.STATUS_WAITING_FOR_PLAYER = function () {
    this.buttonBar.hide();
  };

  p.STATUS_WAITING_FOR_START = function () {
    this.buttonBar.show();
    this.buttonBar.find('.button').hide();
    this.resetPlayerStatus(true);

    var playerData = this.getPlayerDataByUuid(this.userInfo.uuid);
    if (playerData && playerData.isRoomMaster) {
      this.startButton.show();
    }
  };

  p.STATUS_PLAYING = function () {
    this.buttonBar.show();
    this.buttonBar.find('.button').hide();
    var players = this.model.players || [];
    players.forEach(function (item, index) {
      item.status = "STATUS_PLAYING";
    });
    this.desk.clear();
    var players = this.playersContainer.children;
    for (var i = 0, length = players.length; i < length; i++) {
      var player = players[i];
      player.setPlayerStatus("");
    }
  };

  p.endGame = function (data) {

  };

  p.reconnect = function (data) {

  };

  p.addPlayer = function (data) {
    TWIST.Sound.play("inroomgame/join_room");
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
      this.inviteList[playerPosition] && this.inviteList[playerPosition].hide();
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
      var firstPosition = a.indexPosition - userPosition;
      if (firstPosition < 0) {
        firstPosition += _self.options.maxPlayers;
      }
      var seconPosition = b.indexPosition - userPosition;
      if (seconPosition < 0) {
        seconPosition += _self.options.maxPlayers;
      }
      return firstPosition - seconPosition;
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
    });

    var playerPositions = config.playerPositions;

    playerPositions.forEach(function (item, index) {
      var player = players.find(function (_item, _index) {
        return index == _item.position;
      });
      if (player) {
        _self.drawPlayer(player);
        _self.inviteList[index].hide();
      } else {
        _self.inviteList[index].show();
      }
    });
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

  p.drawPlayer = function (playerData) {
    playerData.config = playerData.config || {};
    $.extend(playerData, this.options.playerConfig);
    playerData.index = playerData.index || 0;

    var newPlayer = new TWIST.Player(playerData);
    this.playersContainer.addChild(newPlayer);

    if (playerData.isRoomMaster) {
      this.roomMasterIcon = newPlayer.setRoomMaster(true);
    }
    return newPlayer;
  };

  p.getPlayerByUuid = function (uuid) {
    var players = (this.playersContainer && this.playersContainer.children) || [];
    for (var i = 0, length = players.length; i < length; i++) {
      var player = players[i];
      if (player.uuid == uuid)
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

    this.resultPanel = $(TWIST.HTMLTemplate['resultPanel/wrapper']);
    this.wrapper.append(this.resultPanel);

    var resultPanelCotainer = this.resultPanel.find('.container')[0];
    this.resultPanel.find('.container').css("height", "320px");
    this.resultPanel.hide();
    this.resultPanelScroll = new IScroll(resultPanelCotainer, {scrollX: true, freeScroll: true});
    this.resultPanelScroll.refresh();

    var closeButton = this.resultPanel.find('.close-popup');
    var popupMask = this.resultPanel.find('.global-mask');
    closeButton.on('click', function () {
      _self.resultPanel.hide();
    });
    popupMask.on('click', function () {
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
    container.empty();
    resultData.listPlayers.forEach(function (item, index) {
      var cardList = "";
      var cardListIndex = item.remainCards;
      cardListIndex.forEach(function (item, index) {
        var template = _.template(TWIST.HTMLTemplate['resultPanel/card']);
        var resultTemplate = template({
          id: item
        });
        cardList += resultTemplate;
      });

      var compiled = _.template(TWIST.HTMLTemplate['resultPanel/user']);
      var resultText = compiled({
        username: item.username,
        moneyChange: Global.numberWithDot(item.changeMoney),
        resultText: item.gameResultString,
        cardList: cardList,
        isWinnerClass: item.isWinner ? "winner-player" : ""
      });
      container.append($(resultText));
    });
    this.resultPanelScroll.refresh();
  };

  p.endIngameEvent = function () {
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
    this.addCheater();
  };

  p.pushTLMNDemlaEvent = function () {

    this.on("endTurn", this.onEndTurn);

    this.on("foldTurn", this.foldTurn);
  };

  p.handCardSelected = function (card) {
    return;
    var lastDraftCard = this.desk.lastDraftCards;
    if (card && lastDraftCard && lastDraftCard.length) {
      var result = TWIST.TLMNLogic(lastDraftCard, card).getCards();
      if (result.length > 0)
        card.removeAllSelected();
      result.forEach(function (item, index) {
        item.setSelected(true);
      });
    }
  };

  p.drawPlayingState = function (data) {
    this._STATUS_PLAYING(); 
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
        } else {
          _self.showError({
            message: "Ván chơi đang diễn ra !"
          });
        }
      } else {
        handCards.length = item.numberCardsInHand;
      }
      var Player = _self.getPlayerByUuid(item.uuid);
      if (Player) {
        Player.handCards.cardList = handCards;
        Player.renderCards({
          dragable: true
        });
      }
    });

  };

  p.dealCards = function (data) {
    this._STATUS_PLAYING();
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

  p.STATUS_PLAYING = function () {};

  p._STATUS_PLAYING = function () {
    TWIST.InRoomGame.prototype.STATUS_PLAYING.call(this);
  };

  p.onHitTurn = function (data) {
    this._hasNewTurn = data._hasNewTurn;
    var currentUuid = data.uuid;
    var currentPlayer = this.getCurrentPlayer();
    if (currentPlayer.handCards.children.length > 0) {
      this.sortCardButton.show();
    }
    this.setPlayerTurn(data.uuid);

    if (data.uuid === this.userInfo.uuid) {
      this.hitButton.show();
      if (!data._hideFoldButton) {
        this.foldTurnButton.show();
      }
    } else {
      this.hitButton.hide();
      this.foldTurnButton.hide();
    }
  };

  p.onNotifyOne = function (data) {
    var player = this.getPlayerByUuid(data.uuid);
    player.setPlayerStatus("Báo 1 !", {
      default: "Báo 1 !"
    });
  };

  p.foldTurn = function (data) {
    var Player = this.getPlayerByUuid(data.uuid);
    if (Player) {
      Player.clearTimer();
      if (!this._hasNewTurn)
        Player.setPlayerStatus("Bỏ lượt !");
      if (data.uuid === this.userInfo.uuid) {
        this.hitButton.hide();
        this.foldTurnButton.hide();
      }
    }
  };

  p.onDraftCards = function (data) {
    TWIST.Sound.play('danh_bai');
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
    var cardType = TWIST.Card.demlaDraftCard;
    var position = {};
    position.x = (TWIST.Desk.width - cardType.seperator * cards.length) / 2 - TWIST.Desk.draftPosition.x;
    position.y = cardType.height * 0.8;
    Player.draftCardsInHand(cards, {
      cardType: TWIST.Card.demlaDraftCard,
      draftCards: this.desk.draftCards,
      position: position,
      rotateAble: true
    });
  };

  p.onEndTurn = function (data) {
    data._hasNewTurn = true;
    data._hideFoldButton = true;
    this.resetPlayerStatus();
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
      var listCheatCard = _self.getListCheatCard();
      _self.emit("start", {
        listCheatCard : listCheatCard,
        showPlayerCards : $('#showPlayerCards').prop('checked')
      });
    });

    this.hitButton = $(TWIST.HTMLTemplate['buttonBar/hitButton']);
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

    this.sortCardButton = $(TWIST.HTMLTemplate['buttonBar/sortCardButton']);
    this.buttonBar.append(this.sortCardButton);
    this.sortCardButton.unbind('click');
    this.sortCardButton.click(function () {
      var Player = _self.getCurrentPlayer();
      Player.sortTL();
    });

    this.foldTurnButton = $(TWIST.HTMLTemplate['buttonBar/foldTurnButton']);
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
      player.gameResultString = winTypeMap[player.winType];
      if (parseInt(player.changeMoney) < 0) {
        player.gameResultString = player.gameResultString || ("Thua " + (nomalWinType ? cardList.length + " lá!" : " !"));
      } else if (parseInt(player.changeMoney) > 0) {
        if (player.uuid === this.userInfo.uuid) {
          resultData.isWinner = true;
        }
        player.isWinner = true;
        player.gameResultString = player.gameResultString || winTypeMap[data.winType] || "Thắng";
      } else {
        player.gameResultString = player.gameResultString || "Hòa";
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

  var initOptions = {
    maxPlayers: 6,
    numberCardsInHand: 3,
    turnTime: 20000,
    numberCardsRender: 3,
    renderCardOptions: {
      showPlayerCard: true,
      sideDown: true,
      clickOpen: true
    }
  };
  function BaCayGame(wrapper, options) {
    this.wrapper = $(wrapper);
    this.options = $.extend(initOptions, options);
    this.initPhomGame();
  }

  var p = BaCayGame.prototype = new TWIST.InRoomGame();

  p.initPhomGame = function (wrapper) {
    TWIST.Card.RankMapIndex = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"];
    this.initInRoomGame();
    this.bindButton();
    this.pushBacayEvent();
  };

  p.pushBacayEvent = function () {

    this.on('playerOpen', function (data) {
      this.player(data);
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
      }
    }
    this.desk.generateCards(52, TWIST.Card.userCard);

    players.forEach(function (item, index) {
      var handCards = [];
      var listPhom = [];

      if (item.uuid === _self.userInfo.uuid) {
        handCards = data.userListCard || [];
        handCards.sort(function (a, b) {
          return a - b;
        });
        if (handCards.length > 0) {
          _self.sortCardButton.show();
        } else {
          _self.showError({
            message: "Ván chơi đang diễn ra !"
          });
        }
        listPhom = data.listPhom;
      } else {
        handCards.length = item.numberCardsInHand || initOptions.numberCardsInHand;
      }
      var Player = _self.getPlayerByUuid(item.uuid);
      if (Player) {
        Player.handCards.cardList = handCards;
        Player.listPhom = listPhom;
        Player.renderCards(initOptions.renderCardOptions);
        if (Player.position != 0) {
          Player.reEatCards(item.eatedCards);
        }
        Player.rerenderDraftPhom(item.drarfCards);
        item.listPhom && item.listPhom.forEach(function (phom, _index) {
          Player.showSinglePhom(phom);
          (function (Player) {
            setTimeout(function () {
              Player.sortPhomArea();
            }, 550);
          })(Player);
        });
        if (item.eatedCards) {
          Player.hightLightEatCards(item.eatedCards);
        }
      }
    });
    this.desk.showRemainingDeckCard(data.deckCardRemain);
  };

  p.dealCards = function (data) {
    var cardList = data.cardList;
    var players = this.model.players;
    var numberCards = this.options.maxPlayers * this.options.numberCardsRender;
    var _self = this;

    this.desk.generateCards(numberCards, TWIST.Card.playerCard);

    players.forEach(function (item, index) {
      var handCards = [];
      if (item.status !== "STATUS_PLAYING")
        return;
      if (item.uuid === _self.userInfo.uuid && cardList) {
        handCards = cardList || [];
      }

      var Player = _self.getPlayerByUuid(item.uuid);
      if (Player) {
        handCards.length = handCards.length || _self.options.numberCardsInHand;
        Player.handCards.cardList = handCards;
        Player.renderCards(initOptions.renderCardOptions);
      }
    });
    this.desk.showRemainingDeckCard(data.deckCardRemain);
  };

  p.bindButton = function () {
    var _self = this;

    this.openCardButton = $(TWIST.HTMLTemplate['buttonBar/openCardButton']);
    this.buttonBar.append(this.openCardButton);
    this.openCardButton.unbind('click');
    this.openCardButton.click(function () {
      _self.emit("openCard");
      _self.openCardButton.hide();
    });
  };

  p.handCardSelected = function (card) {

  };

  p.STATUS_ENDING = function () {
    this.buttonBar.hide();
    this.errorPanel.empty();
  };

  p.STATUS_PLAYING = function () {
    TWIST.InRoomGame.prototype.STATUS_PLAYING.call(this);
    this.playersContainer.children.forEach(function (item, index) {
      if (!item)
        return;
      item.clearHand();
      item.setPlayerStatus("");
    });
  };

  p.endGame = function (data) {
    var _self = this;
    var listPlayers = data.listPlayers;
    listPlayers.forEach(function (item, index) {
      var player = _self.getPlayerByUuid(item);

      if (player) {
        player.setHandCardsValue(item.handCards);
        player.showThreeCards();
        player.setMoney(item.money);
        var resultText = _self.getResultTextThreeCards(item.handCards, item.rankOfHands);
        player.showMoneyExchageEffect(item.moneyExchange, parseInt(item.moneyExchange) > 0 ? "win" : "lose");
        player.setPlayerStatus(item.resultText, {x: 180, y: -70, color: "Greenyellow", font: 'bold 40px Roboto Condensed'});
      }
    });
  };


  TWIST.BaCayGame = BaCayGame;

})();
this.TWIST = this.TWIST || {};

(function () {
  "use strict";

  var statusList, cardRankList, speed, numberCard, effectQueue, bets, moneyFallingEffectTime, gameState, gameStates,
          currentEffectTurn, numberEffectCompleted, timeOutList, canvasSize, mainCardSize, winCardSize, newCard, winCardContainer, currentBetting;

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
    this.initVariable();
    $.extend(this.options, canvasSize);
    this.info = {
      betting: 1000,
      potData: {
        1000: 0,
        10000: 0,
        100000: 0
      }
    };
    TWIST.Card.RankMapIndex = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"];
    this.userInfo = {};
    this.initCanvas();
    this.initEvent();
    this.initTemplate();
    this.draw();
    this.pushEventListener();
    this.status = 'pause';
  };

  p.initVariable = function () {
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

    this._initSessionId();

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
      _self.potCards.forEach(function (item, index) {
        item.active = false;
        item.removeClass('active');
      });
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
      TWIST.Sound.play("minigame/ButtonClick");
      TWIST.Sound.play("minigame/coin_spin");
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
    TWIST.Sound.play("minigame/ButtonClick");
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
        this.resultSound = TWIST.Sound.play("minigame/Common_Click");
        _self.setBetting(item);
      });
    });

    this.setBetting(this.chipButtons[0]);
  };

  p._initSessionId = function () {
    this.sessionId = $(TWIST.HTMLTemplate['miniPoker/sessionId']);
    this.wrapperTemplate.append(this.sessionId);
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
      });
    }
    ;
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
      this.hightButton.setDisabled(true);
      this.lowButton.setDisabled(true);
      this.lowBetting.runEffect(0, {duration: 10});
      this.hightBetting.runEffect(0, {duration: 10});
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
    this.currentBetting.runEffect(data.currentBetting || 0, {duration: 300});
    if (data.currentBetting > 0) {
      if (data.currentBetting != this.info.betting) {
        TWIST.Sound.play("minigame/NormalWin");
      }
      this.supportText.text("Quân bài tiếp theo là cao hay thấp hơn ?");
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
      TWIST.Sound.play("minigame/slot_result");
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

  };

  p.getFirstCard = function (data) {
    this.changeGameState(1);
    this.changeStatus('pause');
    data.currentBetting = data.currentBetting || this.info.betting;
    this.setNewCard(data);
    this.newTurnButton.setDisabled(true);
    this.sessionId.text(data.sessionId);
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
      _self.changeStatus('pause');
      _self.setNewCard(data);
    });
  };

  p.getWin = function (data) {
    var _self = this;
    this.sessionId.text("");
    if (currentBetting > 0) {
      TWIST.Sound.play("minigame/coin_spin");
      this.moveChip.isTracking = true;
      this.moveChip.runEffect();
      this.moneyContainer.runEffect(parseInt(this.userInfo.money) + currentBetting, {duration: 500});
      this.currentBetting.runEffect(0, {duration: 500});
      this.once('_moveChipComplete', function () {
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
    var button;
    this.chipButtons.forEach(function (item, index) {
      if (item.value == data.betting) {
        button = item
      }
    });

    this.changeGameState(1);
    this.setBetting(button);
    this.setNewCard(data);
    this.drawListCard(data.listCard);
    if(!data.listCard.length){
      this.newTurnButton.setDisabled(true);
    };
    if (data.numberPotCards) {
      for (var i = 0; i < data.numberPotCards; i++) {
        this.potCards.addActiveCard()
      }
    }
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
          timeOutList, fistLog, cardRankList, repeatEffectQueue;

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
    this.initVariable();
    $.extend(this.options, gameSize);
    this.info = {
      betting: 1000,
      potData: {
        1000: 0,
        10000: 0,
        100000: 0
      }
    };
    TWIST.Card.RankMapIndex = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"];
    this.userInfo = {};
    this.initCanvas();
    this.initEvent();
    this.initTemplate();
    this.initButton();
    this.draw();
    this.pushEventListener();
    this.status = 'pause';
  };

  p.initVariable = function () {


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

    repeatEffectQueue = false;
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
        TWIST.Sound.play("minigame/Common_Click");
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
      if (_self.buttonSpin.hasClass('disabled'))
        return;
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
//            _self.endEffect();
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
      this.startSound = TWIST.Sound.play("minigame/bonus_spin");
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
    this.timeOutList.forEach(function (item) {
      clearTimeout(item);
    });
    this.timeOutList = [];
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
        this.timeOutList.push(newSpinTimeOut);
      }
    }

    if (status == "running") {
      this.resultSound && this.resultSound.stop();
      this.buttonSpin.addClass('disabled');
      this.autoSpin.find('input').attr('disabled', true);
      this.resultText.text("");
    }

    if (status == "effecting") {
      this.startSound && this.startSound.stop();
      if (this.isAutoSpin) {
        this.buttonSpin.addClass('disabled');
      } else {
        this.buttonSpin.removeClass('disabled');
      }
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
      this.resultSound = TWIST.Sound.play("minigame/NormalWin");
    } else {
      this.resultSound = TWIST.Sound.play("minigame/slot_result");
    }
    effectArray.oneTime = true;
    effectArray.forEach(function (item, index) {
      item.isTracking = true;
    });
    effectQueue.push(effectArray);
    if (this.isAutoSpin) {
      var timeOut = setTimeout(function () {
        _self.checkStart();
      }, 2000);

      this.timeOutList.push(timeOut);
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
      this.timeOutList.push(timeOut);
    }
  };

  p.endEffect = function () {
    var _self = this;
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

          if (this.isAutoSpin) {
            var newSpinTimeOut = setTimeout(function () {
              _self.status = "pause";
              _self.checkStart();
            }, 500);
            this.timeOutList.push(newSpinTimeOut);
          } else {
            _self.status = "pause";
          }
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
      oldValue = parseInt(oldValue.replace(/\,/g, ""));
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
    maxPlayers: 4,
    numberCardsInHand: 9,
    turnTime: 20000,
    numberCardsRender: 13,
    renderCardOptions: {
      showPlayerCard: true,
      dragable: true
    }
  };
  function PhomGame(wrapper, options) {
    this.wrapper = $(wrapper);
    this.options = $.extend(initOptions, options);
    this.initPhomGame();
  }

  var p = PhomGame.prototype = new TWIST.InRoomGame();

  p.initPhomGame = function (wrapper) {
    TWIST.Card.RankMapIndex = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"];
    this.initInRoomGame();
    this.bindButton();
    this.pushPhomEvent();
    this.addCheater();
  };

  p.pushPhomEvent = function () {

    this.on('getTurn', function (data) {
      this.onGetTurn(data);
    });

    this.on('getCardComplete', function (data) {
      this.getCardComplete(data);
    });

    this.on('enableEatCard', function (data) {
      this.enableEatCard(data);
    });

    this.on('enableU', function (data) {
      this.enableU(data);
    });

    this.on('enableShowPhom', function (data) {
      this.enableShowPhom(data);
    });

    this.on('enableSendCard', function (data) {
      this.enableSendCard(data);
    });

    this.on('eatCardSuccess', function (data) {
      this.eatCardSuccess(data);
    });

    this.on('moveDraftCard', function (data) {
      this.moveDraftCard(data);
    });

    this.on('showPhomComplete', function (data) {
      this.showPhom(data);
    });

    this.on('sendCardComplete', function (data) {
      this.sendCard(data);
    });

    this.on('entiretyCard', function (data) {
      this.entiretyCard(data);
    });

    this.on('setRemainCards', function (data) {
      this.setRemainCards(data);
    });
  };

  p.onGetTurn = function (data) {
    var currentUuid = data.uuid;
    var currentPlayer = this.getCurrentPlayer();
    if (currentPlayer.handCards.children.length > 0) {
      this.sortCardButton.show();
    }
    this.hitButton.hide();
    if (data.uuid === this.userInfo.uuid) {
      this.getCardButton.show();
    }
    this.setPlayerTurn(data.uuid, data.remainingTime);
  };

  p.onHitTurn = function (data) {
    var currentUuid = data.uuid;
    var currentPlayer = this.getCurrentPlayer();
    if (currentPlayer.handCards.children.length > 0) {
      this.sortCardButton.show();
    }
    this.getCardButton.hide();
    this.eatCardButton.hide();
    if (data.uuid === this.userInfo.uuid) {
      this.hitButton.show();
    } else {
      this.hitButton.hide();
    }
    this.setPlayerTurn(data.uuid, data.remainingTime);
  };

  p.getCardComplete = function (data) {
    this.getCardButton.hide();
    var card = data.cardIndex;
    var userID = data.uuid;
    var listPhom = data.listPhom;
    var player = this.getPlayerByUuid(userID);
    player.listPhom = listPhom;
    player.getDeckCard(card, listPhom);
    this.desk.showRemainingDeckCard(data.deckCardRemain);
  };

  p.enableEatCard = function () {
    this.eatCardButton.show();
  };

  p.enableU = function () {
    this.entiretyButton.show();
  };

  p.enableShowPhom = function (data) {
    var _self = this;
    var player = this.getCurrentPlayer();
    player.handCards.sortType = "suiteSort";
    player.sortPhom(data['listCard']);
    setTimeout(function () {
      player.preparedShowPhom(data['listCard']);
      _self.showPhomButton.show();
    }, 500);
  };

  p.enableSendCard = function (data) {
    var _self = this;
    var player = this.getCurrentPlayer();
    player.preparedSendCard(data['listCard']);
    setTimeout(function () {
      _self.sendCardButton.show();
    }, 500);
  };

  p.eatCardSuccess = function (data) {
    this.eatCardButton.hide();
    var hitPlayer = this.getPlayerByUuid(data.hitPlayer);
    var eatPlayer = this.getPlayerByUuid(data.eatPlayer);
    var player = this.getCurrentPlayer()
    if (eatPlayer) {
      var card;
      if (!hitPlayer) {
        card = new TWIST.Card(parseInt(data.cardIndex));
      } else {
        card = hitPlayer.getLastDraftCards(data.cardIndex);
      }
      eatPlayer.listPhom = data.listPhom;
      eatPlayer.eatCard(card);
      //this.desk.affterEatCard = true; // ????
    }
  };

  p.moveDraftCard = function (data) {
    var fromPlayer = this.getPlayerByUuid(data.fromPlayer);
    var toPlayer = this.getPlayerByUuid(data.toPlayer);
    if (fromPlayer && toPlayer) {
      var card = fromPlayer.getLastDraftCards(data.cardIndex);
      toPlayer.moveDraftCard(card, fromPlayer);
    }
  };

  p.onDraftCards = function (data) {
    TWIST.Sound.play('danh_bai');
    this.hitButton.hide();
    this.sendCardButton.hide();
    this.showPhomButton.hide();
    this.entiretyButton.hide();
    var cards = [data.cardIndex];
    var userID = data.uuid;
    var player = this.getPlayerByUuid(userID);
    player.listPhom = data.listPhom || player.listPhom;
    player.draftCardsInHand(cards, {
      cardType: TWIST.Card.draftCard
    });
    player.markEatedCard();
    this.desk.lastActivePlayer = data.uuid;
    this.desk.lastDraftCard = cards;
  };

  p.drawPlayingState = function (data) {
    this._STATUS_PLAYING();
    var players = data.players || [];
    var _self = this;

    var playingPlayer = data.playingPlayer;
    var PlayingPlayer = this.getPlayerByUuid(playingPlayer.uuid);
    if (PlayingPlayer) {
      PlayingPlayer.setRemainingTime(playingPlayer.remainingTime, this.model.turningTime);
      if (PlayingPlayer.uuid === this.userInfo.uuid) {
        this.hitButton.show();
      }
    }
    this.desk.generateCards(52, TWIST.Card.deckCard);

    players.forEach(function (item, index) {
      var handCards = [];
      var listPhom = [];

      if (item.uuid === _self.userInfo.uuid) {
        handCards = data.userListCard || [];
        handCards.sort(function (a, b) {
          return a - b;
        });
        if (handCards.length > 0) {
          _self.sortCardButton.show();
        } else {
          _self.showError({
            message: "Ván chơi đang diễn ra !"
          });
        }
        listPhom = data.listPhom;
      } else {
        handCards.length = item.numberCardsInHand || initOptions.numberCardsInHand;
      }
      var Player = _self.getPlayerByUuid(item.uuid);
      if (Player) {
        Player.handCards.cardList = handCards;
        Player.listPhom = listPhom;
        Player.renderCards(initOptions.renderCardOptions);
        if (Player.position != 0) {
          Player.reEatCards(item.eatedCards);
        }
        Player.rerenderDraftPhom(item.drarfCards);
        item.listPhom && item.listPhom.forEach(function (phom, _index) {
          Player.showSinglePhom(phom);
          (function (Player) {
            setTimeout(function () {
              Player.sortPhomArea();
            }, 550);
          })(Player);
        });
        if (item.eatedCards) {
          Player.hightLightEatCards(item.eatedCards);
        }
      }
    });
    this.desk.showRemainingDeckCard(data.deckCardRemain);
  };

  p.dealCards = function (data) {
    this._STATUS_PLAYING();
    var cardList = data.cardList;
    var players = this.model.players;
    var numberCards = this.options.maxPlayers * this.options.numberCardsRender;
    var _self = this;

    this.desk.generateCards(numberCards, TWIST.Card.deckCard);

    players.forEach(function (item, index) {
      var handCards = [];
      if (item.status !== "STATUS_PLAYING")
        return;
      if (item.uuid === _self.userInfo.uuid && cardList) {
        handCards = cardList || [];
        handCards.sort(function (a, b) {
          return a - b;
        });
      }

      if (data.firstPlayer && data.firstPlayer.uuid && item.uuid == data.firstPlayer.uuid) {
        handCards.length = _self.options.numberCardsInHand + 1;
      }

      var Player = _self.getPlayerByUuid(item.uuid);
      if (Player) {
        handCards.length = handCards.length || _self.options.numberCardsInHand;
        if (Player.position == 0) {
          Player.listPhom = data.listPhom
        }
        Player.handCards.cardList = handCards;
        Player.renderCards(initOptions.renderCardOptions);
      }
    });
    this.desk.showRemainingDeckCard(data.deckCardRemain);
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

  p.bindButton = function () {
    var _self = this;

    this.startButton.unbind('click');
    this.startButton.click(function () {
      var listCheatCard = _self.getListCheatCard();
      _self.emit("start", {
        listCheatCard: listCheatCard,
        showPlayerCards: $('#showPlayerCards').prop('checked')
      });
    });

    this.hitButton = $(TWIST.HTMLTemplate['buttonBar/hitButton']);
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

    this.sortCardButton = $(TWIST.HTMLTemplate['buttonBar/sortCardButton']);
    this.buttonBar.append(this.sortCardButton);
    this.sortCardButton.unbind('click');
    this.sortCardButton.click(function () {
      var Player = _self.getCurrentPlayer();
      Player.sortPhom();
      Player.sortCard();
    });

    this.getCardButton = $(TWIST.HTMLTemplate['buttonBar/getCardButton']);
    this.buttonBar.append(this.getCardButton);
    this.getCardButton.unbind('click');
    this.getCardButton.click(function () {
      _self.emit('getCard');
    });

    this.eatCardButton = $(TWIST.HTMLTemplate['buttonBar/eatCardButton']);
    this.buttonBar.append(this.eatCardButton);
    this.eatCardButton.unbind('click');
    this.eatCardButton.click(function () {
      _self.emit('eatCard');
    });

    this.entiretyButton = $(TWIST.HTMLTemplate['buttonBar/entiretyButton']);
    this.buttonBar.append(this.entiretyButton);
    this.entiretyButton.unbind('click');
    this.entiretyButton.click(function () {
      _self.emit('entirety');
    });

    this.sendCardButton = $(TWIST.HTMLTemplate['buttonBar/sendCardButton']);
    this.buttonBar.append(this.sendCardButton);
    this.sendCardButton.unbind('click');
    this.sendCardButton.click(function () {
      var Player = _self.getCurrentPlayer();
      var cards = Player.getSelectedCards();
      if (cards.length === 0) {
        _self.showError({
          code: 1470
        });
        return;
      }
      _self.emit('sendCard', {
        cards: cards
      });
    });

    this.showPhomButton = $(TWIST.HTMLTemplate['buttonBar/showPhomButton']);
    this.buttonBar.append(this.showPhomButton);
    this.showPhomButton.unbind('click');
    this.showPhomButton.click(function () {
      var Player = _self.getCurrentPlayer();
      var cards = Player.getSelectedCards();
      if (cards.length === 0) {
        _self.showError({
          code: 1470
        });
        return;
      }
      _self.emit('showPhom', {
        cards: cards
      });
    });

  };

  p.getListCheatCard = function (element) {
    var _self = this;
    this.createTotalCheatCardList();
    var listCardToSet = [];
    if ($('#whiteVictory').prop('checked')) {
      listCardToSet = this.createWhiteVictoryList();
    } else if ($('#hasGun').prop('checked')) {
      listCardToSet = this.createGunList();
    } else if ($('#hightCards').prop('checked')) {
      listCardToSet = this.createHightCardsList();
    } else {
      listCardToSet = [];
    }
    if ($('#hasFixedCards').prop('checked')) {
      _self.totalCheatCardList.cardList.forEach(function (item, index) {
        if ((listCardToSet.indexOf(item) === -1) && listCardToSet.length < _self.options.numberCardsInHand) {
          listCardToSet.push(item);
        }
      });
    }

//    listCardToSet = [];

    var listPlayer = this.playersContainer.children.map(function (item, index) {
      return {
        uuid: item.uuid,
        username: item.username,
        isRoomMaster: item.isRoomMaster,
        indexPosition: item.indexPosition
      };
    });
    listPlayer.sort(function (a, b) {
      return a.indexPosition - b.indexPosition
    });

    var listFullCard = [];
    for (var i = 0; i < 52; i++) {
      listFullCard.push({
        value: i,
        disabled: false
      });
    }

    listFullCard.forEach(function (item, index) {
      if (listCardToSet.indexOf(item.value) > -1) {
        item.disabled = true;
      }
    });

    listPlayer.forEach(function (item, index) {
      item.cardList = item.isRoomMaster ? listCardToSet : [];
      if (!listCardToSet.length)
        return;
      var addCardsLength = _self.options.numberCardsInHand - item.cardList.length;
      if ((_self.lastWinner && (_self.lastWinner == item.uuid)) || (!_self.lastWinner && item.isRoomMaster)) {
        addCardsLength ++;
      };
      if (addCardsLength > 0) {
        for (var i = 0; i < addCardsLength; i++) {
          addCardToPlayer(item.cardList);
        }
      }
    });

    function addCardToPlayer(cardList) {
      var remainingCards = listFullCard.filter(function (item) {
        return !item.disabled;
      });
      var cardItem = remainingCards[parseInt(Math.random() * remainingCards.length)];
      cardList.push(cardItem.value);
      var disabledCard = listFullCard.find(function (item) {
        return item.value == (cardItem && cardItem.value);
      });
      disabledCard && (disabledCard.disabled = true);
    }
    return listPlayer;
  };

  p.createWhiteVictoryList = function () {
    var whiteVictoryList = [
      "3s4c5h6d7s8c9h0djdqdkskdac", "3d3h4d5s6c7c8s9s0hjsqskcad", "3c4d5h6h7d8c9s0djcqskdas2d",
      "3s4d5d6d7c8d9d0sjcqckhac2s", "3h4s5s6d7s8c9h0h0sjcqdkdad", "3h4h5h6c6s7s8s9d0cjdqskdas",
      // 5 doi thong
      "4s4d5d5c6h6d7c7s8h8sjcjdkh", "6c6d7s7h8d8s9h9s0c0dadah2h", "3h5d8d8c9s9h0c0djsjdqcqd2s",
      "3d3s4s4d5d5c6h6d7c7sjdqckc", "6d6h7s7c8c8d9d9s0s0hacasad", "8s8c8h9s9h0s0cjsjcqdqhac2d",
      // 6 doi
      "4s4d5c5s7d7c8c8h9s9dkdkcas", "3c3h8s8h9s9c0s0dkhkcjdjh2s", "6s6h4c4d7s9s9dkckhasah2d2h",
      // Tu 2
      "3h4s5d6c8h9djhjcks2h2c2d2s", "4s4h6h8s8c9s0hjckd2s2c2h2d", "5s6c7c7h0h0cqdqckd2d2c2s2h",
      "3s4d6d6c7h9s0cjhqc2h2c2d2s", "3c3h4d5d6s0c0hkdks2s2c2h2d"];
    var randomString = whiteVictoryList[parseInt(Math.random() * whiteVictoryList.length)];
    var cardStringList = randomString.match(/.{1,2}/g);
    var rankMap = ["3", "4", "5", "6", "7", "8", "9", "0", "j", "q", "k", "a", "2"];
    var suitMap = ['s', 'c', 'd', 'h'];
    var idList = cardStringList.map(function (item, index) {
      return rankMap.indexOf(item[0]) * 4 + suitMap.indexOf(item[1]);
    });
    return idList;
  };

  p.createGunList = function () {
    var idList = [];
    var startId = 0;
    if (Math.random() < 0.5) {
      startId = parseInt(Math.random() * 11);
      for (var i = 0; i < 3; i++) {
        idList.push(startId * 4 + i)
      }
    } else {
      startId = parseInt(Math.random() * 9);
      var suilt = parseInt(Math.random() * 4);
      for (var i = 0; i < 3; i++) {
        idList.push((startId + i) * 4 + suilt);
      }
    }
    return idList;
  };


  p.reSortDraftCards = function (data) {
    var userID = data.uuid;
    var Player = this.getPlayerByUuid(userID);
    var cardType = TWIST.Card.draftCard;
    if (!Player) {
      this.showError({code: 0});
      return;
    }
    if (Player.position == 0)
      return;
    if (Player.x < 100) {
      Player.showCardsDirection = "horizontal";
      Player.indexShowCardX = 0;
    } else {
      Player.showCardsDirection = "horizontal";
      Player.indexShowCardX = -300;
    }
    Player.handCards.children.sort(function (a, b) {
      return a.cardValue - b.cardValue;
    });
    Player.handCards.children.forEach(function (item, index) {
      item.set({
        scaleX: cardType.scale * 3 / 4,
        scaleY: cardType.scale * 3 / 4,
        x: Player.indexShowCardX + index * cardType.seperator * 3 / 4,
        y: 100
      })
    });
  };

  p.showPlayersCards = function (data) {
    var _self = this;
    var cardType = TWIST.Card.draftCard;
    var currentPlayer = this.getCurrentPlayer();
    currentPlayer.showPlayersCards = true;

    data.forEach(openPlayerCards);
    function openPlayerCards(itemData) {
      var player = _self.getPlayerByUuid(itemData.uuid);
      if (player.position == 0)
        return;
      player.clearHand();
//      if (player.x < 100 || player.x > 1000) {
//        player.showCardsDirection = "vertical";
//        player.indexShowCardY = -250;
//      } else {
//        player.showCardsDirection = "horizontal";
//        player.indexShowCardX = -300;
//      }

      if (player.x < 100) {
        player.showCardsDirection = "horizontal";
        player.indexShowCardX = 0;
      } else {
        player.showCardsDirection = "horizontal";
        player.indexShowCardX = -300;
      }
      itemData.cardList.sort(function (a, b) {
        return a - b;
      });
      itemData.cardList.forEach(function (item, index) {
        var card = new TWIST.Card(item);
        player.handCards.addChild(card);
        card.set({
          scaleX: cardType.scale * 3 / 4,
          scaleY: cardType.scale * 3 / 4,
          x: player.showCardsDirection == "vertical" ? 0 : (player.indexShowCardX + index * cardType.seperator * 3 / 4),
//          y: player.showCardsDirection == "vertical" ? (player.indexShowCardY + index * cardType.height * 2 / 3) : 0,
          y: player.position == 2 ? 0 : 100
        })
      });
    }
  };

  p.handCardSelected = function (card) {

  };

  p.STATUS_ENDING = function () {
    this.buttonBar.hide();
    this.errorPanel.empty();
    this.desk.lastDraftCards = undefined;
    this.setPlayerTurn();
  };

  p.showPhom = function (data) {
    var phoms = data.phoms;
    var userID = data.uuid;
    var player = this.getPlayerByUuid(userID);
    player.showPhom(phoms);
    if (player.position == 0) {
      player.sortCard();
    }
    this.showPhomButton.hide();
  };

  p.drawPlayer = function (playerData) {
    var newPlayer = TWIST.InRoomGame.prototype.drawPlayer.call(this, playerData);
    newPlayer.addShowPhomArea();
  };

  p.sendCard = function (data) {
    var cardsSend = data.cardsSend;
    var sendPlayer = this.getPlayerByUuid(data.cardsSend[0].transFrom);
    var otherPlayerSend = (sendPlayer.position != 0);
    for (var i = 0; i < cardsSend.length; i++) {
      var dataItem = cardsSend[i];
      var receivePlayer = this.getPlayerByUuid(dataItem.transTo);
      if (receivePlayer && sendPlayer) {
        var cardList = sendPlayer.getCardsInHand(dataItem.cardList);
        cardList.forEach(function (card, index) {
          card.set({
            x: card.x + sendPlayer.x + sendPlayer.hand.x,
            y: card.y + sendPlayer.y + sendPlayer.hand.y
          });
          card.cardValue = dataItem.cardList[index];
          receivePlayer.addCardInShowPhom(card, otherPlayerSend);
        });
      }
    }
    this.playersContainer.children.forEach(function (item, index) {
      setTimeout(function () {
        item.sortPhomArea();
      }, 700);
    });
    if (sendPlayer.position == 0) {
      sendPlayer.sortCard();
    }
    this.sendCardButton.hide();
  };

  p.entiretyCard = function (data) {
    var phoms = data.phoms;
    var userID = data.uuid;
    var player = this.getPlayerByUuid(userID);
    player.showPhom(phoms);
    player.setPlayerStatus("Ù");
    this.buttonBar.children().hide();
    var _self = this;
    setTimeout(function () {
      player.sortPhomArea();
    }, 550);
  };

  p.setRemainCards = function (data) {
    var remainCards = data.remainCards;
    this.desk.showRemainingDeckCard(data.remainCards);
  };

  p.STATUS_PLAYING = function () {

  };

  p._STATUS_PLAYING = function () {
    TWIST.InRoomGame.prototype.STATUS_PLAYING.call(this);
    this.playersContainer.children.forEach(function (item, index) {
      if (!item)
        return;
      item.clearDraftCards();
      item.clearHand();
      item.clearShowPhomArea();
      item.setPlayerStatus("");
      item.numberEatedCard = 0;
    });
  };

  p.endGame = function (data, result, nomalWinType) {
    var _self = this;

    function convertRemainCards(item) {
      return item > 7 ? item - 8 : item + 44;
    }

    var winTypeMap = {
      0: "Nhất",
      1: "Nhì",
      2: "Ba",
      3: "Bét",
      4: "Móm"
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
      player.remainCards = cardList.map(convertRemainCards);
      if (parseInt(player.changeMoney) < 0) {
        player.gameResultString = player.playerResult;
      } else if (parseInt(player.changeMoney) > 0) {
        player.gameResultString = player.playerResult;
        player.isWinner = true;
        _self.lastWinner = player.uuid;
        if (player.uuid === this.userInfo.uuid) {
          resultData.isWinner = true;
        }
      } else {
        player.gameResultString = "Hòa";
      }

      if (player.showPoint && player.totalPoint) {
        player.gameResultString = player.gameResultString + " " + player.totalPoint + " điểm !";
      }

      var Player = this.getPlayerByUuid(player.uuid);
      if (Player) {
        Player.setPlayerStatus(player.playerResult);
        Player.clearTimer();
        Player.setMoney(player.money);
        Player.showMoneyExchageEffect(player.changeMoney, parseInt(player.changeMoney) > 0 ? "win" : "lose");
      }
    }
    setTimeout(function () {
      _self.showResult(resultData);
    }, 2000);
  };

  TWIST.PhomGame = PhomGame;

})();
this.TWIST = this.TWIST || {};

(function () {
  "use strict";

  var initOptions = {
    maxPlayers: 5,
    numberCardsInHand: 10,
    turnTime: 20000,
    playerConfig: {
      showCardLength: false,
      showPlayerCard: false
    }
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
    this.on("notifyOne", this.onNotifyOne);
  };

  p.bindSamButton = function () {
    var _self = this;

    this.callSamButton = $(TWIST.HTMLTemplate['buttonBar/callSamButton']);
    this.buttonBar.append(this.callSamButton);
    this.callSamButton.unbind('click');
    this.callSamButton.click(function () {
      _self.emit("call-sam");
      _self.callSamButton.hide();
    });

    this.foldSamButton = $(TWIST.HTMLTemplate['buttonBar/foldSamButton']);
    this.buttonBar.append(this.foldSamButton);
    this.foldSamButton.unbind('click');
    this.foldSamButton.click(function () {
      _self.emit("fold-sam");
      _self.foldSamButton.hide();
    });
  };

  p.onInviteSam = function (data) {
    this.desk.clear();
    this.desk.setRemainingTime(parseInt(data.remainingTime));
    this.callSamButton.show();
    this.foldSamButton.show();
    this.sortCardButton.hide();
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

  p.createWhiteVictoryList = function () {
    var whiteVictoryList = [
      // 3 Sam co
      "3d3s9d3h6c9c9s6s6d1d", "6d8s6s8d6c4h8c4c4s5s", "kcks6h6dkh6cjs2sjcjd",
      "qs6sqdqc6c4c8h4s6d4h", "5s3s3c5c8h5h8c3dks8d", "8c8s9c8djskcjd9s9djh",
      // 5 doi
      "4s4d6h6d7c7s8h8sjcjd", "6c6d7s7h8d8s9h9sadah", "8d8c10c10djsjdqcqdacad",
      "4s4d5d5c6h6djdjckckd", "6d6h7s7c9d9s10s10hasad", "8s8c10s10cjsjcqdqh2c2d",
      "4s4d7d7c8c8h9s9dkdkc", "3c3h8s8h9s9c10s10dkhkc", "6s6h4c4d9s9dasah2d2h",
      // Tu 2
      "3h4s5djhjcks2h2c2d2s", "4s4h8c9s10hjc2s2c2h2d", "7h10h10cqdqckd2d2c2s2h",
      "6c7h9s10cjhqc2h2c2d2s", "5d6s10c10hkdks2s2c2h2d",
      // Dong chat
      "3s4s5sjcjsks2h6s7s2s", "4s4h8h9d10hjd2dahqhqd"];
    var randomString = whiteVictoryList[parseInt(Math.random() * whiteVictoryList.length)];
    var cardStringList = randomString.match(/.{1,2}/g);
    var rankMap = ["3", "4", "5", "6", "7", "8", "9", "0", "j", "q", "k", "a", "2"];
    var suitMap = ['s', 'c', 'd', 'h'];
    var idList = cardStringList.map(function (item, index) {
      return rankMap.indexOf(item[0]) * 4 + suitMap.indexOf(item[1]);
    });
    return idList;
  };

  p.createGunList = function () {
    var idList = [];
    var startId = 0;
    startId = parseInt(Math.random() * 11);
    for (var i = 0; i < 4; i++) {
      idList.push(startId * 4 + i)
    }
    return idList;
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
      0: "Năm đôi",
      1: "3 sám cô",
      2: "Đồng màu",
      3: "Tứ 2",
      4: "Sảnh rồng",
      13: "Thắng",
      15: "Hòa",
      16: "Bị ăn sâm",
      17: "Bị bắt sâm",
      18: "Phạt báo 1",
      19: "Bị thua trắng",
      20: "Thua",
      21: "Bắt sâm"
    };
    this.endDemlaGame(data, winTypeMap, (data.winType == 13));
  };

  TWIST.SamGame = SamGame;

})();

this.TWIST = this.TWIST || {};

(function () {
  "use strict";

  var gameSize;

  var imagePath = location.origin + location.pathname + '../src/images/';

  var initOptions = {
    gameSize: {
      width: 1280,
      height: 720,
      position: "relative"
    },
    chipSize: {
      width: 75,
      height: 75,
      miniWidth: 24,
      miniHeight: 24,
      miniRatio: 0.33
    },
    bettingChipPositions: [{y: 640, x: 390}, {y: 640 - 11, x: 550},
      {y: 640, x: 710}, {y: 640, x: 868}],
    playerPosition: {
      x: 1215,
      y: 330
    },
    hostPosition: {
      x: 620,
      y: 60
    },
    userPosition: {
      y: 650,
      x: 210
    },
    chipSrcList: ['1st-chip.png', '2nd-chip.png', '3rd-chip.png', '4th-chip.png'],
    width: 1280,
    height: 720,
    timer: {
      x: 1165,
      y: 129,
      radius: 35
    },
    moveChipAnimationTime: 500,
    diskPosition: {
      x: 539,
      y: 155,
      width: 300,
      initWidth: 646,
      initHeight: 647,
      scale: 300 / 646
    },
    bowlPosition: {
      x: 25,
      y: 25,
      width: 534,
      height: 542
    },
    chipResultPosition: {
      x: 50,
      y: 50,
      width: 100,
      height: 100,
      diceWidth: 107,
      diceHeight: 108
    }
  };

  function TaiXiu(wrapper, options) {
    this.wrapper = $(wrapper);
    this.options = $.extend(initOptions, options);
    this.initTaiXiu();
  }

  var p = TaiXiu.prototype = new TWIST.InRoomGame();

  p.initTaiXiu = function () {
    this.initInRoomGame();
    this.initVariable();
    this.initTemplate();
    this.initButton();
    this.bindButton();
    this.pushTaiXiuEvent();
  };

  p.initVariable = function () {
    this.info = {
      betting: 1000
    };
    this.userInfo = $.extend(this.userInfo, {
      avatar: "https://s.gravatar.com/avatar/a4fae1e89a441c83f656a7ae59f9c19f?s=80",
      uuid: "",
      username: "",
      money: 0,
      isHost: false
    });
    this.imagePath = (TWIST.imagePath || imagePath) + 'taixiu/';

    this.bettingPositions = [
      {id: 0, name: "Tam nhất", top: 0, left: 0, width: 195, height: 112, types: [1, 'top-left', 'top', 'left']}
      , {id: 1, name: "Tam nhị", top: 0, left: 200 - 5, width: 135, height: 112, types: [1, 'top']}
      , {id: 2, name: "Tam tam", top: 0, left: 340 - 5, width: 135, height: 112, types: [1, 'top']}
      , {id: 3, name: "Tam trùng", top: 0, left: 480 - 5, width: 275, height: 112, types: [2, 'top']}
      , {id: 4, name: "Tam tứ", top: 0, left: 760 - 5, width: 135, height: 112, types: [1, 'top']}
      , {id: 5, name: "Tam ngũ", top: 0, left: 900 - 5, width: 135, height: 112, types: [1, 'top']}
      , {id: 6, name: "Tam lục", top: 0, left: 1040 - 5, width: 193, height: 112, types: [1, 'top', 'right', 'top-right']}
      , {id: 7, name: "Xỉu", top: 115 - 3, left: 0, width: 195, height: 215, types: [3, 'left']}
      , {id: 8, name: "Bốn điểm", top: 115 - 3, left: 200 - 5, width: 115, height: 105, types: [4]}
      , {id: 9, name: "Năm điểm", top: 115 - 3, left: 320 - 5, width: 115, height: 105, types: [4]}
      , {id: 10, name: "Sáu điểm", top: 115 - 3, left: 440 - 5, width: 115, height: 105, types: [4]}
      , {id: 11, name: "Bẩy điểm", top: 115 - 3, left: 560 - 5, width: 115, height: 105, types: [4]}
      , {id: 12, name: "Tám điểm", top: 115 - 3, left: 680 - 5, width: 115, height: 105, types: [4]}
      , {id: 13, name: "Chín điểm", top: 115 - 3, left: 800 - 5, width: 115, height: 105, types: [4]}
      , {id: 14, name: "Mười điểm", top: 115 - 3, left: 920 - 5, width: 115, height: 105, types: [4]}
      , {id: 15, name: "Tài", top: 115 - 3, left: 1040 - 5, width: 193, height: 215, types: [3, 'right']}
      , {id: 16, name: "Mười một điểm", top: 225 - 3, left: 200 - 5, width: 115, height: 105, types: [4, 7]}
      , {id: 17, name: "Mười hai điểm", top: 225 - 3, left: 320 - 5, width: 115, height: 105, types: [4, 7]}
      , {id: 18, name: "Mười ba điểm", top: 225 - 3, left: 440 - 5, width: 115, height: 105, types: [4, 7]}
      , {id: 19, name: "Mười bốn điểm", top: 225 - 3, left: 560 - 5, width: 115, height: 105, types: [4, 7]}
      , {id: 20, name: "Mười lăm điểm", top: 225 - 3, left: 680 - 5, width: 115, height: 105, types: [4, 7]}
      , {id: 21, name: "Mười sáu điểm", top: 225 - 3, left: 800 - 5, width: 115, height: 105, types: [4, 7]}
      , {id: 22, name: "Mười bẩy điểm", top: 225 - 3, left: 920 - 5, width: 115, height: 105, types: [4, 7]}
      , {id: 23, name: "Chẵn", top: 335 - 3, left: 0, width: 195, height: 105, types: [6, 'left', 'bottom-left', 'bottom']}
      , {id: 24, name: "Nhất", top: 335 - 3, left: 200 - 5, width: 135, height: 105, types: [5, 'bottom']}
      , {id: 25, name: "Nhị", top: 335 - 3, left: 340 - 5, width: 135, height: 105, types: [5, 'bottom']}
      , {id: 26, name: "Tam", top: 335 - 3, left: 480 - 5, width: 135, height: 105, types: [5, 'bottom']}
      , {id: 27, name: "Tứ", top: 335 - 3, left: 620 - 5, width: 135, height: 105, types: [5, 'bottom']}
      , {id: 28, name: "Ngũ", top: 335 - 3, left: 760 - 5, width: 135, height: 105, types: [5, 'bottom']}
      , {id: 29, name: "Lục", top: 335 - 3, left: 900 - 5, width: 135, height: 105, types: [5, 'bottom']}
      , {id: 30, name: "Lẻ", top: 335 - 3, left: 1040 - 5, width: 193, height: 105, types: [6, 'bottom', 'right', 'bottom-right']}
    ];

    this.bettingPositions.reverse();
    this.statusList = {
      1: "STATUS_WAITING_FOR_START",
      2: "STATUS_SHAKE_DISK",
      3: "STATUS_BETTING",
      4: "STATUS_ARRANGING",
      5: "END_GAME"
    };
  };

  p.bindButton = function () {

  };

  p.drawRoom = function () {
    this.desk = new TWIST.Desk(this.options);
    this.desk.name = "desk";
    this.stage.addChild(this.desk);
    this.wrapper.css(initOptions.gameSize);
  };

  p.drawGameInfo = function (data) {

    this.setHost(data.host);
    this.changeStatus(data);
    this.roomBetting = data.betting;
    this.setBettingChipValue(data.listBettingChip);
    this.addHistoryList(data.historyList);
    this.drawBettingPositions(data.bettingPositions);
  };

  p.initButtonBar = function () {};

  p.initInviteList = function () {};

  p.initResultPanel = function () {};

  p.initTemplate = function () {
    var _self = this;
    var wrapperTemplate = document.createElement('div');
    wrapperTemplate.id = "taixiu-wrapper";
    wrapperTemplate.className = "taixiu-wrapper";
    this.wrapperTemplate = $(wrapperTemplate);
    this.wrapper.append(wrapperTemplate);

    this.initBettingPositionList();

    this.initProfile();

    this.initHost();

    this.initTotalTable();

    this.initGameCanvas();

    this.initVitualBetting();

    this.initListPlayer();

    this.initChipButton();

    this.initSellPopup();

    this.initHistory();

    this.wrapperTemplate.append(this.errorPanel);

    this.effectWrapper = $(TWIST.HTMLTemplate['effect/wrapper']);
    this.wrapperTemplate.append(this.effectWrapper);

    this.money = this.user.find('.money');

    this.setBetting(this.chipButtons[0]);
  };

  p.setBetting = function (item) {
    if (this.chipButtons.active) {
      this.chipButtons.forEach(function (_item, _index) {
        _item.template.removeClass('active');
      });
      item.template.addClass('active');
      this.currentBetting = item;
    }
  };

  p.pushTaiXiuEvent = function () {
    var _self = this;

    this.on("userInfo", function () {
      _self.renderUserInfo(arguments[0]);
    });

    this.on("userBetting", function (data) {
      _self.userBetting(data);
    });

    this.on("updateBettings", function (data) {
      _self.updateBettings(data);
      _self.emit('getListPlayer');
    });

    this.on("updateListPlayer", function (data) {
      this.listPlayer.html(data.count || "1");
    });

    this.on("xocDia", function (data) {
      _self.xocDia(data);
    });

    this.on("endXocDia", function (data) {
      _self.endXocDia(data);
    });

    this.on("openDisk", function (data) {
      _self.openDisk(data);
    });

    this.on("hostPayment", function (data) {
      _self.hostPaymentData = data;
    });

    this.on("changeHost", function (data) {
      _self.setHost(data);
    });

    this.on("suggetstHost", function (data) {
//      _self.getHostButton.show();
      _self.isSuggestHost = true;
    });

    this.on("reBettingResult", function (data) {
      _self.reBetting(data);
    });

    this.on("resignationSuccess", function (data) {
      _self.setHost();
    });

    this.on("cancelBettingResult", function (data) {
      _self.cancelBetting(data);
    });

    this.on("sellBettingResult", function (data) {
      _self.showError({
        message: "Bán cửa thành công !"
      });
    });

    this.on("historyToggle", function (data) {
      _self.history.toggle();
    });
  };

  p.cancelBetting = function (data) {
    var _self = this;
    this.totalTable.setTotalBetting(0);
    this.cancelBettingButton.hide();
    this.bettingPositions.forEach(function (item, index) {
      _self.moveChipToUser(item.id, item.mineValue);
      item.setMineBetting(0);
    });
  };

  p.hostPaymentPhase1 = function () {
    var _self = this;
    var data = this.hostPaymentData;
    this.totalTable.setTotalWin(data && data.changeMoney);
    if (!data)
      return;
    this.bettingPositions.hasChipsMove = false;
    this.bettingPositions.forEach(function (item, index) {
      if (!item.status) {
        _self.moveChipToHost(item.id);
        item.setMineBetting(0);
        item.setTotalBetting(0);
      }
    });
    if (!this.bettingPositions.hasChipsMove) {
      _self.hostPaymentPhase2();
    }
  };

  p.hostPaymentPhase2 = function () {
    var _self = this;
    var data = this.hostPaymentData;
    if (!data)
      return;
    TWIST.Sound.play("chip/multichip");
    if (this.userInfo.isHost) {
      this.showChangeMoney(data);
    }
    this.bettingPositions.forEach(function (item, index) {
      if (item.status) {
        _self.paymentChipToSlotBetting(item.id, item.totalValue * item.ratio);
        item.setTotalBetting(item.totalValue * (item.ratio + 1));
        item.setMineBetting(item.mineValue * (item.ratio + 1));
      }
    });
  };

  p.showChangeMoney = function (data) {
    this.userInfo.money = data.money;
    this.userMoney.runEffect(this.userInfo.money);
    var jElement = $(TWIST.HTMLTemplate['taiXiu/changeMoney']);
    this.user.append(jElement);
    jElement.text(Global.numberWithDot3(parseInt(data.changeMoney)));
    jElement.one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function () {
      jElement.remove();
    });
    if (data.changeMoney >= 0) {
      jElement.addClass("plus");
    }
  };

  p.hostPaymentPhase3 = function () {
    var _self = this;
    var data = this.hostPaymentData;
    if (!data)
      return;
    if (!this.userInfo.isHost) {
      this.showChangeMoney(data);
    }
    TWIST.Sound.play("chip/multichip");
    this.bettingPositions.forEach(function (item, index) {
      if (item.status) {
        (function (mineValue, totalValue) {
          setTimeout(function () {
            _self.moveChipToPlayers(item.id, mineValue, totalValue);
          }, 500);
        })(item.mineValue, item.totalValue);
        item.setMineBetting(0);
        item.setTotalBetting(0);
      }
    });
  };

  p.paymentChipToSlotBetting = function (id, value) {
    var _self = this;
    var listChip = this.convertValueToChips(value);
    var waitAnimationStep = 300 / listChip.length;
    listChip.forEach(function (item, index) {
      _self.timeOutList.push(setTimeout(function () {
        _self.paymentChipAction(id, item);
      }, waitAnimationStep * index));
    });
  };

  p.moveChipToHost = function (id) {
    var _self = this;
    var chipContainer = this.moveChipContainer.children.find(function (item, index) {
      return item.name == id;
    });
    var listChip = chipContainer.children;
    var length = listChip.length;
    if (length > 0)
      this.bettingPositions.hasChipsMove = true;
    _self._numberChipMove = _self._numberChipMove || 0;
    listChip.forEach(function (item, index) {
      var fromPosition = item.localToGlobal(0, 0);
      var toPosition = _self.userInfo.isHost ? initOptions.userPosition : initOptions.hostPosition;
      setTimeout(function () {
        _self._numberChipMove++;
        _self.stage.addChild(item);
        item.move(fromPosition, toPosition, function () {
          _self.stage.removeChild(item);
          _self._numberChipMove--;
          if (!_self._numberChipMove) {
            setTimeout(function () {
              _self.hostPaymentPhase2();
            }, 500);
          }
        });
      }, 300 / length * index);
    });
  };

  p.moveChipToUser = function (id, value) {
    var _self = this;
    var chipContainer = this.moveChipContainer.children.find(function (item, index) {
      return item.name == id;
    });
    var listChip = chipContainer.children;
    var position = initOptions.userPosition;
    this.moveChipsToPosition(value, listChip, position);
  };

  p.moveChipToPlayers = function (id, mineValue, totalValue) {
    var _self = this;
    var chipContainer = this.moveChipContainer.children.find(function (item, index) {
      return item.name == id;
    });
    var listChip = chipContainer.children;
    if (mineValue) {
      this.moveChipsToPosition(mineValue, listChip, initOptions.userPosition);
    }
    this.moveRemainChipToPlayers(listChip, initOptions.playerPosition);
  };

  p.moveChipsToPosition = function (value, listChip, position) {
    var _self = this;
    var listReturnChip = this.convertValueToChipContainers(value, listChip);
    var length = listReturnChip.length;
    listReturnChip.forEach(function (item, index) {
      var fromPosition = item.localToGlobal(0, 0);
      var toPosition = position;
      item.set(fromPosition);
      _self.stage.addChild(item);
      setTimeout(function () {
        item.move(fromPosition, toPosition, function () {
          _self.stage.removeChild(item);
        });
      }, 300 / length * index);
    });
  };


  p.moveRemainChipToPlayers = function (listChip, position) {
    var _self = this;
    var length = listChip.length;

    listChip.forEach(function (item, index) {
      var chip = item;
      if (chip) {
        var fromPosition = chip.localToGlobal(0, 0);
        var toPosition = position;
        setTimeout(function () {
          _self.stage.addChild(chip);
          chip.move(fromPosition, toPosition, function () {
            _self.stage.removeChild(chip);
          });
        }, 300 / length * index);
      }
    });
  };

  p.userBetting = function (data) {
    this.totalTable.totalBettingValue += this.currentBetting.value;
    this.totalTable.setTotalBetting(this.totalTable.totalBettingValue);
    var _self = this;
    var bettingPosition = this.bettingPositions.find(function (item, index) {
      return item.id == data.id;
    });
    TWIST.Sound.play("chip/singlechip");
    this.reBettingButton.hide();
    this.cancelBettingButton.show();
    bettingPosition.setMineBetting(data.mineBetting);
    bettingPosition.setTotalBetting(data.totalBetting);
    var currentBettingID = this.currentBetting.id;
    this.bettingChipAction(data.id, currentBettingID, true);
  };

  p.updateBettings = function (data) {
    var _self = this;
    this.bettingPositions.forEach(function (item, index) {
      var dataItem = data.find(function (_item, _index) {
        return _item.id == item.id;
      });
      if (!dataItem)
        return;
      _self.playersBetting(item, dataItem.totalBetting - item.totalValue);
      item.setTotalBetting(dataItem.totalBetting);
    });
  };

  p.reBetting = function (data) {
    TWIST.Sound.play("chip/multichip");
    var _self = this;
    this.reBettingButton.hide();
    this.cancelBettingButton.show();
    this.bettingPositions.forEach(function (item, index) {
      var dataItem = data.find(function (_item, _index) {
        return _item.id == item.id;
      });
      if (!dataItem)
        return;
      item.setMineBetting(dataItem.mineBetting);
      if (dataItem.mineBetting)
        _self.totalTable.totalBettingValue += parseInt(dataItem.mineBetting);
      item.setTotalBetting(dataItem.totalBetting);
      _self.userReBetting(item, dataItem.mineBetting);
    });
    this.totalTable.setTotalBetting(this.totalTable.totalBettingValue);
  };

  p.bettingChipAction = function (bettingId, currentBettingID, isMine) {

    var bettingSlot = this.moveChipContainer.getChildByName(bettingId);
    var chip = this.createChip(currentBettingID);
    chip.isMine = isMine;
    var bettingChipPosition = isMine ? initOptions.bettingChipPositions[currentBettingID] : initOptions.playerPosition;
    var fromPosition = {
      x: bettingChipPosition.x - bettingSlot.x,
      y: bettingChipPosition.y - bettingSlot.y
    };

    var toPosition = {
      x: Math.random() * (bettingSlot.width - initOptions.chipSize.miniWidth),
      y: Math.random() * (bettingSlot.height - initOptions.chipSize.miniHeight)
    };
    bettingSlot.addChild(chip);
    chip.move(fromPosition, toPosition);
  };

  p.paymentChipAction = function (bettingId, currentBettingID) {
    var _self = this;
    var bettingSlot = this.moveChipContainer.getChildByName(bettingId);
    var chip = this.createChip(currentBettingID);
    var paymentChipPosition = this.userInfo.isHost ? initOptions.userPosition : initOptions.hostPosition;
    var fromPosition = {
      x: paymentChipPosition.x - bettingSlot.x,
      y: paymentChipPosition.y - bettingSlot.y
    };

    var toPosition = {
      x: Math.random() * (bettingSlot.width - initOptions.chipSize.miniWidth),
      y: Math.random() * (bettingSlot.height - initOptions.chipSize.miniHeight)
    };
    bettingSlot.addChild(chip);
    this._numberChipMove = this._numberChipMove || 0;
    this._numberChipMove++;
    chip.move(fromPosition, toPosition, function () {
      _self._numberChipMove--;
      if (!_self._numberChipMove) {
        _self.hostPaymentPhase3();
      }
    });
  };

  p.playersBetting = function (slotBetting, value) {
    var _self = this;
    var listChip = this.convertValueToChips(value);
    var waitAnimationStep = 1000 / listChip.length;
    listChip.forEach(function (item, index) {
      _self.timeOutList.push(setTimeout(function () {
        _self.bettingChipAction(slotBetting.id, item);
      }, waitAnimationStep * index));
    });
  };

  p.userReBetting = function (slotBetting, value) {
    var _self = this;
    var listChip = this.convertValueToChips(value);
    var waitAnimationStep = 500 / listChip.length;
    listChip.forEach(function (item, index) {
      _self.timeOutList.push(setTimeout(function () {
        _self.bettingChipAction(slotBetting.id, item, true);
      }, waitAnimationStep * index));
    });
  };

  p.convertValueToChips = function (value) {
    var listChip = [];
    var unit = this.chipButtons[0].value;
    var totalArray = [];
    var totalValue = 0;
    this.chipButtons.forEach(function (item, index) {
      totalValue += item.value * item.concentration;
      for (var i = 0; i < item.concentration; i++) {
        totalArray.push(item.id);
      }
    });
    var quantityOfTotalUnit = parseInt(value / totalValue);
    for (var i = 0; i < quantityOfTotalUnit; i++) {
      listChip = listChip.concat(totalArray);
    }
    var quantityOfUnit = parseInt((value % totalValue) / unit);
    for (var i = 0; i < quantityOfUnit; i++) {
      listChip.push(this.chipButtons[0].id);
    }
    return Global.shuffle(listChip);
  };

  p.convertValueToChipContainers = function (initValue, listChip) {
    var returnChips = [];
    var currentValue = initValue;
    var flag = true;

    var listChipValue = this.chipButtons.map(function (item, index) {
      return item.value;
    });
    listChipValue.sort(function (a, b) {
      return b - a;
    });

    var currentChipValue = getCurrentChipValue(initValue);

    while (checkFlag()) {
      getChipTypeByValue();
    }

    return returnChips;

    function checkFlag() {
      flag = (currentValue >= currentChipValue);
      return flag;
    }

    function getCurrentChipValue(currentValue) {
      listChipValue = listChipValue.filter(function (item, index) {
        return currentValue >= item;
      });
      return listChipValue[0];
    }

    function getChipTypeByValue() {
      currentChipValue = getCurrentChipValue(currentValue);
      if (!currentChipValue)
        return;
      var newChip = listChip.find(function (item, index) {
        return (item.value == currentChipValue && !item._isChecked);
      });
      if (newChip) {
        currentValue -= currentChipValue;
        returnChips.push(newChip);
        newChip._isChecked = true;
      } else {
        listChipValue.shift();
        getChipTypeByValue();
      }
    }
  };

  p.xocDia = function () {
    var _self = this;
    var message, position, animationTime;
    animationTime = 80;
    if (this.status === 'STATUS_SHAKE_DISK') {
      position = {
//        x: initOptions.diskPosition.x + ((Math.random() - 0.5) < 0 ? -1 : 1) * (Math.random() * 10 + 10),
//        y: initOptions.diskPosition.shakeY + (this.diskContainer.isTop ? -1 : 1) * (Math.random() * 10 + 10),
        y: this.diskContainer.isTop ? initOptions.diskPosition.shakeY : initOptions.diskPosition.shakeY + initOptions.diskPosition.width * 0.05,
//        scaleY: this.diskContainer.isTop ? initOptions.diskPosition.scaleY : initOptions.diskPosition.scaleY * 0.8
      };
      message = 'xocDia';
    } else {
      position = {
        y: initOptions.diskPosition.shakeY,
        scaleY: initOptions.diskPosition.scaleY
      };
      message = 'endXocDia';
    }
    createjs.Tween.get(this.diskContainer)
            .to(position, animationTime)
            .call(function () {
              _self.diskContainer.isTop = !_self.diskContainer.isTop;
              _self.emit(message);
            });
  };

  p.endXocDia = function () {
    var _self = this;
    createjs.Tween.get(this.diskContainer)
            .to({
              y: initOptions.diskPosition.y
            }, 1500)
            .call(function () {
              _self.history._toggle(true);
            });
  };

  p.showResult = function (data) {

    var _self = this;
    this.playResultSounds(data);
    var newY = initOptions.bowlPosition.y - initOptions.bowlPosition.height;
    this.history.addResult(data.map.map(function (item) {
      return item + 1;
    }));
    var message, position;
    this.chipResultContainer.removeAllChildren();
    var shuffleMap = Global.shuffle(data.map)
    shuffleMap.forEach(function (item, index) {
      _self.createResultDice(item, index);
    });
    this.bowl.set({
      y: initOptions.bowlPosition.y
    });
    createjs.Tween.get(this.bowl)
            .to({
              y: newY
            }, 1000)
            .call(function () {
              _self.hostPaymentPhase1();
            });
    this.bettingPositions.forEach(function (item, index) {
      item.setStatus(data.winnerSlots);
    });
  };

  p.playResultSounds = function (data) {
    var map = data.map;
    var winnerSlots = data.winnerSlots;

    var resultNumber = 0;
    data.map.forEach(function (item, index) {
      resultNumber += (item + 1);
    });
    var firstResultSound = "";
    var seconResultSound = "";
    var thirdResultSound = "";
    var resultSounds = [];
    var initSrcs = ['news/ddungdatcuoc', 'news/mobat'];
    
    var trippTypeMap = ["news/nhat", "news/nhi", "news/tam", "news/tu", "news/ngu", "news/luc"];
    var numberTypeMap = ["news/so_4", "news/so_5", "news/so_6", "news/so_7", "news/so_8", "news/so_9", "news/so_10"
      ,["news/so_10", "news/so_1"],["news/so_10", "news/so_2"],["news/so_10", "news/so_3"],["news/so_10", "news/so_4"]
      ,["news/so_10", "news/so_5"],["news/so_10", "news/so_6"],["news/so_10", "news/so_7"]];

    var trippleType = [0, 1, 2, 4, 5, 6].findIndex(function (item, index) {
      return winnerSlots.indexOf(item) > -1;
    });

    var numberType = [8, 9, 10, 11, 12, 13, 14, 16, 17, 18, 19, 20, 21, 22].findIndex(function (item, index) {
      return winnerSlots.indexOf(item) > -1;
    });

    var isTrippleType = (trippleType > -1);
    firstResultSound = isTrippleType ? "news/dong" : 'news/tong';
    seconResultSound = isTrippleType ? trippTypeMap[trippleType] : numberTypeMap[numberType];
    console.log("numberType",numberType);
    if(!isTrippleType && numberType > - 1){
      thirdResultSound = numberType < 7 ? "news/xiu" : "news/tai";
    }
    
    var srcs = [initSrcs,firstResultSound,seconResultSound,thirdResultSound];
    var playSrc = [];
    srcs.forEach(function (item){
      if(item instanceof Array){
        playSrc = playSrc.concat(item);
      }else if(item){
        playSrc.push(item);
      }
    }); 
    TWIST.Sound.playQueue(playSrc);
  };

  p.openDisk = function (data) {
    this.history._toggle(false);
    var _self = this;
    var message, position, animationTime;
    position = {
      x: initOptions.diskPosition.x,
      y: initOptions.diskPosition.shakeY
    };
    createjs.Tween.get(this.diskContainer)
            .to(position, 1000)
            .call(function () {
              _self.showResult(data);
            });
  };

  p.closeDisk = function (data) {
    this.history._toggle(false);
    createjs.Tween.get(this.bowl)
            .to(initOptions.bowlPosition, 1000)
            .call(function () {});
  };

  p.createResultDice = function (id, index) {
    var src = this.imagePath + "dice" + (id + 1) + "-big.png";
    var resultChip = new createjs.Bitmap(src);
    var unitWidth = this.chipResultContainer.width / 2;
    var unitHeight = this.chipResultContainer.height / 2;
    var scale = initOptions.diskPosition.scaleX;
    var resultChipPosition = {
      x: (Math.random() * (unitWidth - initOptions.chipResultPosition.diceWidth)) + (parseInt(index / 2) * unitWidth),
      y: (Math.random() * (unitHeight - initOptions.chipResultPosition.diceHeight) + (parseInt(index % 2) * unitHeight))
    };
    resultChip.set(resultChipPosition);
    this.chipResultContainer.addChild(resultChip);
    return resultChip;
  };

  p.createChip = function (id) {
    var _self = this;
    var chipSize = initOptions.chipSize;
    var image = this.chipImages[id];
    var chip = new createjs.Bitmap(image);
    var value = this.chipButtons.find(function (item, index) {
      return item.id == id;
    }).value;
    chip.set({
      scaleX: chipSize.miniRatio,
      scaleY: chipSize.miniRatio,
      type: id,
      value: value
    });
    chip.move = function (fromPosition, toPosition, callback) {
      chip.set(fromPosition);
      var newX = toPosition.x + (Math.random() - 0.5) * 5;
      var newY = toPosition.y + (Math.random() - 0.5) * 5;
      createjs.Tween.get(chip)
              .to({
                x: newX,
                y: newY
              }, initOptions.moveChipAnimationTime)
              .call(function () {
                if (typeof callback === 'function') {
                  callback();
                }
              });
    };
    return chip;
  };

  p.renderUserInfo = function () {
    var avatarContainer = this.user.find('.avatar');
    var usernameContainer = this.user.find('.username');
    avatarContainer.css("background-image", "url(" + (this.userInfo.avatar ? ("./" + this.userInfo.avatar) : initOptions.avatar) + ")");
    usernameContainer.text(this.userInfo.username);
    this.userMoney.runEffect(this.userInfo.money);
  };

  p.initHistory = function () {
    var _self = this;
    this.history = $(TWIST.HTMLTemplate['taiXiu/history']);
    this.wrapperTemplate.append(this.history);
    this.historyInner = this.history.find('.history');
    this.historyList = [];
    this.history._toggle = function (active) {
      if (typeof active !== "undefined") {
        if (active) {
          _self.historyInner.addClass('active');
        } else {
          _self.historyInner.removeClass('active');
        }
      } else {
        _self.historyInner.toggleClass('active');
      }
    };
    this.historyInner.on('click', function () {
      _self.history._toggle();
    });
    this.history.addResult = function (map) {
      var data = map;
      var resultTemplate = $(TWIST.HTMLTemplate['taiXiu/history-item']);
      var itemType = resultTemplate.find('.history-item-type');
      var resultNumber = 0;
      map.forEach(function (item, index) {
        resultNumber += (item);
        var dicePosition = resultTemplate.find('#dice-position' + index);
        dicePosition.addClass("dice" + (item - 1));
      });

      var isTai = (resultNumber < 18 && resultNumber > 10);
      var isXiu = (resultNumber < 11 && resultNumber > 3);
      var itemType = resultTemplate.find('.history-item-type');
      isTai && itemType.addClass('tai');
      isXiu && itemType.addClass('xiu');
      var itemNumber = resultTemplate.find('.history-item-number');
      itemNumber.html(resultNumber);
      _self.historyInner.append(resultTemplate);
      _self.historyList.push(resultTemplate);

      if (_self.historyList.length > 15) {
        _self.historyList[0].remove();
        _self.historyList.shift();
      }

    };
  };

  p.addHistoryList = function (historyList) {
    var _self = this;
    historyList.forEach(function (item, index) {
      _self.history.addResult(item);
    });
  };

  p.initHost = function () {
    var _self = this;
    this.host = $(TWIST.HTMLTemplate['taiXiu/host']);
    this.wrapperTemplate.append(this.host);
    this.host.background = this.host.find('.host-background');
    this.host.hostName = this.host.find('.host-name');
    this.host.chatBox = this.host.find('.chat-box');
    this.host.hostMessage = this.host.find('.chat-box-inner');
    this.host.setMessage = function (message) {
      if (message) {
        this.show();
        this.hostMessage.html(message);
      } else {
        this.hide();
      }
    };
  };

  p.initTotalTable = function () {
    var _self = this;
    this.totalTable = $(TWIST.HTMLTemplate['taiXiu/totalTable']);
    this.wrapperTemplate.append(this.totalTable);

    this.totalTable.totalBetting = this.totalTable.find('.total-table-betting');
    this.totalTable.totalWin = this.totalTable.find('.total-table-win');

    this.addNumberEffect(this.totalTable.totalBetting);
    this.addNumberEffect(this.totalTable.totalWin);

    this.totalTable.setTotalBetting = function (value) {
      this.totalBettingValue = value;
      _self.totalBettingValue = value;
      this.totalBetting.runEffect(value);
    };
    this.totalTable.setTotalWin = function (value) {
      this.totalWinValue = value;
      this.totalWin.runEffect(value);
    };
  };

  p.setHost = function (host) {
    this.host.hostName.removeClass('active');
    this.userInfo.isHost = ((host && host.uuid) == this.userInfo.uuid);
    this.resignationButton.hide();
    if (this.userInfo.isHost) {
      this.showError({
        message: "Bạn đã làm nhà cái !"
      });
    }
    this.setShowChipButtons();
    if (host && host.username) {
      this.host.name = host.username;
      this.getHostButton.hide();
      this.host.hostName.addClass('active');
      this.host.hostName.html(host.username);
    } else {
      this.host.name = undefined;
    }
  };

  p.initListPlayer = function () {
    var _self = this;
    this.listPlayer = $(TWIST.HTMLTemplate['taiXiu/listPlayer']);
    this.wrapperTemplate.append(this.listPlayer);
    this.listPlayer.on('click', function () {
      _self.activeListPlayer = true;
      _self.emit('getListPlayer');
    });
  };

  p.initBettingPositionList = function () {
    var _self = this;
    this.table = $(TWIST.HTMLTemplate['taiXiu/table']);
    this.wrapperTemplate.append(this.table);
    var bettingPositions = this.bettingPositions;
    var fragment = document.createDocumentFragment();
    bettingPositions.forEach(function (item, index) {
      var element = _self.createBettingPosition(item, index);
      fragment.append(element);
    });
    this.table.append(fragment);

    bettingPositions.forEach(function (item, index) {
      var element = _self.setBettingPositionsPrototype(item, index);
    });

    var overTable = $('<div class="over-table">');
    this.wrapperTemplate.append(overTable);
  };

  p.initVitualBetting = function () {
    var _self = this;
    var bettingPositions = this.bettingPositions;

    var vitualBettingWrapper = $('<div class="vitual-table">');
    this.wrapperTemplate.append(vitualBettingWrapper);

    var fragment = document.createDocumentFragment();
    bettingPositions.forEach(function (item, index) {
      var element = _self.createVitualBetting(item, index);
      fragment.append(element);
    });
    vitualBettingWrapper.append(fragment);

    bettingPositions.forEach(function (item, index) {
      var element = _self.setVitualBettingPrototype(item, index);
    });
  };

  p.initProfile = function () {
    this.user = $(TWIST.HTMLTemplate['taiXiu/user']);
    this.wrapperTemplate.append(this.user);
    this.userMoney = this.user.find('.money');
    this.addNumberEffect(this.userMoney);
  };

  p.initGameCanvas = function () {
    this.wrapperTemplate.append(this.canvas);

    this.initDisk();

    this.initMoveChipContainer();

    var config = initOptions.timer;
    this.desk.createTimer({
      x: config.x - config.radius,
      y: config.y - config.radius,
      radius: config.radius,
      strokeThick: 5,
      __type: 1
    });

    this.stage.addChild(this.moveChipContainer, this.diskContainer, this.desk);
  };

  p.initChipButton = function () {
    var _self = this;
    this.chipWrapper = $(TWIST.HTMLTemplate['taiXiu/chips']);
    this.wrapperTemplate.append(this.chipWrapper);

    this.chipImages = [new Image(), new Image(), new Image(), new Image()];
    this.chipImages[0].src = this.imagePath + "1st-chip.png";
    this.chipImages[1].src = this.imagePath + "2nd-chip.png";
    this.chipImages[2].src = this.imagePath + "3rd-chip.png";
    this.chipImages[3].src = this.imagePath + "4th-chip.png";


    this.chipButtons = [{
        id: 0,
        value: 1000,
        concentration: 1,
        template: this.chipWrapper.find('.chip-1st')
      }, {
        id: 1,
        value: 10000,
        concentration: 1,
        template: this.chipWrapper.find('.chip-2nd')
      }, {
        id: 2,
        value: 100000,
        concentration: 1,
        template: this.chipWrapper.find('.chip-3rd')
      }, {
        id: 3,
        value: 1000000,
        concentration: 1,
        template: this.chipWrapper.find('.chip-4th')
      }];
    this.chipButtons.active = true;
    this.chipButtons.forEach(function (item, index) {
      item.template.on('click', function () {
        TWIST.Sound.play("minigame/Common_Click");
        _self.setBetting(item);
      });
    });
  };

  p.initSellPopup = function () {
    var _self = this;
    this.sellPopup = $(TWIST.HTMLTemplate['taiXiu/sellPopup']);
    var bettingData;
    this.sellPopup.initPopup = function (data) {
      bettingData = data;
      var maxValue = data.totalValue;
      _self.sellPopup.maxValue = maxValue;
      _self.sellPopup.plusButton.html(maxValue);
      _self.sellPopup.title.html(data.name);
    };
    this.wrapperTemplate.append(this.sellPopup);
    var minLeft = 5;
    var maxLeft = 256;
    this.sellPopup.hide();
    function hide() {
      _self.sellPopup.hide();
    }

    function setMin() {
      _self.sellPopup.scroller.css('left', 0);
      setRatio(0);
    }

    function setMax() {
      _self.sellPopup.scroller.css('left', maxLeft);
      setRatio(1);
    }

    function emitSell() {
      var emitData = {
        id: bettingData.id,
        value: _self.sellPopup.currentValue
      };
      _self.sellPopup.hide();
      _self.emit("sellBetting", emitData);
    }

    function setRatio(ratio) {
      _self.sellPopup.dragbarInner.css('width', ratio * maxLeft + minLeft);
      var currentValue = parseInt(ratio * _self.sellPopup.maxValue);
      _self.sellPopup.currentValue = currentValue;
      _self.sellPopup.scrollerValue.html(currentValue);
    }

    this.sellPopup.title = this.sellPopup.find('.sell-popup-title');
    this.sellPopup.background = this.sellPopup.find('.sell-popup-background');
    this.sellPopup.background.on('click', hide);
    this.sellPopup.cancel = this.sellPopup.find('#cancel');
    this.sellPopup.cancel.on('click', hide);
    this.sellPopup.accept = this.sellPopup.find('#accept');
    this.sellPopup.accept.on('click', emitSell);
    this.sellPopup.minusButton = this.sellPopup.find('.sell-popup-minus');
    this.sellPopup.minusButton.on('click', setMin);
    this.sellPopup.plusButton = this.sellPopup.find('.sell-popup-plus');
    this.sellPopup.plusButton.on('click', setMax);

    this.sellPopup.dragbarInner = this.sellPopup.find('.sell-popup-dragbar-inner');

    this.sellPopup.scroller = this.sellPopup.find('#scroller');
    this.sellPopup.scrollerValue = this.sellPopup.scroller.find('.sell-popup-scroller-content');
    var optionDraggable = {
      axis: "x",
      scroll: false,
      containment: "#sell-popup-drag-container",
      drag: function (event, ui) {
        var ratio = ui.position.left / maxLeft;
        setRatio(ratio);
      }
    };
    this.sellPopup.scroller.draggable(optionDraggable);
  };

  p.showSellPopup = function () {

    var _self = this;
    var selectedBetting = this.bettingPositions.find(function (item, index) {
      return item.isSelected;
    });
    if (selectedBetting) {
      if (selectedBetting.totalValue) {
        this.sellPopup.show();
        this.sellPopup.initPopup(selectedBetting);
      }
    } else {
      this.showError({
        message: "Chưa chọn cửa bán !"
      });
    }
  };

  p.initButton = function () {
    var _self = this;

    this.buttons = [];

    var buttonWrapper = $(TWIST.HTMLTemplate['taiXiu/buttons']);

    this.wrapperTemplate.append(buttonWrapper);

    this.reBettingButton = buttonWrapper.find('#reBetting');
    this.buttons.push(this.reBettingButton);
    this.reBettingButton.on('click', function () {
      _self._listenChangeMoney = true;
      _self.emit("reBetting");
    });

    this.cancelBettingButton = buttonWrapper.find('#cancelBetting');
    this.buttons.push(this.cancelBettingButton);
    this.cancelBettingButton.on('click', function () {
      _self._listenChangeMoney = true;
      _self.emit("cancelBetting");
    });

    this.sellOddButton = buttonWrapper.find('#sellOdd');
    this.buttons.push(this.sellOddButton);
    this.sellOddButton.on('click', function () {
      _self.showSellPopup();
    });

    this.resignationButton = buttonWrapper.find('#resignation');
    this.buttons.push(this.resignationButton);
    this.resignationButton.on('click', function () {
      _self.emit("resignation");
    });

    this.sellEvenButton = buttonWrapper.find('#sellEven');
    this.buttons.push(this.sellEvenButton);
    this.sellEvenButton.on('click', function () {
      _self.showSellPopup();
    });

    this.getHostButton = buttonWrapper.find('#getHost');
    this.buttons.push(this.getHostButton);
    this.getHostButton.on('click', function () {
      _self.emit("getHost");
    });

    this.buttons.hide = function () {
      _self.buttons.forEach(function (item, index) {
        item.hide();
      });
    };
  };

  p.initDisk = function () {
    this.diskContainer = new createjs.Container();
    var diskPosition = initOptions.diskPosition;
    var chipResultPosition = initOptions.chipResultPosition;
    var bowlPosition = initOptions.bowlPosition;

    diskPosition.x = (initOptions.gameSize.width - diskPosition.width) / 2;
    diskPosition.y = -diskPosition.width * 3 / 5;
    diskPosition.shakeY = 0;
    diskPosition.scaleX = diskPosition.scaleY = diskPosition.scale;

    this.diskContainer.set(diskPosition);
    this.disk = new createjs.Bitmap((TWIST.imagePath || imagePath) + 'taixiu/' + 'disk.png');

    this.chipResultContainer = new createjs.Container();
    chipResultPosition.height = chipResultPosition.width = bowlPosition.width / Math.sqrt(2);
    chipResultPosition.x = chipResultPosition.y = (diskPosition.initWidth - chipResultPosition.width) / 2;
    this.chipResultContainer.set(initOptions.chipResultPosition);

    this.bowl = new createjs.Bitmap((TWIST.imagePath || imagePath) + 'taixiu/' + 'bowl.png');
    bowlPosition.x = (diskPosition.initWidth - bowlPosition.width) / 2;
    bowlPosition.y = (diskPosition.initHeight - bowlPosition.height) / 2;
    this.bowl.set(initOptions.bowlPosition);

    this.diskContainer.addChild(this.disk, this.chipResultContainer, this.bowl);
  };

  p.initMoveChipContainer = function () {
    this.moveChipContainer = new createjs.Container();
    var moveChipContainer = this.moveChipContainer;

    this.bettingPositions.forEach(function (item, index) {
      var bettingSlot = new createjs.Container();
      var position = {
        x: item.left + 5 + 22.5 + 5,
        y: item.top + 5 + 173 + 5,
        width: item.width,
        height: item.height - 35,
        name: item.id
      };

      item.bettingSlot = bettingSlot;
      bettingSlot.set(position);
      moveChipContainer.addChild(bettingSlot);
    });
  };

  p.createVitualBetting = function (data) {
    var _self = this;
    var temp = TWIST.HTMLTemplate['taiXiu/vitualBetting'];
    var element = document.createElement('div');
    element.className = "vitual-betting-position";
    element.id = "vitualBetting" + data.id;
    return element;
  };

  p.setSelectedBetting = function (data) {
    this.bettingPositions.forEach(function (item, index) {
      item.setSelected(false);
    });
    data.setSelected(true);
  };

  p.emitBetting = function (emitData) {

    if (this.userInfo.money < emitData.value) {
      this.showError({
        message: "Bạn không đủ tiền đặt cược !"
      });
      return;
    }
    this._listenChangeMoney = true;
    this.emit('betting', emitData);
  };

  p.createBettingPosition = function (data, index) {
    var _self = this;
    var temp = TWIST.HTMLTemplate['taiXiu/bettingPosition'];
    var element = document.createElement('div');
    element.className = "betting-position";
    element.id = "bettingPosition" + data.id;
    element.innerHTML = temp;
    return element;
  };

  p.setBettingPositionsPrototype = function (data) {
    var _self = this;
    var bettingPosition = $('#' + "bettingPosition" + data.id);
    bettingPosition.css(data);
    data.template = bettingPosition;
    bettingPosition.addClass('type-id' + data.id);
    data.types.forEach(function (item, index) {
      bettingPosition.addClass('type-' + item);
    });
    bettingPosition.mineBetting = bettingPosition.find('.mine-betting');
    this.addNumberEffect(bettingPosition.mineBetting, 3);
    bettingPosition.totalBetting = bettingPosition.find('.total-betting');
    this.addNumberEffect(bettingPosition.totalBetting, 3);
    bettingPosition.displayNameContainer = bettingPosition.find('.name');
    bettingPosition.displayNameContainer.html(data.displayName);
    bettingPosition.ratioContainer = bettingPosition.find('.ratio');
    bettingPosition.displayNameContainer.html(data.displayName);
    bettingPosition.setMineBetting = function (betting) {
      this.mineBetting.html(Global.numberWithDot3(betting));
      data.mineValue = betting;
    };
    bettingPosition.setTotalBetting = function (betting) {
      this.totalBetting.html(Global.numberWithDot3(betting));
      data.totalValue = betting;
    };
    data.setMineBetting = function (betting) {
      if (_self.userInfo.isHost) {
        data.template.mineBetting.hide();
        data.mineValue = 0;
      } else {
        data.template.mineBetting.show();
        data.template.mineBetting.runEffect(betting);
        data.mineValue = betting;
      }
    };
    data.setTotalBetting = function (betting) {
      data.template.totalBetting.runEffect(betting);
      data.totalValue = betting;
    };
    data.setStatus = function (winnerSlots) {
      data.template.removeClass('active disabled');
      data.status = 0;
      if (!winnerSlots)
        return;
      if (winnerSlots.indexOf(data.id) > -1) {
        data.template.addClass('active');
        data.status = 1;
      } else {
        data.template.addClass('disabled');
      }
    };
    data.setSelected = function (flag) {
      data.isSelected = flag;
      data.template.removeClass('selected');
      if (flag) {
        data.template.addClass('selected');
      }
    };
    data.setRatio = function (ratio) {
      data.ratio = ratio;
      data.template.ratioContainer.html(ratio);
    };
  };



  p.setVitualBettingPrototype = function (data) {

    var _self = this;
    var vitualBetting = $('#' + "vitualBetting" + data.id);
    vitualBetting.css({
      top: data.top + 3,
      left: data.left + 3,
      width: data.width + 3,
      height: data.height + 3
    });
    data.vitualBetting = vitualBetting;
    vitualBetting.on('click', function () {
      if (_self.userInfo.isHost) {
        _self.setSelectedBetting(data);
      } else {
        var emitData = {
          value: _self.currentBetting.value,
          currentBettingId: _self.currentBetting.id,
          slotBettingId: data.id
        };
        _self.emitBetting(emitData);
      }
    });
  };

  p.addCoins = function (item, coinTittle) {
    var coinItem = $(TWIST.HTMLTemplate['taiXiu/coin-item']);
    if (item) {
      coinItem.addClass("red-coin");
    }
    coinTittle.append(coinItem);
  };

  p.setBettingChipValue = function (listBetting) {
    this.chipButtons.forEach(function (item, index) {
      var dataItem = listBetting.find(function (_item, _index) {
        return item.id == _item.id;
      });
      item.value = dataItem.value;
      item.template.html(Global.numberWithDot2(item.value));
    });
  };

  p.setRemainingTime = function (remainingTime, totalTime) {
    if (["STATUS_BETTING"].indexOf(this.status) > -1) {
      var config = this.options.timer;
      this.desk.setRemainingTime(parseInt(remainingTime), {
        x: config.x,
        y: config.y - config.radius / 2 - 2,
        font: "bold 36px Roboto Condensed",
        color: "#ffde00"
      });
      this.desk.setCicleTime(parseInt(remainingTime), parseInt(totalTime));
    } else {
      this.desk.setRemainingTime(-1);
      this.desk.clearTimer();
    }
  };

  p.drawBettingPositions = function (data) {
    var _self = this;
    var userBetting = 0;
    this.bettingPositions.forEach(function (item, index) {
      var dataItem = data.find(function (_item, _index) {
        return _item.id == item.id;
      });
      if (!dataItem)
        return;
      item.setRatio(dataItem.ratio);
      item.setMineBetting(dataItem.mineBetting);
      _self.userReBetting(item, dataItem.mineBetting);
      userBetting += parseInt(dataItem.mineBetting);
      item.setTotalBetting(dataItem.totalBetting);
      _self.playersBetting(item, dataItem.totalBetting - dataItem.mineBetting);
    });
    this.totalTable.setTotalBetting(userBetting);
  };

  p.setShowChipButtons = function (data) {
    var flag = this.userInfo.isHost();
    this.chipButtons.forEach(function (item, index) {
      if (flag) {
        item.template.hide();
      } else {
        item.template.show();
      }
    });
  };

  p.setShowChipButtons = function (data) {
    var flag = this.userInfo.isHost;
    this.chipButtons.forEach(function (item, index) {
      if (flag) {
        item.template.hide();
      } else {
        item.template.show();
      }
    });
  };

  p.setShowVitualBettings = function (status) {
    var flag = (this.userInfo.isHost && status == 4) || (!this.userInfo.isHost && status == 3);
    this.bettingPositions.forEach(function (item, index) {
      if (flag) {
        item.vitualBetting.show();
      } else {
        item.vitualBetting.hide();
      }
    });
  };

  p.removeSelectedBetting = function (status) {
    this.bettingPositions.forEach(function (item, index) {
      item.setSelected(false);
    });
  };

  p.changeStatus = function (data) {
    if (this.status == this.statusList[data.status])
      return;
    this.status = this.statusList[data.status];
    var func = this[this.status];
    this.buttons.hide();
    this.setShowChipButtons();
    this.setShowVitualBettings(data.status);
    this.removeSelectedBetting(data.status);
    this.setRemainingTime(data.remainingTime, data.totalTime);
    TWIST.Sound.stop();
    if (typeof func === "function") {
      func.call(this, data);
    }
    this.emit("ping");
  };

  p.STATUS_WAITING_FOR_START = function () {
    this.bettingPositions.forEach(function (item, index) {
      item.template.removeClass('active disabled');
      item.bettingSlot.removeAllChildren();
      item.setMineBetting(0);
      item.setTotalBetting(0);
    });
    this.totalTable.setTotalBetting(0);
    this.totalTable.setTotalWin(0);
    this.closeDisk();
    this.host.setMessage("");
  };

  p.STATUS_SHAKE_DISK = function () {
    this.host.background.show();
    this.emit("xocDia");
    this.host.setMessage("Nhà cái xóc đĩa !");
  };
  p.STATUS_BETTING = function (data) {
    var srcs = ['news/anhoidatcuoc', 'news/batdaudatcuoc'
              , 'news/moidatcuoc', 'news/datcuocdianh'];
    var src = srcs[Math.floor(Math.random() * srcs.length)];
    TWIST.Sound.play(src);
    this.host.background.hide();
    this.host.setMessage("");
    if (data.showReBetting) {
      this.reBettingButton.show();
    }
    if (data.showCancelBetting) {
      this.cancelBettingButton.show();
    }
  };

  p.STATUS_ARRANGING = function (data) {
    var defaultTime = 3;
    this.host.setMessage("");
    if (this.userInfo.isHost) {
      this.sellEvenButton.show();
      this.sellOddButton.show();
    }
  };

  p.END_GAME = function () {
    this.sellPopup.hide();
    this.host.setMessage("Mở bát !");
    this.totalBettingValue = 0;
  };

  TWIST.TaiXiu = TaiXiu;
})();
this.TWIST = this.TWIST || {};

(function () {
  "use strict";

  var statusList, cardRankList, speed, numberCard, effectQueue, bets, moneyFallingEffectTime, gameState, gameStates,
          currentEffectTurn, numberEffectCompleted, timeOutList, canvasSize, mainCardSize, winCardSize, newCard, winCardContainer, currentBetting;

  var initOptions = {
    resultTab: []
  };

  function TinyHightLowGame(wrapper, options) {
    this.wrapper = $(wrapper);
    this.options = $.extend(initOptions, options);
    this.initTinyHightLowGame();
  }

  var p = TinyHightLowGame.prototype = new TWIST.BaseGame();

  p.initTinyHightLowGame = function () {
    this.initVariable();
    $.extend(this.options, canvasSize);
    this.info = {
      betting: 1000,
      potData: {
        1000: 0,
        10000: 0,
        100000: 0
      }
    };
    TWIST.Card.RankMapIndex = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"];
    this.userInfo = {};
    this.initCanvas();
    this.initEvent();
    this.initTemplate();
    this.draw();
    this.pushEventListener();
    this.status = 'pause';
  };

  p.initVariable = function () {
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

    canvasSize = {width: 630, height: 340};

    mainCardSize = {width: 188, height: 245};

    winCardSize = {width: 38, height: 46};

    bets = [1000, 10000, 100000];

    moneyFallingEffectTime = 2000;

    timeOutList = [];

    gameState = 0;

    newCard = {};

    winCardContainer = {width: 360, height: 62, top: 260, left: 0};

    currentBetting = 0;
  };

  p.initTemplate = function () {
    var _self = this;

    this.wrapperTemplate = $(TWIST.HTMLTemplate['tinyHightLow/wrapper']);
    this.wrapper.append(this.wrapperTemplate);

    this.centerTempalte = $(TWIST.HTMLTemplate['tinyHightLow/center']);
    this.wrapperTemplate.append(this.centerTempalte);

    this.centerTempalte.find('.canvas-wrapper').append(this.canvas);
    this.initStage();

    this.topTempalte = $(TWIST.HTMLTemplate['tinyHightLow/top']);
    this.wrapperTemplate.append(this.topTempalte);

    this.bottomTempalte = $(TWIST.HTMLTemplate['tinyHightLow/bottom']);
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

    this._initOtherButtons();

    this._initSessionId();

    this._initNewTurnButton();

    this._initErrorPanel();
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
      _self.potCards.forEach(function (item, index) {
        item.active = false;
        item.removeClass('active');
      });
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
    this.getCardButton = this.bottomTempalte.find('.get-card');

    this.virtualCard.on('click', function (event) {
      _self.checkStart();
    });

    this.getCardButton.on('click', function (event) {
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
      TWIST.Sound.play("minigame/ButtonClick");
      TWIST.Sound.play("minigame/coin_spin");
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
    TWIST.Sound.play("minigame/ButtonClick");
    this.emit("choose", isHight);
  };

  p._initNewTurnText = function () {
    var _self = this;
    this.newTurnText = this.centerTempalte.find('.new-turn-text');
  };

  p._initProfile = function () {
    var _self = this;
    this.user = $(TWIST.HTMLTemplate['tinyMiniPoker/user']);
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

    this.moveChip = $(TWIST.HTMLTemplate['tinyVideoPoker/moveChip']);
    this.user.append(this.moveChip);
    this.addChipEffect(this.moveChip);
    this.moveChip.hide();
  };

  p._initChipsButton = function () {
    var _self = this;
    this.chipWrapper = $(TWIST.HTMLTemplate['tinyMiniPoker/chips']);
    this.bottomTempalte.find('.chips-hight-low').append(this.chipWrapper);

    this.chipButtons = [{
        value: 1000,
        template: this.chipWrapper.find('.chip:first-child')
      }, {
        value: 10000,
        template: this.chipWrapper.find('.chip:nth-child(2)')
      }, {
        value: 100000,
        template: this.chipWrapper.find('.chip:nth-child(3)')
      }];

    this.chipButtons.forEach(function (item, index) {
      item.template.on('click', function (event) {
        if (_self.status !== 'pause' || gameState !== 0)
          return;
        this.resultSound = TWIST.Sound.play("minigame/Common_Click");
        _self.setBetting(item);
      });
    });

    this.setBetting(this.chipButtons[0]);
  };

  p._initErrorPanel = function () {
    this.errorPanel = $(TWIST.HTMLTemplate['tinyMiniPoker/errorPanel']);
    this.wrapperTemplate.append(this.errorPanel);
    this.errorPanel.hide();
  };

  p._initOtherButtons = function () {
    var _self = this;
    this.closeButton = this.bottomTempalte.find('.button-close');
    this.closeButton.on('click', function (event) {
      _self.emit('closePopup');
    });

    this.showHelp = this.bottomTempalte.find('.button-help');
    this.showHelp.on('click', function (event) {
      _self.emit('showHelp');
    });

    this.showHistory = this.bottomTempalte.find('.button-history');
    this.showHistory.on('click', function (event) {
      _self.emit('showHistory');
    });
  };

  p._initSessionId = function () {
    this.sessionId = $(TWIST.HTMLTemplate['tinyMiniPoker/sessionId']);
    this.wrapperTemplate.append(this.sessionId);
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
      img.src = TWIST.imagePath + 'tinyHightLow/card-back.png';
      var card = new createjs.Bitmap(img);
      card.set({
        scaleX: mainCardSize.width / 400,
        scaleY: mainCardSize.width / 400
      });
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
    });
    var newX = 10 + (winCardSize.width + 10) * index;
    createjs.Tween.get(card).to({
      x: newX,
      y: 10,
      scaleX: winCardSize.width / TWIST.Card.size.width,
      scaleY: winCardSize.height / TWIST.Card.size.height
    }, 500).call(function () {
      _self.emit("_storeComplete");
    });
    if (newX + winCardSize.width > winCardContainer.width) {
      var newContainerX = winCardContainer.width - (newX + winCardSize.width);
      createjs.Tween.get(this.winCardContainer).to({
        x: newContainerX
      }, 500).call(function () {});
    }
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
      });
    }
    ;
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
      this.getCardButton.show();
      this.virtualCard.show();
      this.newTurnText.show();
      this.newTurnButton.hide();
      this.hightButton.setDisabled(true);
      this.lowButton.setDisabled(true);
      this.lowBetting.runEffect(0, {duration: 10});
      this.hightBetting.runEffect(0, {duration: 10});
      this.effect.hide();
    } else if (gameState == 1) {
      this.newTurnText.hide();
      this.getCardButton.hide();
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
    this.winCardContainer.set({x: 0});
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
    this.currentBetting.runEffect(data.currentBetting || 0, {duration: 300});
    if (data.currentBetting > 0) {
      if (data.currentBetting != this.info.betting) {
        TWIST.Sound.play("minigame/NormalWin");
      }
      this.supportText.text("Quân bài tiếp theo là cao hay thấp hơn ?");
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
      TWIST.Sound.play("minigame/slot_result");
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

  };

  p.getFirstCard = function (data) {
    this.changeGameState(1);
    this.changeStatus('pause');
    data.currentBetting = data.currentBetting || this.info.betting;
    this.setNewCard(data);
    this.newTurnButton.setDisabled(true);
    this.sessionId.text(data.sessionId);
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
      _self.changeStatus('pause');
      _self.setNewCard(data);
    });
  };

  p.getWin = function (data) {
    var _self = this;
    this.sessionId.text("");
    if (currentBetting > 0) {
      TWIST.Sound.play("minigame/coin_spin");
      this.moveChip.isTracking = true;
      this.moveChip.runEffect();
      this.moneyContainer.runEffect(parseInt(this.userInfo.money) + currentBetting, {duration: 500});
      this.currentBetting.runEffect(0, {duration: 500});
      _self.changeGameState(0);
      this.once('_moveChipComplete', function () {
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
//    this.supportText.text(message);

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

  p.reconnect = function (data) {

    var _self = this;
    var button;
    this.chipButtons.forEach(function (item, index) {
      if (item.value == data.betting) {
        button = item
      }
    });

    this.changeGameState(1);
    this.setBetting(button);
    this.setNewCard(data);
    this.drawListCard(data.listCard);
    if (!data.listCard.length) {
      this.newTurnButton.setDisabled(true);
    }
    ;
    if (data.numberPotCards) {
      for (var i = 0; i < data.numberPotCards; i++) {
        this.potCards.addActiveCard()
      }
    }
  };

  TWIST.TinyHightLowGame = TinyHightLowGame;

})();
this.TWIST = this.TWIST || {};

(function () {
  "use strict";

  var gameSize, columnSize, itemSize, distance, columns, speed, effectArray,
          statusList, endingPhase, numberCard, time, stepValue, spinAreaConf, colorList,
          lineList9, lineList20, isLine9, line9Left, line9Right, line20Left, line20Right,
          line9Coordinate, activeLines, bets, effectQueue, moneyFallingEffectTime, currentEffectTurn, numberEffectCompleted,
          timeOutList, fistLog, cardRankList, repeatEffectQueue;

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
    ,
    cardSize : {
      width : 115,
      height : 153
    }
  };

  function TinyMiniPoker(wrapper, options) {
    this.wrapper = $(wrapper);
    this.options = $.extend(initOptions, options);
    this.initTinyMiniPoker();
  }

  var p = TinyMiniPoker.prototype = new TWIST.BaseGame();

  p.initTinyMiniPoker = function () {
    this.initVariable();
    $.extend(this.options, gameSize);
    this.info = {
      betting: 1000,
      potData: {
        1000: 0,
        10000: 0,
        100000: 0
      }
    };
    TWIST.Card.RankMapIndex = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"];
    this.userInfo = {};
    this.initCanvas();
    this.initEvent();
    this.initTemplate();
    this.initButton();
    this.draw();
    this.pushEventListener();
    this.status = 'pause';
  };

  p.initVariable = function () {


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

    itemSize = {width: 130, height: 270, padding: 10};

    gameSize = {width: itemSize.width * 5, height: itemSize.height, x: 5, y: 1};

    distance = itemSize.height;

    columns = [];

    speed = 2.5;//default 2

    numberCard = 52;

    spinAreaConf = {x: 166, y: 233};

    effectQueue = [];

    bets = [1000, 10000, 100000];

    moneyFallingEffectTime = 2000;

    currentEffectTurn = 0;

    numberEffectCompleted = 0;

    timeOutList = [];

    repeatEffectQueue = false;
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
    this.wrapperTemplate = $(TWIST.HTMLTemplate['tinyMiniPoker/wrapper']);
    this.wrapper.append(this.wrapperTemplate);

    this.canvasWrapper = $(TWIST.HTMLTemplate['tinyMiniPoker/canvasWrapper']);
    this.wrapperTemplate.append(this.canvasWrapper);

    this.canvasWrapper.append(this.canvas);
    this.initStage();

    this.resultText = $(TWIST.HTMLTemplate['tinyMiniPoker/resultText']);
    this.wrapperTemplate.append(this.resultText);

    this.wrapperTemplate.append($(TWIST.HTMLTemplate['tinyMiniPoker/pot']));
    this.pot = this.wrapperTemplate.find('.pot-value');

    this.buttonSpin = $(TWIST.HTMLTemplate['tinyMiniPoker/buttonSpin']);
    this.wrapperTemplate.append(this.buttonSpin);

    this.buttonClose = $(TWIST.HTMLTemplate['tinyMiniPoker/buttonClose']);
    this.wrapperTemplate.append(this.buttonClose);

    this.buttonHelp = $(TWIST.HTMLTemplate['tinyMiniPoker/buttonHelp']);
    this.wrapperTemplate.append(this.buttonHelp);

    this.buttonHistory = $(TWIST.HTMLTemplate['tinyMiniPoker/buttonHistory']);
    this.wrapperTemplate.append(this.buttonHistory);

    var autoSpin = $(TWIST.HTMLTemplate['tinyMiniPoker/autospin']);
    this.wrapperTemplate.append(autoSpin);
    this.autoSpin = autoSpin.find('input[type="checkbox"]');

    this.chipWrapper = $(TWIST.HTMLTemplate['tinyMiniPoker/chips']);
    this.wrapperTemplate.append(this.chipWrapper);

    this.chipButtons = [{
        value: 1000,
        template: this.chipWrapper.find('.chip:first-child')
      }, {
        value: 10000,
        template: this.chipWrapper.find('.chip:nth-child(2)')
      }, {
        value: 100000,
        template: this.chipWrapper.find('.chip:nth-child(3)')
      }];

    this.errorPanel = $(TWIST.HTMLTemplate['tinyMiniPoker/errorPanel']);
    this.wrapperTemplate.append(this.errorPanel);
    this.errorPanel.hide();

    this.resultTab = $(TWIST.HTMLTemplate['tinyMiniPoker/resultTab']);
    this.wrapperTemplate.append(this.resultTab);

    this.resultItemList = [];
    this.resultItem = _.template(TWIST.HTMLTemplate['tinyMiniPoker/resultItem']);
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

    this.user = $(TWIST.HTMLTemplate['tinyMiniPoker/user']);
    this.wrapperTemplate.append(this.user);

    this.sessionId = $(TWIST.HTMLTemplate['tinyMiniPoker/sessionId']);
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
        TWIST.Sound.play("minigame/Common_Click");
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
      if (_self.buttonSpin.hasClass('disabled'))
        return;
      _self.checkStart();
    });
    

    this.buttonClose.on('click', function (event) {
      _self.emit('closePopup');
    });

    this.buttonHelp.on('click', function (event) {
      _self.emit('showHelp');
    }); 

    this.buttonHistory.on('click', function (event) {
      _self.emit('showHistory');
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
//            _self.endEffect();
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
      this.startSound = TWIST.Sound.play("minigame/bonus_spin");
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
    this.timeOutList.forEach(function (item) {
      clearTimeout(item);
    });
    this.timeOutList = [];
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
        this.timeOutList.push(newSpinTimeOut);
      }
    }

    if (status == "running") {
      this.resultSound && this.resultSound.stop();
      this.buttonSpin.addClass('disabled');
      this.autoSpin.find('input').attr('disabled', true);
      this.resultText.text("");
    }

    if (status == "effecting") {
      this.startSound && this.startSound.stop();
      if (this.isAutoSpin) {
        this.buttonSpin.addClass('disabled');
      } else {
        this.buttonSpin.removeClass('disabled');
      }
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
    _self.emit("endSpinTinyPoker");
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
      this.resultSound = TWIST.Sound.play("minigame/NormalWin");
    } else {
      this.resultSound = TWIST.Sound.play("minigame/slot_result");
    }
    effectArray.oneTime = true;
    effectArray.forEach(function (item, index) {
      item.isTracking = true;
    });
    effectQueue.push(effectArray);
    if (this.isAutoSpin) {
      var timeOut = setTimeout(function () {
        _self.checkStart();
      }, 2000);

      this.timeOutList.push(timeOut);
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
      this.timeOutList.push(timeOut);
    }
  };

  p.endEffect = function () {
    var _self = this;
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

          if (this.isAutoSpin) {
            var newSpinTimeOut = setTimeout(function () {
              _self.status = "pause";
              _self.checkStart();
            }, 500);
            this.timeOutList.push(newSpinTimeOut);
          } else {
            _self.status = "pause";
          }
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
      oldValue = parseInt(oldValue.replace(/\,/g, ""));
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

    var jElement = $(TWIST.HTMLTemplate['tinyMiniPoker/winMoney']);
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

  TWIST.TinyMiniPoker = TinyMiniPoker;

})();
this.TWIST = this.TWIST || {};

(function () {
  "use strict";

  var gameSize, columnSize, itemSize, distance, columns, speed, effectArray,
          statusList, endingPhase, numberCard, time, stepValue, spinAreaConf, colorList,
          lineList9, lineList20, isLine9, line9Left, line9Right, line20Left, line20Right,
          line9Coordinate, activeLines, bets, effectQueue, moneyFallingEffectTime, currentEffectTurn, numberEffectCompleted,
          timeOutList, fistLog, cardRankList, gameTurn, currentCardList, gameTurnList, activeColumnIndex, currentWin, doubleList,
          holdCard, holdList, repeatEffectQueue, initOptions;

  initOptions = {
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

  function TinyVideoPoker(wrapper, options) {
    this.wrapper = $(wrapper);
    this.options = $.extend(initOptions, options);
    this.initTinyVideoPoker();
  }

  var p = TinyVideoPoker.prototype = new TWIST.BaseGame();

  p.initTinyVideoPoker = function () {
    this.initVariable();
    $.extend(this.options, gameSize);
    this.info = {
      betting: 1000,
      potData: {
        1000: 0,
        10000: 0,
        100000: 0
      }
    };
    TWIST.Card.RankMapIndex = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"];
    this.userInfo = {};
    this.initCanvas();
    this.initTemplate();
    this.initEvent();
    this.initButton();
    this.draw();
    this.pushEventListener();
    this.status = 'pause';
  };

  p.initVariable = function () {
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

    itemSize = {width: 130, height: 270, padding: 10};

    gameSize = {width: itemSize.width * 5, height: itemSize.height, x: 5, y: 1};

    distance = itemSize.height;

    columns = [];

    speed = 2.5;//default 2

    numberCard = 52;

    spinAreaConf = {x: 166, y: 233};

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

    holdList = [];

    repeatEffectQueue = false;
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
      currentCardList[i] = item.bg;

      spinArea.addChild(columns[i]);
    }

    this.stage.addChild(spinArea);
  };

  p.initTemplate = function () {
    var _self = this;
    this.wrapperTemplate = $(TWIST.HTMLTemplate['tinyVideoPoker/wrapper']);
    this.wrapper.append(this.wrapperTemplate);

    this.canvasWrapper = $(TWIST.HTMLTemplate['tinyVideoPoker/canvasWrapper']);
    this.wrapperTemplate.append(this.canvasWrapper);

    this.canvasWrapper.append(this.canvas);
    this.initStage();

    this.resultText = $(TWIST.HTMLTemplate['tinyVideoPoker/resultText']);
    this.wrapperTemplate.append(this.resultText);

    this.wrapperTemplate.append($(TWIST.HTMLTemplate['tinyVideoPoker/pot']));
    this.pot = this.wrapperTemplate.find('.pot-value');

    this.buttonSpin = $(TWIST.HTMLTemplate['tinyVideoPoker/button']);
    this.wrapperTemplate.append(this.buttonSpin);

    this.buttonClose = $(TWIST.HTMLTemplate['tinyMiniPoker/buttonClose']);
    this.wrapperTemplate.append(this.buttonClose);

    this.buttonHelp = $(TWIST.HTMLTemplate['tinyMiniPoker/buttonHelp']);
    this.wrapperTemplate.append(this.buttonHelp);

    this.buttonHistory = $(TWIST.HTMLTemplate['tinyMiniPoker/buttonHistory']);
    this.wrapperTemplate.append(this.buttonHistory);

    this.doubleButton = $(TWIST.HTMLTemplate['tinyVideoPoker/doubleButton']);
    this.wrapperTemplate.append(this.doubleButton);
    this.doubleButton._disabled = true;
    this.doubleButton.hide();

    this.getWinButton = $(TWIST.HTMLTemplate['tinyVideoPoker/getWinButton']);
    this.wrapperTemplate.append(this.getWinButton);
    this.getWinButton._disabled = true;

    this.chipWrapper = $(TWIST.HTMLTemplate['tinyVideoPoker/chips']);
    this.wrapperTemplate.append(this.chipWrapper);
    
    this.chipButtons = [{
        value: 1000,
        template: this.chipWrapper.find('.chip:first-child')
      }, {
        value: 10000,
        template: this.chipWrapper.find('.chip:nth-child(2)')
      }, {
        value: 100000,
        template: this.chipWrapper.find('.chip:nth-child(3)')
      }];

    this.errorPanel = $(TWIST.HTMLTemplate['tinyVideoPoker/errorPanel']);
    this.wrapperTemplate.append(this.errorPanel);
    this.errorPanel.hide();

    this.resultTab = $(TWIST.HTMLTemplate['tinyVideoPoker/resultTab']);
    this.wrapperTemplate.append(this.resultTab);

    this.virtualCardsList = [];
    this.virtualCards = $(TWIST.HTMLTemplate['tinyVideoPoker/virtualCards']);
    this.wrapperTemplate.append(this.virtualCards);
    for (var i = 0; i < 5; i++) {
      this.virtualCardsList.push(this.virtualCards.find('.vitualCard' + (i + 1)));
    }

    this.resultItemList = [];
    this.resultItem = _.template(TWIST.HTMLTemplate['tinyVideoPoker/resultItem']);
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

    this.user = $(TWIST.HTMLTemplate['tinyVideoPoker/user']);
    this.wrapperTemplate.append(this.user);

    this.sessionId = $(TWIST.HTMLTemplate['tinyVideoPoker/sessionId']);
    this.wrapperTemplate.append(this.sessionId);

    this.effectWrapper = $(TWIST.HTMLTemplate['effect/wrapper']);
    this.wrapperTemplate.append(this.effectWrapper);

    this.explodePot = $(TWIST.HTMLTemplate['effect/explodePot']);
    this.effectWrapper.append(this.explodePot);

    this.supportText = $(TWIST.HTMLTemplate['tinyVideoPoker/supportText']);
    this.wrapperTemplate.append(this.supportText);

    this.moveChip = $(TWIST.HTMLTemplate['tinyVideoPoker/moveChip']);
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
        TWIST.Sound.play("minigame/Common_Click");
        _self.setBetting(item);
      });
    });

    this.virtualCardsList.forEach(function (item, index) {
      item.on('click', function (event) {
        if (_self.status == 'effecting' && gameTurn == 1) {
          TWIST.Sound.play("minigame/Common_Click");
          item._active = !item._active;
          item.toggleClass("active");
        } else if (gameTurn == 3) {
          if (!currentCardList[index].isOpened) {
            TWIST.Sound.play("minigame/Common_Click");
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
      TWIST.Sound.play("minigame/Common_Click");
      _self.emit("getWin");
    });

    this.doubleButton.on('click', function (event) {
      if (gameTurn != 2 && gameTurn != 3)
        return;
      if (_self.doubleButton._disabled)
        return;
      TWIST.Sound.play("minigame/Common_Click");
      _self.emit("double");
    });

    this.buttonSpin.on('click', function (event) {
      _self.checkStart();
    });

    this.buttonClose.on('click', function (event) {
      _self.emit('closePopup');
    });

    this.buttonHelp.on('click', function (event) {
      _self.emit('showHelp');
    }); 

    this.buttonHistory.on('click', function (event) {
      _self.emit('showHistory');
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

    this.on("reconnect", function (data) {
      _self.reconnect(data);
    });

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

  p.reconnect = function (data) {
    var _self = this;
    this.showSessionId(data.sessionId);

    var bettingItem = this.chipButtons.find(function (item, index) {
      return item.value == data.betting;
    });
    _self.changeNumberEffect(_self.resultText, data.currentMoney, {duration: 100}).runEffect();
    this.setBetting(bettingItem);

    var functionList = {
      1: _self.reDrawFirstTurn,
      2: _self.reDrawSeconTurn,
      3: _self.reDrawDoubleTurn,
    };
    var fun = functionList[data.status];
    if (typeof fun == 'function') {
      fun.call(_self, data);
    }
  };

  p.reDrawFirstTurn = function (data) {
    var _self = this;
    currentCardList.forEach(function (item, index) {
      item.setValue(data.map[index]);
    });
    this.endSpin(data);
  };

  p.reDrawSeconTurn = function (data) {
    var _self = this;
    currentCardList.forEach(function (item, index) {
      item.setValue(data.map[index]);
    });

    this.virtualCardsList.forEach(function (item, index) {
      data.holdCards[index] && item.toggleClass("active");
    });
    gameTurn = 1;
    this.endSpin(data);
  };

  p.reDrawDoubleTurn = function (data) {
    this.buttonSpin.hide();
    this.doubleButton.show();
    this.doubleButton._disabled = true;
    this.doubleButton.addClass('disabled');
    if (data.doubleStatus == 1) {
      this.reDrawDoubleTurnPhase1(data);
    } else if (data.doubleStatus == 2) {
      this.reDrawDoubleTurnPhase2(data);
    }
  };

  p.reDrawDoubleTurnPhase1 = function (data) {
    gameTurn = 2;
    this.doubleTurn(data);
  };

  p.reDrawDoubleTurnPhase2 = function (data) {
    gameTurn = 3;
    currentCardList[0].openCard(data.cardId, TWIST.Card.miniPoker);
    this.setCardSelected(data);
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
      var item = _self.virtualCardsList[data.selectedIndex];
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
        this.startSound = TWIST.Sound.play("minigame/bonus_spin");
        _self.emit("spin", this.info.betting);
        _self.changeNumberEffect(_self.money, _self.userInfo.money - _self.info.betting, {duration: 800}).runEffect();
        _self.changeNumberEffect(_self.resultText, _self.info.betting, {duration: 800}).runEffect();
//        _self.moveChipEffect(1).runEffect();
      }
    } else if (gameTurn == 1) {
      this.startSound = TWIST.Sound.play("minigame/bonus_spin");
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
      this.resultSound && this.resultSound.stop();
      this.buttonSpin.addClass('disabled');
      if (gameTurn == 0) {
        this.resultText.text("");
      }
    }

    if (status == "effecting") {
      this.startSound && this.startSound.stop();
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
    var _self = this;
    if (this.status == 'running') {
      this.changeStatus("ending");
      _temp();
      endingPhase = -0.8;
      stepValue = 0.2;
    } else {
      _temp();
      this.effecting();
    }
    function _temp() {
      _self.result = _self.result || {};
      $.extend(_self.result, data);
      _self.mapData = data.map;
      _self.showSessionId(data.sessionId);
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
      this.resultSound = TWIST.Sound.play("minigame/NormalWin");
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
      this.resultSound = TWIST.Sound.play("minigame/slot_result");
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
    TWIST.Sound.play("minigame/coin_spin");
    _self.changeStatus("effecting");
    _self.changeNumberEffect(_self.money, _self.userInfo.money, {duration: 800}).runEffect();
    _self.changeNumberEffect(_self.resultText, 0, {duration: 800}).runEffect();
    _self.setTextEffect(_self.supportText, "").runEffect();
//    _self.moveChipEffect(0).runEffect();
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
    this.virtualCardsList.forEach(function (item, index) {
      item.removeClass("active");
    });
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
    slotItem.bg = bg;
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
      oldValue = parseInt(oldValue.replace(/\,/g, ""));
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

  TWIST.TinyVideoPoker = TinyVideoPoker;

})();
this.TWIST = this.TWIST || {};

(function () {
    "use strict";

    var initOptions = {
        maxPlayers: 4,
        numberCardsInHand: 13,
        turnTime: 20000,
        playerConfig : {
          showCardLength : true,
          showPlayerCard : true
        }
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
        this.endDemlaGame(data,winTypeMap,(data.winType == 16));
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
          holdCard, holdList, repeatEffectQueue, initOptions;

  initOptions = {
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
    this.initVariable();
    $.extend(this.options, gameSize);
    this.info = {
      betting: 1000,
      potData: {
        1000: 0,
        10000: 0,
        100000: 0
      }
    };
    TWIST.Card.RankMapIndex = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"];
    this.userInfo = {};
    this.initCanvas();
    this.initTemplate();
    this.initEvent();
    this.initButton();
    this.draw();
    this.pushEventListener();
    this.status = 'pause';
  };

  p.initVariable = function () {
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

    holdList = [];

    repeatEffectQueue = false;
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
      currentCardList[i] = item.bg;

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

    this.resultText = $(TWIST.HTMLTemplate['videoPoker/resultText']);
    this.wrapperTemplate.append(this.resultText);

    this.wrapperTemplate.append($(TWIST.HTMLTemplate['videoPoker/pot']));
    this.pot = this.wrapperTemplate.find('.pot-value');

    this.buttonSpin = $(TWIST.HTMLTemplate['videoPoker/button']);
    this.wrapperTemplate.append(this.buttonSpin);

    this.doubleButton = $(TWIST.HTMLTemplate['videoPoker/doubleButton']);
    this.wrapperTemplate.append(this.doubleButton);
    this.doubleButton._disabled = true;
    this.doubleButton.hide();

    this.getWinButton = $(TWIST.HTMLTemplate['videoPoker/getWinButton']);
    this.wrapperTemplate.append(this.getWinButton);
    this.getWinButton._disabled = true;

    this.chipWrapper = $(TWIST.HTMLTemplate['videoPoker/chips']);
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

    this.errorPanel = $(TWIST.HTMLTemplate['videoPoker/errorPanel']);
    this.wrapperTemplate.append(this.errorPanel);
    this.errorPanel.hide();

    this.resultTab = $(TWIST.HTMLTemplate['videoPoker/resultTab']);
    this.wrapperTemplate.append(this.resultTab);

    this.virtualCardsList = [];
    this.virtualCards = $(TWIST.HTMLTemplate['videoPoker/virtualCards']);
    this.wrapperTemplate.append(this.virtualCards);
    for (var i = 0; i < 5; i++) {
      this.virtualCardsList.push(this.virtualCards.find('.vitualCard' + (i + 1)));
    }

    this.resultItemList = [];
    this.resultItem = _.template(TWIST.HTMLTemplate['videoPoker/resultItem']);
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

    this.user = $(TWIST.HTMLTemplate['videoPoker/user']);
    this.wrapperTemplate.append(this.user);

    this.sessionId = $(TWIST.HTMLTemplate['videoPoker/sessionId']);
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
        TWIST.Sound.play("minigame/Common_Click");
        _self.setBetting(item);
      });
    });

    this.virtualCardsList.forEach(function (item, index) {
      item.on('click', function (event) {
        if (_self.status == 'effecting' && gameTurn == 1) {
          TWIST.Sound.play("minigame/Common_Click");
          item._active = !item._active;
          item.toggleClass("active");
        } else if (gameTurn == 3) {
          if (!currentCardList[index].isOpened) {
            TWIST.Sound.play("minigame/Common_Click");
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
      TWIST.Sound.play("minigame/Common_Click");
      _self.emit("getWin");
    });

    this.doubleButton.on('click', function (event) {
      if (gameTurn != 2 && gameTurn != 3)
        return;
      if (_self.doubleButton._disabled)
        return;
      TWIST.Sound.play("minigame/Common_Click");
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

    this.on("reconnect", function (data) {
      _self.reconnect(data);
    });

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

  p.reconnect = function (data) {
    var _self = this;
    this.showSessionId(data.sessionId);

    var bettingItem = this.chipButtons.find(function (item, index) {
      return item.value == data.betting;
    });
    _self.changeNumberEffect(_self.resultText, data.currentMoney, {duration: 100}).runEffect();
    this.setBetting(bettingItem);

    var functionList = {
      1: _self.reDrawFirstTurn,
      2: _self.reDrawSeconTurn,
      3: _self.reDrawDoubleTurn,
    };
    var fun = functionList[data.status];
    if (typeof fun == 'function') {
      fun.call(_self, data);
    }
  };

  p.reDrawFirstTurn = function (data) {
    var _self = this;
    currentCardList.forEach(function (item, index) {
      item.setValue(data.map[index]);
    });
    this.endSpin(data);
  };

  p.reDrawSeconTurn = function (data) {
    var _self = this;
    currentCardList.forEach(function (item, index) {
      item.setValue(data.map[index]);
    });

    this.virtualCardsList.forEach(function (item, index) {
      data.holdCards[index] && item.toggleClass("active");
    });
    gameTurn = 1;
    this.endSpin(data);
  };

  p.reDrawDoubleTurn = function (data) {
    this.buttonSpin.hide();
    this.doubleButton.show();
    this.doubleButton._disabled = true;
    this.doubleButton.addClass('disabled');
    if (data.doubleStatus == 1) {
      this.reDrawDoubleTurnPhase1(data);
    } else if (data.doubleStatus == 2) {
      this.reDrawDoubleTurnPhase2(data);
    }
  };

  p.reDrawDoubleTurnPhase1 = function (data) {
    gameTurn = 2;
    this.doubleTurn(data);
  };

  p.reDrawDoubleTurnPhase2 = function (data) {
    gameTurn = 3;
    currentCardList[0].openCard(data.cardId, TWIST.Card.miniPoker);
    this.setCardSelected(data);
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
      var item = _self.virtualCardsList[data.selectedIndex];
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
        this.startSound = TWIST.Sound.play("minigame/bonus_spin");
        _self.emit("spin", this.info.betting);
        _self.changeNumberEffect(_self.money, _self.userInfo.money - _self.info.betting, {duration: 800}).runEffect();
        _self.changeNumberEffect(_self.resultText, _self.info.betting, {duration: 800}).runEffect();
        _self.moveChipEffect(1).runEffect();
      }
    } else if (gameTurn == 1) {
      this.startSound = TWIST.Sound.play("minigame/bonus_spin");
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
      this.resultSound && this.resultSound.stop();
      this.buttonSpin.addClass('disabled');
      if (gameTurn == 0) {
        this.resultText.text("");
      }
    }

    if (status == "effecting") {
      this.startSound && this.startSound.stop();
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
    var _self = this;
    if (this.status == 'running') {
      this.changeStatus("ending");
      _temp();
      endingPhase = -0.8;
      stepValue = 0.2;
    } else {
      _temp();
      this.effecting();
    }
    function _temp() {
      _self.result = _self.result || {};
      $.extend(_self.result, data);
      _self.mapData = data.map;
      _self.showSessionId(data.sessionId);
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
      this.resultSound = TWIST.Sound.play("minigame/NormalWin");
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
      this.resultSound = TWIST.Sound.play("minigame/slot_result");
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
    TWIST.Sound.play("minigame/coin_spin");
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
    this.virtualCardsList.forEach(function (item, index) {
      item.removeClass("active");
    });
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
    slotItem.bg = bg;
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
      oldValue = parseInt(oldValue.replace(/\,/g, ""));
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
this.TWIST = this.TWIST || {};

(function () {
  "use strict";

  var gameSize;

  var imagePath = location.origin + location.pathname + '../src/images/';

  var initOptions = {
    avatar: "https://s.gravatar.com/avatar/a4fae1e89a441c83f656a7ae59f9c19f?s=80",
    gameSize: {
      width: 1280,
      height: 720,
      position: "relative"
    },
    chipSize: {
      width: 75,
      height: 75,
      miniWidth: 24,
      miniHeight: 24,
      miniRatio: 0.33
    },
    bettingChipPositions: [{y: 640, x: 390}, {y: 640 - 11, x: 550},
      {y: 640, x: 710}, {y: 640, x: 868}],
    playerPosition: {
      x: 1215,
      y: 330
    },
    hostPosition: {
      x: 620,
      y: 60
    },
    userPosition: {
      y: 650,
      x: 210
    },
    chipSrcList: ['1st-chip.png', '2nd-chip.png', '3rd-chip.png', '4th-chip.png'],
    width: 1280,
    height: 720,
    timerRadius: 60,
    moveChipAnimationTime: 500,
    diskPosition: {
      x: 539,
      y: 155,
      width: 400,
      initWidth: 646,
      initHeight: 647,
      scale: 400 / 646
    },
    bowlPosition: {
      x: 25,
      y: 25,
      width: 534,
      height: 542
    },
    chipResultPosition: {
      x: 50,
      y: 50,
      width: 100,
      height: 100,
      chipWidth: 96,
      chipHeight: 96
    }
  };

  function XocDia(wrapper, options) {
    this.wrapper = $(wrapper);
    this.options = $.extend(initOptions, options);
    this.initXocDia();
  }

  var p = XocDia.prototype = new TWIST.InRoomGame();

  p.initXocDia = function () {
    this.initInRoomGame();
    this.initVariable();
    this.initTemplate();
    this.initButton();
    this.bindButton();
    this.pushXocDiaEvent();
  };

  p.initVariable = function () {
    this.info = {
      betting: 1000
    };
    this.userInfo = $.extend(this.userInfo, {
      uuid: "",
      username: "",
      money: 0,
      isHost: false
    });
    this.bettingPositions = [{
        name: "Bốn Trắng",
        displayName: "1:10",
        valueMap: [0, 0, 0, 0],
        resultMap: [0],
        ratio: 10,
        id: 2,
        top: 440,
        left: 40,
        width: 220,
        height: 148
      }, {
        name: "Bốn Đỏ",
        displayName: "1:10",
        valueMap: [1, 1, 1, 1],
        resultMap: [4],
        ratio: 10,
        id: 3,
        top: 440,
        left: 285,
        width: 220,
        height: 148
      }, {
        name: "Ba Trắng",
        displayName: "1:3",
        valueMap: [0, 0, 0, 1],
        resultMap: [1],
        ratio: 3,
        id: 4,
        top: 440,
        left: 775,
        width: 220,
        height: 148
      }, {
        name: "Ba đỏ",
        displayName: "1:3",
        valueMap: [0, 1, 1, 1],
        resultMap: [3],
        ratio: 3,
        id: 5,
        top: 440,
        left: 1020,
        width: 220,
        height: 148
      }
      , {
        name: "Hai đỏ",
        displayName: "1:1.5",
        valueMap: [0, 0, 1, 1],
        resultMap: [2],
        ratio: 1.5,
        id: 6,
        top: 440,
        left: 530,
        width: 220,
        height: 148
      }
      , {
        name: "Chẵn",
        displayName: "Chẵn",
        valueMap: [0],
        resultMap: [0, 2, 4],
        ratio: 1,
        id: 0,
        top: 230,
        left: 100,
        width: 320,
        height: 186
      }, {
        name: "Lẻ",
        displayName: "Lẻ",
        valueMap: [1],
        resultMap: [1, 3],
        ratio: 1,
        id: 1,
        top: 230,
        left: 860,
        width: 320,
        height: 186
      }];
    this.statusList = {
      1: "STATUS_WAITING_FOR_START",
      2: "STATUS_SHAKE_DISK",
      3: "STATUS_BETTING",
      4: "STATUS_ARRANGING",
      5: "END_GAME"
    };
  };

  p.bindButton = function () {

  };

  p.drawRoom = function () {
    this.desk = new TWIST.Desk(this.options);
    this.desk.name = "desk";
    this.stage.addChild(this.desk);
    this.wrapper.css(initOptions.gameSize);
  };

  p.drawGameInfo = function (data) {
    this.setHost(data.host);
    this.changeStatus(data);
    this.roomBetting = data.betting;
    this.setBettingChipValue(data.listBettingChip);
    this.addHistoryList(data.historyList);
    this.drawBettingPositions(data.bettingPositions);
  };

  p.initButtonBar = function () {};

  p.initInviteList = function () {};

  p.initResultPanel = function () {};

  p.initTemplate = function () {
    var _self = this;
    this.wrapperTemplate = $(TWIST.HTMLTemplate['xocDia/wrapper']);
    this.wrapper.append(this.wrapperTemplate);

    this.initBettingPositionList();

    this.initProfile();

    this.initHost();

    this.initTotalTable();

    this.initGameCanvas();

    this.initVitualBetting();

    this.initListPlayer();

    this.initChipButton();

    this.initSellPopup();

    this.initHistory();

    this.wrapperTemplate.append(this.errorPanel);

    this.effectWrapper = $(TWIST.HTMLTemplate['effect/wrapper']);
    this.wrapperTemplate.append(this.effectWrapper);

    this.money = this.user.find('.money');

    this.setBetting(this.chipButtons[0]);
  };

  p.setBetting = function (item) {
    if (this.chipButtons.active) {
      this.chipButtons.forEach(function (_item, _index) {
        _item.template.removeClass('active');
      });
      item.template.addClass('active');
      this.currentBetting = item;
    }
  };

  p.pushXocDiaEvent = function () {
    var _self = this;

    this.on("userInfo", function () {
      _self.renderUserInfo(arguments[0]);
    });

    this.on("userBetting", function (data) {
      _self.userBetting(data);
    });

    this.on("updateBettings", function (data) {
      _self.updateBettings(data);
      _self.emit('getListPlayer');
    });

    this.on("updateListPlayer", function (data) {
      this.listPlayer.html(data.count || "1");
    });

    this.on("xocDia", function (data) {
      _self.xocDia(data);
    });

    this.on("endXocDia", function (data) {
      _self.endXocDia(data);
    });

    this.on("openDisk", function (data) {
      _self.openDisk(data);
    });

    this.on("hostPayment", function (data) {
      _self.hostPaymentData = data;
    });

    this.on("changeHost", function (data) {
      _self.setHost(data);
    });

    this.on("suggetstHost", function (data) {
//      _self.getHostButton.show();
      _self.isSuggestHost = true;
    });

    this.on("reBettingResult", function (data) {
      _self.reBetting(data);
    });

    this.on("resignationSuccess", function (data) {
      _self.setHost();
    });

    this.on("cancelBettingResult", function (data) {
      _self.cancelBetting(data);
    });

    this.on("sellBettingResult", function (data) {
      _self.showError({
        message: "Bán cửa thành công !"
      });
    });
  };

  p.cancelBetting = function (data) {
    var _self = this;
    this.totalTable.setTotalBetting(0);
    this.cancelBettingButton.hide();
    this.bettingPositions.forEach(function (item, index) {
      _self.moveChipToUser(item.id, item.mineValue);
//      item.setTotalBetting(item.totalValue - item.mineValue);
      item.setMineBetting(0);
    });
  };

  p.hostPaymentPhase1 = function () {
    var _self = this;
    var data = this.hostPaymentData;
    this.totalTable.setTotalWin(data && data.changeMoney);
    if (!data)
      return;
    this.bettingPositions.hasChipsMove = false;
    this.bettingPositions.forEach(function (item, index) {
      if (!item.status) {
        _self.moveChipToHost(item.id);
        item.setMineBetting(0);
        item.setTotalBetting(0);
      }
    });
    if (!this.bettingPositions.hasChipsMove) {
      _self.hostPaymentPhase2();
    }
  };

  p.hostPaymentPhase2 = function () {
    var _self = this;
    var data = this.hostPaymentData;
    if (!data)
      return;
    TWIST.Sound.play("chip/multichip");
    if (this.userInfo.isHost) {
      this.showChangeMoney(data);
    }
    this.bettingPositions.forEach(function (item, index) {
      if (item.status) {
        _self.paymentChipToSlotBetting(item.id, item.totalValue * item.ratio);
        item.setTotalBetting(item.totalValue * (item.ratio + 1));
        item.setMineBetting(item.mineValue * (item.ratio + 1));
      }
    });
  };

  p.showChangeMoney = function (data) {
    this.userInfo.money = data.money;
    this.userMoney.runEffect(this.userInfo.money);
    var jElement = $(TWIST.HTMLTemplate['xocDia/changeMoney']);
    this.user.append(jElement);
    jElement.text(Global.numberWithDot(parseInt(data.changeMoney)));
    jElement.one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function () {
      jElement.remove();
    });
    if (data.changeMoney >= 0) {
      jElement.addClass("plus");
    }
  };

  p.hostPaymentPhase3 = function () {
    var _self = this;
    var data = this.hostPaymentData;
    if (!data)
      return;
    if (!this.userInfo.isHost) {
      this.showChangeMoney(data);
    }
    TWIST.Sound.play("chip/multichip");
    this.bettingPositions.forEach(function (item, index) {
      if (item.status) {
        (function (mineValue, totalValue) {
          setTimeout(function () {
            _self.moveChipToPlayers(item.id, mineValue, totalValue);
          }, 500);
        })(item.mineValue, item.totalValue);
        item.setMineBetting(0);
        item.setTotalBetting(0);
      }
    });
  };

  p.paymentChipToSlotBetting = function (id, value) {
    var _self = this;
    var listChip = this.convertValueToChips(value);
    var waitAnimationStep = 300 / listChip.length;
    listChip.forEach(function (item, index) {
      _self.timeOutList.push(setTimeout(function () {
        _self.paymentChipAction(id, item);
      }, waitAnimationStep * index));
    });
  };

  p.moveChipToHost = function (id) {
    var _self = this;
    var chipContainer = this.moveChipContainer.children.find(function (item, index) {
      return item.name == id;
    });
    var listChip = chipContainer.children;
    var length = listChip.length;
    if (length > 0)
      this.bettingPositions.hasChipsMove = true;
    _self._numberChipMove = _self._numberChipMove || 0;
    listChip.forEach(function (item, index) {
      var fromPosition = item.localToGlobal(0, 0);
      var toPosition = _self.userInfo.isHost ? initOptions.userPosition : initOptions.hostPosition;
      setTimeout(function () {
        _self._numberChipMove++;
        _self.stage.addChild(item);
        item.move(fromPosition, toPosition, function () {
          _self.stage.removeChild(item);
          _self._numberChipMove--;
          if (!_self._numberChipMove) {
            setTimeout(function () {
              _self.hostPaymentPhase2();
            }, 500);
          }
        });
      }, 300 / length * index);
    });
  };

  p.moveChipToUser = function (id, value) {
    var _self = this;
    var chipContainer = this.moveChipContainer.children.find(function (item, index) {
      return item.name == id;
    });
    var listChip = chipContainer.children;
    var position = initOptions.userPosition;
    this.moveChipsToPosition(value, listChip, position);
  };

  p.moveChipToPlayers = function (id, mineValue, totalValue) {
    var _self = this;
    var chipContainer = this.moveChipContainer.children.find(function (item, index) {
      return item.name == id;
    });
    var listChip = chipContainer.children;
    if (mineValue) {
      this.moveChipsToPosition(mineValue, listChip, initOptions.userPosition);
    }
    this.moveRemainChipToPlayers(listChip, initOptions.playerPosition);
  };

  p.moveChipsToPosition = function (value, listChip, position) {
    var _self = this;
    var listReturnChip = this.convertValueToChipContainers(value, listChip);
    var length = listReturnChip.length;
    listReturnChip.forEach(function (item, index) {
      var fromPosition = item.localToGlobal(0, 0);
      var toPosition = position;
      item.set(fromPosition);
      _self.stage.addChild(item);
      setTimeout(function () {
        item.move(fromPosition, toPosition, function () {
          _self.stage.removeChild(item);
        });
      }, 300 / length * index);
    });
  };


  p.moveRemainChipToPlayers = function (listChip, position) {
    var _self = this;
    var length = listChip.length;

    listChip.forEach(function (item, index) {
      var chip = item;
      if (chip) {
        var fromPosition = chip.localToGlobal(0, 0);
        var toPosition = position;
        setTimeout(function () {
          _self.stage.addChild(chip);
          chip.move(fromPosition, toPosition, function () {
            _self.stage.removeChild(chip);
          });
        }, 300 / length * index);
      }
    });
  };

  p.userBetting = function (data) {
    this.totalTable.totalBettingValue += this.currentBetting.value;
    this.totalTable.setTotalBetting(this.totalTable.totalBettingValue);
    var _self = this;
    var bettingPosition = this.bettingPositions.find(function (item, index) {
      return item.id == data.id;
    });
    TWIST.Sound.play("chip/singlechip");
    this.reBettingButton.hide();
    this.cancelBettingButton.show();
    bettingPosition.setMineBetting(data.mineBetting);
    bettingPosition.setTotalBetting(data.totalBetting);
    var currentBettingID = this.currentBetting.id;
    this.bettingChipAction(data.id, currentBettingID, true);
  };

  p.updateBettings = function (data) {
    var _self = this;
    this.bettingPositions.forEach(function (item, index) {
      var dataItem = data.find(function (_item, _index) {
        return _item.id == item.id;
      });
      if (!dataItem)
        return;
      _self.playersBetting(item, dataItem.totalBetting - item.totalValue);
      item.setTotalBetting(dataItem.totalBetting);
    });
  };

  p.reBetting = function (data) {
    TWIST.Sound.play("chip/multichip");
    var _self = this;
    this.reBettingButton.hide();
    this.cancelBettingButton.show();
    this.bettingPositions.forEach(function (item, index) {
      var dataItem = data.find(function (_item, _index) {
        return _item.id == item.id;
      });
      if (!dataItem)
        return;
      item.setMineBetting(dataItem.mineBetting);
      if (dataItem.mineBetting)
        _self.totalTable.totalBettingValue += parseInt(dataItem.mineBetting);
      item.setTotalBetting(dataItem.totalBetting);
      _self.userReBetting(item, dataItem.mineBetting);
    });
    this.totalTable.setTotalBetting(this.totalTable.totalBettingValue);
  };

  p.bettingChipAction = function (bettingId, currentBettingID, isMine) {

    var bettingSlot = this.moveChipContainer.getChildByName(bettingId);
    var chip = this.createChip(currentBettingID);
    chip.isMine = isMine;
    var bettingChipPosition = isMine ? initOptions.bettingChipPositions[currentBettingID] : initOptions.playerPosition;
    var fromPosition = {
      x: bettingChipPosition.x - bettingSlot.x,
      y: bettingChipPosition.y - bettingSlot.y
    };

    var toPosition = {
      x: Math.random() * (bettingSlot.width - initOptions.chipSize.miniWidth),
      y: Math.random() * (bettingSlot.height - initOptions.chipSize.miniHeight)
    };
    bettingSlot.addChild(chip);
    chip.move(fromPosition, toPosition);
  };

  p.paymentChipAction = function (bettingId, currentBettingID) {
    var _self = this;
    var bettingSlot = this.moveChipContainer.getChildByName(bettingId);
    var chip = this.createChip(currentBettingID);
    var paymentChipPosition = this.userInfo.isHost ? initOptions.userPosition : initOptions.hostPosition;
    var fromPosition = {
      x: paymentChipPosition.x - bettingSlot.x,
      y: paymentChipPosition.y - bettingSlot.y
    };

    var toPosition = {
      x: Math.random() * (bettingSlot.width - initOptions.chipSize.miniWidth),
      y: Math.random() * (bettingSlot.height - initOptions.chipSize.miniHeight)
    };
    bettingSlot.addChild(chip);
    this._numberChipMove = this._numberChipMove || 0;
    this._numberChipMove++;
    chip.move(fromPosition, toPosition, function () {
      _self._numberChipMove--;
      if (!_self._numberChipMove) {
        _self.hostPaymentPhase3();
      }
    });
  };

  p.playersBetting = function (slotBetting, value) {
    var _self = this;
    var listChip = this.convertValueToChips(value);
    var waitAnimationStep = 1000 / listChip.length;
    listChip.forEach(function (item, index) {
      _self.timeOutList.push(setTimeout(function () {
        _self.bettingChipAction(slotBetting.id, item);
      }, waitAnimationStep * index));
    });
  };

  p.userReBetting = function (slotBetting, value) {
    var _self = this;
    var listChip = this.convertValueToChips(value);
    var waitAnimationStep = 500 / listChip.length;
    listChip.forEach(function (item, index) {
      _self.timeOutList.push(setTimeout(function () {
        _self.bettingChipAction(slotBetting.id, item, true);
      }, waitAnimationStep * index));
    });
  };

  p.convertValueToChips = function (value) {
    var listChip = [];
    var unit = this.chipButtons[0].value;
    var totalArray = [];
    var totalValue = 0;
    this.chipButtons.forEach(function (item, index) {
      totalValue += item.value * item.concentration;
      for (var i = 0; i < item.concentration; i++) {
        totalArray.push(item.id);
      }
    });
    var quantityOfTotalUnit = parseInt(value / totalValue);
    for (var i = 0; i < quantityOfTotalUnit; i++) {
      listChip = listChip.concat(totalArray);
    }
    var quantityOfUnit = parseInt((value % totalValue) / unit);
    for (var i = 0; i < quantityOfUnit; i++) {
      listChip.push(this.chipButtons[0].id);
    }
    return Global.shuffle(listChip);
  };

  p.convertValueToChipContainers = function (initValue, listChip) {
    var returnChips = [];
    var currentValue = initValue;
    var flag = true;

    var listChipValue = this.chipButtons.map(function (item, index) {
      return item.value;
    });
    listChipValue.sort(function (a, b) {
      return b - a;
    });

    var currentChipValue = getCurrentChipValue(initValue);

    while (checkFlag()) {
      getChipTypeByValue();
    }

    return returnChips;

    function checkFlag() {
      flag = (currentValue >= currentChipValue);
      return flag;
    }

    function getCurrentChipValue(currentValue) {
      listChipValue = listChipValue.filter(function (item, index) {
        return currentValue >= item;
      });
      return listChipValue[0];
    }

    function getChipTypeByValue() {
      currentChipValue = getCurrentChipValue(currentValue);
      if (!currentChipValue)
        return;
      var newChip = listChip.find(function (item, index) {
        return (item.value == currentChipValue && !item._isChecked);
      });
      if (newChip) {
        currentValue -= currentChipValue;
        returnChips.push(newChip);
        newChip._isChecked = true;
      } else {
        listChipValue.shift();
        getChipTypeByValue();
      }
    }
  };

  p.xocDia = function () {
    var _self = this;
    var message, position, animationTime;
    animationTime = this.diskContainer.y < -200 ? 1000 : 100;
    if (this.status === 'STATUS_SHAKE_DISK') {
      position = {
        x: initOptions.diskPosition.x + ((Math.random() - 0.5) < 0 ? -1 : 1) * (Math.random() * 10 + 10),
        y: initOptions.diskPosition.shakeY + (this.diskContainer.isTop ? -1 : 1) * (Math.random() * 10 + 10)
      };
      message = 'xocDia';
    } else {
      animationTime = 1000;
      position = initOptions.diskPosition;
      message = 'endXocDia';
    }
    createjs.Tween.get(this.diskContainer)
            .to(position, animationTime)
            .call(function () {
              _self.diskContainer.isTop = !_self.diskContainer.isTop;
              _self.emit(message);
            });
  };

  p.endXocDia = function () {
    this.history._toggle(true);
  };

  p.showResult = function (data) {
    var _self = this;
    this.playResultSounds(data);
    var newY = initOptions.bowlPosition.y - initOptions.bowlPosition.height;
    this.history.addResult(data.winnerSlots);
    var message, position;
    this.chipResultContainer.removeAllChildren();
    var shuffleMap = Global.shuffle(data.map)
    shuffleMap.forEach(function (item, index) {
      _self.createResultChip(item, index);
    });
    this.bowl.set({
      y: initOptions.bowlPosition.y
    });
    createjs.Tween.get(this.bowl)
            .to({
              y: newY
            }, 1000)
            .call(function () {
              _self.hostPaymentPhase1();
            });
    this.bettingPositions.forEach(function (item, index) {
      item.setStatus(data.winnerSlots);
    });
  };

  p.playResultSounds = function (data) {
    var map = data.map;
    var winnerSlots = data.winnerSlots;

    var resultNumber = 0;
    data.map.forEach(function (item, index) {
      resultNumber += (item + 1);
    });
    var firstResultSound = "";
    var seconResultSound = "";
    var thirdResultSound = "";
    var resultSounds = [];
    var initSrcs = ['news/ddungdatcuoc', 'news/mobat'];

    var firstSoundMap = ["news/xap4", "news/xap1", "news/xap3", "news/xap2", "news/ngua"];

    var sapType = [3, 4, 5, 6].findIndex(function (item, index) {
      return winnerSlots.indexOf(item) > -1;
    });
    var isOdd = (winnerSlots.indexOf(1) > -1);

    var isSapType = (sapType > -1);
    firstResultSound = isSapType ? firstSoundMap[sapType] : firstSoundMap['4'];
    seconResultSound = isOdd ? "news/le" : "news/chan";

    var srcs = [ firstResultSound, seconResultSound];
    TWIST.Sound.playQueue(srcs);
  };

  p.openDisk = function (data) {
    this.history._toggle(false);
    var _self = this;
    var message, position, animationTime;
    position = {
      x: initOptions.diskPosition.x,
      y: initOptions.diskPosition.shakeY
    };
    createjs.Tween.get(this.diskContainer)
            .to(position, 1000)
            .call(function () {
              _self.showResult(data);
            });
  };


  p.closeDisk = function (data) {
    this.history._toggle(false);
    createjs.Tween.get(this.bowl)
            .to(initOptions.bowlPosition, 1000)
            .call(function () {});
  };

  p.createResultChip = function (isRed, index) {
    var src = (TWIST.imagePath || imagePath) + 'xocdia/' + (isRed ? "red-big.png" : "white-big.png");
    var resultChip = new createjs.Bitmap(src);
    var unitWidth = this.chipResultContainer.width / 2;
    var unitHeight = this.chipResultContainer.height / 2;
    var resultChipPosition = {
      x: (Math.random() * (unitWidth - initOptions.chipResultPosition.chipWidth)) + (parseInt(index / 2) * unitWidth),
      y: (Math.random() * (unitHeight - initOptions.chipResultPosition.chipHeight) + (parseInt(index % 2) * unitHeight))
    };
    resultChip.set(resultChipPosition);
    this.chipResultContainer.addChild(resultChip);
    return resultChip;
  };

  p.createChip = function (id) {
    var _self = this;
    var scale = initOptions.chipSize.miniRatio;
    var src = (TWIST.imagePath || imagePath) + 'xocdia/' + initOptions.chipSrcList[id];
    var chip = new createjs.Bitmap(src);
    var value = this.chipButtons.find(function (item, index) {
      return item.id == id;
    }).value;
    chip.set({
      scaleX: scale,
      scaleY: scale,
      type: id,
      value: value
    });
    chip.move = function (fromPosition, toPosition, callback) {
      chip.set(fromPosition);
      var newX = toPosition.x + (Math.random() - 0.5) * 3;
      var newY = toPosition.y + (Math.random() - 0.5) * 3;
      createjs.Tween.get(chip)
              .to({
                x: newX,
                y: newY
              }, initOptions.moveChipAnimationTime)
              .call(function () {
                if (typeof callback === 'function') {
                  callback();
                }
              });
    };
    return chip;
  };

  p.renderUserInfo = function () {
    var avatarContainer = this.user.find('.avatar');
    var usernameContainer = this.user.find('.username');
    avatarContainer.css("background-image", "url(" + (this.userInfo.avatar ? ("./" + this.userInfo.avatar) : initOptions.avatar) + ")");
    usernameContainer.text(this.userInfo.username);
    this.userMoney.runEffect(this.userInfo.money);
  };

  p.initHistory = function () {
    var _self = this;
    this.history = $(TWIST.HTMLTemplate['xocDia/history']);
    this.historyInner = this.history.find('.history');
    this.wrapperTemplate.append(this.history);
    this.historyList = [];
    var mapName = {
      2: 4,
      3: 0,
      4: 1,
      5: 3,
      6: 2
    };
    this.history._toggle = function (active) {
      if (typeof active !== "undefined") {
        if (active) {
          _self.historyInner.addClass('active');
        } else {
          _self.historyInner.removeClass('active');
        }
      } else {
        _self.historyInner.toggleClass('active');
      }
    };
    this.historyInner.on('click', function () {
      _self.history._toggle();
    });
    this.history.addResult = function (winnerSlots) {

      var isOdd = winnerSlots.find(function (item, index) {
        return item < 2;
      });

      var slotId = winnerSlots.find(function (item, index) {
        return item > 1;
      });

      var isNewColumn = false;

      var resultChipColumn = _self.historyList[_self.historyList.length - 1];

      isNewColumn = _self.historyList[_self.historyList.length - 1] ? false : true;

      if (resultChipColumn && resultChipColumn.children().length > 3) {
        isNewColumn = true;
      }
      if (_self.history.lastResult && (_self.history.lastResult.isOdd !== isOdd)) {
        isNewColumn = true;
      }

      if (isNewColumn) {
        resultChipColumn = $(TWIST.HTMLTemplate['xocDia/resultChipColumn']);
        _self.historyList.push(resultChipColumn);
        _self.historyInner.append(resultChipColumn);
      }

      var resultChip = $(TWIST.HTMLTemplate['xocDia/resultChip']);

      if (isOdd) {
        resultChip.addClass('result-chip-odd');
      }
      resultChip.isOdd = isOdd;
      resultChip.find('.inner-chip').html(mapName[slotId]);
      _self.history.lastResult = resultChip;
      resultChipColumn.append(resultChip);

      if (_self.historyList.length > 15) {
        _self.historyList[0].remove();
        _self.historyList.shift();
      }
    };
  };



  p.addHistoryList = function (historyList) {
    var _self = this;
    var historyListConver = [];
    var bettingPositions = this.bettingPositions;
    historyListConver = historyList.map(function (item, index) {
      var winnerSlot = [];
      bettingPositions.forEach(function (betting, _index) {
        if (betting.resultMap.indexOf(item) > -1) {
          winnerSlot.push(betting.id);
        }
      });
      return winnerSlot;
    });
    historyListConver.forEach(function (item, index) {
      _self.history.addResult(item);
    });
  };

  p.initHost = function () {
    var _self = this;
    this.host = $(TWIST.HTMLTemplate['xocDia/host']);
    this.wrapperTemplate.append(this.host);
    this.host.background = this.host.find('.host-background');
    this.host.hostName = this.host.find('.host-name');
    this.host.chatBox = this.host.find('.chat-box');
    this.host.hostMessage = this.host.find('.chat-box-inner');
    this.host.setMessage = function (message) {
      if (message) {
        this.show();
        this.hostMessage.html(message);
      } else {
        this.hide();
      }
    };
  };

  p.initTotalTable = function () {
    var _self = this;
    this.totalTable = $(TWIST.HTMLTemplate['xocDia/totalTable']);
    this.wrapperTemplate.append(this.totalTable);

    this.totalTable.totalBetting = this.totalTable.find('.total-table-betting');
    this.totalTable.totalWin = this.totalTable.find('.total-table-win');

    this.addNumberEffect(this.totalTable.totalBetting);
    this.addNumberEffect(this.totalTable.totalWin);

    this.totalTable.setTotalBetting = function (value) {
      this.totalBettingValue = value;
      _self.totalBettingValue = value;
      this.totalBetting.runEffect(value);
    };
    this.totalTable.setTotalWin = function (value) {
      this.totalWinValue = value;
      this.totalWin.runEffect(value);
    };
  };

  p.setHost = function (host) {
    this.host.hostName.removeClass('active');
    this.userInfo.isHost = ((host && host.uuid) == this.userInfo.uuid);
    this.resignationButton.hide();
    if (this.userInfo.isHost) {
      this.lastBettings = undefined;
      this.showError({
        message: "Bạn đã làm nhà cái !"
      });
    }
    this.setShowChipButtons();
    if (host && host.username) {
      this.host.name = host.username;
      this.getHostButton.hide();
      this.host.hostName.addClass('active');
      this.host.hostName.html(host.username);
    } else {
      this.host.name = undefined;
    }
  };

  p.initListPlayer = function () {
    var _self = this;
    this.listPlayer = $(TWIST.HTMLTemplate['xocDia/listPlayer']);
    this.wrapperTemplate.append(this.listPlayer);
    this.listPlayer.on('click', function () {
      _self.activeListPlayer = true;
      _self.emit('getListPlayer');
    });
  };

  p.initBettingPositionList = function () {
    var _self = this;
    var bettingPositions = this.bettingPositions;
    bettingPositions.forEach(function (item, index) {
      _self.createBettingPosition(item);
    });
  };

  p.initVitualBetting = function () {
    var _self = this;
    var bettingPositions = this.bettingPositions;
    bettingPositions.forEach(function (item, index) {
      _self.createVitualBetting(item);
    });
  };

  p.initProfile = function () {
    this.user = $(TWIST.HTMLTemplate['xocDia/user']);
    this.wrapperTemplate.append(this.user);
    this.userMoney = this.user.find('.money');
    this.addNumberEffect(this.userMoney);
  };

  p.initGameCanvas = function () {
    this.wrapperTemplate.append(this.canvas);

    this.initDisk();

    this.initMoveChipContainer();

    this.desk.createTimer({
      x: this.options.width / 2 - this.options.timerRadius,
      y: this.options.height / 2 - this.options.timerRadius - 20,
      radius: this.options.timerRadius,
      strokeThick: 10,
      __type: 1
    });

    this.stage.addChild(this.diskContainer, this.moveChipContainer, this.desk);
  };

  p.initChipButton = function () {
    var _self = this;
    this.chipWrapper = $(TWIST.HTMLTemplate['xocDia/chips']);
    this.wrapperTemplate.append(this.chipWrapper);

    this.chipButtons = [{
        id: 0,
        value: 1000,
        concentration: 1,
        template: this.chipWrapper.find('.chip-1st')
      }, {
        id: 1,
        value: 10000,
        concentration: 1,
        template: this.chipWrapper.find('.chip-2nd')
      }, {
        id: 2,
        value: 100000,
        concentration: 1,
        template: this.chipWrapper.find('.chip-3rd')
      }, {
        id: 3,
        value: 1000000,
        concentration: 1,
        template: this.chipWrapper.find('.chip-4th')
      }];
    this.chipButtons.active = true;
    this.chipButtons.forEach(function (item, index) {
      item.template.on('click', function () {
        TWIST.Sound.play("minigame/Common_Click");
        _self.setBetting(item);
      });
    });
  };

  p.initSellPopup = function () {
    var _self = this;
    this.sellPopup = $(TWIST.HTMLTemplate['xocDia/sellPopup']);
    var bettingData;
    this.sellPopup.initPopup = function (data) {
      bettingData = data;
      var maxValue = data.totalValue;
      _self.sellPopup.maxValue = maxValue;
      _self.sellPopup.plusButton.html(maxValue);
      _self.sellPopup.title.html(data.name);
      setMin();
    };
    this.wrapperTemplate.append(this.sellPopup);
    var minLeft = 5;
    var maxLeft = 256;
    this.sellPopup.hide();
    function hide() {
      _self.sellPopup.hide();
    }

    function setMin() {
      _self.sellPopup.scroller.css('left', 0);
      setRatio(0);
    }

    function setMax() {
      _self.sellPopup.scroller.css('left', maxLeft);
      setRatio(1);
    }

    function emitSell() {
      var emitData = {
        id: bettingData.id,
        value: _self.sellPopup.currentValue
      };
      _self.sellPopup.hide();
      _self.emit("sellBetting", emitData);
    }

    function setRatio(ratio) {
      _self.sellPopup.dragbarInner.css('width', ratio * maxLeft + minLeft);
      var currentValue = parseInt(ratio * _self.sellPopup.maxValue);
      _self.sellPopup.currentValue = currentValue;
      _self.sellPopup.scrollerValue.html(currentValue);
    }

    this.sellPopup.title = this.sellPopup.find('.sell-popup-title');
    this.sellPopup.background = this.sellPopup.find('.sell-popup-background');
    this.sellPopup.background.on('click', hide);
    this.sellPopup.cancel = this.sellPopup.find('#cancel');
    this.sellPopup.cancel.on('click', hide);
    this.sellPopup.accept = this.sellPopup.find('#accept');
    this.sellPopup.accept.on('click', emitSell);
    this.sellPopup.minusButton = this.sellPopup.find('.sell-popup-minus');
    this.sellPopup.minusButton.on('click', setMin);
    this.sellPopup.plusButton = this.sellPopup.find('.sell-popup-plus');
    this.sellPopup.plusButton.on('click', setMax);

    this.sellPopup.dragbarInner = this.sellPopup.find('.sell-popup-dragbar-inner');

    this.sellPopup.scroller = this.sellPopup.find('#scroller');
    this.sellPopup.scrollerValue = this.sellPopup.scroller.find('.sell-popup-scroller-content');
    var optionDraggable = {
      axis: "x",
      scroll: false,
      containment: "#sell-popup-drag-container",
      drag: function (event, ui) {
        var ratio = ui.position.left / maxLeft;
        setRatio(ratio);
      }
    };
    this.sellPopup.scroller.draggable(optionDraggable);
  };

  p.showSellPopup = function (id) {

    var _self = this;
    var selectedBetting = this.bettingPositions.find(function (item, index) {
      return item.id == id;
    });
    if (selectedBetting) {
      if (selectedBetting.totalValue) {
        this.sellPopup.show();
        this.sellPopup.initPopup(selectedBetting);
      }
    } else {
      this.showError({
        message: "Chưa chọn cửa bán !"
      });
    }
  };

  p.initButton = function () {
    var _self = this;

    this.buttons = [];

    var buttonWrapper = $(TWIST.HTMLTemplate['xocDia/buttons']);

    this.wrapperTemplate.append(buttonWrapper);

    this.reBettingButton = buttonWrapper.find('#reBetting');
    this.buttons.push(this.reBettingButton);
    this.reBettingButton.on('click', function () {
      _self._listenChangeMoney = true;
      _self.emit("reBetting");
    });

    this.cancelBettingButton = buttonWrapper.find('#cancelBetting');
    this.buttons.push(this.cancelBettingButton);
    this.cancelBettingButton.on('click', function () {
      _self._listenChangeMoney = true;
      _self.emit("cancelBetting");
    });

    this.sellOddButton = buttonWrapper.find('#sellOdd');
    this.buttons.push(this.sellOddButton);
    this.sellOddButton.on('click', function () {
      _self.showSellPopup(1);
    });

    this.resignationButton = buttonWrapper.find('#resignation');
    this.buttons.push(this.resignationButton);
    this.resignationButton.on('click', function () {
      _self.emit("resignation");
    });

    this.sellEvenButton = buttonWrapper.find('#sellEven');
    this.buttons.push(this.sellEvenButton);
    this.sellEvenButton.on('click', function () {
      _self.showSellPopup(0);
    });

    this.getHostButton = buttonWrapper.find('#getHost');
    this.buttons.push(this.getHostButton);
    this.getHostButton.on('click', function () {
      _self.emit("getHost");
    });

    this.buttons.hide = function () {
      _self.buttons.forEach(function (item, index) {
        item.hide();
      });
    };
  };

  p.initDisk = function () {
    this.diskContainer = new createjs.Container();
    var diskPosition = initOptions.diskPosition;
    var chipResultPosition = initOptions.chipResultPosition;
    var bowlPosition = initOptions.bowlPosition;

    diskPosition.x = (initOptions.gameSize.width - diskPosition.width) / 2;
    diskPosition.y = -diskPosition.width * 3 / 5;
    diskPosition.shakeY = 0;

    diskPosition.scaleX = diskPosition.scaleY = diskPosition.scale;
    this.diskContainer.set(diskPosition);

    this.disk = new createjs.Bitmap((TWIST.imagePath || imagePath) + 'xocdia/' + 'disk.png');

    this.chipResultContainer = new createjs.Container();
    chipResultPosition.height = chipResultPosition.width = bowlPosition.width / Math.sqrt(2);
    chipResultPosition.x = chipResultPosition.y = (diskPosition.initWidth - chipResultPosition.width) / 2;

    this.chipResultContainer.set(initOptions.chipResultPosition);

    this.bowl = new createjs.Bitmap((TWIST.imagePath || imagePath) + 'xocdia/' + 'bowl.png');
    bowlPosition.x = (diskPosition.initWidth - bowlPosition.width) / 2;
    bowlPosition.y = (diskPosition.initHeight - bowlPosition.height) / 2;
    this.bowl.set(initOptions.bowlPosition);

    this.diskContainer.addChild(this.disk, this.chipResultContainer, this.bowl);
  };

  p.initMoveChipContainer = function () {
    this.moveChipContainer = new createjs.Container();
    var moveChipContainer = this.moveChipContainer;

    this.bettingPositions.forEach(function (item, index) {
      var bettingSlot = new createjs.Container();
      var position = {
        x: item.left + 30,
        y: item.top + 35,
        width: item.width - 80,
        height: item.height - 90,
        name: item.id
      };

      item.bettingSlot = bettingSlot;
      bettingSlot.set(position);
      moveChipContainer.addChild(bettingSlot);
    });
  };

  p.createVitualBetting = function (data) {
    var _self = this;
    var temp = TWIST.HTMLTemplate['xocDia/vitualBetting'];
    var vitualBetting = $(temp);
    if (data.id > 1) {
      vitualBetting.addClass('small-vitual-betting');
    }
    vitualBetting.addClass("betting" + data.id);
    vitualBetting.css({
      top: data.top,
      left: data.left,
      width: data.width,
      height: data.height
    });

    this.wrapperTemplate.append(vitualBetting);
    data.vitualBetting = vitualBetting;
    vitualBetting.on('click', function () {
      if (_self.userInfo.isHost) {
        _self.setSelectedBetting(data);
      } else {
        var emitData = {
          value: _self.currentBetting.value,
          currentBettingId: _self.currentBetting.id,
          slotBettingId: data.id
        };
        _self.emitBetting(emitData);
      }
    });
  };

  p.setSelectedBetting = function (data) {
    this.bettingPositions.forEach(function (item, index) {
      item.setSelected(false);
    });
    data.setSelected(true);
  };

  p.emitBetting = function (emitData) {

    if (this.userInfo.money < emitData.value) {
      this.showError({
        message: "Bạn không đủ tiền đặt cược !"
      });
      return;
    }
    this._listenChangeMoney = true;
    this.emit('betting', emitData);
  };

  p.createBettingPosition = function (data) {
    var _self = this;
    var temp = TWIST.HTMLTemplate['xocDia/bettingPosition'];
    var bettingPosition = $(temp);
    if (data.id > 1) {
      bettingPosition.addClass('small-betting-position');
    }
    bettingPosition.css(data);
    data.template = bettingPosition;
    this.wrapperTemplate.append(bettingPosition);
    bettingPosition.addClass("betting" + data.id);
    bettingPosition.mineBetting = bettingPosition.find('.mine-betting');
    this.addNumberEffect(bettingPosition.mineBetting);
    bettingPosition.totalBetting = bettingPosition.find('.total-betting');
    this.addNumberEffect(bettingPosition.totalBetting);
    bettingPosition.displayNameContainer = bettingPosition.find('.name');
    bettingPosition.displayNameContainer.html(data.displayName);
    bettingPosition.coinTittle = bettingPosition.find('.coin-tittle');
    data.valueMap.forEach(function (item, index) {
      _self.addCoins(item, bettingPosition.coinTittle);
    });
    bettingPosition.setMineBetting = function (betting) {
      this.mineBetting.html(Global.numberWithDot(betting));
      data.mineValue = betting;
    };
    bettingPosition.setTotalBetting = function (betting) {
      this.totalBetting.html(Global.numberWithDot(betting));
      data.totalValue = betting;
    };
    data.setMineBetting = function (betting) {
      if (_self.userInfo.isHost) {
        this.template.mineBetting.html("");
        this.mineValue = 0;
      } else {
        this.template.mineBetting.runEffect(betting);
        this.mineValue = betting;
      }
    };
    data.setTotalBetting = function (betting) {
      this.template.totalBetting.runEffect(betting);
      this.totalValue = betting;
    };
    data.setStatus = function (winnerSlots) {
      data.template.removeClass('active disabled');
      data.status = 0;
      if (!winnerSlots)
        return;
      if (winnerSlots.indexOf(data.id) > -1) {
        data.template.addClass('active');
        data.status = 1;
      } else {
        data.template.addClass('disabled');
      }
    };
    data.setSelected = function (flag) {
      data.isSelected = flag;
      data.template.removeClass('selected');
      if (flag) {
        data.template.addClass('selected');
      }
    };
    return bettingPosition;
  };

  p.addCoins = function (item, coinTittle) {
    var coinItem = $(TWIST.HTMLTemplate['xocDia/coin-item']);
    if (item) {
      coinItem.addClass("red-coin");
    }
    coinTittle.append(coinItem);
  };

  p.setBettingChipValue = function (listBetting) {
    this.chipButtons.forEach(function (item, index) {
      var dataItem = listBetting.find(function (_item, _index) {
        return item.id == _item.id;
      });
      item.value = dataItem.value;
      item.template.html(Global.numberWithDot2(item.value));
    });
  };

  p.setRemainingTime = function (remainingTime, totalTime) {
    if (["STATUS_BETTING"].indexOf(this.status) > -1) {
      this.desk.setRemainingTime(parseInt(remainingTime), {
        x: this.options.width / 2,
        y: this.options.height / 2 - this.options.timerRadius,
        font: "bold 60px Roboto Condensed",
        color: "#ffde00"
      });
      this.desk.setCicleTime(parseInt(remainingTime), parseInt(totalTime));
    } else {
      this.desk.setRemainingTime(-1);
      this.desk.clearTimer();
    }
  };

  p.drawBettingPositions = function (data) {
    var _self = this;
    var userBetting = 0;
    this.bettingPositions.forEach(function (item, index) {
      var dataItem = data.find(function (_item, _index) {
        return _item.id == item.id;
      });
      if (!dataItem)
        return;
      item.setMineBetting(dataItem.mineBetting);
      _self.userReBetting(item, dataItem.mineBetting);
      userBetting += parseInt(dataItem.mineBetting);
      item.setTotalBetting(dataItem.totalBetting);
      _self.playersBetting(item, dataItem.totalBetting - dataItem.mineBetting);
    });
    this.totalTable.setTotalBetting(userBetting);
  };

  p.setShowChipButtons = function (data) {
    var flag = this.userInfo.isHost();
    this.chipButtons.forEach(function (item, index) {
      if (flag) {
        item.template.hide();
      } else {
        item.template.show();
      }
    });
  };

  p.setShowChipButtons = function (data) {
    var flag = this.userInfo.isHost;
    this.chipButtons.forEach(function (item, index) {
      if (flag) {
        item.template.hide();
      } else {
        item.template.show();
      }
    });
  };

  p.setShowVitualBettings = function (status) {
    var flag = (this.userInfo.isHost && status == 4) || (!this.userInfo.isHost && status == 3);
    this.bettingPositions.forEach(function (item, index) {
      if (flag) {
        item.vitualBetting.show();
      } else {
        item.vitualBetting.hide();
      }
    });
  };

  p.removeSelectedBetting = function (status) {
    this.bettingPositions.forEach(function (item, index) {
      item.setSelected(false);
    });
  };

  p.changeStatus = function (data) {
    if (this.status == this.statusList[data.status])
      return;
    this.status = this.statusList[data.status];
    var func = this[this.status];
    this.buttons.hide();
    this.setShowChipButtons();
    this.setShowVitualBettings(data.status);
    this.removeSelectedBetting(data.status);
    this.setRemainingTime(data.remainingTime, data.totalTime);
    TWIST.Sound.stop();
    if (typeof func === "function") {
      func.call(this, data);
    }
    this.emit("ping");
  };

  p.STATUS_WAITING_FOR_START = function () {
//    this.chipResultContainer.removeAllChildren();
    this.bettingPositions.forEach(function (item, index) {
      item.template.removeClass('active disabled');
      item.bettingSlot.removeAllChildren();
      item.setMineBetting(0);
      item.setTotalBetting(0);
    });
    this.totalTable.setTotalBetting(0);
    this.totalTable.setTotalWin(0);

    this.closeDisk();
//    this.host.setMessage("Chuẩn bị ván mới !");
    this.host.setMessage("");
    if (this.userInfo.isHost) {
//      this.resignationButton.show();
    } else if (this.isSuggestHost) {
//      this.getHostButton.show();
    }
  };

  p.STATUS_SHAKE_DISK = function () {
    this.isSuggestHost = false;
    this.host.background.show();
    this.emit("xocDia");
    this.host.setMessage("Nhà cái xóc đĩa !");
  };

  p.STATUS_BETTING = function (data) {
    var srcs = ['news/anhoidatcuoc', 'news/batdaudatcuoc'
              , 'news/moidatcuoc', 'news/datcuocdianh'];
    var src = srcs[Math.floor(Math.random() * srcs.length)];
    TWIST.Sound.play(src);
    this.host.background.hide();
    this.host.setMessage("");
    if (data.showReBetting) {
      this.reBettingButton.show();
    }
    if (data.showCancelBetting) {
      this.cancelBettingButton.show();
    }
  };

  p.STATUS_ARRANGING = function (data) {
    var defaultTime = 3;
    if (this.host.name)
      defaultTime = 15;
//    this.setRemainingTime(data.remainingTime || defaultTime);
//    this.host.setMessage("Thời gian cái thừa thiếu !");
//    this.host.setMessage("Hết thời gian đặt cược !");
    if (this.userInfo.isHost) {
      this.sellEvenButton.show();
      this.sellOddButton.show();
    } else {
      this.lastBettings = this.bettingPositions.map(function (item) {
        return {
          id: item.id,
          value: item.mineValue
        };
      });
    }
  };

  p.END_GAME = function () {
    this.sellPopup.hide();
    this.host.setMessage("Mở bát !");
    this.totalBettingValue = 0;
  };

  TWIST.XocDia = XocDia;

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