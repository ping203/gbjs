this.TWIST = this.TWIST || {};

(function () {
  "use strict";

  var gameSize;

  var imagePath = (TWIST.imagePath || (location.origin + location.pathname + '../src/images/')) + 'xocdia/';

  var initOptions = {
    gameSize: {
      width: 900,
      height: 560
    },
    width: 900,
    height: 560
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
      avatar: "https://s.gravatar.com/avatar/a4fae1e89a441c83f656a7ae59f9c19f?s=80",
      uuid: "",
      username: "",
      money: 0,
      isRoomMaster: false
    });
    this.bettingPositions = [{
        name: "Chẵn",
        displayName: "Chẵn",
        valueMap: [0],
        ratio: 1,
        code: 0,
        top: 140,
        left: 150,
        width: 160,
        height: 115
      }, {
        name: "Lẻ",
        displayName: "Lẻ",
        valueMap: [1],
        ratio: 1,
        code: 1,
        top: 140,
        left: 590,
        width: 160,
        height: 115
      }, {
        name: "Bốn Trắng",
        displayName: "1:10",
        valueMap: [0, 0, 0, 0],
        ratio: 10,
        code: 2,
        top: 290,
        left: 130,
        width: 110,
        height: 115
      }, {
        name: "Bốn Đỏ",
        displayName: "1:10",
        valueMap: [1, 1, 1, 1],
        ratio: 3,
        code: 3,
        top: 290,
        left: 262.5,
        width: 110,
        height: 115
      }, {
        name: "Ba Trắng",
        displayName: "1:3",
        valueMap: [0, 0, 0, 1],
        ratio: 1.5,
        code: 4,
        top: 290,
        left: 395,
        width: 110,
        height: 115
      }, {
        name: "Ba đỏ",
        displayName: "1:3",
        valueMap: [0, 1, 1, 1],
        ratio: 3,
        code: 5,
        top: 290,
        left: 527.5,
        width: 110,
        height: 115
      }, {
        name: "Hai đỏ",
        displayName: "1:1.5",
        valueMap: [0, 0, 1, 1],
        ratio: 4,
        code: 6,
        top: 290,
        left: 660,
        width: 110,
        height: 115
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
//    data = {
//      status : 1,
//      bettingPositions : [{
//          id : 1,//(0-chẵn, 1-lẻ, 2-4đen, 3-3đen, 4-4trắng, 5-3trắng, 6-2đenđỏ)
//          //client (0-chẵn, 1-lẻ, 2-4đen, 3-3đen, 4-4trắng, 5-3trắng, 6-2đenđỏ)
//          totalBetting : 1000,
//          miniBetting : 299,
//          ratio : 1
//      }],
//      remainingTime : 12,
//      host : "tieukiemtien",
//      betting : 10
//    };

    this.userInfo.isRoomMaster = (data.host == this.userInfo.uuid);
    this.changeStatus({
      newStatus: data.status
    });
    this.setBettingChipValue(data.betting);
    this.setRemainingTime(data.remainingTime);
    this.drawBettingPositions(data.bettingPositions);
  };

  p.initButtonBar = function () {};

  p.initInviteList = function () {};

  p.initResultPanel = function () {};

  p.initTemplate = function () {
    var _self = this;
    this.wrapperTemplate = $(TWIST.HTMLTemplate['xocDia/wrapper']);
    this.wrapper.append(this.wrapperTemplate);

    this.initHistory();

    this.initHost();

    this.initBettingPositionList();

    this.initProfile();

    this.initGameCanvas();

    this.initVitualBetting();

    this.initInviteButton();

    this.initChipButton();

    this.errorPanel = $(TWIST.HTMLTemplate['xocDia/errorPanel']);
    this.wrapperTemplate.append(this.errorPanel);
    this.errorPanel.hide();

    this.effectWrapper = $(TWIST.HTMLTemplate['effect/wrapper']);
    this.wrapperTemplate.append(this.effectWrapper);

    this.money = this.user.find('.money');

    this.setBetting(this.chipButtons[0]);
  };

  p.setBetting = function (item) {
    this.chipWrapper.find('.chip').removeClass('active');
    item.template.addClass("active");
    this.info.betting = item.value;
  };

  p.pushXocDiaEvent = function () {
    var _self = this;

    this.on("userInfo", function () {
      _self.renderUserInfo(arguments[0]);
    });

    this.on("roomInfo", function (data) {
      _self.updateMoney(data);
    });

    this.on("updatePots", function (data) {
      _self.bindPots(data);
    });

    this.on("error", function (message) {
      _self.showError(message);
    });
  };

  p.renderUserInfo = function () {
    var avatarContainer = this.user.find('.avatar');
    var usernameContainer = this.user.find('.username');
    var moneyContainer = this.user.find('.money');
    avatarContainer.css("background-image", "url(" + this.userInfo.avatar + ")");
    usernameContainer.text(this.userInfo.username);
    var money = Global.numberWithDot(this.userInfo.money);
    moneyContainer.text(money);
  };

  p.initHistory = function () {
    this.history = $(TWIST.HTMLTemplate['xocDia/history']);
    this.wrapperTemplate.append(this.history);
    this.history.addResult = function () {
    };
  };

  p.initHost = function () {
    this.host = $(TWIST.HTMLTemplate['xocDia/host']);
    this.wrapperTemplate.append(this.host);
    this.host.hostName = this.host.find('.host-name');
    this.host.chatBox = this.host.find('.chat-box');
    this.host.hostMessage = this.host.find('.chat-box-inner');
    this.host.setMessage = function (message) {
      if (message) {
        this.chatBox.show();
        this.hostMessage.html(message);
      } else {
        this.chatBox.hide();
      }
    };
  };

  p.initInviteButton = function () {
    this.inviteButton = $(TWIST.HTMLTemplate['xocDia/inviteButton']);
    this.wrapperTemplate.append(this.inviteButton);
  };

  p.initBettingPositionList = function () {
    var _self = this;
    var bettingPositions = this.bettingPositions;
    bettingPositions.forEach(function (item, index) {
      _self.createBettingPosition(item);
    });
  };

  p.initVitualBetting = function () {

  };

  p.initProfile = function () {
    this.user = $(TWIST.HTMLTemplate['xocDia/user']);
    this.wrapperTemplate.append(this.user);
  };

  p.initGameCanvas = function () {
    this.wrapperTemplate.append(this.canvas);

    this.initDisk();

    this.initMoveChipContainer();

    this.stage.addChild(this.diskContainer, this.moveChipContainer);
  };

  p.initChipButton = function () {
    var _self = this;
    this.chipWrapper = $(TWIST.HTMLTemplate['xocDia/chips']);
    this.wrapperTemplate.append(this.chipWrapper);

    this.chipButtons = [{
        id: 1,
        value: 1000,
        ratio: 1,
        template: this.chipWrapper.find('.chip-1st')
      }, {
        id: 2,
        value: 10000,
        ratio: 2,
        template: this.chipWrapper.find('.chip-2nd')
      }, {
        id: 3,
        value: 100000,
        ratio: 5,
        template: this.chipWrapper.find('.chip-3rd')
      }, {
        id: 4,
        value: 1000000,
        ratio: 10,
        template: this.chipWrapper.find('.chip-4th')
      }];
    this.chipButtons.active = true;
    this.chipButtons.forEach(function (item, index) {
      item.template.on('click', function () {
        if (_self.chipButtons.active) {
          _self.chipButtons.forEach(function (_item, _index) {
            _item.template.removeClass('active');
          });
          $(this).addClass('active');
          _self.currentBetting = item;
        }
      });
    });
  };

  p.initButton = function () {
    var _self = this;

    this.buttons = [];

    var buttonWrapper = $(TWIST.HTMLTemplate['xocDia/buttons']);

    this.wrapperTemplate.append(buttonWrapper);

    this.chipButtons.forEach(function (item, index) {
      item.template.on('click', function (event) {
        if (_self.status !== 'pause' && _self.status !== 'effecting')
          return;
        TWIST.Sound.play("minigame/Common_Click");
        _self.setBetting(item);
      });
    });
  };

  p.initDisk = function () {
    this.diskContainer = new createjs.Container();
    this.diskContainer.set({
      x: 360,
      y: 120
    });

    this.disk = new createjs.Bitmap(imagePath + 'disk.png');
    this.bowl = new createjs.Bitmap(imagePath + 'bowl.png');
    this.bowl.set({
      x: 11,
      y: 3
    });

    this.diskContainer.addChild(this.disk, this.bowl);
  };

  p.initMoveChipContainer = function () {
    this.moveChipContainer = new createjs.Container();
  };

  p.createBettingPosition = function (data) {
    var _self = this;
    var temp = TWIST.HTMLTemplate['xocDia/bettingPosition'];
    var bettingPosition = $(temp);
    if (data.code > 1) {
      bettingPosition.addClass('small-betting-position');
    }
    data.template = bettingPosition;
    this.wrapperTemplate.append(bettingPosition);
    bettingPosition.addClass("betting" + data.code);
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
    };
    bettingPosition.setTotalBetting = function (betting) {
      this.totalBetting.html(Global.numberWithDot(betting));
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

  p.setBettingChipValue = function (betting) {
    betting = parseInt(betting);
    this.chipButtons.forEach(function (item, index) {
      item.value = betting * item.ratio;
      item.template.html(Global.numberWithDot2(item.value));
    });
  };

  p.setRemainingTime = function (remainingTime) {
    if (["STATUS_BETTING", "STATUS_ARRANGING"].indexOf(this.status) > -1) {
      this.desk.setRemainingTime(parseInt(remainingTime), {
        x: this.options.width / 2,
        y: this.options.height / 2 + 120
      });
    }
  };

  p.drawBettingPositions = function (data) {
    this.bettingPositions.forEach(function (item, index) {
      var dataItem = data.find(function (_item, _index) {
        return _item.code == item.code;
      });
      if (!dataItem)
        return;
      var template = item.template;
      template.mineBetting.runEffect(dataItem.mineBetting);
      template.totalBetting.runEffect(dataItem.totalBetting);
    });
  };

  p.STATUS_WAITING_FOR_START = function () {
//    this.buttonWrapper.hide();
//    this.vitualButtonList.hide();
    this.host.setMessage("Chờ ván mới !");
  };

  p.STATUS_SHAKE_DISK = function () {
    this.host.setMessage();
    this.vitualButtonList.hide();
    this.host.setMessage("Xóc !!!");
  };

  p.STATUS_BETTING = function () {
    this.host.setMessage("Đặt đi anh ơi");
  };

  p.STATUS_ARRANGING = function () {
    this.host.setMessage("Chờ nhà cái thừa thiếu");
  };

  p.END_GAME = function () {
    this.host.setMessage("Trả tiền !");
  };

  TWIST.XocDia = XocDia;

})();