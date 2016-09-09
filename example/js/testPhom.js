

(function () {
    "use strict";
    var game = new TWIST.PhomGame('.wrapper');

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
                        money: "11000"
                    },{
                        uuid: "2",
                        username: "User Index 2",
                        money: "16000"
                    }]
            },
            nextTime: 1000
        }
    ];

    var startTime = 0;
    var count = 0;

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


    mockupData.forEach(function (item, index) {

        var nextTime = item.nextTime || 1000;
        startTime += nextTime;

        setTimeout(function () {
            game.emit(item.event, item.data);
        }, startTime);


    });




})();