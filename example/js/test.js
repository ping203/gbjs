

(function () {
    "use strict";
    TWIST.imagePath = location.origin + location.pathname + "/../src/images/";
    var TLMNDemlaGame = new TWIST.TLMNDemlaGame('.wrapper');

    var mockupData = [{
            event: "userInfo",
            data: {
                uuid: 1,
                username: "User Index 1",
                money: "11000",
                position: 3
            },
            nextTime: 100
        }, {
            event: "gameInfo",
            data: {
                players: [{
                        uuid: 1,
                        username: "User Index 1",
                        money: "1000",
                        position: 0,
                        isRoomMaster: true
                    }, {
                        uuid: 2,
                        username: "User Index 2",
                        money: "2000",
                        position: 2,
                        isRoomMaster: false
                    }, {
                        uuid: 3,
                        username: "User Index 5555555555555555555",
                        money: "3000",
                        position: 1,
                        isRoomMaster: false
                    }]
            },
            nextTime: 100
        }, {
            event: "userJoin",
            data: {
                uuid: 4,
                username: "User Index 4",
                money: "11000",
                position: 3
            },
            nextTime: 100
        }, {
            event: "userQuit",
            data: {
                uuid: 2
            },
            nextTime: 100
        }, {
            event: "error",
            data: {
                code: 0
            },
            nextTime: 100
        }, {
            event: "changeMaster",
            data: {
                uuid: 1
            },
            nextTime: 100
        }, {
            event: "isolateUpdateoney",
            data: {
                players: [{
                        uuid: 3,
                        changeMoney: 1000
                    }, {
                        uuid: 1,
                        changeMoney: -1000
                    }]
            },
            nextTime: 100
        }, {
            event: "changeStatus",
            data: {
                newStatus: 1
            },
            nextTime: 100
        }, {
            event: "changeStatus",
            data: {
                newStatus: 3
            },
            nextTime: 100
        }, {
            event: "changeStatus",
            data: {
                newStatus: 4
            },
            nextTime: 1000
        }, {
            event: "dealCards",
            data: {
                players: [{
                        uuid: 3,
                        handCards: []
                    }, {
                        uuid: 1,
                        handCards: [1, 2, 3, 4, 5, 6, 7, 8, 9, 40, 41, 42, 43]
                    }]
            },
            nextTime: 100
        }, {
            event: "hitTurn",
            data: {
                uuid: 1
            },
            nextTime: 100
        }, {
            event: "draftCards",
            data: {
                uuid: 1,
                cardList: [1, 2, 3, 4, 5]
            },
            nextTime: 1000
        }, {
            event: "hitTurn",
            data: {
                uuid: 3
            },
            nextTime: 100
        }, {
            event: "draftCards",
            data: {
                uuid: 3,
                cardList: [24, 25]
            },
            nextTime: 1000
        }, {
            event: "updateUuid",
            data: {
                uuid: 6,
                username: "User Index 4"
            },
            nextTime: 1000
        }, {
            event: "changeStatus",
            data: {
                newStatus: 5
            },
            nextTime: 1000
        }, {
            event: "endGame",
            data: {
                winType: 1,
                listPlayers: [{
                        remainCards: [1, 2, 3],
                        changeMoney: 1000,
                        money: 5000,
                        uuid : 1
                    }]
            },
            nextTime: 1000
        }];

    var startTime = 0;

    mockupData.forEach(function (item, index) {

        var nextTime = item.nextTime || 1000;
        startTime += nextTime;

        setTimeout(function () {
            TLMNDemlaGame.emit(item.event, item.data);
        }, startTime);


    });

    TLMNDemlaGame.on("start", function () {
        console.log("start");
    });


})();