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
