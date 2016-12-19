this.TWIST = this.TWIST || {};

(function () {
  "use strict";

  var gameSize;

  var imagePath = location.origin + location.pathname + '../src/images/';

  var initOptions = {
    avatar: "https://s.gravatar.com/avatar/a4fae1e89a441c83f656a7ae59f9c19f?s=80",
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
    timerRadius: 60,
    moveChipAnimationTime: 500,
    diskPosition: {
      x: 539,
      y: 155,
      width: 400,
      initWidth: 646,
      initHeight: 647,
      scale: 400 / 646
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
      chipWidth: 96,
      chipHeight: 96
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
      uuid: "",
      username: "",
      money: 0,
      isHost: false
    });
    this.bettingPositions = [{
        name: "Bốn Trắng",
        displayName: "1:10",
        valueMap: [0, 0, 0, 0],
        resultMap: [0],
        ratio: 10,
        id: 2,
        top: 440,
        left: 40,
        width: 220,
        height: 148
      }, {
        name: "Bốn Đỏ",
        displayName: "1:10",
        valueMap: [1, 1, 1, 1],
        resultMap: [4],
        ratio: 10,
        id: 3,
        top: 440,
        left: 285,
        width: 220,
        height: 148
      }, {
        name: "Ba Trắng",
        displayName: "1:3",
        valueMap: [0, 0, 0, 1],
        resultMap: [1],
        ratio: 3,
        id: 4,
        top: 440,
        left: 775,
        width: 220,
        height: 148
      }, {
        name: "Ba đỏ",
        displayName: "1:3",
        valueMap: [0, 1, 1, 1],
        resultMap: [3],
        ratio: 3,
        id: 5,
        top: 440,
        left: 1020,
        width: 220,
        height: 148
      }
      , {
        name: "Hai đỏ",
        displayName: "1:1.5",
        valueMap: [0, 0, 1, 1],
        resultMap: [2],
        ratio: 1.5,
        id: 6,
        top: 440,
        left: 530,
        width: 220,
        height: 148
      }
      , {
        name: "Chẵn",
        displayName: "Chẵn",
        valueMap: [0],
        resultMap: [0, 2, 4],
        ratio: 1,
        id: 0,
        top: 230,
        left: 100,
        width: 320,
        height: 186
      }, {
        name: "Lẻ",
        displayName: "Lẻ",
        valueMap: [1],
        resultMap: [1, 3],
        ratio: 1,
        id: 1,
        top: 230,
        left: 860,
        width: 320,
        height: 186
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
    this.wrapperTemplate = $(TWIST.HTMLTemplate['xocDia/wrapper']);
    this.wrapper.append(this.wrapperTemplate);

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
  };

  p.cancelBetting = function (data) {
    var _self = this;
    this.totalTable.setTotalBetting(0);
    this.cancelBettingButton.hide();
    this.bettingPositions.forEach(function (item, index) {
      _self.moveChipToUser(item.id, item.mineValue);
//      item.setTotalBetting(item.totalValue - item.mineValue);
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
    var jElement = $(TWIST.HTMLTemplate['xocDia/changeMoney']);
    this.user.append(jElement);
    jElement.text(Global.numberWithDot(parseInt(data.changeMoney)));
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
    animationTime = this.diskContainer.y < -200 ? 1000 : 100;
    if (this.status === 'STATUS_SHAKE_DISK') {
      position = {
        x: initOptions.diskPosition.x + ((Math.random() - 0.5) < 0 ? -1 : 1) * (Math.random() * 10 + 10),
        y: initOptions.diskPosition.shakeY + (this.diskContainer.isTop ? -1 : 1) * (Math.random() * 10 + 10)
      };
      message = 'xocDia';
    } else {
      animationTime = 1000;
      position = initOptions.diskPosition;
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
    this.history._toggle(true);
  };

  p.showResult = function (data) {
    var _self = this;
    this.playResultSounds(data);
    var newY = initOptions.bowlPosition.y - initOptions.bowlPosition.height;
    this.history.addResult(data.winnerSlots);
    var message, position;
    this.chipResultContainer.removeAllChildren();
    var shuffleMap = Global.shuffle(data.map)
    shuffleMap.forEach(function (item, index) {
      _self.createResultChip(item, index);
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

    var firstSoundMap = ["news/xap4", "news/xap1", "news/xap3", "news/xap2", "news/ngua"];

    var sapType = [3, 4, 5, 6].findIndex(function (item, index) {
      return winnerSlots.indexOf(item) > -1;
    });
    var isOdd = (winnerSlots.indexOf(1) > -1);

    var isSapType = (sapType > -1);
    firstResultSound = isSapType ? firstSoundMap[sapType] : firstSoundMap['4'];
    seconResultSound = isOdd ? "news/le" : "news/chan";

    var srcs = [ firstResultSound, seconResultSound];
    TWIST.Sound.playQueue(srcs);
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

  p.createResultChip = function (isRed, index) {
    var src = (TWIST.imagePath || imagePath) + 'xocdia/' + (isRed ? "red-big.png" : "white-big.png");
    var resultChip = new createjs.Bitmap(src);
    var unitWidth = this.chipResultContainer.width / 2;
    var unitHeight = this.chipResultContainer.height / 2;
    var resultChipPosition = {
      x: (Math.random() * (unitWidth - initOptions.chipResultPosition.chipWidth)) + (parseInt(index / 2) * unitWidth),
      y: (Math.random() * (unitHeight - initOptions.chipResultPosition.chipHeight) + (parseInt(index % 2) * unitHeight))
    };
    resultChip.set(resultChipPosition);
    this.chipResultContainer.addChild(resultChip);
    return resultChip;
  };

  p.createChip = function (id) {
    var _self = this;
    var scale = initOptions.chipSize.miniRatio;
    var src = (TWIST.imagePath || imagePath) + 'xocdia/' + initOptions.chipSrcList[id];
    var chip = new createjs.Bitmap(src);
    var value = this.chipButtons.find(function (item, index) {
      return item.id == id;
    }).value;
    chip.set({
      scaleX: scale,
      scaleY: scale,
      type: id,
      value: value
    });
    chip.move = function (fromPosition, toPosition, callback) {
      chip.set(fromPosition);
      var newX = toPosition.x + (Math.random() - 0.5) * 3;
      var newY = toPosition.y + (Math.random() - 0.5) * 3;
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
    this.history = $(TWIST.HTMLTemplate['xocDia/history']);
    this.historyInner = this.history.find('.history');
    this.wrapperTemplate.append(this.history);
    this.historyList = [];
    var mapName = {
      2: 4,
      3: 0,
      4: 1,
      5: 3,
      6: 2
    };
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
    this.history.addResult = function (winnerSlots) {

      var isOdd = winnerSlots.find(function (item, index) {
        return item < 2;
      });

      var slotId = winnerSlots.find(function (item, index) {
        return item > 1;
      });

      var isNewColumn = false;

      var resultChipColumn = _self.historyList[_self.historyList.length - 1];

      isNewColumn = _self.historyList[_self.historyList.length - 1] ? false : true;

      if (resultChipColumn && resultChipColumn.children().length > 3) {
        isNewColumn = true;
      }
      if (_self.history.lastResult && (_self.history.lastResult.isOdd !== isOdd)) {
        isNewColumn = true;
      }

      if (isNewColumn) {
        resultChipColumn = $(TWIST.HTMLTemplate['xocDia/resultChipColumn']);
        _self.historyList.push(resultChipColumn);
        _self.historyInner.append(resultChipColumn);
      }

      var resultChip = $(TWIST.HTMLTemplate['xocDia/resultChip']);

      if (isOdd) {
        resultChip.addClass('result-chip-odd');
      }
      resultChip.isOdd = isOdd;
      resultChip.find('.inner-chip').html(mapName[slotId]);
      _self.history.lastResult = resultChip;
      resultChipColumn.append(resultChip);

      if (_self.historyList.length > 15) {
        _self.historyList[0].remove();
        _self.historyList.shift();
      }
    };
  };



  p.addHistoryList = function (historyList) {
    var _self = this;
    var historyListConver = [];
    var bettingPositions = this.bettingPositions;
    historyListConver = historyList.map(function (item, index) {
      var winnerSlot = [];
      bettingPositions.forEach(function (betting, _index) {
        if (betting.resultMap.indexOf(item) > -1) {
          winnerSlot.push(betting.id);
        }
      });
      return winnerSlot;
    });
    historyListConver.forEach(function (item, index) {
      _self.history.addResult(item);
    });
  };

  p.initHost = function () {
    var _self = this;
    this.host = $(TWIST.HTMLTemplate['xocDia/host']);
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
    this.totalTable = $(TWIST.HTMLTemplate['xocDia/totalTable']);
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
      this.lastBettings = undefined;
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
    this.listPlayer = $(TWIST.HTMLTemplate['xocDia/listPlayer']);
    this.wrapperTemplate.append(this.listPlayer);
    this.listPlayer.on('click', function () {
      _self.activeListPlayer = true;
      _self.emit('getListPlayer');
    });
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

    this.desk.createTimer({
      x: this.options.width / 2 - this.options.timerRadius,
      y: this.options.height / 2 - this.options.timerRadius - 20,
      radius: this.options.timerRadius,
      strokeThick: 10,
      __type: 1
    });

    this.stage.addChild(this.diskContainer, this.moveChipContainer, this.desk);
  };

  p.initChipButton = function () {
    var _self = this;
    this.chipWrapper = $(TWIST.HTMLTemplate['xocDia/chips']);
    this.wrapperTemplate.append(this.chipWrapper);

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
    this.sellPopup = $(TWIST.HTMLTemplate['xocDia/sellPopup']);
    var bettingData;
    this.sellPopup.initPopup = function (data) {
      bettingData = data;
      var maxValue = data.totalValue;
      _self.sellPopup.maxValue = maxValue;
      _self.sellPopup.plusButton.html(maxValue);
      _self.sellPopup.title.html(data.name);
      setMin();
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

  p.showSellPopup = function (id) {

    var _self = this;
    var selectedBetting = this.bettingPositions.find(function (item, index) {
      return item.id == id;
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

    var buttonWrapper = $(TWIST.HTMLTemplate['xocDia/buttons']);

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
      _self.showSellPopup(1);
    });

    this.resignationButton = buttonWrapper.find('#resignation');
    this.buttons.push(this.resignationButton);
    this.resignationButton.on('click', function () {
      _self.emit("resignation");
    });

    this.sellEvenButton = buttonWrapper.find('#sellEven');
    this.buttons.push(this.sellEvenButton);
    this.sellEvenButton.on('click', function () {
      _self.showSellPopup(0);
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

    this.disk = new createjs.Bitmap((TWIST.imagePath || imagePath) + 'xocdia/' + 'disk.png');

    this.chipResultContainer = new createjs.Container();
    chipResultPosition.height = chipResultPosition.width = bowlPosition.width / Math.sqrt(2);
    chipResultPosition.x = chipResultPosition.y = (diskPosition.initWidth - chipResultPosition.width) / 2;

    this.chipResultContainer.set(initOptions.chipResultPosition);

    this.bowl = new createjs.Bitmap((TWIST.imagePath || imagePath) + 'xocdia/' + 'bowl.png');
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
        x: item.left + 30,
        y: item.top + 35,
        width: item.width - 80,
        height: item.height - 90,
        name: item.id
      };

      item.bettingSlot = bettingSlot;
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
    vitualBetting.css({
      top: data.top,
      left: data.left,
      width: data.width,
      height: data.height
    });

    this.wrapperTemplate.append(vitualBetting);
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

  p.createBettingPosition = function (data) {
    var _self = this;
    var temp = TWIST.HTMLTemplate['xocDia/bettingPosition'];
    var bettingPosition = $(temp);
    if (data.id > 1) {
      bettingPosition.addClass('small-betting-position');
    }
    bettingPosition.css(data);
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
    data.setSelected = function (flag) {
      data.isSelected = flag;
      data.template.removeClass('selected');
      if (flag) {
        data.template.addClass('selected');
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
      this.desk.setRemainingTime(parseInt(remainingTime), {
        x: this.options.width / 2,
        y: this.options.height / 2 - this.options.timerRadius,
        font: "bold 60px Roboto Condensed",
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
//    this.chipResultContainer.removeAllChildren();
    this.bettingPositions.forEach(function (item, index) {
      item.template.removeClass('active disabled');
      item.bettingSlot.removeAllChildren();
      item.setMineBetting(0);
      item.setTotalBetting(0);
    });
    this.totalTable.setTotalBetting(0);
    this.totalTable.setTotalWin(0);

    this.closeDisk();
//    this.host.setMessage("Chuẩn bị ván mới !");
    this.host.setMessage("");
    if (this.userInfo.isHost) {
//      this.resignationButton.show();
    } else if (this.isSuggestHost) {
//      this.getHostButton.show();
    }
  };

  p.STATUS_SHAKE_DISK = function () {
    this.isSuggestHost = false;
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
    if (this.host.name)
      defaultTime = 15;
//    this.setRemainingTime(data.remainingTime || defaultTime);
//    this.host.setMessage("Thời gian cái thừa thiếu !");
//    this.host.setMessage("Hết thời gian đặt cược !");
    if (this.userInfo.isHost) {
      this.sellEvenButton.show();
      this.sellOddButton.show();
    } else {
      this.lastBettings = this.bettingPositions.map(function (item) {
        return {
          id: item.id,
          value: item.mineValue
        };
      });
    }
  };

  p.END_GAME = function () {
    this.sellPopup.hide();
    this.host.setMessage("Mở bát !");
    this.totalBettingValue = 0;
  };

  TWIST.XocDia = XocDia;

})();