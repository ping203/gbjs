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


