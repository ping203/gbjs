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


