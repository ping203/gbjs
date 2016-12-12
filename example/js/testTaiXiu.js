

(function () {
  "use strict";
  TWIST.Sound.init();
  var InstanceGame = new TWIST.TaiXiu('.wrapper');

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
        bettingPositions: (function () {
          var bettingPositions = [];
          for (var i = 0; i < 31; i++) {
            bettingPositions.push({
              id: i,
              totalBetting: parseInt(Math.random() * 2000),
              mineBetting: parseInt(Math.random() * 200),
              ratio: parseInt(Math.random() * 100)
            });
          }
          return bettingPositions;
        })(),
        remainingTime: 12,
        host: {
          uuid: "1",
          username: "hahaa"
        },
        betting: 100,
        listBettingChip: [{
            id: 0,
            value: parseInt(Math.random() * 10000)
          }, {
            id: 1,
            value: parseInt(Math.random() * 10000)
          }, {
            id: 2,
            value: parseInt(Math.random() * 10000)
          }, {
            id: 3,
            value: parseInt(Math.random() * 10000)
          }]
      },
      nextTime: 1000
    }
//    , {
//      event: "updateBettings",
//      data: [{
//          id: 0,
//          totalBetting: 100360
//        }, {
//          id: 1,
//          totalBetting: 150140
//        }, {
//          id: 2,
//          totalBetting: 170250
//        }, {
//          id: 3,
//          totalBetting: 140360
//        }, {
//          id: 4,
//          totalBetting: 190470
//        }, {
//          id: 5,
//          totalBetting: 413050
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
//    , {
//      event: "changeStatus",
//      data: {
//        newStatus: 3
//      },
//      nextTime: 1000
//    }
//    , {
//      event: "changeStatus",
//      data: {
//        newStatus: 4
//      },
//      nextTime: 1000
//    }
//    , {
//      event: "changeStatus",
//      data: {
//        newStatus: 5
//      },
//      nextTime: 1000
//    }
    , {
      event: "openDisk",
      data: {
        map: [0, 1, 0],
        winnerSlots: (function(){
          var returnArr = [];
          for(var i = 0; i < 31; i ++){
            returnArr[i] = i;
          }
          return returnArr;
        })()
      },
      nextTime: 100
    },
//    , {
//      event: "historyToggle",
//      data: {},
//      nextTime: 1000
//    },
//    , {
//      event: "historyToggle",
//      data: {},
//      nextTime: 2000
//    },
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
    , {
      event: "changeHost",
      data: {
        uuid: "3",
        username: "dgdg"
      },
      nextTime: 10000
    }
  ];

  var startTime = 0;
  var count = 0;

  InstanceGame.on("cancelBetting", function (data) {
    setTimeout(function () {
      InstanceGame.emit("updateInfo", {
        money: Math.random() * 100000
      });
      InstanceGame.emit("cancelBettingResult", [
        {
          id: 0,
          totalBetting: Math.random() * 10000
        }
        , {
          id: 1,
          totalBetting: Math.random() * 10000
        }
        , {
          id: 2,
          totalBetting: Math.random() * 10000
        }
        , {
          id: 3,
          totalBetting: Math.random() * 10000
        }
        , {
          id: 4,
          totalBetting: Math.random() * 10000
        }
        , {
          id: 5,
          totalBetting: Math.random() * 10000
        }
        , {
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
          totalBetting: Math.random() * 100,
          mineBetting: Math.random() * 10
        }
        , {
          id: 1,
          totalBetting: Math.random() * 1000,
          mineBetting: Math.random() * 100
        }
        , {
          id: 2,
          totalBetting: Math.random() * 1000,
          mineBetting: Math.random() * 1000
        }
        , {
          id: 3,
          totalBetting: Math.random() * 10000,
          mineBetting: Math.random() * 1000
        }
        , {
          id: 4,
          totalBetting: Math.random() * 10000,
          mineBetting: Math.random() * 1000
        }
        , {
          id: 5,
          totalBetting: Math.random() * 10000,
          mineBetting: Math.random() * 1000
        }
        , {
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