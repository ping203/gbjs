



function Game(socket) {
	var self = this;
	/**
	 * @protected
	 * @type {Array}
	 */
	this.users = [{
		avatar: "avatar/p/png",
		username: "demo1",
		position: 1,
		money: 100000
	}];






	/**
	 * @protected
	 * @type {Number}
	 */
	this.maxUser = 5;

	/**
	 * Stage
	 * @type {createjs.Stage}
	 */
	this.stage = new createjs.Stage("testCanvas");

	/**
	 * Hands
	 * @type {gbjs.HandContainer}
	 */
	this.hands = new gbjs.HandContainer({

	});

	/**
	 * Desk
	 * @type {gbjs.DeskContainer}
	 */
	this.desk = new gbjs.DeskContainer({

	});


	function addUser(user) {
		// body...
	}


	this.stage.addChild(this.desk);
	this.stage.addChild(this.hands);

	createjs.Ticker.addEventListener("tick", function() {
		self.stage.update();
	});
}





var game = new Game();