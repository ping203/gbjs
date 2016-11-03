this.TWIST = this.TWIST || {};

(function () {
  "use strict";

  var gameSize;

  var initOptions = {
    gameSize: {
      width: 900,
      height: 560
    },
    width: 200,
    height: 200
  };

  function XocDia(wrapper, options) {
    this.wrapper = $(wrapper);
    this.options = $.extend(initOptions, options);
    this.initXocDia();
  }

  var p = XocDia.prototype = new TWIST.InRoomGame();

  p.initXocDia = function () {
    this.initVariable();
    this.initTemplate();
    this.initInRoomGame();
    this.bindButton();
    this.pushXocDiaEvent();
  };

  p.initVariable = function () {
    this.info = {
      betting: 1000
    };
    this.userInfo = {};
    this.bettingPositions = [{
        name: "Chẵn",
        ratio: 1,
        code : 1,
        top : 140,
        left : 150,
        width : 160,
        height : 115
    },{
        name: "Lẽ",
        ratio: 1,
        code : 2,
        top : 140,
        left : 590,
        width : 160,
        height : 115
    },{
        name: "Bốn Đỏ",
        ratio: 10,
        code : 3,
        top : 290,
        left : 130,
        width : 110,
        height : 115
    },{
        name: "Ba Đỏ",
        ratio: 3,
        code : 4,
        top : 290,
        left : 262.5,
        width : 110,
        height : 115
    },{
        name: "Hai Đỏ",
        ratio: 1.5,
        code: 5,
        top : 290,
        left : 395,
        width : 110,
        height : 115
    },{
        name: "Một Đỏ",
        ratio: 3,
        code: 6,
        top : 290,
        left : 527.5,
        width : 110,
        height : 115
    },{
        name: "Bốn Đen",
        ratio: 4,
        code: 7,
        top : 290,
        left : 660,
        width : 110,
        height : 115
    }];
  };

  p.bindButton = function () {

  };

  p.drawRoom = function () {
    this.playersContainer = new createjs.Container();
    this.desk = new TWIST.Desk(this.options);
    this.desk.name = "desk";
    this.stage.addChild(this.desk, this.playersContainer);
    this.wrapper.css(initOptions.gameSize);
  };

  p.initButtonBar = function () {};

  p.initInviteList = function () {};

  p.initResultPanel = function () {};

  p.initTemplate = function () {
    var _self = this;
    this.wrapperTemplate = $(TWIST.HTMLTemplate['xocDia/wrapper']);
    this.wrapper.append(this.wrapperTemplate);

    this.wrapperTemplate.append(this.canvas);

    
    this.initHistory();

    this.initHost();

    this.initInviteButton();
    
    this.initBetPositionList();

    this.chipWrapper = $(TWIST.HTMLTemplate['xocdia/chips']);
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

    this.errorPanel = $(TWIST.HTMLTemplate['xocdia/errorPanel']);
    this.wrapperTemplate.append(this.errorPanel);
    this.errorPanel.hide();

    this.user = $(TWIST.HTMLTemplate['xocDia/user']);
    this.wrapperTemplate.append(this.user);

    this.effectWrapper = $(TWIST.HTMLTemplate['effect/wrapper']);
    this.wrapperTemplate.append(this.effectWrapper);

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
  };

  p.setBetting = function (item) {
    this.chipWrapper.find('.chip').removeClass('active');
    item.template.addClass("active");
    this.info.betting = item.value;
  };

  p.pushXocDiaEvent = function () {
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

  p.initHistory = function () {
    this.history = $(TWIST.HTMLTemplate['xocDia/history']);
    this.wrapperTemplate.append(this.history);
    this.history.addResult = function () {
    };
  };

  p.initHost = function () {
    this.host = $(TWIST.HTMLTemplate['xocDia/host']);
    this.wrapperTemplate.append(this.host);
  };

  p.initInviteButton = function () {
    this.inviteButton = $(TWIST.HTMLTemplate['xocDia/inviteButton']);
    this.wrapperTemplate.append(this.inviteButton);
  };
  
  p.initBetPositionList = function() {
    var _self = this;
    this.betPositionList = [];
    var bettingPositions = this.bettingPositions;
    bettingPositions.forEach(function(item, index){
      
    });
  };

  TWIST.XocDia = XocDia;

})();