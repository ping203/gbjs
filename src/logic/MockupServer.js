this.FATE = this.FATE || {};

(function() {
	"use strict";
        
        var instanceServer;
        
	function MockupServer(cardsFire, card) {
              if(instanceServer) return instanceServer; 
              this.init();
	}
        
        var p = MockupServer.prototype;
        
        p.init = function(){
            this.rooms = [];
        };

        FATE.MockupServer = MockupServer;
})();