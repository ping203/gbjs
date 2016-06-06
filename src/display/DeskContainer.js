/**
 * @module Container
 */
this.gbjs = this.gbjs || {};

(function() {
	"use strict";


	function DeskContainer() {
		this.Container_constructor();
		/**
		 * @property
		 * @type {gbjs.Player}
		 */
		this.hero = new gbjs.Player();

		/**
		 * @property
		 * @type {gbjs.ChairContainer}
		 */
		this.chair = new gbjs.ChairContainer();
		this.chair.addChildAt(this.hero, 0);
		this.addChild(this.chair);
	}


	var p = createjs.extend(DeskContainer, createjs.Container);


	gbjs.DeskContainer = createjs.promote(DeskContainer, "Container");

})();