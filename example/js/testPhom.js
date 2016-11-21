

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
//        , {
//            event: "error",
//            data: {
//                cardList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
//                message: 'Hhihihihi'
//            },
//            nextTime: 1000
//        }
//        , {
//            event: "hitTurn",
//            data: {
//                username : "tieuteiei",
//                uuid : "1",
//            },
//            nextTime: 1000
//        }
//        , {
//            event: "userChat",
//            data: {
//                username : "tieuteiei",
//                uuid : "1",
//                message : 'Hhihihihidgdgdgd dfgsdgsdg'
//            },
//            nextTime: 1000
//        }
//        , {
//            event: "draftCards",
//            data: {
//                username : "tieuteiei",
//                uuid : "1",
//                cardIndex : '1'
//            },
//            nextTime: 1000
//        }
    , {
      event: "draftCards",
      data: {
        username: "tieuteiei",
        uuid: "2",
        cardIndex: '2'
      },
      nextTime: 1000
    }
    , {
      event: "moveDraftCard",
      data: {
        fromPlayer: "2",
        toPlayer: "1",
        cardIndex: '2'
      },
      nextTime: 1000
    }
    , {
      event: "draftCards",
      data: {
        username: "tieuteiei",
        uuid: "1",
        cardIndex: '3'
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
//        , {
//            event: "draftCards",
//            data: {
//                username : "tieuteiei",
//                uuid : "4",
//                cardIndex : '4'
//            },
//            nextTime: 1000
//        }
//    , {
//      event: "getTurn",
//      data: {
//        username: "tieuteiei",
//        uuid: "1"
//      },
//      nextTime: 1000
//    }
//        , {
//            event: "getCardComplete",
//            data: {
//                username : "tieuteiei",
//                uuid : "1",
//                cardIndex : 20
//            },
//            nextTime: 1000
//        }
//        , {
//            event: "enableEatCard",
//            data: {
//                username: "tieuteiei",
//                uuid: "1",
//                cardIndex: 20
//            },
//            nextTime: 1000
//        }
//        , {
//            event: "hitTurn",
//            data: {
//                username: "tieuteiei",
//                uuid: "1",
//            }
//        }
//        , {
//            event: "enableU",
//            data: {
//                uuid: "1"
//            },
//            nextTime: 1000
//        }
//        , {
//            event: "hitTurn",
//            data: {
//                username: "tieuteiei",
//                uuid: "1",
//            }
//        }
//        , {
//            event: "enableShowPhom",
//            data: {
//                uuid: "1"
//            },
//            nextTime: 1000
//        }
//        , {
//            event: "enableSendCard",
//            data: {
//                uuid: "1"
//            },
//            nextTime: 1000
//        }
    , {
      event: "draftCards",
      data: {
        username: "tieuteiei",
        uuid: "2",
        cardIndex: 15
      },
      nextTime: 1000
    }
    , {
      event: "draftCards",
      data: {
        username: "tieuteiei",
        uuid: "1",
        cardIndex: 6
      },
      nextTime: 1000
    }
    , {
      event: "draftCards",
      data: {
        username: "tieuteiei",
        uuid: "2",
        cardIndex: 45
      },
      nextTime: 1000
    }
    , {
      event: "draftCards",
      data: {
        username: "tieuteiei",
        uuid: "1",
        cardIndex: 7
      },
      nextTime: 1000
    }
    , {
      event: "eatCardSuccess",
      data: {
        username: "tieuteiei",
        hitPlayer: "2",
        eatPlayer: "1",
        cardIndex: "45",
        listPhom: [[1, 2, 4, 6, 15]]
      }
    }
//        , {
//            event: "eatCardSuccess",
//            data: {
//                username: "tieuteiei",
//                hitPlayer: "3",
//                eatPlayer: "4",
//                cardIndex: 6
//            }
//        }
//        , {
//            event: "moveDraftCard",
//            data: {
//                username: "tieuteiei",
//                fromPlayer: "3",
//                toPlayer: "1",
//                cardIndex: 3
//            }
//        }
//        , {
//            event: "moveDraftCard",
//            data: {
//                username: "tieuteiei",
//                fromPlayer: "3",
//                toPlayer: "1",
//                cardIndex: 6
//            }
//        }
//    , {
//      event: "showPhomComplete",
//      data: {
//        username: "tieuteiei",
//        uuid: "1",
//        phoms: [[1, 2, 4, 6, 15]],
//        cardIndex: "3"
//      },
//      nextTime: 1000
//    }
//    , {
//      event: "hitTurn",
//      data: {
//        username: "tieuteiei",
//        uuid: "1"
//      },
//      nextTime: 1000
//    }
//        , {
//            event: "showPhomComplete",
//            data: {
//                username: "tieuteiei",
//                uuid: "4",
//                phoms: [[1, 2, 3, 6], [4, 5, 6], [7, 8, 9]],
//                cardIndex: "3"
//            }
//        }
//        , {
//            event: "showPhomComplete",
//            data: {
//                username: "tieuteiei",
//                uuid: "3",
//                phoms: [[1, 2, 3, 6], [4, 5, 6], [7, 8, 9]],
//                cardIndex: "3"
//            }
//        }
//        , {
//            event: "showPhomComplete",
//            data: {
//                username: "tieuteiei",
//                uuid: "2",
//                phoms: [[1, 2, 3, 6], [4, 5, 6], [7, 8, 9]],
//                cardIndex: "3"
//            }
//        }
//        , {
//            event: "sendCard",
//            data: {
//                cardsSend: [{
//                      transFrom : "1",
//                      transTo : "2",
//                      cardIndex : 1
//                }
//                ,{
//                      transFrom : "1",
//                      transTo : "3",
//                      cardIndex : 2
//                }
//                ,{
//                      transFrom : 1,
//                      transTo : 4,
//                      cardIndex : 3
//                }
//            ]
//            }
//        }

//        , {
//            event: "entiretyCard",
//            data: {
//                username: "tieuteiei",
//                uuid: "1",
//                phoms: [[1, 2, 3]],
//                cardIndex: "3"
//            }
//        }

//    , {
//      event: "endGame",
//      data: {
//        isWinner: false,
//        listPlayers: [{
//            playerResult: "Vô địch",
//            changeMoney: 4333,
//            money: 40000,
//            remainCards: [3, 5, 7],
//            totalPoint: 2,
//            uuid: "1",
//            showPoint: true,
//            username: "tieutieuhiepoe"
//          }]
//      }
//    }
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