this.TWIST = this.TWIST || {};

(function () {
    "use strict";

    var initSettings = {
        volume: 1
    };

    function Sound() {
        this._isInited = false;
        this.settings;
    }

    var p = Sound.prototype;

    p.init = function (options) {
        options = options || {};
        this.settings = options && options.settings || {};
        var src = ((options && options.assetPath) || TWIST.assetPath || '../src/themes/gb-web/') + 'sounds/';
        createjs.Sound.registerSounds(this._sounds, src);
        this._isInited = true;
    };


    p.play = function (src) {
        // This is fired for each sound that is registered.
        if (!this._isInited)
            return;
        var instance = createjs.Sound.play(src);  // play using id.  Could also use full source path or event.src.
        instance.volume = (typeof this.settings.volume === "undefined") ? 1 : this.settings.volume;
        return instance;
    };


    p.stop = function (src) {
        createjs.Sound.stop(src);  //
    };

    p._sounds = [
        {id: 'card/chia_bai', src: 'card/chia_bai.ogg'},
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
        {id: 'tone/bellopen', src: 'tone/bellopen.ogg'},
        {id: 'tone/chuyen_view', src: 'tone/chuyen_view.ogg'},
        {id: 'tone/end_vongquay', src: 'tone/end_vongquay.ogg'}
    ];

    TWIST.Sound = new Sound();
})();


