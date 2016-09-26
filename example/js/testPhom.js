

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
                        money: "11000",
                        indexPosition: 1,
                        isRoomMaster: true
                    }, {
                        uuid: "2",
                        username: "User Index 2",
                        money: "16000",
                        indexPosition: 3
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
                cardList : [0,1,2,3,4,5,6,7,8],
                firstPlayer : {
                    uuid : "2"
                }
            },
            nextTime: 1000
        }
        , {
            event: "error",
            data: {
                cardList : [0,1,2,3,4,5,6,7,8],
                message : 'Hhihihihi'
            },
            nextTime: 1000
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
            game.emit(item.event, item.data);
        }, startTime);


    });




})();