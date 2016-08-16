/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

this.TWIST = this.TWIST || {};
(function () {
    "use strict";
    var HTMLTemplate = {
        canvas: '<canvas id="testCanvas" width="1000" height="580" ></canvas>',
        resultPanel: {
            wrapper: '<div class="game-result">\n\
                    <div class="global-mask"></div>\n\
                    <div class="game-result-popup">\n\
                        <div class="popup-header">\n\
                            <div class="popup-icon"></div> \n\
                            <div class="close-popup">X</div>\n\
                        </div>\n\
                        <div class="popup-content">\n\
                            <div class="container">\n\
                                <div>\n\
                                </div>\n\
                            </div>\n\
                        </div>\n\
                    </div>\n\
                </div>',
            user: '<div class="result-item <%- isWinnerClass %>">\n\
                        <div class="result-item-info"> \n\
                                <div class="result-item-username"><%- username %> </div>\n\
                                <div class="result-item-result-info">\n\
                                    <span class="result-item-money"><%- moneyChange %></span>\n\
                                    <div class="user-result-string" ng-class="user.subMoney < 0 ? \'red-color\' : \'green - color\'"><%- resultText %></div>\n\
                                </div>\n\
                        </div>\n\
                        <div class="result-card-list-container">\n\
                            <%= cardList %>\n\
                        </div>\n\
                    </div>',
            card: '<div class="card card<%- id %>"></div>'
        },
        buttonBar: {
            wrapper: '<div class="button-bar"></div>',
            startButton: '<div class="button fist green" id="start-button">Bắt đầu</div>',
            hitButton: '<div class="button second yellow" id="hit-card">Đánh bài</div>',
            sortCardButton: '<div class="button third blue" id="sort-card">Xắp xếp</div>',
            foldTurnButton: '<div class="button fourth red" id="fold-turn">Bỏ lượt</div>',
            callSamButton: '<div class="button fourth red" id="call-sam">Báo sâm</div>',
            foldSamButton: '<div class="button third blue" id="fold-sam">Bỏ sâm</div>'
        },
        errorPanel: '<div class="error-panel" style="position: absolute;left: 200px; top : 200px; text-align: center; width: 600px"></div>',
        miniPokerTemplate : '<div class="mini-poker-wrapper"></div>'
    };
    TWIST.HTMLTemplate = HTMLTemplate;
})();
