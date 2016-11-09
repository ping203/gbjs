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
    chipSize: {
      width: 75,
      height: 75,
      miniWidth: 24,
      miniHeight: 24,
      miniRatio: 0.33
    },
    bettingChipPositions: [{y: 487.5 - 11, x: 450 - 90 - 105 + 37.5 - 11}, {y: 487.5 - 11, x: 450 - 90 + 37.5 - 11},
      {y: 487.5 - 11, x: 450 - 90 + 105 + 37.5 - 11}, {y: 487.5 - 11, x: 450 - 90 + 210 + 37.5 - 11}],
    playerPosition: {
      y: 256,
      x: 844
    },
    hostPosition: {
      x: 450,
      y: 100
    },
    userPosition: {
      y: 480,
      x: 100
    },
    chipSrcList: ['1st-chip.png', '2nd-chip.png', '3rd-chip.png', '4th-chip.png'],
    width: 900,
    height: 560,
    moveChipAnimationTime: 500,
    diskPosition: {
      x: 360,
      y: 120
    },
    bowlPosition: {
      x: 11,
      y: 3
    },
    chipResultPosition: {
      x: 40,
      y: 30,
      width: 80,
      height: 60
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
      avatar: "https://s.gravatar.com/avatar/a4fae1e89a441c83f656a7ae59f9c19f?s=80",
      uuid: "",
      username: "",
      money: 0,
      isHost: false
    });
    this.bettingPositions = [{
        name: "Bốn Trắng",
        displayName: "1:10",
        valueMap: [0, 0, 0, 0],
        ratio: 10,
        id: 2,
        top: 290,
        left: 130,
        width: 110,
        height: 115
      }, {
        name: "Bốn Đỏ",
        displayName: "1:10",
        valueMap: [1, 1, 1, 1],
        ratio: 10,
        id: 3,
        top: 290,
        left: 262.5,
        width: 110,
        height: 115
      }, {
        name: "Ba Trắng",
        displayName: "1:3",
        valueMap: [0, 0, 0, 1],
        ratio: 3,
        id: 4,
        top: 290,
        left: 395,
        width: 110,
        height: 115
      }, {
        name: "Ba đỏ",
        displayName: "1:3",
        valueMap: [0, 1, 1, 1],
        ratio: 3,
        id: 5,
        top: 290,
        left: 527.5,
        width: 110,
        height: 115
      }, {
        name: "Hai đỏ",
        displayName: "1:1.5",
        valueMap: [0, 0, 1, 1],
        ratio: 1.5,
        id: 6,
        top: 290,
        left: 660,
        width: 110,
        height: 115
      }, {
        name: "Chẵn",
        displayName: "Chẵn",
        valueMap: [0],
        ratio: 1,
        id: 0,
        top: 140,
        left: 150,
        width: 160,
        height: 115
      }, {
        name: "Lẻ",
        displayName: "Lẻ",
        valueMap: [1],
        ratio: 1,
        id: 1,
        top: 140,
        left: 590,
        width: 160,
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
  
    this.userInfo.isHost = (data.host == this.userInfo.uuid);
    this.changeStatus({
      newStatus: data.status
    });
    this.setHost(data.host);
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

    this.initBettingPositionList();

    this.initProfile();

    this.initHost();

    this.initGameCanvas();

    this.initVitualBetting();

    this.initInviteButton();

    this.initChipButton();

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
    });

    this.on("xocDia", function (data) {
      _self.xocDia(data);
    });

    this.on("openDisk", function (data) {
      _self.openDisk(data);
    });

    this.on("hostPayment", function (data) {
      _self.hostPaymentData = data;
    });

    this.on("openDiskComplete", function (data) {
      _self.hostPaymentPhase1();
    });
  };

  p.hostPaymentPhase1 = function () {
    var _self = this;
    var data = this.hostPaymentData;
    if (!data)
      return;

    this.bettingPositions.forEach(function (item, index) {
      if (!item.status) {
        _self.moveChipToHost(item.id);
        item.setMineBetting(0);
        item.setTotalBetting(0);
      }
    });
  };

  p.hostPaymentPhase2 = function () {
    var _self = this;
    var data = this.hostPaymentData;
    if (!data)
      return;

    this.bettingPositions.forEach(function (item, index) {
      if (item.status) {
        _self.paymentChipToSlotBetting(item.id, item.totalValue * item.ratio);
        item.setTotalBetting(item.totalValue * (item.ratio + 1));
        item.setMineBetting(item.mineValue * (item.ratio + 1));
      }
    });
  };

  p.hostPaymentPhase3 = function () {
    var _self = this;
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
    var listChipMove = this.convertValueToChips(value);
    var length = listChipMove.length;
    listChipMove.forEach(function (item, index) {
      var chip = listChip.find(function (_item, _index) {
        return _item.type == item;
      });
      if (chip) {
        var fromPosition = chip.localToGlobal(0, 0);
        var toPosition = position;
        chip.set(fromPosition);
        _self.stage.addChild(chip);
        setTimeout(function () {
          chip.move(fromPosition, toPosition, function () {
            _self.stage.removeChild(chip);
          });
        }, 300 / length * index);
      }
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
    var _self = this;
    var bettingPosition = this.bettingPositions.find(function (item, index) {
      return item.id == data.id;
    });
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
      _self.playersBetting(item, dataItem.totalBetting - item.mineValue);
    });
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
    var unit = this.roomBetting;
    var quantityOfUnit = parseInt(value / unit);
    if (!quantityOfUnit)
      return;
    var waitAnimationStep = 200 / quantityOfUnit;
    for (var i = 0; i < quantityOfUnit; i++) {
      this.timeOutList.push(setTimeout(function () {
        _self.bettingChipAction(slotBetting.id, _self.currentBetting.id, true);
      }, waitAnimationStep * i));
    }
  };

  p.convertValueToChips = function (value) {
    var listChip = [];
    var unit = this.roomBetting;
    var totalRatio = 0;
    var totalArray = [];
    this.chipButtons.forEach(function (item, index) {
      totalRatio += item.ratio * item.concentration;
      for (var i = 0; i < item.concentration; i++) {
        totalArray.push(item.id);
      }
    });
    var totalUnit = totalRatio * unit;
    var quantityOfTotalUnit = parseInt(value / totalUnit);
    for (var i = 0; i < quantityOfTotalUnit; i++) {
      listChip = listChip.concat(totalArray);
    }
    var quantityOfUnit = parseInt((value % totalUnit) / unit);
    for (var i = 0; i < quantityOfUnit; i++) {
      listChip.push(this.chipButtons[0].id);
    }
    return Global.shuffle(listChip);
  };

  p.xocDia = function () {
    var _self = this;
    var message, position;
    if (this.status === 'STATUS_SHAKE_DISK') {
      position = {
        x: initOptions.diskPosition.x + ((Math.random() - 0.5) < 0 ? -1 : 1) * (Math.random() * 10 + 10),
        y: initOptions.diskPosition.y + (this.diskContainer.isTop ? -1 : 1) * (Math.random() * 5 + 10)
      };
      message = 'xocDia';
    } else {
      position = initOptions.diskPosition;
      message = 'endXocDia';
    }
    createjs.Tween.get(this.diskContainer)
            .to(position, 100)
            .call(function () {
              _self.diskContainer.isTop = !_self.diskContainer.isTop;
              _self.emit(message);
            });
  };

  p.openDisk = function (data) {
    var _self = this;
    var newY = -150;
    this.history.addResult(data.winnerSlots);
    var message, position;
    this.chipResultContainer.removeAllChildren();
    data.map.forEach(function (item, index) {
      _self.createResultChip(item);
    });
    this.bowl.set({
      y: initOptions.bowlPosition.y,
      alpha: 1
    });
    createjs.Tween.get(this.bowl)
            .to({
              y: newY,
              alpha: 0
            }, 3000)
            .call(function () {
              _self.emit("openDiskComplete");
            });
    this.bettingPositions.forEach(function (item, index) {
      item.setStatus(data.winnerSlots);
    });
  };

  p.createResultChip = function (isRed) {
    var src = imagePath + (isRed ? "red.png" : "white.png");
    var resultChip = new createjs.Bitmap(src);
    resultChip.set({
      x: Math.random() * (this.chipResultContainer.width - 13),
      y: Math.random() * (this.chipResultContainer.height - 13)
    });
    this.chipResultContainer.addChild(resultChip);
    return resultChip;
  };

  p.createChip = function (id) {
    var scale = initOptions.chipSize.miniRatio;
    var src = imagePath + initOptions.chipSrcList[id];
    var chip = new createjs.Bitmap(src);
    chip.set({
      scaleX: scale,
      scaleY: scale,
      type: id
    });
    chip.move = function (fromPosition, toPosition, callback) {
      chip.set(fromPosition);
      toPosition.x = toPosition.x + (Math.random() - 0.5) * 5;
      toPosition.y = toPosition.y + (Math.random() - 0.5) * 5;
      createjs.Tween.get(chip)
              .to(toPosition, initOptions.moveChipAnimationTime)
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
    avatarContainer.css("background-image", "url(" + this.userInfo.avatar + ")");
    usernameContainer.text(this.userInfo.username);
    this.userMoney.runEffect(this.userInfo.money);
  };

  p.initHistory = function () {
    var _self = this;
    this.history = $(TWIST.HTMLTemplate['xocDia/history']);
    this.wrapperTemplate.append(this.history);
    this.historyList = [];
    var mapName = {
      2: 4,
      3: 0,
      4: 3,
      5: 1,
      6: 2
    };
    this.history.addResult = function (winnerSlots) {
      var isOdd = winnerSlots.find(function (item, index) {
        return item < 2;
      });
      var slotId = winnerSlots.find(function (item, index) {
        return item > 1;
      });
      var resultChip = $(TWIST.HTMLTemplate['xocDia/resultChip']);
      if (isOdd) {
        resultChip.addClass('result-chip-odd');
      }
      resultChip.children().html(mapName[slotId]);
      _self.historyList.push(resultChip);
      _self.history.append(resultChip);
      if (_self.historyList.length > 16) {
        _self.historyList[0].remove();
        _self.historyList.shift();
      }
    };
  };

  p.initHost = function () {
    this.host = $(TWIST.HTMLTemplate['xocDia/host']);
    this.wrapperTemplate.append(this.host);
    this.host.background = this.host.find('.host-background');
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

  p.setHost = function (hostname) {
    this.host.hostName.removeClass('active');
    if (hostname) {
      this.host.hostName.addClass('active');
      this.host.hostName.html(hostname);
    }
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

    this.stage.addChild(this.diskContainer, this.moveChipContainer);
  };

  p.initChipButton = function () {
    var _self = this;
    this.chipWrapper = $(TWIST.HTMLTemplate['xocDia/chips']);
    this.wrapperTemplate.append(this.chipWrapper);

    this.chipButtons = [{
        id: 0,
        value: 1000,
        ratio: 1,
        concentration: 1,
        template: this.chipWrapper.find('.chip-1st')
      }, {
        id: 1,
        value: 10000,
        ratio: 2,
        concentration: 1,
        template: this.chipWrapper.find('.chip-2nd')
      }, {
        id: 2,
        value: 100000,
        ratio: 4,
        concentration: 1,
        template: this.chipWrapper.find('.chip-3rd')
      }, {
        id: 3,
        value: 1000000,
        ratio: 10,
        concentration: 1,
        template: this.chipWrapper.find('.chip-4th')
      }];
    this.chipButtons.active = true;
    this.chipButtons.forEach(function (item, index) {
      item.template.on('click', function () {
        _self.setBetting(item);
      });
    });
  };

  p.initButton = function () {
    var _self = this;

    this.buttons = [];

    var buttonWrapper = $(TWIST.HTMLTemplate['xocDia/buttons']);

    this.wrapperTemplate.append(buttonWrapper);

    this.reBettingButton = buttonWrapper.find('#reBetting');
    this.buttons.push(this.reBettingButton);

    this.cancelBettingButton = buttonWrapper.find('#cancelBetting');
    this.buttons.push(this.cancelBettingButton);

    this.sellOddButton = buttonWrapper.find('#sellOdd');
    this.buttons.push(this.sellOddButton);

    this.resignationButton = buttonWrapper.find('#resignation');
    this.buttons.push(this.resignationButton);

    this.sellEvenButton = buttonWrapper.find('#sellEven');
    this.buttons.push(this.sellEvenButton);

    this.getHostButton = buttonWrapper.find('#getHost');
    this.buttons.push(this.getHostButton);

    this.buttons.hide = function () {
      _self.buttons.forEach(function (item, index) {
        item.hide();
      });
    };

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
    this.diskContainer.set(initOptions.diskPosition);

    this.disk = new createjs.Bitmap(imagePath + 'disk.png');
    this.chipResultContainer = new createjs.Container();
    this.chipResultContainer.set(initOptions.chipResultPosition);
    this.bowl = new createjs.Bitmap(imagePath + 'bowl.png');
    this.bowl.set(initOptions.bowlPosition);

    this.diskContainer.addChild(this.disk, this.chipResultContainer, this.bowl);
  };

  p.initMoveChipContainer = function () {
    this.moveChipContainer = new createjs.Container();
    var moveChipContainer = this.moveChipContainer;

    this.bettingPositions.forEach(function (item, index) {
      var bettingSlot = new createjs.Container();
      var position = {
        x: item.left + 10,
        y: item.top,
        width: item.width - 20,
        height: item.height - 30,
        name: item.id
      };
      if (item.id > 1) {
        position.y += 30;
        position.height -= 30;
      }

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

    this.wrapperTemplate.append(vitualBetting);
    data.vitualBetting = vitualBetting;
    vitualBetting.on('click', function () {
      var emitData = {
        value: _self.currentBetting.value,
        currentBettingId: _self.currentBetting.id,
        slotBettingId: data.id
      };
      _self.emitBetting(emitData);
    });
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
    this.roomBetting = betting;
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
    var _self = this;
    this.bettingPositions.forEach(function (item, index) {
      var dataItem = data.find(function (_item, _index) {
        return _item.id == item.id;
      });
      if (!dataItem)
        return;
      item.setMineBetting(dataItem.mineBetting);
      _self.userReBetting(item, dataItem.mineBetting);
      item.setTotalBetting(dataItem.totalBetting);
      _self.playersBetting(item, dataItem.totalBetting - dataItem.mineBetting);
    });
  };

  p.STATUS_WAITING_FOR_START = function () {
    this.bettingPositions.forEach(function (item, index) {
      item.template.removeClass('active disabled');
    });
    this.host.setMessage("Chờ ván mới !");
    this.buttons.hide();
  };

  p.STATUS_SHAKE_DISK = function () {
//    this.vitualButtonList.hide();
    this.host.setMessage("Xóc, xóc !!!");
    this.buttons.hide();
  };

  p.STATUS_BETTING = function () {
    this.host.setMessage("Đặt đi anh ơi");
    this.buttons.hide();
    if (!this.userInfo.isHost) {
      this.cancelBettingButton.show();
      this.reBettingButton.show();
    }
  };

  p.STATUS_ARRANGING = function () {
    this.host.setMessage("Chờ nhà cái thừa thiếu");
    this.buttons.hide();
    if (this.userInfo.isHost) {
      this.sellEvenButton.show();
      this.sellOddButton.show();
    }
  };

  p.END_GAME = function () {
    this.host.setMessage("Trả tiền !");
    this.buttons.hide();
  };

  TWIST.XocDia = XocDia;

})();