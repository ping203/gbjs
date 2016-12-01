

(function () {
  "use strict";
  var game = new TWIST.BaCayGame('.wrapper');

  var mockupData = [{
      event: "userInfo",
      data: {
        uuid: "1",
        username: "User Index 1",
        money: "11000"
      },
      nextTime: 100
    }
    , {
      event: "gameInfo",
      data: {
        players: [{
            uuid: "1",
            username: "User Index 1",
            money: "11000",
            indexPosition: 1,
            isRoomMaster: true
          }, {
            uuid: "2",
            username: "User Index 2",
            money: "16000",
            indexPosition: 3
          }, {
            uuid: "3",
            username: "User Index 3",
            money: "16000",
            indexPosition: 2
          }, {
            uuid: "4",
            username: "User Index 4",
            money: "16000",
            indexPosition: 0
          }]
      },
      nextTime: 1000
    }
    , {
      event: "changeStatus",
      data: {
        newStatus: "1"
      },
      nextTime: 1000
    }
    , {
      event: "changeStatus",
      data: {
        newStatus: "2"
      },
      nextTime: 1000
    }
    , {
      event: "dealCards",
      data: {
        cardList: [0, 1, 2, 13, 4, 5, 6, 7, 16],
        firstPlayer: {
          uuid: "2"
        },
        listPhom: [[0, 1, 2], [4, 5, 6, 7]]
      },
      nextTime: 1000
    }
        , {
            event: "error",
            data: {
                cardList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                message: 'Hhihihihi'
            },
            nextTime: 1000
        }
    , {
      event: "isolateUpdateMoney",
      data: {
        players: [{
            uuid : '1',
            money : "456",
            changeMoney : 1000
        },{
            uuid : '2',
            money : "456",
            changeMoney : -1000
        }]
      },
      nextTime: 1000
    }


    , {
      event: "endGame",
      data: {
        isWinner: false,
        listPlayers: [{
            playerResult: "Vô địch",
            changeMoney: 4333,
            money: 40000,
            remainCards: [3, 5, 7],
            totalPoint: 2,
            uuid: "1",
            showPoint: true,
            username: "tieutieuhiepoe"
          }]
      }
    }
  ];

  var startTime = 0;
  var count = 0;

  game.on("start", function (betting) {

  });


  mockupData.forEach(function (item, index) {

    var nextTime = item.nextTime || 1000;
    startTime += nextTime;

    setTimeout(function () {
      console.log("item.event, item.data",item.event, item.data);
      game.emit(item.event, item.data);
    }, startTime);


  });




})();