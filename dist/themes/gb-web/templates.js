;(function() { window.TWIST = window.TWIST || {}; TWIST.HTMLTemplate = {'canvas':'<canvas class="gameCanvas" width="1280" height="720" ></canvas>',
'errorPanel':'<div class="error-panel">\r\n    \r\n</div>',
'buttonBar/callSamButton':'<div class="button fourth red" id="call-sam">B\xE1o s\xE2m</div>',
'buttonBar/eatCardButton':'<div class="button second red" id="eat-card">\u0102n</div>',
'buttonBar/entiretyButton':'<div class="button second red" id="entirety-card">\xD9</div>',
'buttonBar/foldSamButton':'<div class="button third blue" id="fold-sam">B\u1ECF s\xE2m</div>',
'buttonBar/foldTurnButton':'<div class="button fourth red" id="fold-turn">B\u1ECF l\u01B0\u1EE3t</div>\r\n',
'buttonBar/getCardButton':'<div class="button first red" id="get-card">B\xE1o s\xE2m</div>',
'buttonBar/hitButton':'<div class="button second yellow" id="hit-card">\u0110\xE1nh b\xE0i</div>',
'buttonBar/sendCardButton':'<div class="button second red" id="send-card">G\u1EEDi b\xE0i</div>',
'buttonBar/showPhomButton':'<div class="button second red" id="eat-card">H\u1EA1 b\xE0i</div>',
'buttonBar/sortCardButton':'<div class="button third blue" id="sort-card">X\u1EAFp x\u1EBFp</div>',
'buttonBar/startButton':'<div class="button first green" id="start-button">B\u1EAFt \u0111\u1EA7u</div>',
'buttonBar/wrapper':'<div class="button-bar"></div>',
'effect/explodePot':'<div class="explorer-pot">\n    <span class="effect"></span>\n    <span class="txt"></span>\n</div>\n<div class="money-falling">\n    <div class="text-light pos-1">\n        <i class="l-obj lobj-1"></i>\n        <i class="l-obj lobj-2"></i>\n        <i class="l-obj lobj-3"></i>\n        <i class="l-obj lobj-4"></i>\n        <i class="l-obj lobj-5"></i>\n        <i class="l-obj lobj-6"></i>\n        <i class="l-obj lobj-7"></i>\n        <i class="l-obj lobj-8"></i>\n    </div>\n    <div class="text-light pos-2">\n        <i class="l-obj lobj-1"></i>\n        <i class="l-obj lobj-2"></i>\n        <i class="l-obj lobj-3"></i>\n        <i class="l-obj lobj-4"></i>\n        <i class="l-obj lobj-5"></i>\n        <i class="l-obj lobj-6"></i>\n        <i class="l-obj lobj-7"></i>\n        <i class="l-obj lobj-8"></i>\n    </div>\n    <div class="text-light pos-3">\n        <i class="l-obj lobj-1"></i>\n        <i class="l-obj lobj-2"></i>\n        <i class="l-obj lobj-3"></i>\n        <i class="l-obj lobj-4"></i>\n        <i class="l-obj lobj-5"></i>\n        <i class="l-obj lobj-6"></i>\n        <i class="l-obj lobj-7"></i>\n        <i class="l-obj lobj-8"></i>\n    </div>\n    <div class="text-light pos-4">\n        <i class="l-obj lobj-1"></i>\n        <i class="l-obj lobj-2"></i>\n        <i class="l-obj lobj-3"></i>\n        <i class="l-obj lobj-4"></i>\n        <i class="l-obj lobj-5"></i>\n        <i class="l-obj lobj-6"></i>\n        <i class="l-obj lobj-7"></i>\n        <i class="l-obj lobj-8"></i>\n    </div>\n</div>',
'effect/wrapper':'<div class="effect"></div>',
'hightLow/bottom':'<div class="bottom">\n    <div class="profile-hight-low">\n\n    </div>\n    <div class="chips-hight-low">\n\n    </div>\n    <div class="new-turn-button">L\u01B0\u1EE3t m\u1EDBi</div>\n</div>\n',
'hightLow/center':'<div class="center">\n    <div class="text-support">Qu\xE2n b\xE0i ti\u1EBFp theo l\xE0 cao hay th\u1EA5p ?</div>\n    <div class="remain-time"></div>\n    <div class="canvas-wrapper">\n        <div class="game-button left-button">\n            <div class="low-button"></div>\n            <div class="low-value">0</div>\n        </div>\n        <div class="game-button right-button">\n            <div class="hight-button"></div>\n            <div class="hight-value">0</div>\n        </div>\n        <div class="virtual-card">\n            <div class="new-turn-text">\n                B\u1ED1c b\xE0i\n            </div>\n        </div>\n    </div>\n</div>\n',
'hightLow/top':'<div class="top">\n    <div class="pot">\n        <div class="title">H\u0169 th\u01B0\u1EDFng</div>\n        <div class="pot-value">0</div>\n    </div>\n    <div class="bank">\n        <div class="title">Bank</div>\n        <div class="bank-value">0</div>\n    </div>\n    <div class="pot-cards">\n        <div class="pot-card"></div>\n        <div class="pot-card"></div>\n        <div class="pot-card"></div>\n    </div>\n</div>\n',
'hightLow/wrapper':'<div class="hight-low"></div>\n',
'resultPanel/card':'<div class="card card<%- id %>"></div>',
'resultPanel/user':'<div class="result-item <%- isWinnerClass %>">\n    <div class="result-item-info"> \n        <div class="result-item-username"><%- username %> </div>\n        <div class="result-item-result-info">\n            <span class="result-item-money"><%- moneyChange %></span>\n            <div class="user-result-string"x><%- resultText %></div>\n        </div>\n    </div>\n    <div class="result-card-list-container">\n        <%= cardList %>\n    </div>\n</div>',
'resultPanel/wrapper':'<div class="game-result">\n    <div class="global-mask"></div>\n    <div class="game-result-popup">\n        <div class="popup-header">\n            <div class="popup-icon"></div> \n            <div class="close-popup">X</div>\n        </div>\n        <div class="popup-content">\n            <div class="container">\n                <div>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>',
'miniPoker/autospin':'<div class="autospin">\n    <input id="autospin" type="checkbox" />\n    <label for="autospin"></label>\n    <span>T\u1EF1 \u0111\u1ED9ng quay</span>\n</div>\n',
'miniPoker/button':'<div class="button-spin"></div>',
'miniPoker/chips':'<div class="chip-group">\n    <div class="chip violet">1K</div>\n    <div class="chip green">10k</div>\n    <div class="chip blue">100k</div>\n</div>\n',
'miniPoker/errorPanel':'<div class="error-panel-mini">\r\n    \r\n</div>',
'miniPoker/pot':'<div class="pot">\n    H\u0169 th\u01B0\u1EDFng\n    <div class="pot-value"></div>\n</div>',
'miniPoker/resultItem':'<div class="result-mini-item">\n    <span class="icon"></span>\n    <%- name %> \n    <div class="value"><%- value %> </div>\n</div>',
'miniPoker/resultTab':'<div class="result-mini-poker-tab"></div>',
'miniPoker/resultText':'<div class="result-text"></div>',
'miniPoker/sessionId':'<div class="session-id"></div>',
'miniPoker/user':'<div class="profile">\n    <div class="profile-left">\n        <div class="user avatar" ></div>\n    </div>\n    <div class="profile-right">\n        <div class="username "></div>\n        <div class="money "></div>\n    </div>\n</div>',
'miniPoker/winMoney':'<div class="win-money"></div>',
'miniPoker/wrapper':'<div class="mini-poker-bg"></div>\n',
'taiXiu/bettingPosition':'<div class="name"></div>\r\n<div class="ratio"></div>\r\n<div class="betting-number-wrapper">\r\n    <div class="betting-number-inner">\r\n        <div class="mine-betting">\r\n            5.00K\r\n        </div><div class="total-betting">\r\n            5.00M\r\n        </div>\r\n    </div>\r\n</div>\r\n',
'taiXiu/buttons':'<div class="button-bar taixiu-button-bar">\r\n    <div class="button blue  xocdia-button  button-bottom" id="cancelBetting">H\u1EE7y c\u01B0\u1EE3c</div>\r\n    <div class="button orange xocdia-button  button-bottom" id="sellOdd">B\xE1n c\u1EEDa</div>\r\n    <div class="button blue xocdia-button  button-bottom" id="resignation">H\u1EE7y c\xE1i</div>\r\n    <div class="button orange xocdia-button  button-top" id="reBetting">\u0110\u1EB7t l\u1EA1i</div>\r\n    <!--<div class="button blue button-top" id="sellEven">B\xE1n c\u1EEDa ch\u1EB5n</div>-->\r\n    <div class="button orange xocdia-button  button-top" id="getHost">Xin c\xE1i</div>\r\n</div>',
'taiXiu/changeMoney':'<div class="change-money"></div>\r\n',
'taiXiu/chips':'<div class="chip-group">\r\n    <div class="chip chip-1st">1</div>\r\n    <div class="chip chip-2nd">2</div>\r\n    <div class="chip chip-3rd">4</div>\r\n    <div class="chip chip-4th">10</div>\r\n</div>\r\n',
'taiXiu/coin-item':'<div class="coin-item"></div>',
'taiXiu/history-item':'<div class="history-item">\r\n    <div class="history-item-number"></div>\r\n    <div class="history-item-type"></div>\r\n    <div class="history-item-dices">\r\n        <div class="history-item-dice" id="dice-position0"></div>\r\n        <div class="history-item-dice" id="dice-position1"></div>\r\n        <div class="history-item-dice" id="dice-position2"></div>\r\n    </div>\r\n</div>\r\n',
'taiXiu/history':'<div class="taixiu-history">\r\n    <div class="taixiu-history-title">L\u1ECBch s\u1EED</div>\r\n    <div class="taixiu-history-content">\r\n        <div class="taixiu-history-content-inner"></div>\r\n    </div>\r\n</div> \r\n',
'taiXiu/host':'<div class="host-wrapper">\r\n    <div class="host-background"></div>\r\n    <div class="host">\r\n        <div class="host-name">\r\n            Doreamon\r\n        </div>\r\n        <div class="chat-box">\r\n            <div class="chat-box-inner">\r\n                Th\u1EDDi gian c\xE1i th\u1EEBa  thi\u1EBFu.  \r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>',
'taiXiu/listPlayer':'<div class="list-player"></div>',
'taiXiu/resultChip':'<div class="result-chip">\r\n    <div class="inner-chip">\r\n        \r\n    </div>\r\n</div>',
'taiXiu/sellPopup':'<div class="sell-popup">\r\n    <div class="sell-popup-background"></div>\r\n    <div class="sell-popup-center">\r\n        <div class="sell-popup-title"></div>\r\n        <div class="sell-popup-close"></div>\r\n        <div class="sell-popup-content">\r\n            <div class="sell-popup-minus"></div>\r\n            <div class="sell-popup-plus"></div>\r\n            <div class="sell-popup-dragbar" id="sell-popup-drag-container">\r\n                <div class="sell-popup-dragbar-inner"></div>\r\n                <div class="sell-popup-scroller" id="scroller"> \r\n                    <div class="sell-popup-scroller-content">\r\n                        0 V\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <div class="sell-popup-button-bar">\r\n                <div class="sell-popup-button" id="cancel">H\u1EE6Y B\u1ECE</div>\r\n                <div class="sell-popup-button" id="accept">\u0110\u1ED2NG \xDD</div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>',
'taiXiu/table':'<div class="table">\r\n    \r\n</div>',
'taiXiu/user':'<div class="profile">\r\n    <div class="profile-left">\r\n        <div>\r\n            <div class="username "></div>\r\n            <div class="money "></div>\r\n        </div>\r\n    </div>\r\n    <div class="profile-right">\r\n        <div class="user avatar avatar1" ></div>\r\n    </div>\r\n</div>',
'taiXiu/vitualBetting':'<div class="vitual-betting-position">\r\n</div>\r\n',
'taiXiu/wrapper':'<div class="taixiu-wrapper"></div>',
'videoPoker/doubleButton':'<div class="button-spin double-button"></div>',
'videoPoker/getWinButton':'<div class="get-win-button">\n    Nh\u1EADn th\u01B0\u1EDFng\n</div>',
'videoPoker/moveChip':'<div class="move-chip">\n    <i class="chip1"></i>\n    <i class="chip2"></i>\n    <i class="chip3"></i>\n    <i class="chip4"></i>\n    <i class="chip5"></i>\n    <i class="chip6"></i>\n    <i class="chip7"></i>\n    <i class="chip8"></i>\n</div>',
'videoPoker/supportText':'<div class="support-text"></div>',
'videoPoker/virtualCards':'<div class="virtualCards">\n    <div class="card vitualCard1">\n        \n    </div>\n    <div class="card vitualCard2">\n        \n    </div>\n    <div class="card vitualCard3">\n        \n    </div>\n    <div class="card vitualCard4">\n        \n    </div>\n    <div class="card vitualCard5">\n        \n    </div>\n</div>',
'videoPoker/wrapper':'<div class="mini-poker-bg video-poker"></div>\n',
'xocDia/bettingPosition':'<div class="betting-position">\r\n    <div class="coin-tittle"></div>\r\n    <div class="name"></div>\r\n    <div class="mine-betting">\r\n        0\r\n    </div>\r\n    <div class="total-betting">\r\n        0\r\n    </div>\r\n</div>\r\n',
'xocDia/buttons':'<div class="button-bar xocdia-button-bar">\r\n    <div class="button blue xocdia-button button-bottom" id="cancelBetting">H\u1EE7y c\u01B0\u1EE3c</div>\r\n    <div class="button orange xocdia-button button-bottom" id="sellOdd">B\xE1n c\u1EEDa l\u1EBD</div>\r\n    <div class="button blue xocdia-button button-bottom" id="resignation">H\u1EE7y c\xE1i</div>\r\n    <div class="button orange xocdia-button button-top" id="reBetting">\u0110\u1EB7t l\u1EA1i</div>\r\n    <div class="button orange xocdia-button button-top" id="sellEven">B\xE1n c\u1EEDa ch\u1EB5n</div>\r\n    <div class="button orange xocdia-button button-top" id="getHost">Xin c\xE1i</div>\r\n</div>',
'xocDia/changeMoney':'<div class="change-money"></div>\r\n',
'xocDia/chips':'<div class="chip-group">\r\n    <div class="chip chip-1st">1</div>\r\n    <div class="chip chip-2nd">2</div>\r\n    <div class="chip chip-3rd">4</div>\r\n    <div class="chip chip-4th">10</div>\r\n</div>\r\n',
'xocDia/coin-item':'<div class="coin-item"></div>',
'xocDia/history':'<div class="history-wrapper">\r\n    <div class="history-odd"></div>\r\n    <div class="history-event"></div>\r\n    <div class="history">\r\n    </div>\r\n</div>\r\n',
'xocDia/host':'<div class="host-wrapper">\r\n    <div class="host-background"></div>\r\n    <div class="host">\r\n        <div class="host-name">\r\n            Doreamon\r\n        </div>\r\n        <div class="chat-box">\r\n            <div class="chat-box-inner">\r\n                Th\u1EDDi gian c\xE1i th\u1EEBa  thi\u1EBFu.  \r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>',
'xocDia/listPlayer':'<div class="list-player"></div>',
'xocDia/resultChip':'<div class="result-chip">\r\n    <div class="inner-chip">\r\n        \r\n    </div>\r\n</div>',
'xocDia/sellPopup':'<div class="sell-popup">\r\n    <div class="sell-popup-background"></div>\r\n    <div class="sell-popup-center">\r\n        <div class="sell-popup-title"></div>\r\n        <div class="sell-popup-close"></div>\r\n        <div class="sell-popup-content">\r\n            <div class="sell-popup-minus"></div>\r\n            <div class="sell-popup-plus"></div>\r\n            <div class="sell-popup-dragbar" id="sell-popup-drag-container">\r\n                <div class="sell-popup-dragbar-inner"></div>\r\n                <div class="sell-popup-scroller" id="scroller"> \r\n                    <div class="sell-popup-scroller-content">\r\n                        0 V\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <div class="sell-popup-button-bar">\r\n                <div class="sell-popup-button" id="cancel">H\u1EE6Y B\u1ECE</div>\r\n                <div class="sell-popup-button" id="accept">\u0110\u1ED2NG \xDD</div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>',
'xocDia/user':'<div class="profile">\r\n    <div class="profile-left">\r\n        <div>\r\n            <div class="username "></div>\r\n            <div class="money "></div>\r\n        </div>\r\n    </div>\r\n    <div class="profile-right">\r\n        <div class="user avatar avatar1" ></div>\r\n    </div>\r\n</div>',
'xocDia/vitualBetting':'<div class="vitual-betting-position">\r\n</div>\r\n',
'xocDia/wrapper':'<div class="xocdia-wrapper"></div>',}})();