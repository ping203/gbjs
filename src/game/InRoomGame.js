
this.TWIST = this.TWIST || {};

(function () {
  "use strict";

  function InRoomGame() {}

  InRoomGame.statusList = {
    '0': 'STATUS_WAITING_FOR_PLAYER',
    '1': 'STATUS_WAITING_FOR_START',
    '2': 'STATUS_PLAYING',
    '3': 'STATUS_ENDING',
    '4': 'STATUS_WAITING_FOR_READY',
    '6': 'STATUS_WAITING_FOR_DEALING',
    '7': 'STATUS_DEALING',
    '8': 'STATUS_SHAKE_DISK',
    '9': 'STATUS_BETTING',
    '10': 'STATUS_END_BETTING',
    '11': 'STATUS_OPEN_DISK',
    '12': 'STATUS_CLOSE_DISK',
    '13': 'STATUS_ARRANGING',
    '14': 'STATUS_NOTIFY_SAM',
    '15': 'STATUS_DEAL_MASTER'
  };


  var p = InRoomGame.prototype = new TWIST.BaseGame();

  p.statusList = $.extend({}, InRoomGame.statusList);

  p.initInRoomGame = function () {
    this.initBaseGame({
      _transformAble: true
    });
    this.drawRoom();
    this.pushInRoomGameEvent();
    this.initInviteList();
    this.initErrotPanel();
    this.initButtonBar();
    this.initResultPanel();
    this.observerEvent();
    this.userInfo = this.userInfo || {};
    this.status = this.statusList['0'];
    this.model = this.model || {};
  };

  p.initInviteList = function () {
    var _self = this;

    this.inviteListTemplate = $(TWIST.HTMLTemplate['inviteList/wrapper']);
    this.wrapper.append(this.inviteListTemplate);

    var playerPositions = this.desk.config.playerPositions;

    this.inviteList = [];

    playerPositions.forEach(function (item, index) {
      drawInvitePosition(item, index);
    });

    function drawInvitePosition(positionData, index) {
      var invitePosition = $(TWIST.HTMLTemplate['inviteList/inviteItem']);
      _self.inviteList.push(invitePosition);
      _self.inviteListTemplate.append(invitePosition);
      invitePosition.css({
        top: positionData.y,
        left: positionData.x + 11
      });
      if (!index)
        invitePosition.hide();
      invitePosition.on('click', function () {
        _self.emit('invitePlayer');
      });
    }
  };

  p.initErrotPanel = function () {
    this.errorPanel = $(TWIST.HTMLTemplate.errorPanel);
    this.wrapper.append(this.errorPanel);
    this.errorList = this.errorList || {};
    $.extend(this.errorList, {
      0: "Lỗi hệ thống !",
      //sam Error
      34: "Không được để 2 cuối !",
      1470: "Chưa chọn cây bài !",
      //xocdia Error,
      91: "Cược vượt quá cho phép",
      92: "Cửa đặt không xác định",
      93: "Không đủ tiền để làm nhà cái",
      94: "User không phải nhà cái",
      95: "Nhà cái đã tồn tại",
      96: "Chưa sẵn sàng để đặt cược",
      97: "Bán chẵn/lẻ không thành công",
      98: "Bạn đã bán chẵn/lẻ rồi",
      99: "Số tiền bán chẵn/lẻ không hợp lệ",
      100: "Hủy cược không thành công",
      101: "Nhà cái không thể đặt cược",
      102: "Hủy cái không thành công."
    });
  };

  p.initButtonBar = function () {
    this.buttonBar = $(TWIST.HTMLTemplate['buttonBar/wrapper']);
    this.wrapper.append(this.buttonBar);
    this.startButton = $(TWIST.HTMLTemplate['buttonBar/startButton']);
    this.buttonBar.append(this.startButton);
    this.buttonBar.hide();
  };

  p.drawRoom = function () {
    var canvas = this.wrapper.find('canvas');
    this.wrapper.css("background", "url(" + TWIST.imagePath + "Desk-bg.png) center no-repeat");
    this.playersContainer = new createjs.Container();
    this.desk = new TWIST.Desk(this.options);
    this.desk.name = "desk";
    this.stage.addChild(this.desk, this.playersContainer);
    this.wrapper.css({
      width: canvas.width(),
      height: canvas.height(),
      position: "relative"
    });
  };

  p.pushInRoomGameEvent = function () {
    this.on("userInfo", this.setUserInfo);

    this.on("gameInfo", this.drawGameInfo);

    this.on("userJoin", this.addPlayer);

    this.on("userQuit", this.removePlayer);

    this.on("error", this.showError);

    this.on("changeMaster", this.changeRoomMaster);

    this.on("isolateUpdateMoney", this.isolateUpdateMoney);

    this.on("userChat", this.userChat);

    this.on("changeStatus", this.changeStatus);

    this.on("updateInfo", this.updateInfo);

//        gameplayer Event

    this.on("dealCards", this.dealCards);

    this.on("endGame", this.endGame);

    this.on("draftCards", this.onDraftCards);

    this.on("hitTurn", this.onHitTurn);

    this.on("reconnect", this.reconnect);

    this.on("updateUuid", this.updateUuid);

    this.on("showPlayersCards", this.showPlayersCards);

    this.on("reSortDraftCards", this.reSortDraftCards);
  };

  p.setUserInfo = function (data) {
    this.userInfo = $.extend(this.userInfo, data);
    this.userInfo.uuid = this.userInfo.uuid || this.userInfo.id;
  };

  p.observerEvent = function () {
    var _self = this;
    TWIST.Observer.on("cardSelected", function (card) {
      _self.handCardSelected(card);
    });
  };

  p.drawGameInfo = function (data) {
    this.model = this.model || {};
    $.extend(this.model, data);
    var playerList = this.model.players;
    for (var i = 0, length = playerList.length; i < length; i++) {
      if (playerList[i].username === this.userInfo.username) {
        this.userInfo.uuid = playerList[i].uuid;
      }
    }

    this.drawPlayers();

    if (data.status) {
      this.changeStatus({
        newStatus: data.status
      });
      if (this.status === 'STATUS_PLAYING') {
        this.drawPlayingState(data);
      }
    }
  };

  p.removePlayer = function (data) {
    var player = this.getPlayerByUuid(data.uuid);
    if (player) {
      var playerPosition = player.position;
      this.inviteList[playerPosition] && this.inviteList[playerPosition].show();
      this.playersContainer.removeChild(player);
    }
    var playerData = this.removePlayerData(data.uuid);
  };

  p.addCheater = function () {
    var _self = this;

    this.cheaterButton = $('<div class="button zero yellow">Cheater</div>');
    this.wrapper.append(this.cheaterButton);
    this.cheaterButton.unbind('click');
    this.cheaterButton.click(function () {
      console.log("click cheaterButton133");
      _self.renderCheater();
      $('.cheater').toggle();
    });

    this.cheater = $(TWIST.HTMLTemplate['cheater/wrapper']);
    this.cheater.find('.cheat-backgound').click(function () {
      $('.cheater').toggle();
    });
    this.cardButtonList = this.cheater.find('.card-button-list');
    this.randomCardList = this.cheater.find('.random-card-list');
    this.randomCardList.cardList = [];
    this.fixCardList = this.cheater.find('.fix-card-list');
    this.fixCardList.cardList = [];
    this.totalCheatCardList = this.cheater.find('.total-cheat-card-list');
    this.totalCheatCardList.cardList = [];
    this.listPlayerCards = $('<div class="list-player-cards"></div>');
    this.listPlayerCards.listPlayer = [];
    this.cheater.append(this.listPlayerCards);
    this.wrapper.append(this.cheater);

    this.addCheatCardButtons();
  };

  p.addCheatCardButtons = function () {
    var _self = this;
    for (var i = 0; i < 52; i++) {
      var elementStr = '<div class="card-cheat-button card card' + i + '"></div>';
      var element = $(elementStr);
      (function (element, i) {
        element.click(function () {
          _self.addCheatCard(i);
        });
      })(element, i);
      this.cardButtonList.append(element);
    }
  };

  p.addCheatCard = function (index) {
    var _self = this;
    var targetElement = $('input[name=selectedPlayer]:checked');
    if(targetElement.length != 1) return;
    
    var uuid = targetElement.val();
    
    var cheatPlayer = this.listPlayerCards.listPlayer.find(function (item, index) {
      return item.uuid ==  uuid;
    });
    
    if (cheatPlayer && cheatPlayer.cardContainer) {
      this.renderHtmlCardInElement(index, cheatPlayer.cardContainer);
      this.createTotalCheatCardList();
    }
//    if (this.fixCardList.cardList.indexOf(index) === -1) {
//      this.renderHtmlCardInElement(index, this.fixCardList);
//      this.createTotalCheatCardList();
//    }
  };

  p.renderHtmlCardInElement = function (index, container) {
    var _self = this;
    if (container.cardList.length >= this.options.numberCardsInHand)
      return;
    container.cardList.push(index);
    var card = $('<div class="card-cheat-button card card' + index + '"></div>');
    card.click(function () {
      var arrayIndex = container.cardList.indexOf(index);
      if (arrayIndex > -1) {
        container.cardList.splice(arrayIndex, 1);
      }
      $(this).remove();
      _self.createTotalCheatCardList();
    });
    container.append(card);
  };

  p.createTotalCheatCardList = function () {
    var _self = this;
    _self.totalCheatCardList.cardList = [];
    var totalList = [];
    this.fixCardList.cardList.forEach(function (item, index) {
      if (totalList.indexOf(item) === -1) {
        totalList.push(item);
      }
    });
    this.randomCardList.cardList.forEach(function (item, index) {
      if (totalList.indexOf(item) === -1) {
        totalList.push(item);
      }
    });
    totalList.sort(function (a, b) {
      return a - b;
    });
    this.clearCardListContainer(_self.totalCheatCardList);
    totalList.forEach(function (item, index) {
      _self.renderHtmlCardInElement(item, _self.totalCheatCardList);
    });
  };

  p.clearCardListContainer = function (element) {
    element.cardList = [];
    element.empty();
  };

  p.renderCheater = function (element) {
    var _self = this;

    var listPlayer = this.playersContainer.children.map(function (item, index) {
      return {
        uuid: item.uuid,
        username: item.username,
        isRoomMaster: item.isRoomMaster,
        indexPosition: item.indexPosition
      };
    });

    listPlayer.sort(function (a, b) {
      return a.indexPosition - b.indexPosition;
    });

    this.listPlayerCards.listPlayer = this.listPlayerCards.listPlayer || [];

    this.listPlayerCards.listPlayer.forEach(function (item, index) {
      var exitsPlayer = listPlayer.find(function (_item) {
        return _item.uuid == item.uuid;
      });
      if (!exitsPlayer) {
        item.remove();
      }
    });

    listPlayer.forEach(function (item, index) {
      var exitsPlayer = _self.listPlayerCards.listPlayer.find(function (_item) {
        return _item.uuid == item.uuid;
      });
      if (!exitsPlayer) {

        var playerCards = $('<div id="' + item.uuid + '"><label><input value="'+item.uuid+'" type="radio" name="selectedPlayer"/>'+ item.uuid +'</label></div>');
        playerCards.cardContainer = $('<div></div>');
        Object.assign(playerCards,item);
        playerCards.cardContainer.cardList = [];

        playerCards.append(playerCards.cardContainer);

        _self.listPlayerCards.listPlayer.push(playerCards);
        _self.listPlayerCards.append(playerCards);
      }
    });
  };

  p.getListCheatCard = function (element) {
    var _self = this;
    this.createTotalCheatCardList();
    var listCardToSet = [];
    if ($('#whiteVictory').prop('checked')) {
      listCardToSet = this.createWhiteVictoryList();
    } else if ($('#hasGun').prop('checked')) {
      listCardToSet = this.createGunList();
    } else if ($('#hightCards').prop('checked')) {
      listCardToSet = this.createHightCardsList();
    } else {
      listCardToSet = [];
    }
    if ($('#hasFixedCards').prop('checked')) {
      _self.totalCheatCardList.cardList.forEach(function (item, index) {
        if ((listCardToSet.indexOf(item) === -1) && listCardToSet.length < _self.options.numberCardsInHand) {
          listCardToSet.push(item);
        }
      });
    }

//    listCardToSet = [];

    var listPlayer = this.playersContainer.children.map(function (item, index) {
      return {
        uuid: item.uuid,
        username: item.username,
        isRoomMaster: item.isRoomMaster,
        indexPosition: item.indexPosition
      };
    });
    listPlayer.sort(function (a, b) {
      return a.indexPosition - b.indexPosition
    });

    var listFullCard = [];
    for (var i = 0; i < 52; i++) {
      listFullCard.push({
        value: i,
        disabled: false
      });
    }

    listFullCard.forEach(function (item, index) {
      if (listCardToSet.indexOf(item.value) > -1) {
        item.disabled = true;
      }
    });

    listPlayer.forEach(function (item, index) {
      var player =  _self.listPlayerCards.listPlayer.find(function (_item) {
        return _item.uuid == item.uuid;
      });
      item.cardList = player ? player.cardContainer.cardList : [];
//      item.cardList = item.isRoomMaster ? listCardToSet : [];
      if (isNaN(listCardToSet.length))
        return;
      var addCardsLength = _self.options.numberCardsInHand - item.cardList.length;
      if (addCardsLength > 0) {
        for (var i = 0; i < addCardsLength; i++) {
          addCardToPlayer(item.cardList);
        }
      }
    });

    function addCardToPlayer(cardList) {
      var remainingCards = listFullCard.filter(function (item) {
        return !item.disabled;
      });
      var cardItem = remainingCards[parseInt(Math.random() * remainingCards.length)];
      cardList.push(cardItem.value);
      var disabledCard = listFullCard.find(function (item) {
        return item.value == (cardItem && cardItem.value);
      });
      disabledCard && (disabledCard.disabled = true);
    }
    return listPlayer;
  };

  p.createWhiteVictoryList = function () {
    var whiteVictoryList = [
      "3s4c5h6d7s8c9h0djdqdkskdac", "3d3h4d5s6c7c8s9s0hjsqskcad", "3c4d5h6h7d8c9s0djcqskdas2d",
      "3s4d5d6d7c8d9d0sjcqckhac2s", "3h4s5s6d7s8c9h0h0sjcqdkdad", "3h4h5h6c6s7s8s9d0cjdqskdas",
      // 5 doi thong
      "4s4d5d5c6h6d7c7s8h8sjcjdkh", "6c6d7s7h8d8s9h9s0c0dadah2h", "3h5d8d8c9s9h0c0djsjdqcqd2s",
      "3d3s4s4d5d5c6h6d7c7sjdqckc", "6d6h7s7c8c8d9d9s0s0hacasad", "8s8c8h9s9h0s0cjsjcqdqhac2d",
      // 6 doi
      "4s4d5c5s7d7c8c8h9s9dkdkcas", "3c3h8s8h9s9c0s0dkhkcjdjh2s", "6s6h4c4d7s9s9dkckhasah2d2h",
      // Tu 2
      "3h4s5d6c8h9djhjcks2h2c2d2s", "4s4h6h8s8c9s0hjckd2s2c2h2d", "5s6c7c7h0h0cqdqckd2d2c2s2h",
      "3s4d6d6c7h9s0cjhqc2h2c2d2s", "3c3h4d5d6s0c0hkdks2s2c2h2d"];
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
    if (Math.random() < 0.5) {
      startId = parseInt(Math.random() * 11);
      for (var i = 0; i < 4; i++) {
        idList.push(startId * 4 + i)
      }
    } else {
      startId = parseInt(Math.random() * 9);
      for (var i = 0; i < 3; i++) {
        idList = idList.concat(getDoubleCards(startId + i))
      }
    }
    function getDoubleCards(id) {
      var returnArr = [];
      while (returnArr.length < 2) {
        var newItem = parseInt(Math.random() * 4) + id * 4;
        if (returnArr.indexOf(newItem) == -1) {
          returnArr.push(newItem)
        }
      }
      return returnArr;
    }
    return idList;
  };

  p.createHightCardsList = function () {
    var idList = [];
    var length = parseInt(this.options.numberCardsInHand * 2 / 3);

    while (idList.length < length) {
      var newItem = parseInt(36 + Math.random() * 16);
      if (idList.indexOf(newItem) == -1) {
        idList.push(newItem)
      }
    }
    return idList;
  };

  p.reSortDraftCards = function (data) {
    var userID = data.uuid;
    var Player = this.getPlayerByUuid(userID);
    var cardType = TWIST.Card.draftCard;
    if (!Player) {
      this.showError({code: 0});
      return;
    }
    if (Player.position == 0)
      return;
    if (Player.x < 100) {
      Player.showCardsDirection = "horizontal";
      Player.indexShowCardX = 0;
    } else {
      Player.showCardsDirection = "horizontal";
      Player.indexShowCardX = -300;
    }
    Player.handCards.children.sort(function (a, b) {
      return a.cardValue - b.cardValue;
    });
    Player.handCards.children.forEach(function (item, index) {
      item.set({
        scaleX: cardType.scale * 3 / 4,
        scaleY: cardType.scale * 3 / 4,
        x: Player.indexShowCardX + index * cardType.seperator * 3 / 4,
        y: 0
      })
    });
  };

  p.showPlayersCards = function (data) {
    var _self = this;
    var cardType = TWIST.Card.draftCard;
    var currentPlayer = this.getCurrentPlayer();
    currentPlayer.showPlayersCards = true;

    data.forEach(openPlayerCards);
    function openPlayerCards(itemData) {
      var player = _self.getPlayerByUuid(itemData.uuid);
      if (player.position == 0)
        return;
      player.clearHand();
//      if (player.x < 100 || player.x > 1000) {
//        player.showCardsDirection = "vertical";
//        player.indexShowCardY = -250;
//      } else {
//        player.showCardsDirection = "horizontal";
//        player.indexShowCardX = -300;
//      }

      if (player.x < 100) {
        player.showCardsDirection = "horizontal";
        player.indexShowCardX = 0;
      } else {
        player.showCardsDirection = "horizontal";
        player.indexShowCardX = -300;
      }
      itemData.cardList.sort(function (a, b) {
        return a - b;
      });
      itemData.cardList.forEach(function (item, index) {
        var card = new TWIST.Card(item);
        player.handCards.addChild(card);
        card.set({
          scaleX: cardType.scale * 3 / 4,
          scaleY: cardType.scale * 3 / 4,
          x: player.showCardsDirection == "vertical" ? 0 : (player.indexShowCardX + index * cardType.seperator * 3 / 4),
//          y: player.showCardsDirection == "vertical" ? (player.indexShowCardY + index * cardType.height * 2 / 3) : 0,
          y: 0
        })
      });
    }
  };

  p.showError = function (data) {
    var message = this.errorList[data.code];
    message = message || data.message;
    var errorItem = $('<div class="error-item">' + message + '</div>');
    $(errorItem).css({margin: "0 auto", display: "inline-block"});
    this.errorPanel.empty();
    this.errorPanel.append(errorItem);
    var _self = this;
    errorItem.one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function () {
      $(errorItem).remove();
    });
  };

  p.changeRoomMaster = function (data) {
    var oldRoomMasterPosition = this.roomMasterIcon.globalPosition;
    var uuid = data.uuid;
    var players = this.model.players || [];
    for (var i = 0, length = players.length; i < length; i++) {
      var player = players[i];
      var Player = this.getPlayerByUuid(player.uuid);
      if (player.uuid === uuid) {
        player.isRoomMaster = true;
        if (Player) {
          this.roomMasterIcon = Player.setRoomMaster(true, oldRoomMasterPosition);
        }
        if ((Player.uuid == this.userInfo.uuid) && (this.status == "STATUS_WAITING_FOR_START")) {
          this.startButton.show();
        } else {
          this.startButton.hide();
        }
      } else {
        player.isRoomMaster = false;
        if (Player)
          Player.setRoomMaster(false);
      }
    }
  };

  p.updateInfo = function (data) {
    var player = this.getPlayerDataByUuid(this.userInfo.uuid);
    $.extend(player, data);
    var Player = this.getPlayerByUuid(this.userInfo.uuid);
    var _self = this;
    if (Player) {
      $.extend(Player, data);
      Player.render();
    }
    if (this._listenChangeMoney) {
      this._listenChangeMoney = false;
      this.userMoney.runEffect(data.money);
    }
  };

  p.isolateUpdateMoney = function (data) {
    var players = data.players;
    var _self = this;
    players.forEach(function (item, index) {
      var playerData = _self.getPlayerDataByUuid(item.uuid);
      if (playerData) {
        playerData.money = parseInt(item.money);
        var Player = _self.getPlayerByUuid(item.uuid);
        if (Player) {
          Player.setMoney(playerData.money);
          var type = item.changeMoney < 0 ? "lose" : "win";
          Player.showMoneyExchageEffect(item.changeMoney, type);
        }
      }
    });
  };

  p.userChat = function (data) {
    var player = this.getPlayerByUuid(data.uuid);
    if (player) {
      player.showMessage(data.message);
    }
  };

  p.changeStatus = function (data) {
    this.desk.setRemainingTime(parseInt(data.remainingTime));
    this.status = this.statusList[data.newStatus];
    var func = this[this.status];
    if (typeof func === "function") {
      func.call(this);
    }
    this.emit("ping");
  };

  p.resetPlayerStatus = function (resetDefault) {
    var players = (this.playersContainer && this.playersContainer.children) || [];
    for (var i = 0, length = players.length; i < length; i++) {
      var player = players[i];
      var options = {};
      if (resetDefault)
        options.default = "";
      player.setPlayerStatus("", options);
    }
  };

  p.STATUS_WAITING_FOR_PLAYER = function () {
    this.buttonBar.hide();
  };

  p.STATUS_WAITING_FOR_START = function () {
    this.buttonBar.show();
    this.buttonBar.find('.button').hide();
    this.resetPlayerStatus(true);

    var playerData = this.getPlayerDataByUuid(this.userInfo.uuid);
    if (playerData && playerData.isRoomMaster) {
      this.startButton.show();
    }
  };

  p.STATUS_PLAYING = function () {
    this.buttonBar.show();
    this.buttonBar.find('.button').hide();
    var players = this.model.players || [];
    players.forEach(function (item, index) {
      item.status = "STATUS_PLAYING";
    });
    this.desk.clear();
    var players = this.playersContainer.children;
    for (var i = 0, length = players.length; i < length; i++) {
      var player = players[i];
      player.setPlayerStatus("");
    }
  };

  p.endGame = function (data) {

  };

  p.reconnect = function (data) {

  };

  p.addPlayer = function (data) {
    TWIST.Sound.play("inroomgame/join_room");
    var userPosition = this.userInfo.indexPosition;
    var playerPosition = data.indexPosition - userPosition;
    if (playerPosition < 0)
      playerPosition += this.options.maxPlayers;
    var config = this.desk.config;

    var currenConfig = {};
    for (var pro in config) {
      currenConfig[pro] = config[pro][playerPosition];
    }
    data.config = currenConfig;

    var playerPositions = this.desk.config.playerPositions;

    $.extend(data, playerPositions[playerPosition]);
    data.position = playerPosition;
    this.model.players.push(data);
    if (this.playersContainer.children.length < this.options.maxPlayers) {
      this.inviteList[playerPosition] && this.inviteList[playerPosition].hide();
      this.drawPlayer(data);
    }
  };

  p.drawPlayers = function () {
    var players = this.model.players || [];
    var _self = this;
    var userPosition = 0;
    players.forEach(function (item, index) {
      if (item.uuid === _self.userInfo.uuid) {
        userPosition = item.indexPosition;
        $.extend(_self.userInfo, item);
      }
    });
    players.sort(function (a, b) {
      var firstPosition = a.indexPosition - userPosition;
      if (firstPosition < 0) {
        firstPosition += _self.options.maxPlayers;
      }
      var seconPosition = b.indexPosition - userPosition;
      if (seconPosition < 0) {
        seconPosition += _self.options.maxPlayers;
      }
      return firstPosition - seconPosition;
    });

    var config = this.desk.config;

    players.forEach(function (item, index) {
      var currenConfig = {};
      item.position = item.indexPosition - userPosition;
      if (item.position < 0) {
        item.position += _self.options.maxPlayers;
      }
      for (var pro in config) {
        currenConfig[pro] = config[pro][item.position];
      }
      item.config = currenConfig;
      $.extend(item, config.playerPositions[item.position]);
    });

    var playerPositions = config.playerPositions;

    playerPositions.forEach(function (item, index) {
      var player = players.find(function (_item, _index) {
        return index == _item.position;
      });
      if (player) {
        _self.drawPlayer(player);
        _self.inviteList[index].hide();
      } else {
        _self.inviteList[index].show();
      }
    });
  };

  p.setPlayerTurn = function (uuid, remainingTime) {
    var totalTime = this.model.turningTime;
    var players = this.playersContainer.children;
    for (var i = 0, length = players.length; i < length; i++) {
      var player = players[i];
      if (player) {
        if (player.uuid === uuid) {
          player.setRemainingTime(remainingTime, totalTime);
        } else {
          player.clearTimer();
        }
      }
    }
  };

  p.drawPlayer = function (playerData) {
    playerData.config = playerData.config || {};
    $.extend(playerData, this.options.playerConfig);
    playerData.index = playerData.index || 0;

    var newPlayer = new TWIST.Player(playerData);
    this.playersContainer.addChild(newPlayer);

    if (playerData.isRoomMaster) {
      this.roomMasterIcon = newPlayer.setRoomMaster(true);
    }
    return newPlayer;
  };

  p.getPlayerByUuid = function (uuid) {
    var players = (this.playersContainer && this.playersContainer.children) || [];
    for (var i = 0, length = players.length; i < length; i++) {
      var player = players[i];
      if (player.uuid == uuid)
        return player;
    }
  };

  p.getPlayerDataByUuid = function (uuid) {
    var players = this.model.players || [];
    for (var i = 0, length = players.length; i < length; i++) {
      var player = players[i];
      if (player.uuid === uuid)
        return player;
    }
  };

  p.getCurrentPlayer = function (uuid) {
    var currentUuid = this.userInfo.uuid;
    return this.getPlayerByUuid(currentUuid);
  };

  p.removePlayerData = function (uuid) {
    var players = this.model.players || [];
    var index = players.length;
    for (var i = 0, length = players.length; i < length; i++) {
      var player = players[i];
      if (player.uuid === uuid) {
        index = i;
        break;
      }
    }
    players.splice(index, 1);
  };

  p.initResultPanel = function () {
    var _self = this;

    this.resultPanel = $(TWIST.HTMLTemplate['resultPanel/wrapper']);
    this.wrapper.append(this.resultPanel);

    var resultPanelCotainer = this.resultPanel.find('.container')[0];
    this.resultPanel.find('.container').css("height", "320px");
    this.resultPanel.hide();
    this.resultPanelScroll = new IScroll(resultPanelCotainer, {scrollX: true, freeScroll: true});
    this.resultPanelScroll.refresh();

    var closeButton = this.resultPanel.find('.close-popup');
    var popupMask = this.resultPanel.find('.global-mask');
    closeButton.on('click', function () {
      _self.resultPanel.hide();
    });
    popupMask.on('click', function () {
      _self.resultPanel.hide();
    });
  };

  p.showResult = function (resultData) {
    var _self = this;
    this.resultPanel.show();
    var resultIcon = this.resultPanel.find('.popup-icon');
    if (resultData.isWinner) {
      resultIcon.removeClass('lose');
    } else {
      resultIcon.addClass('lose');
    }

    var container = this.resultPanel.find('.container>div');
    container.empty();
    resultData.listPlayers.forEach(function (item, index) {
      var cardList = "";
      var cardListIndex = item.remainCards;
      cardListIndex.forEach(function (item, index) {
        var template = _.template(TWIST.HTMLTemplate['resultPanel/card']);
        var resultTemplate = template({
          id: item
        });
        cardList += resultTemplate;
      });

      var compiled = _.template(TWIST.HTMLTemplate['resultPanel/user']);
      var resultText = compiled({
        username: item.username,
        moneyChange: Global.numberWithDot(item.changeMoney),
        resultText: item.gameResultString,
        cardList: cardList,
        isWinnerClass: item.isWinner ? "winner-player" : ""
      });
      container.append($(resultText));
    });
    this.resultPanelScroll.refresh();
  };

  p.endIngameEvent = function () {
    this.desk.setRemainingTime(0);
    this.buttonBar.hide();
    this.errorPanel.empty();
  };

  p.updateUuid = function (data) {
    var username = data.username;
    if (!this.model || !this.model.players)
      return;
    var playerList = this.model.players;
    for (var i = 0, length = playerList.length; i < length; i++) {
      if (playerList[i].username === username) {
        playerList[i].uuid = data.uuid;
      }
    }
    var PlayerList = this.playersContainer.children;
    for (var i = 0, length = PlayerList.length; i < length; i++) {
      if (PlayerList[i].username === username) {
        PlayerList[i].uuid = data.uuid;
      }
    }
  };

  TWIST.InRoomGame = InRoomGame;

})();
