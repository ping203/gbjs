

(function () {
    "use strict";
//    TWIST.imagePath = location.origin + location.pathname + "../src/images/";
    var TLMNDemlaGame = new TWIST.SamGame('.wrapper');

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
            event: "changeStatus",
            data: {
                newStatus: 1
            },
            nextTime: 100
        }, {
            event: "gameInfo",
            data: {
                players: [{
                        uuid: 1,
                        username: "User Index 1",
                        money: "1000",
                        indexPosition: 1,
                        isRoomMaster: true,
                        numberCardsInHand : 8
                    }
//                    , {
//                        uuid: 2,
//                        username: "User Index 2",
//                        money: "2000",
//                        indexPosition: 0,
//                        isRoomMaster: false,
//                        numberCardsInHand : 8
//                    }, {
//                        uuid: 3,
//                        username: "User Index 5555555555555555555",
//                        money: "3000",
//                        indexPosition: 2,
//                        isRoomMaster: false,
//                        numberCardsInHand : 8
//                    }
                ],
                playingPlayer: {
                    uuid: 1,
                    remainingTime: 10000
                },
                userListCard : [5,6,7,8,1,2,3,4],
                lastDraftCards : [10,11,12]
            },
            nextTime: 100
        }
        , {
            event: "userJoin",
            data: {
                uuid: 4,
                username: "User Index 4",
                money: "11000",
                indexPosition: 0
            },
            nextTime: 1000
        }
        , {
            event: "changeStatus",
            data: {
                newStatus: 2
            },
            nextTime: 100
        }
        , {
            event: "dealCards",
            data: {
                cardList : [5,6,7,8,1,2,3,4]
            },
            nextTime: 100
        }
        , {
            event: "error",
            data: {
                code: 0
            },
            nextTime: 100
        }, {
            event: "changeMaster",
            data: {
                uuid: 2
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
        }, 
//        {
//            event: "hitTurn",
//            data: {
//                uuid: 3
//            },
//            nextTime: 2000
//        }, {
//            event: "draftCards",
//            data: {
//                uuid: 1,
//                cardList: [1, 2, 3, 4, 5]
//            },
//            nextTime: 1000
//        }, {
//            event: "draftCards",
//            data: {
//                uuid: 3,
//                cardList: [24, 25]
//            },
//            nextTime: 1000
//        }, {
//            event: "updateUuid",
//            data: {
//                uuid: 6,
//                username: "User Index 4"
//            },
//            nextTime: 1000
//        }, {
//            event: "changeStatus",
//            data: {
//                newStatus: 5
//            },
//            nextTime: 1000
//        }, 
        {
            event: "endGame",
            data: {
                winType: 1,
                listPlayers: [{
                        remainCards: [1, 2, 3],
                        changeMoney: 1000,
                        money: 5000,
                        uuid: 1
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