(function () {
    var wrapper = $('.twist .logo');

    var firstT = wrapper.find('.first-t');

    var wCharacter = wrapper.find('.w-character');

    var iCharacter = wrapper.find('.i-character');

    var sCharacter = wrapper.find('.s-character');

    var seconT = wrapper.find('.second-t');

    function initFirstT() {
        firstT.hightLight = function () {
            this.find('');
        };
        firstT.top = firstT.find('.top');
        firstT.top = firstT.find('.left');
        firstT.top = firstT.find('.right');
        firstT.top = firstT.find('.bottom');
    }
    
    function initAnimation() {
        var firstAnimation = {}
        
    }
    
    initFirstT();
    
    firstT.hightLight();


})();