

(function () {
    "use strict";
    TWIST.Sound.init();
    var game = new TWIST.TinyHightLowGame('.wrapper');

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
    ];

    var startTime = 0;
    var count = 0;

    game.emit("updatePots", {
        pots: {
            1000: 445555 + count * 1000,
            10000: 4554522323 + count * 10000,
            100000: 121212121 + count * 100000
        }
    });
    setInterval(function () {
        game.emit("updatePots", {
            pots: {
                1000: 445555 + count * 1000,
                10000: 4554522323 + count * 10000,
                100000: 121212121 + count * 100000
            }
        });
        count++;
    }, 1000);

    game.on("start", function (betting) {
        setTimeout(function () {
            game.emit("getFirstCard", {
                cardId: parseInt(Math.random() * 52),
                isPotCard: true,
                lowMoney: betting * Math.random() * 13,
                hightMoney: betting * Math.random() * 13,
                currentBetting: betting
            });
        });
    });

    game.on("choose", function (isHight) {
        setTimeout(function () {
            game.emit("newCard", {
                cardId: parseInt(Math.random() * 52),
                isPotCard: Math.random() * 13 < 1,
                lowMoney: 0,
                hightMoney: 2000 * Math.random() * 13,
                currentBetting: 2000 * (Math.random()),
                explorerPot: false
            });
        }, 50);
        count++;
    });

    game.on("newTurn", function (isHight) {
        setTimeout(function () {
            game.emit("getWin", {
                winMoney: 2000 * (Math.random() - 0.5)
            });
        }, 50);
        count++;
    });


    mockupData.forEach(function (item, index) {

        var nextTime = item.nextTime || 1000;
        startTime += nextTime;

        setTimeout(function () {
            game.emit(item.event, item.data);
        }, startTime);


    });




})();