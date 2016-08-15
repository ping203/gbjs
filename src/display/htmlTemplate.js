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
                                    <div class="result-item">\n\
                                                \n\
                                    </div>\n\
                                </div>\n\
                            </div>\n\
                        </div>\n\
                    </div>\n\
                </div>',
            user: '<div class="result-item">\n\
                    \n\
                    </div>',
            info: '<div class="result-item-info"> </div>',
            username: '<div class="result-item-username"></div>',
            resultInfo: '<div class="result-item-result-info"></div>',
            moneyChange : '<span class="result-item-money"></span>',
            resultText : ' <div class="user-result-string" ng-class="user.subMoney < 0 ? \'red-color\' : \'green - color\'"> </div>',
            cardList: '<div class="result-card-list-container">\n\
                            <div class="result-item-card-list">\n\
                            </div>\n\
                        </div>',
            card: '<div class="card"></div>'
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
        errorPanel: '<div class="error-panel" style="position: absolute;left: 200px; top : 200px; text-align: center; width: 600px"></div>'
    };
    TWIST.HTMLTemplate = HTMLTemplate;
})();
