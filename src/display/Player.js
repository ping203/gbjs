/**
 * @module Container
 */
this.gbjs = this.gbjs || {};

(function() {
	"use strict";


	/**
	 * Player
	 * @param {String} username
	 * @param {Avatar} avatar
	 * @param {Money} money
	 */
	function Player(username, avatar, money) { 
		this.Container_constructor();
		/**
		 * @property
		 * @type {gbjs.TextUsername}
		 */
		this.username = new gbjs.TextUsername(username);
		/**
		 * @property
		 * @type {gbjs.BitmatAvatar}
		 */
		this.avatar = new gbjs.BitmapAvatar(avatar);
		/**
		 * @property
		 * @type {gbjs.TextMoney}
		 */
		this.money = new gbjs.TextMoney(money);


		this.addChild(this.username);
		this.addChild(this.avatar);
		this.addChild(this.money);
	}

	var p = createjs.extend(Player, createjs.Container);


	gbjs.Player = createjs.promote(Player, "Container");

})();