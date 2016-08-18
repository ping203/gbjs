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