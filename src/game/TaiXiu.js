this.TWIST = this.TWIST || {};

(function () {
  "use strict";

  var gameSize;

  var imagePath = location.origin + location.pathname + '../src/images/';

  var initOptions = {
    gameSize: {
      width: 1280,
      height: 720,
      position: "relative"
    },
    chipSize: {
      width: 75,
      height: 75,
      miniWidth: 24,
      miniHeight: 24,
      miniRatio: 0.33
    },
    bettingChipPositions: [{y: 640, x: 390}, {y: 640 - 11, x: 550},
      {y: 640, x: 710}, {y: 640, x: 868}],
    playerPosition: {
      x: 1215,
      y: 330
    },
    hostPosition: {
      x: 620,
      y: 60
    },
    userPosition: {
      y: 650,
      x: 210
    },
    chipSrcList: ['1st-chip.png', '2nd-chip.png', '3rd-chip.png', '4th-chip.png'],
    width: 1280,
    height: 720,
    timer: {
      x: 1165,
      y: 129,
      radius: 35
    },
    moveChipAnimationTime: 500,
    diskPosition: {
      x: 539,
      y: 155,
      width: 300,
      initWidth: 646,
      initHeight: 647,
      scale: 300 / 646
    },
    bowlPosition: {
      x: 25,
      y: 25,
      width: 534,
      height: 542
    },
    chipResultPosition: {
      x: 50,
      y: 50,
      width: 100,
      height: 100,
      diceWidth: 107,
      diceHeight: 108
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

    this.bettingPositions = [
      {id: 0, name: "Tam nhất", top: 0, left: 0, width: 195, height: 112, types: [1, 'top-left', 'top', 'left']}
      , {id: 1, name: "Tam nhị", top: 0, left: 200 - 5, width: 135, height: 112, types: [1, 'top']}
      , {id: 2, name: "Tam tam", top: 0, left: 340 - 5, width: 135, height: 112, types: [1, 'top']}
      , {id: 3, name: "Tam trùng", top: 0, left: 480 - 5, width: 275, height: 112, types: [2, 'top']}
      , {id: 4, name: "Tam tứ", top: 0, left: 760 - 5, width: 135, height: 112, types: [1, 'top']}
      , {id: 5, name: "Tam ngũ", top: 0, left: 900 - 5, width: 135, height: 112, types: [1, 'top']}
      , {id: 6, name: "Tam lục", top: 0, left: 1040 - 5, width: 193, height: 112, types: [1, 'top', 'right', 'top-right']}
      , {id: 7, name: "Xỉu", top: 115 - 3, left: 0, width: 195, height: 215, types: [3, 'left']}
      , {id: 8, name: "Bốn điểm", top: 115 - 3, left: 200 - 5, width: 115, height: 105, types: [4]}
      , {id: 9, name: "Năm điểm", top: 115 - 3, left: 320 - 5, width: 115, height: 105, types: [4]}
      , {id: 10, name: "Sáu điểm", top: 115 - 3, left: 440 - 5, width: 115, height: 105, types: [4]}
      , {id: 11, name: "Bẩy điểm", top: 115 - 3, left: 560 - 5, width: 115, height: 105, types: [4]}
      , {id: 12, name: "Tám điểm", top: 115 - 3, left: 680 - 5, width: 115, height: 105, types: [4]}
      , {id: 13, name: "Chín điểm", top: 115 - 3, left: 800 - 5, width: 115, height: 105, types: [4]}
      , {id: 14, name: "Mười điểm", top: 115 - 3, left: 920 - 5, width: 115, height: 105, types: [4]}
      , {id: 15, name: "Tài", top: 115 - 3, left: 1040 - 5, width: 193, height: 215, types: [3, 'right']}
      , {id: 16, name: "Mười một điểm", top: 225 - 3, left: 200 - 5, width: 115, height: 105, types: [4, 7]}
      , {id: 17, name: "Mười hai điểm", top: 225 - 3, left: 320 - 5, width: 115, height: 105, types: [4, 7]}
      , {id: 18, name: "Mười ba điểm", top: 225 - 3, left: 440 - 5, width: 115, height: 105, types: [4, 7]}
      , {id: 19, name: "Mười bốn điểm", top: 225 - 3, left: 560 - 5, width: 115, height: 105, types: [4, 7]}
      , {id: 20, name: "Mười lăm điểm", top: 225 - 3, left: 680 - 5, width: 115, height: 105, types: [4, 7]}
      , {id: 21, name: "Mười sáu điểm", top: 225 - 3, left: 800 - 5, width: 115, height: 105, types: [4, 7]}
      , {id: 22, name: "Mười bẩy điểm", top: 225 - 3, left: 920 - 5, width: 115, height: 105, types: [4, 7]}
      , {id: 23, name: "Chẵn", top: 335 - 3, left: 0, width: 195, height: 105, types: [6, 'left', 'bottom-left', 'bottom']}
      , {id: 24, name: "Nhất", top: 335 - 3, left: 200 - 5, width: 135, height: 105, types: [5, 'bottom']}
      , {id: 25, name: "Nhị", top: 335 - 3, left: 340 - 5, width: 135, height: 105, types: [5, 'bottom']}
      , {id: 26, name: "Tam", top: 335 - 3, left: 480 - 5, width: 135, height: 105, types: [5, 'bottom']}
      , {id: 27, name: "Tứ", top: 335 - 3, left: 620 - 5, width: 135, height: 105, types: [5, 'bottom']}
      , {id: 28, name: "Ngũ", top: 335 - 3, left: 760 - 5, width: 135, height: 105, types: [5, 'bottom']}
      , {id: 29, name: "Lục", top: 335 - 3, left: 900 - 5, width: 135, height: 105, types: [5, 'bottom']}
      , {id: 30, name: "Lẻ", top: 335 - 3, left: 1040 - 5, width: 193, height: 105, types: [6, 'bottom', 'right', 'bottom-right']}
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
    this.wrapper.css(initOptions.gameSize);
  };

  p.drawGameInfo = function (data) {

    this.setHost(data.host);
    this.changeStatus(data);
    this.roomBetting = data.betting;
    this.setBettingChipValue(data.listBettingChip);
    this.addHistoryList(data.historyList);
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

    this.initTotalTable();

    this.initGameCanvas();

    this.initVitualBetting();

    this.initListPlayer();

    this.initChipButton();

    this.initSellPopup();

    this.initHistory();

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
      _self.emit('getListPlayer');
    });

    this.on("updateListPlayer", function (data) {
      this.listPlayer.html(data.count || "1");
    });

    this.on("xocDia", function (data) {
      _self.xocDia(data);
    });

    this.on("endXocDia", function (data) {
      _self.endXocDia(data);
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
//      _self.getHostButton.show();
      _self.isSuggestHost = true;
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

    this.on("historyToggle", function (data) {
      _self.history.toggle();
    });
  };

  p.cancelBetting = function (data) {
    var _self = this;
    this.totalTable.setTotalBetting(0);
    this.cancelBettingButton.hide();
    this.bettingPositions.forEach(function (item, index) {
      _self.moveChipToUser(item.id, item.mineValue);
      item.setMineBetting(0);
    });
  };

  p.hostPaymentPhase1 = function () {
    var _self = this;
    var data = this.hostPaymentData;
    this.totalTable.setTotalWin(data && data.changeMoney);
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
    TWIST.Sound.play("chip/multichip");
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
    TWIST.Sound.play("chip/multichip");
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
    this.totalTable.totalBettingValue += this.currentBetting.value;
    this.totalTable.setTotalBetting(this.totalTable.totalBettingValue);
    var _self = this;
    var bettingPosition = this.bettingPositions.find(function (item, index) {
      return item.id == data.id;
    });
    TWIST.Sound.play("chip/singlechip");
    this.reBettingButton.hide();
    this.cancelBettingButton.show();
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
    TWIST.Sound.play("chip/multichip");
    var _self = this;
    this.reBettingButton.hide();
    this.cancelBettingButton.show();
    this.bettingPositions.forEach(function (item, index) {
      var dataItem = data.find(function (_item, _index) {
        return _item.id == item.id;
      });
      if (!dataItem)
        return;
      item.setMineBetting(dataItem.mineBetting);
      if (dataItem.mineBetting)
        _self.totalTable.totalBettingValue += parseInt(dataItem.mineBetting);
      item.setTotalBetting(dataItem.totalBetting);
      _self.userReBetting(item, dataItem.mineBetting);
    });
    this.totalTable.setTotalBetting(this.totalTable.totalBettingValue);
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
    var message, position, animationTime;
    animationTime = 80;
    if (this.status === 'STATUS_SHAKE_DISK') {
      position = {
//        x: initOptions.diskPosition.x + ((Math.random() - 0.5) < 0 ? -1 : 1) * (Math.random() * 10 + 10),
//        y: initOptions.diskPosition.shakeY + (this.diskContainer.isTop ? -1 : 1) * (Math.random() * 10 + 10),
        y: this.diskContainer.isTop ? initOptions.diskPosition.shakeY : initOptions.diskPosition.shakeY + initOptions.diskPosition.width * 0.05,
//        scaleY: this.diskContainer.isTop ? initOptions.diskPosition.scaleY : initOptions.diskPosition.scaleY * 0.8
      };
      message = 'xocDia';
    } else {
      position = {
        y: initOptions.diskPosition.shakeY,
        scaleY: initOptions.diskPosition.scaleY
      };
      message = 'endXocDia';
    }
    createjs.Tween.get(this.diskContainer)
            .to(position, animationTime)
            .call(function () {
              _self.diskContainer.isTop = !_self.diskContainer.isTop;
              _self.emit(message);
            });
  };

  p.endXocDia = function () {
    var _self = this;
    createjs.Tween.get(this.diskContainer)
            .to({
              y: initOptions.diskPosition.y
            }, 1500)
            .call(function () {
              _self.history._toggle(true);
            });
  };

  p.showResult = function (data) {

    var _self = this;
    this.playResultSounds(data);
    var newY = initOptions.bowlPosition.y - initOptions.bowlPosition.height;
    this.history.addResult(data.map.map(function (item) {
      return item + 1;
    }));
    var message, position;
    this.chipResultContainer.removeAllChildren();
    var shuffleMap = Global.shuffle(data.map)
    shuffleMap.forEach(function (item, index) {
      _self.createResultDice(item, index);
    });
    this.bowl.set({
      y: initOptions.bowlPosition.y
    });
    createjs.Tween.get(this.bowl)
            .to({
              y: newY
            }, 1000)
            .call(function () {
              _self.hostPaymentPhase1();
            });
    this.bettingPositions.forEach(function (item, index) {
      item.setStatus(data.winnerSlots);
    });
  };

  p.playResultSounds = function (data) {
    var map = data.map;
    var winnerSlots = data.winnerSlots;

    var resultNumber = 0;
    data.map.forEach(function (item, index) {
      resultNumber += (item + 1);
    });
    var firstResultSound = "";
    var seconResultSound = "";
    var thirdResultSound = "";
    var resultSounds = [];
    var initSrcs = ['news/ddungdatcuoc', 'news/mobat'];
    
    var trippTypeMap = ["news/nhat", "news/nhi", "news/tam", "news/tu", "news/ngu", "news/luc"];
    var numberTypeMap = ["news/so_4", "news/so_5", "news/so_6", "news/so_7", "news/so_8", "news/so_9", "news/so_10"
      ,["news/so_10", "news/so_1"],["news/so_10", "news/so_2"],["news/so_10", "news/so_3"],["news/so_10", "news/so_4"]
      ,["news/so_10", "news/so_5"],["news/so_10", "news/so_6"],["news/so_10", "news/so_7"]];

    var trippleType = [0, 1, 2, 4, 5, 6].findIndex(function (item, index) {
      return winnerSlots.indexOf(item) > -1;
    });

    var numberType = [8, 9, 10, 11, 12, 13, 14, 16, 17, 18, 19, 20, 21, 22].findIndex(function (item, index) {
      return winnerSlots.indexOf(item) > -1;
    });

    var isTrippleType = (trippleType > -1);
    firstResultSound = isTrippleType ? "news/dong" : 'news/tong';
    seconResultSound = isTrippleType ? trippTypeMap[trippleType] : numberTypeMap[numberType];
    console.log("numberType",numberType);
    if(!isTrippleType && numberType > - 1){
      thirdResultSound = numberType < 7 ? "news/xiu" : "news/tai";
    }
    
    var srcs = [initSrcs,firstResultSound,seconResultSound,thirdResultSound];
    var playSrc = [];
    srcs.forEach(function (item){
      if(item instanceof Array){
        playSrc = playSrc.concat(item);
      }else if(item){
        playSrc.push(item);
      }
    }); 
    TWIST.Sound.playQueue(playSrc);
  };

  p.openDisk = function (data) {
    this.history._toggle(false);
    var _self = this;
    var message, position, animationTime;
    position = {
      x: initOptions.diskPosition.x,
      y: initOptions.diskPosition.shakeY
    };
    createjs.Tween.get(this.diskContainer)
            .to(position, 1000)
            .call(function () {
              _self.showResult(data);
            });
  };

  p.closeDisk = function (data) {
    this.history._toggle(false);
    createjs.Tween.get(this.bowl)
            .to(initOptions.bowlPosition, 1000)
            .call(function () {});
  };

  p.createResultDice = function (id, index) {
    var src = this.imagePath + "dice" + (id + 1) + "-big.png";
    var resultChip = new createjs.Bitmap(src);
    var unitWidth = this.chipResultContainer.width / 2;
    var unitHeight = this.chipResultContainer.height / 2;
    var scale = initOptions.diskPosition.scaleX;
    var resultChipPosition = {
      x: (Math.random() * (unitWidth - initOptions.chipResultPosition.diceWidth)) + (parseInt(index / 2) * unitWidth),
      y: (Math.random() * (unitHeight - initOptions.chipResultPosition.diceHeight) + (parseInt(index % 2) * unitHeight))
    };
    resultChip.set(resultChipPosition);
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
                x: newX,
                y: newY
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
    avatarContainer.css("background-image", "url(" + (this.userInfo.avatar ? ("./" + this.userInfo.avatar) : initOptions.avatar) + ")");
    usernameContainer.text(this.userInfo.username);
    this.userMoney.runEffect(this.userInfo.money);
  };

  p.initHistory = function () {
    var _self = this;
    this.history = $(TWIST.HTMLTemplate['taiXiu/history']);
    this.wrapperTemplate.append(this.history);
    this.historyInner = this.history.find('.history');
    this.historyList = [];
    this.history._toggle = function (active) {
      if (typeof active !== "undefined") {
        if (active) {
          _self.historyInner.addClass('active');
        } else {
          _self.historyInner.removeClass('active');
        }
      } else {
        _self.historyInner.toggleClass('active');
      }
    };
    this.historyInner.on('click', function () {
      _self.history._toggle();
    });
    this.history.addResult = function (map) {
      var data = map;
      var resultTemplate = $(TWIST.HTMLTemplate['taiXiu/history-item']);
      var itemType = resultTemplate.find('.history-item-type');
      var resultNumber = 0;
      map.forEach(function (item, index) {
        resultNumber += (item);
        var dicePosition = resultTemplate.find('#dice-position' + index);
        dicePosition.addClass("dice" + (item - 1));
      });

      var isTai = (resultNumber < 18 && resultNumber > 10);
      var isXiu = (resultNumber < 11 && resultNumber > 3);
      var itemType = resultTemplate.find('.history-item-type');
      isTai && itemType.addClass('tai');
      isXiu && itemType.addClass('xiu');
      var itemNumber = resultTemplate.find('.history-item-number');
      itemNumber.html(resultNumber);
      _self.historyInner.append(resultTemplate);
      _self.historyList.push(resultTemplate);

      if (_self.historyList.length > 15) {
        _self.historyList[0].remove();
        _self.historyList.shift();
      }

    };
  };

  p.addHistoryList = function (historyList) {
    var _self = this;
    historyList.forEach(function (item, index) {
      _self.history.addResult(item);
    });
  };

  p.initHost = function () {
    var _self = this;
    this.host = $(TWIST.HTMLTemplate['taiXiu/host']);
    this.wrapperTemplate.append(this.host);
    this.host.background = this.host.find('.host-background');
    this.host.hostName = this.host.find('.host-name');
    this.host.chatBox = this.host.find('.chat-box');
    this.host.hostMessage = this.host.find('.chat-box-inner');
    this.host.setMessage = function (message) {
      if (message) {
        this.show();
        this.hostMessage.html(message);
      } else {
        this.hide();
      }
    };
  };

  p.initTotalTable = function () {
    var _self = this;
    this.totalTable = $(TWIST.HTMLTemplate['taiXiu/totalTable']);
    this.wrapperTemplate.append(this.totalTable);

    this.totalTable.totalBetting = this.totalTable.find('.total-table-betting');
    this.totalTable.totalWin = this.totalTable.find('.total-table-win');

    this.addNumberEffect(this.totalTable.totalBetting);
    this.addNumberEffect(this.totalTable.totalWin);

    this.totalTable.setTotalBetting = function (value) {
      this.totalBettingValue = value;
      _self.totalBettingValue = value;
      this.totalBetting.runEffect(value);
    };
    this.totalTable.setTotalWin = function (value) {
      this.totalWinValue = value;
      this.totalWin.runEffect(value);
    };
  };

  p.setHost = function (host) {
    this.host.hostName.removeClass('active');
    this.userInfo.isHost = ((host && host.uuid) == this.userInfo.uuid);
    this.resignationButton.hide();
    if (this.userInfo.isHost) {
      this.showError({
        message: "Bạn đã làm nhà cái !"
      });
    }
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
      _self.activeListPlayer = true;
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
    this.table.append(fragment);

    bettingPositions.forEach(function (item, index) {
      var element = _self.setBettingPositionsPrototype(item, index);
    });

    var overTable = $('<div class="over-table">');
    this.wrapperTemplate.append(overTable);
  };

  p.initVitualBetting = function () {
    var _self = this;
    var bettingPositions = this.bettingPositions;

    var vitualBettingWrapper = $('<div class="vitual-table">');
    this.wrapperTemplate.append(vitualBettingWrapper);

    var fragment = document.createDocumentFragment();
    bettingPositions.forEach(function (item, index) {
      var element = _self.createVitualBetting(item, index);
      fragment.append(element);
    });
    vitualBettingWrapper.append(fragment);

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

    var config = initOptions.timer;
    this.desk.createTimer({
      x: config.x - config.radius,
      y: config.y - config.radius,
      radius: config.radius,
      strokeThick: 5,
      __type: 1
    });

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
      _self.sellPopup.hide();
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
    var diskPosition = initOptions.diskPosition;
    var chipResultPosition = initOptions.chipResultPosition;
    var bowlPosition = initOptions.bowlPosition;

    diskPosition.x = (initOptions.gameSize.width - diskPosition.width) / 2;
    diskPosition.y = -diskPosition.width * 3 / 5;
    diskPosition.shakeY = 0;
    diskPosition.scaleX = diskPosition.scaleY = diskPosition.scale;

    this.diskContainer.set(diskPosition);
    this.disk = new createjs.Bitmap((TWIST.imagePath || imagePath) + 'taixiu/' + 'disk.png');

    this.chipResultContainer = new createjs.Container();
    chipResultPosition.height = chipResultPosition.width = bowlPosition.width / Math.sqrt(2);
    chipResultPosition.x = chipResultPosition.y = (diskPosition.initWidth - chipResultPosition.width) / 2;
    this.chipResultContainer.set(initOptions.chipResultPosition);

    this.bowl = new createjs.Bitmap((TWIST.imagePath || imagePath) + 'taixiu/' + 'bowl.png');
    bowlPosition.x = (diskPosition.initWidth - bowlPosition.width) / 2;
    bowlPosition.y = (diskPosition.initHeight - bowlPosition.height) / 2;
    this.bowl.set(initOptions.bowlPosition);

    this.diskContainer.addChild(this.disk, this.chipResultContainer, this.bowl);
  };

  p.initMoveChipContainer = function () {
    this.moveChipContainer = new createjs.Container();
    var moveChipContainer = this.moveChipContainer;

    this.bettingPositions.forEach(function (item, index) {
      var bettingSlot = new createjs.Container();
      var position = {
        x: item.left + 5 + 22.5 + 5,
        y: item.top + 5 + 173 + 5,
        width: item.width,
        height: item.height - 35,
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
    this.addNumberEffect(bettingPosition.mineBetting, 3);
    bettingPosition.totalBetting = bettingPosition.find('.total-betting');
    this.addNumberEffect(bettingPosition.totalBetting, 3);
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
    vitualBetting.css({
      top: data.top + 3,
      left: data.left + 3,
      width: data.width + 3,
      height: data.height + 3
    });
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

  p.setRemainingTime = function (remainingTime, totalTime) {
    if (["STATUS_BETTING"].indexOf(this.status) > -1) {
      var config = this.options.timer;
      this.desk.setRemainingTime(parseInt(remainingTime), {
        x: config.x,
        y: config.y - config.radius / 2 - 2,
        font: "bold 36px Roboto Condensed",
        color: "#ffde00"
      });
      this.desk.setCicleTime(parseInt(remainingTime), parseInt(totalTime));
    } else {
      this.desk.setRemainingTime(-1);
      this.desk.clearTimer();
    }
  };

  p.drawBettingPositions = function (data) {
    var _self = this;
    var userBetting = 0;
    this.bettingPositions.forEach(function (item, index) {
      var dataItem = data.find(function (_item, _index) {
        return _item.id == item.id;
      });
      if (!dataItem)
        return;
      item.setRatio(dataItem.ratio);
      item.setMineBetting(dataItem.mineBetting);
      _self.userReBetting(item, dataItem.mineBetting);
      userBetting += parseInt(dataItem.mineBetting);
      item.setTotalBetting(dataItem.totalBetting);
      _self.playersBetting(item, dataItem.totalBetting - dataItem.mineBetting);
    });
    this.totalTable.setTotalBetting(userBetting);
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

  p.setShowVitualBettings = function (status) {
    var flag = (this.userInfo.isHost && status == 4) || (!this.userInfo.isHost && status == 3);
    this.bettingPositions.forEach(function (item, index) {
      if (flag) {
        item.vitualBetting.show();
      } else {
        item.vitualBetting.hide();
      }
    });
  };

  p.removeSelectedBetting = function (status) {
    this.bettingPositions.forEach(function (item, index) {
      item.setSelected(false);
    });
  };

  p.changeStatus = function (data) {
    if (this.status == this.statusList[data.status])
      return;
    this.status = this.statusList[data.status];
    var func = this[this.status];
    this.buttons.hide();
    this.setShowChipButtons();
    this.setShowVitualBettings(data.status);
    this.removeSelectedBetting(data.status);
    this.setRemainingTime(data.remainingTime, data.totalTime);
    TWIST.Sound.stop();
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
    this.totalTable.setTotalBetting(0);
    this.totalTable.setTotalWin(0);
    this.closeDisk();
    this.host.setMessage("");
  };

  p.STATUS_SHAKE_DISK = function () {
    this.host.background.show();
    this.emit("xocDia");
    this.host.setMessage("Nhà cái xóc đĩa !");
  };
  p.STATUS_BETTING = function (data) {
    var srcs = ['news/anhoidatcuoc', 'news/batdaudatcuoc'
              , 'news/moidatcuoc', 'news/datcuocdianh'];
    var src = srcs[Math.floor(Math.random() * srcs.length)];
    TWIST.Sound.play(src);
    this.host.background.hide();
    this.host.setMessage("");
    if (data.showReBetting) {
      this.reBettingButton.show();
    }
    if (data.showCancelBetting) {
      this.cancelBettingButton.show();
    }
  };

  p.STATUS_ARRANGING = function (data) {
    var defaultTime = 3;
    this.host.setMessage("");
    if (this.userInfo.isHost) {
      this.sellEvenButton.show();
      this.sellOddButton.show();
    }
  };

  p.END_GAME = function () {
    this.sellPopup.hide();
    this.host.setMessage("Mở bát !");
    this.totalBettingValue = 0;
  };

  TWIST.TaiXiu = TaiXiu;
})();