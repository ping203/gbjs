

(function () {
  "use strict";
  TWIST.Sound.init();
  var InstanceGame = new TWIST.XocDia('.wrapper');

  var mockupData = [{
      event: "userInfo",
      data: {
        username: "User Index 1",
        money: "14000",
        uuid: "1"
      },
      nextTime: 100
    }
    , {
      event: "gameInfo",
      data: {
        status: 3,
        bettingPositions: [{
            id: 0, //(0-chẵn, 1-lẻ, 2-4đen, 3-3đen, 4-4trắng, 5-3trắng, 6-2đenđỏ)
            //client (0-chẵn, 1-lẻ, 2-Bốn Trắng, 3-Bốn Đỏ, 4-Ba Trắng, 5-Ba đỏ, 6-2đenđỏ)
            totalBetting: 1003,
            mineBetting: 299,
            ratio: 1
          }, {
            id: 1,
            totalBetting: 1014,
            mineBetting: 301,
            ratio: 1
          }, {
            id: 2,
            totalBetting: 1025,
            mineBetting: 302,
            ratio: 1
          }, {
            id: 3,
            totalBetting: 1036,
            mineBetting: 303,
            ratio: 1
          }, {
            id: 4,
            totalBetting: 1047,
            mineBetting: 304,
            ratio: 1
          }, {
            id: 5,
            totalBetting: 1305,
            mineBetting: 305,
            ratio: 1
          }, {
            id: 6,
            totalBetting: 155,
            mineBetting: 306,
            ratio: 1
          }],
        remainingTime: 12,
        host: {
          uuid: "2",
          username: "hahaa"
        },
        betting: 100,
        listBettingChip : [{
            id : 0,
            value : 400
        },{
            id : 1,
            value : 500
        },{
            id : 2,
            value : 600
        },{
            id : 3,
            value : 700
        }]
      },
      nextTime: 1000
    }
//    , {
//      event: "updateBettings",
//      data: [{
//          id: 0,
//          totalBetting: 10036
//        }, {
//          id: 1,
//          totalBetting: 15014
//        }, {
//          id: 2,
//          totalBetting: 17025
//        }, {
//          id: 3,
//          totalBetting: 14036
//        }, {
//          id: 4,
//          totalBetting: 19047
//        }, {
//          id: 5,
//          totalBetting: 41305
//        }, {
//          id: 6,
//          totalBetting: 15506
//        }],
//      nextTime: 1000
//    }
//    , {
//      event: "userBetting",
//      data: {
//        totalBetting: Math.random() * 10600,
//        mineBetting: Math.random() * 3611,
//        id: 0
//      },
//      nextTime: 1000
//    }
//    , {
//      event: "cancelBettingResult",
//      data: {},
//      nextTime: 1000
//    }
//    , {
//      event: "error",
//      data: {
//        code: 2545,
//        message: "Hhihihii"
//      },
//      nextTime: 1000
//    }
//    , {
//      event: "changeStatus",
//      data: {
//        newStatus: 2
//      },
//      nextTime: 1000
//    }
    , {
      event: "changeStatus",
      data: {
        newStatus: 3
      },
      nextTime: 1000
    }
//    , {
//      event: "changeStatus",
//      data: {
//        newStatus: 4
//      },
//      nextTime: 1000
//    }
    , {
      event: "changeStatus",
      data: {
        newStatus: 5
      },
      nextTime: 100
    }
    , {
      event: "openDisk",
      data: {
        map: [0, 1, 0, 1],
        winnerSlots: [1, 2]
      },
      nextTime: 100
    },
//    , {
//      event: "hostPayment",
//      data: {
//        money: Math.random() * 20000,
//        changeMoney: (Math.random() - 0) * 4000,
//        slotWinMoneys: [{
//            id: 0,
//            money: Math.random() * 2000,
//          }, {
//            id: 1,
//            money: Math.random() * 2000,
//          }, {
//            id: 2,
//            money: Math.random() * 2000,
//          }, {
//            id: 3,
//            money: Math.random() * 2000,
//          }, {
//            id: 4,
//            money: Math.random() * 2000,
//          }, {
//            id: 5,
//            money: Math.random() * 2000,
//          }, {
//            id: 5,
//            money: Math.random() * 2000,
//          }]
//      },
//      nextTime: 100
//    }
//    , {
//      event: "changeHost",
//      data: {
//        uuid: "3",
//        username: "dgdg"
//      },
//      nextTime: 20000
//    }
  ];

  var startTime = 0;
  var count = 0;

  InstanceGame.on("cancelBetting", function (data) {
    setTimeout(function () {
      InstanceGame.emit("updateInfo", {
        money: Math.random() * 100000
      });
      InstanceGame.emit("cancelBettingResult",[
        {
          id: 0,
          totalBetting: Math.random() * 10000
        }
        ,{
          id: 1,
          totalBetting: Math.random() * 10000
        }
        ,{
          id: 2,
          totalBetting: Math.random() * 10000
        }
        ,{
          id: 3,
          totalBetting: Math.random() * 10000
        }
        ,{
          id: 4,
          totalBetting: Math.random() * 10000
        }
        ,{
          id: 5,
          totalBetting: Math.random() * 10000
        }
        ,{
          id: 7,
          totalBetting: Math.random() * 10000
        }
      ]);
    }, 50);
    count++;
  });


  InstanceGame.on("reBetting", function (data) {
    setTimeout(function () {
      InstanceGame.emit("updateInfo", {
        money: Math.random() * 100000
      });
      InstanceGame.emit("reBettingResult", [
        {
          id: 0,
          totalBetting: Math.random() * 10000,
          mineBetting: Math.random() * 1000
        }
        ,{
          id: 1,
          totalBetting: Math.random() * 10000,
          mineBetting: Math.random() * 1000
        }
        ,{
          id: 2,
          totalBetting: Math.random() * 10000,
          mineBetting: Math.random() * 1000
        }
        ,{
          id: 3,
          totalBetting: Math.random() * 10000,
          mineBetting: Math.random() * 1000
        }
        ,{
          id: 4,
          totalBetting: Math.random() * 10000,
          mineBetting: Math.random() * 1000
        }
        ,{
          id: 5,
          totalBetting: Math.random() * 10000,
          mineBetting: Math.random() * 1000
        }
        ,{
          id: 7,
          totalBetting: Math.random() * 10000,
          mineBetting: Math.random() * 1000
        }
      ]);
    }, 50);
    count++;
  });


  InstanceGame.on("betting", function (data) {
    setTimeout(function () {
      InstanceGame.emit("updateInfo", {
        money: Math.random() * 100000
      });
      InstanceGame.emit("userBetting", {
        totalBetting: Math.random() * 10600,
        mineBetting: Math.random() * 30600,
        id: data.slotBettingId
      });
    }, 100);
    count++;
  });

  mockupData.forEach(function (item, index) {

    var nextTime = item.nextTime || 1000;
    startTime += nextTime;

    setTimeout(function () {
      InstanceGame.emit(item.event, item.data);
    }, startTime);

  });




})();