/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

this.TWIST = this.TWIST || {};
        (function () {
        "use strict";
                var CSS = "@keyframes error-remove {\n\
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
.twist .wrapper,.twist.wrapper{\n\
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
    position: relative;\n\
    width: 80%;\n\
    margin: 0 auto;\n\
    margin-top: 10%;\n\
    min-height: 200px;\n\
    background-color: #131E28;\n\
    border-radius: 10px;\n\
    box-shadow: 1px 1px 5px #1476fb,-1px 1px 5px #1476fb,1px -1px 5px #1476fb,-1px -1px 5px #1476fb;\n\
}\n\
.twist .game-result-popup .container{\n\
    overflow: hidden;\n\
    margin: 10px;\n\
    width: calc(100% - 20px);\n\
}\n\
.twist .popup-header {\n\
    position: relative;\n\
    min-height: 40px;\n\
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
}\n\
.twist .result-item {\n\
//    height: 60px;\n\
    width: 90%;\n\
    border-bottom: 1px solid #1d384f;\n\
    text-align: left;\n\
    white-space: nowrap;\n\
    font-size: 16px;\n\
    color: white;\n\
    font-weight: bold;\n\
    margin: 0 auto;\n\
    padding: 10px 0;\n\
}\n\
.twist .result-item:last-child{\n\
    border-bottom: none;\n\
}\n\
.twist .result-item-info {\n\
    display: inline-block;\n\
    width: 40%;\n\
    line-height: 30px;\n\
}\n\
.twist .result-item-username {\n\
    width: 40%;\n\
    display: inline-block;\n\
    overflow: hidden;\n\
    text-overflow: ellipsis;\n\
    vertical-align: top;\n\
}\n\
.twist .result-item-result-info {\n\
    display: inline-block;\n\
    vertical-align: top;\n\
    width: calc(60% - 4px);\n\
}\n\
.twist span.result-item-money {\n\
    font-size: 20px;\n\
    text-shadow: 0 0 15px rgba(20,118,251,1);\n\
}\n\
.twist .user-result-string {\n\
    color: #93c6fd;\n\
}\n\
.twist .winner .result-item-username,.winner .user-result-string {\n\
    color : #fedc32;\n\
}\n\
.twist .winner span.result-item-money{\n\
    text-shadow: 0 0 15px #fec52e;\n\
}\n\
.twist .result-card-list-container {\n\
    display: inline-block;\n\
    width: calc(60% - 4px);\n\
    vertical-align: top;\n\
    height: 60px;\n\
    text-align: right;\n\
}\n\
.twist .card{\n\
    width: 45.91px;\n\
    height: 60px;\n\
    vertical-align: top;\n\
    display: inline-block;\n\
    margin-left: -10px;\n\
    background-size: cover;\n\
}\n\
.twist .card0{background-image: url(http://localhost/gbjs/src/inner/images/card/8.png)}\n\
.twist .card1{background-image: url(http://localhost/gbjs/src/inner/images/card/9.png)}\n\
.twist .card2{background-image: url(http://localhost/gbjs/src/inner/images/card/10.png)}\n\
.twist .card3{background-image: url(http://localhost/gbjs/src/inner/images/card/11.png)}\n\
.twist .card4{background-image: url(http://localhost/gbjs/src/inner/images/card/12.png)}\n\
.twist .card5{background-image: url(http://localhost/gbjs/src/inner/images/card/13.png)}\n\
.twist .card6{background-image: url(http://localhost/gbjs/src/inner/images/card/14.png)}\n\
.twist .card7{background-image: url(http://localhost/gbjs/src/inner/images/card/15.png)}\n\
.twist .card8{background-image: url(http://localhost/gbjs/src/inner/images/card/16.png)}\n\
.twist .card9{background-image: url(http://localhost/gbjs/src/inner/images/card/17.png)}\n\
.twist .card10{background-image: url(http://localhost/gbjs/src/inner/images/card/18.png)}\n\
.twist .card11{background-image: url(http://localhost/gbjs/src/inner/images/card/19.png)}\n\
.twist .card12{background-image: url(http://localhost/gbjs/src/inner/images/card/20.png)}\n\
.twist .card13{background-image: url(http://localhost/gbjs/src/inner/images/card/21.png)}\n\
.twist .card14{background-image: url(http://localhost/gbjs/src/inner/images/card/22.png)}\n\
.twist .card15{background-image: url(http://localhost/gbjs/src/inner/images/card/23.png)}\n\
.twist .card16{background-image: url(http://localhost/gbjs/src/inner/images/card/24.png)}\n\
.twist .card17{background-image: url(http://localhost/gbjs/src/inner/images/card/25.png)}\n\
.twist .card18{background-image: url(http://localhost/gbjs/src/inner/images/card/26.png)}\n\
.twist .card19{background-image: url(http://localhost/gbjs/src/inner/images/card/27.png)}\n\
.twist .card20{background-image: url(http://localhost/gbjs/src/inner/images/card/28.png)}\n\
.twist .card21{background-image: url(http://localhost/gbjs/src/inner/images/card/29.png)}\n\
.twist .card22{background-image: url(http://localhost/gbjs/src/inner/images/card/30.png)}\n\
.twist .card23{background-image: url(http://localhost/gbjs/src/inner/images/card/31.png)}\n\
.twist .card24{background-image: url(http://localhost/gbjs/src/inner/images/card/32.png)}\n\
.twist .card25{background-image: url(http://localhost/gbjs/src/inner/images/card/33.png)}\n\
.twist .card26{background-image: url(http://localhost/gbjs/src/inner/images/card/34.png)}\n\
.twist .card27{background-image: url(http://localhost/gbjs/src/inner/images/card/35.png)}\n\
.twist .card28{background-image: url(http://localhost/gbjs/src/inner/images/card/36.png)}\n\
.twist .card29{background-image: url(http://localhost/gbjs/src/inner/images/card/37.png)}\n\
.twist .card30{background-image: url(http://localhost/gbjs/src/inner/images/card/38.png)}\n\
.twist .card31{background-image: url(http://localhost/gbjs/src/inner/images/card/39.png)}\n\
.twist .card32{background-image: url(http://localhost/gbjs/src/inner/images/card/40.png)}\n\
.twist .card33{background-image: url(http://localhost/gbjs/src/inner/images/card/41.png)}\n\
.twist .card34{background-image: url(http://localhost/gbjs/src/inner/images/card/42.png)}\n\
.twist .card35{background-image: url(http://localhost/gbjs/src/inner/images/card/43.png)}\n\
.twist .card36{background-image: url(http://localhost/gbjs/src/inner/images/card/44.png)}\n\
.twist .card37{background-image: url(http://localhost/gbjs/src/inner/images/card/45.png)}\n\
.twist .card38{background-image: url(http://localhost/gbjs/src/inner/images/card/46.png)}\n\
.twist .card39{background-image: url(http://localhost/gbjs/src/inner/images/card/47.png)}\n\
.twist .card40{background-image: url(http://localhost/gbjs/src/inner/images/card/48.png)}\n\
.twist .card41{background-image: url(http://localhost/gbjs/src/inner/images/card/49.png)}\n\
.twist .card42{background-image: url(http://localhost/gbjs/src/inner/images/card/50.png)}\n\
.twist .card43{background-image: url(http://localhost/gbjs/src/inner/images/card/51.png)}\n\
.twist .card44{background-image: url(http://localhost/gbjs/src/inner/images/card/0.png)}\n\
.twist .card45{background-image: url(http://localhost/gbjs/src/inner/images/card/1.png)}\n\
.twist .card46{background-image: url(http://localhost/gbjs/src/inner/images/card/2.png)}\n\
.twist .card47{background-image: url(http://localhost/gbjs/src/inner/images/card/3.png)}\n\
.twist .card48{background-image: url(http://localhost/gbjs/src/inner/images/card/4.png)}\n\
.twist .card49{background-image: url(http://localhost/gbjs/src/inner/images/card/5.png)}\n\
.twist .card50{background-image: url(http://localhost/gbjs/src/inner/images/card/6.png)}\n\
.twist .card51{background-image: url(http://localhost/gbjs/src/inner/images/card/7.png)}";
        TWIST.initCSS = function(){
            var re = /http:\/\/localhost\/gbjs\/src\/inner\/images\//g;
            var res = CSS.replace(re, TWIST.imagePath);
            $("<style>" + res + "</style>").appendTo("head");
        }
                
        })();
