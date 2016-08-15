/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

this.TWIST = this.TWIST || {};
        (function () {
        "use strict";
                TWIST.CSS = "@keyframes error-remove {\n\
    0%{\n\
        opacity: 1;\n\
    }\n\
\n\
    80%{\n\
        opacity:0.3;\n\
        font-size:40px;\n\
    }\n\
    100%{\n\
        opacity:0;\n\
        font-size:3px;\n\
    }\n\
}\n\
.twist .wrapper{\n\
  -webkit-touch-callout: none;\n\
  -webkit-user-select : none;\n\
  font-family: Roboto;\n\
}\n\
.twist .error-item {\n\
    margin: 20px auto 0;\n\
    animation-name : error-remove;\n\
    animation-duration : 3s;\n\
    animation-timing-function : linear;\n\
    animation-iteration-count : 1;\n\
    font-size: 40px;\n\
    color: #ffea02;\n\
    font-style: italic;\n\
}\n\
.twist .button-bar{\n\
    position: absolute;\n\
    left:  0;\n\
    width: 100%;\n\
    bottom: 80px;\n\
    text-align: center;\n\
    color: white;\n\
    top: 0;\n\
}\n\
.twist .button{\n\
    display: inline-block;\n\
    border : 1px solid;\n\
    border-radius : 5px;\n\
    line-height: 38px;\n\
    font-size: 16px;\n\
    vertical-align: middle;\n\
    text-align: center;\n\
    width: 118px;\n\
    margin-right: 8px;\n\
    font-weight: bold;\n\
    cursor: pointer;\n\
    color: white;\n\
    transition: text-shadow 0.3s linear,color 0.3s linear;\n\
    text-transform: uppercase;\n\
    position: absolute;\n\
    bottom: 0;\n\
}\n\
.twist .button.fist{\n\
    right: 100px;\n\
}\n\
.twist .button.second{\n\
    right: 235px;\n\
}\n\
.twist .button.third{\n\
    right: 370px;\n\
}\n\
.twist .button.fourth{\n\
    right: 505px;\n\
}\n\
.twist .button.red{\n\
    color:  rgba(255,118,118,0.5);\n\
    border-color:  rgb(255,118,118);\n\
    background-image: linear-gradient(rgba(255,118,118,0.1),transparent,rgba(255,118,118,0.1));\n\
    text-shadow : 0 0 20px rgba(255,255,255,0.5), 0 0 20px rgba(255,118,118,0.5);\n\
}\n\
.twist .button.red:active{\n\
    color : rgba(255,255,255,0.5);\n\
    text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px #fff, 0 0 20px rgba(255,118,118,0.5), \n\
        0 0 35px rgba(255,118,118,0.5), 0 0 40px rgba(255,118,118,0.5), 0 0 50px rgba(255,118,118,0.5), 0 0 75px rgba(255,118,118,0.5);\n\
}\n\
.twist .button.blue{\n\
    color:  rgba(32,187,252,0.5);\n\
    border-color:  rgba(32,187,252,0.5);\n\
    background-image: linear-gradient(rgba(32,187,252,0.1),transparent,rgba(32,187,252,0.1));\n\
    text-shadow : 0 0 20px rgba(32,187,252,0.5), 0 0 20px rgba(32,187,252,0.5);\n\
}\n\
.twist .button.blue:active{\n\
    color : rgba(255,255,255,0.5);\n\
    text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px #fff, 0 0 20px rgba(32,187,252,0.5), \n\
        0 0 35px rgba(32,187,252,0.5), 0 0 40px rgba(32,187,252,0.5), 0 0 50px rgba(32,187,252,0.5), 0 0 75px rgba(32,187,252,0.5);\n\
}\n\
.twist .button.yellow{\n\
    color:  rgba(254,206,47,0.5);\n\
    border-color:  rgba(254,206,47,0.5);\n\
    background-image: linear-gradient(rgba(254,206,47,0.1),transparent,rgba(254,206,47,0.1));\n\
    text-shadow : 0 0 20px rgba(254,206,47,0.5), 0 0 20px rgba(254,206,47,0.5);\n\
    margin-left: 0;\n\
}\n\
.twist .button.yellow:active{\n\
    color : rgba(255,255,255,0.5);\n\
    text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px #fff, 0 0 20px rgba(254,206,47,0.5), \n\
        0 0 35px rgba(254,206,47,0.5), 0 0 40px rgba(254,206,47,0.5), 0 0 50px rgba(254,206,47,0.5), 0 0 75px rgba(254,206,47,0.5);\n\
}\n\
.twist .button.green{\n\
    color:  rgba(20,210,50,0.5);\n\
    border-color:  rgba(20,210,50,0.5);\n\
    background-image: linear-gradient(rgba(20,210,50,0.1),transparent,rgba(20,210,50,0.1));\n\
    text-shadow : 0 0 20px rgba(20,210,50,0.5), 0 0 20px rgba(20,210,50,0.5);\n\
}\n\
.twist .button.green:active{\n\
    color : rgba(255,255,255,0.5);\n\
    text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px #fff, 0 0 20px rgba(20,210,50,0.5), \n\
        0 0 35px rgba(20,210,50,0.5), 0 0 40px rgba(20,210,50,0.5), 0 0 50px rgba(20,210,50,0.5), 0 0 rgba(20,210,50,0.5);\n\
}\n\
.twist .game-result {\n\
    position: absolute;\n\
    top: 0;\n\
    left: 0;\n\
    width: 100%;\n\
    height: 100%;\n\
}\n\
.twist .global-mask {\n\
    position: absolute;\n\
    top: 0;\n\
    left: 0;\n\
    right: 0;\n\
    bottom: 0;\n\
    background-color: rgba(0,0,0,0.5);\n\
}\n\
.twist .game-result-popup {\n\
    width: 80%;\n\
    margin: 0 auto;\n\
    margin-top: 10%;\n\
    min-height: 200px;\n\
    background-color: #131E28;\n\
    border-radius: 10px;\n\
    box-shadow: 1px 1px 5px #1476fb,-1px 1px 5px #1476fb,1px -1px 5px #1476fb,-1px -1px 5px #1476fb;\n\
}\n\
.twist .popup-header {\n\
    position: relative;\n\
    min-height: 50px;\n\
}\n\
.twist .popup-icon {\n\
    position: absolute;\n\
    left: calc(50% - 90px);\n\
    top: -60px;\n\
    width: 180px;\n\
    height: 120px;\n\
    background-image: url(http://localhost/gbjs/src/inner/images/resultPanel/win.png);\n\
}\n\
.twist .popup-icon.lose {\n\
    background-image: url(http://localhost/gbjs/src/inner/images/resultPanel/lose.png);\n\
}\n\
.twist .close-popup {\n\
    position: absolute;\n\
    line-height: 30px;\n\
    width: 30px;\n\
    color: #c4e1ff;\n\
    cursor: pointer;\n\
    right: 5px;\n\
    top: 5px;\n\
    font-size: 20px;\n\
}";
                var css = $("<style>" + TWIST.CSS + "</style>").appendTo("head");
        })();
