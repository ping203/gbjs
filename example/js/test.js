

(function () {
    "use strict";
    var MiniPoker = new TWIST.MiniPoker('.wrapper');

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
            event: "updatePots",
            data: {
                pots: {
                    1000: "445555",
                    10000: "4554522323",
                    100000: "121212121"
                }
            },
            nextTime: 1000
        }
        , {
            event: "updateMoney",
            data: {
                newMoney: "445565",
                winMoney: "4554522"
            },
            nextTime: 3000
        }
        , {
            event: "endSpin",
            data: {
                map: [1, 2, 3, 4, 5],
                cardListRank: 3,
                hightLightCards: [1, 1, 0, 1],
                rankOfVerticalGroup: 2
            },
            nextTime: 2000
        }
    ];

    var startTime = 0;

    mockupData.forEach(function (item, index) {

        var nextTime = item.nextTime || 1000;
        startTime += nextTime;

        setTimeout(function () {
            MiniPoker.emit(item.event, item.data);
        }, startTime);


    });




})();