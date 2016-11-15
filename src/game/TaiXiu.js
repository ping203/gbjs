this.TWIST = this.TWIST || {};

(function () {
  "use strict";

  var gameSize;

  var imagePath = location.origin + location.pathname + '../src/images/';

  var initOptions = {
    gameSize: {
      width: 870,
      height: 560,
      position: "relative"
    },
    chipSize: {
      width: 75,
      height: 75,
      miniWidth: 18,
      miniHeight: 18,
      miniRatio: 0.24
    },
    bettingChipPositions: [{y: 487.5 - 11, x: 385 - 90 - 105 + 37.5 - 11}, {y: 487.5 - 11, x: 385 - 90 + 37.5 - 11},
      {y: 487.5 - 11, x: 385 - 90 + 105 + 37.5 - 11}, {y: 487.5 - 11, x: 385 - 90 + 210 + 37.5 - 11}],
    playerPosition: {
      y: 266,
      x: 835
    },
    hostPosition: {
      x: 385,
      y: 50
    },
    userPosition: {
      y: 480,
      x: 50
    },
    chipSrcList: ['1st-chip.png', '2nd-chip.png', '3rd-chip.png', '4th-chip.png'],
    width: 870,
    height: 560,
    moveChipAnimationTime: 500,
    diskPosition: {
      x: 230,
      y: 10,
      scaleX: 0.6,
      scaleY: 0.6
    },
    bowlPosition: {
      x: 11,
      y: 3,
      alpha: 1
    },
    chipResultPosition: {
      x: 55,
      y: 30,
      width: 80,
      height: 60
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

    this.bettingPositions = [{id: 0, name: "Tam nhất", top: 83, left: 0, width: 117, height: 103, types: [1, 'top-left', 'top', 'left']}
      , {id: 1, name: "Tam nhị", top: 83, left: 117, width: 91, height: 103, types: [1, 'top']}
      , {id: 2, name: "Tam tam", top: 83, left: 208, width: 91, height: 103, types: [1, 'top']}
      , {id: 3, name: "Tam trùng", top: 83, left: 299, width: 172, height: 103, types: [2, 'top']}
      , {id: 4, name: "Tam tứ", top: 83, left: 471, width: 91, height: 103, types: [1, 'top']}
      , {id: 5, name: "Tam ngũ", top: 83, left: 562, width: 91, height: 103, types: [1, 'top']}
      , {id: 6, name: "Tam lục", top: 83, left: 653, width: 117, height: 103, types: [1, 'top', 'right', 'top-right']}
      , {id: 7, name: "Xỉu", top: 186, left: 0, width: 117, height: 152, types: [3, 'left']}
      , {id: 8, name: "Bốn điểm", top: 186, left: 117, width: 76, height: 76, types: [4]}
      , {id: 9, name: "Năm điểm", top: 186, left: 193, width: 76, height: 76, types: [4]}
      , {id: 10, name: "Sáu điểm", top: 186, left: 269, width: 76, height: 76, types: [4]}
      , {id: 11, name: "Bẩy điểm", top: 186, left: 345, width: 80, height: 76, types: [4]}
      , {id: 12, name: "Tám điểm", top: 186, left: 425, width: 76, height: 76, types: [4]}
      , {id: 13, name: "Chín điểm", top: 186, left: 501, width: 76, height: 76, types: [4]}
      , {id: 14, name: "Mười điểm", top: 186, left: 577, width: 76, height: 76, types: [4]}
      , {id: 15, name: "Tài", top: 186, left: 653, width: 117, height: 152, types: [3, 'right']}
      , {id: 16, name: "Mười một điểm", top: 262, left: 117, width: 76, height: 76, types: [4]}
      , {id: 17, name: "Mười hai điểm", top: 262, left: 193, width: 76, height: 76, types: [4]}
      , {id: 18, name: "Mười ba điểm", top: 262, left: 269, width: 76, height: 76, types: [4]}
      , {id: 19, name: "Mười bốn điểm", top: 262, left: 345, width: 80, height: 76, types: [4]}
      , {id: 20, name: "Mười lăm điểm", top: 262, left: 425, width: 76, height: 76, types: [4]}
      , {id: 21, name: "Mười sáu điểm", top: 262, left: 501, width: 76, height: 76, types: [4]}
      , {id: 22, name: "Mười bẩy điểm", top: 262, left: 577, width: 76, height: 76, types: [4]}
      , {id: 23, name: "Chẵn", top: 338, left: 0, width: 117, height: 75, types: [6, 'left', 'bottom-left', 'bottom']}
      , {id: 24, name: "Nhất", top: 338, left: 117, width: 89, height: 75, types: [5, 'bottom']}
      , {id: 25, name: "Nhị", top: 338, left: 206, width: 89, height: 75, types: [5, 'bottom']}
      , {id: 26, name: "Tam", top: 338, left: 295, width: 90, height: 75, types: [5, 'bottom']}
      , {id: 27, name: "Tứ", top: 338, left: 385, width: 90, height: 75, types: [5, 'bottom']}
      , {id: 28, name: "Ngũ", top: 338, left: 475, width: 89, height: 75, types: [5, 'bottom']}
      , {id: 29, name: "Lục", top: 338, left: 564, width: 89, height: 75, types: [5, 'bottom']}
      , {id: 30, name: "Lẻ", top: 338, left: 653, width: 117, height: 75, types: [6, 'bottom', 'right', 'bottom-right']}
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
    this.wrapper.css($.extend(initOptions.gameSize, {
      width: 770
    }));
  };

  p.drawGameInfo = function (data) {

    this.setHost(data.host);
    this.changeStatus({
      newStatus: data.status
    });
    this.roomBetting = data.betting;
    this.setBettingChipValue(data.listBettingChip);
    this.setRemainingTime(data.remainingTime);
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

    this.initGameCanvas();

    this.initVitualBetting();

    this.initListPlayer();

    this.initChipButton();

    this.initSellPopup();

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

    this.on("changeHost", function (data) {
      _self.setHost(data);
    });

    this.on("suggetstHost", function (data) {
      _self.getHostButton.show();
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
    this.bettingPositions.forEach(function (item, index) {
      _self.moveChipToUser(item.id, item.mineValue);
      item.setMineBetting(0);
    });
  };

  p.hostPaymentPhase1 = function () {
    var _self = this;
    var data = this.hostPaymentData;
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
    var _self = this;
    var bettingPosition = this.bettingPositions.find(function (item, index) {
      return item.id == data.id;
    });
    this.reBettingButton.hide();
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
    var _self = this;
    this.reBettingButton.hide();
    this.bettingPositions.forEach(function (item, index) {
      var dataItem = data.find(function (_item, _index) {
        return _item.id == item.id;
      });
      if (!dataItem)
        return;
      item.setMineBetting(dataItem.mineBetting);
      item.setTotalBetting(dataItem.totalBetting);
      _self.userReBetting(item, dataItem.mineBetting);
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
    var message, position;
    if (this.status === 'STATUS_SHAKE_DISK') {
      position = {
        x: initOptions.diskPosition.x + ((Math.random() - 0.5) < 0 ? -1 : 1) * (Math.random() * 5 + 5),
        y: initOptions.diskPosition.y + (this.diskContainer.isTop ? -1 : 1) * (Math.random() * 5 + 5)
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
    var newX = -150;
    var message, position;
    this.chipResultContainer.removeAllChildren();
    data.map.forEach(function (item, index) {
      _self.createResultDice(item, index);
    });
    this.bowl.set(initOptions.bowlPosition);
    createjs.Tween.get(this.bowl)
            .to({
              x: newX,
              alpha: 0
            }, 2000)
            .call(function () {
              _self.hostPaymentPhase1();
            });
    this.bettingPositions.forEach(function (item, index) {
      item.setStatus(data.winnerSlots);
    });
  };

  p.createResultDice = function (id, index) {
    var src = this.imagePath + "dice" + (id + 1) + ".png";
    var resultChip = new createjs.Bitmap(src);
    var scale = initOptions.diskPosition.scaleX;
    var positions = [{x: 12.5 / scale, y: 0}, {x: 0, y: 25 / scale}, {x: 25 / scale, y: 25 / scale}];
    resultChip.set(positions[index]);
    resultChip.set({
      scaleX: 1 / scale,
      scaleY: 1 / scale
    });
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
                x : newX,
                y : newY
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
    avatarContainer.css("background-image", "url(./" + this.userInfo.avatar + ")");
    usernameContainer.text(this.userInfo.username);
    this.userMoney.runEffect(this.userInfo.money);
  };

  p.initHost = function () {
    this.host = $(TWIST.HTMLTemplate['taiXiu/host']);
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

  p.setHost = function (host) {
    this.host.hostName.removeClass('active');
    this.userInfo.isHost = ((host && host.uuid) == this.userInfo.uuid);
    this.resignationButton.hide();
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
    this.wrapperTemplate.append(fragment);

    bettingPositions.forEach(function (item, index) {
      var element = _self.setBettingPositionsPrototype(item, index);
    });

    var overTable = $('<div class="over-table">');
    this.wrapperTemplate.append(overTable);
  };

  p.initVitualBetting = function () {
    var _self = this;
    var bettingPositions = this.bettingPositions;
    var fragment = document.createDocumentFragment();
    bettingPositions.forEach(function (item, index) {
      var element = _self.createVitualBetting(item, index);
      fragment.append(element);
    });
    this.wrapperTemplate.append(fragment);

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
    this.diskContainer.set(initOptions.diskPosition);

    this.disk = new createjs.Bitmap((TWIST.imagePath || imagePath) + 'taixiu/' + 'disk.png');
    this.chipResultContainer = new createjs.Container();
    this.chipResultContainer.set(initOptions.chipResultPosition);
    this.bowl = new createjs.Bitmap((TWIST.imagePath || imagePath) + 'taixiu/' + 'bowl.png');
    this.bowl.set(initOptions.bowlPosition);

    this.diskContainer.addChild(this.disk, this.chipResultContainer, this.bowl);
  };

  p.initMoveChipContainer = function () {
    this.moveChipContainer = new createjs.Container();
    var moveChipContainer = this.moveChipContainer;

    this.bettingPositions.forEach(function (item, index) {
      var bettingSlot = new createjs.Container();
      var position = {
        x: item.left + 2,
        y: item.top,
        width: item.width - 4,
        height: item.height - 25,
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
    this.addNumberEffect(bettingPosition.mineBetting,3);
    bettingPosition.totalBetting = bettingPosition.find('.total-betting');
    this.addNumberEffect(bettingPosition.totalBetting,3);
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
    vitualBetting.css(data);
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

    vitualBetting.css(data);
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

  p.setRemainingTime = function (remainingTime) {
    if (["STATUS_BETTING", "STATUS_ARRANGING"].indexOf(this.status) > -1) {
      this.desk.setRemainingTime(parseInt(remainingTime), {
        x: 287,
        y: 23,
        font: "bold 20px Roboto Condensed",
        color: "blue"
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
      item.setRatio(dataItem.ratio);
      item.setMineBetting(dataItem.mineBetting);
      _self.userReBetting(item, dataItem.mineBetting);
      item.setTotalBetting(dataItem.totalBetting);
      _self.playersBetting(item, dataItem.totalBetting - dataItem.mineBetting);
    });
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

  p.setShowVitualBettings = function (newStatus) {
    var flag = (this.userInfo.isHost && newStatus == 4) || (!this.userInfo.isHost && newStatus == 3);
    this.bettingPositions.forEach(function (item, index) {
      if (flag) {
        item.vitualBetting.show();
      } else {
        item.vitualBetting.hide();
      }
    });
  };

  p.removeSelectedBetting = function (newStatus) {
    this.bettingPositions.forEach(function (item, index) {
      item.setSelected(false);
    });
  };

  p.changeStatus = function (data) {
    this.status = this.statusList[data.newStatus];
    var func = this[this.status];
    this.buttons.hide();
    this.setShowChipButtons();
    this.setShowVitualBettings(data.newStatus);
    this.removeSelectedBetting(data.newStatus);
    this.desk.setRemainingTime(-1);
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
    this.bowl.set(initOptions.bowlPosition);
    this.chipResultContainer.removeAllChildren();
    this.host.setMessage("Chờ ván mới !");
    if (this.userInfo.isHost) {
      this.resignationButton.show();
    }
  };

  p.STATUS_SHAKE_DISK = function () {
    this.host.background.show();
    this.emit("xocDia");
    this.host.setMessage("Xóc, xóc !!!");
  };

  p.STATUS_BETTING = function (data) {
    this.setRemainingTime(data.remainingTime || 15);
    this.host.background.hide();
    this.host.setMessage("Đặt đi anh ơi");
    if (!this.userInfo.isHost) {
      this.reBettingButton.show();
      this.cancelBettingButton.show();
    }
  };

  p.STATUS_ARRANGING = function (data) {
    var defaultTime = 3;
    if (this.host.name)
      defaultTime = 15;
    this.setRemainingTime(this.host.name ? defaultTime : (data.remainingTime || defaultTime));
    this.host.setMessage("Chờ nhà cái thừa thiếu");
    if (this.userInfo.isHost) {
      this.sellEvenButton.show();
      this.sellOddButton.show();
    }
  };

  p.END_GAME = function () {
    this.sellPopup.hide();
    this.host.setMessage("Trả tiền !");
  };

  TWIST.TaiXiu = TaiXiu;

})();