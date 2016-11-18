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
