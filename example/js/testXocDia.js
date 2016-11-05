

(function () {
  "use strict";
  TWIST.Sound.init();
  var InstanceGame = new TWIST.XocDia('.wrapper');

  var mockupData = [{
      event: "userInfo",
      data: {
        username: "User Index 1",
        money: "11000",
        pot: {
          1000: "445555",
          10000: "4554522323",
          100000: "121212121"
        }
      },
      nextTime: 100
    }
    , {
      event: "gameInfo",
      data: {
        status: 3,
        bettingPositions: [{
            code: 0, //(0-chẵn, 1-lẻ, 2-4đen, 3-3đen, 4-4trắng, 5-3trắng, 6-2đenđỏ)
            //client (0-chẵn, 1-lẻ, 2-Bốn Trắng, 3-Bốn Đỏ, 4-Ba Trắng, 5-Ba đỏ, 6-2đenđỏ)
            totalBetting: 100,
            mineBetting: 299,
            ratio: 1
          },{
            code: 1,
            totalBetting: 101,
            mineBetting: 301,
            ratio: 1
          },{
            code: 2,
            totalBetting: 102,
            mineBetting: 302,
            ratio: 1
          },{
            code: 3,
            totalBetting: 103,
            mineBetting: 303,
            ratio: 1
          },{
            code: 4,
            totalBetting: 104,
            mineBetting: 304,
            ratio: 1
          },{
            code: 5,
            totalBetting: 105,
            mineBetting: 305,
            ratio: 1
          },{
            code: 6,
            totalBetting: 106,
            mineBetting: 306,
            ratio: 1
          }],
        remainingTime: 12,
        host: "tieukiemtien",
        betting: 5000
      },
      nextTime: 3000
    }
//        , {
//            event: "endSpin",
//            data: {
//                map: [1, 2, 3, 4, 5],
//                cardListRank: 3,
//                hightLightCards: [1, 1, 0, 1],
//                rankOfVerticalGroup: 2
//            },
//            nextTime: 2000
//        }
  ];

  var startTime = 0;
  var count = 0;



  mockupData.forEach(function (item, index) {

    var nextTime = item.nextTime || 1000;
    startTime += nextTime;

    setTimeout(function () {
      InstanceGame.emit(item.event, item.data);
    }, startTime);


  });




})();